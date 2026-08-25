"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import type { CalculatorResult, ResultValue } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { useCurrency } from "@/lib/currency/context";
import { VisualizationRenderer, type VisualizationConfig } from "@/components/visualizations";

interface CalculatorResultViewProps {
  result: CalculatorResult;
  /** Whether this calculator uses monetary values (drives currency-aware chart labels) */
  money?: boolean;
}

export function CalculatorResultView({ result, money = false }: CalculatorResultViewProps) {
  const { format: formatMoney, symbol } = useCurrency();
  const [copied, setCopied] = useState(false);

  /**
   * Safely format a result value.
   * Currency values stored as raw numbers are formatted with the selected
   * currency; values already stored as strings are returned as-is.
   */
  const formatResultValue = useCallback(
    (value: ResultValue): string => {
      if (value.format === "number") {
        const num = Number(value.value);
        return Number.isFinite(num) ? formatNumber(num, 2) : String(value.value);
      }
      if (value.format === "currency") {
        const num = Number(value.value);
        return Number.isFinite(num) ? formatMoney(num) : String(value.value);
      }
      if (value.format === "percentage") {
        const num = Number(value.value);
        return Number.isFinite(num) ? formatPercentage(num, 1) : String(value.value);
      }
      return String(value.value);
    },
    [formatMoney]
  );

  const handleCopy = useCallback(async () => {
    const text = result.sections
      .flatMap((section) =>
        section.values.map((v) => `${v.label}: ${formatResultValue(v)}`)
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, [result, formatResultValue]);

  const handleShare = useCallback(async () => {
    const text = result.sections
      .flatMap((section) =>
        section.values.map((v) => `${v.label}: ${formatResultValue(v)}`)
      )
      .join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ text });
      }
    } catch {
      // Share not available
    }
  }, [result, formatResultValue]);

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Primary result */}
      {result.sections
        .filter((s) => s.values.some((v) => v.primary))
        .map((section) => (
          <div key={section.id} className="space-y-2">
            {section.values
              .filter((v) => v.primary)
              .map((v) => (
                <div key={v.id}>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted dark:text-dark-text-muted">
                    {v.label}
                  </p>
                  <p className="result-primary mt-1 text-accent-700 dark:text-accent-300">
                    {formatResultValue(v)}
                  </p>
                  {v.description && (
                    <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                      {v.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        ))}

      {/* Secondary results */}
      {result.sections
        .filter((s) => !s.values.some((v) => v.primary))
        .map((section) => (
          <div key={section.id} className="space-y-3">
            {section.title && (
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                {section.title}
              </h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {section.values.map((v) => (
                <div
                  key={v.id}
                  className="rounded-lg border border-border bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-surface"
                >
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">{v.label}</p>
                  <p className="mt-0.5 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                    {formatResultValue(v)}
                  </p>
                  {v.description && (
                    <p className="mt-0.5 text-xs text-text-secondary dark:text-dark-text-secondary">
                      {v.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Charts - type-aware rendering via reusable visualization system */}
      {[result.chart, ...(result.charts ?? [])].filter((c): c is NonNullable<typeof c> => Boolean(c)).map((chart, i) => (
        <div key={i} className="space-y-3">
          {chart.title && (
            <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {chart.title}
            </h3>
          )}
          <VisualizationRenderer
            config={{
              type: chart.type,
              title: chart.title,
              data: chart.data.map((d) => ({
                label: d.label,
                value: d.value,
                color: d.color,
              })),
              min: chart.min,
              max: chart.max,
              // Monetary calculators use the active currency symbol for chart axis/legend labels.
              unit: money ? symbol : chart.unit,
              xLabels: chart.xLabel ? [chart.xLabel] : undefined,
              yLabel: chart.yLabel,
              milestones: chart.milestones,
              shape: chart.shape,
              steps: chart.steps,
              ariaLabel: chart.ariaLabel,
            } as VisualizationConfig}
          />
        </div>
      ))}

      {/* Interpretation */}
      {result.interpretation && (
        <div className="rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-900 dark:bg-accent-950 dark:text-accent-100">
          {result.interpretation}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="btn-ghost h-10 px-3 text-xs"
          aria-label="Copy results"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="btn-ghost h-10 px-3 text-xs"
          aria-label="Share results"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          Share
        </button>
      </div>
    </div>
  );
}