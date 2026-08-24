"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { CURRENCIES, POPULAR_CURRENCIES, getCurrency } from "@/lib/currency/currencies";
import { formatCurrencyLabel } from "@/lib/currency/format";
import { useCurrency } from "@/lib/currency/context";

interface CurrencySelectorProps {
  label?: string;
  size?: "sm" | "md";
  value?: string;
  onChange?: (code: string) => void;
  align?: "left" | "right";
  className?: string;
}

/**
 * Premium, searchable currency selector.
 * - Keyboard navigable (ArrowDown/Up, Enter, Escape)
 * - Searchable by code, name or symbol
 * - Popular currencies surfaced first
 * - Mobile-friendly (large touch target, scrollable panel, outside-click close)
 */
export function CurrencySelector({
  label = "Currency",
  size = "md",
  value,
  onChange,
  align = "left",
  className = "",
}: CurrencySelectorProps) {
  const ctx = useCurrency();
  const current = value ?? ctx.currency;
  const select = onChange ?? ctx.setCurrency;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const cur = getCurrency(current);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [query]);

  const popular = useMemo(() => {
    if (query.trim()) return [];
    return POPULAR_CURRENCIES.map((code) => getCurrency(code));
  }, [query]);

  const all = query.trim() ? filtered : CURRENCIES.filter((c) => !c.popular);

  const handleSelect = useCallback(
    (code: string) => {
      select(code);
      setOpen(false);
      setQuery("");
    },
    [select]
  );

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        setQuery("");
        setActiveIndex(0);
      }
      return !prev;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, all.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && all[activeIndex]) {
      e.preventDefault();
      handleSelect(all[activeIndex].code);
    }
  };

  useEffect(() => {
    if (open && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      (items[activeIndex] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const rowClass =
    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors";

  const renderRow = (c: { code: string; name: string; flag?: string }) => (
    <button
      type="button"
      role="option"
      aria-selected={c.code === current}
      data-option
      onClick={() => handleSelect(c.code)}
      className={`${rowClass} ${
        c.code === current
          ? "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-300"
          : "hover:bg-surface-secondary dark:hover:bg-dark-secondary"
      }`}
    >
      <span className="w-6 shrink-0 text-center" aria-hidden="true">
        {c.flag ?? c.code.slice(0, 2)}
      </span>
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium">{c.code}</span>{" "}
        <span className="text-text-muted dark:text-dark-text-muted">{c.name}</span>
      </span>
      {c.code === current && (
        <Check className="h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <span id={`${label}-label`} className="input-label">
        {label}
      </span>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${label}-label`}
        className={`mt-1 flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface text-sm text-text-primary transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:focus:border-accent-400 dark:focus:ring-accent-400/20 ${
          size === "sm" ? "h-9 px-2.5" : "h-10 px-3"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {cur.flag && <span aria-hidden="true">{cur.flag}</span>}
          <span className="truncate font-medium">{cur.code}</span>
          <span className="truncate text-text-muted dark:text-dark-text-muted">{cur.name}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform dark:text-dark-text-muted ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={`${label}-label`}
          className={`absolute z-[60] mt-1 w-full min-w-[260px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/5 dark:border-dark-border dark:bg-dark-surface dark:shadow-black/20 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="relative border-b border-border p-2 dark:border-dark-border">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-dark-text-muted"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              aria-label="Search currencies"
              placeholder="Search currency…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-muted"
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto overscroll-contain py-1">
            <ul ref={listRef} role="presentation" className="list-none">
              {popular.length > 0 && (
                <li className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted">
                  Popular
                </li>
              )}
              {popular.map((c) => (
                <li key={c.code}>{renderRow(c)}</li>
              ))}
              {popular.length > 0 && (
                <li className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted">
                  All currencies
                </li>
              )}
              {all.map((c) => (
                <li key={c.code}>{renderRow(c)}</li>
              ))}
              {all.length === 0 && (
                <li className="px-3 py-4 text-center text-sm text-text-muted dark:text-dark-text-muted">
                  No currencies match &ldquo;{query}&rdquo;
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export { formatCurrencyLabel };
