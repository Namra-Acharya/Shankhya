"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { searchCalculators } from "@/lib/calculators/registry";
import { getCategoryById } from "@/lib/calculators/registry";

const POPULAR_SEARCHES = ["age", "emi", "percentage", "cgpa", "sip", "gst"];

export function CalculatorSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  // Initial query can come from a ?q= URL param (e.g. site search links or the
  // WebSite SearchAction structured data). The canonical/clean URL remains
  // indexable; search/state variants canonicalize away and never create
  // separate indexable pages.
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const q = new URLSearchParams(window.location.search).get("q");
      return q ? q.trim() : "";
    } catch {
      return "";
    }
  });
  const [results, setResults] = useState<CalculatorDefinition[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Recent searches from localStorage (lazy initializer — synchronous, avoids setState-in-effect)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("Shankhya-recent-searches");
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setActiveIndex(-1);
        return;
      }

      const matches = searchCalculators(query);
      setResults(matches);
      setIsOpen(true);
      setActiveIndex(matches.length > 0 ? 0 : -1);
    }, 100);

    return () => clearTimeout(debounce);
  }, [query]);

  // Ensure the search input is actually focused on mobile touch devices,
  // where browsers may not honor autoFocus on conditionally-mounted inputs.
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      try {
        localStorage.setItem("Shankhya-recent-searches", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      saveRecentSearch(query);
      // Let the link handle navigation
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && activeIndex >= 0) {
      const items = listRef.current.querySelectorAll("li");
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleSelect = (calculator: CalculatorDefinition) => {
    saveRecentSearch(query);
    setIsOpen(false);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-dark-text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="calculator-search-results"
          aria-label="Search calculators"
          autoFocus={autoFocus}
          placeholder="What do you need to calculate?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true);
          }}
          className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-muted dark:focus:border-accent-400 dark:focus:ring-accent-400/20"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full min-w-[280px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/5 dark:border-dark-border dark:bg-dark-surface dark:shadow-black/20">
          {query.trim() ? (
            results.length > 0 ? (
              <ul
                ref={listRef}
                id="calculator-search-results"
                role="listbox"
                className="max-h-[320px] overflow-y-auto py-1"
              >
                {results.map((calc, index) => {
                  const category = getCategoryById(calc.category);
                  return (
                    <li key={calc.id} role="option" aria-selected={index === activeIndex}>
                      <Link
                        href={`/calculators/${calc.slug}`}
                        onClick={() => handleSelect(calc)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          index === activeIndex
                            ? "bg-surface-secondary dark:bg-dark-secondary"
                            : "hover:bg-surface-secondary/60 dark:hover:bg-dark-secondary/60"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                            {calc.name}
                          </p>
                          <p className="truncate text-xs text-text-muted dark:text-dark-text-muted">
                            {calc.shortDescription}
                          </p>
                        </div>
                        {category && (
                          <span className="hidden text-xs text-text-muted dark:text-dark-text-muted sm:block">
                            {category.name}
                          </span>
                        )}
                        {index === activeIndex && (
                          <ArrowRight className="h-4 w-4 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  No calculators found for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-text-muted dark:text-dark-text-muted">
                  Try searching for &ldquo;age&rdquo;, &ldquo;emi&rdquo; or &ldquo;percentage&rdquo;
                </p>
              </div>
            )
          ) : (
            <div className="p-3">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted dark:text-dark-text-muted">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    Recent
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleChipClick(term)}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-accent-400 dark:hover:text-accent-400"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular searches */}
              <div>
                <p className="mb-1.5 text-xs font-medium text-text-muted dark:text-dark-text-muted">
                  Popular
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.slice(0, 5).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleChipClick(term)}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-accent-400 dark:hover:text-accent-400"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}