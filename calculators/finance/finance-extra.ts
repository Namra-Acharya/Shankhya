/**
 * Finance Calculators - Mortgage, Auto Loan, Investment, Savings, Retirement, Credit Card, Debt, DTI, ROI, APR, Inflation, Tip, Sales Tax, Currency, PPF, CAGR, NPS, Gratuity, HRA, EPF, Income Tax India, Salary, Home/Car/Personal Loan EMI
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";
import { calculateEMI } from "@/calculators/finance/emi";

const fin = {
  summary: "Calculate financial outcomes with clear, accurate results.",
  howToUse: [
    "Enter the required financial details.",
    "Check that all values use the correct units and currency.",
    "Press Calculate to see the result instantly.",
    "Review the formula and interpretation shown with the result.",
    "Adjust the inputs to compare different scenarios.",
  ],
  interpretation: "The result is an estimate based on the standard financial formula for this calculation.",
  formula: "",
  variables: [] as { symbol: string; name: string; description: string }[],
  example: undefined,
  factors: [] as string[],
  edgeCases: [] as string[],
  commonMistakes: [
    "Entering monthly values where annual values are expected, or vice versa.",
    "Using the wrong currency or unit for the inputs.",
    "Interpreting an estimate as a guaranteed financial outcome.",
  ],
  assumptions: [
    "Rates and contributions are constant over the calculation period.",
    "The standard financial formula for this calculation is used.",
    "No taxes, fees, or other charges are included unless specified.",
  ],
  limitations: [
    "This is an estimate for planning purposes, not financial advice.",
    "Real-world results vary with market conditions, fees, and changing rates.",
    "Consult a qualified financial professional for significant decisions.",
  ],
  faqs: [] as { question: string; answer: string }[],
};

// ==================== MORTGAGE ====================
export const mortgageCalculator: CalculatorDefinition = {
  id: "mortgage", slug: "mortgage-calculator", name: "Mortgage Calculator", category: "finance",
  shortDescription: "Calculate monthly mortgage payments, total interest and total cost.", icon: "home", accent: "finance", featured: true, popularity: 99,
  inputs: [
    { id: "homePrice", label: "Home price", type: "currency", unit: "₹", placeholder: "5000000", defaultValue: 5000000, validation: { required: true, min: 1, max: 1000000000 } },
    { id: "downPayment", label: "Down payment", type: "currency", unit: "₹", placeholder: "1000000", defaultValue: 1000000, validation: { required: true, min: 0, max: 1000000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "7.5", defaultValue: 7.5, validation: { required: true, min: 0.1, max: 20 } },
    { id: "years", label: "Loan term", type: "number", unit: "years", placeholder: "20", defaultValue: 20, validation: { required: true, min: 1, max: 40 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const price = parseNumber(v.homePrice) ?? 0, down = parseNumber(v.downPayment) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 20;
    const principal = Math.max(0, price - down), months = Math.round(years * 12);
    const emi = principal > 0 ? calculateEMI(principal, rate, months) : 0, totalPayment = emi * months, totalInterest = totalPayment - principal;
    return {
      sections: [
        { id: "primary", values: [{ id: "monthly", label: "MONTHLY PAYMENT", value: roundTo(emi), format: "currency", primary: true, description: `for ${months} months` }] },
        { id: "summary", title: "Mortgage summary", values: [{ id: "principal", label: "Loan amount", value: roundTo(principal), format: "currency" }, { id: "interest", label: "Total interest", value: roundTo(totalInterest), format: "currency" }, { id: "total", label: "Total payment", value: roundTo(totalPayment), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Principal vs Interest", data: [{ label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Your loan of ${formatMoney(roundTo(principal), currency)} costs ${formatMoney(roundTo(emi), currency)}/month. Total interest: ${formatMoney(roundTo(totalInterest), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Mortgage Calculator shows your monthly payment, total interest, and total cost for a home loan. It is essential for planning one of the largest purchases most people ever make.",
    howToUse: [
      "Enter the home price in rupees.",
      "Enter your down payment amount.",
      "Enter the annual interest rate.",
      "Enter the loan term in years.",
      "Press Calculate to see your monthly payment, loan amount, total interest, and total cost.",
    ],
    interpretation:
      "Your monthly payment is calculated on the loan amount (home price minus down payment) using the standard EMI formula. The total interest shows how much extra you pay for borrowing, which can exceed the loan amount for long terms.",
    formula: "Loan amount = Home price − Down payment\n\nEMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nWhere:\nP = Loan amount\nr = Monthly rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Loan amount", description: "Home price minus your down payment." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The mortgage term in months." },
    ],
    example: {
      title: "Example: ₹50,00,000 home with ₹10,00,000 down, 7.5% for 20 years",
      inputs: { "Home price": "₹50,00,000", "Down payment": "₹10,00,000", "Interest rate": "7.5%", "Loan term": "20 years" },
      steps: [
        "Loan amount = 50,00,000 − 10,00,000 = ₹40,00,000",
        "Monthly rate = 7.5% ÷ 12 = 0.625% = 0.00625",
        "Months = 20 × 12 = 240",
        "EMI ≈ ₹32,227",
        "Total payment = 32,227 × 240 = ₹77,34,480",
        "Total interest = 77,34,480 − 40,00,000 = ₹37,34,480",
      ],
      result: "≈ ₹32,227/month, ₹37.3 lakh interest",
    },
    factors: [
      "A larger down payment reduces the loan amount and total interest.",
      "Longer terms lower monthly payments but increase total interest.",
      "Home loan rates are often lower than other loans due to the collateral.",
      "Mortgage payments may include property tax and insurance in some countries.",
    ],
    edgeCases: [
      "If the down payment equals the home price, the loan amount is zero and no payment is due.",
      "Very long terms (30-40 years) can result in interest exceeding the principal.",
      "Floating-rate mortgages have payments that change with the benchmark rate.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting that the loan amount is home price minus down payment.",
      "Underestimating the total interest over a long mortgage term.",
    ],
    assumptions: [
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
      "No prepayments or restructuring occur.",
      "Property tax and insurance are not included.",
    ],
    limitations: [
      "Does not include property tax, insurance, or maintenance costs.",
      "Floating-rate loans will have changing payments.",
      "This is an estimate, not a loan quote from a lender.",
    ],
    faqs: [
      {
        question: "How much down payment should I make on a home?",
        answer:
          "A down payment of 20% of the home price is often recommended to avoid extra insurance costs and reduce your loan amount. A larger down payment significantly reduces total interest.",
      },
      {
        question: "What is a good mortgage term?",
        answer:
          "Common terms are 15, 20, and 30 years. A shorter term means higher monthly payments but much less total interest. Choose based on your monthly budget and financial goals.",
      },
      {
        question: "Does the EMI formula include property tax?",
        answer:
          "No. This calculator only covers the loan payment (principal and interest). Property tax, insurance, and maintenance are separate costs you should budget for.",
      },
    ],
  },
  relatedCalculators: ["loan", "emi", "auto-loan", "compound-interest"],
  seo: { title: "Mortgage Calculator – Monthly Payment & Total Cost", description: "Calculate your monthly mortgage payment, total interest and total cost. Free, instant and accurate.", keywords: ["mortgage calculator", "home loan calculator"], primaryIntent: "Calculate monthly mortgage payment", secondaryIntents: ["Home loan cost"] },
};

// ==================== AUTO LOAN ====================
export const autoLoanCalculator: CalculatorDefinition = {
  id: "auto-loan", slug: "auto-loan-calculator", name: "Auto Loan Calculator", category: "finance",
  shortDescription: "Calculate car loan payments, total interest and total cost.", icon: "car", accent: "finance", popularity: 92,
  inputs: [
    { id: "carPrice", label: "Car price", type: "currency", unit: "₹", placeholder: "800000", defaultValue: 800000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "downPayment", label: "Down payment", type: "currency", unit: "₹", placeholder: "100000", defaultValue: 100000, validation: { required: true, min: 0, max: 100000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "9", defaultValue: 9, validation: { required: true, min: 0.1, max: 25 } },
    { id: "years", label: "Loan term", type: "number", unit: "years", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 8 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const price = parseNumber(v.carPrice) ?? 0, down = parseNumber(v.downPayment) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 5;
    const principal = Math.max(0, price - down), months = Math.round(years * 12);
    const emi = principal > 0 ? calculateEMI(principal, rate, months) : 0, totalPayment = emi * months, totalInterest = totalPayment - principal;
    return {
      sections: [
        { id: "primary", values: [{ id: "monthly", label: "MONTHLY PAYMENT", value: roundTo(emi), format: "currency", primary: true, description: `for ${months} months` }] },
        { id: "summary", title: "Loan summary", values: [{ id: "principal", label: "Loan amount", value: roundTo(principal), format: "currency" }, { id: "interest", label: "Total interest", value: roundTo(totalInterest), format: "currency" }, { id: "total", label: "Total payment", value: roundTo(totalPayment), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Principal vs Interest", data: [{ label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Your car loan of ${formatMoney(roundTo(principal), currency)} costs ${formatMoney(roundTo(emi), currency)}/month. Total interest: ${formatMoney(roundTo(totalInterest), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Auto Loan Calculator shows your monthly car loan payment, total interest, and total cost. It helps you budget for one of the most common consumer loans.",
    howToUse: [
      "Enter the car price in rupees.",
      "Enter your down payment amount.",
      "Enter the annual interest rate.",
      "Enter the loan term in years (typically 3-7 years).",
      "Press Calculate to see your monthly payment, loan amount, total interest, and total cost.",
    ],
    interpretation:
      "Your monthly payment is calculated on the loan amount (car price minus down payment). Car loans have shorter terms than mortgages, so the total interest is lower, but the monthly payment is higher for the same loan amount.",
    formula: "Loan amount = Car price − Down payment\n\nEMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nWhere:\nP = Loan amount\nr = Monthly rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Loan amount", description: "Car price minus your down payment." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The loan term in months." },
    ],
    example: {
      title: "Example: ₹8,00,000 car with ₹1,00,000 down, 9% for 5 years",
      inputs: { "Car price": "₹8,00,000", "Down payment": "₹1,00,000", "Interest rate": "9%", "Loan term": "5 years" },
      steps: [
        "Loan amount = 8,00,000 − 1,00,000 = ₹7,00,000",
        "Monthly rate = 9% ÷ 12 = 0.75% = 0.0075",
        "Months = 5 × 12 = 60",
        "EMI ≈ ₹14,531",
        "Total payment = 14,531 × 60 = ₹8,71,860",
        "Total interest = 8,71,860 − 7,00,000 = ₹1,71,860",
      ],
      result: "≈ ₹14,531/month, ₹1.7 lakh interest",
    },
    factors: [
      "Car loan terms are shorter (3-7 years), reducing total interest.",
      "A larger down payment reduces the loan amount and monthly payment.",
      "Car loan rates are often higher than home loans.",
      "Cars depreciate quickly, so the loan can exceed the car's value early on.",
    ],
    edgeCases: [
      "If the down payment equals the car price, the loan amount is zero.",
      "Very short terms (1-2 years) have high payments but low interest.",
      "Some lenders offer balloon payments at the end of the term.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting to include insurance and registration costs in your budget.",
      "Choosing a term too long for a depreciating asset.",
    ],
    assumptions: [
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
      "No prepayments or restructuring occur.",
    ],
    limitations: [
      "Does not include insurance, registration, or maintenance costs.",
      "This is an estimate, not a loan quote.",
      "Actual rates vary by lender and credit profile.",
    ],
    faqs: [
      {
        question: "How much down payment should I make on a car?",
        answer:
          "A down payment of 20-30% of the car price is recommended. This reduces your loan amount, monthly payment, and total interest, and helps avoid being 'upside down' on the loan.",
      },
      {
        question: "What is a good car loan term?",
        answer:
          "Most car loans are 3-7 years. A shorter term means higher payments but less total interest. Since cars depreciate, avoid terms longer than the car's useful life.",
      },
      {
        question: "Can I prepay my car loan?",
        answer:
          "Yes, most lenders allow prepayment, though some charge a penalty. Prepaying reduces the principal and saves on future interest.",
      },
    ],
  },
  relatedCalculators: ["loan", "emi", "mortgage", "compound-interest"],
  seo: { title: "Auto Loan Calculator – Car Loan Payment & Interest", description: "Calculate your car loan monthly payment, total interest and total cost. Free, instant and accurate.", keywords: ["auto loan calculator", "car loan calculator"], primaryIntent: "Calculate car loan payment", secondaryIntents: ["Car payment calculator"] },
};

// ==================== INVESTMENT ====================
export const investmentCalculator: CalculatorDefinition = {
  id: "investment", slug: "investment-calculator", name: "Investment Calculator", category: "finance",
  shortDescription: "Calculate investment growth with compound returns and monthly contributions.", icon: "trending-up", accent: "finance", popularity: 90,
  inputs: [
    { id: "principal", label: "Initial investment", type: "currency", unit: "₹", placeholder: "100000", defaultValue: 100000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "monthly", label: "Monthly contribution", type: "currency", unit: "₹", placeholder: "5000", defaultValue: 5000, validation: { required: true, min: 0, max: 10000000 } },
    { id: "rate", label: "Annual return", type: "percentage", unit: "%", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0.1, max: 30 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "10", defaultValue: 10, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const principal = parseNumber(v.principal) ?? 0, monthly = parseNumber(v.monthly) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 10;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const pFV = principal * Math.pow(1 + mr, months);
    const mFV = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : monthly * months;
    const totalFV = pFV + mFV, invested = principal + monthly * months, gain = totalFV - invested;
    return {
      sections: [
        { id: "primary", values: [{ id: "fv", label: "FUTURE VALUE", value: roundTo(totalFV), format: "currency", primary: true, description: `after ${years} years` }] },
        { id: "summary", title: "Investment summary", values: [{ id: "invested", label: "Total invested", value: roundTo(invested), format: "currency" }, { id: "gain", label: "Total gain", value: roundTo(gain), format: "currency" }] },
      ],
      interpretation: `Investing ${formatMoney(roundTo(principal), currency)} plus ${formatMoney(roundTo(monthly), currency)} monthly at ${rate}% could grow to ${formatMoney(roundTo(totalFV), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Investment Calculator shows how your investments grow over time with compound returns and regular monthly contributions. It is useful for planning long-term wealth building.",
    howToUse: [
      "Enter your initial investment in rupees.",
      "Enter how much you will contribute each month.",
      "Enter the expected annual return rate.",
      "Enter the investment period in years.",
      "Press Calculate to see the future value, total invested, and total gain.",
    ],
    interpretation:
      "Your future value combines the growth of your initial investment and your monthly contributions, both compounded monthly. The total gain shows how much of your final amount comes from returns — the power of compounding.",
    formula: "Future value = Initial × (1 + r)^n + Monthly × [((1 + r)^n − 1) / r] × (1 + r)",
    variables: [
      { symbol: "I", name: "Initial investment", description: "The amount you invest at the start." },
      { symbol: "M", name: "Monthly contribution", description: "How much you add each month." },
      { symbol: "r", name: "Monthly rate", description: "The annual return divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The investment period in months." },
    ],
    example: {
      title: "Example: ₹1,00,000 initial + ₹5,000/month at 10% for 10 years",
      inputs: { "Initial investment": "₹1,00,000", "Monthly contribution": "₹5,000", "Annual return": "10%", Years: "10" },
      steps: [
        "Monthly rate = 10% ÷ 12 = 0.833% = 0.00833",
        "Months = 10 × 12 = 120",
        "Initial growth ≈ 1,00,000 × (1.00833)^120 ≈ ₹2,70,704",
        "Monthly contributions growth ≈ ₹10,17,000",
        "Future value ≈ ₹12,87,000",
        "Total invested = 1,00,000 + 5,000 × 120 = ₹7,00,000",
        "Total gain = 12,87,000 − 7,00,000 = ₹5,87,000",
      ],
      result: "≈ ₹12.87 lakh future value",
    },
    factors: [
      "Higher returns dramatically increase the final value.",
      "Starting earlier gives your money more time to compound.",
      "Regular monthly contributions have a huge impact over long periods.",
      "Inflation reduces the real purchasing power of your future returns.",
    ],
    edgeCases: [
      "If the return is 0%, the future value equals your total contributions.",
      "If monthly contribution is 0, only the initial investment grows.",
      "Very long periods (30+ years) produce exponential growth.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting to account for inflation.",
      "Assuming past returns will continue unchanged.",
    ],
    assumptions: [
      "Returns are compounded monthly.",
      "Contributions are made at the beginning of each month.",
      "The return rate is constant over the entire period.",
      "No taxes or fees are deducted.",
    ],
    limitations: [
      "This is an estimate, not a guarantee of future returns.",
      "Market returns vary year to year.",
      "Does not account for inflation, taxes, or changing contributions.",
      "Consult a financial advisor for personalized investment planning.",
    ],
    faqs: [
      {
        question: "What return rate should I use?",
        answer:
          "Historical equity returns in India average 10-12% but are volatile. A conservative estimate of 8-10% is reasonable for planning. Use a lower rate for fixed-income investments.",
      },
      {
        question: "Why is starting early so important?",
        answer:
          "Compounding means your returns earn returns. Starting 10 years earlier can more than double your final amount even with the same monthly contribution.",
      },
      {
        question: "How much should I invest monthly?",
        answer:
          "A common guideline is 10-15% of your income for long-term goals. The right amount depends on your goals, time horizon, and risk tolerance.",
      },
    ],
  },
  relatedCalculators: ["sip", "compound-interest", "savings", "fd"],
  seo: { title: "Investment Calculator – Growth with Monthly Contributions", description: "Calculate how your investments grow with compound returns and monthly contributions. Free, instant and accurate.", keywords: ["investment calculator", "investment growth"], primaryIntent: "Calculate investment growth", secondaryIntents: ["Compound growth"] },
};

// ==================== SAVINGS ====================
export const savingsCalculator: CalculatorDefinition = {
  id: "savings", slug: "savings-calculator", name: "Savings Calculator", category: "finance",
  shortDescription: "Calculate how your savings grow over time with interest.", icon: "piggy-bank", accent: "finance", popularity: 88,
  inputs: [
    { id: "initial", label: "Initial savings", type: "currency", unit: "₹", placeholder: "50000", defaultValue: 50000, validation: { required: true, min: 0, max: 100000000 } },
    { id: "monthly", label: "Monthly savings", type: "currency", unit: "₹", placeholder: "10000", defaultValue: 10000, validation: { required: true, min: 0, max: 10000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "6", defaultValue: 6, validation: { required: true, min: 0, max: 15 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "10", defaultValue: 10, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const initial = parseNumber(v.initial) ?? 0, monthly = parseNumber(v.monthly) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 10;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const iFV = initial * Math.pow(1 + mr, months);
    const mFV = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : monthly * months;
    const totalFV = iFV + mFV, saved = initial + monthly * months, interest = totalFV - saved;
    return {
      sections: [
        { id: "primary", values: [{ id: "fv", label: "TOTAL SAVINGS", value: roundTo(totalFV), format: "currency", primary: true, description: `after ${years} years` }] },
        { id: "summary", title: "Savings summary", values: [{ id: "saved", label: "Amount saved", value: roundTo(saved), format: "currency" }, { id: "interest", label: "Interest earned", value: roundTo(interest), format: "currency" }] },
      ],
      interpretation: `Saving ${formatMoney(roundTo(initial), currency)} plus ${formatMoney(roundTo(monthly), currency)} monthly at ${rate}% could grow to ${formatMoney(roundTo(totalFV), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Savings Calculator shows how your savings grow over time with compound interest and regular monthly deposits. It is useful for planning emergency funds, major purchases, and short-term goals.",
    howToUse: [
      "Enter your initial savings in rupees.",
      "Enter how much you will save each month.",
      "Enter the annual interest rate.",
      "Enter the number of years.",
      "Press Calculate to see your total savings, amount saved, and interest earned.",
    ],
    interpretation:
      "Your total savings combine the growth of your initial balance and your monthly deposits, both compounded monthly. The interest earned shows how much your money grows beyond what you actually save.",
    formula: "Total savings = Initial × (1 + r)^n + Monthly × [((1 + r)^n − 1) / r] × (1 + r)",
    variables: [
      { symbol: "I", name: "Initial savings", description: "The amount you have saved at the start." },
      { symbol: "M", name: "Monthly savings", description: "How much you add each month." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The savings period in months." },
    ],
    example: {
      title: "Example: ₹50,000 initial + ₹10,000/month at 6% for 10 years",
      inputs: { "Initial savings": "₹50,000", "Monthly savings": "₹10,000", "Interest rate": "6%", Years: "10" },
      steps: [
        "Monthly rate = 6% ÷ 12 = 0.5% = 0.005",
        "Months = 10 × 12 = 120",
        "Initial growth ≈ 50,000 × (1.005)^120 ≈ ₹90,970",
        "Monthly deposits growth ≈ ₹16,40,000",
        "Total savings ≈ ₹17,31,000",
        "Amount saved = 50,000 + 10,000 × 120 = ₹12,50,000",
        "Interest earned = 17,31,000 − 12,50,000 = ₹4,81,000",
      ],
      result: "≈ ₹17.31 lakh total savings",
    },
    factors: [
      "Higher interest rates increase your savings growth.",
      "Regular monthly deposits compound and grow significantly over time.",
      "Savings accounts typically offer lower rates than investments.",
      "Starting early maximizes the benefit of compounding.",
    ],
    edgeCases: [
      "If the interest rate is 0%, total savings equals your deposits.",
      "If monthly savings is 0, only the initial balance grows.",
      "Very long periods produce exponential growth.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting that banks may compound interest differently.",
      "Assuming a high savings interest rate that isn't available.",
    ],
    assumptions: [
      "Interest is compounded monthly.",
      "Deposits are made at the beginning of each month.",
      "The interest rate is constant over the period.",
      "No withdrawals are made.",
    ],
    limitations: [
      "Actual savings rates vary by bank and change over time.",
      "Does not account for taxes on interest earned.",
      "This is an estimate for planning purposes.",
    ],
    faqs: [
      {
        question: "What is a typical savings account interest rate?",
        answer:
          "In India, savings account rates typically range from 2.5% to 4%. For higher returns, consider fixed deposits (FDs) or recurring deposits (RDs), which this calculator can also help you plan.",
      },
      {
        question: "How much emergency fund should I save?",
        answer:
          "Financial experts recommend saving 3-6 months of living expenses in an easily accessible account. This calculator helps you see how long it will take to reach that goal.",
      },
      {
        question: "What is the difference between savings and investing?",
        answer:
          "Savings are low-risk and easily accessible, typically earning 2-4%. Investing aims for higher returns (8-12%) but carries more risk. Most people need both — savings for emergencies and investing for long-term goals.",
      },
    ],
  },
  relatedCalculators: ["fd", "rd", "investment", "compound-interest"],
  seo: { title: "Savings Calculator – Growth with Monthly Deposits", description: "Calculate how your savings grow with compound interest and regular monthly deposits. Free, instant and accurate.", keywords: ["savings calculator", "savings growth"], primaryIntent: "Calculate savings growth", secondaryIntents: ["Monthly savings"] },
};