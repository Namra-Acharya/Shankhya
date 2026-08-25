/**
 * BMI Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/** BMI category thresholds (single source of truth, shared with the gauge). */
export const BMI_CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5 },
  { label: "Normal weight", min: 18.5, max: 25 },
  { label: "Overweight", min: 25, max: 30 },
  { label: "Obese", min: 30, max: Infinity },
] as const;

export function getBMICategory(bmi: number): string {
  const cat = BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max);
  return cat?.label ?? (bmi < 18.5 ? "Underweight" : "Obese");
}

export const bmiCalculator: CalculatorDefinition = {
  id: "bmi",
  slug: "bmi-calculator",
  name: "BMI Calculator",
  category: "health",
  shortDescription: "Calculate your Body Mass Index and understand your category.",
  icon: "heart-pulse",
  accent: "health",
  featured: true,
  popularity: 99,

  inputs: [
    {
      id: "weight",
      label: "Weight",
      type: "number",
      unit: "kg",
      placeholder: "70",
      hint: "Your weight in kilograms.",
      example: "e.g. 70 kg",
      defaultValue: 70,
      validation: { required: true, min: 20, max: 500 },
    },
    {
      id: "height",
      label: "Height",
      type: "number",
      unit: "cm",
      placeholder: "175",
      hint: "Your height in centimeters.",
      example: "e.g. 175 cm",
      defaultValue: 175,
      validation: { required: true, min: 100, max: 250 },
    },
  ],

  calculate: (values) => {
    const weight = parseNumber(values.weight) ?? 0;
    const height = parseNumber(values.height) ?? 0;

    // Keep full precision internally; round only for display.
    const bmi = height > 0 ? calculateBMI(weight, height) : 0;
    const category = getBMICategory(bmi);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "bmi",
              label: "YOUR BMI",
              value: roundTo(bmi, 1),
              format: "number",
              primary: true,
              description: `kg/m² · ${category}`,
            },
          ],
        },
        {
          id: "category",
          title: "Category",
          values: [
            {
              id: "category",
              label: "BMI category",
              value: category,
              format: "text",
            },
          ],
        },
      ],
      chart: {
        type: "gauge",
        title: "Your BMI on the scale",
        data: [{ label: "BMI", value: roundTo(bmi, 1) }],
        min: 10,
        max: 40,
        unit: "kg/m²",
        decimals: 1,
        ariaLabel: `Your BMI is ${bmi.toFixed(1)}, which falls in the ${category} category.`,
        segments: [
          { label: "Underweight", from: 0, to: 18.5, category: "Underweight" },
          { label: "Normal", from: 18.5, to: 25, category: "Normal weight" },
          { label: "Overweight", from: 25, to: 30, category: "Overweight" },
          { label: "Obesity", from: 30, to: 40, category: "Obesity" },
        ],
      },
      interpretation: `Your BMI is ${bmi.toFixed(1)}. This falls in the "${category}" category. BMI is a screening tool, not a diagnosis. Consult a healthcare professional for a complete assessment.`,
    };
  },

  content: {
    summary:
      "The BMI Calculator computes your Body Mass Index from your weight and height. BMI is a screening tool that helps assess whether your weight is in a healthy range for your height.",
    howToUse: [
      "Enter your weight in kilograms.",
      "Enter your height in centimeters.",
      "Press Calculate to see your BMI and category.",
    ],
    interpretation:
      "BMI is calculated by dividing weight by height squared. The result places you in a category: underweight, normal weight, overweight, or obese. BMI is a screening tool, not a medical diagnosis.",
    formula: "BMI = Weight (kg) / Height (m)²",
    variables: [
      { symbol: "W", name: "Weight", description: "Your weight in kilograms." },
      { symbol: "H", name: "Height", description: "Your height in meters (cm ÷ 100)." },
    ],
    example: {
      title: "Example: 70 kg, 175 cm",
      inputs: { Weight: "70 kg", Height: "175 cm" },
      steps: [
        "Height in meters = 175 / 100 = 1.75 m",
        "BMI = 70 / (1.75 × 1.75)",
        "BMI = 70 / 3.0625",
        "BMI = 22.9",
      ],
      result: "BMI = 22.9 (Normal weight)",
    },
    factors: [
      "BMI does not distinguish between muscle and fat.",
      "Athletes may have high BMI due to muscle mass.",
      "BMI categories may not apply equally to all populations.",
    ],
    edgeCases: [
      "Very muscular individuals may have high BMI but low body fat.",
      "BMI may underestimate body fat in older adults.",
      "Pregnant women should not use standard BMI categories.",
    ],
    commonMistakes: [
      "Using pounds and inches without converting.",
      "Treating BMI as a diagnosis rather than a screening tool.",
    ],
    assumptions: [
      "Weight and height are entered correctly.",
      "Standard BMI categories apply to the individual.",
    ],
    limitations: [
      "BMI does not measure body fat directly.",
      "It does not account for age, sex, or muscle mass.",
      "This is a screening estimate, not a medical diagnosis.",
    ],
    faqs: [
      {
        question: "What is a healthy BMI?",
        answer:
          "A BMI between 18.5 and 24.9 is generally considered healthy for most adults. However, BMI is a screening tool and does not account for muscle mass, age, or other factors. It is a starting point for discussion with a healthcare professional, not a final verdict.",
      },
      {
        question: "How is BMI calculated?",
        answer:
          "BMI is calculated by dividing your weight in kilograms by the square of your height in meters. For example, if you weigh 70 kg and are 1.75 m tall, your BMI is 70 ÷ (1.75 × 1.75) = 22.9. If you use pounds and inches, the formula is (weight in pounds ÷ height in inches²) × 703.",
      },
      {
        question: "Can I use pounds and inches instead of kilograms and centimeters?",
        answer:
          "Yes. The standard formula for imperial units is BMI = (weight in pounds ÷ height in inches²) × 703. The result is the same as using the metric formula. This calculator uses metric units (kg and cm), but you can convert your measurements first.",
      },
      {
        question: "Why is BMI not a direct measurement of body fat?",
        answer:
          "BMI is a mathematical ratio of weight to height — it does not directly measure body fat. Two people with the same BMI can have very different body compositions. For example, a muscular athlete and a sedentary person of the same height and weight would have the same BMI, but very different amounts of body fat.",
      },
      {
        question: "When is BMI less informative?",
        answer:
          "BMI can be less informative for athletes and bodybuilders (high muscle mass raises BMI), older adults (muscle loss can lower BMI while body fat increases), pregnant women, children and teenagers (who need age- and sex-specific percentiles), and certain ethnic groups where the healthy range may differ.",
      },
      {
        question: "Does BMI apply to children the same way as adults?",
        answer:
          "No. For children and teenagers, BMI is interpreted using age- and sex-specific percentiles rather than the adult categories. A child's BMI is compared to others of the same age and sex, and the result is expressed as a percentile. This calculator uses adult BMI categories and is intended for adults.",
      },
      {
        question: "Is BMI a diagnosis?",
        answer:
          "No. BMI is a screening tool, not a diagnosis. It can indicate whether your weight is in a range associated with health risks, but it does not diagnose any condition. A healthcare professional considers BMI alongside other factors such as waist circumference, blood pressure, blood sugar, and family history.",
      },
      {
        question: "What are the BMI categories?",
        answer:
          "For adults, the standard categories are: Underweight (below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 and above). These cutoffs are based on population studies linking BMI ranges to health outcomes, but individual health depends on many factors beyond BMI.",
      },
    ],
    glossary: [
      { term: "Body Mass Index (BMI)", definition: "A screening measure calculated from weight and height. It is used to estimate whether a person's weight is in a range associated with health risks, but it does not measure body fat directly." },
      { term: "Body composition", definition: "The proportion of fat, muscle, bone, and other tissue in the body. Two people with the same BMI can have very different body compositions." },
      { term: "Lean mass", definition: "The weight of everything in the body except fat, including muscle, bone, organs, and water. Higher lean mass can raise BMI without indicating excess fat." },
      { term: "Screening measure", definition: "A quick, inexpensive tool used to flag potential concerns. A screening result is not a diagnosis — it is a starting point for further assessment." },
      { term: "Reference range", definition: "A range of values considered typical or healthy for a population. BMI reference ranges are based on population studies and may not apply to every individual." },
      { term: "Waist circumference", definition: "A measurement around the waist that can indicate abdominal fat. It is often used alongside BMI to give a fuller picture of health risk." },
    ],
    scenarios: [
      {
        title: "Same BMI, different body composition",
        situation: "A muscular athlete and a sedentary person both have a BMI of 24.",
        analysis: "The athlete likely has high lean mass and low body fat, while the sedentary person may have higher body fat. BMI alone cannot distinguish these — it is a screening measure, not a body-composition test.",
      },
      {
        title: "Weight change and BMI",
        situation: "A person weighing 70 kg at 1.75 m has a BMI of 22.9. Gaining 5 kg raises it to 24.5.",
        analysis: "A modest weight change can move a person across a category boundary. This is why BMI is best tracked over time rather than treated as a single fixed verdict.",
      },
      {
        title: "Height and BMI",
        situation: "Two people weigh 80 kg — one is 1.70 m tall (BMI 27.7), the other is 1.85 m (BMI 23.4).",
        analysis: "Because height is squared in the formula, taller people can weigh more and still have a lower BMI. This is why BMI is not a simple weight target.",
      },
      {
        title: "Older adults",
        situation: "An older adult has a BMI of 22 but has lost muscle mass.",
        analysis: "In older adults, a 'normal' BMI can sometimes mask low muscle and higher fat. BMI should be interpreted alongside other factors, especially as body composition changes with age.",
      },
    ],
    relatedConcepts: [
      {
        title: "Body fat percentage",
        explanation: "BMI estimates weight relative to height, but body-fat percentage measures how much of that weight is fat. The two can differ significantly for muscular or older individuals.",
        calculatorSlug: "body-fat-calculator",
      },
      {
        title: "Basal metabolic rate (BMR)",
        explanation: "BMR estimates the calories your body burns at rest. Understanding BMR helps put BMI in context — a higher muscle mass raises BMR even when BMI is unchanged.",
        calculatorSlug: "bmr-calculator",
      },
      {
        title: "Daily calorie needs",
        explanation: "Calorie needs depend on BMR and activity level. Knowing your maintenance calories helps you understand how weight changes relate to energy balance.",
        calculatorSlug: "calorie-calculator",
      },
      {
        title: "Ideal weight range",
        explanation: "Ideal-weight formulas provide a reference range based on height. They are estimates, not a single 'perfect' number, and should be considered alongside body composition.",
        calculatorSlug: "ideal-weight-calculator",
      },
    ],
  },

  relatedCalculators: ["bmr", "calorie", "tdee", "body-fat"],

  seo: {
    title: "BMI Calculator – Calculate Your Body Mass Index",
    description:
      "Calculate your BMI instantly. See your BMI category and understand what it means. Free, accurate and easy to use.",
    keywords: ["bmi calculator", "body mass index", "bmi check", "healthy weight"],
    primaryIntent: "Calculate BMI from weight and height",
    secondaryIntents: ["BMI category", "Healthy weight range", "BMI screening"],
  },
};