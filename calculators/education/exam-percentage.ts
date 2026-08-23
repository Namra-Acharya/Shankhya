/**
 * Exam Percentage Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const examPercentageCalculator: CalculatorDefinition = {
  id: "exam-percentage",
  slug: "exam-percentage-calculator",
  name: "Exam Percentage Calculator",
  category: "education",
  shortDescription: "Calculate your exam percentage from marks across subjects.",
  icon: "file-text",
  accent: "education",
  popularity: 90,

  inputs: [
    {
      id: "numSubjects",
      label: "Number of subjects",
      type: "number",
      placeholder: "5",
      hint: "How many subjects in the exam.",
      example: "e.g. 5 subjects",
      defaultValue: 5,
      validation: { required: true, min: 1, max: 20 },
    },
    {
      id: "obtained",
      label: "Marks obtained",
      type: "decimal",
      placeholder: "78",
      hint: "Marks obtained in each subject.",
      example: "e.g. 78",
      defaultValue: 78,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numSubjects",
        rowLabel: "Subject",
        startIndex: 1,
      },
    },
    {
      id: "max",
      label: "Maximum marks",
      type: "decimal",
      placeholder: "100",
      hint: "Maximum marks for each subject.",
      example: "e.g. 100",
      defaultValue: 100,
      validation: { required: true, min: 1 },
      repeat: {
        countInputId: "numSubjects",
        rowLabel: "Subject",
        startIndex: 1,
      },
    },
  ],

  calculate: (values) => {
    const numSubjects = Math.min(Math.max(parseNumber(values.numSubjects) ?? 5, 1), 20);

    let totalMarks = 0;
    let totalObtained = 0;

    for (let i = 1; i <= numSubjects; i++) {
      const obtained = parseNumber(values[`obtained${i}`]);
      const max = parseNumber(values[`max${i}`]);
      if (obtained !== null && max !== null) {
        totalObtained += obtained;
        totalMarks += max;
      }
    }

    const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "percentage",
              label: "EXAM PERCENTAGE",
              value: formatPercentage(percentage, 1),
              format: "percentage",
              primary: true,
              description: `${formatNumber(totalObtained, 0)} out of ${formatNumber(totalMarks, 0)} total marks`,
            },
          ],
        },
        {
          id: "details",
          title: "Exam summary",
          values: [
            { id: "obtained", label: "Total obtained", value: formatNumber(totalObtained, 0), format: "number" },
            { id: "max", label: "Total maximum", value: formatNumber(totalMarks, 0), format: "number" },
          ],
        },
      ],
      interpretation: `You scored ${formatNumber(totalObtained, 0)} out of ${formatNumber(totalMarks, 0)} total marks, which is ${formatPercentage(percentage, 1)}.`,
    };
  },

  content: {
    summary:
      "The Exam Percentage Calculator computes your overall exam percentage from marks across multiple subjects. It handles different maximum marks per subject.",
    howToUse: [
      "Enter the number of subjects.",
      "Enter the marks obtained and maximum marks for each subject.",
      "Press Calculate to see your overall percentage.",
    ],
    interpretation:
      "The exam percentage is the total marks obtained divided by the total maximum marks across all subjects, multiplied by 100.",
    formula: "Percentage = (Total Obtained / Total Maximum) × 100",
    variables: [
      { symbol: "O", name: "Obtained", description: "Marks obtained in each subject." },
      { symbol: "M", name: "Maximum", description: "Maximum marks for each subject." },
    ],
    example: {
      title: "Example: 5 subjects with different maximums",
      inputs: { Subjects: "5", "Subject 1": "78/100", "Subject 2": "85/100", "Subject 3": "92/100", "Subject 4": "70/100", "Subject 5": "88/100" },
      steps: [
        "Total obtained = 78 + 85 + 92 + 70 + 88 = 413",
        "Total maximum = 100 × 5 = 500",
        "Percentage = 413 / 500 × 100 = 82.6%",
      ],
      result: "82.6%",
    },
    factors: [
      "Different subjects may have different maximum marks.",
      "The percentage is based on total marks, not per-subject averages.",
      "Some exams have practical and theory components.",
    ],
    edgeCases: [
      "Zero marks result in 0%.",
      "Full marks in all subjects result in 100%.",
      "Marks above the maximum are invalid.",
    ],
    commonMistakes: [
      "Averaging percentages instead of using total marks.",
      "Entering the wrong maximum marks.",
    ],
    assumptions: [
      "All subjects are equally weighted by their maximum marks.",
      "No negative marking.",
    ],
    limitations: [
      "Does not account for grade boundaries or normalization.",
      "Some exams have different weightage for sections.",
    ],
    faqs: [
      {
        question: "How is exam percentage different from CGPA?",
        answer:
          "Exam percentage is based on actual marks obtained. CGPA is based on grade points, which may not directly correspond to marks. The conversion between them varies by institution.",
      },
    ],
  },

  relatedCalculators: ["marks-percentage", "percentage", "grade", "final-grade"],

  seo: {
    title: "Exam Percentage Calculator – Calculate Your Exam Score",
    description:
      "Calculate your exam percentage from marks across multiple subjects. Handles different maximum marks. Free, instant and accurate.",
    keywords: ["exam percentage calculator", "exam marks percentage", "board exam percentage"],
    primaryIntent: "Calculate exam percentage from marks",
    secondaryIntents: ["Board exam percentage", "Multiple subject percentage"],
  },
};