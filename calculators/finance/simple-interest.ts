/**
 * Simple Interest Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatINR, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  years: number
): { interest: number; amount: number } {
  const interest = (principal * annualRate * years) / 100;
  return { interest, amount: principal + interest };
}

export const simpleInterestCalculator: CalculatorDefinition = {
  id: "simple-interest",
  slug: "simple-interest-calculator",
  name: "Simple Interest Calculator",
  category: "finance",
  shortDescription: "Calculate simple interest on loans and savings.",
  icon: "calculator",
  accent: "finance",
  popularity: 88,

  inputs: [
    {
      id: "principal",
      label: "Principal amount",
      type: "currency",
      unit: "₹",
      placeholder: "50000",
      hint: "The initial amount.",
      example: "e.g. ₹50,000",
      defaultValue: 50000,
      validation: { required: true, min: 100, max: 100000000 },
    },
    {
      id: "rate",
      label: "Annual interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "6",
      hint: "The annual interest rate.",
      example: "e.g. 6% per year",
      defaultValue: 6,
      validation: { required: true, min: 0.1, max: 30 },
    },
    {
      id: "years",
      label: "Time period",
      type: "number",
      unit: "years",
      placeholder: "3",
      hint: "How long the money is invested or borrowed.",
      example: "e.g. 3 years",
      defaultValue: 3,
      validation: { required: true, min: 0.1, max: 50 },
    },
  ],

  calculate: (values) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const years = parseNumber(values.years) ?? 0;

    const { interest, amount } = calculateSimpleInterest(principal, rate, years);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "interest",
              label: "INTEREST EARNED",
              value: formatINR(roundTo(interest)),
              format: "currency",
              primary: true,
              description: `at ${rate}% for ${years} years`,
            },
          ],
        },
        {
          id: "totals",
          title: "Summary",
          values: [
            { id: "principal", label: "Principal", value: formatINR(roundTo(principal)), format: "currency" },
            { id: "amount", label: "Total amount", value: formatINR(roundTo(amount)), format: "currency" },
          ],
        },
      ],
      interpretation: `You will earn ${formatINR(roundTo(interest))} in simple interest on ${formatINR(roundTo(principal))} at ${rate}% for ${years} years. The total amount will be ${formatINR(roundTo(amount))}.`,
    };
  },

  content: {
    summary:
      "The Simple Interest Calculator computes interest on the original principal only. Unlike compound interest, interest is not earned on previously accumulated interest.",
    howToUse: [
      "Enter the principal amount.",
      "Enter the annual interest rate.",
      "Enter the time period in years.",
      "Press Calculate to see the interest and total amount.",
    ],
    interpretation:
      "Simple interest is calculated only on the original principal. The total amount is the principal plus the interest earned over the entire period.",
    formula: "Interest = P × r × t / 100\n\nWhere:\nP = Principal\nr = Annual rate (%)\nt = Time (years)",
    variables: [
      { symbol: "P", name: "Principal", description: "The initial amount." },
      { symbol: "r", name: "Rate", description: "Annual interest rate in percent." },
      { symbol: "t", name: "Time", description: "Period in years." },
    ],
    example: {
      title: "Example: ₹50,000 at 6% for 3 years",
      inputs: { Principal: "₹50,000", Rate: "6%", Period: "3 years" },
      steps: [
        "Interest = 50,000 × 6 × 3 / 100",
        "Interest = 9,00,000 / 100",
        "Interest = ₹9,000",
        "Total = ₹50,000 + ₹9,000 = ₹59,000",
      ],
      result: "Interest = ₹9,000, Total = ₹59,000",
    },
    factors: [
      "Higher principal increases interest proportionally.",
      "Higher rates increase interest linearly.",
      "Longer periods increase interest linearly.",
    ],
    edgeCases: [
      "Zero rate means no interest.",
      "Zero time means no interest.",
      "Simple interest grows linearly, unlike compound interest.",
    ],
    commonMistakes: [
      "Confusing simple and compound interest.",
      "Using months instead of years without converting.",
      "Forgetting to divide by 100 when using percentage rate.",
    ],
    assumptions: [
      "Interest is calculated on the original principal only.",
      "No compounding occurs.",
      "Rate remains constant.",
    ],
    limitations: [
      "Most modern financial products use compound interest.",
      "Simple interest is mainly used for short-term loans and some bonds.",
    ],
    faqs: [
      {
        question: "What is the difference between simple and compound interest?",
        answer:
          "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus previously earned interest, leading to exponential growth.",
      },
      {
        question: "When is simple interest used?",
        answer:
          "Simple interest is commonly used for short-term loans, car loans in some countries, and certain types of bonds and savings products.",
      },
    ],
  },

  relatedCalculators: ["compound-interest", "loan", "fd", "percentage-increase"],

  seo: {
    title: "Simple Interest Calculator – Calculate Interest Easily",
    description:
      "Calculate simple interest on loans and savings. See interest earned and total amount instantly. Free, accurate and easy to use.",
    keywords: ["simple interest calculator", "simple interest", "interest calculator"],
    primaryIntent: "Calculate simple interest",
    secondaryIntents: ["Simple interest on loan", "Simple interest on savings"],
  },
};