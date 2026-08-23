/**
 * Ideal Weight Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const idealWeightCalculator: CalculatorDefinition = {
  id: "ideal-weight",
  slug: "ideal-weight-calculator",
  name: "Ideal Weight Calculator",
  category: "health",
  shortDescription: "Estimate your ideal body weight based on height and sex.",
  icon: "scale",
  accent: "health",
  popularity: 94,

  inputs: [
    {
      id: "sex", label: "Sex", type: "radio", defaultValue: "male",
      options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
    },
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "175", defaultValue: 175, validation: { required: true, min: 100, max: 250 } },
  ],

  calculate: (values) => {
    const sex = String(values.sex ?? "male");
    const height = parseNumber(values.height) ?? 0;

    // Devine formula
    const base = sex === "male" ? 50 : 45.5;
    const heightInches = height / 2.54;
    const idealWeight = base + 2.3 * (heightInches - 60);

    // Healthy BMI range
    const heightM = height / 100;
    const healthyMin = 18.5 * heightM * heightM;
    const healthyMax = 24.9 * heightM * heightM;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "ideal", label: "ESTIMATED IDEAL WEIGHT", value: formatNumber(idealWeight, 1), format: "number", primary: true, description: "kg (Devine formula)" },
          ],
        },
        {
          id: "range",
          title: "Healthy weight range",
          values: [
            { id: "min", label: "Minimum (BMI 18.5)", value: formatNumber(healthyMin, 1), format: "number", description: "kg" },
            { id: "max", label: "Maximum (BMI 24.9)", value: formatNumber(healthyMax, 1), format: "number", description: "kg" },
          ],
        },
      ],
      interpretation: `Your estimated ideal weight is ${formatNumber(idealWeight, 1)} kg. A healthy weight range for your height is ${formatNumber(healthyMin, 1)} to ${formatNumber(healthyMax, 1)} kg. This is an estimate, not a medical recommendation.`,
    };
  },

  content: {
    summary: "The Ideal Weight Calculator estimates a healthy weight range for your height using the Devine formula and BMI ranges.",
    howToUse: ["Select your sex.", "Enter your height.", "Press Calculate."],
    interpretation: "The ideal weight is an estimate. The healthy weight range is based on BMI 18.5-24.9, which is a screening guideline.",
    formula: "Devine: Male = 50 + 2.3(in − 60), Female = 45.5 + 2.3(in − 60)",
    variables: [
      { symbol: "H", name: "Height", description: "Height in cm." },
      { symbol: "in", name: "Inches", description: "Height in inches." },
    ],
    example: {
      title: "Example: Male, 175cm",
      inputs: { Sex: "Male", Height: "175cm" },
      steps: ["Height in inches = 175 / 2.54 = 68.9", "Ideal = 50 + 2.3(68.9 − 60) = 70.5 kg"],
      result: "≈ 70.5 kg",
    },
    factors: ["Frame size affects ideal weight.", "Muscle mass is not accounted for."],
    edgeCases: ["Athletes may weigh more than ideal estimates."],
    commonMistakes: ["Treating ideal weight as a target rather than a range."],
    assumptions: ["Average frame size.", "Standard body composition."],
    limitations: ["This is an estimate, not medical advice."],
    faqs: [{ question: "What is the healthiest weight for my height?", answer: "A healthy BMI range (18.5-24.9) corresponds to a weight range for your height. Individual factors like muscle mass matter." }],
  },

  relatedCalculators: ["bmi", "healthy-weight", "body-fat", "calorie"],
  seo: {
    title: "Ideal Weight Calculator – Healthy Weight for Your Height",
    description: "Estimate your ideal body weight and healthy weight range based on height and sex. Free, instant and accurate.",
    keywords: ["ideal weight calculator", "healthy weight", "ideal body weight"],
    primaryIntent: "Estimate ideal body weight",
    secondaryIntents: ["Healthy weight range", "Weight for height"],
  },
};