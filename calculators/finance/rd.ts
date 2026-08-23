/**
 * RD Calculator - Recurring Deposit maturity value calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatINR, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export function calculateRD(
  monthlyDeposit: number,
  annualRate: number,
  years: number
): { maturityValue: number; invested: number; interestEarned: number } {
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 12 / 100;
  const invested = monthlyDeposit * months;

  if (monthlyRate === 0) {
    return { maturityValue: invested, invested, interestEarned: 0 };
  }

  // Standard RD formula: M = R × ((1+i)^n − 1) / (1 − (1+i)^(−1/3))
  // Simplified: M = R × ((1+i)^n − 1) / i × (1+i)
  const factor = Math.pow(1 + monthlyRate, months);
  const maturityValue = monthlyDeposit * ((factor - 1) / monthlyRate) * (1 + monthlyRate);
  return { maturityValue, invested, interestEarned: maturityValue - invested };
}

export const rdCalculator: CalculatorDefinition = {
  id: "rd",
  slug: "rd-calculator",
  name: "RD Calculator",
  category: "finance",
  shortDescription: "Calculate recurring deposit maturity value and interest earned.",
  icon: "piggy-bank",
  accent: "finance",
  popularity: 85,

  inputs: [
    {
      id: "monthlyDeposit",
      label: "Monthly deposit",
      type: "currency",
      unit: "₹",
      placeholder: "2000",
      hint: "How much you deposit every month.",
      example: "e.g. ₹2,000 per month",
      defaultValue: 2000,
      validation: { required: true, min: 100, max: 10000000 },
    },
    {
      id: "rate",
      label: "Interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "6.5",
      hint: "The annual RD interest rate.",
      example: "e.g. 6.5% per year",
      defaultValue: 6.5,
      validation: { required: true, min: 0.1, max: 15 },
    },
    {
      id: "years",
      label: "Tenure",
      type: "number",
      unit: "years",
      placeholder: "5",
      hint: "How long you will deposit.",
      example: "e.g. 5 years",
      defaultValue: 5,
      validation: { required: true, min: 0.5, max: 20 },
    },
  ],

  calculate: (values) => {
    const monthlyDeposit = parseNumber(values.monthlyDeposit) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const years = parseNumber(values.years) ?? 0;

    const { maturityValue, invested, interestEarned } = calculateRD(monthlyDeposit, rate, years);

    // Growth over time chart
    const chartData: { label: string; value: number; color: string }[] = [];
    for (let y = 1; y <= Math.min(Math.ceil(years), 20); y++) {
      const r = calculateRD(monthlyDeposit, rate, y);
      chartData.push({ label: `Y${y}`, value: roundTo(r.maturityValue, 0), color: "var(--accent)" });
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "maturityValue",
              label: "MATURITY VALUE",
              value: formatINR(roundTo(maturityValue)),
              format: "currency",
              primary: true,
              description: `after ${years} years of ₹${monthlyDeposit.toLocaleString("en-IN")} monthly deposits`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "RD breakdown",
          values: [
            { id: "invested", label: "Total deposited", value: formatINR(roundTo(invested)), format: "currency" },
            { id: "interest", label: "Interest earned", value: formatINR(roundTo(interestEarned)), format: "currency" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Growth over time",
        data: chartData,
      },
      interpretation: `By depositing ${formatINR(roundTo(monthlyDeposit))} every month for ${years} years, your RD will mature to approximately ${formatINR(roundTo(maturityValue))}. You will have deposited ${formatINR(roundTo(invested))} and earned ${formatINR(roundTo(interestEarned))} in interest.`,
    };
  },

  content: {
    summary:
      "The RD Calculator shows the maturity value of a recurring deposit. It calculates how your monthly deposits grow with compound interest over the chosen tenure.",
    howToUse: [
      "Enter your monthly deposit amount.",
      "Enter the RD interest rate.",
      "Enter the tenure in years.",
      "Press Calculate to see your maturity value.",
    ],
    interpretation:
      "The maturity value is the total amount you receive at the end of the RD tenure. It includes all your monthly deposits plus the interest earned through quarterly compounding.",
    formula:
      "Maturity = R × ((1 + i)ⁿ − 1) / i × (1 + i)\n\nWhere:\nR = Monthly deposit\ni = Monthly interest rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "R", name: "Monthly deposit", description: "The amount deposited each month." },
      { symbol: "i", name: "Monthly rate", description: "Annual rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "Total number of monthly deposits." },
    ],
    example: {
      title: "Example: ₹2,000/month at 6.5% for 5 years",
      inputs: { "Monthly deposit": "₹2,000", Rate: "6.5%", Tenure: "5 years" },
      steps: [
        "Monthly rate = 6.5% / 12 = 0.5417% = 0.005417",
        "Months = 5 × 12 = 60",
        "Maturity = 2,000 × ((1.005417)⁶⁰ − 1) / 0.005417 × 1.005417",
        "(1.005417)⁶⁰ ≈ 1.3825",
        "Maturity ≈ 2,000 × 70.62 × 1.005417 ≈ ₹1,41,982",
        "Total deposited = ₹2,000 × 60 = ₹1,20,000",
        "Interest = ₹1,41,982 − ₹1,20,000 = ₹21,982",
      ],
      result: "Maturity value ≈ ₹1,41,982",
    },
    factors: [
      "Higher monthly deposits increase maturity value proportionally.",
      "Higher interest rates increase returns.",
      "Longer tenures allow more compounding.",
    ],
    edgeCases: [
      "Zero interest means maturity equals total deposited.",
      "Very long tenures can significantly boost returns.",
    ],
    commonMistakes: [
      "Confusing RD with FD - RD involves monthly deposits.",
      "Forgetting that RD interest is taxable.",
    ],
    assumptions: [
      "Equal monthly deposits throughout the tenure.",
      "Interest rate remains constant.",
      "No premature withdrawal.",
    ],
    limitations: [
      "Does not account for TDS on interest.",
      "Actual rates vary by bank.",
    ],
    faqs: [
      {
        question: "What is a recurring deposit?",
        answer:
          "A recurring deposit (RD) is a savings product where you deposit a fixed amount every month for a fixed period. It earns compound interest and is considered a low-risk investment.",
      },
      {
        question: "How is RD different from FD?",
        answer:
          "In an FD, you deposit a lump sum once. In an RD, you deposit a fixed amount every month. Both earn compound interest, but RDs are designed for regular savers.",
      },
    ],
  },

  relatedCalculators: ["fd", "compound-interest", "sip", "simple-interest"],

  seo: {
    title: "RD Calculator – Recurring Deposit Maturity & Interest",
    description:
      "Calculate your recurring deposit maturity value and interest earned. See how monthly deposits grow over time. Free, instant and accurate.",
    keywords: ["rd calculator", "recurring deposit calculator", "rd maturity calculator"],
    primaryIntent: "Calculate RD maturity value",
    secondaryIntents: ["RD interest calculation", "Monthly savings growth"],
  },
};