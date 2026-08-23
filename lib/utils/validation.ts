/**
 * Input validation utilities for the calculator engine.
 */

import type { CalculatorInput, CalculatorValues } from "@/lib/calculators/types";
import { expandInputs } from "@/lib/calculators/types";

export interface ValidationError {
  inputId: string;
  message: string;
}

export function validateInput(
  input: CalculatorInput,
  value: string | number | boolean | undefined
): string | null {
  if (value === undefined || value === null || value === "") {
    if (input.validation?.required) {
      return input.validation.message || `${input.label} is required.`;
    }
    return null;
  }

  // Only validate numeric inputs
  if (
    input.type === "number" ||
    input.type === "decimal" ||
    input.type === "percentage" ||
    input.type === "currency" ||
    input.type === "slider"
  ) {
    const num = typeof value === "number" ? value : parseFloat(value as string);

    if (Number.isNaN(num)) {
      return `Please enter a valid number for ${input.label.toLowerCase()}.`;
    }

    if (input.validation?.min !== undefined && num < input.validation.min) {
      return (
        input.validation.message ||
        `${input.label} must be at least ${input.validation.min}.`
      );
    }

    if (input.validation?.max !== undefined && num > input.validation.max) {
      return (
        input.validation.message ||
        `${input.label} must be at most ${input.validation.max}.`
      );
    }
  }

  // Date validation
  if (input.type === "date") {
    const dateStr = value as string;
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return `Please enter a valid date for ${input.label.toLowerCase()}.`;
    }

    if (input.validation?.minDate) {
      const minDate = new Date(input.validation.minDate);
      if (date < minDate) {
        return (
          input.validation.message ||
          `${input.label} must be on or after ${minDate.toLocaleDateString("en-IN")}.`
        );
      }
    }

    if (input.validation?.maxDate) {
      const maxDate = new Date(input.validation.maxDate);
      if (date > maxDate) {
        return (
          input.validation.message ||
          `${input.label} must be on or before ${maxDate.toLocaleDateString("en-IN")}.`
        );
      }
    }
  }

  return null;
}

export function validateCalculator(
  inputs: CalculatorInput[],
  values: CalculatorValues
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const input of expandInputs(inputs, values)) {
    // Skip hidden inputs
    if (input.showWhen) {
      const conditionValue = values[input.showWhen.inputId];
      if (input.showWhen.equals !== undefined && conditionValue !== input.showWhen.equals) {
        continue;
      }
      if (input.showWhen.notEquals !== undefined && conditionValue === input.showWhen.notEquals) {
        continue;
      }
    }

    const error = validateInput(input, values[input.id]);
    if (error) {
      errors.push({ inputId: input.id, message: error });
    }
  }

  return errors;
}

export function getDefaultValues(inputs: CalculatorInput[]): CalculatorValues {
  const values: CalculatorValues = {};
  for (const input of inputs) {
    if (input.defaultValue !== undefined) {
      values[input.id] = input.defaultValue;
    }
  }
  return values;
}

export function parseNumber(value: string | number | boolean | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value ? 1 : 0;
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

export function parseDate(value: string | number | boolean | undefined): Date | null {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
}