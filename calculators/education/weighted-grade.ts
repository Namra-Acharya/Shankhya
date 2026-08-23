/**
 * Weighted Grade Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const weightedGradeCalculator: CalculatorDefinition = {
  id: "weighted-grade",
  slug: "weighted-grade-calculator",
  name: "Weighted Grade Calculator",
  category: "education",
  shortDescription: "Calculate your grade with weighted assignments and exams.",
  icon: "scale",
  accent: "education",
  popularity: 88,

  inputs: [
    {
      id: "numItems",
      label: "Number of graded items",
      type: "number",
      placeholder: "4",
      hint: "How many assignments, quizzes or exams.",
      example: "e.g. 4 items",
      defaultValue: 4,
      validation: { required: true, min: 1, max: 20 },
    },
  ],

  calculate: (values) => {
    const numItems = Math.min(Math.max(parseNumber(values.numItems) ?? 4, 1), 20);

    let totalWeighted = 0;
    let totalWeight = 0;

    for (let i = 1; i <= numItems; i++) {
      const score = parseNumber(values[`score${i}`]);
      const weight = parseNumber(values[`weight${i}`]);
      if (score !== null && weight !== null) {
        totalWeighted += score * weight;
        totalWeight += weight;
      }
    }

    const weightedGrade = totalWeight > 0 ? totalWeighted / totalWeight : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "grade",
              label: "WEIGHTED GRADE",
              value: formatPercentage(weightedGrade, 1),
              format: "percentage",
              primary: true,
              description: `based on ${formatNumber(totalWeight, 0)} total weight`,
            },
          ],
        },
        {
          id: "details",
          title: "Calculation details",
          values: [
            { id: "weighted", label: "Total weighted score", value: formatNumber(totalWeighted, 1), format: "number" },
            { id: "weight", label: "Total weight", value: formatNumber(totalWeight, 0), format: "number" },
          ],
        },
      ],
      interpretation: `Your weighted grade is ${formatPercentage(weightedGrade, 1)}, calculated from ${formatNumber(numItems, 0)} graded items with a total weight of ${formatNumber(totalWeight, 0)}.`,
    };
  },

  content: {
    summary:
      "The Weighted Grade Calculator computes your overall grade when different assignments have different weights. It is commonly used for courses where exams are worth more than homework.",
    howToUse: [
      "Enter the number of graded items.",
      "Enter the score (as a percentage) and weight for each item.",
      "Press Calculate to see your weighted grade.",
    ],
    interpretation:
      "The weighted grade is the sum of each score multiplied by its weight, divided by the total weight. Items with higher weights have a greater impact on your final grade.",
    formula: "Weighted Grade = Σ(Score × Weight) / Σ(Weight)",
    variables: [
      { symbol: "Score", name: "Score", description: "The score for each item as a percentage." },
      { symbol: "Weight", name: "Weight", description: "The weight of each item." },
    ],
    example: {
      title: "Example: Homework (20%), Quiz (30%), Exam (50%)",
      inputs: { "Homework": "85% (weight 20)", "Quiz": "90% (weight 30)", "Exam": "75% (weight 50)" },
      steps: [
        "Weighted = (85×20) + (90×30) + (75×50) = 1700 + 2700 + 3750 = 8150",
        "Total weight = 20 + 30 + 50 = 100",
        "Grade = 8150 / 100 = 81.5%",
      ],
      result: "81.5%",
    },
    factors: [
      "Higher weights mean greater impact on the final grade.",
      "Weights should typically sum to 100.",
      "Scores are usually entered as percentages.",
    ],
    edgeCases: [
      "Zero total weight results in undefined grade.",
      "Weights that don't sum to 100 still work correctly.",
    ],
    commonMistakes: [
      "Using unweighted averages instead of weighted.",
      "Entering scores as raw points instead of percentages.",
      "Weights that don't match the course syllabus.",
    ],
    assumptions: [
      "Scores are on the same scale (typically 0-100).",
      "Weights are correctly entered.",
    ],
    limitations: [
      "Does not account for extra credit or dropped lowest scores.",
      "Some courses use different weighting schemes.",
    ],
    faqs: [
      {
        question: "What is a weighted grade?",
        answer:
          "A weighted grade gives different importance to different assignments. For example, a final exam might be worth 50% of your grade while homework is only worth 10%.",
      },
    ],
  },

  relatedCalculators: ["final-grade", "grade", "gpa", "semester-gpa"],

  seo: {
    title: "Weighted Grade Calculator – Calculate Your Final Grade",
    description:
      "Calculate your weighted grade with different assignment weights. See how exams, quizzes and homework affect your final grade. Free and instant.",
    keywords: ["weighted grade calculator", "weighted average grade", "grade with weights"],
    primaryIntent: "Calculate weighted grade",
    secondaryIntents: ["Grade with assignment weights", "Weighted average calculation"],
  },
};