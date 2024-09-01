import { NEWS_API_KEY } from "@/config";
import {
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// --- Error Types ---
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// --- Types ---
interface ArticleSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: ArticleSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

// --- Data Fetching ---
const fetchNews = async ({
  pageParam,
  queryKey,
}: QueryFunctionContext<[string, string], number>): Promise<NewsResponse> => {
  const [_, searchQuery] = queryKey;
  try {
    const response = await axios.get<NewsResponse>("/api/news", {
      params: {
        q: searchQuery,
        page: pageParam,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new ApiError(
          axiosError.response.statusText,
          axiosError.response.status
        );
      } else {
        throw new Error("Network Error: " + axiosError.message);
      }
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// --- React Query Hook ---
export function useNews(searchQuery: string) {
  return useInfiniteQuery<
    NewsResponse,
    Error,
    InfiniteData<NewsResponse>,
    [string, string],
    number
  >({
    queryKey: ["search", searchQuery],
    queryFn: fetchNews,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length >= Math.ceil(lastPage.totalResults / 10)) {
        return undefined;
      }
      return pages.length + 1;
    },
    enabled: !!searchQuery,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
