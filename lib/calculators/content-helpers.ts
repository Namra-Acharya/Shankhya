/**
 * Reusable content builders for calculator pages.
 * Generates deep, calculator-specific content from parameters.
 * Each calculator passes its own unique values — no generic filler.
 */

import type { CalculatorContent } from "@/lib/calculators/types";

interface ContentParams {
  /** What the calculator does and who uses it */
  summary: string;
  /** Step-by-step usage instructions */
  howToUse: string[];
  /** Plain-language interpretation of the result */
  interpretation: string;
  /** The formula in display form */
  formula: string;
  /** Formula variables */
  variables: { symbol: string; name: string; description: string }[];
  /** Worked example */
  example: {
    title: string;
    inputs: Record<string, string | number>;
    steps: string[];
    result: string;
  };
  /** Factors that change the result */
  factors: string[];
  /** Edge cases */
  edgeCases: string[];
  /** Common mistakes */
  commonMistakes: string[];
  /** Assumptions */
  assumptions: string[];
  /** Limitations */
  limitations: string[];
  /** FAQs */
  faqs: { question: string; answer: string }[];
  /** Real-world use cases (optional, merged into factors) */
  useCases?: string[];
}

/**
 * Builds a complete CalculatorContent object from structured parameters.
 * Ensures every calculator has deep, unique, people-first content.
 */
export function buildContent(params: ContentParams): CalculatorContent {
  const allFactors = [...(params.useCases ?? []), ...params.factors];
  return {
    summary: params.summary,
    howToUse: params.howToUse,
    interpretation: params.interpretation,
    formula: params.formula,
    variables: params.variables,
    example: params.example,
    factors: allFactors,
    edgeCases: params.edgeCases,
    commonMistakes: params.commonMistakes,
    assumptions: params.assumptions,
    limitations: params.limitations,
    faqs: params.faqs,
  };
}

/**
 * Builds content for a simple formula-based calculator (science, math, etc.)
 * with a consistent but calculator-specific structure.
 */
export function buildFormulaContent(params: ContentParams): CalculatorContent {
  return buildContent(params);
}