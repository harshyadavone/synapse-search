"use client";

import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
} from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WebSearchResult } from "@/types";
import { SparklesIcon } from "@/components/ui/icons";
import { ErrorState } from "@/components/shared/common/ErrorState";
import RelatedSearchResultsLink from "./RelatedSearchResultsLink";
import { colors } from "@/lib/Colors";
import { formatContent, sanitizeContent } from "@/lib/formatContent";
import axios from "axios";

interface FeaturedSearchProps {
  searchData: WebSearchResult[];
  query: string;
}

export default function FeaturedSearch({
  searchData,
  query,
}: FeaturedSearchProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [streamedContent, setStreamedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false);
  const [randomColor, setRandomColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };
      handleScroll();

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const generateSummary = async (urls: string[], prompt: string) => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls, prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() !== "") {
            try {
              // Find the first occurrence of a valid JSON string
              const jsonStartIndex = line.indexOf('"');
              if (jsonStartIndex !== -1) {
                const jsonEndIndex = line.lastIndexOf('"');
                if (jsonEndIndex > jsonStartIndex) {
                  const jsonContent = line.substring(
                    jsonStartIndex,
                    jsonEndIndex + 1
                  );
                  const content = JSON.parse(jsonContent);
                  accumulatedContent += content;
                }
              }
            } catch (parseError) {
              console.error("Error parsing line:", parseError);
            }
          }
        }

        setStreamedContent(accumulatedContent);
        if (summaryRef.current) {
          summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
        }
      }

      return accumulatedContent;
    } catch (error) {
      // console.error("Error generating summary:", error);
      throw error;
    }
  };

  useEffect(() => {
    setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      const getSummary = async () => {
        setIsGenerating(true);
        setStreamedContent("");
        setError(null);

        try {
          const urls = searchData.map((item) => item.link);
          const prompt = `Answer the query: ${query}`;

          await generateSummary(urls, prompt);
        } catch (err: any) {
          setError(
            err.message || "An error occurred while generating the summary."
          );
        } finally {
          setIsGenerating(false);
        }
      };

      if (searchData && searchData.length > 0) {
        getSummary();
      }
      return () => {
        effectRan.current = true;
      };
    }
  }, [searchData, query]);

  const sanitizeAndFormatHTML = useCallback(
    (html: string) => ({
      __html: sanitizeContent(formatContent(html)),
    }),
    []
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 900;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 p-4 sm:p-6 md:p-8 bg-${randomColor} w-full flex flex-col items-center bg-opacity-[0.02]`}
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center text-indigo-700">
        <SparklesIcon className="mr-3 text-indigo-500 h-5 w-5" />
        <span className="text-xl font-semibold text-indigo-600">
          Search Labs | AI Overview
        </span>
      </h2>
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Loader2 className="animate-spin h-5 w-5 text-indigo-500" />
          </motion.div>
        )}
        {streamedContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden mb-8"
            ref={summaryRef}
          >
            <div
              className="text-lg text-foreground max-w-4xl leading-relaxed prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={sanitizeAndFormatHTML(streamedContent)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-4xl relative">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -ml-5 -translate-y-1/2 bg-accent hover:bg-secondary p-2 rounded-full shadow-md z-5 hidden md:block"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto w-full pb-4 scroll-smooth"
        >
          <div className="flex gap-3 md:px-4">
            {searchData
              .slice(0, 8)
              .map((item: WebSearchResult, index: number) => (
                <Suspense
                  key={index}
                  fallback={<Loader2 className="h-6 w-6 animate-spin" />}
                >
                  <RelatedSearchResultsLink
                    item={item}
                    index={index}
                    randomColor={randomColor}
                  />
                </Suspense>
              ))}
          </div>
        </div>
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className="absolute right-0 -mr-5 top-1/2 -translate-y-1/2 bg-accent hover:bg-secondary p-2 rounded-full shadow-md z-5 hidden md:block"
            >
              <ChevronRight size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
