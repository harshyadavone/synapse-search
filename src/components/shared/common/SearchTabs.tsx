"use client";

import React, { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export type TabId =
  | "searchTypeUndefined"
  | "aichat"
  | "image"
  | "video"
  | "news";
// | "shopping"
// | "maps";

type Tab = {
  id: TabId;
  label: string;
};

type SearchTabsProps = {
  tabs?: Tab[];
};

export const defaultTabs: Tab[] = [
  { id: "searchTypeUndefined", label: "All" },
  { id: "aichat", label: "Ai Chat" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "news", label: "News" },
  // { id: "shopping", label: "Shopping" },
  // { id: "maps", label: "Maps" },
];

const SearchTabs: React.FC<SearchTabsProps> = ({ tabs: propTabs }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const isValidTabId = useCallback((id: string): id is TabId => {
    return defaultTabs.map((tab) => tab.id).includes(id as TabId);
  }, []);

  const activeTab: TabId = useMemo(() => {
    const type = searchParams.get("type");
    return type !== null && isValidTabId(type) ? type : "searchTypeUndefined";
  }, [searchParams, isValidTabId]);

  const tabs = useMemo(() => propTabs || defaultTabs, [propTabs]);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      const query = searchParams.get("q");
      if (query) {
        startTransition(() => {
          router.push(`/results?q=${encodeURIComponent(query)}&type=${tab}`, {
            scroll: false,
          });
        });
      }
    },
    [router, searchParams]
  );

  return (
    <nav className="md:pl-28 overflow-x-scroll no-scrollbar md:overflow-x-hidden pt-2 text-sm">
      <ul className="flex space-x-3">
        {tabs.map((tab) => (
          <li key={tab.id} className="inline-block">
            <button
              onClick={() => handleTabChange(tab.id)}
              aria-label={`Search ${tab.label}`}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`py-2 px-4 mb-[6px] font-medium rounded-md transition-colors duration-150 relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-500 text-muted-foreground hover:bg-secondary/40 hover:text-secondary-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-primary/10"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default React.memo(SearchTabs);
