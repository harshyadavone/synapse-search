import { lazy, Suspense, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { WebSearchResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ErrorState } from "@/components/shared/common/ErrorState";
import { LoadingState } from "@/components/shared/common/LoadingState";
import { NoResultsState } from "@/components/shared/common/NoResultsState";
import SearchResultItem from "./SearchResultItem";
import Spinner from "@/components/shared/common/Loader";
import { Loader } from "lucide-react";
import ResultsInfo from "./ResultsInfo";
const FeaturedSearch = lazy(() => import("./FeaturedSearch"));
const PersonalDetails = lazy(() => import("./PersonalDetails"));

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch(query, "searchTypeUndefined");
  // const { ref, inView } = useInView();

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data || !data.pages[0]?.items?.length)
    return <NoResultsState query={query} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-start w-full overflow-hidden md:mb-6"
    >
      <Suspense fallback={<Spinner />}>
        <FeaturedSearch searchData={data.pages[0].items} query={query} />
        <PersonalDetails searchData={data.pages[0].items} />
      </Suspense>
      <ResultsInfo searchInfo={data.pages[0].searchInformation} />
      <AnimatePresence>
        <ul className="space-y-2 flex items-center justify-center flex-col w-full">
          {data.pages.flatMap((page, pageIndex) =>
            page.items.map((result: WebSearchResult, index: number) => (
              <SearchResultItem
                key={`${pageIndex}-${index}`}
                result={result}
                index={index}
              />
            ))
          )}
        </ul>
      </AnimatePresence>
      {hasNextPage && (
        <div className="w-full text-center py-4">
          {isFetchingNextPage ? (
            <Loader className="animate-spin text-3xl text-primary mx-auto" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-primary hover:underline"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;