/**
 * Percentage Increase Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const percentageIncreaseCalculator: CalculatorDefinition = {
  id: "percentage-increase",
  slug: "percentage-increase-calculator",
  name: "Percentage Increase Calculator",
  category: "finance",
  shortDescription: "Calculate the percentage increase or decrease between two values.",
  icon: "trending-up",
  accent: "finance",
  popularity: 82,

  inputs: [
    {
      id: "original",
      label: "Original value",
      type: "number",
      placeholder: "100",
      hint: "The starting value.",
      example: "e.g. 100",
      defaultValue: 100,
      validation: { required: true, min: 0 },
    },
    {
      id: "newValue",
      label: "New value",
      type: "number",
      placeholder: "150",
      hint: "The value after the change.",
      example: "e.g. 150",
      defaultValue: 150,
      validation: { required: true, min: 0 },
    },
  ],

  calculate: (values) => {
    const original = parseNumber(values.original) ?? 0;
    const newValue = parseNumber(values.newValue) ?? 0;

    const change = newValue - original;
    const percentageChange = original !== 0 ? (change / original) * 100 : 0;
    const isIncrease = change > 0;
    const isDecrease = change < 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "percentage",
              label: isIncrease ? "PERCENTAGE INCREASE" : isDecrease ? "PERCENTAGE DECREASE" : "NO CHANGE",
              value: formatPercentage(Math.abs(percentageChange), 1),
              format: "percentage",
              primary: true,
              description: `from ${formatNumber(original, 0)} to ${formatNumber(newValue, 0)}`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Change breakdown",
          values: [
            { id: "change", label: "Absolute change", value: formatNumber(change, 0), format: "number" },
            { id: "original", label: "Original value", value: formatNumber(original, 0), format: "number" },
            { id: "newValue", label: "New value", value: formatNumber(newValue, 0), format: "number" },
          ],
        },
      ],
      interpretation: `The value changed from ${formatNumber(original, 0)} to ${formatNumber(newValue, 0)}, which is a ${isIncrease ? "increase" : isDecrease ? "decrease" : "no change"} of ${formatPercentage(Math.abs(percentageChange), 1)}.`,
    };
  },

  content: {
    summary:
      "The Percentage Increase Calculator shows the percentage change between two values. It works for both increases and decreases.",
    howToUse: [
      "Enter the original value.",
      "Enter the new value.",
      "Press Calculate to see the percentage change.",
    ],
    interpretation:
      "The result shows how much the value changed as a percentage of the original. A positive result is an increase, a negative result is a decrease.",
    formula: "Percentage Change = (New − Original) / Original × 100",
    variables: [
      { symbol: "New", name: "New value", description: "The value after the change." },
      { symbol: "Original", name: "Original value", description: "The starting value." },
    ],
    example: {
      title: "Example: 100 to 150",
      inputs: { Original: "100", "New value": "150" },
      steps: [
        "Change = 150 − 100 = 50",
        "Percentage = 50 / 100 × 100 = 50%",
      ],
      result: "50% increase",
    },
    factors: [
      "The percentage is relative to the original value.",
      "A decrease from 100 to 50 is a 50% decrease.",
      "An increase from 50 to 100 is a 100% increase.",
    ],
    edgeCases: [
      "If the original value is 0, percentage change is undefined.",
      "Equal values result in 0% change.",
    ],
    commonMistakes: [
      "Calculating percentage relative to the new value instead of the original.",
      "Confusing percentage points with percentage change.",
    ],
    assumptions: [
      "The original value is the reference point.",
    ],
    limitations: [
      "Percentage change can be misleading for very small original values.",
    ],
    faqs: [
      {
        question: "What is the difference between percentage increase and percentage points?",
        answer:
          "Percentage increase is relative to the original value. Percentage points measure the absolute difference between two percentages. For example, going from 10% to 15% is a 5 percentage point increase but a 50% increase.",
      },
    ],
  },

  relatedCalculators: ["percentage", "gst", "marks-percentage", "exam-percentage"],

  seo: {
    title: "Percentage Increase Calculator – Calculate % Change",
    description:
      "Calculate the percentage increase or decrease between two values. See the exact percentage change instantly. Free, accurate and easy to use.",
    keywords: ["percentage increase calculator", "percentage change", "percent increase"],
    primaryIntent: "Calculate percentage increase or decrease",
    secondaryIntents: ["Percent change between values", "Percentage difference"],
  },
};