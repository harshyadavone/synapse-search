import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import {
  SearchData,
  InfiniteSearchData,
  WebSearchResult,
  ImageSearchResult,
} from "@/types";

// This function fetches search results from an API
const fetchSearchResults = async (
  searchQuery: string,
  searchType: string,
  pageParam: number
): Promise<SearchData<WebSearchResult | ImageSearchResult>> => {
  // Making a GET request to the search API with query parameters
  const response = await axios.get<
    SearchData<WebSearchResult | ImageSearchResult>
  >(
    `/api/search?q=${encodeURIComponent(
      searchQuery
    )}&type=${searchType}&page=${pageParam}`
  );
  return response.data;
};

// Function overloads for different search types
export function useSearch(
  searchQuery: string,
  searchType: "searchTypeUndefined"
): UseInfiniteQueryResult<InfiniteSearchData<WebSearchResult>, Error>;
export function useSearch(
  searchQuery: string,
  searchType: "image"
): UseInfiniteQueryResult<InfiniteSearchData<ImageSearchResult>, Error>;

// Main implementation of the useSearch hook
export function useSearch(
  searchQuery: string,
  searchType: "searchTypeUndefined" | "image"
): UseInfiniteQueryResult<
  InfiniteSearchData<WebSearchResult | ImageSearchResult>,
  Error
> {
  // Using the useInfiniteQuery hook from tanstack-query for infinite scrolling
  return useInfiniteQuery<
    SearchData<WebSearchResult | ImageSearchResult>,
    Error,
    InfiniteSearchData<WebSearchResult | ImageSearchResult>,
    [string, string, string],
    number
  >({
    // Unique key for this query
    queryKey: ["search", searchQuery, searchType],
    // Function to fetch the data
    queryFn: ({ pageParam = 1 }) =>
      fetchSearchResults(searchQuery, searchType, pageParam),
    // Initial page parameter
    initialPageParam: 1,
    // Function to determine the next page to fetch
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.items.length > 0 ? nextPage : undefined;
    },
    // Only enable the query when there's a search query
    enabled: !!searchQuery,
    // Don't retry on failure
    retry: false,
  });
}
