/**
 * BMR Calculator - Basal Metabolic Rate
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export function calculateBMR(
  sex: string,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "female" ? base - 161 : base + 5;
}

export const bmrCalculator: CalculatorDefinition = {
  id: "bmr",
  slug: "bmr-calculator",
  name: "BMR Calculator",
  category: "health",
  shortDescription: "Calculate your Basal Metabolic Rate.",
  icon: "activity",
  accent: "health",
  featured: true,
  popularity: 98,

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
  ],

  calculate: (values) => {
    const sex = String(values.sex ?? "male");
    const weight = parseNumber(values.weight) ?? 0;
    const height = parseNumber(values.height) ?? 0;
    const age = parseNumber(values.age) ?? 30;

    const bmr = calculateBMR(sex, weight, height, age);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "bmr",
              label: "YOUR BMR",
              value: formatNumber(bmr, 0),
              format: "number",
              primary: true,
              description: "calories per day at rest",
            },
          ],
        },
      ],
      interpretation: `Your Basal Metabolic Rate is approximately ${formatNumber(bmr, 0)} calories per day. This is the energy your body needs at complete rest. BMR is an estimate, not a medical measurement.`,
    };
  },

  content: {
    summary:
      "The BMR Calculator estimates your Basal Metabolic Rate using the Mifflin-St Jeor equation. BMR is the number of calories your body burns at rest.",
    howToUse: [
      "Select your sex.",
      "Enter your weight, height and age.",
      "Press Calculate to see your BMR.",
    ],
    interpretation:
      "BMR represents the minimum energy your body needs to function at rest. Your total daily energy expenditure (TDEE) is higher because it includes physical activity.",
    formula: "Mifflin-St Jeor:\n\nMale: BMR = 10W + 6.25H − 5A + 5\nFemale: BMR = 10W + 6.25H − 5A − 161",
    variables: [
      { symbol: "W", name: "Weight", description: "Weight in kilograms." },
      { symbol: "H", name: "Height", description: "Height in centimeters." },
      { symbol: "A", name: "Age", description: "Age in years." },
    ],
    example: {
      title: "Example: Male, 70kg, 175cm, 30 years",
      inputs: { Sex: "Male", Weight: "70kg", Height: "175cm", Age: "30" },
      steps: [
        "BMR = 10(70) + 6.25(175) − 5(30) + 5",
        "BMR = 700 + 1093.75 − 150 + 5",
        "BMR = 1648.75",
      ],
      result: "BMR ≈ 1,649 calories/day",
    },
    factors: [
      "Muscle mass increases BMR.",
      "Age affects BMR (it decreases with age).",
      "The equation is most accurate for average body compositions.",
    ],
    edgeCases: [
      "Very muscular individuals may have higher BMR than estimated.",
      "The formula is less accurate for extreme body types.",
    ],
    commonMistakes: [
      "Using BMR as your total daily calories (it excludes activity).",
      "Entering height in meters instead of centimeters.",
    ],
    assumptions: [
      "Average body composition.",
      "Standard metabolic conditions.",
    ],
    limitations: [
      "This is an estimate, not a medical measurement.",
      "Individual BMR can vary by 10-15%.",
    ],
    faqs: [
      {
        question: "What is the difference between BMR and TDEE?",
        answer:
          "BMR is the calories your body burns at complete rest. TDEE (Total Daily Energy Expenditure) includes physical activity and is always higher than BMR.",
      },
    ],
    glossary: [
      { term: "Basal Metabolic Rate (BMR)", definition: "The estimated number of calories your body burns at complete rest to keep basic functions running — breathing, circulation, and cell repair. It is not the same as your total daily calorie needs." },
      { term: "Total Daily Energy Expenditure (TDEE)", definition: "The total calories you burn in a day, including BMR plus physical activity and the energy used to digest food. TDEE is always higher than BMR." },
      { term: "Mifflin-St Jeor equation", definition: "A widely used formula that estimates BMR from sex, weight, height, and age. It is generally considered more accurate than older equations for average body compositions." },
      { term: "Resting energy expenditure", definition: "A closely related measure to BMR, sometimes measured under slightly less strict conditions. The two are often used interchangeably in everyday discussion." },
      { term: "Activity factor", definition: "A multiplier applied to BMR to estimate TDEE based on how active a person is. Common values range from about 1.2 (sedentary) to 1.9 (very active)." },
      { term: "Energy balance", definition: "The relationship between calories consumed and calories burned. When intake equals expenditure, weight tends to stay stable; a surplus or deficit shifts it over time." },
    ],
    scenarios: [
      {
        title: "Two people, same weight, different BMR",
        situation: "A 30-year-old male and a 30-year-old female both weigh 70 kg and are 175 cm tall.",
        analysis: "The Mifflin-St Jeor equation adds 5 for males and subtracts 161 for females, so the male's BMR is about 166 calories higher. This reflects average differences in body composition, not a personal verdict.",
      },
      {
        title: "Age and BMR",
        situation: "The same person at 30 and at 60 years old.",
        analysis: "The equation subtracts 5 calories per year of age. This reflects the tendency for muscle mass and metabolic rate to decline with age, though individual variation is large.",
      },
      {
        title: "BMR vs daily needs",
        situation: "A person's BMR is 1,600 calories, but they are moderately active.",
        analysis: "Their TDEE is roughly 1,600 × 1.55 ≈ 2,480 calories. Using BMR alone as a daily calorie target would understate real needs — BMR is only the resting component.",
      },
      {
        title: "Muscle mass and BMR",
        situation: "Two people with identical weight, height, and age, but different muscle mass.",
        analysis: "The equation assumes average body composition. A more muscular person typically has a higher true BMR than the estimate, which is why the result is a useful reference rather than an exact measurement.",
      },
    ],
    relatedConcepts: [
      {
        title: "Daily calorie needs",
        explanation: "BMR is the resting component of your daily energy needs. The calorie calculator applies an activity factor to estimate your total daily expenditure.",
        calculatorSlug: "calorie-calculator",
      },
      {
        title: "Body Mass Index",
        explanation: "BMI relates weight to height, while BMR estimates resting energy needs. Together they give a broader picture of body size and energy requirements.",
        calculatorSlug: "bmi-calculator",
      },
      {
        title: "Body fat percentage",
        explanation: "Body composition influences BMR — more muscle generally means a higher resting burn. A body-fat estimate can help explain why two similar people have different metabolic needs.",
        calculatorSlug: "body-fat-calculator",
      },
      {
        title: "Macronutrient targets",
        explanation: "Once you know your calorie needs, macro targets help you plan protein, carbohydrate, and fat intake to match your goals.",
        calculatorSlug: "macro-calculator",
      },
    ],
  },

  relatedCalculators: ["tdee", "calorie", "bmi", "body-fat"],

  seo: {
    title: "BMR Calculator – Calculate Your Basal Metabolic Rate",
    description:
      "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation. See the calories your body needs at rest. Free and instant.",
    keywords: ["bmr calculator", "basal metabolic rate", "metabolism calculator"],
    primaryIntent: "Calculate BMR",
    secondaryIntents: ["Resting calories", "Metabolic rate estimate"],
  },
};