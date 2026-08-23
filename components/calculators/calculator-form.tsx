"use client";

import { useCallback, useMemo, useState } from "react";
import { Calculator as CalculatorIcon, RotateCcw } from "lucide-react";

import type { CalculatorResult, CalculatorValues } from "@/lib/calculators/types";
import { expandInputs } from "@/lib/calculators/types";
import { getDefaultValues, validateCalculator } from "@/lib/utils/validation";
import { getClientCalculator } from "@/lib/calculators/client-registry";
import { CalculatorInput } from "@/components/calculators/calculator-input";
import { CalculatorResultView } from "@/components/calculators/calculator-result";
import { StandardCalculator, ScientificCalculator } from "@/components/calculators/calculator-visual";

interface CalculatorFormProps {
  slug: string;
}

export function CalculatorForm({ slug }: CalculatorFormProps) {
  const calculator = useMemo(() => getClientCalculator(slug), [slug]);
  const [values, setValues] = useState<CalculatorValues>(() =>
    getDefaultValues(calculator?.inputs ?? [])
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const visibleInputs = useMemo(() => {
    if (!calculator) return [];
    return calculator.inputs.filter((input) => {
      if (!input.showWhen) return true;
      const conditionValue = values[input.showWhen.inputId];
      if (input.showWhen.equals !== undefined && conditionValue !== input.showWhen.equals) {
        return false;
      }
      if (input.showWhen.notEquals !== undefined && conditionValue === input.showWhen.notEquals) {
        return false;
      }
      return true;
    });
  }, [calculator, values]);

  const handleChange = useCallback((id: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setResult(null);
    setHasCalculated(false);
  }, []);

  const handleCalculate = useCallback(() => {
    if (!calculator) return;

    const validationErrors = validateCalculator(calculator.inputs, values);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      for (const err of validationErrors) {
        errorMap[err.inputId] = err.message;
      }
      setErrors(errorMap);
      setResult(null);
      setHasCalculated(true);
      return;
    }

    setErrors({});
    const calcResult = calculator.calculate(values);
    setResult(calcResult);
    setHasCalculated(true);
  }, [calculator, values]);

  const handleReset = useCallback(() => {
    if (!calculator) return;
    setValues(getDefaultValues(calculator.inputs));
    setErrors({});
    setResult(null);
    setHasCalculated(false);
  }, [calculator]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      handleCalculate();
    }
  };

  if (!calculator) {
    return null;
  }

  // Render visual calculator for standard and scientific
  if (calculator.id === "standard") {
    return (
      <div className="calculator-surface overflow-hidden">
        <div className="border-b border-border px-4 py-4 sm:px-6 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="h-4 w-4 text-accent-600 dark:text-accent-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {calculator.name}
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <StandardCalculator />
        </div>
      </div>
    );
  }

  if (calculator.id === "scientific") {
    return (
      <div className="calculator-surface overflow-hidden">
        <div className="border-b border-border px-4 py-4 sm:px-6 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="h-4 w-4 text-accent-600 dark:text-accent-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {calculator.name}
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <ScientificCalculator />
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-surface overflow-hidden">
      <div className="border-b border-border px-4 py-4 sm:px-6 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="h-4 w-4 text-accent-600 dark:text-accent-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
            {calculator.name}
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-6" onKeyDown={handleKeyDown}>
        <div className="grid gap-5 sm:grid-cols-2">
          {expandInputs(visibleInputs, values).map((input) => (
            <div key={input.id} className={input.fullWidth ? "sm:col-span-2" : ""}>
              <CalculatorInput
                input={input}
                value={values[input.id]}
                error={errors[input.id]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleCalculate} className="btn-primary h-14 flex-1 sm:h-12">
            <CalculatorIcon className="h-4 w-4" aria-hidden="true" />
            Calculate
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="border-t border-border bg-surface-secondary/50 px-4 py-6 sm:px-6 dark:border-dark-border dark:bg-dark-secondary/50">
          <CalculatorResultView result={result} />
        </div>
      )}

      {hasCalculated && !result && (
        <div className="border-t border-border px-4 py-6 sm:px-6 dark:border-dark-border">
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Please fix the errors above and try again.
          </p>
        </div>
      )}
    </div>
  );
}