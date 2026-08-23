/**
 * Final Grade Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const finalGradeCalculator: CalculatorDefinition = {
  id: "final-grade",
  slug: "final-grade-calculator",
  name: "Final Grade Calculator",
  category: "education",
  shortDescription: "Calculate the grade you need on your final exam.",
  icon: "target",
  accent: "education",
  popularity: 87,

  inputs: [
    {
      id: "currentGrade",
      label: "Current grade",
      type: "percentage",
      unit: "%",
      placeholder: "82",
      hint: "Your current grade before the final.",
      example: "e.g. 82%",
      defaultValue: 82,
      validation: { required: true, min: 0, max: 100 },
    },
    {
      id: "desiredGrade",
      label: "Desired grade",
      type: "percentage",
      unit: "%",
      placeholder: "90",
      hint: "The grade you want to achieve.",
      example: "e.g. 90%",
      defaultValue: 90,
      validation: { required: true, min: 0, max: 100 },
    },
    {
      id: "finalWeight",
      label: "Final exam weight",
      type: "percentage",
      unit: "%",
      placeholder: "30",
      hint: "How much the final exam counts toward your grade.",
      example: "e.g. 30%",
      defaultValue: 30,
      validation: { required: true, min: 1, max: 100 },
    },
  ],

  calculate: (values) => {
    const currentGrade = parseNumber(values.currentGrade) ?? 0;
    const desiredGrade = parseNumber(values.desiredGrade) ?? 0;
    const finalWeight = parseNumber(values.finalWeight) ?? 30;

    const weight = finalWeight / 100;
    const requiredGrade = weight > 0
      ? (desiredGrade - (1 - weight) * currentGrade) / weight
      : 0;

    const isPossible = requiredGrade <= 100;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "required",
              label: "GRADE NEEDED ON FINAL",
              value: formatPercentage(requiredGrade, 1),
              format: "percentage",
              primary: true,
              description: `to achieve ${formatPercentage(desiredGrade, 0)} overall`,
            },
          ],
        },
        {
          id: "status",
          title: "Feasibility",
          values: [
            {
              id: "possible",
              label: "Achievable?",
              value: isPossible ? "Yes" : "No",
              format: "text",
              description: isPossible
                ? `You need ${formatPercentage(requiredGrade, 1)} on the final`
                : `Even 100% on the final won't reach ${formatPercentage(desiredGrade, 0)}`,
            },
          ],
        },
      ],
      interpretation: `To achieve ${formatPercentage(desiredGrade, 0)} overall with a final worth ${formatPercentage(finalWeight, 0)}, you need ${formatPercentage(requiredGrade, 1)} on the final exam.`,
    };
  },

  content: {
    summary:
      "The Final Grade Calculator tells you the score you need on your final exam to achieve your desired overall grade.",
    howToUse: [
      "Enter your current grade.",
      "Enter the grade you want to achieve.",
      "Enter the weight of the final exam.",
      "Press Calculate to see the grade you need.",
    ],
    interpretation:
      "The required grade is calculated based on your current grade, the final exam weight, and your desired overall grade. If the required grade is above 100%, the goal is not achievable.",
    formula: "Required = (Desired − (1 − W) × Current) / W\n\nWhere W = final weight as a decimal",
    variables: [
      { symbol: "Current", name: "Current grade", description: "Your grade before the final." },
      { symbol: "Desired", name: "Desired grade", description: "The grade you want." },
      { symbol: "W", name: "Final weight", description: "The final exam weight as a decimal." },
    ],
    example: {
      title: "Example: Current 82%, want 90%, final worth 30%",
      inputs: { "Current grade": "82%", "Desired grade": "90%", "Final weight": "30%" },
      steps: [
        "W = 30% = 0.30",
        "Required = (90 − 0.70 × 82) / 0.30",
        "= (90 − 57.4) / 0.30",
        "= 32.6 / 0.30",
        "= 108.7%",
      ],
      result: "108.7% - Not achievable",
    },
    factors: [
      "A higher final weight makes it easier to change your grade.",
      "A higher desired grade requires a higher final score.",
      "Your current grade sets the baseline.",
    ],
    edgeCases: [
      "If the required grade is above 100%, the goal is not achievable.",
      "If the required grade is below 0%, you already have the desired grade.",
      "A final weight of 100% means only the final matters.",
    ],
    commonMistakes: [
      "Using the final weight as a percentage instead of a decimal.",
      "Not considering that the current grade is weighted by (1 - final weight).",
    ],
    assumptions: [
      "The final exam is the only remaining graded item.",
      "The current grade is accurate.",
    ],
    limitations: [
      "Does not account for extra credit or curve.",
      "Some courses have multiple remaining assignments.",
    ],
    faqs: [
      {
        question: "What if the required grade is over 100%?",
        answer:
          "If the required grade is over 100%, it means you cannot achieve your desired grade even with a perfect score on the final. You may need to adjust your goal or seek extra credit.",
      },
    ],
  },

  relatedCalculators: ["weighted-grade", "grade", "gpa", "semester-gpa"],

  seo: {
    title: "Final Grade Calculator – What Do You Need on the Final?",
    description:
      "Calculate the grade you need on your final exam to achieve your desired overall grade. Free, instant and accurate.",
    keywords: ["final grade calculator", "what do i need on final", "final exam grade"],
    primaryIntent: "Calculate required final exam grade",
    secondaryIntents: ["Grade needed to pass", "Final exam score needed"],
  },
};