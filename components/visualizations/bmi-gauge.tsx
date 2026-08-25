"use client";

import { useMemo } from "react";

export interface BmiSegment {
  label: string;
  from: number;
  to: number;
  color: string;
}

/** Shared thresholds: both the calculator logic and this gauge must agree. */
export const BMI_SEGMENTS: BmiSegment[] = [
  { label: "Underweight", from: 0, to: 18.5, color: "#0ea5e9" }, // sky-500
  { label: "Normal", from: 18.5, to: 25, color: "#22c55e" }, // green-500
  { label: "Overweight", from: 25, to: 30, color: "#f59e0b" }, // amber-500
  { label: "Obese", from: 30, to: 40, color: "#ef4444" }, // red-500
];

/** Visualization domain: values outside clamp on the gauge but remain shown textually. */
export const BMI_MIN = 10;
export const BMI_MAX = 40;

interface BmiGaugeProps {
  /** The calculated BMI (may be outside the visual domain). */
  bmi: number;
  /** Human category label e.g. "Normal weight" */
  category: string;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Semi-circular arc for a segment between two BMI values. */
function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a1 = -180 + ((from - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180;
  const a2 = -180 + ((to - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180;
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

export function BmiGauge({ bmi, category }: BmiGaugeProps) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const stroke = 26;

  // Angle of the indicator (clamped for display, but the number is not).
  const clamped = Math.min(Math.max(bmi, BMI_MIN), BMI_MAX);
  const angle = -180 + ((clamped - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180;

  const tickPositions = useMemo(
    () =>
      [18.5, 25, 30].map((v) => ({
        v,
        angle: -180 + ((v - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180,
        inner: polar(cx, cy, r - 14, -180 + ((v - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180),
        outer: polar(cx, cy, r + 14, -180 + ((v - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180),
      })),
    [cx, cy, r]
  );

  const active = useMemo(() => {
    const seg = BMI_SEGMENTS.find((s) => bmi >= s.from && bmi < s.to);
    if (seg) return seg.color;
    return bmi < BMI_MIN ? BMI_SEGMENTS[0].color : BMI_SEGMENTS[BMI_SEGMENTS.length - 1].color;
  }, [bmi]);

  const tip = polar(cx, cy, r, angle);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`BMI gauge. Your BMI is ${bmi.toFixed(1)}, which falls in the ${category} category.`}
    >
      <svg viewBox={`0 0 ${size} ${size / 2 + 40}`} className="w-full max-w-[420px]">
        {/* Background track */}
        <path
          d={arcPath(cx, cy, r, BMI_MIN, BMI_MAX)}
          fill="none"
          stroke="var(--chart-track, #F1F3F5)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Segmented ranges */}
        {BMI_SEGMENTS.map((seg) => (
          <path
            key={seg.label}
            d={arcPath(cx, cy, r, Math.max(seg.from, BMI_MIN), Math.min(seg.to, BMI_MAX))}
            fill="none"
            stroke={seg.color}
            strokeWidth={22}
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}

        {/* Threshold ticks */}
        {tickPositions.map((t) => (
          <g key={t.v}>
            <line x1={t.inner.x} y1={t.inner.y} x2={t.outer.x} y2={t.outer.y} stroke="var(--text-muted, #6B7280)" strokeWidth={1.5} opacity={0.8} />
            <text x={t.outer.x} y={t.outer.y - 8} textAnchor="middle" fontSize="11" className="fill-text-muted dark:fill-dark-text-muted">
              {t.v}
            </text>
          </g>
        ))}

        {/* Value */}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="44" fontWeight="700" className="fill-text-primary dark:fill-dark-text-primary">
          {bmi.toFixed(1)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="13" className="fill-text-muted dark:fill-dark-text-muted">
          kg/m²
        </text>
        <text x={cx} y={cy + 38} textAnchor="middle" fontSize="15" fontWeight="600" fill={active}>
          {category}
        </text>

        {/* Indicator dot (rounded needle) */}
        <circle
          className="bmi-gauge-indicator"
          cx={tip.x}
          cy={tip.y}
          r={7}
          fill={active}
          stroke="var(--surface, #fff)"
          strokeWidth={3}
          style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
    </div>
  );
}