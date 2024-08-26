import { NextResponse } from "next/server";
import { fetch } from "undici";
import { LRUCache } from "lru-cache";

interface SuggestionResponse {
  0: string;
  1: string[];
  2: unknown[];
  3: {
    "google:suggestsubtypes": unknown[][][];
  };
}

// Create a cache with a maximum of 100 items that expire after 5 minutes
const cache = new LRUCache<string, string[]>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return new NextResponse('Missing "q" query parameter', { status: 400 });
    }

    // Check if we have cached results for this query
    const cachedSuggestions = cache.get(query);
    if (cachedSuggestions) {
      return NextResponse.json(cachedSuggestions);
    }

    const response = await fetch(
      `https://www.google.com/complete/search?client=firefox&type=searchTypeUndefined&q=${query}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    const data = await response.json();

    // Use type assertion to tell TypeScript that data matches SuggestionResponse
    const suggestionResponse = data as SuggestionResponse;

    // Extract only the autocomplete suggestions
    const suggestions = suggestionResponse[1];

    // Cache the results
    cache.set(query, suggestions);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
