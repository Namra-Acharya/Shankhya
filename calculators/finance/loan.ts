/**
 * Loan Calculator
 * Calculates monthly payment, total interest and total payment for a loan.
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";
import { calculateEMI } from "@/calculators/finance/emi";

export const loanCalculator: CalculatorDefinition = {
  id: "loan",
  slug: "loan-calculator",
  name: "Loan Calculator",
  category: "finance",
  shortDescription: "Calculate monthly payments, total interest and total cost of any loan.",
  icon: "banknote",
  accent: "finance",
  featured: true,
  popularity: 95,

  inputs: [
    {
      id: "principal",
      label: "Loan amount",
      type: "currency",
      unit: "₹",
      placeholder: "1000000",
      hint: "The total amount you plan to borrow.",
      example: "e.g. ₹10,00,000",
      defaultValue: 1000000,
      validation: { required: true, min: 1000, max: 100000000 },
    },
    {
      id: "rate",
      label: "Interest rate",
      type: "percentage",
      unit: "%",
      placeholder: "9",
      hint: "The annual interest rate.",
      example: "e.g. 9% per year",
      defaultValue: 9,
      validation: { required: true, min: 0.1, max: 30 },
    },
    {
      id: "tenure",
      label: "Loan tenure",
      type: "number",
      unit: "years",
      placeholder: "15",
      hint: "How long you will repay the loan.",
      example: "e.g. 15 years",
      defaultValue: 15,
      validation: { required: true, min: 0.5, max: 40 },
    },
  ],

  calculate: (values, currency = DEFAULT_CURRENCY) => {
    const principal = parseNumber(values.principal) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const tenureYears = parseNumber(values.tenure) ?? 0;
    const tenureMonths = Math.round(tenureYears * 12);

    const monthlyPayment = principal > 0 && rate > 0 && tenureMonths > 0
      ? calculateEMI(principal, rate, tenureMonths)
      : 0;
    const totalPayment = monthlyPayment * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "monthlyPayment",
              label: "MONTHLY PAYMENT",
              value: roundTo(monthlyPayment),
              format: "currency",
              primary: true,
              description: `per month for ${tenureMonths} months`,
            },
          ],
        },
        {
          id: "totals",
          title: "Loan summary",
          values: [
            { id: "principal", label: "Principal", value: roundTo(principal), format: "currency" },
            { id: "totalInterest", label: "Total interest", value: roundTo(totalInterest), format: "currency" },
            { id: "totalPayment", label: "Total payment", value: roundTo(totalPayment), format: "currency" },
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
      interpretation: `Your monthly payment will be ${formatMoney(roundTo(monthlyPayment), currency)}. Over ${tenureYears} years, you will pay ${formatMoney(roundTo(totalInterest), currency)} in interest, for a total of ${formatMoney(roundTo(totalPayment), currency)}.`,
    };
  },

  content: {
    summary:
      "The Loan Calculator shows your monthly payment, total interest and total cost for any loan. It works for home loans, car loans, personal loans and more.",
    howToUse: [
      "Enter the loan amount you want to borrow.",
      "Enter the annual interest rate.",
      "Enter the loan tenure in years.",
      "Press Calculate to see your monthly payment and full loan summary.",
    ],
    interpretation:
      "The monthly payment is the fixed amount you pay each month. Total interest is the extra cost of borrowing. Total payment is everything you will pay back, including the principal.",
    formula:
      "Monthly Payment = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)\n\nWhere:\nP = Loan amount\nr = Monthly interest rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Principal", description: "The loan amount you borrow." },
      { symbol: "r", name: "Monthly rate", description: "Annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "Loan tenure in months." },
    ],
    example: {
      title: "Example: ₹10,00,000 loan at 9% for 15 years",
      inputs: { "Loan amount": "₹10,00,000", "Interest rate": "9%", "Tenure": "15 years" },
      steps: [
        "Monthly rate = 9% / 12 = 0.75% = 0.0075",
        "Months = 15 × 12 = 180",
        "Monthly payment = 10,00,000 × 0.0075 × (1.0075)¹⁸⁰ / ((1.0075)¹⁸⁰ − 1)",
        "Monthly payment ≈ ₹10,142",
        "Total payment = ₹10,142 × 180 = ₹18,25,560",
        "Total interest = ₹18,25,560 − ₹10,00,000 = ₹8,25,560",
      ],
      result: "Monthly payment ≈ ₹10,142",
    },
    factors: [
      "Higher loan amounts increase monthly payments proportionally.",
      "Higher interest rates increase both monthly payments and total interest.",
      "Longer tenures reduce monthly payments but increase total interest.",
      "Shorter tenures increase monthly payments but reduce total interest.",
    ],
    edgeCases: [
      "Zero interest loans: monthly payment equals principal divided by months.",
      "Very long tenures can result in total interest exceeding the principal.",
      "Interest-only loans are not supported by this calculator.",
    ],
    commonMistakes: [
      "Using annual rate instead of monthly rate in the formula.",
      "Entering tenure in months when the input expects years.",
      "Forgetting processing fees and other charges.",
    ],
    assumptions: [
      "Fixed interest rate for the entire tenure.",
      "Equal monthly payments throughout.",
      "No prepayment or restructuring.",
    ],
    limitations: [
      "Does not include processing fees, insurance or taxes.",
      "Floating-rate loans will have changing payments.",
      "This is an estimate, not a loan quote.",
    ],
    faqs: [
      {
        question: "What is the difference between a loan calculator and an EMI calculator?",
        answer:
          "They use the same formula. The loan calculator is a general-purpose tool for any loan type, while the EMI calculator is specifically designed for equated monthly installments with a focus on the principal vs interest breakdown. Use the EMI calculator for a detailed amortization view, and this loan calculator for a quick total-cost estimate.",
      },
      {
        question: "How can I reduce the total interest on my loan?",
        answer:
          "You can reduce total interest by choosing a shorter tenure, making prepayments, or negotiating a lower interest rate. Even small prepayments can significantly reduce total interest over the life of a loan. Compare different scenarios with this calculator to see the impact.",
      },
      {
        question: "What is a good loan tenure?",
        answer:
          "A shorter tenure means higher monthly payments but much less total interest. A good tenure balances affordable monthly payments with reasonable total interest. Use this calculator to compare different tenures and find the sweet spot for your budget.",
      },
      {
        question: "What is amortization?",
        answer:
          "Amortization is the process of paying off a loan through regular, equal payments. Each payment covers the interest due on the remaining balance plus a portion of the principal. Early in the loan, most of each payment goes toward interest; later, most goes toward principal. The EMI calculator shows this breakdown over time.",
      },
      {
        question: "What happens if I make extra payments?",
        answer:
          "Extra payments reduce the outstanding principal directly, which means less interest accrues on the remaining balance. This can shorten your loan term or reduce your monthly payment, depending on your lender's policy. Some lenders charge a prepayment penalty, so check your loan agreement.",
      },
      {
        question: "How does the interest rate affect my loan?",
        answer:
          "The interest rate determines how much extra you pay for borrowing. A higher rate means higher monthly payments and more total interest. For example, on a ₹10,00,000 loan over 15 years, a 1% rate difference can change your total interest by several lakh rupees. Use this calculator to compare rates side by side.",
      },
    ],
    glossary: [
      { term: "Loan principal", definition: "The original amount you borrow. Monthly payments gradually reduce this balance over the loan term." },
      { term: "Monthly payment", definition: "The fixed amount paid each month that covers both the interest due and a portion of the principal." },
      { term: "Interest rate", definition: "The annual cost of borrowing, expressed as a percentage. It is converted to a monthly rate for payment calculations." },
      { term: "Total interest", definition: "The entire amount of interest paid over the life of the loan. This is the extra cost of borrowing beyond the principal." },
      { term: "Total repayment", definition: "The sum of all payments, equal to the principal plus total interest. This is the real cost of the loan." },
      { term: "Installment loan", definition: "A loan repaid through fixed periodic payments that reduce the balance to zero by the end of the term." },
      { term: "Amortization", definition: "The schedule of payments that shows how each payment splits between interest and principal." },
      { term: "Fixed vs variable rate", definition: "A fixed rate stays constant; a variable rate may change with a benchmark and alter your monthly payment." },
    ],
    scenarios: [
      {
        title: "Comparing two tenures",
        situation: "A ₹10,00,000 loan at 9%: one borrower picks 5 years, another picks 15 years.",
        analysis: "The 5-year loan has a much higher monthly payment but far lower total interest. The 15-year loan is cheaper each month but can cost several lakhs more overall. There is no universal 'right' answer — it depends on cash flow.",
      },
      {
        title: "Rate difference of 1%",
        situation: "Two lenders offer the same ₹10,00,000 loan over 10 years at 8% and 9%.",
        analysis: "The 1% difference changes the monthly payment modestly but can add up to a meaningful amount of total interest over the full term. This is why comparing APRs and total cost matters, not just the headline monthly figure.",
      },
      {
        title: "Borrowing the minimum",
        situation: "You need ₹5,00,000 but only borrow ₹4,00,000 by adjusting your budget.",
        analysis: "Borrowing less reduces both the monthly payment and total interest. Even a smaller reduction in the loan amount can meaningfully lower the overall cost of borrowing.",
      },
      {
        title: "Extra principal payments",
        situation: "You add a one-time lump sum to the principal after the first year.",
        analysis: "Extra principal payments reduce the balance faster, which shortens the term and cuts total interest. Since interest is calculated on the remaining balance, early extra payments have the largest effect.",
      },
    ],
    relatedConcepts: [
      {
        title: "Loan vs EMI",
        explanation: "A loan calculator focuses on the total cost and monthly payment for any loan. The EMI calculator shows the same idea with a detailed principal-versus-interest breakdown and a balance-over-time chart.",
        calculatorSlug: "emi-calculator",
      },
      {
        title: "Cost of borrowing vs growth",
        explanation: "The percentage you pay on a loan is the mirror of the percentage you can earn on an investment. Comparing them helps you decide whether to borrow or save.",
        calculatorSlug: "compound-interest-calculator",
      },
      {
        title: "Simple interest on short loans",
        explanation: "For very short terms, simple and compound interest behave almost identically. For long loans, the compounding that happens inside each monthly payment matters.",
        calculatorSlug: "simple-interest-calculator",
      },
      {
        title: "Saving before borrowing",
        explanation: "Using a growth calculator to build a down payment reduces the amount borrowed and the lifetime interest cost.",
        calculatorSlug: "sip-calculator",
      },
    ],
    costBreakdown: [
      { item: "Principal repayments", description: "The part of each payment that reduces what you originally borrowed.", included: true },
      { item: "Interest on the balance", description: "The cost of borrowing, based on the remaining balance each month.", included: true },
      { item: "Processing or origination fees", description: "One-time charges lenders often add to the principal or deduct from the disbursed amount.", included: false },
      { item: "Insurance", description: "Optional loan protection cover that lenders sometimes require.", included: false },
      { item: "Prepayment penalties", description: "Fees for paying off part or all of the loan ahead of schedule.", included: false },
      { item: "Late payment fees", description: "Additional charges when an installment is missed or delayed.", included: false },
    ],
  },

  relatedCalculators: ["emi", "loan-interest", "compound-interest", "simple-interest", "sip", "percentage"],

  seo: {
    title: "Loan Calculator – Monthly Payment, Interest & Total Cost",
    description:
      "Calculate monthly loan payments, total interest and total cost for any loan. Free, instant and accurate. Compare tenures and rates easily.",
    keywords: ["loan calculator", "monthly payment calculator", "loan interest", "total loan cost"],
    primaryIntent: "Calculate monthly loan payment and total cost",
    secondaryIntents: ["Compare loan tenures", "Calculate total interest", "Plan loan repayment"],
  },
};