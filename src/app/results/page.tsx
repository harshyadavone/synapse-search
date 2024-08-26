"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchResults from "@/components/layout/SearchTab/SearchResults";
import { MemoizedVideoResults } from "@/components/layout/VideoTab/VideoResults";
import { MemoizedNewsResults } from "@/components/layout/NewsTab/NewsResults";
import SearchBar from "@/components/shared/common/SearchBar";
import SearchTabs from "@/components/shared/common/SearchTabs";
import ImageSearchResults from "@/components/layout/ImageTab/ImageSearchResults";
import GeminiResults from "@/components/layout/AiChatTab/GeminiResults";

export default function Results() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();

  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const type = useMemo(
    () => searchParams.get("type") || "searchTypeUndefined",
    [searchParams]
  );

  const renderResults = useMemo(() => {
    switch (type) {
      case "aichat":
        return <GeminiResults query={query} />;
      case "image":
        return <ImageSearchResults query={query} />;
      case "video":
        return <MemoizedVideoResults query={query} />;
      case "news":
        return <MemoizedNewsResults query={query} />;
      // case "shopping":
      //   return <div>Shopping Results (Implement ShoppingComponent)</div>;
      // case "maps":
      //   return <div>Maps Results (Implement MapsComponent)</div>;
      default:
        return (
          <>
            <SearchResults query={query} />
          </>
        );
    }
  }, [query, type]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky z-10 top-0 bg-background border-b border-solid pt-2 pb-0 px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl -ml-10 mr-8 -mb-5 font-bold text-blue-700/90 hidden md:block tracking-tight leading-tight relative"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
            >
              <span
                className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-blue-600 to-secondary opacity-10 rounded-lg blur-md animate-gradient-xy pr-80" // Gradient background
                style={{
                  zIndex: -1,
                }}
              />
              <img
                src="/synapse_logo.svg"
                alt="logo"
                className="w-12 h-12 mt-8"
              />
            </Link>

            <div className="flex-grow">
              <SearchBar initialQuery={query} />
            </div>
          </div>
          <SearchTabs />
        </div>
      </header>

      <main className="max-w-full mx-auto mt-4">{renderResults}</main>

      <footer className="text-center text-xs text-muted-foreground py-4">
        <p>© 2024 Synapse. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ResultsLoading() {
  return <div>Loading results...</div>;
}
