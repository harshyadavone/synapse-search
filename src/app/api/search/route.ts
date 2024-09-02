import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_API_KEY, GOOGLE_CX } from "@/config";
import { cache } from "@/utils/cache";
import { fetch } from "undici";

interface BaseSearchItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
}

interface WebSearchItem extends BaseSearchItem {
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    cse_thumbnail?: Array<{ src: string; width: string; height: string }>;
    metatags?: Array<{ [key: string]: string }>;
    cse_image?: Array<{ src: string }>;
    hcard?: Array<{
      url_text?: string;
      bday?: string;
      fn?: string;
      nickname?: string;
      label?: string;
      url?: string;
      role?: string;
    }>;
  };
  // ?: Hcard[]
}

interface ImageSearchItem extends BaseSearchItem {
  mime: string;
  fileFormat: string;
  snippet: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

type SearchItem = WebSearchItem | ImageSearchItem;

interface CustomWebSearchItem extends BaseSearchItem {
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  thumbnailUrl?: string;
  thumbnailWidth?: string;
  thumbnailHeight?: string;
  imageUrl?: string;
  datePublished?: string;
  author?: string;
  description?: string;
  site_name?: string;
  metadata?: WebsiteMetadata;
  hcard?: Hcard;
}

type WebsiteMetadata = {
  title: string;
  description: string | undefined;
  ogImage: string | undefined;
};

type Hcard = {
  url_text?: string;
  bday?: string;
  fn?: string;
  nickname?: string;
  label?: string;
  url?: string;
  role?: string;
};

interface CustomImageSearchItem extends BaseSearchItem {
  mime: string;
  fileFormat: string;
  contextLink: string;
  imageHeight: number;
  imageWidth: number;
  byteSize: number;
  thumbnailLink: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
  datePublished?: string;
  author?: string;
  snippet?: string;
}

interface SearchResponse {
  kind: string;
  url: { type: string; template: string };
  queries: {
    request: Array<{ totalResults: string; searchTerms: string }>;
    nextPage?: Array<{ startIndex: number }>;
  };
  context: { title: string };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: SearchItem[];
}

const CONCURRENT_REQUESTS = 10;

async function processItems(
  items: SearchItem[],
  type: string
): Promise<(CustomWebSearchItem | CustomImageSearchItem)[]> {
  const processItem = async (
    item: SearchItem
  ): Promise<CustomWebSearchItem | CustomImageSearchItem> => {
    if (type === "image") {
      const imageItem = item as ImageSearchItem;
      return {
        title: imageItem.title,
        htmlTitle: imageItem.htmlTitle,
        link: imageItem.link,
        displayLink: imageItem.displayLink,
        mime: imageItem.mime,
        fileFormat: imageItem.fileFormat,
        contextLink: imageItem.image.contextLink,
        imageHeight: imageItem.image.height,
        imageWidth: imageItem.image.width,
        byteSize: imageItem.image.byteSize,
        thumbnailLink: imageItem.image.thumbnailLink,
        thumbnailHeight: imageItem.image.thumbnailHeight,
        thumbnailWidth: imageItem.image.thumbnailWidth,
        snippet: imageItem.snippet,
      } as CustomImageSearchItem;
    } else {
      const webItem = item as WebSearchItem;
      return {
        title: webItem.title,
        htmlTitle: webItem.htmlTitle,
        link: webItem.link,
        displayLink: webItem.displayLink,
        snippet: webItem.snippet,
        htmlSnippet: webItem.htmlSnippet,
        formattedUrl: webItem.formattedUrl,
        htmlFormattedUrl: webItem.htmlFormattedUrl,
        thumbnailUrl: webItem.pagemap?.cse_thumbnail?.[0]?.src,
        thumbnailWidth: webItem.pagemap?.cse_thumbnail?.[0]?.width,
        thumbnailHeight: webItem.pagemap?.cse_thumbnail?.[0]?.height,
        imageUrl: webItem.pagemap?.cse_image?.[0]?.src,
        datePublished: webItem.pagemap?.metatags?.[0]?.["date"],
        author: webItem.pagemap?.metatags?.[0]?.["author"],
        description:
          webItem.pagemap?.metatags?.[0]?.["og:description"] ||
          webItem.pagemap?.metatags?.[0]?.["description"],
        site_name: webItem.pagemap?.metatags?.[0]?.["og:site_name"],
        metadata: {
          title: webItem.pagemap?.metatags?.[0]?.["og:title"],
          description: webItem.pagemap?.metatags?.[0]?.["og:description"],
          ogImage: webItem.pagemap?.metatags?.[0]?.["og:image"],
        },
        hcard: webItem.pagemap?.hcard?.[0],
      } as CustomWebSearchItem;
    }
  };

  const results: (CustomWebSearchItem | CustomImageSearchItem)[] = [];
  for (let i = 0; i < items.length; i += CONCURRENT_REQUESTS) {
    const chunk = items.slice(i, i + CONCURRENT_REQUESTS);
    const chunkResults = await Promise.all(chunk.map(processItem));
    results.push(...chunkResults);
  }
  return results;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "searchTypeUndefined";
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const cacheKey = `search:${q}:${type}:${page}`;

  try {
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const RESULTS_PER_PAGE = 10;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=${type}&q=${encodeURIComponent(
        q
      )}&start=${(page - 1) * RESULTS_PER_PAGE + 1}&num=${RESULTS_PER_PAGE}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchResponse = (await response.json()) as SearchResponse;

    const customizedResults = await processItems(data.items, type);

    const result = {
      searchInformation: data.searchInformation,
      items: customizedResults,
      pagination: {
        currentPage: page,
        totalResults: parseInt(data.searchInformation.totalResults, 10),
        resultsPerPage: RESULTS_PER_PAGE,
        hasNextPage: data.queries.nextPage !== undefined,
      },
    };

    await cache.set(cacheKey, JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching search results:", error);

    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error instanceof Response) {
      try {
        const errorData = await error.json();
        const { error: apiError } = errorData;

        if (apiError) {
          const { code, message, status } = apiError;

          switch (status) {
            case "RESOURCE_EXHAUSTED":
              errorMessage = message.includes("dailyLimitExceeded")
                ? "Daily quota for Google search API has been exceeded"
                : "API quota has been exhausted";
              statusCode = 429;
              break;
            case "PERMISSION_DENIED":
              errorMessage =
                "Permission denied. Please check API key and permissions";
              statusCode = 403;
              break;
            case "INVALID_ARGUMENT":
              errorMessage = "Invalid request parameters";
              statusCode = 400;
              break;
            default:
              errorMessage = message || "An error occurred with the Google API";
              statusCode = code || error.status || 500;
          }
        }
      } catch (jsonError) {
        errorMessage = "An error occurred while processing the API response";
        statusCode = error.status || 500;
      }
    } else if (error instanceof Error) {
      if (error.message.includes("dailyLimitExceeded")) {
        errorMessage = "Google search API daily limit exceeded";
        statusCode = 429;
      } else {
        errorMessage = "A network error occurred while fetching search results";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
