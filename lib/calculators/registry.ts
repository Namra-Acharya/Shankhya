/**
 * Calculator registry.
 * Central place to register and look up calculators and categories.
 */

import type {
  CalculatorDefinition,
  CategoryDefinition,
  CategoryId,
} from "@/lib/calculators/types";

import { ageCalculator } from "@/calculators/date-time/age";
import { emiCalculator } from "@/calculators/finance/emi";
import { loanCalculator } from "@/calculators/finance/loan";
import { sipCalculator } from "@/calculators/finance/sip";
import { compoundInterestCalculator } from "@/calculators/finance/compound-interest";
import { simpleInterestCalculator } from "@/calculators/finance/simple-interest";
import { fdCalculator } from "@/calculators/finance/fd";
import { rdCalculator } from "@/calculators/finance/rd";
import { gstCalculator } from "@/calculators/finance/gst";

// New finance calculators
import { mortgageCalculator, autoLoanCalculator, investmentCalculator, savingsCalculator } from "@/calculators/finance/finance-extra";
import { retirementCalculator, creditCardPayoffCalculator, debtPayoffCalculator, dtiCalculator, roiCalculator, aprCalculator, inflationCalculator, tipCalculator, salesTaxCalculator, currencyConverterCalculator } from "@/calculators/finance/finance-extras-2";
import { ppfCalculator, cagrCalculator, npsCalculator, gratuityCalculator, hraCalculator, epfCalculator, incomeTaxCalculator, salaryCalculator, homeLoanEmiCalculator, carLoanEmiCalculator, personalLoanEmiCalculator } from "@/calculators/finance/finance-india";

import { percentageCalculator } from "@/calculators/math/percentage";
import { percentageChangeCalculator } from "@/calculators/math/percentage-change";
import {
  discountCalculator,
  fractionCalculator,
  ratioCalculator,
  averageCalculator,
  roundingCalculator,
  scientificNotationCalculator,
  numberToWordsCalculator,
  randomNumberCalculator,
  fractionToDecimalCalculator,
  decimalToFractionCalculator,
  unitConverterCalculator,
  standardCalculator,
  scientificCalculator,
} from "@/calculators/math/math-tools";

import { cgpaCalculator } from "@/calculators/education/cgpa";
import { gpaCalculator } from "@/calculators/education/gpa";
import { gradeCalculator } from "@/calculators/education/grade";
import { attendanceCalculator } from "@/calculators/education/attendance";
import { dateCalculator } from "@/calculators/date-time/date";
import { dateDifferenceCalculator } from "@/calculators/date-time/date-difference";
import { timeDurationCalculator } from "@/calculators/date-time/time-duration";
import { businessDaysCalculator } from "@/calculators/date-time/business-days";
import { bmiCalculator } from "@/calculators/health/bmi";
import { bmrCalculator } from "@/calculators/health/bmr";
import { calorieCalculator } from "@/calculators/health/calorie";
import { bodyFatCalculator } from "@/calculators/health/body-fat";
import { idealWeightCalculator } from "@/calculators/health/ideal-weight";
import { healthyWeightCalculator } from "@/calculators/health/healthy-weight";
import { macroCalculator } from "@/calculators/health/macro";
import { paceCalculator } from "@/calculators/health/pace";
import { pregnancyDueDateCalculator, pregnancyWeightGainCalculator, ovulationCalculator, periodCalculator, oneRepMaxCalculator, targetHeartRateCalculator } from "@/calculators/health/health-extra";
import { areaCalculator, volumeCalculator, concreteCalculator, squareFootageCalculator, roofingCalculator, tileCalculator, gravelCalculator, mulchCalculator, paintCalculator, flooringCalculator, fenceCalculator, stairCalculator } from "@/calculators/construction/construction";
import { ohmsLawCalculator, voltageDropCalculator, powerCalculator, resistorCalculator, electricalEnergyCalculator, densityCalculator, speedCalculator, distanceCalculator, forceCalculator, pressureCalculator, temperatureConverterCalculator } from "@/calculators/science/science";

// Categories
export const categories: CategoryDefinition[] = [
  {
    id: "math",
    slug: "math",
    name: "Math",
    shortDescription: "Percentages, averages, ratios and everyday math.",
    description:
      "Solve everyday math problems with clear calculators. Percentages, averages, ratios, discounts and more. Fast, accurate and easy to understand.",
    icon: "calculator",
    accent: "math",
    calculatorIds: ["percentage", "percentage-change", "discount", "fraction", "ratio", "average", "scientific", "standard", "unit-converter", "random-number", "number-to-words", "scientific-notation", "fraction-to-decimal", "decimal-to-fraction", "rounding"],
    relatedCategories: ["finance", "education"],
    seo: {
      title: "Math Calculators – Percentages, Averages & More",
      description:
        "Free math calculators for percentages, averages, ratios and everyday calculations. Clear tools with clear results.",
    },
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    shortDescription: "Loans, interest, investments and savings.",
    description:
      "Understand loans, interest, investments and savings with clear financial calculators. Whether you are planning a home loan, evaluating a fixed deposit or comparing investment growth, these tools break down the numbers so you can decide with confidence.",
    icon: "wallet",
    accent: "finance",
    calculatorIds: ["emi", "loan", "sip", "compound-interest", "simple-interest", "fd", "rd", "gst", "mortgage", "auto-loan", "investment", "savings", "retirement", "credit-card-payoff", "debt-payoff", "dti", "roi", "apr", "inflation", "tip", "sales-tax", "currency-converter", "ppf", "cagr", "nps", "gratuity", "hra", "epf", "income-tax", "salary", "home-loan-emi", "car-loan-emi", "personal-loan-emi"],
    relatedCategories: ["math", "education"],
    seo: {
      title: "Finance Calculators – Loans, Interest & Investments",
      description:
        "Free finance calculators for EMI, loans, interest, SIP, FD and more. Calculate monthly payments, returns and totals in seconds.",
    },
  },
  {
    id: "education",
    slug: "education",
    name: "Education",
    shortDescription: "Grades, CGPA, GPA and attendance.",
    description:
      "Plan your academic results with clear grading and attendance calculators. Convert between systems, plan the marks you need, and understand how your grades are calculated.",
    icon: "graduation-cap",
    accent: "education",
    calculatorIds: ["cgpa", "gpa", "grade", "attendance"],
    relatedCategories: ["math", "finance"],
    seo: {
      title: "Education Calculators – CGPA, GPA, Grades & Attendance",
      description:
        "Free education calculators for CGPA, GPA, grades and attendance. Understand your results and plan improvements.",
    },
  },
  {
    id: "health",
    slug: "health",
    name: "Health",
    shortDescription: "BMI, calories, fitness and body composition.",
    description:
      "Understand your body metrics with clear health calculators. BMI, BMR, calories, body fat, ideal weight and more. These tools provide estimates for screening, not medical diagnoses.",
    icon: "heart-pulse",
    accent: "health",
    calculatorIds: ["bmi", "bmr", "calorie", "body-fat", "ideal-weight", "healthy-weight", "macro", "pace", "pregnancy-due-date", "pregnancy-weight-gain", "ovulation", "period", "one-rep-max", "target-heart-rate"],
    relatedCategories: ["finance", "education"],
    seo: {
      title: "Health Calculators – BMI, Calories, Fitness & Body Metrics",
      description:
        "Free health calculators for BMI, BMR, calories, body fat, ideal weight, macros and more. Understand your body metrics clearly.",
    },
  },
  {
    id: "construction",
    slug: "construction",
    name: "Construction",
    shortDescription: "Area, volume, concrete and building materials.",
    description:
      "Calculate construction measurements and materials for your projects. Area, volume, concrete, tiles, paint, flooring and more. Fast, accurate and easy to understand.",
    icon: "hard-hat",
    accent: "construction",
    calculatorIds: ["area", "volume", "concrete", "square-footage", "roofing", "tile", "gravel", "mulch", "paint", "flooring", "fence", "stair"],
    relatedCategories: ["math", "science"],
    seo: {
      title: "Construction Calculators – Area, Concrete & Materials",
      description:
        "Free construction calculators for area, volume, concrete, tiles, paint and more. Calculate materials for your project.",
    },
  },
  {
    id: "science",
    slug: "science",
    name: "Science & Engineering",
    shortDescription: "Ohm's law, power, density, force and more.",
    description:
      "Solve science and engineering problems with clear calculators. Ohm's law, power, density, force, pressure, temperature and more. Fast, accurate and easy to understand.",
    icon: "flask-conical",
    accent: "science",
    calculatorIds: ["ohms-law", "voltage-drop", "power", "resistor", "electrical-energy", "density", "speed", "distance", "force", "pressure", "temperature-converter"],
    relatedCategories: ["math", "construction"],
    seo: {
      title: "Science & Engineering Calculators – Ohm's Law, Power & More",
      description:
        "Free science and engineering calculators for Ohm's law, power, density, force, pressure and more. Clear tools with clear results.",
    },
  },
  {
    id: "date-time",
    slug: "date-time",
    name: "Date & Time",
    shortDescription: "Age, dates, durations and time differences.",
    description:
      "Work with dates, times and durations precisely. Calculate your exact age, find the difference between two dates, count business days or measure time between moments.",
    icon: "calendar",
    accent: "date-time",
    calculatorIds: ["age", "date", "date-difference", "time-duration", "business-days"],
    relatedCategories: ["education"],
    seo: {
      title: "Date & Time Calculators – Age, Duration & Differences",
      description:
        "Free date and time calculators for age, date difference, durations and more. Calculate precisely in seconds.",
    },
  },
];

// All calculators
const allCalculators: Record<string, CalculatorDefinition> = {
  // Math
  [percentageCalculator.id]: percentageCalculator,
  [percentageChangeCalculator.id]: percentageChangeCalculator,
  [discountCalculator.id]: discountCalculator,
  [fractionCalculator.id]: fractionCalculator,
  [ratioCalculator.id]: ratioCalculator,
  [averageCalculator.id]: averageCalculator,
  [roundingCalculator.id]: roundingCalculator,
  [scientificNotationCalculator.id]: scientificNotationCalculator,
  [numberToWordsCalculator.id]: numberToWordsCalculator,
  [randomNumberCalculator.id]: randomNumberCalculator,
  [fractionToDecimalCalculator.id]: fractionToDecimalCalculator,
  [decimalToFractionCalculator.id]: decimalToFractionCalculator,
  [unitConverterCalculator.id]: unitConverterCalculator,
  [standardCalculator.id]: standardCalculator,
  [scientificCalculator.id]: scientificCalculator,
  // Finance
  [emiCalculator.id]: emiCalculator,
  [loanCalculator.id]: loanCalculator,
  [sipCalculator.id]: sipCalculator,
  [compoundInterestCalculator.id]: compoundInterestCalculator,
  [simpleInterestCalculator.id]: simpleInterestCalculator,
  [fdCalculator.id]: fdCalculator,
  [rdCalculator.id]: rdCalculator,
  [gstCalculator.id]: gstCalculator,
  [mortgageCalculator.id]: mortgageCalculator,
  [autoLoanCalculator.id]: autoLoanCalculator,
  [investmentCalculator.id]: investmentCalculator,
  [savingsCalculator.id]: savingsCalculator,
  [retirementCalculator.id]: retirementCalculator,
  [creditCardPayoffCalculator.id]: creditCardPayoffCalculator,
  [debtPayoffCalculator.id]: debtPayoffCalculator,
  [dtiCalculator.id]: dtiCalculator,
  [roiCalculator.id]: roiCalculator,
  [aprCalculator.id]: aprCalculator,
  [inflationCalculator.id]: inflationCalculator,
  [tipCalculator.id]: tipCalculator,
  [salesTaxCalculator.id]: salesTaxCalculator,
  [currencyConverterCalculator.id]: currencyConverterCalculator,
  [ppfCalculator.id]: ppfCalculator,
  [cagrCalculator.id]: cagrCalculator,
  [npsCalculator.id]: npsCalculator,
  [gratuityCalculator.id]: gratuityCalculator,
  [hraCalculator.id]: hraCalculator,
  [epfCalculator.id]: epfCalculator,
  [incomeTaxCalculator.id]: incomeTaxCalculator,
  [salaryCalculator.id]: salaryCalculator,
  [homeLoanEmiCalculator.id]: homeLoanEmiCalculator,
  [carLoanEmiCalculator.id]: carLoanEmiCalculator,
  [personalLoanEmiCalculator.id]: personalLoanEmiCalculator,
  // Education
  [cgpaCalculator.id]: cgpaCalculator,
  [gpaCalculator.id]: gpaCalculator,
  [gradeCalculator.id]: gradeCalculator,
  [attendanceCalculator.id]: attendanceCalculator,
  // Health
  [bmiCalculator.id]: bmiCalculator,
  [bmrCalculator.id]: bmrCalculator,
  [calorieCalculator.id]: calorieCalculator,
  [bodyFatCalculator.id]: bodyFatCalculator,
  [idealWeightCalculator.id]: idealWeightCalculator,
  [healthyWeightCalculator.id]: healthyWeightCalculator,
  [macroCalculator.id]: macroCalculator,
  [paceCalculator.id]: paceCalculator,
  [pregnancyDueDateCalculator.id]: pregnancyDueDateCalculator,
  [pregnancyWeightGainCalculator.id]: pregnancyWeightGainCalculator,
  [ovulationCalculator.id]: ovulationCalculator,
  [periodCalculator.id]: periodCalculator,
  [oneRepMaxCalculator.id]: oneRepMaxCalculator,
  [targetHeartRateCalculator.id]: targetHeartRateCalculator,
  // Construction
  [areaCalculator.id]: areaCalculator,
  [volumeCalculator.id]: volumeCalculator,
  [concreteCalculator.id]: concreteCalculator,
  [squareFootageCalculator.id]: squareFootageCalculator,
  [roofingCalculator.id]: roofingCalculator,
  [tileCalculator.id]: tileCalculator,
  [gravelCalculator.id]: gravelCalculator,
  [mulchCalculator.id]: mulchCalculator,
  [paintCalculator.id]: paintCalculator,
  [flooringCalculator.id]: flooringCalculator,
  [fenceCalculator.id]: fenceCalculator,
  [stairCalculator.id]: stairCalculator,
  // Science
  [ohmsLawCalculator.id]: ohmsLawCalculator,
  [voltageDropCalculator.id]: voltageDropCalculator,
  [powerCalculator.id]: powerCalculator,
  [resistorCalculator.id]: resistorCalculator,
  [electricalEnergyCalculator.id]: electricalEnergyCalculator,
  [densityCalculator.id]: densityCalculator,
  [speedCalculator.id]: speedCalculator,
  [distanceCalculator.id]: distanceCalculator,
  [forceCalculator.id]: forceCalculator,
  [pressureCalculator.id]: pressureCalculator,
  [temperatureConverterCalculator.id]: temperatureConverterCalculator,
  // Date & Time
  [ageCalculator.id]: ageCalculator,
  [dateCalculator.id]: dateCalculator,
  [dateDifferenceCalculator.id]: dateDifferenceCalculator,
  [timeDurationCalculator.id]: timeDurationCalculator,
  [businessDaysCalculator.id]: businessDaysCalculator,
};

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return Object.values(allCalculators).find((c) => c.slug === slug);
}

export function getCalculatorById(id: string): CalculatorDefinition | undefined {
  return allCalculators[id];
}

export function getAllCalculators(): CalculatorDefinition[] {
  return Object.values(allCalculators);
}

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: CategoryId): CategoryDefinition | undefined {
  return categories.find((c) => c.id === id);
}

export function getCalculatorsByCategory(categoryId: CategoryId): CalculatorDefinition[] {
  return Object.values(allCalculators).filter((c) => c.category === categoryId);
}

export function getFeaturedCalculators(): CalculatorDefinition[] {
  return Object.values(allCalculators)
    .filter((c) => c.featured)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export function getPopularCalculators(limit = 5): CalculatorDefinition[] {
  return Object.values(allCalculators)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

export function getRelatedCalculators(
  calculator: CalculatorDefinition
): CalculatorDefinition[] {
  return calculator.relatedCalculators
    .map((id) => getCalculatorById(id))
    .filter((c): c is CalculatorDefinition => Boolean(c));
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = q.split(/\s+/);
  return Object.values(allCalculators).filter((c) => {
    const haystack = [
      c.name,
      c.shortDescription,
      c.category,
      c.seo.keywords?.join(" ") ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}