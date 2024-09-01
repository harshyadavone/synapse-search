import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCompletion } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatContent, sanitizeContent } from "@/lib/formatContent";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { Sparkles } from "lucide-react";
import { TestTube01Icon } from "@/components/ui/icons";
import { colors } from "@/lib/Colors";

interface GeminiResultsProps {
  query: string;
}

const GeminiResults: React.FC<GeminiResultsProps> = ({ query }) => {
  const [showGemini, setShowGemini] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [randomColor, setRandomColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [displayedCompletion, setDisplayedCompletion] = useState("");
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/gemini",
    onError: (error) => {
      // console.error("Completion error:", error);
      setError(`Failed to fetch AI-powered results: ${error.message}`);
    },
  });

  useEffect(() => {
    setShowGemini(true);
    setError(null);
    setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
    if (query) {
      fetchInitialResponse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (completion) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedCompletion(completion.slice(0, index));
        index++;
        if (index > completion.length) {
          clearInterval(interval);
          setIsStreamingComplete(true);
        }
      }, 5); // Speed of typing animation

      return () => clearInterval(interval);
    }
  }, [completion]);

  useEffect(() => {
    if (isStreamingComplete) {
      Prism.highlightAll();
    }
  }, [isStreamingComplete]);

  const fetchInitialResponse = async () => {
    try {
      await complete(query);
    } catch (err) {
      // console.error("Error fetching Gemini response:", err);
      setError(
        `Failed to fetch AI-powered results: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const sanitizeAndFormatHTML = useCallback(
    (html: string) => ({
      __html: sanitizeContent(formatContent(html)),
    }),
    []
  );

  return (
    <AnimatePresence>
      {showGemini && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${randomColor} flex flex-col md:pl-52 items-start shadow-md overflow-hidden bg-opacity-[0.02] mb-6`}
        >
          <div className="p-4 flex items-center gap-2">
            <TestTube01Icon className="text-violet-600 h-7 w-h-7" />
            <h2 className="text-lg font-semibold text-violet-600">
              Search Labs | AI Overview
            </h2>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 pl-4">
              <Sparkles className="text-primary h-5 w-5 animate-bounce" />
              <p className="text-md font-medium text-primary">
                Generating AI response
              </p>
            </div>
          )}

          <motion.div
            className="p-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <motion.div
                className="w-full skeleton-loader animate-shimmer max-w-4xl -ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </motion.div>
            ) : (
              <motion.div
                className="max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {error ? (
                  <div className="text-sm text-red-500">{error}</div>
                ) : (
                  <div
                    className={`prose max-w-3xl prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 ${
                      isStreamingComplete ? "syntax-highlighted" : ""
                    }`}
                    dangerouslySetInnerHTML={
                      displayedCompletion
                        ? sanitizeAndFormatHTML(displayedCompletion)
                        : undefined
                    }
                  />
                )}
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeminiResults;
