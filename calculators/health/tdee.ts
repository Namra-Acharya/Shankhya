/**
 * TDEE Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";
import { calculateBMR } from "@/calculators/health/bmr";
import { calculateTDEE } from "@/calculators/health/calorie";

export const tdeeCalculator: CalculatorDefinition = {
  id: "tdee",
  slug: "tdee-calculator",
  name: "TDEE Calculator",
  category: "health",
  shortDescription: "Calculate your Total Daily Energy Expenditure.",
  icon: "gauge",
  accent: "health",
  popularity: 96,

  inputs: [
    { id: "sex", label: "Sex", type: "radio", defaultValue: "male", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { id: "weight", label: "Weight", type: "number", unit: "kg", placeholder: "70", defaultValue: 70, validation: { required: true, min: 20, max: 500 } },
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "175", defaultValue: 175, validation: { required: true, min: 100, max: 250 } },
    { id: "age", label: "Age", type: "number", unit: "years", placeholder: "30", defaultValue: 30, validation: { required: true, min: 15, max: 100 } },
    {
      id: "activity", label: "Activity level", type: "dropdown", defaultValue: "moderate",
      options: [
        { label: "Sedentary", value: "sedentary" },
        { label: "Light (1-3 days/week)", value: "light" },
        { label: "Moderate (3-5 days/week)", value: "moderate" },
        { label: "Active (6-7 days/week)", value: "active" },
        { label: "Very active", value: "veryActive" },
      ],
    },
  ],

  calculate: (values) => {
    const sex = String(values.sex ?? "male");
    const weight = parseNumber(values.weight) ?? 0;
    const height = parseNumber(values.height) ?? 0;
    const age = parseNumber(values.age) ?? 30;
    const activity = String(values.activity ?? "moderate");
    const bmr = calculateBMR(sex, weight, height, age);
    const tdee = calculateTDEE(bmr, activity);

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "tdee", label: "YOUR TDEE", value: formatNumber(tdee, 0), format: "number", primary: true, description: "calories per day" },
          ],
        },
        {
          id: "breakdown",
          title: "Energy breakdown",
          values: [
            { id: "bmr", label: "BMR", value: formatNumber(bmr, 0), format: "number" },
            { id: "activity", label: "Activity calories", value: formatNumber(tdee - bmr, 0), format: "number" },
          ],
        },
      ],
      interpretation: `Your Total Daily Energy Expenditure is approximately ${formatNumber(tdee, 0)} calories per day. This is your BMR (${formatNumber(bmr, 0)}) plus activity calories.`,
    };
  },

  content: {
    summary: "The TDEE Calculator estimates your Total Daily Energy Expenditure - the total calories you burn in a day including activity.",
    howToUse: ["Enter your details.", "Select your activity level.", "Press Calculate."],
    interpretation: "TDEE is your BMR plus the calories burned through daily activity. It represents your maintenance calories.",
    formula: "TDEE = BMR × Activity Multiplier",
    variables: [
      { symbol: "BMR", name: "BMR", description: "Basal Metabolic Rate." },
      { symbol: "M", name: "Multiplier", description: "Activity multiplier (1.2-1.9)." },
    ],
    example: {
      title: "Example: BMR 1,649, moderate activity",
      inputs: { BMR: "1,649", Activity: "Moderate (1.55)" },
      steps: ["TDEE = 1,649 × 1.55 = 2,556"],
      result: "2,556 calories/day",
    },
    factors: ["Activity level is the largest factor.", "Muscle mass increases TDEE."],
    edgeCases: ["Estimates can vary by 10-20%.", "Extreme activity levels may be underestimated."],
    commonMistakes: ["Using BMR instead of TDEE for daily intake."],
    assumptions: ["Average body composition.", "Standard metabolic rate."],
    limitations: ["This is an estimate, not medical advice."],
    faqs: [{ question: "What is the difference between BMR and TDEE?", answer: "BMR is calories at rest. TDEE includes activity and is higher." }],
  },

  relatedCalculators: ["bmr", "calorie", "bmi", "macro"],
  seo: {
    title: "TDEE Calculator – Total Daily Energy Expenditure",
    description: "Calculate your Total Daily Energy Expenditure. See your maintenance calories based on BMR and activity level. Free and instant.",
    keywords: ["tdee calculator", "total daily energy expenditure", "maintenance calories"],
    primaryIntent: "Calculate TDEE",
    secondaryIntents: ["Maintenance calories", "Daily energy needs"],
  },
};