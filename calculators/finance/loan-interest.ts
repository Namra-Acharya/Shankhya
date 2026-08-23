/**
 * Loan Interest Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatINR, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";
import { calculateEMI } from "@/calculators/finance/emi";

export const loanInterestCalculator: CalculatorDefinition = {
  id: "loan-interest",
  slug: "loan-interest-calculator",
  name: "Loan Interest Calculator",
  category: "finance",
  shortDescription: "Calculate the total interest you will pay on a loan.",
  icon: "percent",
  accent: "finance",
  popularity: 83,

  inputs: [
    {
      id: "principal",
      label: "Loan amount",
      type: "currency",
      unit: "₹",
      placeholder: "500000",
      hint: "The amount you borrow.",
      example: "e.g. ₹5,00,000",
      defaultValue: 500000,
      validation: { required: true, min: 1000, max: 100000000 },
    },
    {
      id: "rate",
      label: "Interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "10",
      hint: "The annual interest rate.",
      example: "e.g. 10% per year",
      defaultValue: 10,
      validation: { required: true, min: 0.1, max: 30 },
    },
    {
      id: "tenure",
      label: "Loan tenure",
      type: "number",
      unit: "years",
      placeholder: "5",
      hint: "How long you repay the loan.",
      example: "e.g. 5 years",
      defaultValue: 5,
      validation: { required: true, min: 0.5, max: 40 },
    },
  ],

  calculate: (values) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const tenureYears = parseNumber(values.tenure) ?? 0;
    const tenureMonths = Math.round(tenureYears * 12);

    const emi = principal > 0 && rate > 0 && tenureMonths > 0
      ? calculateEMI(principal, rate, tenureMonths)
      : 0;
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;
    const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "totalInterest",
              label: "TOTAL INTEREST",
              value: formatINR(roundTo(totalInterest)),
              format: "currency",
              primary: true,
              description: `over ${tenureYears} years at ${rate}%`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Loan breakdown",
          values: [
            { id: "principal", label: "Principal", value: formatINR(roundTo(principal)), format: "currency" },
            { id: "totalPayment", label: "Total payment", value: formatINR(roundTo(totalPayment)), format: "currency" },
            { id: "interestPct", label: "Interest share", value: `${roundTo(interestPercentage, 1)}%`, format: "text" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Principal vs Interest",
        data: [
          { label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" },
          { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" },
        ],
      },
      interpretation: `You will pay ${formatINR(roundTo(totalInterest))} in interest on a loan of ${formatINR(roundTo(principal))} at ${rate}% for ${tenureYears} years. The total payment will be ${formatINR(roundTo(totalPayment))}.`,
    };
  },

  content: {
    summary:
      "The Loan Interest Calculator shows the total interest you will pay over the life of a loan. It helps you understand the true cost of borrowing.",
    howToUse: [
      "Enter the loan amount.",
      "Enter the annual interest rate.",
      "Enter the loan tenure in years.",
      "Press Calculate to see total interest.",
    ],
    interpretation:
      "Total interest is the extra amount you pay beyond the principal. It depends on the interest rate, loan amount, and tenure. Longer tenures mean more interest even with lower monthly payments.",
    formula:
      "Total Interest = Total Payment − Principal\n\nTotal Payment = EMI × Months\n\nEMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)",
    variables: [
      { symbol: "P", name: "Principal", description: "The loan amount." },
      { symbol: "r", name: "Monthly rate", description: "Annual rate ÷ 12 ÷ 100." },
      { symbol: "n", name: "Months", description: "Loan tenure in months." },
    ],
    example: {
      title: "Example: ₹5,00,000 at 10% for 5 years",
      inputs: { "Loan amount": "₹5,00,000", Rate: "10%", Tenure: "5 years" },
      steps: [
        "Monthly rate = 10% / 12 = 0.8333% = 0.008333",
        "Months = 5 × 12 = 60",
        "EMI ≈ ₹10,624",
        "Total payment = ₹10,624 × 60 = ₹6,37,440",
        "Total interest = ₹6,37,440 − ₹5,00,000 = ₹1,37,440",
      ],
      result: "Total interest ≈ ₹1,37,440",
    },
    factors: [
      "Higher interest rates significantly increase total interest.",
      "Longer tenures increase total interest even with lower EMIs.",
      "Higher loan amounts increase total interest proportionally.",
    ],
    edgeCases: [
      "Zero interest means no interest is paid.",
      "Very long tenures can result in interest exceeding the principal.",
    ],
    commonMistakes: [
      "Focusing only on monthly payments without considering total interest.",
      "Not comparing different tenures to see interest impact.",
    ],
    assumptions: [
      "Fixed interest rate.",
      "Equal monthly payments.",
      "No prepayment.",
    ],
    limitations: [
      "Does not include processing fees or other charges.",
      "Floating rates will change the total interest.",
    ],
    faqs: [
      {
        question: "How can I reduce the total interest on my loan?",
        answer:
          "Choose a shorter tenure, make prepayments when possible, or negotiate a lower interest rate. Even small extra payments can significantly reduce total interest.",
      },
      {
        question: "Why is most of my early payment going to interest?",
        answer:
          "In the reducing balance method, interest is calculated on the outstanding balance. Early in the loan, the balance is highest, so most of the payment goes to interest.",
      },
    ],
  },

  relatedCalculators: ["emi", "loan", "compound-interest", "simple-interest"],

  seo: {
    title: "Loan Interest Calculator – Total Interest on Your Loan",
    description:
      "Calculate the total interest you will pay on any loan. See how rate and tenure affect your total cost. Free, instant and accurate.",
    keywords: ["loan interest calculator", "total interest", "loan cost calculator"],
    primaryIntent: "Calculate total loan interest",
    secondaryIntents: ["Compare loan tenures", "Understand loan cost"],
  },
};