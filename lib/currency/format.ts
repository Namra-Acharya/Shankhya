/**
 * Centralized money-formatting utilities for Shankhya.
 *
 * All monetary display should go through `formatMoney` / `formatMoneyCompact`
 * so that every currency renders with its own symbol, decimal convention and
 * grouping (e.g. ₹1,25,000 vs. $125,000.00 vs. ¥125,000).
 *
 * Precision is preserved internally — these helpers only round/present.
 */

import { getCurrency, getCurrencyDecimals, type CurrencyInfo } from "@/lib/currency/currencies";

/** Infer a decimal count for a given value range so JPY/UGX don't show cents. */
function decimalsFor(code: string): number {
  return getCurrencyDecimals(code);
}

export interface FormatMoneyOptions {
  /** Force a specific number of decimals (overrides the currency default). */
  decimals?: number;
  /** When true, append the ISO code for disambiguation (e.g. "$ 125,000 USD"). */
  showCode?: boolean;
}

/**
 * Format a numeric amount in the given currency.
 * Uses the currency's locale for grouping (INR → lakh grouping).
 */
export function formatMoney(value: number, code: string, options: FormatMoneyOptions = {}): string {
  if (!Number.isFinite(value)) return "—";
  const currency = getCurrency(code);
  const decimals = options.decimals ?? decimalsFor(currency.code);
  const formatted = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (options.showCode) {
    return `${formatted} ${currency.code}`;
  }
  return formatted;
}

/**
 * Compact currency formatting for charts/axes (e.g. ₹100K, ¥2.5M).
 */
export function formatMoneyCompact(value: number, code: string): string {
  if (!Number.isFinite(value)) return "—";
  const currency = getCurrency(code);
  const compact = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return compact;
}

/**
 * A short, unambiguous label for a currency, e.g. "₹ INR · Indian Rupee".
 */
export function formatCurrencyLabel(code: string): string {
  const c = getCurrency(code);
  return `${c.symbol} ${c.code} · ${c.name}`;
}

/** Returns just the display symbol for a currency code. */
export function currencySymbol(code: string): string {
  return getCurrency(code).symbol;
}

/** Resolves a code to its CurrencyInfo (re-export for convenience). */
export function getCurrencyInfo(code: string): CurrencyInfo {
  return getCurrency(code);
}

/** Backwards-compatible alias used across existing calculators. */
export function formatINR(value: number, options: FormatMoneyOptions = {}): string {
  return formatMoney(value, "INR", options);
}

/**
 * A compact "x.xx K" style formatter used by charts that still needs the
 * currency symbol for context. Returns e.g. "$125K" or "₹12.5L" where
 * the friendly grouping of the locale allows.
 */
export function formatAxisValue(value: number, code: string): string {
  if (!Number.isFinite(value)) return "—";
  return formatMoneyCompact(value, code);
}
