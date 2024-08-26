import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useVideos } from "@/hooks/useVideos";
import { LoadingState } from "@/components/shared/common/LoadingState";
import { NoResultsState } from "@/components/shared/common/NoResultsState";
import ErrorMessageWithRetry from "@/components/shared/common/ErrorMessageWithRetry";
import { VideoCardSkeleton } from "@/components/skeletons/VideoCardSkeleton";
import VideoCard from "./VideoCard";

const VideoResults: React.FC<{ query: string }> = ({ query }) => {
  const [retryCount, setRetryCount] = useState(0);
  const previousQueryRef = useRef<string | null>(null);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isRefetchError,
  } = useVideos(query);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (previousQueryRef.current !== query) {
      setRetryCount(0);
      previousQueryRef.current = query;
    }
  }, [query]);

  useEffect(() => {
    if (error && retryCount < 3) {
      console.log("Error detected, retrying", retryCount + 1);
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  if (error || isRefetchError) {
    return (
      <ErrorMessageWithRetry
        message={error.message}
        onRetry={() => setRetryCount((prev) => prev + 1)}
        retryCount={retryCount}
      />
    );
  }

  if (isLoading || !data || isRefetching) {
    return <LoadingState />;
  }

  const hasVideos = data.pages.some(
    (page) => page.items && page.items.length > 0
  );

  if (!hasVideos) {
    return <NoResultsState />;
  }

  return (
    <div className="space-y-6 md:px-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((video) => (
              <VideoCard key={video.id.videoId} video={video} />
            ))}
          </React.Fragment>
        ))}
        {(isFetchingNextPage || isLoading) &&
          [...Array(4)].map((_, i) => <VideoCardSkeleton key={i} />)}
      </div>
      <div ref={ref} className="h-10" />
      {!hasNextPage && (
        <p className="text-center text-gray-500">No more videos to load</p>
      )}
    </div>
  );
};

export const MemoizedVideoResults = React.memo(VideoResults);