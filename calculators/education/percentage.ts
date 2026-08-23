/**
 * Percentage Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const percentageCalculator: CalculatorDefinition = {
  id: "percentage",
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "education",
  shortDescription: "Calculate percentages, percentage of a number, and percentage change.",
  icon: "percent",
  accent: "education",
  featured: true,
  popularity: 98,

  inputs: [
    {
      id: "mode",
      label: "What do you want to calculate?",
      type: "radio",
      defaultValue: "of",
      options: [
        { label: "X% of Y", value: "of" },
        { label: "X is what % of Y", value: "is" },
        { label: "Percentage change", value: "change" },
      ],
    },
    {
      id: "value1",
      label: "First value",
      type: "number",
      placeholder: "20",
      hint: "The percentage or first number.",
      example: "e.g. 20",
      defaultValue: 20,
      validation: { required: true },
    },
    {
      id: "value2",
      label: "Second value",
      type: "number",
      placeholder: "150",
      hint: "The total or second number.",
      example: "e.g. 150",
      defaultValue: 150,
      fullWidth: true,
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const mode = String(values.mode ?? "of");
    const v1 = parseNumber(values.value1) ?? 0;
    const v2 = parseNumber(values.value2) ?? 0;

    let result: number;
    let label: string;
    let interpretation: string;

    if (mode === "of") {
      result = (v1 / 100) * v2;
      label = `${v1}% OF ${v2}`;
      interpretation = `${v1}% of ${formatNumber(v2, 0)} is ${formatNumber(result, 2)}.`;
    } else if (mode === "is") {
      result = v2 !== 0 ? (v1 / v2) * 100 : 0;
      label = `${v1} AS % OF ${v2}`;
      interpretation = `${formatNumber(v1, 0)} is ${formatPercentage(result, 1)} of ${formatNumber(v2, 0)}.`;
    } else {
      result = v1 !== 0 ? ((v2 - v1) / v1) * 100 : 0;
      label = "PERCENTAGE CHANGE";
      interpretation = `The change from ${formatNumber(v1, 0)} to ${formatNumber(v2, 0)} is ${formatPercentage(result, 1)}.`;
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "result",
              label,
              value: mode === "of" ? formatNumber(result, 2) : formatPercentage(result, 1),
              format: mode === "of" ? "number" : "percentage",
              primary: true,
            },
          ],
        },
      ],
      interpretation,
    };
  },

  content: {
    summary:
      "The Percentage Calculator handles three common percentage calculations: finding a percentage of a number, finding what percentage one number is of another, and calculating percentage change.",
    howToUse: [
      "Select the type of percentage calculation you need.",
      "Enter the two values.",
      "Press Calculate to see the result.",
    ],
    interpretation:
      "The result depends on the mode you select. 'X% of Y' finds a portion. 'X is what % of Y' finds a ratio. 'Percentage change' finds the relative change between two values.",
    formula:
      "X% of Y = (X / 100) × Y\n\nX as % of Y = (X / Y) × 100\n\nChange = ((New − Old) / Old) × 100",
    variables: [
      { symbol: "X", name: "First value", description: "The percentage or first number." },
      { symbol: "Y", name: "Second value", description: "The total or second number." },
    ],
    example: {
      title: "Example: What is 20% of 150?",
      inputs: { Mode: "X% of Y", X: "20", Y: "150" },
      steps: [
        "20% of 150 = (20 / 100) × 150",
        "= 0.20 × 150",
        "= 30",
      ],
      result: "30",
    },
    factors: [
      "Percentages are always relative to a base value.",
      "The same percentage can represent very different amounts depending on the base.",
    ],
    edgeCases: [
      "0% of any number is 0.",
      "100% of a number is the number itself.",
      "Division by zero is undefined.",
    ],
    commonMistakes: [
      "Confusing percentage points with percentage change.",
      "Using the wrong base value in calculations.",
    ],
    assumptions: [
      "All values are positive numbers.",
    ],
    limitations: [
      "Percentage change can be misleading when the original value is very small.",
    ],
    faqs: [
      {
        question: "How do I calculate a percentage of a number?",
        answer:
          "Multiply the number by the percentage divided by 100. For example, 20% of 150 = 150 × 0.20 = 30.",
      },
      {
        question: "What is the difference between percentage and percentage points?",
        answer:
          "A percentage is a relative measure. Percentage points measure the absolute difference between two percentages. Going from 10% to 15% is a 5 percentage point increase but a 50% increase.",
      },
    ],
  },

  relatedCalculators: ["marks-percentage", "exam-percentage", "percentage-increase", "cgpa"],

  seo: {
    title: "Percentage Calculator – Calculate % of a Number, % Change",
    description:
      "Calculate percentages easily. Find X% of Y, what percent X is of Y, and percentage change. Free, instant and accurate.",
    keywords: ["percentage calculator", "percent calculator", "percentage of number", "percentage change"],
    primaryIntent: "Calculate percentages",
    secondaryIntents: ["Percentage of a number", "Percentage change", "What percent is X of Y"],
  },
};