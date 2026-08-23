/**
 * Finance Calculators - India Focused
 * Covers: PPF, CAGR, NPS, Gratuity, HRA, EPF, Income Tax India, Salary/Take-Home, Home/Car/Personal Loan EMI
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatINR, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";
import { calculateEMI } from "@/calculators/finance/emi";

const fin = {
  summary: "Calculate Indian financial outcomes with clear, accurate results.",
  howToUse: [
    "Enter the required financial details.",
    "Check that all values use the correct units and currency.",
    "Press Calculate to see the result instantly.",
    "Review the formula and interpretation shown with the result.",
    "Adjust the inputs to compare different scenarios.",
  ],
  interpretation: "The result is an estimate based on the standard Indian financial formula for this calculation.",
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
    "The standard Indian financial formula for this calculation is used.",
    "No taxes, fees, or other charges are included unless specified.",
  ],
  limitations: [
    "This is an estimate for planning purposes, not financial advice.",
    "Real-world results vary with market conditions, fees, and changing rates.",
    "Consult a qualified financial professional for significant decisions.",
  ],
  faqs: [] as { question: string; answer: string }[],
};

// ==================== PPF CALCULATOR ====================
export const ppfCalculator: CalculatorDefinition = {
  id: "ppf", slug: "ppf-calculator", name: "PPF Calculator", category: "finance",
  shortDescription: "Calculate Public Provident Fund growth and maturity.", icon: "wallet", accent: "finance", popularity: 91,
  inputs: [
    { id: "monthly", label: "Monthly deposit", type: "currency", unit: "₹", placeholder: "10000", defaultValue: 10000, validation: { required: true, min: 100, max: 150000 } },
    { id: "rate", label: "PPF rate", type: "percentage", unit: "%", placeholder: "7.1", defaultValue: 7.1, validation: { required: true, min: 0, max: 15 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "15", defaultValue: 15, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v) => {
    const monthly = parseNumber(v.monthly) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 15;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const invested = monthly * months;
    const maturity = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : invested;
    const interest = maturity - invested;
    return {
      sections: [
        { id: "primary", values: [{ id: "maturity", label: "MATURITY VALUE", value: formatINR(roundTo(maturity)), format: "currency", primary: true, description: `after ${years} years at ${rate}%` }] },
        { id: "summary", title: "PPF summary", values: [{ id: "invested", label: "Total deposited", value: formatINR(roundTo(invested)), format: "currency" }, { id: "interest", label: "Interest earned", value: formatINR(roundTo(interest)), format: "currency" }] },
      ],
      interpretation: `Depositing ${formatINR(roundTo(monthly))} monthly in PPF at ${rate}% for ${years} years can grow to ${formatINR(roundTo(maturity))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The PPF Calculator estimates how much your Public Provident Fund will grow to at maturity. PPF is a popular long-term savings scheme in India offering tax-free returns and government backing.",
    howToUse: [
      "Enter your monthly PPF deposit in rupees.",
      "Enter the current PPF interest rate (set quarterly by the government).",
      "Enter the number of years you plan to invest.",
      "Press Calculate to see the maturity value, total deposited, and interest earned.",
      "Adjust the inputs to compare different contribution amounts.",
    ],
    interpretation:
      "PPF compounds interest monthly on the balance. The maturity value combines your total deposits with the compounded interest. PPF interest is tax-free, making it a powerful long-term savings tool.",
    formula: "Maturity = Monthly × [((1 + r)^n − 1) / r] × (1 + r)\n\nWhere:\nr = monthly rate (annual ÷ 12 ÷ 100)\nn = number of months",
    variables: [
      { symbol: "M", name: "Monthly deposit", description: "How much you deposit each month (min ₹500, max ₹1.5 lakh/year)." },
      { symbol: "r", name: "Monthly rate", description: "The PPF interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The investment period in months." },
    ],
    example: {
      title: "Example: ₹10,000/month at 7.1% for 15 years",
      inputs: { "Monthly deposit": "₹10,000", "PPF rate": "7.1%", Years: "15" },
      steps: [
        "Monthly rate = 7.1% ÷ 12 = 0.592% = 0.00592",
        "Months = 15 × 12 = 180",
        "Total deposited = 10,000 × 180 = ₹18,00,000",
        "Maturity ≈ ₹32,00,000",
        "Interest earned ≈ ₹14,00,000",
      ],
      result: "≈ ₹32 lakh maturity",
    },
    factors: [
      "PPF has a 15-year lock-in period, extendable in blocks of 5 years.",
      "Interest is compounded annually but calculated monthly.",
      "PPF is EEE (Exempt-Exempt-Exempt) — deposits, interest, and maturity are tax-free.",
      "The interest rate is reviewed quarterly by the government.",
    ],
    edgeCases: [
      "Minimum annual deposit is ₹500; maximum is ₹1.5 lakh.",
      "If the rate is 0%, maturity equals total deposits.",
      "Partial withdrawals are allowed from year 7 under certain conditions.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Exceeding the ₹1.5 lakh annual deposit limit.",
      "Assuming the current rate will stay constant for 15+ years.",
    ],
    assumptions: [
      "The interest rate is constant over the investment period.",
      "Deposits are made at the beginning of each month.",
      "No partial withdrawals are made.",
    ],
    limitations: [
      "The actual PPF rate changes quarterly.",
      "Does not account for partial withdrawals or loan facilities.",
      "This is an estimate for planning, not a guarantee.",
    ],
    faqs: [
      {
        question: "What is the current PPF interest rate?",
        answer:
          "The PPF rate is set quarterly by the government. It has historically ranged from 7.1% to 8.7%. Check the latest rate before calculating.",
      },
      {
        question: "Is PPF tax-free?",
        answer:
          "Yes. PPF follows the EEE model — your deposits are tax-deductible (up to ₹1.5 lakh under Section 80C), the interest earned is tax-free, and the maturity amount is tax-free.",
      },
      {
        question: "Can I withdraw from PPF before 15 years?",
        answer:
          "Partial withdrawals are allowed from the 7th year, subject to limits. Full closure is only possible after 15 years, or earlier in specific circumstances like serious illness.",
      },
    ],
  },
  relatedCalculators: ["fd", "rd", "epf", "investment"],
  seo: { title: "PPF Calculator – Public Provident Fund Growth", description: "Calculate your PPF maturity value and interest. Free, instant and accurate.", keywords: ["ppf calculator", "public provident fund"], primaryIntent: "Calculate PPF maturity", secondaryIntents: ["PPF interest"] },
};

// ==================== CAGR CALCULATOR ====================
export const cagrCalculator: CalculatorDefinition = {
  id: "cagr", slug: "cagr-calculator", name: "CAGR Calculator", category: "finance",
  shortDescription: "Calculate Compound Annual Growth Rate.", icon: "trending-up", accent: "finance", popularity: 87,
  inputs: [
    { id: "begin", label: "Beginning value", type: "currency", unit: "₹", placeholder: "10000", defaultValue: 10000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "end", label: "Ending value", type: "currency", unit: "₹", placeholder: "20000", defaultValue: 20000, validation: { required: true, min: 1, max: 100000000 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v) => {
    const begin = parseNumber(v.begin) ?? 0, end = parseNumber(v.end) ?? 0, years = parseNumber(v.years) ?? 5;
    const cagr = begin > 0 ? (Math.pow(end / begin, 1 / years) - 1) * 100 : 0;
    const absolute = begin > 0 ? ((end - begin) / begin) * 100 : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "cagr", label: "COMPOUND ANNUAL GROWTH RATE", value: `${cagr.toFixed(2)}%`, format: "text", primary: true, description: `over ${years} years` }] },
        { id: "details", title: "Growth details", values: [{ id: "absolute", label: "Total return", value: `${absolute.toFixed(1)}%`, format: "text" }] },
      ],
      interpretation: `Your investment grew from ${formatINR(roundTo(begin))} to ${formatINR(roundTo(end))} over ${years} years, a CAGR of ${cagr.toFixed(2)}%.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The CAGR Calculator shows the compound annual growth rate of an investment. CAGR is the standard metric for comparing investment performance over different time periods.",
    howToUse: [
      "Enter the beginning value of your investment.",
      "Enter the ending value.",
      "Enter the number of years.",
      "Press Calculate to see the CAGR and total return.",
      "Compare CAGRs across different investments to see which performed better.",
    ],
    interpretation:
      "CAGR is the average annual growth rate that would produce the observed growth if the investment grew at a constant rate. It smooths out year-to-year volatility, giving a single comparable number.",
    formula: "CAGR = ((Ending value ÷ Beginning value)^(1/years) − 1) × 100",
    variables: [
      { symbol: "B", name: "Beginning value", description: "The value of the investment at the start." },
      { symbol: "E", name: "Ending value", description: "The value of the investment at the end." },
      { symbol: "Y", name: "Years", description: "The investment period in years." },
    ],
    example: {
      title: "Example: ₹10,000 grew to ₹20,000 in 5 years",
      inputs: { "Beginning value": "₹10,000", "Ending value": "₹20,000", Years: "5" },
      steps: [
        "CAGR = ((20,000 ÷ 10,000)^(1/5) − 1) × 100",
        "= (2^0.2 − 1) × 100",
        "= (1.1487 − 1) × 100",
        "= 14.87%",
      ],
      result: "14.87% CAGR",
    },
    factors: [
      "CAGR assumes constant growth, which real investments rarely achieve.",
      "It does not account for volatility or risk.",
      "CAGR is best for comparing investments held for different periods.",
    ],
    edgeCases: [
      "If ending value equals beginning value, CAGR is 0%.",
      "If ending value is less than beginning value, CAGR is negative.",
      "The formula requires positive beginning and ending values.",
    ],
    commonMistakes: [
      "Using simple average return instead of CAGR.",
      "Ignoring the time period when comparing returns.",
      "Assuming CAGR reflects actual year-by-year performance.",
    ],
    assumptions: [
      "The investment grows at a constant rate.",
      "No additional contributions or withdrawals are made.",
      "Returns are compounded annually.",
    ],
    limitations: [
      "Does not reflect volatility or risk.",
      "Assumes smooth growth, which is unrealistic for most investments.",
      "Past CAGR does not predict future performance.",
    ],
    faqs: [
      {
        question: "What is the difference between CAGR and average return?",
        answer:
          "Average return is the simple mean of yearly returns. CAGR is the geometric mean, accounting for compounding. CAGR is more accurate for measuring actual growth.",
      },
      {
        question: "Is a higher CAGR always better?",
        answer:
          "Not necessarily. Higher CAGR often comes with higher volatility and risk. Consider risk-adjusted returns and your investment horizon.",
      },
      {
        question: "How is CAGR different from ROI?",
        answer:
          "ROI is the total return over the entire period. CAGR is the annualized return. CAGR lets you compare investments held for different lengths of time.",
      },
    ],
  },
  relatedCalculators: ["roi", "investment", "compound-interest", "sip"],
  seo: { title: "CAGR Calculator – Compound Annual Growth Rate", description: "Calculate the CAGR of any investment. Free, instant and accurate.", keywords: ["cagr calculator", "compound annual growth rate"], primaryIntent: "Calculate CAGR", secondaryIntents: ["Investment growth rate"] },
};

// ==================== NPS CALCULATOR ====================
export const npsCalculator: CalculatorDefinition = {
  id: "nps", slug: "nps-calculator", name: "NPS Calculator", category: "finance",
  shortDescription: "Estimate National Pension System corpus and pension.", icon: "wallet", accent: "finance", popularity: 84,
  inputs: [
    { id: "monthly", label: "Monthly contribution", type: "currency", unit: "₹", placeholder: "5000", defaultValue: 5000, validation: { required: true, min: 500, max: 1000000 } },
    { id: "rate", label: "Expected return", type: "percentage", unit: "%", placeholder: "10", defaultValue: 10, validation: { required: true, min: 1, max: 20 } },
    { id: "years", label: "Years", type: "number", unit: "years", placeholder: "30", defaultValue: 30, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v) => {
    const monthly = parseNumber(v.monthly) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 30;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const corpus = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : monthly * months;
    const lumpSum = corpus * 0.6;
    const annuity = lumpSum * 0.06;
    const monthlyPension = annuity / 12;
    const invested = monthly * months;
    return {
      sections: [
        { id: "primary", values: [{ id: "corpus", label: "ESTIMATED NPS CORPUS", value: formatINR(roundTo(corpus)), format: "currency", primary: true, description: `after ${years} years` }] },
        { id: "summary", title: "NPS details", values: [{ id: "invested", label: "Total invested", value: formatINR(roundTo(invested)), format: "currency" }, { id: "lump", label: "Lump sum (60%)", value: formatINR(roundTo(lumpSum)), format: "currency" }, { id: "pension", label: "Est. monthly pension", value: formatINR(roundTo(monthlyPension)), format: "currency" }] },
      ],
      interpretation: `With ${formatINR(roundTo(monthly))} monthly NPS contributions at ${rate}% for ${years} years, your estimated corpus is ${formatINR(roundTo(corpus))} with a monthly pension of about ${formatINR(roundTo(monthlyPension))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The NPS Calculator estimates the corpus you could accumulate in the National Pension System and the monthly pension it could generate. NPS is a government-backed retirement savings scheme in India.",
    howToUse: [
      "Enter your monthly NPS contribution in rupees.",
      "Enter the expected annual return rate.",
      "Enter the number of years until retirement.",
      "Press Calculate to see the estimated corpus, lump sum, and monthly pension.",
      "Adjust the inputs to plan your retirement savings.",
    ],
    interpretation:
      "NPS accumulates your contributions with compounded returns. At retirement, 60% of the corpus can be withdrawn as a lump sum (tax-free), and 40% must be used to buy an annuity that provides a monthly pension.",
    formula: "Corpus = Monthly × [((1 + r)^n − 1) / r] × (1 + r)\n\nLump sum = Corpus × 60%\nMonthly pension ≈ (Lump sum × 6%) ÷ 12",
    variables: [
      { symbol: "M", name: "Monthly contribution", description: "How much you contribute to NPS each month." },
      { symbol: "r", name: "Monthly rate", description: "The expected annual return divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The number of months until retirement." },
    ],
    example: {
      title: "Example: ₹5,000/month at 10% for 30 years",
      inputs: { "Monthly contribution": "₹5,000", "Expected return": "10%", Years: "30" },
      steps: [
        "Monthly rate = 10% ÷ 12 = 0.833% = 0.00833",
        "Months = 30 × 12 = 360",
        "Corpus ≈ ₹1,13,00,000",
        "Lump sum (60%) ≈ ₹67,80,000",
        "Monthly pension ≈ ₹33,900",
      ],
      result: "≈ ₹1.13 crore corpus, ₹33,900/month pension",
    },
    factors: [
      "NPS offers tax benefits under Section 80CCD.",
      "Returns depend on the asset allocation (equity, corporate bonds, government securities).",
      "The annuity rate at retirement affects the monthly pension.",
      "Higher equity allocation typically means higher long-term returns but more volatility.",
    ],
    edgeCases: [
      "If the return rate is 0%, the corpus equals total contributions.",
      "The annuity rate used here (6%) is an estimate; actual rates vary.",
      "NPS has a mandatory annuity purchase of at least 40% of the corpus.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Assuming the annuity rate will be higher than current market rates.",
      "Ignoring the mandatory 40% annuity requirement.",
    ],
    assumptions: [
      "The return rate is constant over the investment period.",
      "Contributions are made monthly at the beginning of each month.",
      "The annuity rate is 6% of the lump sum.",
    ],
    limitations: [
      "Actual returns vary with market conditions and asset allocation.",
      "The annuity rate at retirement is not guaranteed.",
      "This is an estimate for planning, not a guarantee.",
    ],
    faqs: [
      {
        question: "What is the tax benefit of NPS?",
        answer:
          "NPS contributions are tax-deductible under Section 80CCD(1) up to 10% of salary (or 20% for self-employed), with an additional deduction under 80CCD(1B) up to ₹50,000.",
      },
      {
        question: "How much of the NPS corpus is tax-free at withdrawal?",
        answer:
          "Up to 60% of the corpus can be withdrawn as a lump sum at retirement, and this amount is tax-free. The remaining 40% must be used to purchase an annuity.",
      },
      {
        question: "What return rate should I expect from NPS?",
        answer:
          "Historically, NPS has delivered 9-12% annual returns depending on asset allocation. A conservative estimate of 8-10% is reasonable for planning.",
      },
    ],
  },
  relatedCalculators: ["ppf", "epf", "retirement", "investment"],
  seo: { title: "NPS Calculator – National Pension System Growth", description: "Estimate your NPS corpus and monthly pension. Free, instant and accurate.", keywords: ["nps calculator", "pension calculator"], primaryIntent: "Estimate NPS corpus", secondaryIntents: ["NPS pension"] },
};

// ==================== GRATUITY ====================
export const gratuityCalculator: CalculatorDefinition = {
  id: "gratuity", slug: "gratuity-calculator", name: "Gratuity Calculator", category: "finance",
  shortDescription: "Calculate gratuity payable to employees.", icon: "badge-check", accent: "finance", popularity: 80,
  inputs: [
    { id: "basic", label: "Last drawn basic salary", type: "currency", unit: "₹", placeholder: "30000", defaultValue: 30000, validation: { required: true, min: 100, max: 10000000 } },
    { id: "da", label: "Dearness allowance", type: "currency", unit: "₹", placeholder: "5000", defaultValue: 5000, validation: { required: true, min: 0, max: 1000000 } },
    { id: "years", label: "Years of service", type: "number", unit: "years", placeholder: "10", defaultValue: 10, validation: { required: true, min: 1, max: 50 } },
  ],
  calculate: (v) => {
    const basic = parseNumber(v.basic) ?? 0, da = parseNumber(v.da) ?? 0, years = parseNumber(v.years) ?? 10;
    const salary = basic + da;
    const gratuity = Math.min((salary * 15 * years) / 26, 2000000);
    return {
      sections: [
        { id: "primary", values: [{ id: "gratuity", label: "GRATUITY AMOUNT", value: formatINR(roundTo(gratuity)), format: "currency", primary: true, description: `for ${years} years of service` }] },
        { id: "details", title: "Gratuity details", values: [{ id: "salary", label: "Monthly salary (basic + DA)", value: formatINR(roundTo(salary)), format: "currency" }] },
      ],
      interpretation: `With a monthly salary of ${formatINR(roundTo(salary))} and ${years} years of service, gratuity is estimated at ${formatINR(roundTo(gratuity))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Gratuity Calculator estimates the gratuity payable to an employee under the Payment of Gratuity Act, 1972. Gratuity is a lump-sum payment made by an employer to an employee who has completed at least 5 years of continuous service.",
    howToUse: [
      "Enter your last drawn basic salary in rupees.",
      "Enter your dearness allowance (DA) in rupees.",
      "Enter your total years of service.",
      "Press Calculate to see the estimated gratuity amount.",
      "Note that gratuity is capped at ₹20 lakh for most employees.",
    ],
    interpretation:
      "Gratuity is calculated as (Last drawn salary × 15 × Years of service) ÷ 26. The factor 15 represents 15 days of salary for each completed year of service, and 26 is the number of working days in a month. The amount is capped at ₹20 lakh.",
    formula: "Gratuity = (Last drawn salary × 15 × Years of service) ÷ 26\n\nCapped at ₹20,00,000",
    variables: [
      { symbol: "S", name: "Last drawn salary", description: "Basic salary plus dearness allowance at the time of leaving." },
      { symbol: "Y", name: "Years of service", description: "The number of completed years of continuous service." },
    ],
    example: {
      title: "Example: ₹35,000 salary (basic + DA) for 10 years",
      inputs: { "Basic salary": "₹30,000", "Dearness allowance": "₹5,000", "Years of service": "10" },
      steps: [
        "Salary = 30,000 + 5,000 = ₹35,000",
        "Gratuity = (35,000 × 15 × 10) ÷ 26",
        "= 5,25,000 ÷ 26",
        "= ₹2,01,923",
      ],
      result: "≈ ₹2,01,923",
    },
    factors: [
      "Gratuity is tax-free up to ₹20 lakh.",
      "The 5-year minimum service requirement is waived in case of death or disability.",
      "The formula uses 26 working days per month, not 30.",
      "Gratuity is paid on resignation, retirement, or termination after 5 years.",
    ],
    edgeCases: [
      "If service is less than 5 years, gratuity is generally not payable (except on death/disability).",
      "The amount is capped at ₹20 lakh.",
      "Years of service are rounded to the nearest full year for the calculation.",
    ],
    commonMistakes: [
      "Using 30 days instead of 26 in the formula.",
      "Forgetting to include dearness allowance in the salary.",
      "Assuming gratuity is payable before 5 years of service.",
    ],
    assumptions: [
      "The employee has completed at least 5 years of continuous service.",
      "The salary is the last drawn basic plus DA.",
      "The Payment of Gratuity Act applies to the employer.",
    ],
    limitations: [
      "Does not account for employer-specific gratuity policies that may be more generous.",
      "The ₹20 lakh cap may change with amendments.",
      "This is an estimate; the actual amount depends on your employer's policy.",
    ],
    faqs: [
      {
        question: "Is gratuity taxable?",
        answer:
          "Gratuity is tax-free up to ₹20 lakh for employees covered under the Payment of Gratuity Act. Any amount above this is taxable.",
      },
      {
        question: "How many years of service are required for gratuity?",
        answer:
          "Generally, 5 years of continuous service is required. However, gratuity is payable even before 5 years in case of death or disability of the employee.",
      },
      {
        question: "What is the formula for gratuity?",
        answer:
          "Gratuity = (Last drawn basic salary + DA) × 15 × Years of service ÷ 26. The 15 represents 15 days of salary per year, and 26 is the working days in a month.",
      },
    ],
  },
  relatedCalculators: ["salary", "epf", "hra", "income-tax"],
  seo: { title: "Gratuity Calculator – Calculate Gratuity Amount", description: "Calculate gratuity payable after years of service. Free, instant and accurate.", keywords: ["gratuity calculator", "gratuity amount"], primaryIntent: "Calculate gratuity", secondaryIntents: ["Gratuity eligibility"] },
};

// ==================== HRA ====================
export const hraCalculator: CalculatorDefinition = {
  id: "hra", slug: "hra-calculator", name: "HRA Calculator", category: "finance",
  shortDescription: "Calculate House Rent Allowance exemption.", icon: "home", accent: "finance", popularity: 83,
  inputs: [
    { id: "basic", label: "Basic salary", type: "currency", unit: "₹", placeholder: "40000", defaultValue: 40000, validation: { required: true, min: 100, max: 10000000 } },
    { id: "hra", label: "HRA received", type: "currency", unit: "₹", placeholder: "16000", defaultValue: 16000, validation: { required: true, min: 0, max: 1000000 } },
    { id: "rent", label: "Rent paid", type: "currency", unit: "₹", placeholder: "15000", defaultValue: 15000, validation: { required: true, min: 0, max: 1000000 } },
    { id: "metro", label: "Metro city", type: "dropdown", defaultValue: "yes", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }] },
  ],
  calculate: (v) => {
    const basic = parseNumber(v.basic) ?? 0, hraRecv = parseNumber(v.hra) ?? 0, rent = parseNumber(v.rent) ?? 0;
    const metro = String(v.metro ?? "yes");
    const cityFactor = metro === "yes" ? 0.5 : 0.4;
    const exemption = Math.max(0, Math.min(hraRecv, basic * cityFactor, rent - basic * 0.1));
    const taxable = hraRecv - exemption;
    return {
      sections: [
        { id: "primary", values: [{ id: "exemption", label: "HRA EXEMPTION", value: formatINR(roundTo(exemption)), format: "currency", primary: true, description: `tax-exempt portion` }] },
        { id: "details", title: "HRA details", values: [{ id: "taxable", label: "Taxable HRA", value: formatINR(roundTo(taxable)), format: "currency" }] },
      ],
      interpretation: `Of your ${formatINR(roundTo(hraRecv))} HRA, ${formatINR(roundTo(exemption))} is tax-exempt and ${formatINR(roundTo(taxable))} is taxable.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The HRA Calculator shows the tax-exempt portion of your House Rent Allowance. HRA is a component of salary that helps employees cover rental expenses, and part of it is exempt from income tax.",
    howToUse: [
      "Enter your basic salary in rupees.",
      "Enter the HRA you receive each month.",
      "Enter the rent you pay each month.",
      "Select whether you live in a metro city.",
      "Press Calculate to see the tax-exempt and taxable portions of your HRA.",
    ],
    interpretation:
      "The HRA exemption is the minimum of three amounts: the actual HRA received, 50% of basic salary (40% for non-metro), and rent paid minus 10% of basic salary. The exemption reduces your taxable income.",
    formula: "Exemption = Minimum of:\n1. Actual HRA received\n2. 50% of basic salary (40% for non-metro)\n3. Rent paid − 10% of basic salary",
    variables: [
      { symbol: "B", name: "Basic salary", description: "Your basic monthly salary." },
      { symbol: "H", name: "HRA received", description: "The HRA component of your salary." },
      { symbol: "R", name: "Rent paid", description: "The rent you actually pay each month." },
    ],
    example: {
      title: "Example: ₹40,000 basic, ₹16,000 HRA, ₹15,000 rent (metro)",
      inputs: { "Basic salary": "₹40,000", "HRA received": "₹16,000", "Rent paid": "₹15,000", "Metro city": "Yes" },
      steps: [
        "Actual HRA = ₹16,000",
        "50% of basic = 40,000 × 0.5 = ₹20,000",
        "Rent − 10% of basic = 15,000 − 4,000 = ₹11,000",
        "Exemption = min(16,000, 20,000, 11,000) = ₹11,000",
        "Taxable HRA = 16,000 − 11,000 = ₹5,000",
      ],
      result: "₹11,000 exempt, ₹5,000 taxable",
    },
    factors: [
      "The exemption is higher in metro cities (50% vs 40% of basic).",
      "You must actually pay rent to claim HRA exemption.",
      "If you live with parents, rent paid to them can qualify if documented.",
      "HRA exemption is not available under the new tax regime.",
    ],
    edgeCases: [
      "If rent is less than 10% of basic, the exemption is zero.",
      "If you don't receive HRA, you cannot claim this exemption.",
      "The exemption cannot exceed the actual HRA received.",
    ],
    commonMistakes: [
      "Using 50% for non-metro cities.",
      "Forgetting that rent must exceed 10% of basic salary.",
      "Claiming HRA exemption under the new tax regime.",
    ],
    assumptions: [
      "You pay rent and can provide rent receipts.",
      "The basic salary is the same as used for HRA calculation.",
      "Standard HRA rules apply.",
    ],
    limitations: [
      "Does not account for special HRA rules for specific situations.",
      "The new tax regime does not allow HRA exemption.",
      "This is an estimate; consult a tax professional for your situation.",
    ],
    faqs: [
      {
        question: "Can I claim HRA exemption if I live with my parents?",
        answer:
          "Yes, if you pay rent to your parents and can provide rent receipts. The rent must be a genuine transaction, and your parents must declare it as income.",
      },
      {
        question: "Is HRA exemption available under the new tax regime?",
        answer:
          "No. The new tax regime does not allow HRA exemption. You must choose the old regime to claim HRA benefits.",
      },
      {
        question: "What if my HRA is more than my rent?",
        answer:
          "The exemption is limited to the minimum of the three amounts. If your rent is low, the exemption will be limited by the rent minus 10% of basic formula.",
      },
    ],
  },
  relatedCalculators: ["salary", "income-tax", "gratuity", "epf"],
  seo: { title: "HRA Calculator – House Rent Allowance Exemption", description: "Calculate your HRA tax exemption. Free, instant and accurate.", keywords: ["hra calculator", "house rent allowance"], primaryIntent: "Calculate HRA exemption", secondaryIntents: ["HRA tax"] },
};

// ==================== EPF CALCULATOR ====================
export const epfCalculator: CalculatorDefinition = {
  id: "epf", slug: "epf-calculator", name: "EPF Calculator", category: "finance",
  shortDescription: "Calculate Employee Provident Fund accumulation.", icon: "wallet", accent: "finance", popularity: 85,
  inputs: [
    { id: "basic", label: "Basic salary + DA", type: "currency", unit: "₹", placeholder: "30000", defaultValue: 30000, validation: { required: true, min: 100, max: 1000000 } },
    { id: "rate", label: "EPF interest rate", type: "percentage", unit: "%", placeholder: "8.25", defaultValue: 8.25, validation: { required: true, min: 0, max: 15 } },
    { id: "years", label: "Years of service", type: "number", unit: "years", placeholder: "20", defaultValue: 20, validation: { required: true, min: 1, max: 45 } },
  ],
  calculate: (v) => {
    const basic = parseNumber(v.basic) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 20;
    const employeeShare = basic * 0.12;
    const employerShare = basic * 0.0833;
    const monthly = employeeShare + employerShare;
    const mr = rate / 12 / 100, months = Math.round(years * 12);
    const corpus = monthly > 0 && mr > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : monthly * months;
    const invested = monthly * months;
    return {
      sections: [
        { id: "primary", values: [{ id: "corpus", label: "EPF CORPUS", value: formatINR(roundTo(corpus)), format: "currency", primary: true, description: `after ${years} years` }] },
        { id: "summary", title: "EPF details", values: [{ id: "monthly", label: "Monthly contribution", value: formatINR(roundTo(monthly)), format: "currency" }, { id: "invested", label: "Total contribution", value: formatINR(roundTo(invested)), format: "currency" }, { id: "interest", label: "Interest earned", value: formatINR(roundTo(corpus - invested)), format: "currency" }] },
      ],
      interpretation: `With basic salary of ${formatINR(roundTo(basic))}, your monthly EPF contribution is ${formatINR(roundTo(monthly))}. After ${years} years at ${rate}%, the corpus is about ${formatINR(roundTo(corpus))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The EPF Calculator estimates how much your Employee Provident Fund will accumulate over your career. EPF is a mandatory retirement savings scheme for salaried employees in India.",
    howToUse: [
      "Enter your basic salary plus dearness allowance.",
      "Enter the current EPF interest rate.",
      "Enter the number of years of service.",
      "Press Calculate to see the estimated corpus, monthly contribution, and interest earned.",
      "Adjust the inputs to plan your retirement savings.",
    ],
    interpretation:
      "Both you and your employer contribute 12% of your basic salary to EPF. The employer's share is split between EPF (8.33%) and EPS (3.67%). The corpus grows with compounded interest, which is currently around 8.25%.",
    formula: "Monthly contribution = (Employee 12% + Employer 8.33%) × Basic salary\n\nCorpus = Monthly × [((1 + r)^n − 1) / r] × (1 + r)",
    variables: [
      { symbol: "B", name: "Basic salary + DA", description: "The base salary used for EPF calculations." },
      { symbol: "r", name: "Monthly rate", description: "The EPF interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The number of months of service." },
    ],
    example: {
      title: "Example: ₹30,000 basic at 8.25% for 20 years",
      inputs: { "Basic salary + DA": "₹30,000", "EPF interest rate": "8.25%", "Years of service": "20" },
      steps: [
        "Employee share = 30,000 × 12% = ₹3,600",
        "Employer share = 30,000 × 8.33% = ₹2,499",
        "Monthly contribution = ₹6,099",
        "Corpus after 20 years ≈ ₹36,00,000",
      ],
      result: "≈ ₹36 lakh corpus",
    },
    factors: [
      "EPF interest is tax-free and compounds annually.",
      "The employer contribution is capped at 12% of basic salary.",
      "You can withdraw EPF partially for housing, education, or medical needs.",
      "The interest rate is reviewed annually by the EPFO.",
    ],
    edgeCases: [
      "If the interest rate is 0%, the corpus equals total contributions.",
      "The employer share calculation is simplified here; actual rules include EPS allocation.",
      "Withdrawals before 5 years of service are subject to tax.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Forgetting that the employer also contributes.",
      "Assuming the current interest rate will stay constant.",
    ],
    assumptions: [
      "The interest rate is constant over the service period.",
      "Contributions are made monthly.",
      "No partial withdrawals are made.",
    ],
    limitations: [
      "The actual employer contribution includes EPS allocation, which is simplified here.",
      "The interest rate changes annually.",
      "This is an estimate for planning, not a guarantee.",
    ],
    faqs: [
      {
        question: "What is the current EPF interest rate?",
        answer:
          "The EPF interest rate is set annually by the EPFO. It has been around 8.15-8.25% in recent years. Check the latest rate before calculating.",
      },
      {
        question: "Is EPF tax-free?",
        answer:
          "EPF is EEE (Exempt-Exempt-Exempt) — contributions are tax-deductible, interest is tax-free, and the maturity amount is tax-free if you have completed 5 years of continuous service.",
      },
      {
        question: "Can I withdraw EPF before retirement?",
        answer:
          "Yes, partial withdrawals are allowed for specific purposes like housing, education, marriage, or medical treatment. Full withdrawal is possible after retirement or after 2 months of unemployment.",
      },
    ],
  },
  relatedCalculators: ["ppf", "nps", "salary", "retirement"],
  seo: { title: "EPF Calculator – Employee Provident Fund Corpus", description: "Calculate your EPF accumulation over time. Free, instant and accurate.", keywords: ["epf calculator", "provident fund"], primaryIntent: "Calculate EPF corpus", secondaryIntents: ["EPF interest"] },
};

// ==================== INCOME TAX INDIA ====================
export const incomeTaxCalculator: CalculatorDefinition = {
  id: "income-tax", slug: "income-tax-calculator", name: "Income Tax Calculator (India)", category: "finance",
  shortDescription: "Calculate income tax under old and new regimes.", icon: "receipt", accent: "finance", popularity: 89,
  inputs: [
    { id: "income", label: "Annual taxable income", type: "currency", unit: "₹", placeholder: "800000", defaultValue: 800000, validation: { required: true, min: 0, max: 100000000 } },
    { id: "regime", label: "Tax regime", type: "dropdown", defaultValue: "new", options: [{ label: "New regime", value: "new" }, { label: "Old regime", value: "old" }] },
  ],
  calculate: (v) => {
    const income = parseNumber(v.income) ?? 0;
    const regime = String(v.regime ?? "new");
    let tax = 0;
    if (regime === "new") {
      const slabs = [[250000, 0.05], [500000, 0.10], [750000, 0.15], [1000000, 0.20], [1250000, 0.25], [1500000, 0.30]];
      let remaining = income - 250000;
      let prev = 250000;
      for (const [limit, rate] of slabs) {
        if (remaining <= 0) break;
        const tx = (Math.min(income, limit) - prev);
        tax += tx > 0 ? tx * rate : 0;
        prev = limit;
        remaining = income - limit;
      }
    } else {
      const slabs = [[250000, 0.05], [500000, 0.20], [1000000, 0.30]];
      let prev = 250000;
      for (const [limit, rate] of slabs) {
        const tx = Math.min(income, limit) - prev;
        if (tx > 0) tax += tx * rate;
        prev = limit;
      }
      if (income > 5000000) tax += income * 0.04;
    }
    // Apply New Regime rebate 87A
    if (regime === "new" && income <= 700000) tax = 0;
    if (regime === "old" && income <= 500000) tax = 0;
    // Apply Cess 4%
    if (tax > 0) tax += tax * 0.04;
    const takeHome = income - tax;
    return {
      sections: [
        { id: "primary", values: [{ id: "tax", label: "INCOME TAX", value: formatINR(roundTo(tax)), format: "currency", primary: true, description: `${regime} regime` }] },
        { id: "details", title: "Tax details", values: [{ id: "income", label: "Annual income", value: formatINR(roundTo(income)), format: "currency" }, { id: "takehome", label: "After-tax amount", value: formatINR(roundTo(takeHome)), format: "currency" }] },
      ],
      interpretation: `Under the ${regime} regime, your income tax for income of ${formatINR(roundTo(income))} is estimated at ${formatINR(roundTo(tax))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Income Tax Calculator estimates your income tax under both the old and new tax regimes in India. It helps you compare which regime results in lower tax for your income level.",
    howToUse: [
      "Enter your annual taxable income in rupees.",
      "Select the tax regime (new or old).",
      "Press Calculate to see your estimated income tax.",
      "Compare both regimes to see which is more beneficial for you.",
      "Note that the new regime has lower rates but fewer deductions.",
    ],
    interpretation:
      "Income tax is calculated on a slab basis — different portions of your income are taxed at different rates. The new regime offers lower rates but no deductions, while the old regime has higher rates but allows deductions like 80C, HRA, and home loan interest.",
    formula: "Tax is calculated on income slabs:\n\nNew regime: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), 15L+ (30%)\n\nOld regime: 0-2.5L (0%), 2.5-5L (5%), 5-10L (20%), 10L+ (30%)\n\nPlus 4% cess on tax",
    variables: [
      { symbol: "I", name: "Taxable income", description: "Your annual income after applicable deductions." },
      { symbol: "R", name: "Regime", description: "The tax regime you choose (new or old)." },
    ],
    example: {
      title: "Example: ₹8,00,000 income under new regime",
      inputs: { "Annual taxable income": "₹8,00,000", "Tax regime": "New" },
      steps: [
        "First ₹3,00,000: 0% = ₹0",
        "Next ₹4,00,000 (3L-7L): 5% = ₹20,000",
        "Next ₹1,00,000 (7L-8L): 10% = ₹10,000",
        "Tax = ₹30,000",
        "Cess (4%) = ₹1,200",
        "Total = ₹31,200",
      ],
      result: "≈ ₹31,200",
    },
    factors: [
      "The new regime has lower rates but no deductions.",
      "The old regime allows deductions like 80C, HRA, and home loan interest.",
      "A rebate under Section 87A makes tax zero for income up to ₹7 lakh (new) or ₹5 lakh (old).",
      "A 4% health and education cess is added to the tax.",
    ],
    edgeCases: [
      "Income up to ₹7 lakh (new) or ₹5 lakh (old) may have zero tax due to the 87A rebate.",
      "Surcharge applies to very high incomes (above ₹50 lakh).",
      "The calculator uses simplified slabs; actual tax may vary with deductions.",
    ],
    commonMistakes: [
      "Forgetting the 4% cess.",
      "Not considering the 87A rebate.",
      "Choosing a regime without comparing both options.",
    ],
    assumptions: [
      "The income is your taxable income after standard deductions.",
      "FY 2024-25 tax rates apply.",
      "No surcharge applies (income below ₹50 lakh).",
    ],
    limitations: [
      "Does not account for all deductions and exemptions.",
      "Surcharge for high incomes is not included.",
      "This is an estimate; consult a tax professional for accurate filing.",
    ],
    faqs: [
      {
        question: "Which tax regime is better?",
        answer:
          "It depends on your deductions. If you claim significant deductions (80C, HRA, home loan), the old regime may be better. If you have few deductions, the new regime's lower rates may win.",
      },
      {
        question: "What is the 87A rebate?",
        answer:
          "Section 87A provides a rebate that makes tax zero for income up to ₹7 lakh under the new regime and ₹5 lakh under the old regime.",
      },
      {
        question: "What is the cess?",
        answer:
          "A 4% health and education cess is added to the income tax amount. It is calculated on the total tax before the cess is applied.",
      },
    ],
  },
  relatedCalculators: ["salary", "hra", "epf", "gratuity"],
  seo: { title: "Income Tax Calculator (India) – Old & New Regime", description: "Calculate your income tax under old and new regimes. Free, instant and accurate.", keywords: ["income tax calculator", "tax calculator india"], primaryIntent: "Calculate income tax India", secondaryIntents: ["Old vs new regime"] },
};

// ==================== SALARY ====================
export const salaryCalculator: CalculatorDefinition = {
  id: "salary", slug: "salary-calculator", name: "Salary Calculator (Take-Home)", category: "finance",
  shortDescription: "Calculate take-home salary after deductions.", icon: "wallet", accent: "finance", popularity: 82,
  inputs: [
    { id: "ctc", label: "Annual CTC", type: "currency", unit: "₹", placeholder: "1000000", defaultValue: 1000000, validation: { required: true, min: 1000, max: 100000000 } },
    { id: "basic", label: "Basic salary (%)", type: "percentage", unit: "%", placeholder: "50", defaultValue: 50, validation: { required: true, min: 10, max: 90 } },
    { id: "pf", label: "PF contribution (%)", type: "percentage", unit: "%", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0, max: 12 } },
  ],
  calculate: (v) => {
    const ctc = parseNumber(v.ctc) ?? 0, basicPct = parseNumber(v.basic) ?? 0, pfPct = parseNumber(v.pf) ?? 0;
    const basic = ctc * basicPct / 100;
    const pf = basic * pfPct / 100;
    const gross = ctc - pf - ctc * 0.04;
    const monthly = gross / 12;
    return {
      sections: [
        { id: "primary", values: [{ id: "monthly", label: "ESTIMATED MONTHLY TAKE-HOME", value: formatINR(roundTo(monthly)), format: "currency", primary: true, description: `of ${formatINR(roundTo(ctc))} CTC` }] },
        { id: "details", title: "Salary details", values: [{ id: "basic", label: "Basic salary", value: formatINR(roundTo(basic)), format: "currency" }, { id: "pf", label: "Annual PF", value: formatINR(roundTo(pf)), format: "currency" }] },
      ],
      interpretation: `From a CTC of ${formatINR(roundTo(ctc))}, your estimated monthly take-home is around ${formatINR(roundTo(monthly))} after PF and standard deductions.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Salary Calculator estimates your monthly take-home salary from your annual CTC (Cost to Company). It helps you understand how much of your CTC actually reaches your bank account after deductions.",
    howToUse: [
      "Enter your annual CTC in rupees.",
      "Enter the percentage of CTC that is basic salary.",
      "Enter your PF contribution percentage.",
      "Press Calculate to see your estimated monthly take-home.",
      "Adjust the inputs to understand how different structures affect take-home.",
    ],
    interpretation:
      "Your CTC includes your salary plus employer contributions. The take-home is what remains after deducting your PF contribution and other standard deductions. The basic salary percentage affects how much goes to PF and other benefits.",
    formula: "Basic salary = CTC × Basic %\n\nPF = Basic × PF %\n\nGross = CTC − PF − Other deductions\n\nMonthly take-home = Gross ÷ 12",
    variables: [
      { symbol: "C", name: "CTC", description: "Your annual Cost to Company." },
      { symbol: "B", name: "Basic %", description: "The percentage of CTC that is basic salary." },
      { symbol: "P", name: "PF %", description: "Your PF contribution as a percentage of basic." },
    ],
    example: {
      title: "Example: ₹10,00,000 CTC, 50% basic, 12% PF",
      inputs: { "Annual CTC": "₹10,00,000", "Basic salary (%)": "50%", "PF contribution (%)": "12%" },
      steps: [
        "Basic = 10,00,000 × 0.5 = ₹5,00,000",
        "PF = 5,00,000 × 0.12 = ₹60,000",
        "Gross = 10,00,000 − 60,000 − 40,000 = ₹9,00,000",
        "Monthly take-home = 9,00,000 ÷ 12 = ₹75,000",
      ],
      result: "≈ ₹75,000/month",
    },
    factors: [
      "Higher basic salary means higher PF contributions.",
      "The PF contribution is capped at 12% of basic.",
      "Other deductions like professional tax and income tax reduce take-home.",
      "A higher CTC does not always mean a proportionally higher take-home.",
    ],
    edgeCases: [
      "If PF % is 0, no PF is deducted.",
      "Very high basic percentages result in higher PF deductions.",
      "The calculator uses simplified deductions; actual take-home varies.",
    ],
    commonMistakes: [
      "Confusing CTC with take-home salary.",
      "Forgetting that employer PF is part of CTC but not take-home.",
      "Ignoring income tax and other deductions.",
    ],
    assumptions: [
      "The basic salary percentage is applied to the full CTC.",
      "PF is deducted at the specified percentage of basic.",
      "Standard deductions are applied.",
    ],
    limitations: [
      "Does not account for income tax, professional tax, or other deductions.",
      "The actual take-home depends on your specific salary structure.",
      "This is an estimate; check your payslip for exact figures.",
    ],
    faqs: [
      {
        question: "What is the difference between CTC and take-home salary?",
        answer:
          "CTC is the total cost to your employer, including your salary and employer contributions. Take-home is what you actually receive after all deductions like PF, tax, and other contributions.",
      },
      {
        question: "Why is my take-home lower than expected?",
        answer:
          "Deductions like PF, income tax, professional tax, and insurance premiums reduce your take-home. Your salary structure determines how much is deducted.",
      },
      {
        question: "What is a good basic salary percentage?",
        answer:
          "Basic salary is typically 40-50% of CTC. A higher basic means higher PF and gratuity, but also higher tax. A lower basic means lower PF but potentially higher allowances.",
      },
    ],
  },
  relatedCalculators: ["income-tax", "hra", "gratuity", "epf"],
  seo: { title: "Salary Calculator – Take-Home from CTC", description: "Calculate your take-home salary from CTC. Free, instant and accurate.", keywords: ["salary calculator", "take home salary"], primaryIntent: "Calculate take-home salary", secondaryIntents: ["CTC to take home"] },
};

// ==================== HOME LOAN EMI ====================
export const homeLoanEmiCalculator: CalculatorDefinition = {
  id: "home-loan-emi", slug: "home-loan-emi-calculator", name: "Home Loan EMI Calculator", category: "finance",
  shortDescription: "Calculate home loan EMI, interest and total cost.", icon: "home", accent: "finance", popularity: 94,
  inputs: [
    { id: "principal", label: "Loan amount", type: "currency", unit: "₹", placeholder: "5000000", defaultValue: 5000000, validation: { required: true, min: 1000, max: 1000000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "8.5", defaultValue: 8.5, validation: { required: true, min: 0.1, max: 20 } },
    { id: "years", label: "Loan term", type: "number", unit: "years", placeholder: "20", defaultValue: 20, validation: { required: true, min: 1, max: 40 } },
  ],
  calculate: (v) => {
    const principal = parseNumber(v.principal) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 20;
    const months = Math.round(years * 12);
    const emi = principal > 0 ? calculateEMI(principal, rate, months) : 0;
    const totalPayment = emi * months, totalInterest = totalPayment - principal;
    return {
      sections: [
        { id: "primary", values: [{ id: "emi", label: "MONTHLY EMI", value: formatINR(roundTo(emi)), format: "currency", primary: true, description: `for ${months} months` }] },
        { id: "summary", title: "Loan summary", values: [{ id: "interest", label: "Total interest", value: formatINR(roundTo(totalInterest)), format: "currency" }, { id: "total", label: "Total payment", value: formatINR(roundTo(totalPayment)), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Principal vs Interest", data: [{ label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Your home loan of ${formatINR(roundTo(principal))} has an EMI of ${formatINR(roundTo(emi))}. Total interest: ${formatINR(roundTo(totalInterest))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Home Loan EMI Calculator shows your monthly EMI, total interest, and total cost for a home loan. It is essential for planning one of the largest financial commitments most people make.",
    howToUse: [
      "Enter the home loan amount in rupees.",
      "Enter the annual interest rate.",
      "Enter the loan term in years.",
      "Press Calculate to see your monthly EMI, total interest, and total payment.",
      "Compare different loan amounts and terms to find what fits your budget.",
    ],
    interpretation:
      "Your EMI is the fixed monthly payment that covers both principal and interest. Over the loan term, you pay back the principal plus interest. Home loans typically have the longest terms (up to 30-40 years), which means interest can exceed the principal.",
    formula: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nWhere:\nP = Loan amount\nr = Monthly rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Loan amount", description: "The amount you borrow for the home." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The loan term in months." },
    ],
    example: {
      title: "Example: ₹50,00,000 at 8.5% for 20 years",
      inputs: { "Loan amount": "₹50,00,000", "Interest rate": "8.5%", "Loan term": "20 years" },
      steps: [
        "Monthly rate = 8.5% ÷ 12 = 0.708% = 0.00708",
        "Months = 20 × 12 = 240",
        "EMI ≈ ₹43,391",
        "Total payment = 43,391 × 240 = ₹1,04,13,840",
        "Total interest = 1,04,13,840 − 50,00,000 = ₹54,13,840",
      ],
      result: "EMI ≈ ₹43,391/month",
    },
    factors: [
      "Home loans have the longest terms, which increases total interest.",
      "A higher down payment reduces the loan amount and total interest.",
      "Interest rates on home loans are often lower than other loans.",
      "Prepayments can significantly reduce total interest.",
    ],
    edgeCases: [
      "If the interest rate is 0%, EMI is simply principal ÷ months.",
      "Very long terms (30+ years) can result in interest exceeding the principal.",
      "Floating-rate home loans have EMIs that change with the benchmark rate.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Underestimating the total interest over a long term.",
      "Not accounting for processing fees and other charges.",
    ],
    assumptions: [
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
      "No prepayments or restructuring occur.",
    ],
    limitations: [
      "Does not include processing fees, insurance, or taxes.",
      "Floating-rate loans will have changing EMIs.",
      "This is an estimate, not a loan quote.",
    ],
    faqs: [
      {
        question: "How much home loan can I afford?",
        answer:
          "A common rule is that your EMI should not exceed 40-50% of your monthly income. Use this calculator to see what EMI different loan amounts produce, then compare with your budget.",
      },
      {
        question: "Should I choose a longer or shorter home loan term?",
        answer:
          "A longer term means lower EMIs but much more total interest. A shorter term means higher EMIs but significantly less interest. Choose based on your monthly budget and long-term goals.",
      },
      {
        question: "How can I reduce my home loan interest?",
        answer:
          "Make a larger down payment, choose a shorter term, and make prepayments when possible. Even small prepayments can save lakhs in interest over a 20-year loan.",
      },
    ],
  },
  relatedCalculators: ["emi", "mortgage", "loan", "personal-loan-emi"],
  seo: { title: "Home Loan EMI Calculator – Monthly Payment", description: "Calculate your home loan EMI, total interest and total cost. Free, instant and accurate.", keywords: ["home loan emi calculator", "home loan emi"], primaryIntent: "Calculate home loan EMI", secondaryIntents: ["Home loan interest"] },
};

// ==================== CAR LOAN EMI ====================
export const carLoanEmiCalculator: CalculatorDefinition = {
  id: "car-loan-emi", slug: "car-loan-emi-calculator", name: "Car Loan EMI Calculator", category: "finance",
  shortDescription: "Calculate car loan EMI, interest and total cost.", icon: "car", accent: "finance", popularity: 93,
  inputs: [
    { id: "principal", label: "Loan amount", type: "currency", unit: "₹", placeholder: "800000", defaultValue: 800000, validation: { required: true, min: 1000, max: 100000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "9", defaultValue: 9, validation: { required: true, min: 0.1, max: 25 } },
    { id: "years", label: "Loan term", type: "number", unit: "years", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 8 } },
  ],
  calculate: (v) => {
    const principal = parseNumber(v.principal) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 5;
    const months = Math.round(years * 12);
    const emi = principal > 0 ? calculateEMI(principal, rate, months) : 0;
    const totalPayment = emi * months, totalInterest = totalPayment - principal;
    return {
      sections: [
        { id: "primary", values: [{ id: "emi", label: "MONTHLY EMI", value: formatINR(roundTo(emi)), format: "currency", primary: true, description: `for ${months} months` }] },
        { id: "summary", title: "Loan summary", values: [{ id: "interest", label: "Total interest", value: formatINR(roundTo(totalInterest)), format: "currency" }, { id: "total", label: "Total payment", value: formatINR(roundTo(totalPayment)), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Principal vs Interest", data: [{ label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Your car loan of ${formatINR(roundTo(principal))} has an EMI of ${formatINR(roundTo(emi))}. Total interest: ${formatINR(roundTo(totalInterest))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Car Loan EMI Calculator shows your monthly EMI, total interest, and total cost for a car loan. It helps you budget for one of the most common consumer loans.",
    howToUse: [
      "Enter the car loan amount in rupees.",
      "Enter the annual interest rate.",
      "Enter the loan term in years (typically 3-7 years).",
      "Press Calculate to see your monthly EMI, total interest, and total payment.",
      "Compare different down payments and terms to fit your budget.",
    ],
    interpretation:
      "Your EMI is the fixed monthly payment covering both principal and interest. Car loans have shorter terms than home loans (typically 3-7 years), so the total interest is lower, but the monthly EMI is higher for the same loan amount.",
    formula: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nWhere:\nP = Loan amount\nr = Monthly rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Loan amount", description: "The amount you borrow for the car." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The loan term in months." },
    ],
    example: {
      title: "Example: ₹8,00,000 at 9% for 5 years",
      inputs: { "Loan amount": "₹8,00,000", "Interest rate": "9%", "Loan term": "5 years" },
      steps: [
        "Monthly rate = 9% ÷ 12 = 0.75% = 0.0075",
        "Months = 5 × 12 = 60",
        "EMI ≈ ₹16,607",
        "Total payment = 16,607 × 60 = ₹9,96,420",
        "Total interest = 9,96,420 − 8,00,000 = ₹1,96,420",
      ],
      result: "EMI ≈ ₹16,607/month",
    },
    factors: [
      "Car loans have shorter terms, so total interest is lower than home loans.",
      "A larger down payment reduces the loan amount and EMI.",
      "Car loan interest rates are often higher than home loans.",
      "The car depreciates, so the loan can exceed the car's value early on.",
    ],
    edgeCases: [
      "If the interest rate is 0%, EMI is simply principal ÷ months.",
      "Very short terms (1-2 years) have high EMIs but low total interest.",
      "Some lenders offer balloon payments or different structures.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Not accounting for insurance and registration costs.",
      "Choosing a term that's too long for a depreciating asset.",
    ],
    assumptions: [
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
      "No prepayments or restructuring occur.",
    ],
    limitations: [
      "Does not include insurance, registration, or other costs.",
      "This is an estimate, not a loan quote.",
      "Actual rates vary by lender and credit profile.",
    ],
    faqs: [
      {
        question: "How much down payment should I make on a car?",
        answer:
          "A down payment of 20-30% of the car's price is recommended. A larger down payment reduces your loan amount, EMI, and total interest.",
      },
      {
        question: "What is a good car loan term?",
        answer:
          "Most car loans are 3-7 years. A shorter term means higher EMIs but less total interest. Since cars depreciate, avoid very long terms that can leave you owing more than the car is worth.",
      },
      {
        question: "Can I prepay my car loan?",
        answer:
          "Yes, most lenders allow prepayment, though some charge a penalty. Prepaying reduces the principal and saves on future interest.",
      },
    ],
  },
  relatedCalculators: ["emi", "auto-loan", "loan", "home-loan-emi"],
  seo: { title: "Car Loan EMI Calculator – Monthly Payment", description: "Calculate your car loan EMI, total interest and total cost. Free, instant and accurate.", keywords: ["car loan emi calculator", "car emi"], primaryIntent: "Calculate car loan EMI", secondaryIntents: ["Car loan interest"] },
};

// ==================== PERSONAL LOAN EMI ====================
export const personalLoanEmiCalculator: CalculatorDefinition = {
  id: "personal-loan-emi", slug: "personal-loan-emi-calculator", name: "Personal Loan EMI Calculator", category: "finance",
  shortDescription: "Calculate personal loan EMI, interest and total cost.", icon: "banknote", accent: "finance", popularity: 92,
  inputs: [
    { id: "principal", label: "Loan amount", type: "currency", unit: "₹", placeholder: "300000", defaultValue: 300000, validation: { required: true, min: 1000, max: 10000000 } },
    { id: "rate", label: "Interest rate", type: "percentage", unit: "%", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0.1, max: 30 } },
    { id: "years", label: "Loan term", type: "number", unit: "years", placeholder: "3", defaultValue: 3, validation: { required: true, min: 1, max: 7 } },
  ],
  calculate: (v) => {
    const principal = parseNumber(v.principal) ?? 0, rate = parseNumber(v.rate) ?? 0, years = parseNumber(v.years) ?? 3;
    const months = Math.round(years * 12);
    const emi = principal > 0 ? calculateEMI(principal, rate, months) : 0;
    const totalPayment = emi * months, totalInterest = totalPayment - principal;
    return {
      sections: [
        { id: "primary", values: [{ id: "emi", label: "MONTHLY EMI", value: formatINR(roundTo(emi)), format: "currency", primary: true, description: `for ${months} months` }] },
        { id: "summary", title: "Loan summary", values: [{ id: "interest", label: "Total interest", value: formatINR(roundTo(totalInterest)), format: "currency" }, { id: "total", label: "Total payment", value: formatINR(roundTo(totalPayment)), format: "currency" }] },
      ],
      chart: { type: "bar", title: "Principal vs Interest", data: [{ label: "Principal", value: roundTo(principal, 0), color: "var(--accent)" }, { label: "Interest", value: roundTo(totalInterest, 0), color: "var(--muted)" }] },
      interpretation: `Your personal loan of ${formatINR(roundTo(principal))} has an EMI of ${formatINR(roundTo(emi))}. Total interest: ${formatINR(roundTo(totalInterest))}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Personal Loan EMI Calculator shows your monthly EMI, total interest, and total cost for a personal loan. Personal loans are unsecured, so they typically have higher interest rates than home or car loans.",
    howToUse: [
      "Enter the personal loan amount in rupees.",
      "Enter the annual interest rate.",
      "Enter the loan term in years (typically 1-7 years).",
      "Press Calculate to see your monthly EMI, total interest, and total payment.",
      "Compare different loan amounts and terms to find what fits your budget.",
    ],
    interpretation:
      "Your EMI is the fixed monthly payment covering both principal and interest. Personal loans have higher interest rates because they are unsecured, but shorter terms mean the total interest is often lower than a home loan.",
    formula: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nWhere:\nP = Loan amount\nr = Monthly rate (annual ÷ 12 ÷ 100)\nn = Number of months",
    variables: [
      { symbol: "P", name: "Loan amount", description: "The amount you borrow." },
      { symbol: "r", name: "Monthly rate", description: "The annual interest rate divided by 12 and 100." },
      { symbol: "n", name: "Months", description: "The loan term in months." },
    ],
    example: {
      title: "Example: ₹3,00,000 at 12% for 3 years",
      inputs: { "Loan amount": "₹3,00,000", "Interest rate": "12%", "Loan term": "3 years" },
      steps: [
        "Monthly rate = 12% ÷ 12 = 1% = 0.01",
        "Months = 3 × 12 = 36",
        "EMI ≈ ₹9,964",
        "Total payment = 9,964 × 36 = ₹3,58,704",
        "Total interest = 3,58,704 − 3,00,000 = ₹58,704",
      ],
      result: "EMI ≈ ₹9,964/month",
    },
    factors: [
      "Personal loans have higher interest rates because they are unsecured.",
      "Shorter terms mean higher EMIs but less total interest.",
      "Your credit score significantly affects the interest rate offered.",
      "Processing fees add to the effective cost of the loan.",
    ],
    edgeCases: [
      "If the interest rate is 0%, EMI is simply principal ÷ months.",
      "Very short terms (1 year) have high EMIs but low total interest.",
      "Some lenders charge prepayment penalties.",
    ],
    commonMistakes: [
      "Using the annual rate directly instead of dividing by 12.",
      "Not accounting for processing fees.",
      "Borrowing more than you can comfortably repay.",
    ],
    assumptions: [
      "The interest rate is fixed for the loan term.",
      "Payments are made monthly.",
      "No prepayments or restructuring occur.",
    ],
    limitations: [
      "Does not include processing fees or other charges.",
      "This is an estimate, not a loan quote.",
      "Actual rates vary by lender and credit profile.",
    ],
    faqs: [
      {
        question: "Why are personal loan interest rates higher?",
        answer:
          "Personal loans are unsecured — there is no collateral. Lenders charge higher rates to compensate for the higher risk of default.",
      },
      {
        question: "How does my credit score affect my personal loan?",
        answer:
          "A higher credit score typically qualifies you for lower interest rates. A score above 750 is generally considered good and may get you the best rates.",
      },
      {
        question: "Should I take a personal loan or use a credit card?",
        answer:
          "Personal loans usually have lower interest rates than credit cards and offer fixed repayment terms. Credit cards are better for short-term, small amounts if you can pay off the balance quickly.",
      },
    ],
  },
  relatedCalculators: ["emi", "loan", "home-loan-emi", "car-loan-emi"],
  seo: { title: "Personal Loan EMI Calculator – Monthly Payment", description: "Calculate your personal loan EMI, total interest and total cost. Free, instant and accurate.", keywords: ["personal loan emi calculator", "personal loan emi"], primaryIntent: "Calculate personal loan EMI", secondaryIntents: ["Personal loan interest"] },
};