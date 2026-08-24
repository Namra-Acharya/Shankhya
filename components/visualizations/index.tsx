"use client";

import { useId } from "react";
import { Gauge } from "@/components/visualizations/gauge";

// ============ TYPES ============

export interface VisualizationDatum {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

export interface VisualizationConfig {
  type:
    | "gauge"
    | "progress"
    | "line"
    | "bar"
    | "donut"
    | "timeline"
    | "comparison"
    | "geometry"
    | "steps";
  title?: string;
  data: VisualizationDatum[];
  /** Gauge only */
  min?: number;
  max?: number;
  unit?: string;
  /** Gauge only: category segments shown as ticks */
  segments?: { label: string; from: number; to: number; category?: string }[];
  /** Gauge only: decimal places for displayed value */
  decimals?: number;
  /** Line chart: x labels */
  xLabels?: string[];
  /** Line chart: y axis label */
  yLabel?: string;
  /** Bar chart: labels for secondary series */
  groupLabels?: string[];
  /** Timeline milestones */
  milestones?: { label: string; date?: string; value?: number }[];
  /** Geometry: shape name */
  shape?: "rectangle" | "triangle" | "circle";
  /** Steps for calculation progression */
  steps?: string[];
}

// ============ SHARED HELPERS ============

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function formatDisplay(n: number, unit?: string): string {
  let s: string;
  if (Math.abs(n) >= 1_000_000) s = `${(n / 1_000_000).toFixed(1)}M`;
  else if (Math.abs(n) >= 1_000) s = `${(n / 1_000).toFixed(1)}k`;
  else s = Number(n.toFixed(1)).toString();
  return unit ? `${unit}${s}` : s;
}

// ============ PROGRESS BAR ============

export function ProgressBar({
  value,
  max = 100,
  label,
  color = "var(--accent)",
  showLabel = true,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showLabel?: boolean;
}) {
  const pct = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-text-secondary dark:text-dark-text-secondary">{label}</span>
          {showLabel && (
            <span className="font-medium text-text-primary dark:text-dark-text-primary">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary dark:bg-dark-secondary"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============ LINE CHART ============

export function LineChart({
  data,
  xLabels,
  yLabel,
  height = 160,
}: {
  data: VisualizationDatum[];
  xLabels?: string[];
  yLabel?: string;
  height?: number;
}) {
  const id = useId().replace(/:/g, "");
  if (data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = Math.max(maxVal - minVal, 1);
  const w = 600;
  const h = height;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * innerW,
    y: pad.t + (1 - (d.value - minVal) / range) * innerH,
  }));

  const linePath = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pad.t + innerH} L ${pts[0].x} ${pad.t + innerH} Z`;

  return (
    <div role="img" aria-label={yLabel ?? "Line chart"}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: "auto" }}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + (1 - f) * innerH}
            y2={pad.t + (1 - f) * innerH}
            stroke="var(--chart-track, #E5E7EB)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Area */}
        <path d={areaPath} fill={`url(#grad-${id})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />

        {/* Points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
        ))}

        {/* X labels */}
        {(xLabels ?? data.map((d) => d.label)).map((label, i) => (
          <text
            key={i}
            x={pts[i]?.x ?? 0}
            y={h - 8}
            textAnchor="middle"
            className="fill-text-muted text-[10px] dark:fill-dark-text-muted"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ============ BAR CHART ============

export function BarChart({
  data,
  height = 160,
  unit,
}: {
  data: VisualizationDatum[];
  height?: number;
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" role="img" aria-label="Bar chart">
      {data.map((d) => {
        const h = Math.max((d.value / max) * height, 3);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] text-text-muted dark:text-dark-text-muted">
              {formatDisplay(d.value, unit)}
            </span>
            <div className="flex w-full items-end justify-center" style={{ height }}>
              <div
                className="w-full max-w-[50px] rounded-t-md transition-all duration-300"
                style={{ height: h, backgroundColor: d.color || "var(--accent)" }}
              />
            </div>
            <span className="text-xs text-text-muted dark:text-dark-text-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============ DONUT CHART ============

export function DonutChart({
  data,
  size = 160,
}: {
  data: VisualizationDatum[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + Math.max(d.value, 0), 0) || 1;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Precompute cumulative offsets without mutating during render
  const segments = data.map((d, i) => {
    const fraction = Math.max(d.value, 0) / total;
    const dash = fraction * circumference;
    const offset = data
      .slice(0, i)
      .reduce((sum, prev) => sum + (Math.max(prev.value, 0) / total) * circumference, 0);
    return { ...d, dash, offset };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--chart-track, #F1F3F5)"
          strokeWidth={stroke}
        />
        {segments.map((d) => (
          <circle
            key={d.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={d.color || "var(--accent)"}
            strokeWidth={stroke}
            strokeDasharray={`${d.dash} ${circumference - d.dash}`}
            strokeDashoffset={-d.offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <div className="space-y-2">
        {data.map((d) => {
          const pct = total > 0 ? ((Math.max(d.value, 0) / total) * 100).toFixed(1) : "0";
          return (
            <div key={d.label} className="flex items-center gap-2.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: d.color || "var(--accent)" }}
                aria-hidden="true"
              />
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{d.label}</span>
              <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ TIMELINE ============

export function Timeline({
  milestones,
  unit,
}: {
  milestones: { label: string; date?: string; value?: number }[];
  unit?: string;
}) {
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border dark:bg-dark-border" aria-hidden="true" />
      <ul className="space-y-4">
        {milestones.map((m, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -left-5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent-500 bg-surface dark:bg-dark-surface"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">{m.label}</p>
            {m.date && <p className="text-xs text-text-muted dark:text-dark-text-muted">{m.date}</p>}
            {m.value !== undefined && (
              <p className="text-sm font-semibold text-accent-700 dark:text-accent-400">{formatDisplay(m.value, unit)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============ COMPARISON ============

export function Comparison({
  data,
  unit,
}: {
  data: VisualizationDatum[];
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue ?? 0)), 1);
  return (
    <div className="space-y-4">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        const pct2 = d.secondaryValue !== undefined ? (d.secondaryValue / max) * 100 : undefined;
        return (
          <div key={d.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-text-secondary dark:text-dark-text-secondary">{d.label}</span>
              <span className="font-medium text-text-primary dark:text-dark-text-primary">
                {formatDisplay(d.value, unit)}
                {d.secondaryValue !== undefined && ` vs ${formatDisplay(d.secondaryValue, unit)}`}
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary dark:bg-dark-secondary">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: d.color || "var(--accent)" }}
                />
              </div>
              {pct2 !== undefined && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary dark:bg-dark-secondary">
                  <div
                    className="h-full rounded-full bg-text-muted/40 dark:bg-dark-text-muted/40"
                    style={{ width: `${pct2}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============ GEOMETRY DIAGRAM ============

export function GeometryDiagram({
  shape,
  labels,
  values,
}: {
  shape: "rectangle" | "triangle" | "circle";
  labels?: string[];
  values?: number[];
}) {
  return (
    <div className="flex justify-center py-2" role="img" aria-label={`${shape} geometry diagram`}>
      {shape === "rectangle" && (
        <svg viewBox="0 0 200 120" className="h-32" aria-hidden="true">
          <rect x="20" y="20" width="160" height="80" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="2" />
          {labels?.[0] && <text x="100" y="112" textAnchor="middle" className="fill-text-muted text-xs">{labels[0]}</text>}
        </svg>
      )}
      {shape === "triangle" && (
        <svg viewBox="0 0 200 140" className="h-36" aria-hidden="true">
          <polygon points="100,20 20,120 180,120" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="2" />
          {labels?.[0] && <text x="100" y="132" textAnchor="middle" className="fill-text-muted text-xs">{labels[0]}</text>}
        </svg>
      )}
      {shape === "circle" && (
        <svg viewBox="0 0 140 140" className="h-32" aria-hidden="true">
          <circle cx="70" cy="70" r="55" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="2" />
          {labels?.[0] && <text x="70" y="132" textAnchor="middle" className="fill-text-muted text-xs">{labels[0]}</text>}
        </svg>
      )}
    </div>
  );
}

// ============ STEPS ============

export function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[10px] font-semibold text-accent-700 dark:bg-accent-950 dark:text-accent-400">
            {i + 1}
          </span>
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{step}</span>
        </li>
      ))}
    </ol>
  );
}

// ============ RECONCILER ============

/**
 * Renders any visualization config. Used internally by the result view.
 * This is the central switch for the reusable visualization system.
 */
export function VisualizationRenderer({ config }: { config: VisualizationConfig }) {
  switch (config.type) {
    case "gauge":
      if (config.data.length === 0) return null;
      return (
        <Gauge
          value={config.data[0].value}
          min={config.min ?? 0}
          max={config.max ?? 100}
          label={config.title}
          unit={config.unit}
          segments={config.segments}
          decimals={config.decimals}
        />
      );
    case "progress":
      return (
        <div className="space-y-3">
          {config.data.map((d) => (
            <ProgressBar key={d.label} value={d.value} max={d.secondaryValue ?? 100} label={d.label} color={d.color} />
          ))}
        </div>
      );
    case "line":
      return <LineChart data={config.data} xLabels={config.xLabels} yLabel={config.yLabel} />;
    case "bar":
      return <BarChart data={config.data} unit={config.unit} />;
    case "donut":
      return <DonutChart data={config.data} />;
    case "timeline":
      return <Timeline milestones={config.milestones ?? config.data.map((d) => ({ label: d.label, value: d.value }))} unit={config.unit} />;
    case "comparison":
      return <Comparison data={config.data} unit={config.unit} />;
    case "geometry":
      return <GeometryDiagram shape={config.shape ?? "rectangle"} labels={config.data.map((d) => d.label)} />;
    case "steps":
      return <Steps steps={config.steps ?? config.data.map((d) => d.label)} />;
    default:
      return null;
  }
}

export { Gauge };