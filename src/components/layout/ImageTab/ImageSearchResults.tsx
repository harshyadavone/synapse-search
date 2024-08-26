import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import { ImageSearchResult } from "@/types";
import { Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LoadingState } from "@/components/shared/common/LoadingState";
import { ErrorState } from "@/components/shared/common/ErrorState";
import { NoResultsState } from "@/components/shared/common/NoResultsState";
import ImageCard from "./ImageCard";

const COLUMN_WIDTH = 250; // Width of each column for desktop layout
const MOBILE_BREAKPOINT = 640; // Breakpoint for switching to mobile layout

const ImageSearchResults = ({ query }: { query: string }) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearch(query, "image");
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  const [columnCount, setColumnCount] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateLayout = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newIsMobile = containerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(newIsMobile);

      if (newIsMobile) {
        setColumnCount(2); // Always 2 columns for mobile
      } else {
        const newColumnCount = Math.floor(containerWidth / COLUMN_WIDTH);
        setColumnCount(Math.max(2, newColumnCount)); // At least 2 columns for desktop
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data || !data.pages[0]?.items.length)
    return <NoResultsState query={query} />;

  const allItems = data.pages.flatMap((page) => page.items);
  const columns = Array.from({ length: columnCount }, (_, index) =>
    allItems.filter((_, i) => i % columnCount === index)
  );

  return (
    <div ref={containerRef} className="mx-auto px-2 sm:px-4 py-4 max-w-7xl">
      <div
        className={`flex flex-wrap ${
          isMobile ? "-mx-1" : "justify-center gap-4"
        }`}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={isMobile ? "w-1/2 px-1" : ""}
            style={
              !isMobile
                ? { width: `calc(100% / ${columnCount} - 1rem)` }
                : undefined
            }
          >
            <AnimatePresence>
              {column.map((item: ImageSearchResult, index: number) => (
                <motion.div
                  key={`${columnIndex}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={isMobile ? "mb-2" : "mb-4"}
                >
                  <ImageCard item={item} isMobile={isMobile} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="w-full text-center py-8">
          <Loader className="animate-spin text-3xl text-primary mx-auto" />
        </div>
      )}
    </div>
  );
};

export default ImageSearchResults;
