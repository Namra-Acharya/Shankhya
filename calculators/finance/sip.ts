/**
 * SIP Calculator
 * Calculates the future value of systematic investment plan investments.
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";

export function calculateSIP(
  monthlyInvestment: number,
  annualReturn: number,
  years: number
): { invested: number; futureValue: number; wealthGain: number } {
  const monthlyRate = annualReturn / 12 / 100;
  const months = Math.round(years * 12);

  if (monthlyRate === 0) {
    const invested = monthlyInvestment * months;
    return { invested, futureValue: invested, wealthGain: 0 };
  }

  const factor = Math.pow(1 + monthlyRate, months);
  const futureValue = monthlyInvestment * ((factor - 1) / monthlyRate) * (1 + monthlyRate);
  const invested = monthlyInvestment * months;
  return {
    invested,
    futureValue,
    wealthGain: futureValue - invested,
  };
}

export const sipCalculator: CalculatorDefinition = {
  id: "sip",
  slug: "sip-calculator",
  name: "SIP Calculator",
  category: "finance",
  shortDescription: "Calculate the future value of your monthly SIP investments.",
  icon: "trending-up",
  accent: "finance",
  featured: true,
  popularity: 93,

  inputs: [
    {
      id: "monthlyInvestment",
      label: "Monthly investment",
      type: "currency",
      unit: "₹",
      placeholder: "5000",
      hint: "How much you invest every month.",
      example: "e.g. ₹5,000 per month",
      defaultValue: 5000,
      validation: { required: true, min: 100, max: 10000000 },
    },
    {
      id: "annualReturn",
      label: "Expected annual return",
      type: "percentage",
      unit: "%",
      placeholder: "12",
      hint: "The expected annual return on your investment.",
      example: "e.g. 12% per year",
      defaultValue: 12,
      validation: { required: true, min: 1, max: 30 },
    },
    {
      id: "years",
      label: "Investment period",
      type: "number",
      unit: "years",
      placeholder: "10",
      hint: "How long you will continue investing.",
      example: "e.g. 10 years",
      defaultValue: 10,
      validation: { required: true, min: 1, max: 50 },
    },
  ],

  calculate: (values, currency = DEFAULT_CURRENCY) => {
    const monthlyInvestment = parseNumber(values.monthlyInvestment) ?? 0;
    const annualReturn = parseNumber(values.annualReturn) ?? 0;
    const years = parseNumber(values.years) ?? 0;

    const { invested, futureValue, wealthGain } = calculateSIP(
      monthlyInvestment,
      annualReturn,
      years
    );

    const months = Math.round(years * 12);
    const chartData = [];
    for (let y = 1; y <= Math.min(years, 30); y++) {
      const result = calculateSIP(monthlyInvestment, annualReturn, y);
      chartData.push({
        label: `Y${y}`,
        value: roundTo(result.futureValue, 0),
        color: "var(--accent)",
      });
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "futureValue",
              label: "ESTIMATED FUTURE VALUE",
              value: roundTo(futureValue),
              format: "currency",
              primary: true,
              description: `after ${years} years of investing ₹${formatNumber(monthlyInvestment, 0)} per month`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Investment breakdown",
          values: [
            { id: "invested", label: "Total invested", value: roundTo(invested), format: "currency" },
            { id: "wealthGain", label: "Wealth gain", value: roundTo(wealthGain), format: "currency" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Growth over time",
        data: chartData,
      },
      interpretation: `By investing ${formatMoney(roundTo(monthlyInvestment), currency)} every month for ${years} years at ${annualReturn}% annual return, you could accumulate approximately ${formatMoney(roundTo(futureValue), currency)}. Your total investment would be ${formatMoney(roundTo(invested), currency)}, with a wealth gain of ${formatMoney(roundTo(wealthGain), currency)}.`,
    };
  },

  content: {
    summary:
      "The SIP Calculator estimates the future value of your systematic investment plan. It shows how your monthly investments can grow with compound interest over time.",
    howToUse: [
      "Enter your monthly investment amount.",
      "Enter the expected annual return rate.",
      "Enter the number of years you plan to invest.",
      "Press Calculate to see your estimated future value.",
    ],
    interpretation:
      "The future value is an estimate based on the expected return. It includes both your invested amount and the wealth gain from compounding. Actual returns depend on market performance.",
    formula:
      "Future Value = P × ((1 + r)ⁿ − 1) / r × (1 + r)\n\nWhere:\nP = Monthly investment\nr = Monthly return rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Monthly investment", description: "The amount you invest each month." },
      { symbol: "r", name: "Monthly return", description: "Expected annual return divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "Total number of monthly investments." },
    ],
    example: {
      title: "Example: ₹5,000/month at 12% for 10 years",
      inputs: { "Monthly investment": "₹5,000", "Expected return": "12%", "Period": "10 years" },
      steps: [
        "Monthly rate = 12% / 12 = 1% = 0.01",
        "Months = 10 × 12 = 120",
        "Future value = 5,000 × ((1.01)¹²⁰ − 1) / 0.01 × 1.01",
        "(1.01)¹²⁰ ≈ 3.3004",
        "Future value ≈ 5,000 × 2.3004 / 0.01 × 1.01 ≈ ₹11,61,695",
        "Total invested = ₹5,000 × 120 = ₹6,00,000",
        "Wealth gain = ₹11,61,695 − ₹6,00,000 = ₹5,61,695",
      ],
      result: "Future value ≈ ₹11,61,695",
    },
    factors: [
      "Higher monthly investments increase the future value proportionally.",
      "Higher expected returns significantly increase wealth gain.",
      "Longer investment periods allow more time for compounding.",
      "Starting early has a dramatic impact due to compound interest.",
    ],
    edgeCases: [
      "Zero return: future value equals total invested.",
      "Very long periods can produce large future values due to compounding.",
      "Returns are not guaranteed - this is an estimate, not a promise.",
    ],
    commonMistakes: [
      "Using annual return directly instead of dividing by 12.",
      "Confusing total invested with future value.",
      "Assuming guaranteed returns - markets fluctuate.",
    ],
    assumptions: [
      "Equal monthly investments throughout the period.",
      "Constant rate of return (compounded monthly).",
      "No withdrawals during the investment period.",
    ],
    limitations: [
      "Actual returns vary with market conditions.",
      "Does not account for taxes or fund expenses.",
      "Past performance does not guarantee future results.",
    ],
    faqs: [
      {
        question: "What is a SIP?",
        answer:
          "SIP stands for Systematic Investment Plan. It is a method of investing a fixed amount regularly (usually monthly) in mutual funds. SIPs benefit from rupee cost averaging and the power of compounding.",
      },
      {
        question: "Is the SIP return guaranteed?",
        answer:
          "No. SIP returns depend on market performance. The calculator shows an estimate based on the expected return you enter. Actual returns can be higher or lower.",
      },
      {
        question: "When should I start a SIP?",
        answer:
          "The best time to start is as early as possible. The power of compounding means that even small amounts invested early can grow significantly over time.",
      },
    ],
  },

  relatedCalculators: ["compound-interest", "fd", "rd", "simple-interest"],

  seo: {
    title: "SIP Calculator – Estimate Your Investment Growth",
    description:
      "Calculate the future value of your monthly SIP investments. See total invested, wealth gain and growth over time. Free, instant and accurate.",
    keywords: ["sip calculator", "sip return calculator", "monthly investment calculator", "mutual fund sip"],
    primaryIntent: "Calculate SIP future value",
    secondaryIntents: ["SIP wealth gain", "Monthly investment growth", "Compare SIP periods"],
  },
};