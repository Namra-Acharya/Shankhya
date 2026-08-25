/**
 * Finance Calculators - Retirement, Credit Card Payoff, Debt Payoff, DTI, ROI, APR, Inflation, Tip, Sales Tax, Currency Converter
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";

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

// ==================== RETIREMENT ====================
export const retirementCalculator: CalculatorDefinition = {
  id: "retirement", slug: "retirement-calculator", name: "Retirement Calculator", category: "finance",
  shortDescription: "Estimate how much you could have saved for retirement.", icon: "sun", accent: "finance", popularity: 86,
  inputs: [
    { id: "current", label: "Current savings", type: "currency", unit: "₹", placeholder: "200000", defaultValue: 200000, validation: { required: true, min: 0, max: 100000000 } },
    { id: "monthly", label: "Monthly contribution", type: "currency", unit: "₹", placeholder: "10000", defaultValue: 10000, validation: { required: true, min: 0, max: 10000000 } },
    { id: "rate", label: "Annual return", type: "percentage", unit: "%", placeholder: "8", defaultValue: 8, validation: { required: true, min: 0, max: 20 } },
    { id: "years", label: "Years until retirement", type: "number", unit: "years", placeholder: "30", defaultValue: 30, validation: { required: true, min: 1, max: 60 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const current = parseNumber(v.current) ?? 0, monthly = parseNumber(v.monthly) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 30;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const currentFV = current * Math.pow(1 + mr, months);
    const monthlyFV = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : monthly * months;
    const total = currentFV + monthlyFV;
    const contributed = current + monthly * months;
    return {
      sections: [
        { id: "primary", values: [{ id: "nestEgg", label: "ESTIMATED NEST EGG", value: roundTo(total), format: "currency", primary: true, description: `at retirement after ${years} years` }] },
        { id: "summary", title: "Retirement summary", values: [{ id: "contributed", label: "Total contributed", value: roundTo(contributed), format: "currency" }, { id: "gain", label: "Investment gain", value: roundTo(total - contributed), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Growth over time", data: [{ label: "Contributed", value: roundTo(contributed, 0), color: "var(--muted)" }, { label: "Growth", value: roundTo(total - contributed, 0), color: "var(--accent)" }] },
      interpretation: `With ₹${formatMoney(roundTo(current), currency)} saved and ₹${formatMoney(roundTo(monthly), currency)} monthly at ${rate}%, you could have ₹${formatMoney(roundTo(total), currency)} in ${years} years.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Retirement Calculator estimates how much you could accumulate for retirement based on your current savings, monthly contributions, expected return, and time horizon. It is a planning tool for anyone saving toward retirement.",
    howToUse: [
      "Enter your current retirement savings in rupees.",
      "Enter how much you plan to contribute each month.",
      "Enter the expected annual return rate (e.g., 8% for a balanced portfolio).",
      "Enter the number of years until you plan to retire.",
      "Press Calculate to see your estimated nest egg and the growth from investments.",
    ],
    interpretation:
      "The estimated nest egg combines the future value of your current savings with the future value of your monthly contributions, both compounded monthly. The investment gain shows how much of the total comes from returns rather than your own contributions — this is the power of compounding.",
    formula: "Future Value = Current × (1 + r)^n + Monthly × [((1 + r)^n − 1) / r] × (1 + r)\n\nWhere:\nr = monthly rate (annual ÷ 12 ÷ 100)\nn = number of months",
    variables: [
      { symbol: "Current", name: "Current savings", description: "The amount you have already saved for retirement." },
      { symbol: "Monthly", name: "Monthly contribution", description: "How much you add to savings each month." },
      { symbol: "r", name: "Monthly rate", description: "The annual return divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The number of months until retirement." },
    ],
    example: {
      title: "Example: ₹2,00,000 saved, ₹10,000/month, 8% return, 30 years",
      inputs: { "Current savings": "₹2,00,000", "Monthly contribution": "₹10,000", "Annual return": "8%", Years: "30" },
      steps: [
        "Monthly rate = 8% ÷ 12 = 0.667% = 0.00667",
        "Months = 30 × 12 = 360",
        "Future value of current savings = 2,00,000 × (1.00667)^360 ≈ ₹21,89,000",
        "Future value of monthly contributions ≈ ₹1,49,00,000",
        "Total nest egg ≈ ₹1,70,00,000",
      ],
      result: "≈ ₹1.7 crore",
    },
    factors: [
      "Higher returns dramatically increase the final amount due to compounding.",
      "Starting earlier gives your money more time to grow.",
      "Increasing monthly contributions has a direct, linear effect.",
      "Inflation reduces the real purchasing power of your future savings.",
    ],
    edgeCases: [
      "If the return rate is 0%, the total is simply your contributions with no growth.",
      "Very long horizons (40+ years) produce exponential growth.",
      "The calculator assumes constant contributions and returns.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting to account for inflation when estimating future needs.",
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
      "Market returns vary year to year; actual results will differ.",
      "Does not account for inflation, taxes, or changing contribution amounts.",
      "Consult a financial advisor for personalized retirement planning.",
    ],
    faqs: [
      {
        question: "How much do I need to save for retirement?",
        answer:
          "A common rule of thumb is to aim for 10–15% of your income saved annually. The right amount depends on your lifestyle, retirement age, and expected expenses. This calculator helps you estimate what your current plan will produce.",
      },
      {
        question: "What return rate should I use?",
        answer:
          "A conservative estimate is 6–8% for a balanced portfolio. Equity-heavy portfolios may average higher but with more volatility. Use a conservative rate to avoid overestimating your nest egg.",
      },
      {
        question: "Why does starting early matter so much?",
        answer:
          "Compounding means your returns earn returns. Starting 10 years earlier can more than double your final amount even with the same monthly contribution, because your money has more time to compound.",
      },
    ],
  },
  relatedCalculators: ["investment", "compound-interest", "savings", "ppf"],
  seo: { title: "Retirement Calculator – Estimate Your Retirement Savings", description: "Estimate how much you could have saved for retirement. Free, instant and accurate.", keywords: ["retirement calculator", "retirement savings"], primaryIntent: "Estimate retirement savings", secondaryIntents: ["Retirement planning"] },
};

// ==================== CREDIT CARD PAYOFF ====================
export const creditCardPayoffCalculator: CalculatorDefinition = {
  id: "credit-card-payoff", slug: "credit-card-payoff-calculator", name: "Credit Card Payoff Calculator", category: "finance",
  shortDescription: "Calculate how long it takes to pay off credit card debt.", icon: "credit-card", accent: "finance", popularity: 84,
  inputs: [
    { id: "balance", label: "Current balance", type: "currency", unit: "₹", placeholder: "50000", defaultValue: 50000, validation: { required: true, min: 100, max: 10000000 } },
    { id: "april", label: "APR", type: "percentage", unit: "%", placeholder: "24", defaultValue: 24, validation: { required: true, min: 0, max: 50 } },
    { id: "payment", label: "Monthly payment", type: "currency", unit: "₹", placeholder: "3000", defaultValue: 3000, validation: { required: true, min: 10, max: 10000000 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const balance = parseNumber(v.balance) ?? 0, apr = parseNumber(v.april) ?? 0, payment = parseNumber(v.payment) ?? 0;
    const monthlyRate = apr / 12 / 100;
    let remaining = balance, months = 0, totalInterest = 0;
    while (remaining > 0 && months < 600) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      remaining = remaining + interest - payment;
      months++;
      if (remaining <= 0) break;
    }
    const totalPaid = balance + totalInterest;
    const years = months / 12;
    return {
      sections: [
        { id: "primary", values: [{ id: "months", label: "TIME TO PAY OFF", value: `${months} months`, format: "text", primary: true, description: `≈ ${years.toFixed(1)} years` }] },
        { id: "summary", title: "Payoff summary", values: [{ id: "total", label: "Total paid", value: roundTo(totalPaid), format: "currency" }, { id: "interest", label: "Total interest", value: roundTo(totalInterest), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Balance vs Interest", data: [{ label: "Balance", value: roundTo(balance, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Paying ${formatMoney(roundTo(payment), currency)} monthly against a balance of ${formatMoney(roundTo(balance), currency)} at ${apr}% APR would take ${months} months. Total interest: ${formatMoney(roundTo(totalInterest), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Credit Card Payoff Calculator shows how long it takes to clear your credit card balance with a fixed monthly payment, and how much interest you will pay along the way. It is a practical tool for anyone carrying credit card debt.",
    howToUse: [
      "Enter your current credit card balance in rupees.",
      "Enter the annual percentage rate (APR) charged on the card.",
      "Enter the fixed amount you can pay each month.",
      "Press Calculate to see how many months it will take and the total interest.",
      "Try different payment amounts to see how much faster you can clear the debt.",
    ],
    interpretation:
      "Each month, interest is added to the remaining balance, then your payment reduces it. The calculator simulates this month by month until the balance reaches zero. The total interest shows the real cost of carrying the balance, which is often much higher than people expect.",
    formula: "Monthly interest = Remaining balance × (APR ÷ 12 ÷ 100)\n\nNew balance = Remaining + interest − payment\n\nRepeat until balance ≤ 0",
    variables: [
      { symbol: "Balance", name: "Current balance", description: "The amount you currently owe on the card." },
      { symbol: "APR", name: "Annual percentage rate", description: "The yearly interest rate charged on the card." },
      { symbol: "Payment", name: "Monthly payment", description: "The fixed amount you pay each month." },
    ],
    example: {
      title: "Example: ₹50,000 balance at 24% APR, ₹3,000/month",
      inputs: { Balance: "₹50,000", APR: "24%", "Monthly payment": "₹3,000" },
      steps: [
        "Monthly rate = 24% ÷ 12 = 2% = 0.02",
        "Month 1: interest = 50,000 × 0.02 = ₹1,000; new balance = 50,000 + 1,000 − 3,000 = ₹48,000",
        "Month 2: interest = 48,000 × 0.02 = ₹960; new balance = 48,000 + 960 − 3,000 = ₹45,960",
        "Continue until balance reaches zero",
        "Total interest ≈ ₹9,000 over about 20 months",
      ],
      result: "≈ 20 months, ₹9,000 interest",
    },
    factors: [
      "Higher APR means more interest accrues each month.",
      "Larger monthly payments clear the debt faster and reduce total interest.",
      "Making only minimum payments can extend the payoff period for years.",
      "Paying more than the minimum dramatically reduces total interest.",
    ],
    edgeCases: [
      "If the payment is less than the monthly interest, the balance grows and never gets paid off.",
      "A zero APR card has no interest — the payoff time is simply balance ÷ payment.",
      "The calculator caps the simulation at 600 months (50 years).",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Underestimating how much interest accumulates over time.",
      "Assuming the minimum payment will clear the debt quickly.",
    ],
    assumptions: [
      "The APR is constant and applied monthly.",
      "You make the same fixed payment every month.",
      "No new purchases are added to the balance.",
      "No fees or penalties are charged.",
    ],
    limitations: [
      "Does not account for new purchases, balance transfers, or changing rates.",
      "Assumes a fixed APR; many cards have variable rates.",
      "This is an estimate, not a guarantee of your actual payoff timeline.",
    ],
    faqs: [
      {
        question: "Why does it take so long to pay off credit card debt?",
        answer:
          "Because interest accrues on the remaining balance each month. Early in the payoff, most of your payment goes toward interest rather than the principal, slowing your progress.",
      },
      {
        question: "Should I pay more than the minimum?",
        answer:
          "Yes. Paying more than the minimum reduces the principal faster, which means less interest accrues. Even a small increase in your monthly payment can save thousands in interest.",
      },
      {
        question: "What is a good strategy to pay off credit card debt?",
        answer:
          "The avalanche method (paying off the highest-APR card first) saves the most interest. The snowball method (paying off the smallest balance first) provides psychological wins. Both work — choose what keeps you motivated.",
      },
    ],
  },
  relatedCalculators: ["debt-payoff", "loan", "interest", "apr"],
  seo: { title: "Credit Card Payoff Calculator – Pay Off Debt Faster", description: "Calculate how long it takes to pay off credit card debt. Free, instant and accurate.", keywords: ["credit card payoff calculator", "credit card debt"], primaryIntent: "Calculate credit card payoff time", secondaryIntents: ["Debt payoff plan"] },
};

// ==================== DEBT PAYOFF ====================
export const debtPayoffCalculator: CalculatorDefinition = {
  id: "debt-payoff", slug: "debt-payoff-calculator", name: "Debt Payoff Calculator", category: "finance",
  shortDescription: "Calculate how long it takes to pay off debt.", icon: "banknote", accent: "finance", popularity: 83,
  inputs: [
    { id: "balance", label: "Total debt", type: "currency", unit: "₹", placeholder: "100000", defaultValue: 100000, validation: { required: true, min: 100, max: 10000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0, max: 40 } },
    { id: "payment", label: "Monthly payment", type: "currency", unit: "₹", placeholder: "5000", defaultValue: 5000, validation: { required: true, min: 10, max: 10000000 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const balance = parseNumber(v.balance) ?? 0, rate = parseNumber(v.rate) ?? 0, payment = parseNumber(v.payment) ?? 0;
    const monthlyRate = rate / 12 / 100;
    let remaining = balance, months = 0, totalInterest = 0;
    while (remaining > 0 && months < 600) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      remaining = remaining + interest - payment;
      months++;
      if (remaining <= 0) break;
    }
    const totalPaid = balance + totalInterest;
    return {
      sections: [
        { id: "primary", values: [{ id: "months", label: "TIME TO PAY OFF", value: `${months} months`, format: "text", primary: true, description: `≈ ${(months / 12).toFixed(1)} years` }] },
        { id: "summary", title: "Debt summary", values: [{ id: "total", label: "Total paid", value: roundTo(totalPaid), format: "currency" }, { id: "interest", label: "Total interest", value: roundTo(totalInterest), format: "currency" }] },
      ],
      interpretation: `Paying ${formatMoney(roundTo(payment), currency)} monthly against ${formatMoney(roundTo(balance), currency)} at ${rate}% would take ${months} months and cost ${formatMoney(roundTo(totalInterest), currency)} in interest.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Debt Payoff Calculator shows how long it takes to clear your total debt with a fixed monthly payment, and how much interest you will pay. It is useful for planning a debt-free timeline across loans, credit cards, and other obligations.",
    howToUse: [
      "Enter your total outstanding debt in rupees.",
      "Enter the annual interest rate on the debt.",
      "Enter the fixed amount you can pay each month.",
      "Press Calculate to see how many months it will take and the total interest.",
      "Adjust the payment to see how much faster you can become debt-free.",
    ],
    interpretation:
      "The calculator simulates your debt month by month. Each month, interest is added to the remaining balance, then your payment reduces it. The result shows how long it takes to reach zero and the total interest paid over that period.",
    formula: "Monthly interest = Remaining balance × (rate ÷ 12 ÷ 100)\n\nNew balance = Remaining + interest − payment\n\nRepeat until balance ≤ 0",
    variables: [
      { symbol: "Balance", name: "Total debt", description: "The total amount you owe across all debts." },
      { symbol: "Rate", name: "Interest rate", description: "The annual interest rate on the debt." },
      { symbol: "Payment", name: "Monthly payment", description: "The fixed amount you pay each month." },
    ],
    example: {
      title: "Example: ₹1,00,000 debt at 12%, ₹5,000/month",
      inputs: { "Total debt": "₹1,00,000", "Interest rate": "12%", "Monthly payment": "₹5,000" },
      steps: [
        "Monthly rate = 12% ÷ 12 = 1% = 0.01",
        "Month 1: interest = 1,00,000 × 0.01 = ₹1,000; new balance = 1,00,000 + 1,000 − 5,000 = ₹96,000",
        "Continue until balance reaches zero",
        "Total interest ≈ ₹12,000 over about 22 months",
      ],
      result: "≈ 22 months, ₹12,000 interest",
    },
    factors: [
      "Higher interest rates increase the total cost of debt.",
      "Larger monthly payments shorten the payoff period significantly.",
      "Consolidating high-interest debt can reduce the overall rate.",
      "Every extra rupee paid reduces future interest.",
    ],
    edgeCases: [
      "If the payment is less than the monthly interest, the debt grows and never gets paid off.",
      "A zero-interest debt is simply balance ÷ payment months.",
      "The calculator caps the simulation at 600 months (50 years).",
    ],
    commonMistakes: [
      "Using the annual rate instead of the monthly rate.",
      "Underestimating how much interest accumulates.",
      "Not accounting for multiple debts with different rates.",
    ],
    assumptions: [
      "The interest rate is constant.",
      "You make the same fixed payment every month.",
      "No new debt is added during the payoff period.",
    ],
    limitations: [
      "Assumes a single interest rate; real debts may have different rates.",
      "Does not account for fees, penalties, or changing rates.",
      "This is an estimate for planning, not financial advice.",
    ],
    faqs: [
      {
        question: "What is the debt snowball method?",
        answer:
          "The snowball method involves paying off your smallest debt first while making minimum payments on others. Once the smallest is cleared, you roll that payment into the next smallest. It provides quick wins that keep you motivated.",
      },
      {
        question: "What is the debt avalanche method?",
        answer:
          "The avalanche method involves paying off the debt with the highest interest rate first. This saves the most money in interest over time, though it may take longer to see your first debt cleared.",
      },
      {
        question: "How can I pay off debt faster?",
        answer:
          "Increase your monthly payment, reduce your interest rate (through consolidation or negotiation), and avoid adding new debt. Even small extra payments can significantly shorten your payoff timeline.",
      },
    ],
  },
  relatedCalculators: ["credit-card-payoff", "loan", "dti", "interest"],
  seo: { title: "Debt Payoff Calculator – Plan Your Debt Freedom", description: "Calculate how long it takes to pay off your debt. Free, instant and accurate.", keywords: ["debt payoff calculator", "debt repayment"], primaryIntent: "Calculate debt payoff time", secondaryIntents: ["Debt plan"] },
};

// ==================== DTI ====================
export const dtiCalculator: CalculatorDefinition = {
  id: "dti", slug: "dti-calculator", name: "Debt-to-Income (DTI) Calculator", category: "finance",
  shortDescription: "Calculate your debt-to-income ratio.", icon: "percent", accent: "finance", popularity: 82,
  inputs: [
    { id: "monthlyDebt", label: "Monthly debt payments", type: "currency", unit: "₹", placeholder: "20000", defaultValue: 20000, validation: { required: true, min: 0, max: 1000000 } },
    { id: "monthlyIncome", label: "Gross monthly income", type: "currency", unit: "₹", placeholder: "60000", defaultValue: 60000, validation: { required: true, min: 1, max: 10000000 } },
  ],
  calculate: (v) => {
    const debt = parseNumber(v.monthlyDebt) ?? 0, income = parseNumber(v.monthlyIncome) ?? 0;
    const dti = income > 0 ? (debt / income) * 100 : 0;
    const rating = dti < 36 ? "Healthy" : dti < 43 ? "Moderate" : "High";
    return {
      sections: [
        { id: "primary", values: [{ id: "dti", label: "DEBT-TO-INCOME RATIO", value: `${dti.toFixed(1)}%`, format: "text", primary: true, description: `${rating} - lenders generally prefer below 36%` }] },
        { id: "details", title: "Details", values: [{ id: "debt", label: "Monthly debt", value: roundTo(debt), format: "currency" }, { id: "income", label: "Monthly income", value: roundTo(income), format: "currency" }] },
      ],
      interpretation: `Your DTI is ${dti.toFixed(1)}%. This is considered ${rating.toLowerCase()} for lenders.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Debt-to-Income (DTI) Calculator measures your monthly debt payments against your gross monthly income. Lenders use this ratio to assess how much of your income goes toward debt and whether you can afford new borrowing.",
    howToUse: [
      "Enter your total monthly debt payments (loans, credit cards, EMIs).",
      "Enter your gross monthly income (before taxes).",
      "Press Calculate to see your DTI percentage and rating.",
      "Compare your result with lender thresholds (typically below 36% is preferred).",
      "Use the result to understand your borrowing capacity.",
    ],
    interpretation:
      "DTI is your monthly debt payments divided by your gross monthly income, expressed as a percentage. A lower DTI means more of your income is available for new obligations. Lenders generally prefer a DTI below 36%, with 43% often the maximum for qualified mortgages.",
    formula: "DTI = (Monthly debt payments ÷ Gross monthly income) × 100",
    variables: [
      { symbol: "Debt", name: "Monthly debt payments", description: "All your monthly debt obligations, including loans and credit cards." },
      { symbol: "Income", name: "Gross monthly income", description: "Your income before taxes and deductions." },
      { symbol: "DTI", name: "Debt-to-income ratio", description: "The percentage of income going toward debt." },
    ],
    example: {
      title: "Example: ₹20,000 debt against ₹60,000 income",
      inputs: { "Monthly debt": "₹20,000", "Monthly income": "₹60,000" },
      steps: [
        "DTI = 20,000 ÷ 60,000 × 100",
        "= 33.3%",
        "This is below 36%, considered healthy by most lenders.",
      ],
      result: "33.3% (Healthy)",
    },
    factors: [
      "Higher debt payments increase your DTI.",
      "Higher income lowers your DTI.",
      "Lenders use DTI alongside credit score to assess risk.",
      "A DTI above 43% may make it difficult to qualify for new loans.",
    ],
    edgeCases: [
      "If income is zero, DTI is undefined — the calculator returns 0.",
      "A DTI of 0% means you have no debt payments.",
      "DTI can exceed 100% if debt payments exceed income.",
    ],
    commonMistakes: [
      "Using net income instead of gross income.",
      "Forgetting to include all debt payments.",
      "Confusing DTI with credit utilization ratio.",
    ],
    assumptions: [
      "All debt payments are monthly and consistent.",
      "Income is stable and gross (before taxes).",
      "No other financial obligations are considered.",
    ],
    limitations: [
      "Does not account for your credit score, savings, or assets.",
      "Lenders may use different DTI thresholds for different loan types.",
      "This is a screening metric, not a complete financial assessment.",
    ],
    faqs: [
      {
        question: "What is a good DTI ratio?",
        answer:
          "A DTI below 36% is generally considered healthy. Between 36% and 43% is moderate, and above 43% may make it difficult to qualify for new loans.",
      },
      {
        question: "How is DTI different from credit utilization?",
        answer:
          "DTI compares your total debt payments to your income. Credit utilization compares your credit card balances to your credit limits. Both affect your creditworthiness but measure different things.",
      },
      {
        question: "How can I lower my DTI?",
        answer:
          "Increase your income, pay down debt, or both. Even small reductions in monthly debt payments can meaningfully lower your DTI and improve your borrowing options.",
      },
    ],
  },
  relatedCalculators: ["loan", "mortgage", "debt-payoff", "credit-card-payoff"],
  seo: { title: "Debt-to-Income (DTI) Calculator – What's Your DTI?", description: "Calculate your debt-to-income ratio. Free, instant and accurate.", keywords: ["dti calculator", "debt to income"], primaryIntent: "Calculate debt-to-income ratio", secondaryIntents: ["DTI for loans"] },
};

// ==================== ROI ====================
export const roiCalculator: CalculatorDefinition = {
  id: "roi", slug: "roi-calculator", name: "ROI Calculator", category: "finance",
  shortDescription: "Calculate return on investment and payback period.", icon: "trending-up", accent: "finance", popularity: 88,
  inputs: [
    { id: "investment", label: "Initial investment", type: "currency", unit: "₹", placeholder: "50000", defaultValue: 50000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "returns", label: "Final value", type: "currency", unit: "₹", placeholder: "75000", defaultValue: 75000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const investment = parseNumber(v.investment) ?? 0, returns = parseNumber(v.returns) ?? 0, years = parseNumber(v.years) ?? 5;
    const gain = returns - investment;
    const roi = investment > 0 ? (gain / investment) * 100 : 0;
    const annualized = years > 0 ? (Math.pow(returns / investment, 1 / years) - 1) * 100 : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "roi", label: "RETURN ON INVESTMENT", value: `${roi.toFixed(1)}%`, format: "text", primary: true, description: `over ${years} years` }] },
        { id: "details", title: "ROI details", values: [{ id: "gain", label: "Net gain", value: roundTo(gain), format: "currency" }, { id: "annual", label: "Annualized ROI", value: `${annualized.toFixed(1)}%`, format: "text" }] },
      ],
      interpretation: `Your investment of ${formatMoney(roundTo(investment), currency)} grew to ${formatMoney(roundTo(returns), currency)}, giving an ROI of ${roi.toFixed(1)}% over ${years} years.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The ROI Calculator shows your return on investment and annualized growth. It is useful for evaluating investments, comparing opportunities, and understanding how your money grows over time.",
    howToUse: [
      "Enter your initial investment amount in rupees.",
      "Enter the final value of the investment.",
      "Enter the number of years the investment was held.",
      "Press Calculate to see your total ROI and annualized return.",
      "Compare different investments to see which performs better.",
    ],
    interpretation:
      "ROI is the total gain (or loss) as a percentage of your initial investment. The annualized ROI shows the average yearly return, which is more useful for comparing investments held over different periods. A positive ROI means you made money; a negative ROI means you lost money.",
    formula: "ROI = ((Final value − Initial investment) ÷ Initial investment) × 100\n\nAnnualized ROI = ((Final value ÷ Initial investment)^(1/years) − 1) × 100",
    variables: [
      { symbol: "I", name: "Initial investment", description: "The amount you invested at the start." },
      { symbol: "F", name: "Final value", description: "The current or final value of the investment." },
      { symbol: "Y", name: "Years", description: "How long the investment was held." },
    ],
    example: {
      title: "Example: ₹50,000 invested, grew to ₹75,000 in 5 years",
      inputs: { "Initial investment": "₹50,000", "Final value": "₹75,000", Years: "5" },
      steps: [
        "Gain = 75,000 − 50,000 = ₹25,000",
        "ROI = (25,000 ÷ 50,000) × 100 = 50%",
        "Annualized = ((75,000 ÷ 50,000)^(1/5) − 1) × 100 ≈ 8.4%",
      ],
      result: "50% total ROI, 8.4% annualized",
    },
    factors: [
      "ROI does not account for the time value of money — a 50% return over 1 year is very different from 50% over 10 years.",
      "Annualized ROI is the better metric for comparing investments of different durations.",
      "Taxes, fees, and inflation reduce your real return.",
    ],
    edgeCases: [
      "If the final value equals the initial investment, ROI is 0%.",
      "If the final value is less than the initial investment, ROI is negative.",
      "The annualized formula requires a positive final value.",
    ],
    commonMistakes: [
      "Comparing total ROI across investments with different time periods.",
      "Ignoring taxes, fees, and inflation.",
      "Using ROI alone without considering risk.",
    ],
    assumptions: [
      "The final value is the total amount you receive.",
      "No additional contributions are made during the period.",
      "Returns are compounded annually for the annualized figure.",
    ],
    limitations: [
      "Does not account for risk, taxes, fees, or inflation.",
      "Assumes a single initial investment with no additional contributions.",
      "Past performance does not guarantee future results.",
    ],
    faqs: [
      {
        question: "What is the difference between ROI and annualized ROI?",
        answer:
          "ROI is the total return over the entire period. Annualized ROI is the average yearly return, which lets you compare investments held for different lengths of time on an equal basis.",
      },
      {
        question: "What is a good ROI?",
        answer:
          "A good ROI depends on the investment type and risk. As a general guide, 7–10% annualized is considered good for equity investments, while lower-risk investments may return 4–6%.",
      },
      {
        question: "Why is annualized ROI important?",
        answer:
          "Because a 50% return over 1 year is far better than 50% over 10 years. Annualized ROI normalizes returns to a yearly basis, making different investments comparable.",
      },
    ],
  },
  relatedCalculators: ["investment", "compound-interest", "sip", "cagr"],
  seo: { title: "ROI Calculator – Calculate Your Return on Investment", description: "Calculate ROI and annualized growth on any investment. Free, instant and accurate.", keywords: ["roi calculator", "return on investment"], primaryIntent: "Calculate ROI", secondaryIntents: ["Investment return"] },
};

// ==================== APR ====================
export const aprCalculator: CalculatorDefinition = {
  id: "apr", slug: "apr-calculator", name: "APR Calculator", category: "finance",
  shortDescription: "Calculate the Annual Percentage Rate on loans.", icon: "percent", accent: "finance", popularity: 81,
  inputs: [
    { id: "principal", label: "Loan amount", type: "currency", unit: "₹", placeholder: "100000", defaultValue: 100000, validation: { required: true, min: 1, max: 10000000 } },
    { id: "fees", label: "Loan fees", type: "currency", unit: "₹", placeholder: "2000", defaultValue: 2000, validation: { required: true, min: 0, max: 1000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0.1, max: 40 } },
    { id: "years", label: "Term", type: "number", unit: "years", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 30 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const principal = parseNumber(v.principal) ?? 0, fees = parseNumber(v.fees) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 5;
    const months = Math.round(years * 12);
    const mr = rate / 12 / 100;
    const factor = Math.pow(1 + mr, months);
    const emi = principal > 0 && mr > 0 ? (principal * mr * factor) / (factor - 1) : principal / months;
    const totalPayments = emi * months;
    const aprTotal = principal + fees;
    const apr = aprTotal > 0 ? ((totalPayments - aprTotal) / aprTotal / years) * 100 : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "apr", label: "ANNUAL PERCENTAGE RATE", value: `${apr.toFixed(1)}%`, format: "text", primary: true, description: `including fees` }] },
        { id: "details", title: "APR details", values: [{ id: "monthly", label: "Monthly payment", value: roundTo(emi), format: "currency" }, { id: "total", label: "Total payments", value: roundTo(totalPayments), format: "currency" }] },
      ],
      interpretation: `Including ${formatMoney(roundTo(fees), currency)} in fees, the effective APR is ${apr.toFixed(1)}% on your ${formatMoney(roundTo(principal), currency)} loan.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The APR Calculator shows the true annual cost of a loan, including fees. It is essential for comparing loan offers, because the advertised interest rate often does not reflect the full cost of borrowing.",
    howToUse: [
      "Enter the loan amount in rupees.",
      "Enter any loan fees (processing fees, origination fees, etc.).",
      "Enter the advertised annual interest rate.",
      "Enter the loan term in years.",
      "Press Calculate to see the effective APR and monthly payment.",
    ],
    interpretation:
      "APR (Annual Percentage Rate) is the true yearly cost of borrowing, including both the interest rate and any fees. It is always higher than the nominal interest rate when fees are present. Comparing APRs across lenders gives you a fairer picture of which loan is actually cheaper.",
    formula: "APR = ((Total payments − (Principal + Fees)) ÷ (Principal + Fees) ÷ Years) × 100\n\nMonthly payment uses the standard EMI formula.",
    variables: [
      { symbol: "P", name: "Principal", description: "The loan amount you borrow." },
      { symbol: "F", name: "Fees", description: "Any upfront fees charged by the lender." },
      { symbol: "R", name: "Interest rate", description: "The advertised annual interest rate." },
      { symbol: "Y", name: "Term", description: "The loan term in years." },
    ],
    example: {
      title: "Example: ₹1,00,000 loan at 10% with ₹2,000 fees for 5 years",
      inputs: { "Loan amount": "₹1,00,000", "Loan fees": "₹2,000", "Interest rate": "10%", Term: "5 years" },
      steps: [
        "Monthly payment ≈ ₹2,124",
        "Total payments = ₹2,124 × 60 = ₹1,27,440",
        "APR total = 1,00,000 + 2,000 = ₹1,02,000",
        "APR = ((1,27,440 − 1,02,000) ÷ 1,02,000 ÷ 5) × 100 ≈ 5.0%",
      ],
      result: "APR ≈ 5.0% (including fees)",
    },
    factors: [
      "Fees increase the effective cost of borrowing, raising the APR above the nominal rate.",
      "Shorter loan terms spread fees over fewer months, increasing the APR impact.",
      "APR is the best metric for comparing loans with different fee structures.",
    ],
    edgeCases: [
      "If fees are zero, APR equals the nominal interest rate.",
      "Very high fees on short-term loans can produce very high APRs.",
      "The calculator assumes fees are paid upfront.",
    ],
    commonMistakes: [
      "Comparing nominal interest rates instead of APRs.",
      "Ignoring processing fees when comparing loans.",
      "Assuming APR and interest rate are the same.",
    ],
    assumptions: [
      "Fees are paid upfront.",
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
    ],
    limitations: [
      "Does not account for late fees, prepayment penalties, or insurance.",
      "Assumes a fixed interest rate.",
      "This is an estimate; actual APR may vary by lender.",
    ],
    faqs: [
      {
        question: "What is the difference between APR and interest rate?",
        answer:
          "The interest rate is the cost of borrowing the principal. APR includes the interest rate plus any fees, giving the true annual cost. APR is always equal to or higher than the nominal interest rate.",
      },
      {
        question: "Why should I compare APRs instead of interest rates?",
        answer:
          "Because two loans with the same interest rate can have very different total costs if one has higher fees. APR accounts for both, giving you a fair comparison.",
      },
      {
        question: "Is a lower APR always better?",
        answer:
          "Generally yes, but consider other factors like loan term, flexibility, and prepayment options. A slightly higher APR with better terms may be a better choice for your situation.",
      },
    ],
  },
  relatedCalculators: ["loan", "interest", "mortgage", "auto-loan"],
  seo: { title: "APR Calculator – Find the True Loan Cost", description: "Calculate the Annual Percentage Rate including fees. Free, instant and accurate.", keywords: ["apr calculator", "annual percentage rate"], primaryIntent: "Calculate APR", secondaryIntents: ["Loan true cost"] },
};

// ==================== INFLATION ====================
export const inflationCalculator: CalculatorDefinition = {
  id: "inflation", slug: "inflation-calculator", name: "Inflation Calculator", category: "finance",
  shortDescription: "Calculate the effect of inflation on money over time.", icon: "trending-up", accent: "finance", popularity: 79,
  inputs: [
    { id: "amount", label: "Amount", type: "currency", unit: "₹", placeholder: "100000", defaultValue: 100000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "rate", label: "Inflation rate", type: "percentage", unit: "%", placeholder: "6", defaultValue: 6, validation: { required: true, min: 0, max: 20 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "10", defaultValue: 10, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const amount = parseNumber(v.amount) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 10;
    const futureValue = amount * Math.pow(1 + rate / 100, years);
    const loss = futureValue - amount;
    const purchasingPower = amount / Math.pow(1 + rate / 100, years);
    return {
      sections: [
        { id: "primary", values: [{ id: "future", label: "FUTURE VALUE", value: roundTo(futureValue), format: "currency", primary: true, description: `${amount.toLocaleString("en-IN")} at ${rate}% inflation in ${years} years` }] },
        { id: "details", title: "Inflation details", values: [{ id: "loss", label: "Increase in price", value: roundTo(loss), format: "currency" }, { id: "pp", label: "Purchasing power today", value: roundTo(purchasingPower), format: "currency" }] },
      ],
      interpretation: `Due to ${rate}% annual inflation, ${formatMoney(roundTo(amount), currency)} today would be worth ${formatMoney(roundTo(purchasingPower), currency)} in ${years} years' purchasing power.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Inflation Calculator shows how inflation erodes the purchasing power of money over time. It is useful for understanding the real value of savings, planning for future expenses, and comparing investment returns against inflation.",
    howToUse: [
      "Enter the amount of money in rupees.",
      "Enter the expected annual inflation rate.",
      "Enter the number of years.",
      "Press Calculate to see the future value and the purchasing power of your money.",
      "Use the result to understand how much more things will cost in the future.",
    ],
    interpretation:
      "Inflation causes prices to rise over time, meaning the same amount of money buys less in the future. The future value shows how much the same goods will cost, while the purchasing power shows what your money will be worth in today's terms.",
    formula: "Future value = Amount × (1 + rate/100)^years\n\nPurchasing power = Amount ÷ (1 + rate/100)^years",
    variables: [
      { symbol: "A", name: "Amount", description: "The amount of money you are considering." },
      { symbol: "R", name: "Inflation rate", description: "The expected annual inflation rate." },
      { symbol: "Y", name: "Years", description: "The number of years into the future." },
    ],
    example: {
      title: "Example: ₹1,00,000 at 6% inflation for 10 years",
      inputs: { Amount: "₹1,00,000", "Inflation rate": "6%", Years: "10" },
      steps: [
        "Future value = 1,00,000 × (1.06)^10 ≈ ₹1,79,085",
        "Purchasing power = 1,00,000 ÷ (1.06)^10 ≈ ₹55,840",
        "Your ₹1,00,000 today will buy what ₹55,840 buys today in 10 years.",
      ],
      result: "Future value ≈ ₹1,79,085; purchasing power ≈ ₹55,840",
    },
    factors: [
      "Higher inflation rates dramatically reduce purchasing power over time.",
      "Longer time horizons amplify the effect of inflation.",
      "Investment returns must exceed inflation to grow real wealth.",
    ],
    edgeCases: [
      "If inflation is 0%, future value equals the current amount.",
      "Negative inflation (deflation) would increase purchasing power.",
      "Very high inflation rates can make money nearly worthless over long periods.",
    ],
    commonMistakes: [
      "Confusing future value with purchasing power.",
      "Ignoring inflation when planning long-term savings.",
      "Using nominal returns without adjusting for inflation.",
    ],
    assumptions: [
      "The inflation rate is constant over the period.",
      "Inflation compounds annually.",
      "The rate reflects general price increases, not specific goods.",
    ],
    limitations: [
      "Actual inflation varies year to year and by category.",
      "Does not account for taxes on investment returns.",
      "This is an estimate for planning, not a prediction.",
    ],
    faqs: [
      {
        question: "What is the difference between nominal and real returns?",
        answer:
          "Nominal return is the raw percentage gain on an investment. Real return is the nominal return minus inflation, showing your actual increase in purchasing power.",
      },
      {
        question: "How does inflation affect my savings?",
        answer:
          "If your savings earn less than the inflation rate, their real value decreases over time. For example, money earning 4% while inflation is 6% loses 2% of its purchasing power each year.",
      },
      {
        question: "What is a typical inflation rate?",
        answer:
          "In India, inflation has historically ranged from 4–6% annually, though it can spike higher in some years. Central banks generally target around 4%.",
      },
    ],
  },
  relatedCalculators: ["interest", "investment", "savings", "compound-interest"],
  seo: { title: "Inflation Calculator – See How Inflation Eats Value", description: "Calculate the effect of inflation on your money. Free, instant and accurate.", keywords: ["inflation calculator", "inflation effect"], primaryIntent: "Calculate inflation effect", secondaryIntents: ["Purchasing power"] },
};

// ==================== TIP ====================
export const tipCalculator: CalculatorDefinition = {
  id: "tip", slug: "tip-calculator", name: "Tip Calculator", category: "finance",
  shortDescription: "Calculate tip amount and split the bill.", icon: "hand-coins", accent: "finance", popularity: 85,
  inputs: [
    { id: "bill", label: "Bill amount", type: "currency", unit: "₹", placeholder: "1000", defaultValue: 1000, validation: { required: true, min: 1, max: 10000000 } },
    { id: "tipPct", label: "Tip percentage", type: "percentage", unit: "%", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0, max: 100 } },
    { id: "people", label: "Number of people", type: "number", placeholder: "2", defaultValue: 2, validation: { required: true, min: 1, max: 100 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const bill = parseNumber(v.bill) ?? 0, tipPct = parseNumber(v.tipPct) ?? 0, people = Math.max(1, parseNumber(v.people) ?? 2);
    const tip = (bill * tipPct) / 100;
    const total = bill + tip;
    const perPerson = total / people;
    return {
      sections: [
        { id: "primary", values: [{ id: "total", label: "TOTAL TO PAY", value: roundTo(total), format: "currency", primary: true, description: `including ${tipPct}% tip` }] },
        { id: "details", title: "Split details", values: [{ id: "tip", label: "Tip amount", value: roundTo(tip), format: "currency" }, { id: "per", label: "Per person", value: roundTo(perPerson), format: "currency" }] },
      ],
      interpretation: `A ${tipPct}% tip on a ${formatMoney(roundTo(bill), currency)} bill is ${formatMoney(roundTo(tip), currency)}. Total: ${formatMoney(roundTo(total), currency)}. Each of ${people} pays ${formatMoney(roundTo(perPerson), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Tip Calculator shows the tip amount, total bill, and per-person share when splitting. It is useful for dining out, group payments, and service gratuities.",
    howToUse: [
      "Enter the bill amount in rupees.",
      "Enter the tip percentage you want to leave.",
      "Enter the number of people splitting the bill.",
      "Press Calculate to see the tip, total, and per-person amount.",
      "Adjust the tip percentage to see how it affects the total.",
    ],
    interpretation:
      "The tip is the bill amount multiplied by the tip percentage. The total is the bill plus tip. The per-person amount divides the total equally among the group.",
    formula: "Tip = Bill × (Tip % ÷ 100)\n\nTotal = Bill + Tip\n\nPer person = Total ÷ Number of people",
    variables: [
      { symbol: "B", name: "Bill", description: "The total bill amount before tip." },
      { symbol: "T", name: "Tip %", description: "The percentage of the bill you want to tip." },
      { symbol: "N", name: "People", description: "The number of people splitting the bill." },
    ],
    example: {
      title: "Example: ₹1,000 bill, 10% tip, 2 people",
      inputs: { Bill: "₹1,000", "Tip percentage": "10%", People: "2" },
      steps: [
        "Tip = 1,000 × 0.10 = ₹100",
        "Total = 1,000 + 100 = ₹1,100",
        "Per person = 1,100 ÷ 2 = ₹550",
      ],
      result: "₹100 tip, ₹1,100 total, ₹550 per person",
    },
    factors: [
      "Tip percentages vary by country and service quality.",
      "Some restaurants include a service charge in the bill.",
      "Splitting equally may not be fair if people ordered different amounts.",
    ],
    edgeCases: [
      "A 0% tip means the total equals the bill.",
      "If only one person, the per-person amount equals the total.",
      "Very large groups may have rounding considerations.",
    ],
    commonMistakes: [
      "Forgetting to include the service charge already on the bill.",
      "Calculating the tip on the after-tax amount instead of the pre-tax amount.",
      "Splitting unequally without adjusting the per-person amount.",
    ],
    assumptions: [
      "The tip is calculated on the bill amount you enter.",
      "The bill is split equally among all people.",
      "No additional charges are added.",
    ],
    limitations: [
      "Does not account for service charges already included.",
      "Assumes equal splitting.",
      "Tip customs vary by country and situation.",
    ],
    faqs: [
      {
        question: "What is a standard tip percentage?",
        answer:
          "In many countries, 10–15% is standard for good service, with 15–20% in the US. In India, a service charge is often already included, so an additional tip may not be expected.",
      },
      {
        question: "Should I tip on the pre-tax or after-tax amount?",
        answer:
          "Most people tip on the pre-tax amount, though some tip on the total. The difference is usually small, but tipping on the pre-tax amount is more common.",
      },
      {
        question: "How do I split a bill fairly?",
        answer:
          "If people ordered different amounts, calculate each person's share based on what they ordered plus their share of the tip. This calculator assumes equal splitting for simplicity.",
      },
    ],
  },
  relatedCalculators: ["percentage", "currency-converter", "sales-tax", "average"],
  seo: { title: "Tip Calculator – Tip Amount & Split the Bill", description: "Calculate tip amounts and split bills fairly. Free, instant and accurate.", keywords: ["tip calculator", "bill splitter"], primaryIntent: "Calculate tip", secondaryIntents: ["Split bill"] },
};

// ==================== SALES TAX ====================
export const salesTaxCalculator: CalculatorDefinition = {
  id: "sales-tax", slug: "sales-tax-calculator", name: "Sales Tax Calculator", category: "finance",
  shortDescription: "Calculate sales tax and after-tax price.", icon: "receipt", accent: "finance", popularity: 78,
  inputs: [
    { id: "price", label: "Price before tax", type: "currency", unit: "₹", placeholder: "1000", defaultValue: 1000, validation: { required: true, min: 0, max: 10000000 } },
    { id: "rate", label: "Tax rate", type: "percentage", unit: "%", placeholder: "18", defaultValue: 18, validation: { required: true, min: 0, max: 50 } },
  ],
  calculate: (v, currency = DEFAULT_CURRENCY) => {
    const price = parseNumber(v.price) ?? 0, rate = parseNumber(v.rate) ?? 0;
    const tax = (price * rate) / 100;
    const total = price + tax;
    return {
      sections: [
        { id: "primary", values: [{ id: "total", label: "PRICE AFTER TAX", value: roundTo(total), format: "currency", primary: true, description: `including ${rate}% tax` }] },
        { id: "details", title: "Tax details", values: [{ id: "tax", label: "Tax amount", value: roundTo(tax), format: "currency" }, { id: "price", label: "Price before tax", value: roundTo(price), format: "currency" }] },
      ],
      interpretation: `The ${rate}% tax on ${formatMoney(roundTo(price), currency)} is ${formatMoney(roundTo(tax), currency)}, making the total ${formatMoney(roundTo(total), currency)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Sales Tax Calculator shows the tax amount and the final price after tax. It is useful for shopping, budgeting, and understanding how much tax is added to purchases.",
    howToUse: [
      "Enter the price of the item before tax.",
      "Enter the applicable tax rate (e.g., GST, VAT, or sales tax).",
      "Press Calculate to see the tax amount and the total price.",
      "Use the result to budget for purchases or compare prices across regions.",
    ],
    interpretation:
      "The tax amount is the pre-tax price multiplied by the tax rate. The total is the pre-tax price plus the tax. This shows you exactly how much of the final price is tax.",
    formula: "Tax = Price × (Rate ÷ 100)\n\nTotal = Price + Tax",
    variables: [
      { symbol: "P", name: "Price", description: "The price of the item before tax." },
      { symbol: "R", name: "Tax rate", description: "The applicable tax rate as a percentage." },
      { symbol: "T", name: "Tax", description: "The amount of tax added to the price." },
    ],
    example: {
      title: "Example: ₹1,000 item at 18% tax",
      inputs: { "Price before tax": "₹1,000", "Tax rate": "18%" },
      steps: [
        "Tax = 1,000 × 0.18 = ₹180",
        "Total = 1,000 + 180 = ₹1,180",
      ],
      result: "₹180 tax, ₹1,180 total",
    },
    factors: [
      "Different goods and services have different tax rates.",
      "Some regions have multiple tax tiers (e.g., GST slabs in India).",
      "Tax-inclusive pricing means the displayed price already includes tax.",
    ],
    edgeCases: [
      "A 0% tax rate means the total equals the price.",
      "Very high tax rates can significantly increase the final price.",
      "The calculator assumes the price is pre-tax.",
    ],
    commonMistakes: [
      "Entering the after-tax price as the pre-tax price.",
      "Using the wrong tax rate for the item.",
      "Forgetting that some prices already include tax.",
    ],
    assumptions: [
      "The price you enter is before tax.",
      "A single tax rate applies.",
      "No discounts or additional charges are considered.",
    ],
    limitations: [
      "Does not account for multiple tax tiers or exemptions.",
      "Assumes a single tax rate.",
      "Tax rules vary by region and change over time.",
    ],
    faqs: [
      {
        question: "What is the difference between GST and sales tax?",
        answer:
          "GST (Goods and Services Tax) is a comprehensive tax on goods and services, common in India. Sales tax is typically applied only to goods. Both are added to the pre-tax price.",
      },
      {
        question: "How do I calculate the pre-tax price from a tax-inclusive price?",
        answer:
          "Divide the tax-inclusive price by (1 + rate/100). For example, ₹1,180 at 18% tax = 1,180 ÷ 1.18 = ₹1,000 pre-tax.",
      },
      {
        question: "What are the GST slabs in India?",
        answer:
          "India's GST has multiple slabs: 0%, 5%, 12%, 18%, and 28%, depending on the type of goods or service. Essential items are often taxed lower or exempt.",
      },
    ],
  },
  relatedCalculators: ["gst", "percentage", "tip", "discount"],
  seo: { title: "Sales Tax Calculator – Price Including Tax", description: "Calculate sales tax and final price. Free, instant and accurate.", keywords: ["sales tax calculator", "tax calculator"], primaryIntent: "Calculate sales tax", secondaryIntents: ["After-tax price"] },
};

// ==================== CURRENCY CONVERTER ====================
export const currencyConverterCalculator: CalculatorDefinition = {
  id: "currency-converter", slug: "currency-converter", name: "Currency Converter", category: "finance",
  shortDescription: "Convert between world currencies.", icon: "wallet-cards", accent: "finance", popularity: 93,
  inputs: [
    { id: "amount", label: "Amount", type: "currency", unit: "₹", placeholder: "1000", defaultValue: 1000, validation: { required: true, min: 0, max: 100000000 } },
    { id: "from", label: "From", type: "dropdown", defaultValue: "usd", options: [{ label: "USD", value: "usd" }, { label: "EUR", value: "eur" }, { label: "GBP", value: "gbp" }, { label: "INR", value: "inr" }, { label: "JPY", value: "jpy" }] },
    { id: "to", label: "To", type: "dropdown", defaultValue: "inr", options: [{ label: "USD", value: "usd" }, { label: "EUR", value: "eur" }, { label: "GBP", value: "gbp" }, { label: "INR", value: "inr" }, { label: "JPY", value: "jpy" }] },
  ],
  calculate: (v) => {
    const amount = parseNumber(v.amount) ?? 0;
    const from = String(v.from ?? "usd"), to = String(v.to ?? "inr");
    const rates: Record<string, number> = { usd: 1, eur: 0.92, gbp: 0.79, inr: 83, jpy: 150 };
    const result = amount * (rates[to] ?? 1) / (rates[from] ?? 1);
    const labels: Record<string, string> = { usd: "$", eur: "€", gbp: "£", inr: "₹", jpy: "¥" };
    return {
      sections: [
        { id: "primary", values: [{ id: "result", label: "CONVERTED AMOUNT", value: `${labels[to] ?? ""}${formatNumber(result, 2)}`, format: "text", primary: true, description: `${amount} ${from.toUpperCase()} to ${to.toUpperCase()}` }] },
      ],
      interpretation: `${amount} ${from.toUpperCase()} equals ${labels[to] ?? ""}${formatNumber(result, 2)} ${to.toUpperCase()}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Currency Converter converts between major world currencies including USD, EUR, GBP, INR, and JPY. It is useful for travel, international shopping, and understanding exchange rates.",
    howToUse: [
      "Enter the amount you want to convert.",
      "Select the currency you are converting from.",
      "Select the currency you are converting to.",
      "Press Calculate to see the converted amount.",
      "Use the result for travel budgeting or international transactions.",
    ],
    interpretation:
      "The converted amount is calculated by multiplying your amount by the exchange rate between the two currencies. The result shows how much your money is worth in the target currency.",
    formula: "Converted amount = Amount × (Rate of target ÷ Rate of source)",
    variables: [
      { symbol: "A", name: "Amount", description: "The amount of money you want to convert." },
      { symbol: "From", name: "Source currency", description: "The currency you are converting from." },
      { symbol: "To", name: "Target currency", description: "The currency you are converting to." },
    ],
    example: {
      title: "Example: $100 USD to INR",
      inputs: { Amount: "100", From: "USD", To: "INR" },
      steps: [
        "Rate: 1 USD = ₹83",
        "Converted = 100 × 83 = ₹8,300",
      ],
      result: "$100 = ₹8,300",
    },
    factors: [
      "Exchange rates fluctuate constantly based on market conditions.",
      "Banks and money changers add a margin to the mid-market rate.",
      "The rates used here are indicative and may not reflect real-time market rates.",
    ],
    edgeCases: [
      "Converting a currency to itself returns the same amount.",
      "Very large amounts may be subject to different rates or limits.",
      "The calculator uses fixed indicative rates, not live market rates.",
    ],
    commonMistakes: [
      "Assuming the displayed rate is the rate you will actually get.",
      "Forgetting that banks charge conversion fees.",
      "Using outdated rates for planning.",
    ],
    assumptions: [
      "The exchange rates are indicative and fixed for this calculator.",
      "No conversion fees are applied.",
      "The amount is in the source currency.",
    ],
    limitations: [
      "Rates are indicative, not live market rates.",
      "Does not account for bank margins or conversion fees.",
      "For accurate conversions, check current market rates.",
    ],
    faqs: [
      {
        question: "Why is the exchange rate different from what I see online?",
        answer:
          "This calculator uses fixed indicative rates for simplicity. Real exchange rates fluctuate constantly, and banks add a margin on top of the mid-market rate.",
      },
      {
        question: "How do I get the best exchange rate?",
        answer:
          "Compare rates from multiple providers, avoid airport money changers, and consider using a travel card or online transfer service that offers near mid-market rates.",
      },
      {
        question: "What is the mid-market rate?",
        answer:
          "The mid-market rate is the midpoint between the buy and sell rates in the global currency market. It is the fairest rate, but most providers add a margin on top of it.",
      },
    ],
  },
  relatedCalculators: ["unit-converter", "percentage", "tip", "sales-tax"],
  seo: { title: "Currency Converter – Convert USD, EUR, GBP, INR", description: "Convert between world currencies instantly. Free, accurate and easy to use.", keywords: ["currency converter", "exchange rate converter"], primaryIntent: "Convert currencies", secondaryIntents: ["USD to INR", "Currency rates"] },
};