"use client";

import { formatVisualizationValue } from "@/lib/utils/format";

interface GaugeSegment {
  /** Segment label (e.g. "Underweight") */
  label: string;
  /** Start of this segment (inclusive) */
  from: number;
  /** End of this segment (inclusive) */
  to: number;
  /** Accessible category label shown in aria-label */
  category?: string;
}

interface GaugeProps {
  /** Current value displayed on the gauge */
  value: number;
  /** Minimum value (start of gauge) */
  min?: number;
  /** Maximum value (end of gauge) */
  max: number;
  /** Label under the value */
  label?: string;
  /** Accessible description */
  ariaLabel?: string;
  /** Color of the indicator needle */
  color?: string;
  /** Size in px */
  size?: number;
  /** Show unit text after the value */
  unit?: string;
  /**
   * Category segments shown as tick marks below the gauge.
   * Each segment spans a sub-range of [min, max].
   */
  segments?: GaugeSegment[];
  /** Number of decimal places for the displayed value (default 1) */
  decimals?: number;
}

/**
 * A semicircular gauge showing a current value against a range.
 * Used for BMI, percentages, progress scores, etc.
 *
 * Accessible: uses role="img" with aria-label.
 * Responsive: scales with size prop (default 180).
 * Floating-point-safe: displays only the configured decimal precision.
 */
export function Gauge({
  value,
  min = 0,
  max,
  label,
  ariaLabel,
  color = "var(--accent)",
  size = 180,
  unit,
  segments,
  decimals = 1,
}: GaugeProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? (clamped - min) / (max - min) : 0;
  const angle = -90 + pct * 180; // -90 to +90 degrees
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 16;

  const polar = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const start = polar(-90, r);
  const end = polar(90, r);
  const tip = polar(angle, r);

  // Clean, human-readable display value — never expose floating-point artifacts.
  const displayValue = formatVisualizationValue(value, { mode: decimals === 0 ? "number" : decimals === 1 ? "decimal1" : "decimal2", unit: unit ? undefined : undefined });
  const unitSuffix = unit ? ` ${unit}` : "";

  // Find which segment the value falls in, for the aria description.
  let currentSegment: GaugeSegment | undefined;
  if (segments && segments.length > 0) {
    currentSegment = segments.find((seg) => value >= seg.from && value <= seg.to);
  }

  const segLabel = currentSegment?.category ?? currentSegment?.label;
  const fullAriaLabel = ariaLabel
    ?? `${label ?? "Value"}: ${displayValue}${unitSuffix}${segLabel ? `, ${segLabel}` : ""}`;

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={fullAriaLabel}
    >
      <svg width={size} height={size / 2 + (segments && segments.length > 0 ? 24 : 8)} viewBox={`0 0 ${size} ${size / 2 + (segments && segments.length > 0 ? 24 : 8)}`} className="shrink-0">
        {/* Background arc */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="var(--chart-track, #F1F3F5)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Colored arc up to value */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${tip.x} ${tip.y}`}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={color} strokeWidth={3} strokeLinecap="round" />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={5} fill={color} />

        {/* Segment boundary ticks + labels */}
        {segments && segments.length > 0 && segments.map((seg) => {
          const tickAngle = -90 + ((seg.from - min) / (max - min)) * 180;
          const tl = polar(tickAngle, r + 8);
          const tickBottom = polar(tickAngle, r - 10);
          const labelPt = polar(tickAngle, r + 14);
          return (
            <g key={seg.label}>
              <line x1={tl.x} y1={tl.y} x2={tickBottom.x} y2={tickBottom.y} stroke="var(--chart-track, #E5E7EB)" strokeWidth={1.5} />
              <text
                x={labelPt.x}
                y={labelPt.y + 4}
                textAnchor="middle"
                className="fill-text-muted text-[9px] dark:fill-dark-text-muted"
              >
                {seg.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-1 text-center">
        <p className="text-2xl font-semibold tracking-tight text-text-primary dark:text-dark-text-primary">
          {displayValue}
          {unit && <span className="ml-1 text-sm font-normal text-text-muted dark:text-dark-text-muted">{unit}</span>}
        </p>
        {label && <p className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">{label}</p>}
      </div>
    </div>
  );
}
