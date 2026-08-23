/**
 * Protein Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const proteinCalculator: CalculatorDefinition = {
  id: "protein",
  slug: "protein-calculator",
  name: "Protein Calculator",
  category: "health",
  shortDescription: "Estimate your daily protein needs based on activity and goal.",
  icon: "dumbbell",
  accent: "health",
  popularity: 91,

  inputs: [
    { id: "weight", label: "Weight", type: "number", unit: "kg", placeholder: "70", defaultValue: 70, validation: { required: true, min: 20, max: 500 } },
    {
      id: "activity", label: "Activity level", type: "dropdown", defaultValue: "moderate",
      options: [
        { label: "Sedentary", value: "sedentary" },
        { label: "Lightly active", value: "light" },
        { label: "Moderately active", value: "moderate" },
        { label: "Very active / athlete", value: "active" },
      ],
    },
    {
      id: "goal", label: "Goal", type: "dropdown", defaultValue: "maintain",
      options: [
        { label: "Maintain", value: "maintain" },
        { label: "Build muscle", value: "build" },
        { label: "Lose fat", value: "lose" },
      ],
    },
  ],

  calculate: (values) => {
    const weight = parseNumber(values.weight) ?? 0;
    const activity = String(values.activity ?? "moderate");
    const goal = String(values.goal ?? "maintain");

    const multipliers: Record<string, number> = {
      sedentary: 0.8,
      light: 1.0,
      moderate: 1.4,
      active: 1.6,
    };
    const goalMultipliers: Record<string, number> = {
      maintain: 0,
      build: 0.4,
      lose: 0.2,
    };

    const base = weight * (multipliers[activity] ?? 1.2);
    const goalAdjustment = weight * (goalMultipliers[goal] ?? 0);
    const protein = base + goalAdjustment;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "protein", label: "DAILY PROTEIN NEEDS", value: `${formatNumber(protein, 0)}g`, format: "text", primary: true, description: `for ${goal === "build" ? "muscle building" : goal === "lose" ? "fat loss" : "maintenance"}` },
          ],
        },
        {
          id: "details",
          title: "Protein details",
          values: [
            { id: "perKg", label: "Per kg body weight", value: `${formatNumber(protein / weight, 1)}g/kg`, format: "text" },
            { id: "grams", label: "Total daily", value: `${formatNumber(protein, 0)}g`, format: "text" },
          ],
        },
      ],
      interpretation: `Based on your weight of ${formatNumber(weight, 0)} kg and ${activity} activity level, your estimated daily protein needs are approximately ${formatNumber(protein, 0)} grams. This is an estimate.`,
    };
  },

  content: {
    summary: "The Protein Calculator estimates your daily protein needs based on your weight, activity level, and fitness goal.",
    howToUse: ["Enter your weight.", "Select your activity level.", "Choose your goal.", "Press Calculate."],
    interpretation: "Protein needs increase with activity level and muscle-building goals. The estimate is based on grams per kilogram of body weight.",
    formula: "Protein = Weight × Activity Factor + Goal Adjustment",
    variables: [
      { symbol: "W", name: "Weight", description: "Body weight in kg." },
      { symbol: "F", name: "Factor", description: "Activity-based protein factor." },
    ],
    example: {
      title: "Example: 70kg, moderately active, build muscle",
      inputs: { Weight: "70kg", Activity: "Moderate", Goal: "Build muscle" },
      steps: ["Base = 70 × 1.4 = 98g", "Goal adjustment = 70 × 0.4 = 28g", "Total = 98 + 28 = 126g"],
      result: "≈ 126g protein/day",
    },
    factors: ["Activity level increases protein needs.", "Muscle-building goals increase needs."],
    edgeCases: ["Athletes may need up to 2g/kg.", "Older adults may need more protein."],
    commonMistakes: ["Using too little protein for active lifestyles."],
    assumptions: ["Standard protein guidance."],
    limitations: ["This is an estimate, not personalized nutrition advice."],
    faqs: [{ question: "How much protein do I need to build muscle?", answer: "For muscle building, 1.6-2.2g per kg of body weight is commonly recommended. This calculator uses a moderate estimate." }],
  },

  relatedCalculators: ["macro", "calorie", "tdee", "bmr"],
  seo: {
    title: "Protein Calculator – Daily Protein Needs by Weight",
    description: "Estimate your daily protein needs based on weight, activity level and goal. Free, instant and accurate.",
    keywords: ["protein calculator", "daily protein", "protein needs"],
    primaryIntent: "Estimate daily protein needs",
    secondaryIntents: ["Protein for muscle building", "Protein per kg"],
  },
};