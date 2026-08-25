/**
 * Core calculator engine types.
 * Every calculator in the platform is defined by these types.
 */

export type CategoryId = "math" | "finance" | "education" | "date-time" | "health" | "construction" | "science";

export type InputType =
  | "number"
  | "decimal"
  | "percentage"
  | "currency"
  | "date"
  | "time"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "slider"
  | "unit"
  | "text";

export interface InputOption {
  label: string;
  value: string;
  hint?: string;
}

export interface InputValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minDate?: string;
  maxDate?: string;
  pattern?: string;
  message?: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  unit?: string;
  placeholder?: string;
  hint?: string;
  example?: string;
  defaultValue?: string | number | boolean;
  options?: InputOption[];
  validation?: InputValidation;
  /** Group inputs into sections */
  group?: string;
  /** Show this input only when a condition is met */
  showWhen?: {
    inputId: string;
    equals?: string | number | boolean;
    notEquals?: string | number | boolean;
  };
  /** Make this input span the full width (below siblings) */
  fullWidth?: boolean;
  /**
   * Repeatable input: renders `count` copies with ids `${id}-${i}`.
   * Used for dynamic subject/course rows. The `count` is taken from
   * the value of `countInputId`.
   */
  repeat?: {
    /** The input id whose numeric value controls how many rows render */
    countInputId: string;
    /** Used as a group label for each row (e.g. "Subject", "Course") */
    rowLabel: string;
    /** Start index for row ids */
    startIndex?: number;
  };
}

/** Resolves repeatable inputs into their concrete rendered rows. */
export function expandInputs(
  inputs: CalculatorInput[],
  values: CalculatorValues
): CalculatorInput[] {
  const expanded: CalculatorInput[] = [];
  for (const input of inputs) {
    if (input.repeat) {
      const count = Math.min(
        Math.max(
          parseInt(String(values[input.repeat.countInputId] ?? ""), 10) || 0,
          0
        ),
        20
      );
      const start = input.repeat.startIndex ?? 1;
      for (let i = start; i < start + count; i++) {
        expanded.push({
          ...input,
          // No hyphen: calculators read `grade1`, `credits1`, `obtained1`, `max1`
          id: `${input.id}${i}`,
          label: `${input.repeat.rowLabel} ${i}`,
          repeat: undefined,
        });
      }
    } else {
      expanded.push(input);
    }
  }
  return expanded;
}

export interface ResultValue {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  /** Format the value with the given formatter */
  format?: "number" | "currency" | "percentage" | "date" | "text";
  /** Whether this is the primary result */
  primary?: boolean;
  /** Additional context shown below the value */
  description?: string;
}

export interface ResultSection {
  id: string;
  title?: string;
  values: ResultValue[];
}

export interface ChartConfig {
  type:
    | "bar"
    | "line"
    | "donut"
    | "timeline"
    | "progress"
    | "gauge"
    | "comparison"
    | "geometry"
    | "steps";
  title?: string;
  data: ChartDataPoint[];
  /** For donut charts: which data points to show */
  donutSegments?: string[];
  /** For line charts: x-axis label */
  xLabel?: string;
  yLabel?: string;
  /** Gauge only: min/max range */
  min?: number;
  max?: number;
  unit?: string;
  /** If true, this chart shows monetary values — labels use the active currency symbol */
  money?: boolean;
  /** Gauge: accessible label override */
  ariaLabel?: string;
  /** Timeline: milestones */
  milestones?: { label: string; date?: string; value?: number }[];
  /** Geometry: shape */
  shape?: "rectangle" | "triangle" | "circle";
  /** Steps */
  steps?: string[];
  /** For comparison: secondary values on datapoints */
  secondaryValues?: number[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface CalculatorResult {
  sections: ResultSection[];
  chart?: ChartConfig;
  /** Additional charts (e.g. donut + line chart together) */
  charts?: ChartConfig[];
  /** Plain-language interpretation of the result */
  interpretation?: string;
  /** ISO 4217 code of the currency used for money-formatted text in this result */
  currency?: string;
}

export interface CalculatorContent {
  /** What this calculator does */
  summary: string;
  /** How to use it */
  howToUse: string[];
  /** What the result means */
  interpretation: string;
  /** Factors in display form */
  formula?: string;
  /** Formula variables explained */
  variables?: { symbol: string; name: string; description: string }[];
  /** Worked example */
  example?: {
    title: string;
    inputs: Record<string, string | number>;
    steps: string[];
    result: string;
  };
  /** Factors that change the result */
  factors?: string[];
  /** Edge cases */
  edgeCases?: string[];
  /** Common mistakes */
  commonMistakes?: string[];
  /** Assumptions */
  assumptions?: string[];
  /** Limitations */
  limitations?: string[];
  /** FAQ */
  faqs?: { question: string; answer: string }[];
  /** Terms the user should know, with inline definitions */
  glossary?: { term: string; definition: string }[];
  /** Real-world scenarios with a short analysis */
  scenarios?: { title: string; situation: string; analysis: string }[];
  /** Related financial concepts users often look for next */
  relatedConcepts?: { title: string; explanation: string; calculatorSlug?: string }[];
  /** What is likely NOT included in the estimate (fees, taxes, etc.) */
  costBreakdown?: { item: string; description: string; included: boolean }[];
}

export interface CalculatorSEO {
  title: string;
  description: string;
  keywords?: string[];
  /** Primary search intent */
  primaryIntent?: string;
  /** Secondary search intents */
  secondaryIntents?: string[];
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  shortDescription: string;
  icon: string;
  /** Category accent color key */
  accent: string;
  inputs: CalculatorInput[];
  calculate: (
    values: Record<string, string | number | boolean>,
    currency?: string
  ) => CalculatorResult;
  content: CalculatorContent;
  relatedCalculators: string[];
  seo: CalculatorSEO;
  /** Whether this calculator is featured on the homepage */
  featured?: boolean;
  /** Popularity rank for sorting */
  popularity?: number;
}

export interface CategoryDefinition {
  id: CategoryId;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  accent: string;
  /** Calculators in this category */
  calculatorIds: string[];
  /** Related categories */
  relatedCategories: CategoryId[];
  seo: {
    title: string;
    description: string;
  };
}

export type CalculatorValues = Record<string, string | number | boolean>;