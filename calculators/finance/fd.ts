/**
 * FD Calculator - Fixed Deposit maturity value calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";

export function calculateFD(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number
): { maturityValue: number; interestEarned: number } {
  const rate = annualRate / 100 / compoundsPerYear;
  const periods = compoundsPerYear * years;
  const maturityValue = principal * Math.pow(1 + rate, periods);
  return { maturityValue, interestEarned: maturityValue - principal };
}

export const fdCalculator: CalculatorDefinition = {
  id: "fd",
  slug: "fd-calculator",
  name: "FD Calculator",
  category: "finance",
  shortDescription: "Calculate fixed deposit maturity value and interest earned.",
  icon: "landmark",
  accent: "finance",
  popularity: 87,

  inputs: [
    {
      id: "principal",
      label: "Deposit amount",
      type: "currency",
      unit: "₹",
      placeholder: "100000",
      hint: "The amount you deposit.",
      example: "e.g. ₹1,00,000",
      defaultValue: 100000,
      validation: { required: true, min: 1000, max: 100000000 },
    },
    {
      id: "rate",
      label: "Interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "7",
      hint: "The annual FD interest rate.",
      example: "e.g. 7% per year",
      defaultValue: 7,
      validation: { required: true, min: 0.1, max: 15 },
    },
    {
      id: "years",
      label: "Tenure",
      type: "number",
      unit: "years",
      placeholder: "5",
      hint: "How long the FD is held.",
      example: "e.g. 5 years",
      defaultValue: 5,
      validation: { required: true, min: 0.5, max: 20 },
    },
    {
      id: "compoundsPerYear",
      label: "Compounding frequency",
      type: "dropdown",
      defaultValue: "4",
      options: [
        { label: "Annually (1×)", value: "1" },
        { label: "Semi-annually (2×)", value: "2" },
        { label: "Quarterly (4×)", value: "4" },
        { label: "Monthly (12×)", value: "12" },
      ],
    },
  ],

  calculate: (values, currency = DEFAULT_CURRENCY) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const years = parseNumber(values.years) ?? 0;
    const compoundsPerYear = parseNumber(values.compoundsPerYear) ?? 4;

    const { maturityValue, interestEarned } = calculateFD(principal, rate, years, compoundsPerYear);

    // Growth over time chart
    const chartData: { label: string; value: number; color: string }[] = [];
    for (let y = 1; y <= Math.min(Math.ceil(years), 20); y++) {
      const r = calculateFD(principal, rate, y, compoundsPerYear);
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
              value: roundTo(maturityValue),
              format: "currency",
              primary: true,
              description: `after ${years} years at ${rate}%`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "FD breakdown",
          values: [
            { id: "principal", label: "Deposit amount", value: roundTo(principal), format: "currency" },
            { id: "interest", label: "Interest earned", value: roundTo(interestEarned), format: "currency" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Growth over time",
        data: chartData,
      },
      interpretation: `Your FD of ${formatMoney(roundTo(principal), currency)} will mature to approximately ${formatMoney(roundTo(maturityValue), currency)} after ${years} years, earning ${formatMoney(roundTo(interestEarned), currency)} in interest.`,
    };
  },

  content: {
    summary:
      "The FD Calculator shows the maturity value of a fixed deposit. It calculates how your deposit grows with compound interest over the chosen tenure.",
    howToUse: [
      "Enter the amount you want to deposit.",
      "Enter the FD interest rate offered by the bank.",
      "Enter the tenure in years.",
      "Select the compounding frequency.",
      "Press Calculate to see your maturity value.",
    ],
    interpretation:
      "The maturity value is the total amount you receive at the end of the FD tenure. It includes your original deposit plus all interest earned through compounding.",
    formula:
      "Maturity Value = P × (1 + r/n)^(n×t)\n\nWhere:\nP = Deposit amount\nr = Annual rate (decimal)\nn = Compounding periods per year\nt = Tenure in years",
    variables: [
      { symbol: "P", name: "Deposit", description: "The amount you deposit in the FD." },
      { symbol: "r", name: "Rate", description: "Annual interest rate as a decimal." },
      { symbol: "n", name: "Compounds", description: "Compounding frequency per year." },
      { symbol: "t", name: "Tenure", description: "FD duration in years." },
    ],
    example: {
      title: "Example: ₹1,00,000 at 7% for 5 years (quarterly)",
      inputs: { Deposit: "₹1,00,000", Rate: "7%", Tenure: "5 years", Compounding: "Quarterly" },
      steps: [
        "Quarterly rate = 7% / 4 = 1.75% = 0.0175",
        "Periods = 4 × 5 = 20",
        "Maturity = 1,00,000 × (1.0175)²⁰",
        "(1.0175)²⁰ ≈ 1.4148",
        "Maturity ≈ ₹1,41,478",
        "Interest = ₹1,41,478 − ₹1,00,000 = ₹41,478",
      ],
      result: "Maturity value ≈ ₹1,41,478",
    },
    factors: [
      "Higher deposit amounts increase maturity value proportionally.",
      "Higher interest rates significantly increase returns.",
      "Longer tenures allow more compounding.",
      "More frequent compounding yields slightly higher returns.",
    ],
    edgeCases: [
      "Zero interest rate means maturity equals deposit.",
      "Very long tenures can nearly double the deposit.",
      "Premature withdrawal may incur penalties.",
    ],
    commonMistakes: [
      "Forgetting that FD interest is taxable.",
      "Using simple interest instead of compound.",
      "Not considering the compounding frequency.",
    ],
    assumptions: [
      "Interest rate remains constant for the full tenure.",
      "No premature withdrawal.",
      "Interest is reinvested (cumulative FD).",
    ],
    limitations: [
      "Does not account for TDS on interest.",
      "Actual rates vary by bank and tenure.",
      "Senior citizen rates may be higher.",
    ],
    faqs: [
      {
        question: "What is a fixed deposit?",
        answer:
          "A fixed deposit (FD) is a financial instrument where you deposit a lump sum for a fixed period at a fixed interest rate. It is considered a low-risk investment.",
      },
      {
        question: "Is FD interest taxable?",
        answer:
          "Yes. Interest earned on FDs is taxable as per your income tax slab. Banks may deduct TDS if interest exceeds a certain threshold.",
      },
      {
        question: "What is the difference between cumulative and non-cumulative FD?",
        answer:
          "In a cumulative FD, interest is reinvested and paid at maturity. In a non-cumulative FD, interest is paid out periodically (monthly, quarterly, etc.).",
      },
    ],
  },

  relatedCalculators: ["rd", "compound-interest", "sip", "simple-interest"],

  seo: {
    title: "FD Calculator – Fixed Deposit Maturity Value & Interest",
    description:
      "Calculate your fixed deposit maturity value and interest earned. Compare tenures and compounding frequencies. Free, instant and accurate.",
    keywords: ["fd calculator", "fixed deposit calculator", "fd maturity calculator"],
    primaryIntent: "Calculate FD maturity value",
    secondaryIntents: ["FD interest calculation", "Compare FD tenures"],
  },
};