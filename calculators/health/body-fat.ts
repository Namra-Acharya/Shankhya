/**
 * Body Fat Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const bodyFatCalculator: CalculatorDefinition = {
  id: "body-fat",
  slug: "body-fat-calculator",
  name: "Body Fat Calculator",
  category: "health",
  shortDescription: "Estimate your body fat percentage using the US Navy method.",
  icon: "scan",
  accent: "health",
  popularity: 95,

  inputs: [
    {
      id: "sex", label: "Sex", type: "radio", defaultValue: "male",
      options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
    },
    { id: "weight", label: "Weight", type: "number", unit: "kg", placeholder: "70", defaultValue: 70, validation: { required: true, min: 20, max: 500 } },
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "175", defaultValue: 175, validation: { required: true, min: 100, max: 250 } },
    { id: "waist", label: "Waist", type: "number", unit: "cm", placeholder: "80", defaultValue: 80, validation: { required: true, min: 40, max: 200 } },
    { id: "neck", label: "Neck", type: "number", unit: "cm", placeholder: "38", defaultValue: 38, validation: { required: true, min: 20, max: 80 } },
    {
      id: "hip", label: "Hip (women only)", type: "number", unit: "cm", placeholder: "95", defaultValue: 95,
      validation: { min: 40, max: 200 },
      showWhen: { inputId: "sex", equals: "female" },
    },
  ],

  calculate: (values) => {
    const sex = String(values.sex ?? "male");
    const weight = parseNumber(values.weight) ?? 0;
    const height = parseNumber(values.height) ?? 0;
    const waist = parseNumber(values.waist) ?? 0;
    const neck = parseNumber(values.neck) ?? 0;
    const hip = parseNumber(values.hip) ?? 0;

    // US Navy method
    let bodyFat: number;
    if (sex === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    bodyFat = Math.max(2, Math.min(60, bodyFat));

    const fatMass = (bodyFat / 100) * weight;
    const leanMass = weight - fatMass;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "bodyFat", label: "ESTIMATED BODY FAT", value: formatPercentage(bodyFat, 1), format: "percentage", primary: true, description: "US Navy method estimate" },
          ],
        },
        {
          id: "breakdown",
          title: "Body composition",
          values: [
            { id: "fatMass", label: "Fat mass", value: formatNumber(fatMass, 1), format: "number", description: "kg" },
            { id: "leanMass", label: "Lean mass", value: formatNumber(leanMass, 1), format: "number", description: "kg" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Body composition (kg)",
        data: [
          { label: "Fat mass", value: Math.round(fatMass), color: "var(--muted)" },
          { label: "Lean mass", value: Math.round(leanMass), color: "var(--accent)" },
        ],
      },
      interpretation: `Your estimated body fat percentage is ${formatPercentage(bodyFat, 1)}. This is an estimate using the US Navy method and is not a medical measurement.`,
    };
  },

  content: {
    summary: "The Body Fat Calculator estimates your body fat percentage using the US Navy circumference method.",
    howToUse: ["Select your sex.", "Enter your weight, height, waist and neck measurements.", "Women also enter hip measurement.", "Press Calculate."],
    interpretation: "Body fat percentage is the proportion of your body weight that is fat. The US Navy method uses circumference measurements for estimation.",
    formula: "US Navy circumference method using height, waist, neck (and hip for women)",
    variables: [
      { symbol: "W", name: "Weight", description: "Body weight in kg." },
      { symbol: "H", name: "Height", description: "Height in cm." },
      { symbol: "Waist", name: "Waist", description: "Waist circumference in cm." },
      { symbol: "Neck", name: "Neck", description: "Neck circumference in cm." },
    ],
    example: {
      title: "Example: Male, 70kg, 175cm, waist 80cm, neck 38cm",
      inputs: { Sex: "Male", Weight: "70kg", Height: "175cm", Waist: "80cm", Neck: "38cm" },
      steps: ["Apply US Navy formula", "Body fat ≈ 15.2%"],
      result: "≈ 15.2% body fat",
    },
    factors: ["Measurement accuracy is critical.", "The method is an estimate, not a scan."],
    edgeCases: ["Very muscular individuals may be underestimated.", "The formula is less accurate for extreme body types."],
    commonMistakes: ["Measuring at the wrong location.", "Using inches instead of cm."],
    assumptions: ["Measurements are taken correctly.", "Average body composition."],
    limitations: ["This is an estimate, not a DEXA scan.", "Not a medical diagnosis."],
    faqs: [{ question: "What is a healthy body fat percentage?", answer: "For men, 10-20% is generally considered healthy. For women, 20-30%. These ranges vary by age and fitness level." }],
    glossary: [
      { term: "Body fat percentage", definition: "The proportion of your total body weight that is fat. It is an estimate of body composition, not a direct measurement." },
      { term: "Essential fat", definition: "The minimum amount of fat needed for normal physiological function. Essential fat is higher in women due to reproductive needs." },
      { term: "Storage fat", definition: "Fat stored under the skin and around organs. It provides energy reserves and insulation beyond the essential minimum." },
      { term: "Lean mass", definition: "Everything in your body except fat — muscle, bone, organs, and water. It is not just muscle." },
      { term: "US Navy method", definition: "A circumference-based technique that estimates body fat from height and girth measurements. It is quick and inexpensive but less precise than imaging methods." },
      { term: "DEXA scan", definition: "A clinical imaging method that measures bone density, lean mass, and fat mass with much higher precision than circumference formulas." },
    ],
    scenarios: [
      {
        title: "Circumference measurement error",
        situation: "A waist measurement taken too loose or too tight changes the body-fat estimate.",
        analysis: "Because the US Navy formula depends heavily on circumference, small measurement differences can shift the result by several percentage points. Use a tape measure flat against the skin at the narrowest waist point.",
      },
      {
        title: "Muscular and lean individuals",
        situation: "A trained athlete and a sedentary person with the same height, weight, and circumference.",
        analysis: "The formula can underestimate body fat in very muscular people because it relies on measurements rather than directly measuring body composition. It is a useful reference, not a lab result.",
      },
      {
        title: "Age and body composition",
        situation: "Body fat tends to increase with age even when weight is stable.",
        analysis: "The calculator does not include age. A younger and older adult with the same measurements may have different actual body-fat levels, which is a known limitation of the formula.",
      },
      {
        title: "Fat mass and lean mass",
        situation: "A person weighing 80 kg with an estimated body-fat percentage of 20%.",
        analysis: "Their fat mass is about 16 kg and lean mass about 64 kg. Understanding this split is often more useful than a single percentage, since lean mass drives metabolism and strength.",
      },
    ],
    relatedConcepts: [
      {
        title: "Body Mass Index",
        explanation: "BMI relates weight to height but does not direct measured body fat. Comparing BMI and estimated body fat gives a fuller picture.",
        calculatorSlug: "bmi-calculator",
      },
      {
        title: "Metabolic rate and lean mass",
        explanation: "Lean mass burns more calories at rest than fat. A body-fat estimate helps put BMR in context — more lean mass generally means a higher resting burn.",
        calculatorSlug: "bmr-calculator",
      },
      {
        title: "Calorie needs",
        explanation: "Body composition influences how many calories you need. A body-fat estimate can help explain differences between otherwise similar people.",
        calculatorSlug: "calorie-calculator",
      },
      {
        title: "Ideal weight range",
        explanation: "Ideal-weight formulas use height as their input. Combining them with body-fat estimates gives a more realistic picture than weight alone.",
        calculatorSlug: "ideal-weight-calculator",
      },
    ],
  },

  relatedCalculators: ["bmi", "bmr", "calorie", "ideal-weight"],
  seo: {
    title: "Body Fat Calculator – Estimate Your Body Fat %",
    description: "Estimate your body fat percentage using the US Navy method. See fat mass and lean mass. Free, instant and accurate.",
    keywords: ["body fat calculator", "body fat percentage", "us navy body fat"],
    primaryIntent: "Estimate body fat percentage",
    secondaryIntents: ["Body composition", "Fat mass and lean mass"],
  },
};