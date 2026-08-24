"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_CURRENCY, getCurrency } from "@/lib/currency/currencies";
import { formatMoney, formatMoneyCompact } from "@/lib/currency/format";

interface CurrencyContextValue {
  /** Current ISO 4217 code, e.g. "INR" */
  currency: string;
  /** Select a new currency (persisted locally). */
  setCurrency: (code: string) => void;
  /** Symbol for the current currency, e.g. "$" */
  symbol: string;
  /** Format a money amount in the selected currency. */
  format: (value: number, options?: { decimals?: number; showCode?: boolean }) => string;
  /** Compact form for charts/axes. */
  formatCompact: (value: number) => string;
}

const STORAGE_KEY = "Shankhya-currency";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCurrency(): string {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const known = getCurrency(stored);
      if (known.code.toUpperCase() === stored.toUpperCase()) return stored.toUpperCase();
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => readStoredCurrency());

  // Persist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(getCurrency(code).code);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      symbol: getCurrency(currency).symbol,
      format: (amount, options) => formatMoney(amount, currency, options),
      formatCompact: (amount) => formatMoneyCompact(amount, currency),
    }),
    [currency, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

const FALLBACK_FORMAT = (v: number, o?: { decimals?: number; showCode?: boolean }) =>
  formatMoney(v, DEFAULT_CURRENCY, o);

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Not wrapped by the provider (e.g. unit tests / SSR): neutral fallback.
    return {
      currency: DEFAULT_CURRENCY,
      setCurrency: () => {},
      symbol: getCurrency(DEFAULT_CURRENCY).symbol,
      format: FALLBACK_FORMAT,
      formatCompact: (v) => formatMoneyCompact(v, DEFAULT_CURRENCY),
    };
  }
  return ctx;
}
