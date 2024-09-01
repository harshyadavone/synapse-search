"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HistoryIcon } from "lucide-react";
import { Cancel01Icon, Search01Icon } from "@/components/ui/icons";
import { useDebounce } from "@/hooks/useDebounce";

interface Suggestion {
  text: string;
  type: "history" | "suggestion";
}

interface SearchBarProps {
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = "" }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [_isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionCache = useRef<Record<string, Suggestion[]>>({});

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = useCallback(async (value: string) => {
    if (suggestionCache.current[value]) {
      setSuggestions(suggestionCache.current[value]);
      return;
    }

    try {
      const res = await fetch(`/api/complete?q=${value}`);
      const data: string[] = await res.json();
      const history = getSearchHistory().filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );

      const newSuggestions: Suggestion[] = [
        ...history.map((h) => ({ text: h, type: "history" as const })),
        ...data.map((s) => ({ text: s, type: "suggestion" as const })),
      ];

      setSuggestions(newSuggestions);
      suggestionCache.current[value] = newSuggestions;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  }, []);

  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 150);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length > 0) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSuggestionSelect(suggestions[selectedIndex].text);
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToSearchHistory(query.trim());
      router.push(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    addToSearchHistory(suggestion);
    router.push(`/results?q=${encodeURIComponent(suggestion)}`);
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <strong key={i} className="text-primary font-medium">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getSearchHistory = (): string[] => {
    const history = localStorage.getItem("searchHistory");
    return history ? JSON.parse(history) : [];
  };

  const addToSearchHistory = (query: string) => {
    const history = getSearchHistory();
    const updatedHistory = [
      query,
      ...history.filter((item) => item !== query),
    ].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl"
      ref={searchRef}
    >
      <div className="relative w-full md:pl-9 overflow-hidden">
        <input
          autoFocus
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className={`w-full top-9 px-4 py-2.5 pr-20 text-base bg-card focus:outline-none rounded-xl border-[1px] border-solid transition-colors duration-300 dark:text-white ${
            suggestions.length > 0 && "focus:rounded-b-none"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-14 top-1/2 -mt-3"
          >
            <Cancel01Icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors duration-300 rounded-xl" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-5 top-1/2 transform -translate-y-1/2"
        >
          <Search01Icon className="text-foreground hover:text-primary transition-colors duration-300" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full md:w-[calc(100%-2.25rem)] md:left-9 bg-card border border-secondary rounded-b-md shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-muted/50 cursor-pointer flex items-center ${
                index === selectedIndex ? "bg-muted/50" : ""
              }`}
              onClick={() => handleSuggestionSelect(suggestion.text)}
            >
              {suggestion.type === "history" ? (
                <HistoryIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              ) : (
                <Search01Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              {highlightMatch(suggestion.text, query)}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
