/**
 * Formatting utilities for calculator results.
 */

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number, currency = "INR", decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${formatNumber(value, decimals)}%`;
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function formatYearsMonthsDays(years: number, months: number, days: number): string {
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  return parts.join(", ");
}

/**
 * Formats a value for display in visualizations without exposing
 * JavaScript floating-point artifacts. The underlying value is never modified;
 * only the PRESENTATION is rounded.
 *
 * Supported modes: "number", "decimal1", "decimal2", "percentage",
 * "currency", "unit", "scientific".
 */
export function formatVisualizationValue(
  value: number,
  options: {
    mode?: "number" | "decimal1" | "decimal2" | "percentage" | "currency" | "unit" | "scientific";
    unit?: string;
    currency?: string;
  } = {}
): string {
  if (!Number.isFinite(value)) return "—";

  const { mode = "decimal1", unit, currency = "INR" } = options;

  switch (mode) {
    case "number":
      return formatNumber(value, 0);
    case "decimal1":
      return formatNumber(value, 1);
    case "decimal2":
      return formatNumber(value, 2);
    case "percentage":
      return formatPercentage(value, 1);
    case "currency":
      return formatCurrency(value, currency, 0);
    case "scientific":
      if (Math.abs(value) !== 0 && (Math.abs(value) < 0.001 || Math.abs(value) >= 1_000_000)) {
        return value.toExponential(2);
      }
      return formatNumber(value, 2);
    case "unit":
    default:
      const formatted = formatNumber(value, 1);
      return unit ? `${formatted} ${unit}` : formatted;
  }
}

export function formatINR(value: number): string {
  return formatCurrency(value, "INR");
}

export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}