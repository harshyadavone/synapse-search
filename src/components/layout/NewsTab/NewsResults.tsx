import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNews } from "@/hooks/useNews";
import { NoResultsState } from "@/components/shared/common/NoResultsState";
import { InitialLoadingSkeleton } from "@/components/skeletons/InitialNewsLoadingSkeleton";
import { NewsCardSkeleton } from "@/components/skeletons/NewsCardSkeleton";
import FeaturedArticle from "./FeaturedArticle";
import CompactNewsCard from "./CompactNewsCard";
import NewsCard from "./NewsCard";
import ErrorMessageWithRetry from "@/components/shared/common/ErrorMessageWithRetry";

const NewsResults: React.FC<{ query: string }> = ({ query }) => {
  const [retryCount, setRetryCount] = useState(0);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isRefetchError,
  } = useNews(query);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, refetch]);

  if (error || isRefetchError) {
    return (
      <ErrorMessageWithRetry
        message={error.message}
        onRetry={() => {
          setRetryCount((prev) => prev + 1);
          refetch();
        }}
        retryCount={retryCount}
      />
    );
  }

  if (isLoading || !data || isRefetching) {
    return <InitialLoadingSkeleton />;
  }

  const hasArticles = data.pages.some(
    (page) => page.articles && page.articles.length > 0
  );

  if (!hasArticles) {
    return <NoResultsState />;
  }

  return (
    <div className="mx-auto px-0 py-2 md:py-8">
      {data.pages[0] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:px-3">
          <div className="lg:col-span-7">
            {/* Featured Article takes 8/12 columns */}
            <FeaturedArticle article={data.pages[0].articles[0]} />
          </div>
          <div className="lg:col-span-5">
            {/* Compact Cards take 4/12 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 px-4">
              {data.pages[0].articles.slice(1, 4).map((article) => (
                <CompactNewsCard key={article.url} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="news-grid md:px-4">
        {data.pages
          .flatMap((page, i) =>
            i === 0 ? page.articles.slice(4) : page.articles
          )
          .map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        {(isFetchingNextPage || isLoading) && <NewsCardSkeleton />}
      </div>

      <div ref={ref} className="h-10" aria-hidden="true" />
      {!hasNextPage && (
        <p className="text-center text-muted-foreground mt-8">
          No more news to load
        </p>
      )}
    </div>
  );
};

export const MemoizedNewsResults = React.memo(NewsResults);
