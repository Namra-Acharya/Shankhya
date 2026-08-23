/**
 * Compound Interest Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatINR, formatNumber, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number
): { amount: number; interest: number } {
  if (compoundsPerYear <= 0) {
    const amount = principal * (1 + (annualRate / 100) * years);
    return { amount, interest: amount - principal };
  }
  const rate = annualRate / 100 / compoundsPerYear;
  const periods = compoundsPerYear * years;
  const amount = principal * Math.pow(1 + rate, periods);
  return { amount, interest: amount - principal };
}

export const compoundInterestCalculator: CalculatorDefinition = {
  id: "compound-interest",
  slug: "compound-interest-calculator",
  name: "Compound Interest Calculator",
  category: "finance",
  shortDescription: "Calculate compound interest growth on your savings or investments.",
  icon: "percent",
  accent: "finance",
  featured: true,
  popularity: 90,

  inputs: [
    {
      id: "principal",
      label: "Principal amount",
      type: "currency",
      unit: "₹",
      placeholder: "100000",
      hint: "The initial amount you invest or save.",
      example: "e.g. ₹1,00,000",
      defaultValue: 100000,
      validation: { required: true, min: 100, max: 100000000 },
    },
    {
      id: "rate",
      label: "Annual interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "8",
      hint: "The annual interest rate.",
      example: "e.g. 8% per year",
      defaultValue: 8,
      validation: { required: true, min: 0.1, max: 30 },
    },
    {
      id: "years",
      label: "Time period",
      type: "number",
      unit: "years",
      placeholder: "5",
      hint: "How long the money grows.",
      example: "e.g. 5 years",
      defaultValue: 5,
      validation: { required: true, min: 1, max: 50 },
    },
    {
      id: "compoundsPerYear",
      label: "Compounding frequency",
      type: "dropdown",
      defaultValue: "12",
      options: [
        { label: "Annually (1×)", value: "1" },
        { label: "Semi-annually (2×)", value: "2" },
        { label: "Quarterly (4×)", value: "4" },
        { label: "Monthly (12×)", value: "12" },
        { label: "Daily (365×)", value: "365" },
      ],
    },
  ],

  calculate: (values) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const years = parseNumber(values.years) ?? 0;
    const compoundsPerYear = parseNumber(values.compoundsPerYear) ?? 12;

    const { amount, interest } = calculateCompoundInterest(principal, rate, years, compoundsPerYear);

    const chartData: { label: string; value: number; color: string }[] = [];
    for (let y = 1; y <= Math.min(years, 30); y++) {
      const r = calculateCompoundInterest(principal, rate, y, compoundsPerYear);
      chartData.push({ label: `Y${y}`, value: roundTo(r.amount, 0), color: "var(--accent)" });
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "amount",
              label: "FUTURE VALUE",
              value: formatINR(roundTo(amount)),
              format: "currency",
              primary: true,
              description: `after ${years} years at ${rate}% compounded ${compoundsPerYear}× per year`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Growth breakdown",
          values: [
            { id: "principal", label: "Principal", value: formatINR(roundTo(principal)), format: "currency" },
            { id: "interest", label: "Interest earned", value: formatINR(roundTo(interest)), format: "currency" },
          ],
        },
      ],
      chart: { type: "bar", title: "Growth over time", data: chartData },
      interpretation: `Your ${formatINR(roundTo(principal))} will grow to approximately ${formatINR(roundTo(amount))} after ${years} years. You will earn ${formatINR(roundTo(interest))} in interest.`,
    };
  },

  content: {
    summary:
      "The Compound Interest Calculator shows how your money grows when interest is earned on both the principal and previously earned interest.",
    howToUse: [
      "Enter your initial principal amount.",
      "Enter the annual interest rate.",
      "Enter the time period in years.",
      "Select how often interest is compounded.",
      "Press Calculate to see your future value.",
    ],
    interpretation:
      "The future value includes your original principal plus all interest earned. More frequent compounding results in slightly higher returns because interest is calculated on a larger balance more often.",
    formula:
      "A = P × (1 + r/n)^(n×t)\n\nWhere:\nA = Future value\nP = Principal\nr = Annual interest rate (decimal)\nn = Compounding periods per year\nt = Time in years",
    variables: [
      { symbol: "P", name: "Principal", description: "The initial amount invested." },
      { symbol: "r", name: "Rate", description: "Annual interest rate as a decimal." },
      { symbol: "n", name: "Compounds", description: "How many times interest compounds per year." },
      { symbol: "t", name: "Time", description: "Investment period in years." },
    ],
    example: {
      title: "Example: ₹1,00,000 at 8% for 5 years (monthly compounding)",
      inputs: { Principal: "₹1,00,000", Rate: "8%", Period: "5 years", Compounding: "Monthly" },
      steps: [
        "Monthly rate = 8% / 12 = 0.6667% = 0.006667",
        "Periods = 12 × 5 = 60",
        "A = 1,00,000 × (1.006667)⁶⁰",
        "(1.006667)⁶⁰ ≈ 1.4898",
        "A ≈ ₹1,48,984",
        "Interest = ₹1,48,984 − ₹1,00,000 = ₹48,984",
      ],
      result: "Future value ≈ ₹1,48,984",
    },
    factors: [
      "Higher principal amounts grow proportionally.",
      "Higher interest rates dramatically increase growth.",
      "Longer time periods allow more compounding cycles.",
      "More frequent compounding yields slightly higher returns.",
    ],
    edgeCases: [
      "Simple interest (compounds = 1) gives the lowest growth.",
      "Daily compounding gives the highest growth among common frequencies.",
      "Zero interest means no growth.",
    ],
    commonMistakes: [
      "Using the annual rate without dividing by compounding periods.",
      "Forgetting that compound interest grows exponentially, not linearly.",
      "Confusing simple and compound interest.",
    ],
    assumptions: [
      "Interest rate remains constant.",
      "No additional deposits or withdrawals.",
      "Interest is reinvested (not withdrawn).",
    ],
    limitations: [
      "Actual returns may vary, especially for market-linked investments.",
      "Does not account for taxes on interest earned.",
      "Inflation reduces the real value of future money.",
    ],
    faqs: [
      {
        question: "What is compound interest?",
        answer:
          "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. This creates exponential growth over time.",
      },
      {
        question: "How often should interest compound?",
        answer:
          "More frequent compounding (daily or monthly) yields slightly higher returns than annual compounding. However, the difference is small for most practical purposes.",
      },
      {
        question: "What is the rule of 72?",
        answer:
          "The rule of 72 estimates how long it takes to double your money: divide 72 by the annual interest rate. For example, at 8%, money doubles in about 9 years.",
      },
    ],
    glossary: [
      { term: "Principal", definition: "The initial amount of money you invest or save before any interest is added." },
      { term: "Compound interest", definition: "Interest calculated on both the original principal and previously earned interest, creating exponential growth." },
      { term: "Compounding frequency", definition: "How often interest is added to the balance — annually, quarterly, monthly, or daily. More frequent compounding yields slightly higher returns." },
      { term: "Future value", definition: "The total amount your investment will be worth at a future date, including principal and all accumulated interest." },
      { term: "Nominal rate", definition: "The stated annual interest rate before accounting for compounding frequency." },
      { term: "Effective annual rate", definition: "The actual annual return after accounting for how often interest compounds. It is always at least as high as the nominal rate." },
      { term: "Rule of 72", definition: "A quick mental shortcut: divide 72 by the annual interest rate to estimate how many years it takes for money to double." },
    ],
    scenarios: [
      {
        title: "The power of time",
        situation: "Two people each invest ₹1,00,000 at 8% — one for 10 years, the other for 20 years.",
        analysis: "The 10-year investment grows to about ₹2,21,964, while the 20-year investment grows to about ₹4,92,680. Doubling the time more than doubles the result because compounding is exponential, not linear.",
      },
      {
        title: "Compounding frequency matters",
        situation: "₹1,00,000 at 8% for 10 years, compounded annually vs monthly.",
        analysis: "Annual compounding gives about ₹2,15,892; monthly compounding gives about ₹2,21,964. The difference is modest over 10 years but grows with larger amounts and longer periods.",
      },
      {
        title: "Rate sensitivity",
        situation: "₹1,00,000 over 20 years at 6% vs 10%.",
        analysis: "At 6% the result is about ₹3,20,714; at 10% it is about ₹6,72,750. A 4 percentage-point rate difference more than doubles the outcome over 20 years — a powerful illustration of rate sensitivity.",
      },
      {
        title: "Inflation erodes real growth",
        situation: "An investment grows at 8% while inflation runs at 5%.",
        analysis: "The nominal value grows, but the real (inflation-adjusted) growth is roughly 3% per year. Understanding the difference between nominal and real returns is essential for long-term planning.",
      },
    ],
    relatedConcepts: [
      {
        title: "Simple interest",
        explanation: "Simple interest is calculated only on the original principal, so it grows linearly. Compound interest grows exponentially because interest earns interest.",
        calculatorSlug: "simple-interest-calculator",
      },
      {
        title: "Systematic investment plans (SIP)",
        explanation: "A SIP adds regular contributions on top of compounding, which can dramatically accelerate growth compared to a one-time investment.",
        calculatorSlug: "sip-calculator",
      },
      {
        title: "Fixed deposits",
        explanation: "Fixed deposits typically compound interest at a set frequency. Comparing compounding options helps you choose the best return.",
        calculatorSlug: "fd-calculator",
      },
      {
        title: "Inflation and purchasing power",
        explanation: "Inflation reduces what your future money can buy. Adjusting compound-growth projections for inflation gives a more realistic picture of real wealth.",
        calculatorSlug: "inflation-calculator",
      },
    ],
  },

  relatedCalculators: ["sip", "simple-interest", "fd", "rd"],
  seo: {
    title: "Compound Interest Calculator – See Your Money Grow",
    description:
      "Calculate compound interest on your savings or investments. See future value, interest earned and growth over time. Free and instant.",
    keywords: ["compound interest calculator", "compound interest", "investment growth calculator"],
    primaryIntent: "Calculate compound interest growth",
    secondaryIntents: ["Future value of investment", "Interest earned", "Compare compounding frequencies"],
  },
};