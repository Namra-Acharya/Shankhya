/**
 * Healthy Weight Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const healthyWeightCalculator: CalculatorDefinition = {
  id: "healthy-weight",
  slug: "healthy-weight-calculator",
  name: "Healthy Weight Calculator",
  category: "health",
  shortDescription: "Find the healthy weight range for your height.",
  icon: "scale",
  accent: "health",
  popularity: 93,

  inputs: [
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "175", defaultValue: 175, validation: { required: true, min: 100, max: 250 } },
    {
      id: "sex", label: "Sex", type: "radio", defaultValue: "male",
      options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
    },
  ],

  calculate: (values) => {
    const height = parseNumber(values.height) ?? 0;
    const heightM = height / 100;
    const healthyMin = 18.5 * heightM * heightM;
    const healthyMax = 24.9 * heightM * heightM;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "range",
              label: "HEALTHY WEIGHT RANGE",
              value: `${formatNumber(healthyMin, 1)} – ${formatNumber(healthyMax, 1)} kg`,
              format: "text",
              primary: true,
              description: `based on BMI 18.5–24.9 for ${formatNumber(height, 0)} cm`,
            },
          ],
        },
        {
          id: "details",
          title: "Range details",
          values: [
            { id: "min", label: "Minimum weight", value: formatNumber(healthyMin, 1), format: "number", description: "kg (BMI 18.5)" },
            { id: "max", label: "Maximum weight", value: formatNumber(healthyMax, 1), format: "number", description: "kg (BMI 24.9)" },
          ],
        },
      ],
      interpretation: `For a height of ${formatNumber(height, 0)} cm, the healthy weight range (BMI 18.5–24.9) is ${formatNumber(healthyMin, 1)} to ${formatNumber(healthyMax, 1)} kg. This is a screening guideline, not a diagnosis.`,
    };
  },

  content: {
    summary: "The Healthy Weight Calculator finds the weight range associated with a healthy BMI for your height.",
    howToUse: ["Enter your height.", "Select your sex.", "Press Calculate."],
    interpretation: "The healthy weight range corresponds to a BMI between 18.5 and 24.9. Individual factors like muscle mass mean this is a guideline, not a rule.",
    formula: "Range = (18.5 × H²) to (24.9 × H²)\nWhere H = height in meters",
    variables: [
      { symbol: "H", name: "Height", description: "Height in meters." },
      { symbol: "BMI", name: "BMI", description: "Body Mass Index." },
    ],
    example: {
      title: "Example: 175 cm",
      inputs: { Height: "175cm" },
      steps: ["Height in meters = 1.75", "Min = 18.5 × 1.75² = 56.7 kg", "Max = 24.9 × 1.75² = 76.3 kg"],
      result: "56.7 – 76.3 kg",
    },
    factors: ["Muscle mass affects healthy weight.", "Age and frame size matter."],
    edgeCases: ["Athletes may fall outside the range healthily."],
    commonMistakes: ["Treating BMI range as the only measure of health."],
    assumptions: ["Average body composition."],
    limitations: ["This is a guideline, not medical advice."],
    faqs: [{ question: "What is a healthy weight for my height?", answer: "The healthy weight range is based on BMI 18.5-24.9. For example, at 175 cm it's approximately 57-76 kg." }],
  },

  relatedCalculators: ["bmi", "ideal-weight", "body-fat", "calorie"],
  seo: {
    title: "Healthy Weight Calculator – Find Your Healthy Range",
    description: "Find the healthy weight range for your height. Based on BMI guidelines. Free, instant and accurate.",
    keywords: ["healthy weight calculator", "healthy weight range", "weight for height"],
    primaryIntent: "Find healthy weight range",
    secondaryIntents: ["Weight range for height", "BMI healthy range"],
  },
};