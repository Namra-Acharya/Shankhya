"use client";

import type { CalculatorInput as CalculatorInputType } from "@/lib/calculators/types";

interface CalculatorInputProps {
  input: CalculatorInputType;
  value: string | number | boolean | undefined;
  error?: string;
  onChange: (id: string, value: string | number | boolean) => void;
}

export function CalculatorInput({ input, value, error, onChange }: CalculatorInputProps) {
  const inputId = `input-${input.id}`;
  const describedBy = [
    input.hint ? `${inputId}-hint` : null,
    error ? `${inputId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    if (input.type === "checkbox") {
      onChange(input.id, (e.target as HTMLInputElement).checked);
    } else {
      onChange(input.id, val);
    }
  };

  const commonProps = {
    id: inputId,
    "aria-label": input.label,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : undefined,
    className: `input ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`,
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="input-label">
        {input.label}
        {input.unit && (
          <span className="ml-1 text-text-muted dark:text-dark-text-muted">({input.unit})</span>
        )}
      </label>

      {input.type === "dropdown" && input.options ? (
        <select
          {...commonProps}
          className={`select ${error ? "border-red-500" : ""}`}
          value={(value as string) ?? ""}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {input.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : input.type === "radio" && input.options ? (
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={input.label}>
          {input.options.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm transition-colors hover:bg-surface-secondary has-[:checked]:border-accent-500 has-[:checked]:bg-accent-50 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-secondary dark:has-[:checked]:border-accent-400 dark:has-[:checked]:bg-accent-950"
            >
              <input
                type="radio"
                name={input.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(input.id, opt.value)}
                className="h-4 w-4 accent-accent-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : input.type === "checkbox" ? (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleChange}
            className="h-4 w-4 rounded accent-accent-600"
          />
          {input.label}
        </label>
      ) : input.type === "date" ? (
        <input
          type="date"
          {...commonProps}
          value={(value as string) ?? ""}
          onChange={handleChange}
        />
      ) : input.type === "time" ? (
        <input
          type="time"
          {...commonProps}
          value={(value as string) ?? ""}
          onChange={handleChange}
        />
      ) : input.type === "slider" ? (
        <div className="space-y-2">
          <input
            type="range"
            {...commonProps}
            min={input.validation?.min ?? 0}
            max={input.validation?.max ?? 100}
            step="any"
            value={(value as number) ?? input.defaultValue ?? 0}
            onChange={(e) => onChange(input.id, parseFloat(e.target.value))}
            className="w-full accent-accent-600"
          />
          <div className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
            {(value as number) ?? input.defaultValue ?? 0}
            {input.unit ? ` ${input.unit}` : ""}
          </div>
        </div>
      ) : (
        <div className="relative">
          {input.unit && input.type === "currency" && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted dark:text-dark-text-muted">
              {input.unit}
            </span>
          )}
          <input
            type="text"
            inputMode={
              input.type === "number" || input.type === "decimal" || input.type === "percentage" || input.type === "currency"
                ? "decimal"
                : "text"
            }
            {...commonProps}
            className={`${commonProps.className} ${input.unit && input.type === "currency" ? "pl-8" : ""}`}
            placeholder={input.placeholder}
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
          {input.unit && input.type !== "currency" && (
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted dark:text-dark-text-muted">
              {input.unit}
            </span>
          )}
        </div>
      )}

      {input.hint && !error && (
        <p id={`${inputId}-hint`} className="input-hint">
          {input.hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}