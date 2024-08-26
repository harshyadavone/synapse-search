import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WebSearchResult } from "@/types";
import { SparklesIcon } from "@/components/ui/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ErrorState } from "@/components/shared/common/ErrorState";
import RelatedSearchResultsLink from "./RelatedSearchResultsLink";
import { colors } from "@/lib/Colors";

const API_TOKEN = process.env.NEXT_PUBLIC_HF_API_KEY;

interface FeaturedSearchProps {
  searchData: WebSearchResult[];
}

const FeaturedSearch: React.FC<FeaturedSearchProps> = ({ searchData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<string>("");
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

      // Call it once to set initial state
      handleScroll();

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const cleanText = (text: string) => {
    const words = text.split(" ");
    const cleanedWords = words.filter(
      (word, index) => word !== words[index + 1]
    );
    return cleanedWords.join(" ");
  };

  const query = async (data: any) => {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
        data,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error querying the model:", error);
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

        setSummary("");
        setError(null);

        try {
          const combinedDescription = searchData
            .map((item) => item.description || item.snippet || "")
            .join(" ");

          const prompt = `Summarize the following search results:

        ${combinedDescription}

        Provide a clear and concise summary that captures the main points and addresses the user's search intent.`;

          const response = await query({ inputs: prompt });

          if (response && response[0] && response[0].summary_text) {
            const cleanedSummary = cleanText(response[0].summary_text);
            const words = cleanedSummary.split(" ");
            for (let i = 0; i < words.length; i++) {
              await new Promise((resolve) => setTimeout(resolve, 50));
              setSummary((prev) => prev + (i > 0 ? " " : "") + words[i]);
              if (summaryRef.current) {
                summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
              }
            }
          }
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
  }, [searchData]);

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
    return (
      <ErrorState error={error} />
    );
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
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden mb-8"
            ref={summaryRef}
          >
            <p className="text-lg text-foreground max-w-4xl  leading-relaxed">
              {summary}
              {/* {isGenerating && (
                <span className="inline-block  w-1 h-6 ml-1 bg-primary animate-pulse" />
              )} */}
            </p>
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
};

export default FeaturedSearch;
