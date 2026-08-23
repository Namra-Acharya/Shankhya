/**
 * Math Tools - Discount, Fraction, Ratio, Average, Rounding, Scientific Notation, Number to Words, Random Number
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

// ============ DISCOUNT CALCULATOR ============
export const discountCalculator: CalculatorDefinition = {
  id: "discount",
  slug: "discount-calculator",
  name: "Discount Calculator",
  category: "math",
  shortDescription: "Calculate sale price, discount amount and savings percentage.",
  icon: "percent",
  accent: "math",
  popularity: 89,

  inputs: [
    { id: "originalPrice", label: "Original price", type: "currency", unit: "₹", placeholder: "1000", defaultValue: 1000, validation: { required: true, min: 0 } },
    { id: "discountPct", label: "Discount percentage", type: "percentage", unit: "%", placeholder: "20", defaultValue: 20, validation: { required: true, min: 0, max: 100 } },
  ],

  calculate: (values) => {
    const price = parseNumber(values.originalPrice) ?? 0;
    const pct = parseNumber(values.discountPct) ?? 0;
    const discount = (price * pct) / 100;
    const salePrice = price - discount;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "salePrice", label: "SALE PRICE", value: `₹${formatNumber(salePrice, 0)}`, format: "text", primary: true, description: `after ${pct}% discount` },
          ],
        },
        {
          id: "details",
          title: "Discount details",
          values: [
            { id: "discount", label: "You save", value: `₹${formatNumber(discount, 0)}`, format: "text" },
            { id: "original", label: "Original price", value: `₹${formatNumber(price, 0)}`, format: "text" },
          ],
        },
      ],
      interpretation: `With a ${pct}% discount on ₹${formatNumber(price, 0)}, you save ₹${formatNumber(discount, 0)} and pay ₹${formatNumber(salePrice, 0)}.`,
    };
  },

  content: {
    summary: "The Discount Calculator shows the sale price after a discount, the amount you save, and the final price.",
    howToUse: ["Enter the original price.", "Enter the discount percentage.", "Press Calculate."],
    interpretation: "The sale price is the original price minus the discount amount.",
    formula: "Discount = Price × (Pct / 100)\nSale Price = Price − Discount",
    variables: [
      { symbol: "P", name: "Price", description: "Original price." },
      { symbol: "D", name: "Discount", description: "Discount percentage." },
    ],
    example: {
      title: "Example: ₹1,000 at 20% off",
      inputs: { Price: "₹1,000", Discount: "20%" },
      steps: ["Discount = 1000 × 0.20 = ₹200", "Sale price = 1000 − 200 = ₹800"],
      result: "₹800",
    },
    factors: ["Higher discounts mean lower sale prices.", "Discounts are calculated on the original price."],
    edgeCases: ["100% discount means the item is free.", "0% discount means no change."],
    commonMistakes: ["Applying discount to the sale price instead of original."],
    assumptions: ["Discount is a percentage of the original price."],
    limitations: ["Does not include taxes or additional fees."],
    faqs: [{ question: "How do I calculate a discount?", answer: "Multiply the original price by the discount percentage divided by 100, then subtract from the original price." }],
  },

  relatedCalculators: ["percentage", "percentage-change", "average", "ratio"],
  seo: {
    title: "Discount Calculator – Calculate Sale Price & Savings",
    description: "Calculate the sale price after a discount, the amount you save, and the final price. Free, instant and accurate.",
    keywords: ["discount calculator", "sale price calculator", "percent off"],
    primaryIntent: "Calculate sale price after discount",
    secondaryIntents: ["How much do I save", "Percent off calculator"],
  },
};

// ============ FRACTION CALCULATOR ============
export const fractionCalculator: CalculatorDefinition = {
  id: "fraction",
  slug: "fraction-calculator",
  name: "Fraction Calculator",
  category: "math",
  shortDescription: "Add, subtract, multiply and divide fractions.",
  icon: "divide",
  accent: "math",
  popularity: 88,

  inputs: [
    { id: "num1", label: "First numerator", type: "number", placeholder: "1", defaultValue: 1, validation: { required: true } },
    { id: "den1", label: "First denominator", type: "number", placeholder: "2", defaultValue: 2, validation: { required: true, min: 1 } },
    {
      id: "op", label: "Operation", type: "dropdown", defaultValue: "add",
      options: [
        { label: "Add (+)", value: "add" },
        { label: "Subtract (−)", value: "subtract" },
        { label: "Multiply (×)", value: "multiply" },
        { label: "Divide (÷)", value: "divide" },
      ],
    },
    { id: "num2", label: "Second numerator", type: "number", placeholder: "1", defaultValue: 1, validation: { required: true } },
    { id: "den2", label: "Second denominator", type: "number", placeholder: "3", defaultValue: 3, validation: { required: true, min: 1 } },
  ],

  calculate: (values) => {
    const n1 = parseNumber(values.num1) ?? 0;
    const d1 = parseNumber(values.den1) ?? 1;
    const n2 = parseNumber(values.num2) ?? 0;
    const d2 = parseNumber(values.den2) ?? 1;
    const op = String(values.op ?? "add");

    let rn: number, rd: number;
    switch (op) {
      case "add": rn = n1 * d2 + n2 * d1; rd = d1 * d2; break;
      case "subtract": rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
      case "multiply": rn = n1 * n2; rd = d1 * d2; break;
      case "divide": rn = n1 * d2; rd = d1 * n2; break;
      default: rn = 0; rd = 1;
    }

    // Simplify
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(rn, rd);
    rn /= g; rd /= g;

    const decimal = rd !== 0 ? rn / rd : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "fraction", label: "RESULT", value: `${rn}/${rd}`, format: "text", primary: true, description: `= ${formatNumber(decimal, 4)}` },
          ],
        },
      ],
      interpretation: `The result is ${rn}/${rd}, which equals ${formatNumber(decimal, 4)} as a decimal.`,
    };
  },

  content: {
    summary: "The Fraction Calculator performs addition, subtraction, multiplication and division on fractions, simplifying the result.",
    howToUse: ["Enter the numerators and denominators.", "Select the operation.", "Press Calculate."],
    interpretation: "The result is shown as a simplified fraction and its decimal equivalent.",
    formula: "Add: a/b + c/d = (ad + cb) / bd\nMultiply: a/b × c/d = ac / bd",
    variables: [
      { symbol: "a/b", name: "First fraction", description: "First fraction." },
      { symbol: "c/d", name: "Second fraction", description: "Second fraction." },
    ],
    example: {
      title: "Example: 1/2 + 1/3",
      inputs: { "First": "1/2", "Second": "1/3", Op: "Add" },
      steps: ["1/2 + 1/3 = (3 + 2) / 6 = 5/6"],
      result: "5/6",
    },
    factors: ["Fractions are simplified to lowest terms."],
    edgeCases: ["Denominator cannot be zero.", "Division by a fraction multiplies by its reciprocal."],
    commonMistakes: ["Adding denominators directly instead of finding common denominator."],
    assumptions: ["All inputs are integers."],
    limitations: ["Does not handle mixed numbers directly."],
    faqs: [{ question: "How do I add fractions?", answer: "Find a common denominator, add the numerators, then simplify. For example, 1/2 + 1/3 = 3/6 + 2/6 = 5/6." }],
  },

  relatedCalculators: ["decimal-to-fraction", "fraction-to-decimal", "ratio", "average"],
  seo: {
    title: "Fraction Calculator – Add, Subtract, Multiply & Divide Fractions",
    description: "Add, subtract, multiply and divide fractions with instant simplified results. Free, accurate and easy to use.",
    keywords: ["fraction calculator", "fraction addition", "fraction multiplication"],
    primaryIntent: "Perform operations on fractions",
    secondaryIntents: ["Add fractions", "Multiply fractions", "Simplify fractions"],
  },
};

// ============ RATIO CALCULATOR ============
export const ratioCalculator: CalculatorDefinition = {
  id: "ratio",
  slug: "ratio-calculator",
  name: "Ratio Calculator",
  category: "math",
  shortDescription: "Simplify ratios and find missing ratio values.",
  icon: "scale",
  accent: "math",
  popularity: 87,

  inputs: [
    { id: "a", label: "First value (A)", type: "number", placeholder: "4", defaultValue: 4, validation: { required: true, min: 0 } },
    { id: "b", label: "Second value (B)", type: "number", placeholder: "6", defaultValue: 6, validation: { required: true, min: 0 } },
    { id: "c", label: "Third value (C)", type: "number", placeholder: "8", defaultValue: 8, validation: { required: true, min: 0 } },
    { id: "d", label: "Fourth value (D)", type: "number", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0 } },
  ],

  calculate: (values) => {
    const a = parseNumber(values.a) ?? 0;
    const b = parseNumber(values.b) ?? 0;
    const c = parseNumber(values.c) ?? 0;
    const d = parseNumber(values.d) ?? 0;

    const gcd = (x: number, y: number): number => y === 0 ? Math.abs(x) : gcd(y, x % y);
    const g = gcd(gcd(a, b), gcd(c, d));
    const sa = a / g, sb = b / g, sc = c / g, sd = d / g;

    const isProportion = a * d === b * c;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "ratio", label: "SIMPLIFIED RATIO", value: `${sa}:${sb}:${sc}:${sd}`, format: "text", primary: true, description: `from ${a}:${b}:${c}:${d}` },
          ],
        },
        {
          id: "details",
          title: "Proportion check",
          values: [
            { id: "prop", label: "Is it a proportion?", value: isProportion ? "Yes" : "No", format: "text" },
          ],
        },
      ],
      interpretation: `The ratio ${a}:${b}:${c}:${d} simplifies to ${sa}:${sb}:${sc}:${sd}. ${isProportion ? "These values form a proportion." : "These values do not form a proportion."}`,
    };
  },

  content: {
    summary: "The Ratio Calculator simplifies ratios and checks whether four values form a proportion.",
    howToUse: ["Enter the four values.", "Press Calculate to see the simplified ratio."],
    interpretation: "The simplified ratio divides all values by their greatest common divisor.",
    formula: "Simplified = A:G : B:G : C:G : D:G\nwhere G = GCD(A, B, C, D)",
    variables: [
      { symbol: "A-D", name: "Values", description: "The four ratio values." },
      { symbol: "G", name: "GCD", description: "Greatest common divisor." },
    ],
    example: {
      title: "Example: 4:6:8:12",
      inputs: { A: "4", B: "6", C: "8", D: "12" },
      steps: ["GCD(4,6,8,12) = 2", "Simplified = 2:3:4:6"],
      result: "2:3:4:6",
    },
    factors: ["Ratios compare quantities in proportion."],
    edgeCases: ["Zero values are allowed but may produce undefined ratios."],
    commonMistakes: ["Not simplifying to lowest terms."],
    assumptions: ["All values are non-negative."],
    limitations: ["Handles up to 4 values."],
    faqs: [{ question: "What is a ratio?", answer: "A ratio compares two or more quantities, showing the relative sizes. For example, 2:3 means for every 2 of the first, there are 3 of the second." }],
  },

  relatedCalculators: ["fraction", "average", "percentage", "discount"],
  seo: {
    title: "Ratio Calculator – Simplify Ratios & Check Proportions",
    description: "Simplify ratios and check if values form a proportion. Free, instant and accurate.",
    keywords: ["ratio calculator", "simplify ratio", "proportion calculator"],
    primaryIntent: "Simplify ratios",
    secondaryIntents: ["Check proportions", "Ratio simplification"],
  },
};

// ============ AVERAGE CALCULATOR ============
export const averageCalculator: CalculatorDefinition = {
  id: "average",
  slug: "average-calculator",
  name: "Average Calculator",
  category: "math",
  shortDescription: "Calculate the mean, median and mode of a set of numbers.",
  icon: "sigma",
  accent: "math",
  popularity: 86,

  inputs: [
    { id: "numbers", label: "Numbers (comma-separated)", type: "text", placeholder: "10, 20, 30, 40", defaultValue: "10, 20, 30, 40", validation: { required: true } },
  ],

  calculate: (values) => {
    const nums = String(values.numbers ?? "").split(",").map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const sum = nums.reduce((s, n) => s + n, 0);
    const mean = nums.length > 0 ? sum / nums.length : 0;

    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    const freq = new Map<number, number>();
    nums.forEach(n => freq.set(n, (freq.get(n) ?? 0) + 1));
    let mode = 0, maxFreq = 0;
    freq.forEach((f, n) => { if (f > maxFreq) { maxFreq = f; mode = n; } });

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "mean", label: "MEAN (AVERAGE)", value: formatNumber(mean, 2), format: "number", primary: true, description: `of ${nums.length} numbers` },
          ],
        },
        {
          id: "stats",
          title: "Other statistics",
          values: [
            { id: "median", label: "Median", value: formatNumber(median, 2), format: "number" },
            { id: "mode", label: "Mode", value: formatNumber(mode, 2), format: "number" },
            { id: "sum", label: "Sum", value: formatNumber(sum, 2), format: "number" },
          ],
        },
      ],
      interpretation: `The average of ${nums.length} numbers is ${formatNumber(mean, 2)}. The median is ${formatNumber(median, 2)} and the mode is ${formatNumber(mode, 2)}.`,
    };
  },

  content: {
    summary: "The Average Calculator computes the mean, median, mode and sum of a set of numbers.",
    howToUse: ["Enter numbers separated by commas.", "Press Calculate to see the statistics."],
    interpretation: "The mean is the arithmetic average. The median is the middle value. The mode is the most frequent value.",
    formula: "Mean = Sum / Count\nMedian = middle value when sorted\nMode = most frequent value",
    variables: [
      { symbol: "Σ", name: "Sum", description: "Sum of all numbers." },
      { symbol: "n", name: "Count", description: "Number of values." },
    ],
    example: {
      title: "Example: 10, 20, 30, 40",
      inputs: { Numbers: "10, 20, 30, 40" },
      steps: ["Sum = 100", "Mean = 100 / 4 = 25", "Median = (20 + 30) / 2 = 25"],
      result: "Mean = 25, Median = 25",
    },
    factors: ["Outliers can significantly affect the mean."],
    edgeCases: ["Empty input results in 0.", "Single number: mean = median = mode = that number."],
    commonMistakes: ["Using mean when median is more appropriate for skewed data."],
    assumptions: ["Numbers are separated by commas."],
    limitations: ["Does not calculate weighted averages."],
    faqs: [{ question: "What is the difference between mean, median and mode?", answer: "Mean is the arithmetic average. Median is the middle value when sorted. Mode is the most frequent value." }],
  },

  relatedCalculators: ["percentage", "ratio", "fraction", "rounding"],
  seo: {
    title: "Average Calculator – Mean, Median & Mode",
    description: "Calculate the mean, median, mode and sum of any set of numbers. Free, instant and accurate.",
    keywords: ["average calculator", "mean calculator", "median mode"],
    primaryIntent: "Calculate average of numbers",
    secondaryIntents: ["Mean median mode", "Sum of numbers"],
  },
};

// ============ ROUNDING CALCULATOR ============
export const roundingCalculator: CalculatorDefinition = {
  id: "rounding",
  slug: "rounding-calculator",
  name: "Rounding Calculator",
  category: "math",
  shortDescription: "Round numbers to the nearest whole, tenth, hundredth or more.",
  icon: "circle-dot",
  accent: "math",
  popularity: 85,

  inputs: [
    { id: "number", label: "Number to round", type: "number", placeholder: "3.14159", defaultValue: 3.14159, validation: { required: true } },
    {
      id: "precision", label: "Round to", type: "dropdown", defaultValue: "2",
      options: [
        { label: "Whole number", value: "0" },
        { label: "Tenth (1 decimal)", value: "1" },
        { label: "Hundredth (2 decimals)", value: "2" },
        { label: "Thousandth (3 decimals)", value: "3" },
        { label: "Ten", value: "-1" },
        { label: "Hundred", value: "-2" },
      ],
    },
  ],

  calculate: (values) => {
    const num = parseNumber(values.number) ?? 0;
    const precision = parseNumber(values.precision) ?? 2;
    const factor = Math.pow(10, precision);
    const rounded = Math.round(num * factor) / factor;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "rounded", label: "ROUNDED VALUE", value: formatNumber(rounded, Math.max(0, precision)), format: "number", primary: true, description: `from ${num}` },
          ],
        },
      ],
      interpretation: `${num} rounded to ${precision >= 0 ? `${precision} decimal place${precision === 1 ? "" : "s"}` : `the nearest ${Math.pow(10, -precision)}`} is ${formatNumber(rounded, Math.max(0, precision))}.`,
    };
  },

  content: {
    summary: "The Rounding Calculator rounds numbers to the nearest whole number, decimal place, ten or hundred.",
    howToUse: ["Enter the number.", "Select the precision.", "Press Calculate."],
    interpretation: "The result shows the number rounded to the selected precision.",
    formula: "Rounded = round(N × 10^p) / 10^p",
    variables: [
      { symbol: "N", name: "Number", description: "The number to round." },
      { symbol: "p", name: "Precision", description: "Number of decimal places." },
    ],
    example: {
      title: "Example: 3.14159 to 2 decimals",
      inputs: { Number: "3.14159", Precision: "2" },
      steps: ["3.14159 × 100 = 314.159", "round(314.159) = 314", "314 / 100 = 3.14"],
      result: "3.14",
    },
    factors: ["Rounding rules follow standard mathematical rounding."],
    edgeCases: ["Negative numbers round away from zero."],
    commonMistakes: ["Confusing rounding with truncation."],
    assumptions: ["Standard rounding rules apply."],
    limitations: ["Does not support significant figures."],
    faqs: [{ question: "What is the difference between rounding and truncation?", answer: "Rounding finds the nearest value. Truncation simply cuts off extra digits without rounding." }],
  },

  relatedCalculators: ["average", "percentage", "fraction", "scientific-notation"],
  seo: {
    title: "Rounding Calculator – Round Numbers to Any Precision",
    description: "Round numbers to the nearest whole number, decimal place, ten or hundred. Free, instant and accurate.",
    keywords: ["rounding calculator", "round numbers", "round to nearest"],
    primaryIntent: "Round numbers to a specified precision",
    secondaryIntents: ["Round to nearest tenth", "Round to nearest hundred"],
  },
};

// ============ SCIENTIFIC NOTATION CALCULATOR ============
export const scientificNotationCalculator: CalculatorDefinition = {
  id: "scientific-notation",
  slug: "scientific-notation-calculator",
  name: "Scientific Notation Calculator",
  category: "math",
  shortDescription: "Convert between standard and scientific notation.",
  icon: "sigma",
  accent: "math",
  popularity: 84,

  inputs: [
    { id: "number", label: "Number", type: "number", placeholder: "12345", defaultValue: 12345, validation: { required: true } },
  ],

  calculate: (values) => {
    const num = parseNumber(values.number) ?? 0;
    if (num === 0) {
      return {
        sections: [{ id: "primary", values: [{ id: "sci", label: "SCIENTIFIC NOTATION", value: "0", format: "text", primary: true }] }],
        interpretation: "0 in scientific notation is 0.",
      };
    }
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exp);
    const sci = `${mantissa.toFixed(4)} × 10^${exp}`;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "sci", label: "SCIENTIFIC NOTATION", value: sci, format: "text", primary: true, description: `from ${num}` },
          ],
        },
        {
          id: "details",
          title: "Notation details",
          values: [
            { id: "mantissa", label: "Mantissa", value: mantissa.toFixed(4), format: "text" },
            { id: "exp", label: "Exponent", value: String(exp), format: "text" },
          ],
        },
      ],
      interpretation: `${num} in scientific notation is ${sci}.`,
    };
  },

  content: {
    summary: "The Scientific Notation Calculator converts numbers between standard and scientific notation.",
    howToUse: ["Enter a number.", "Press Calculate to see it in scientific notation."],
    interpretation: "Scientific notation expresses numbers as a mantissa times a power of 10.",
    formula: "N = m × 10^e\nwhere 1 ≤ |m| < 10",
    variables: [
      { symbol: "m", name: "Mantissa", description: "The coefficient between 1 and 10." },
      { symbol: "e", name: "Exponent", description: "The power of 10." },
    ],
    example: {
      title: "Example: 12345",
      inputs: { Number: "12345" },
      steps: ["Exponent = floor(log10(12345)) = 4", "Mantissa = 12345 / 10^4 = 1.2345", "Result = 1.2345 × 10^4"],
      result: "1.2345 × 10^4",
    },
    factors: ["Scientific notation is used for very large or very small numbers."],
    edgeCases: ["Zero has no scientific notation representation."],
    commonMistakes: ["Incorrect exponent calculation."],
    assumptions: ["Standard scientific notation rules."],
    limitations: ["Displays up to 4 decimal places in the mantissa."],
    faqs: [{ question: "What is scientific notation?", answer: "Scientific notation expresses numbers as a mantissa (between 1 and 10) times a power of 10. For example, 1,234,000 = 1.234 × 10^6." }],
  },

  relatedCalculators: ["rounding", "fraction", "decimal-to-fraction", "fraction-to-decimal"],
  seo: {
    title: "Scientific Notation Calculator – Convert Numbers",
    description: "Convert numbers to scientific notation instantly. See the mantissa and exponent. Free, accurate and easy to use.",
    keywords: ["scientific notation calculator", "scientific notation converter"],
    primaryIntent: "Convert numbers to scientific notation",
    secondaryIntents: ["Scientific notation conversion"],
  },
};

// ============ NUMBER TO WORDS ============
export const numberToWordsCalculator: CalculatorDefinition = {
  id: "number-to-words",
  slug: "number-to-words-calculator",
  name: "Number to Words",
  category: "math",
  shortDescription: "Convert numbers to English words.",
  icon: "type",
  accent: "math",
  popularity: 83,

  inputs: [
    { id: "number", label: "Number", type: "number", placeholder: "12345", defaultValue: 12345, validation: { required: true, min: 0, max: 999999999999 } },
  ],

  calculate: (values) => {
    const num = parseNumber(values.number) ?? 0;
    const words = numberToWords(num);

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "words", label: "IN WORDS", value: words, format: "text", primary: true, description: `for ${num.toLocaleString("en-IN")}` },
          ],
        },
      ],
      interpretation: `${num.toLocaleString("en-IN")} in words is: ${words}.`,
    };
  },

  content: {
    summary: "The Number to Words converter turns numbers into English words, useful for writing cheques, invoices and legal documents.",
    howToUse: ["Enter a number.", "Press Calculate to see it in words."],
    interpretation: "The number is converted to its English word representation.",
    formula: "Standard English number-to-words conversion",
    variables: [{ symbol: "N", name: "Number", description: "The number to convert." }],
    example: {
      title: "Example: 12345",
      inputs: { Number: "12345" },
      steps: ["12,345 = Twelve Thousand Three Hundred Forty-Five"],
      result: "Twelve Thousand Three Hundred Forty-Five",
    },
    factors: ["Supports numbers up to 999 billion."],
    edgeCases: ["Zero = 'Zero'.", "Negative numbers are not supported."],
    commonMistakes: ["Incorrect hyphenation for compound numbers."],
    assumptions: ["English (US) number naming."],
    limitations: ["Does not support decimals."],
    faqs: [{ question: "How do I write 12345 in words?", answer: "Twelve thousand three hundred forty-five." }],
  },

  relatedCalculators: ["rounding", "scientific-notation", "average", "percentage"],
  seo: {
    title: "Number to Words – Convert Numbers to English Words",
    description: "Convert any number to English words instantly. Perfect for cheques, invoices and documents. Free and accurate.",
    keywords: ["number to words", "number to text", "number in words"],
    primaryIntent: "Convert numbers to English words",
    secondaryIntents: ["Number to text converter", "Amount in words"],
  },
};

// ============ RANDOM NUMBER GENERATOR ============
export const randomNumberCalculator: CalculatorDefinition = {
  id: "random-number",
  slug: "random-number-generator",
  name: "Random Number Generator",
  category: "math",
  shortDescription: "Generate random numbers within a range.",
  icon: "dices",
  accent: "math",
  popularity: 82,

  inputs: [
    { id: "min", label: "Minimum", type: "number", placeholder: "1", defaultValue: 1, validation: { required: true } },
    { id: "max", label: "Maximum", type: "number", placeholder: "100", defaultValue: 100, validation: { required: true } },
    { id: "count", label: "How many", type: "number", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 100 } },
  ],

  calculate: (values) => {
    const min = Math.ceil(parseNumber(values.min) ?? 1);
    const max = Math.floor(parseNumber(values.max) ?? 100);
    const count = Math.min(Math.max(parseNumber(values.count) ?? 5, 1), 100);

    const numbers: number[] = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "numbers", label: "RANDOM NUMBERS", value: numbers.join(", "), format: "text", primary: true, description: `between ${min} and ${max}` },
          ],
        },
      ],
      interpretation: `Generated ${count} random number${count === 1 ? "" : "s"} between ${min} and ${max}.`,
    };
  },

  content: {
    summary: "The Random Number Generator creates random numbers within a specified range.",
    howToUse: ["Enter the minimum and maximum values.", "Enter how many numbers to generate.", "Press Calculate."],
    interpretation: "Each number is independently and uniformly random within the range.",
    formula: "Random = floor(random() × (max − min + 1)) + min",
    variables: [
      { symbol: "min", name: "Minimum", description: "Smallest possible value." },
      { symbol: "max", name: "Maximum", description: "Largest possible value." },
    ],
    example: {
      title: "Example: 1 to 100, 5 numbers",
      inputs: { Min: "1", Max: "100", Count: "5" },
      steps: ["Each number is random between 1 and 100"],
      result: "e.g. 42, 17, 89, 3, 65",
    },
    factors: ["Results are different each time."],
    edgeCases: ["Min must be less than or equal to max."],
    commonMistakes: ["Expecting the same result twice."],
    assumptions: ["Uniform distribution."],
    limitations: ["Uses the browser's random number generator."],
    faqs: [{ question: "Are the numbers truly random?", answer: "The generator uses the browser's cryptographic random number generator, which is suitable for most purposes." }],
  },

  relatedCalculators: ["average", "rounding", "percentage", "ratio"],
  seo: {
    title: "Random Number Generator – Generate Random Numbers",
    description: "Generate random numbers within any range. Perfect for games, lotteries, testing and more. Free and instant.",
    keywords: ["random number generator", "random number", "randomizer"],
    primaryIntent: "Generate random numbers",
    secondaryIntents: ["Random number between range", "Randomizer"],
  },
};

// ============ FRACTION TO DECIMAL ============
export const fractionToDecimalCalculator: CalculatorDefinition = {
  id: "fraction-to-decimal",
  slug: "fraction-to-decimal-calculator",
  name: "Fraction to Decimal",
  category: "math",
  shortDescription: "Convert fractions to decimal numbers.",
  icon: "divide",
  accent: "math",
  popularity: 81,

  inputs: [
    { id: "numerator", label: "Numerator", type: "number", placeholder: "3", defaultValue: 3, validation: { required: true } },
    { id: "denominator", label: "Denominator", type: "number", placeholder: "4", defaultValue: 4, validation: { required: true, min: 1 } },
  ],

  calculate: (values) => {
    const n = parseNumber(values.numerator) ?? 0;
    const d = parseNumber(values.denominator) ?? 1;
    const decimal = d !== 0 ? n / d : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "decimal", label: "DECIMAL", value: formatNumber(decimal, 6), format: "number", primary: true, description: `from ${n}/${d}` },
          ],
        },
      ],
      interpretation: `${n}/${d} as a decimal is ${formatNumber(decimal, 6)}.`,
    };
  },

  content: {
    summary: "The Fraction to Decimal converter turns fractions into decimal numbers.",
    howToUse: ["Enter the numerator and denominator.", "Press Calculate."],
    interpretation: "The decimal is the numerator divided by the denominator.",
    formula: "Decimal = Numerator / Denominator",
    variables: [
      { symbol: "N", name: "Numerator", description: "Top of the fraction." },
      { symbol: "D", name: "Denominator", description: "Bottom of the fraction." },
    ],
    example: {
      title: "Example: 3/4",
      inputs: { Numerator: "3", Denominator: "4" },
      steps: ["3 ÷ 4 = 0.75"],
      result: "0.75",
    },
    factors: ["Some fractions produce repeating decimals."],
    edgeCases: ["Denominator cannot be zero."],
    commonMistakes: ["Dividing the denominator by the numerator."],
    assumptions: ["Standard division."],
    limitations: ["Displays up to 6 decimal places."],
    faqs: [{ question: "How do I convert a fraction to a decimal?", answer: "Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75." }],
  },

  relatedCalculators: ["decimal-to-fraction", "fraction", "ratio", "percentage"],
  seo: {
    title: "Fraction to Decimal Calculator – Convert Fractions",
    description: "Convert fractions to decimals instantly. Free, accurate and easy to use.",
    keywords: ["fraction to decimal", "fraction decimal converter"],
    primaryIntent: "Convert fraction to decimal",
    secondaryIntents: ["Fraction to decimal conversion"],
  },
};

// ============ DECIMAL TO FRACTION ============
export const decimalToFractionCalculator: CalculatorDefinition = {
  id: "decimal-to-fraction",
  slug: "decimal-to-fraction-calculator",
  name: "Decimal to Fraction",
  category: "math",
  shortDescription: "Convert decimal numbers to simplified fractions.",
  icon: "divide",
  accent: "math",
  popularity: 80,

  inputs: [
    { id: "decimal", label: "Decimal number", type: "number", placeholder: "0.75", defaultValue: 0.75, validation: { required: true } },
  ],

  calculate: (values) => {
    const dec = parseNumber(values.decimal) ?? 0;
    const precision = 1e9;
    const numerator = Math.round(dec * precision);
    const denominator = precision;
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(numerator, denominator);
    const n = numerator / g;
    const d = denominator / g;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "fraction", label: "FRACTION", value: `${n}/${d}`, format: "text", primary: true, description: `from ${dec}` },
          ],
        },
      ],
      interpretation: `${dec} as a simplified fraction is ${n}/${d}.`,
    };
  },

  content: {
    summary: "The Decimal to Fraction converter turns decimal numbers into simplified fractions.",
    howToUse: ["Enter a decimal number.", "Press Calculate."],
    interpretation: "The decimal is converted to a fraction and simplified to lowest terms.",
    formula: "Fraction = round(D × 10^9) / 10^9, then simplify",
    variables: [{ symbol: "D", name: "Decimal", description: "The decimal number." }],
    example: {
      title: "Example: 0.75",
      inputs: { Decimal: "0.75" },
      steps: ["0.75 = 75/100", "Simplify: 75/100 = 3/4"],
      result: "3/4",
    },
    factors: ["Repeating decimals may not convert exactly."],
    edgeCases: ["Zero = 0/1."],
    commonMistakes: ["Not simplifying the fraction."],
    assumptions: ["Finite decimal representation."],
    limitations: ["Uses 9 decimal places of precision."],
    faqs: [{ question: "How do I convert a decimal to a fraction?", answer: "Write the decimal as a fraction with a power of 10 denominator, then simplify. For example, 0.75 = 75/100 = 3/4." }],
  },

  relatedCalculators: ["fraction-to-decimal", "fraction", "ratio", "percentage"],
  seo: {
    title: "Decimal to Fraction Calculator – Convert Decimals",
    description: "Convert decimal numbers to simplified fractions instantly. Free, accurate and easy to use.",
    keywords: ["decimal to fraction", "decimal fraction converter"],
    primaryIntent: "Convert decimal to fraction",
    secondaryIntents: ["Decimal to fraction conversion"],
  },
};

// ============ UNIT CONVERTER ============
export const unitConverterCalculator: CalculatorDefinition = {
  id: "unit-converter",
  slug: "unit-converter",
  name: "Unit Converter",
  category: "math",
  shortDescription: "Convert between length, weight, temperature and more.",
  icon: "ruler",
  accent: "math",
  popularity: 95,

  inputs: [
    {
      id: "category", label: "Category", type: "dropdown", defaultValue: "length",
      options: [
        { label: "Length", value: "length" },
        { label: "Weight", value: "weight" },
        { label: "Temperature", value: "temperature" },
        { label: "Area", value: "area" },
        { label: "Volume", value: "volume" },
        { label: "Speed", value: "speed" },
      ],
    },
    { id: "value", label: "Value", type: "number", placeholder: "1", defaultValue: 1, validation: { required: true } },
    {
      id: "from", label: "From", type: "dropdown", defaultValue: "m",
      options: [
        { label: "Meters (m)", value: "m" },
        { label: "Kilometers (km)", value: "km" },
        { label: "Centimeters (cm)", value: "cm" },
        { label: "Millimeters (mm)", value: "mm" },
        { label: "Miles (mi)", value: "mi" },
        { label: "Feet (ft)", value: "ft" },
        { label: "Inches (in)", value: "in" },
      ],
    },
    {
      id: "to", label: "To", type: "dropdown", defaultValue: "km",
      options: [
        { label: "Meters (m)", value: "m" },
        { label: "Kilometers (km)", value: "km" },
        { label: "Centimeters (cm)", value: "cm" },
        { label: "Millimeters (mm)", value: "mm" },
        { label: "Miles (mi)", value: "mi" },
        { label: "Feet (ft)", value: "ft" },
        { label: "Inches (in)", value: "in" },
      ],
    },
  ],

  calculate: (values) => {
    const value = parseNumber(values.value) ?? 0;
    const from = String(values.from ?? "m");
    const to = String(values.to ?? "km");

    const lengthFactors: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 };
    const result = value * (lengthFactors[from] ?? 1) / (lengthFactors[to] ?? 1);

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "result", label: "CONVERTED VALUE", value: formatNumber(result, 6), format: "number", primary: true, description: `${value} ${from} = ${formatNumber(result, 6)} ${to}` },
          ],
        },
      ],
      interpretation: `${value} ${from} equals ${formatNumber(result, 6)} ${to}.`,
    };
  },

  content: {
    summary: "The Unit Converter converts between common units of length, weight, temperature, area, volume and speed.",
    howToUse: ["Select the category.", "Enter the value.", "Select the from and to units.", "Press Calculate."],
    interpretation: "The result shows the equivalent value in the target unit.",
    formula: "Result = Value × (From Factor / To Factor)",
    variables: [
      { symbol: "V", name: "Value", description: "The value to convert." },
      { symbol: "From", name: "From unit", description: "The source unit." },
      { symbol: "To", name: "To unit", description: "The target unit." },
    ],
    example: {
      title: "Example: 1 km to meters",
      inputs: { Value: "1", From: "km", To: "m" },
      steps: ["1 × 1000 / 1 = 1000 m"],
      result: "1000 m",
    },
    factors: ["Different categories use different conversion factors."],
    edgeCases: ["Zero converts to zero."],
    commonMistakes: ["Using the wrong conversion factor."],
    assumptions: ["Standard conversion factors."],
    limitations: ["Currently supports length units."],
    faqs: [{ question: "How many meters are in a kilometer?", answer: "1 kilometer = 1000 meters." }],
  },

  relatedCalculators: ["percentage", "average", "rounding", "scientific-notation"],
  seo: {
    title: "Unit Converter – Convert Length, Weight & More",
    description: "Convert between units of length, weight, temperature, area, volume and speed. Free, instant and accurate.",
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter"],
    primaryIntent: "Convert between units",
    secondaryIntents: ["Length conversion", "Weight conversion", "Temperature conversion"],
  },
};

// ============ STANDARD CALCULATOR ============
export const standardCalculator: CalculatorDefinition = {
  id: "standard",
  slug: "standard-calculator",
  name: "Standard Calculator",
  category: "math",
  shortDescription: "A simple calculator for basic arithmetic operations.",
  icon: "calculator",
  accent: "math",
  popularity: 94,

  inputs: [
    { id: "a", label: "First number", type: "number", placeholder: "10", defaultValue: 10, validation: { required: true } },
    {
      id: "op", label: "Operation", type: "dropdown", defaultValue: "add",
      options: [
        { label: "Add (+)", value: "add" },
        { label: "Subtract (−)", value: "subtract" },
        { label: "Multiply (×)", value: "multiply" },
        { label: "Divide (÷)", value: "divide" },
        { label: "Power (^)", value: "power" },
        { label: "Modulo (%)", value: "modulo" },
      ],
    },
    { id: "b", label: "Second number", type: "number", placeholder: "5", defaultValue: 5, validation: { required: true } },
  ],

  calculate: (values) => {
    const a = parseNumber(values.a) ?? 0;
    const b = parseNumber(values.b) ?? 0;
    const op = String(values.op ?? "add");

    let result: number;
    let symbol: string;
    switch (op) {
      case "add": result = a + b; symbol = "+"; break;
      case "subtract": result = a - b; symbol = "−"; break;
      case "multiply": result = a * b; symbol = "×"; break;
      case "divide": result = b !== 0 ? a / b : 0; symbol = "÷"; break;
      case "power": result = Math.pow(a, b); symbol = "^"; break;
      case "modulo": result = b !== 0 ? a % b : 0; symbol = "%"; break;
      default: result = 0; symbol = "+";
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "result", label: "RESULT", value: formatNumber(result, 6), format: "number", primary: true, description: `${a} ${symbol} ${b}` },
          ],
        },
      ],
      interpretation: `${a} ${symbol} ${b} = ${formatNumber(result, 6)}.`,
    };
  },

  content: {
    summary: "The Standard Calculator performs basic arithmetic operations: addition, subtraction, multiplication, division, powers and modulo.",
    howToUse: ["Enter two numbers.", "Select the operation.", "Press Calculate."],
    interpretation: "The result shows the answer to the selected operation.",
    formula: "Depends on the operation selected.",
    variables: [
      { symbol: "A", name: "First number", description: "First operand." },
      { symbol: "B", name: "Second number", description: "Second operand." },
    ],
    example: {
      title: "Example: 10 + 5",
      inputs: { A: "10", Op: "Add", B: "5" },
      steps: ["10 + 5 = 15"],
      result: "15",
    },
    factors: ["Division by zero is undefined."],
    edgeCases: ["Division by zero returns 0."],
    commonMistakes: ["Entering the wrong operation."],
    assumptions: ["Standard arithmetic rules."],
    limitations: ["Performs one operation at a time."],
    faqs: [{ question: "What operations does this calculator support?", answer: "Addition, subtraction, multiplication, division, powers and modulo." }],
  },

  relatedCalculators: ["percentage", "average", "rounding", "scientific-notation"],
  seo: {
    title: "Standard Calculator – Basic Arithmetic Operations",
    description: "Perform addition, subtraction, multiplication, division, powers and modulo. Free, instant and accurate.",
    keywords: ["standard calculator", "basic calculator", "arithmetic calculator"],
    primaryIntent: "Perform basic arithmetic",
    secondaryIntents: ["Add subtract multiply divide", "Simple calculator"],
  },
};

// ============ SCIENTIFIC CALCULATOR ============
export const scientificCalculator: CalculatorDefinition = {
  id: "scientific",
  slug: "scientific-calculator",
  name: "Scientific Calculator",
  category: "math",
  shortDescription: "Advanced calculator with trigonometric, logarithmic and exponential functions.",
  icon: "sigma",
  accent: "math",
  popularity: 93,

  inputs: [
    { id: "value", label: "Value", type: "number", placeholder: "45", defaultValue: 45, validation: { required: true } },
    {
      id: "function", label: "Function", type: "dropdown", defaultValue: "sin",
      options: [
        { label: "Sine (sin)", value: "sin" },
        { label: "Cosine (cos)", value: "cos" },
        { label: "Tangent (tan)", value: "tan" },
        { label: "Square root (√)", value: "sqrt" },
        { label: "Natural log (ln)", value: "ln" },
        { label: "Log base 10 (log)", value: "log" },
        { label: "Exponential (e^x)", value: "exp" },
        { label: "Square (x²)", value: "square" },
        { label: "Cube (x³)", value: "cube" },
        { label: "Absolute value", value: "abs" },
      ],
    },
    {
      id: "angleMode", label: "Angle mode (for trig)", type: "dropdown", defaultValue: "degrees",
      options: [
        { label: "Degrees", value: "degrees" },
        { label: "Radians", value: "radians" },
      ],
    },
  ],

  calculate: (values) => {
    const value = parseNumber(values.value) ?? 0;
    const fn = String(values.function ?? "sin");
    const angleMode = String(values.angleMode ?? "degrees");

    let result: number;
    let label: string;
    const rad = angleMode === "radians" ? value : (value * Math.PI) / 180;

    switch (fn) {
      case "sin": result = Math.sin(rad); label = `sin(${value}°)`; break;
      case "cos": result = Math.cos(rad); label = `cos(${value}°)`; break;
      case "tan": result = Math.tan(rad); label = `tan(${value}°)`; break;
      case "sqrt": result = Math.sqrt(Math.max(0, value)); label = `√${value}`; break;
      case "ln": result = Math.log(value); label = `ln(${value})`; break;
      case "log": result = Math.log10(value); label = `log(${value})`; break;
      case "exp": result = Math.exp(value); label = `e^${value}`; break;
      case "square": result = value * value; label = `${value}²`; break;
      case "cube": result = value * value * value; label = `${value}³`; break;
      case "abs": result = Math.abs(value); label = `|${value}|`; break;
      default: result = 0; label = "";
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "result", label: "RESULT", value: formatNumber(result, 6), format: "number", primary: true, description: label },
          ],
        },
      ],
      interpretation: `${label} = ${formatNumber(result, 6)}.`,
    };
  },

  content: {
    summary: "The Scientific Calculator handles trigonometric, logarithmic, exponential and power functions.",
    howToUse: ["Enter a value.", "Select the function.", "Choose angle mode for trig functions.", "Press Calculate."],
    interpretation: "The result shows the value of the selected function applied to the input.",
    formula: "Depends on the function selected.",
    variables: [
      { symbol: "x", name: "Value", description: "The input value." },
      { symbol: "θ", name: "Angle", description: "Angle in degrees or radians." },
    ],
    example: {
      title: "Example: sin(45°)",
      inputs: { Value: "45", Function: "sin", Mode: "Degrees" },
      steps: ["45° in radians = 0.7854", "sin(0.7854) = 0.7071"],
      result: "0.7071",
    },
    factors: ["Trig functions use degrees or radians."],
    edgeCases: ["ln and log of negative numbers are undefined.", "sqrt of negative numbers is undefined."],
    commonMistakes: ["Using degrees when radians are expected."],
    assumptions: ["Standard mathematical functions."],
    limitations: ["Performs one function at a time."],
    faqs: [{ question: "What is the difference between degrees and radians?", answer: "Degrees and radians are two units for measuring angles. 180° = π radians. Most calculators default to degrees." }],
  },

  relatedCalculators: ["standard", "percentage", "average", "rounding"],
  seo: {
    title: "Scientific Calculator – Trig, Log & Exponential Functions",
    description: "Calculate sine, cosine, tangent, logarithms, exponentials, powers and more. Free, instant and accurate.",
    keywords: ["scientific calculator", "trig calculator", "log calculator"],
    primaryIntent: "Perform scientific calculations",
    secondaryIntents: ["Trigonometric functions", "Logarithms", "Exponentials"],
  },
};

// Helper for number to words
function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Million", "Billion"];

  function threeDigits(n: number): string {
    let str = "";
    if (n >= 100) { str += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { str += tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : ""); }
    else if (n > 0) { str += ones[n]; }
    return str.trim();
  }

  let result = "";
  let scaleIndex = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = threeDigits(chunk);
      result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + (result ? " " + result : "");
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  return result;
}