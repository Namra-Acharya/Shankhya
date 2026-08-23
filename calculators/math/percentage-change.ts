/**
 * Percentage Change Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const percentageChangeCalculator: CalculatorDefinition = {
  id: "percentage-change",
  slug: "percentage-change-calculator",
  name: "Percentage Change Calculator",
  category: "math",
  shortDescription: "Calculate the percentage change between two values.",
  icon: "trending-up",
  accent: "math",
  popularity: 90,

  inputs: [
    { id: "original", label: "Original value", type: "number", placeholder: "100", defaultValue: 100, validation: { required: true } },
    { id: "newValue", label: "New value", type: "number", placeholder: "150", defaultValue: 150, validation: { required: true } },
  ],

  calculate: (values) => {
    const original = parseNumber(values.original) ?? 0;
    const newValue = parseNumber(values.newValue) ?? 0;
    const change = newValue - original;
    const pct = original !== 0 ? (change / original) * 100 : 0;
    const isIncrease = change > 0;
    const isDecrease = change < 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "pct",
              label: isIncrease ? "PERCENTAGE INCREASE" : isDecrease ? "PERCENTAGE DECREASE" : "NO CHANGE",
              value: formatPercentage(Math.abs(pct), 1),
              format: "percentage",
              primary: true,
              description: `from ${formatNumber(original, 0)} to ${formatNumber(newValue, 0)}`,
            },
          ],
        },
        {
          id: "details",
          title: "Change details",
          values: [
            { id: "change", label: "Absolute change", value: formatNumber(change, 0), format: "number" },
            { id: "original", label: "Original value", value: formatNumber(original, 0), format: "number" },
            { id: "new", label: "New value", value: formatNumber(newValue, 0), format: "number" },
          ],
        },
      ],
      interpretation: `The value changed from ${formatNumber(original, 0)} to ${formatNumber(newValue, 0)}, which is a ${isIncrease ? "increase" : isDecrease ? "decrease" : "no change"} of ${formatPercentage(Math.abs(pct), 1)}.`,
    };
  },

  content: {
    summary: "The Percentage Change Calculator shows how much a value has increased or decreased as a percentage of the original value.",
    howToUse: ["Enter the original value.", "Enter the new value.", "Press Calculate to see the percentage change."],
    interpretation: "The result shows the relative change from the original value. A positive result is an increase, a negative result is a decrease.",
    formula: "Percentage Change = ((New − Original) / Original) × 100",
    variables: [
      { symbol: "New", name: "New value", description: "The value after the change." },
      { symbol: "Original", name: "Original value", description: "The starting value." },
    ],
    example: {
      title: "Example: 100 to 150",
      inputs: { Original: "100", "New value": "150" },
      steps: ["Change = 150 − 100 = 50", "Percentage = 50 / 100 × 100 = 50%"],
      result: "50% increase",
    },
    factors: ["The percentage is relative to the original value.", "A decrease from 100 to 50 is a 50% decrease."],
    edgeCases: ["If the original value is 0, percentage change is undefined.", "Equal values result in 0% change."],
    commonMistakes: ["Calculating percentage relative to the new value instead of the original."],
    assumptions: ["The original value is the reference point."],
    limitations: ["Percentage change can be misleading for very small original values."],
    faqs: [
      { question: "What is the difference between percentage change and percentage points?", answer: "Percentage change is relative to the original value. Percentage points measure the absolute difference between two percentages." },
    ],
  },

  relatedCalculators: ["percentage", "discount", "average", "ratio"],
  seo: {
    title: "Percentage Change Calculator – Calculate % Increase or Decrease",
    description: "Calculate the percentage change between two values. See increases, decreases and absolute changes. Free, instant and accurate.",
    keywords: ["percentage change calculator", "percent change", "percentage increase decrease"],
    primaryIntent: "Calculate percentage change between two values",
    secondaryIntents: ["Percent increase", "Percent decrease", "Relative change"],
  },
};