import { GOOGLE_API_KEY } from "@/config";
import {
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useEffect } from "react";

// --- Error Types ---
// Custom error class for API-related errors.
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// --- Types ---
// TypeScript interfaces defining the structure of the API response and video items.
interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
}

interface VideoResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: VideoItem[];
}

// --- Data Fetching ---
// Function to fetch videos from the YouTube API.
const fetchVideos = async ({
  pageParam = "",
  queryKey,
}: QueryFunctionContext<[string, string], string>): Promise<VideoResponse> => {
  const [_, searchQuery] = queryKey;
  try {
    const response = await axios.get<VideoResponse>(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          key: GOOGLE_API_KEY,
          part: "snippet",
          q: searchQuery,
          type: "video",
          maxResults: 10,
          pageToken: pageParam || undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Error handling for different types of errors.
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
// Custom hook that uses React Query to manage video data fetching and caching.
export function useVideos(searchQuery: string) {
  const queryClient = useQueryClient();
  const stableQueryRef = useRef(searchQuery);

  // Effect to reset queries when the search query changes.
  useEffect(() => {
    if (stableQueryRef.current !== searchQuery) {
      stableQueryRef.current = searchQuery;
      queryClient.resetQueries({ queryKey: ["videos", searchQuery] });
    }
  }, [searchQuery, queryClient]);

  // Using useInfiniteQuery to handle paginated data fetching.
  return useInfiniteQuery<
    VideoResponse,
    Error,
    InfiniteData<VideoResponse>,
    [string, string],
    string
  >({
    queryKey: ["videos", stableQueryRef.current],
    queryFn: fetchVideos,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    enabled: !!stableQueryRef.current,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    // cacheTime: Infinity,
  });
}
