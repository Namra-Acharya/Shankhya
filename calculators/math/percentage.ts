/**
 * Percentage Calculator - Universal percentage calculator
 * Handles: % of, is what %, change, increase, decrease, difference, marks, exam
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const percentageCalculator: CalculatorDefinition = {
  id: "percentage",
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "math",
  shortDescription: "Calculate percentages, changes, differences and marks.",
  icon: "percent",
  accent: "math",
  featured: true,
  popularity: 100,

  inputs: [
    {
      id: "mode",
      label: "What do you want to calculate?",
      type: "dropdown",
      defaultValue: "of",
      options: [
        { label: "X% of Y", value: "of" },
        { label: "X is what % of Y?", value: "is" },
        { label: "Percentage change", value: "change" },
        { label: "Percentage increase", value: "increase" },
        { label: "Percentage decrease", value: "decrease" },
        { label: "Percentage difference", value: "difference" },
        { label: "Marks percentage", value: "marks" },
        { label: "Exam percentage", value: "exam" },
      ],
    },
    {
      id: "value1",
      label: "First value",
      type: "number",
      placeholder: "20",
      hint: "The percentage, part, or original value.",
      example: "e.g. 20",
      defaultValue: 20,
      validation: { required: true },
    },
    {
      id: "value2",
      label: "Second value",
      type: "number",
      placeholder: "150",
      hint: "The total, whole, or new value.",
      example: "e.g. 150",
      defaultValue: 150,
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const mode = String(values.mode ?? "of");
    const v1 = parseNumber(values.value1) ?? 0;
    const v2 = parseNumber(values.value2) ?? 0;

    interface CalcResult {
      label: string;
      value: string;
      format: "number" | "percentage";
      interpretation: string;
      isIncrease?: boolean;
      isDecrease?: boolean;
    }

    let r: CalcResult;

    switch (mode) {
      case "of": {
        const result = (v1 / 100) * v2;
        r = {
          label: "RESULT",
          value: formatNumber(result, 2),
          format: "number",
          interpretation: `${v1}% of ${formatNumber(v2, 0)} is ${formatNumber(result, 2)}.`,
        };
        break;
      }
      case "is": {
        const result = v2 !== 0 ? (v1 / v2) * 100 : 0;
        r = {
          label: "PERCENTAGE",
          value: formatPercentage(result, 1),
          format: "percentage",
          interpretation: `${formatNumber(v1, 0)} is ${formatPercentage(result, 1)} of ${formatNumber(v2, 0)}.`,
        };
        break;
      }
      case "change":
      case "increase":
      case "decrease": {
        const change = v2 - v1;
        const result = v1 !== 0 ? (change / v1) * 100 : 0;
        const isIncrease = change > 0;
        const isDecrease = change < 0;
        r = {
          label: isIncrease ? "PERCENTAGE INCREASE" : isDecrease ? "PERCENTAGE DECREASE" : "NO CHANGE",
          value: formatPercentage(Math.abs(result), 1),
          format: "percentage",
          interpretation: `The change from ${formatNumber(v1, 0)} to ${formatNumber(v2, 0)} is a ${isIncrease ? "increase" : isDecrease ? "decrease" : "no change"} of ${formatPercentage(Math.abs(result), 1)}.`,
          isIncrease,
          isDecrease,
        };
        break;
      }
      case "difference": {
        const avg = (v1 + v2) / 2;
        const result = avg !== 0 ? (Math.abs(v2 - v1) / avg) * 100 : 0;
        r = {
          label: "PERCENTAGE DIFFERENCE",
          value: formatPercentage(result, 1),
          format: "percentage",
          interpretation: `The percentage difference between ${formatNumber(v1, 0)} and ${formatNumber(v2, 0)} is ${formatPercentage(result, 1)}.`,
        };
        break;
      }
      case "marks":
      case "exam": {
        const result = v2 !== 0 ? (v1 / v2) * 100 : 0;
        r = {
          label: "SCORE PERCENTAGE",
          value: formatPercentage(result, 1),
          format: "percentage",
          interpretation: `You scored ${formatNumber(v1, 0)} out of ${formatNumber(v2, 0)}, which is ${formatPercentage(result, 1)}.`,
        };
        break;
      }
      default: {
        r = {
          label: "RESULT",
          value: formatNumber(0, 2),
          format: "number",
          interpretation: "Select a calculation mode.",
        };
      }
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "result",
              label: r.label,
              value: r.value,
              format: r.format,
              primary: true,
            },
          ],
        },
        {
          id: "details",
          title: "Calculation details",
          values: [
            { id: "v1", label: "First value", value: formatNumber(v1, 0), format: "number" },
            { id: "v2", label: "Second value", value: formatNumber(v2, 0), format: "number" },
          ],
        },
      ],
      interpretation: r.interpretation,
    };
  },

  content: {
    summary:
      "The Percentage Calculator handles all common percentage calculations: finding a percentage of a number, finding what percentage one number is of another, calculating percentage change, increase, decrease, difference, marks percentage and exam percentage.",
    howToUse: [
      "Select the type of percentage calculation you need from the dropdown.",
      "Enter the two values.",
      "Press Calculate to see the result and explanation.",
    ],
    interpretation:
      "The result depends on the mode you select. Each mode uses the standard percentage formula appropriate for that calculation.",
    formula:
      "X% of Y = (X / 100) × Y\n\nX as % of Y = (X / Y) × 100\n\nChange = ((New − Old) / Old) × 100\n\nDifference = (|A − B| / ((A + B) / 2)) × 100",
    variables: [
      { symbol: "X", name: "First value", description: "The percentage, part, or original value." },
      { symbol: "Y", name: "Second value", description: "The total, whole, or new value." },
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
      "Percentage change is relative to the original value, not the new value.",
    ],
    edgeCases: [
      "0% of any number is 0.",
      "100% of a number is the number itself.",
      "Division by zero is undefined — enter a non-zero total.",
      "Percentage difference uses the average as the base.",
    ],
    commonMistakes: [
      "Calculating percentage change relative to the new value instead of the original.",
      "Confusing percentage points with percentage change.",
      "Using the wrong base value in calculations.",
    ],
    assumptions: [
      "All values are positive numbers.",
      "The original value is the reference point for change calculations.",
    ],
    limitations: [
      "Percentage values can misrepresent absolute differences when bases differ.",
      "Percentage difference is always positive and symmetric.",
    ],
    faqs: [
      {
        question: "How do I calculate a percentage of a number?",
        answer: "Multiply the number by the percentage divided by 100. For example, 20% of 150 = 150 × 0.20 = 30.",
      },
      {
        question: "What is the difference between percentage and percentage points?",
        answer: "A percentage is a relative measure. Percentage points measure the absolute difference between two percentages. Going from 10% to 15% is a 5 percentage point increase but a 50% increase.",
      },
      {
        question: "How is percentage change calculated?",
        answer: "Subtract the original value from the new value, divide by the original value, and multiply by 100. For example, 100 to 125 is a 25% increase.",
      },
      {
        question: "What is the difference between percentage increase and percentage difference?",
        answer: "Percentage increase compares a new value to an original value. Percentage difference compares two values symmetrically using the average as the base.",
      },
    ],
    glossary: [
      { term: "Percent", definition: "A unit expressing a value as parts per hundred. The base can change how large the percentage is in absolute terms." },
      { term: "Base value", definition: "The reference value a percentage is calculated against. Changing the base changes the absolute amount a percentage represents." },
      { term: "Percentage point", definition: "The arithmetic difference between two percentages. Going from 10% to 15% is a 5 percentage point increase, but a 50% relative increase." },
      { term: "Ratio", definition: "A comparison of two quantities. A percentage is a ratio expressed with a denominator of 100." },
      { term: "Proportion", definition: "The relationship of a part to a whole, often written as a fraction or decimal." },
      { term: "Percentage change", definition: "The difference between a new and an original value divided by the original value, then multiplied by 100." },
      { term: "Percentage difference", definition: "The absolute difference between two values divided by their average, multiplied by 100. It is direction-independent." },
    ],
    scenarios: [
      {
        title: "Shopping discount",
        situation: "An item costing ₹2,000 has a 15% discount.",
        analysis: "The discount is 15% of ₹2,000 = ₹300, so the final price is ₹1,700. A later 15% increase on ₹1,700 gives ₹1,955 — not the original ₹2,000 — because the base changed.",
      },
      {
        title: "Exam scores",
        situation: "A student scores 37 out of 50.",
        analysis: "The percentage is 37 ÷ 50 × 100 = 74%. The same ratio across a different total, like 74 out of 100, also gives 74% — percentages make comparisons across totals meaningful.",
      },
      {
        title: "Salary increase",
        situation: "A ₹50,000 salary rises to ₹55,000.",
        analysis: "The increase is 5,000 ÷ 50,000 × 100 = 10%. If the salary later falls 10% from ₹55,000, the new value is ₹49,500 — below where it began.",
      },
      {
        title: "Markup then discount",
        situation: "An item is marked up 50% and then discounted 50%.",
        analysis: "Starting at ₹100, a 50% markup gives ₹150, then a 50% discount gives ₹75. The two moves do not cancel because the percentage applies to a different base each time.",
      },
    ],
    relatedConcepts: [
      {
        title: "Percentage change calculator",
        explanation: "Percentage change is relative to the starting value; the percentage-difference method uses the average of the two values as the base.",
        calculatorSlug: "percentage-change-calculator",
      },
      {
        title: "Discounts and sales",
        explanation: "Discounts reduce an original price by a percentage of that price. Stacking markups and markdowns requires careful attention to the base.",
        calculatorSlug: "discount-calculator",
      },
      {
        title: "Grades and scores",
        explanation: "Marks-based percentages compare marks obtained to the maximum possible total, letting you compare assessments of different sizes.",
        calculatorSlug: "grade-calculator",
      },
      {
        title: "Percentages in finance",
        explanation: "In finance, interest and loan changes are percentages of a principal, so even a 1% rate change can significantly change total cost.",
        calculatorSlug: "loan-calculator",
      },
    ],
  },

  relatedCalculators: ["percentage-change", "discount", "grade", "attendance", "loan", "gst"],

  seo: {
    title: "Percentage Calculator – % of a Number, Change & Difference",
    description:
      "Calculate percentages, percentage changes, increases, decreases, differences, marks and exam scores. Free, instant and accurate.",
    keywords: ["percentage calculator", "percent calculator", "percentage change", "marks percentage", "percentage difference"],
    primaryIntent: "Calculate percentages",
    secondaryIntents: [
      "Percentage of a number",
      "Percentage change",
      "What percent is X of Y",
      "Marks percentage",
      "Exam percentage",
    ],
  },
};