/**
 * Calorie Calculator - Daily calorie needs estimate
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";
import { calculateBMR } from "@/calculators/health/bmr";

export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * (multipliers[activityLevel] ?? 1.2);
}

export const calorieCalculator: CalculatorDefinition = {
  id: "calorie",
  slug: "calorie-calculator",
  name: "Calorie Calculator",
  category: "health",
  shortDescription: "Estimate your daily calorie needs based on your activity.",
  icon: "flame",
  accent: "health",
  featured: true,
  popularity: 97,

  inputs: [
    {
      id: "sex",
      label: "Sex",
      type: "radio",
      defaultValue: "male",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      id: "weight",
      label: "Weight",
      type: "number",
      unit: "kg",
      placeholder: "70",
      defaultValue: 70,
      validation: { required: true, min: 20, max: 500 },
    },
    {
      id: "height",
      label: "Height",
      type: "number",
      unit: "cm",
      placeholder: "175",
      defaultValue: 175,
      validation: { required: true, min: 100, max: 250 },
    },
    {
      id: "age",
      label: "Age",
      type: "number",
      unit: "years",
      placeholder: "30",
      defaultValue: 30,
      validation: { required: true, min: 15, max: 100 },
    },
    {
      id: "activity",
      label: "Activity level",
      type: "dropdown",
      defaultValue: "moderate",
      options: [
        { label: "Sedentary (little exercise)", value: "sedentary" },
        { label: "Light (1-3 days/week)", value: "light" },
        { label: "Moderate (3-5 days/week)", value: "moderate" },
        { label: "Active (6-7 days/week)", value: "active" },
        { label: "Very active (physical job)", value: "veryActive" },
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
            {
              id: "calories",
              label: "DAILY CALORIE NEEDS",
              value: formatNumber(tdee, 0),
              format: "number",
              primary: true,
              description: "calories per day to maintain weight",
            },
          ],
        },
        {
          id: "breakdown",
          title: "Calorie breakdown",
          values: [
            { id: "bmr", label: "BMR (rest)", value: formatNumber(bmr, 0), format: "number" },
            { id: "activityCal", label: "Activity calories", value: formatNumber(tdee - bmr, 0), format: "number" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Calorie breakdown",
        data: [
          { label: "BMR", value: roundTo(bmr, 0), color: "var(--accent)" },
          { label: "Activity", value: roundTo(tdee - bmr, 0), color: "var(--muted)" },
        ],
      },
      interpretation: `Based on your BMR of ${formatNumber(bmr, 0)} and ${activity.replace(/([A-Z])/g, " $1").toLowerCase()} activity level, your estimated daily calorie needs are approximately ${formatNumber(tdee, 0)} calories to maintain your current weight. This is an estimate.`,
    };
  },

  content: {
    summary:
      "The Calorie Calculator estimates your daily calorie needs based on your BMR and activity level. It helps you understand how many calories you need to maintain, lose, or gain weight.",
    howToUse: [
      "Select your sex and enter your weight, height and age.",
      "Choose your activity level.",
      "Press Calculate to see your daily calorie needs.",
    ],
    interpretation:
      "The result is your Total Daily Energy Expenditure (TDEE), which is your BMR plus activity calories. To lose weight, consume fewer calories; to gain, consume more.",
    formula: "TDEE = BMR × Activity Multiplier",
    variables: [
      { symbol: "BMR", name: "BMR", description: "Basal Metabolic Rate." },
      { symbol: "Activity", name: "Activity multiplier", description: "1.2 to 1.9 based on activity level." },
    ],
    example: {
      title: "Example: Male, 70kg, 175cm, 30, moderate activity",
      inputs: { Sex: "Male", Weight: "70kg", Height: "175cm", Age: "30", Activity: "Moderate" },
      steps: [
        "BMR = 1,649 calories",
        "TDEE = 1,649 × 1.55 = 2,556 calories",
      ],
      result: "≈ 2,556 calories/day",
    },
    factors: [
      "Activity level is the biggest variable.",
      "Muscle mass increases calorie needs.",
      "Age affects metabolic rate.",
    ],
    edgeCases: [
      "Very active individuals may have higher needs.",
      "The estimate may vary by 10-20%.",
    ],
    commonMistakes: [
      "Using BMR as total daily calories.",
      "Overestimating activity level.",
    ],
    assumptions: [
      "Average body composition.",
      "Standard metabolic rate.",
    ],
    limitations: [
      "This is an estimate, not medical advice.",
      "Individual needs vary significantly.",
    ],
    faqs: [
      {
        question: "How many calories should I eat to lose weight?",
        answer:
          "A common approach is to reduce your maintenance calories by 300-500 calories per day for gradual weight loss. Consult a healthcare professional for personalized advice.",
      },
    ],
    glossary: [
      { term: "Calorie", definition: "A unit of energy. In nutrition, a calorie describes the amount of energy a food provides or your body burns." },
      { term: "Total Daily Energy Expenditure (TDEE)", definition: "The total calories you burn in a day, including your resting metabolism, activity, and the energy used to digest food." },
      { term: "Energy balance", definition: "The difference between calories consumed and calories burned. Stable weight happens when intake roughly matches expenditure." },
      { term: "Calorie deficit", definition: "Consuming fewer calories than the body burns. A sustained deficit can lead to gradual weight loss, but the actual rate varies by individual." },
      { term: "Calorie surplus", definition: "Consuming more calories than the body burns. A sustained surplus can lead to weight gain over time." },
      { term: "Activity factor", definition: "A multiplier applied to BMR to estimate total daily needs based on activity level, typically ranging from 1.2 to 1.9." },
    ],
    scenarios: [
      {
        title: "Maintenance calories",
        situation: "A person's TDEE is estimated at 2,400 calories and they eat roughly 2,400 daily.",
        analysis: "This roughly matches their needs, so weight tends to stay stable. Small daily variations are normal, and the estimate itself can vary by 10-20%.",
      },
      {
        title: "Gradual weight-loss approach",
        situation: "A person reduces intake from their estimated 2,400 daily needs to 1,900-2,100.",
        analysis: "A 300-500 calorie daily deficit supports gradual loss while helping preserve energy and muscle mass. More extreme deficits are not recommended without guidance.",
      },
      {
        title: "Changing activity level",
        situation: "The same person moves from a sedentary to an active job.",
        analysis: "Their activity multiplier rises from 1.2 to 1.725, meaning their estimated needs can increase by hundreds of calories. Recalculating after a major lifestyle change improves accuracy.",
      },
      {
        title: "Individual variation",
        situation: "Two people with the same inputs get the same estimate but respond differently.",
        analysis: "Calorie equations use average assumptions. Real metabolic rates vary, so the estimate is a useful starting reference rather than an exact number.",
      },
    ],
    relatedConcepts: [
      {
        title: "Basal metabolic rate",
        explanation: "Your BMR is the resting foundation of your daily needs. The calorie calculator builds on BMR by adding an activity factor.",
        calculatorSlug: "bmr-calculator",
      },
      {
        title: "Macronutrient targets",
        explanation: "Once you know your calorie target, macro planning helps you split those calories into protein, carbohydrate, and fat.",
        calculatorSlug: "macro-calculator",
      },
      {
        title: "Body Mass Index",
        explanation: "BMI helps put your calorie needs in context with your body size and weight category.",
        calculatorSlug: "bmi-calculator",
      },
      {
        title: "Body fat percentage",
        explanation: "Body composition affects calorie needs, since muscle burns more at rest than fat. A body-fat estimate can provide useful context.",
        calculatorSlug: "body-fat-calculator",
      },
    ],
  },

  relatedCalculators: ["bmr", "tdee", "bmi", "macro"],

  seo: {
    title: "Calorie Calculator – Estimate Your Daily Calorie Needs",
    description:
      "Estimate your daily calorie needs based on your BMR and activity level. Understand calories for maintenance, loss or gain. Free and instant.",
    keywords: ["calorie calculator", "daily calories", "calorie needs", "calories per day"],
    primaryIntent: "Estimate daily calorie needs",
    secondaryIntents: ["Calories to maintain weight", "Calories for weight loss"],
  },
};