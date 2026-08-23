/**
 * EMI Calculator
 * Reference-quality calculator with comprehensive content.
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatINR, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

/**
 * Calculate EMI using the standard reducing-balance formula:
 * EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 * where r = annual rate / 12 / 100, n = tenure in months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export const emiCalculator: CalculatorDefinition = {
  id: "emi",
  slug: "emi-calculator",
  name: "EMI Calculator",
  category: "finance",
  shortDescription: "Calculate monthly loan EMI with breakdown of principal and interest.",
  icon: "home",
  accent: "finance",
  featured: true,
  popularity: 99,

  inputs: [
    {
      id: "principal",
      label: "Loan amount",
      type: "currency",
      unit: "₹",
      placeholder: "500000",
      hint: "The total amount you plan to borrow.",
      example: "e.g. ₹5,00,000",
      defaultValue: 500000,
      validation: {
        required: true,
        min: 1000,
        max: 100000000,
        message: "Loan amount must be between ₹1,000 and ₹10,00,00,000.",
      },
    },
    {
      id: "rate",
      label: "Interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "8.5",
      hint: "The annual interest rate charged by the lender.",
      example: "e.g. 8.5% per year",
      defaultValue: 8.5,
      validation: {
        required: true,
        min: 0.1,
        max: 30,
        message: "Interest rate must be between 0.1% and 30%.",
      },
    },
    {
      id: "tenure",
      label: "Loan tenure",
      type: "number",
      unit: "years",
      placeholder: "20",
      hint: "The duration over which you will repay the loan.",
      example: "e.g. 20 years",
      defaultValue: 20,
      validation: {
        required: true,
        min: 0.5,
        max: 40,
        message: "Tenure must be between 6 months and 40 years.",
      },
    },
  ],

  calculate: (values) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const tenureYears = parseNumber(values.tenure) ?? 0;

    const tenureMonths = Math.round(tenureYears * 12);
    const monthlyRate = rate / 12 / 100;

    let emi: number;
    let totalPayment: number;
    let totalInterest: number;

    if (principal <= 0 || rate <= 0 || tenureMonths <= 0) {
      emi = 0;
      totalPayment = 0;
      totalInterest = 0;
    } else {
      emi = calculateEMI(principal, rate, tenureMonths);
      totalPayment = emi * tenureMonths;
      totalInterest = totalPayment - principal;
    }

    // Build amortization breakdown (first few years for chart)
    const chartData: { label: string; value: number; color: string }[] = [];
    let balance = principal;
    for (let month = 1; month <= Math.min(tenureMonths, 360); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      if (month % 12 === 0 || month === tenureMonths) {
        chartData.push({
          label: `Y${Math.ceil(month / 12)}`,
          value: roundTo(balance, 0),
          color: "var(--accent)",
        });
      }
    }

    const principalPortion = emi > 0 ? (principal / totalPayment) * 100 : 0;
    const interestPortion = emi > 0 ? 100 - principalPortion : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "emi",
              label: "YOUR MONTHLY EMI",
              value: formatINR(roundTo(emi)),
              format: "currency",
              primary: true,
              description: `per month for ${tenureMonths} months (${tenureYears} years)`,
            },
          ],
        },
        {
          id: "totals",
          title: "Loan summary",
          values: [
            {
              id: "principal",
              label: "Principal",
              value: formatINR(roundTo(principal)),
              format: "currency",
            },
            {
              id: "totalInterest",
              label: "Total interest",
              value: formatINR(roundTo(totalInterest)),
              format: "currency",
            },
            {
              id: "totalPayment",
              label: "Total payment",
              value: formatINR(roundTo(totalPayment)),
              format: "currency",
            },
          ],
        },
        {
          id: "breakdown",
          title: "Payment breakdown",
          values: [
            {
              id: "principalPct",
              label: "Principal portion",
              value: formatNumber(principalPortion, 1),
              format: "percentage",
            },
            {
              id: "interestPct",
              label: "Interest portion",
              value: formatNumber(interestPortion, 1),
              format: "percentage",
            },
          ],
        },
      ],
      chart: {
        type: "donut",
        title: "Principal vs Interest",
        data: [
          { label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" },
          { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" },
        ],
      },
      charts: [
        {
          type: "line",
          title: "Loan balance over time",
          data: chartData,
          xLabel: "Year",
          yLabel: "Remaining balance",
        },
      ],
      interpretation: `Your monthly EMI will be ${formatINR(roundTo(emi))} for ${tenureMonths} months. Over the full tenure, you will pay ${formatINR(roundTo(totalInterest))} in interest, making the total payment ${formatINR(roundTo(totalPayment))}.`,
    };
  },

  content: {
    summary:
      "The EMI Calculator estimates your monthly equated monthly installment (EMI) for a loan. It shows the EMI amount, total interest payable, and the total amount you will repay over the loan's tenure.",
    howToUse: [
      "Enter the loan amount you plan to borrow.",
      "Enter the annual interest rate charged by the lender.",
      "Enter the loan tenure in years.",
      "Press Calculate to see your monthly EMI and complete loan summary.",
    ],
    interpretation:
      "The EMI is a fixed monthly payment you make to repay the loan. It includes both principal and interest. The total interest is the total cost of borrowing, and the total payment is the sum of loan amount and total interest.",
    formula:
      "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)\n\nWhere:\nP = Principal (loan amount)\nr = Monthly interest rate (annual rate ÷ 12 ÷ 100)\nn = Number of monthly installments (tenure in months)",
    variables: [
      {
        symbol: "P",
        name: "Principal",
        description: "The total loan amount you borrow from the lender.",
      },
      {
        symbol: "r",
        name: "Monthly interest rate",
        description: "The annual interest rate divided by 12 months and 100 to get a decimal.",
      },
      {
        symbol: "n",
        name: "Number of installments",
        description: "The loan tenure expressed in months (years × 12).",
      },
    ],
    example: {
      title: "Example: ₹5,00,000 loan at 8.5% for 20 years",
      inputs: {
        "Loan amount": "₹5,00,000",
        "Interest rate": "8.5% per year",
        "Tenure": "20 years",
      },
      steps: [
        "Monthly interest rate = 8.5% / 12 = 0.7083% = 0.007083",
        "Number of installments = 20 × 12 = 240 months",
        "EMI = 5,00,000 × 0.007083 × (1.007083)²⁴⁰ / ((1.007083)²⁴⁰ − 1)",
        "(1.007083)²⁴⁰ ≈ 5.4368",
        "EMI ≈ 5,00,000 × 0.007083 × 5.4368 / 4.4368 ≈ ₹4,339",
        "Total payment = ₹4,339 × 240 = ₹10,41,360",
        "Total interest = ₹10,41,360 − ₹5,00,000 = ₹5,41,360",
      ],
      result: "EMI ≈ ₹4,339 per month",
    },
    factors: [
      "Higher loan amounts result in higher EMI payments proportionally.",
      "Higher interest rates increase both the EMI and total interest paid.",
      "Longer tenures reduce the monthly EMI but increase total interest paid.",
      "Shorter tenures increase the monthly EMI but reduce total interest paid.",
    ],
    edgeCases: [
      "A zero interest rate loan: EMI equals principal divided by tenure months.",
      "Very small loans or very long tenures may result in EMIs below ₹100.",
      "Interest rates above 30% are unusual but possible for high-risk loans.",
      "Loans with step-up or step-down payment structures are not supported.",
    ],
    commonMistakes: [
      "Using the annual rate directly in the formula instead of dividing by 12.",
      "Entering tenure in months when the input expects years.",
      "Forgetting that the total payment includes both principal and interest.",
      "Ignoring processing fees and other charges that affect the effective cost.",
    ],
    assumptions: [
      "The EMI is calculated using the reducing balance method, which is standard for most loans.",
      "The interest rate is fixed for the entire tenure.",
      "Payments are made monthly, on time, for the full tenure.",
      "No prepayment, part-payment or loan restructuring occurs.",
    ],
    limitations: [
      "The calculator does not include processing fees, insurance, or other charges.",
      "Floating-rate loans will have EMIs that change with the benchmark rate.",
      "The actual EMI may differ slightly due to rounding conventions of the lender.",
      "This is an estimate for planning purposes and not a loan quote from any financial institution.",
    ],
    faqs: [
      {
        question: "What is EMI?",
        answer:
          "EMI stands for Equated Monthly Installment. It is the fixed amount you pay every month to repay a loan, including both principal and interest portions. The EMI remains constant throughout the tenure for fixed-rate loans.",
      },
      {
        question: "How is EMI calculated?",
        answer:
          "EMI is calculated using the reducing balance formula: EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of monthly installments.",
      },
      {
        question: "Will my EMI change if I prepay part of the loan?",
        answer:
          "Yes. A part-payment reduces the outstanding principal, which reduces the EMI or shortens the tenure (depending on your lender's policy). Some lenders charge a prepayment penalty.",
      },
      {
        question: "What is the difference between EMI and total payment?",
        answer:
          "EMI is the monthly installment. Total payment is the sum of all EMIs over the full tenure, which includes both the principal and the total interest paid.",
      },
      {
        question: "Why is most of my early EMI going towards interest?",
        answer:
          "In the reducing balance method, interest is calculated on the outstanding balance. In the early years, the outstanding balance is highest, so most of the EMI goes toward interest. As the principal reduces, more of the EMI goes toward principal.",
      },
    ],
    glossary: [
      { term: "Principal", definition: "The original amount you borrowed. Your EMI repays this gradually over the loan term." },
      { term: "Interest", definition: "The cost of borrowing, charged on the outstanding balance each month. It is added to your payment before principal." },
      { term: "Reducing balance", definition: "The standard method where interest is calculated on the remaining balance. As you repay, the interest portion of each EMI falls." },
      { term: "Annual Percentage Rate (APR)", definition: "The yearly rate that includes fees and other costs, not just the stated interest rate. It is a better basis for comparing loans." },
      { term: "Tenure", definition: "The total length of the loan, usually expressed in years or months. Longer tenure lowers EMI but raises total interest." },
      { term: "Amortization", definition: "The gradual payment of a loan through scheduled fixed payments that reduce the balance to zero by the end of the term." },
      { term: "Prepayment", definition: "Paying more than the EMI to reduce the principal early. This lowers future interest but may attract a fee." },
      { term: "Fixed rate", definition: "An interest rate that stays the same for the entire loan term. Your EMI remains constant." },
      { term: "Floating rate", definition: "A rate linked to a benchmark (like repo rate) that can rise or fall. Your EMI or tenure updates when the rate changes." },
    ],
    scenarios: [
      {
        title: "Short tenure, higher EMI",
        situation: "20 lakh loan at 8.5% for 10 years instead of 20 years.",
        analysis: "The monthly payment is roughly double, but the total interest falls sharply because the principal is repaid sooner. This suits borrowers with higher monthly cash flow who want to minimise total cost.",
      },
      {
        title: "Long tenure, lower EMI",
        situation: "The same loan spread over 25 years.",
        analysis: "The monthly EMI is lower, which helps cash flow, but total interest can exceed the principal. Many borrowers focus only on the EMI figure and overlook the long-term cost.",
      },
      {
        title: "Interest rate rise of 0.5%",
        situation: "A floating-rate loan where the rate moves from 8.5% to 9%.",
        analysis: "Each 0.5% rise increases the EMI, or extends the tenure with some lenders. Over 20 years, even a small rate change can add lakhs to total interest, so compare fixed vs floating options carefully.",
      },
      {
        title: "Annual prepayment",
        situation: "You pay an extra amount equal to two monthly EMIs every year.",
        analysis: "Prepayment directly reduces the principal, which shortens the term and lowers total interest. Even a modest annual prepayment can save a meaningful share of interest, provided there is no penalty.",
      },
    ],
    relatedConcepts: [
      {
        title: "Total interest vs total payment",
        explanation: "Total payment includes both the principal and all the interest charged. The EMI covers both; knowing the split helps you see what borrowing really costs.",
        calculatorSlug: "loan-calculator",
      },
      {
        title: "Compound interest and growth",
        explanation: "The same percentage can work for or against you. Loan interest compounds on the balance; investment growth compounds on what you have saved. Comparing both makes borrowing decisions clearer.",
        calculatorSlug: "compound-interest-calculator",
      },
      {
        title: "Percentage changes in rates",
        explanation: "A 1% rate change looks small but can be significant over years. Understanding percentage increases and decreases is essential when comparing loan offers.",
        calculatorSlug: "percentage-calculator",
      },
      {
        title: "SIP contributions and saving for the down payment",
        explanation: "A separate growth calculator can help you plan how much to save each month for a down payment before taking a loan.",
        calculatorSlug: "sip-calculator",
      },
    ],
    costBreakdown: [
      { item: "Principal repayments", description: "The portion of each EMI reducing the amount you borrowed.", included: true },
      { item: "Interest on the balance", description: "The monthly cost of borrowing, based on the current outstanding amount.", included: true },
      { item: "Processing fees", description: "One-time charges lenders add at disbursement.", included: false },
      { item: "Insurance premiums", description: "Optional loan protection policies often sold alongside the loan.", included: false },
      { item: "Prepayment penalties", description: "Fees charged if you repay part of the loan early.", included: false },
      { item: "Late payment fees", description: "Charges when you miss or delay an EMI.", included: false },
    ],
  },

  relatedCalculators: ["loan-calculator", "loan-interest", "compound-interest", "percentage-increase"],

  seo: {
    title: "EMI Calculator – Monthly Loan Payment & Interest",
    description:
      "Calculate your monthly EMI for home, car, or personal loans. See total interest and total payment instantly. Free, accurate and easy to use.",
    keywords: ["emi calculator", "loan emi", "monthly emi", "calculate emi", "home loan emi"],
    primaryIntent: "Calculate monthly EMI for a loan",
    secondaryIntents: [
      "Total interest on loan",
      "Total payment with interest",
      "Principal vs interest breakdown",
      "Amortization over time",
    ],
  },
};