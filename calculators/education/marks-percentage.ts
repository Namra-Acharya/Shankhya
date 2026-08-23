/**
 * Marks Percentage Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const marksPercentageCalculator: CalculatorDefinition = {
  id: "marks-percentage",
  slug: "marks-percentage-calculator",
  name: "Marks Percentage Calculator",
  category: "education",
  shortDescription: "Convert marks to percentage and understand your score.",
  icon: "clipboard-list",
  accent: "education",
  popularity: 92,

  inputs: [
    {
      id: "numSubjects",
      label: "Number of subjects",
      type: "number",
      placeholder: "1",
      hint: "How many subjects you have.",
      example: "e.g. 1 subject",
      defaultValue: 1,
      validation: { required: true, min: 1, max: 20 },
    },
    {
      id: "marks",
      label: "Marks obtained",
      type: "decimal",
      placeholder: "78",
      hint: "The marks you received in each subject.",
      example: "e.g. 78 out of 100",
      defaultValue: 78,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numSubjects",
        rowLabel: "Subject",
        startIndex: 1,
      },
    },
    {
      id: "total",
      label: "Total marks",
      type: "decimal",
      placeholder: "100",
      hint: "The maximum possible marks for each subject.",
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
    const numSubjects = Math.min(Math.max(parseNumber(values.numSubjects) ?? 1, 1), 20);

    let totalMarks = 0;
    let totalObtained = 0;
    for (let i = 1; i <= numSubjects; i++) {
      const marks = parseNumber(values[`marks${i}`]);
      const total = parseNumber(values[`total${i}`]);
      if (marks !== null && total !== null) {
        totalObtained += marks;
        totalMarks += total;
      }
    }

    const marks = totalObtained;
    const total = totalMarks;
    const percentage = total > 0 ? (marks / total) * 100 : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "percentage",
              label: "YOUR PERCENTAGE",
              value: formatPercentage(percentage, 1),
              format: "percentage",
              primary: true,
              description: `${formatNumber(marks, 0)} out of ${formatNumber(total, 0)} marks`,
            },
          ],
        },
        {
          id: "details",
          title: "Score details",
          values: [
            { id: "marks", label: "Marks obtained", value: formatNumber(marks, 0), format: "number" },
            { id: "total", label: "Total marks", value: formatNumber(total, 0), format: "number" },
          ],
        },
      ],
      interpretation: `You scored ${formatNumber(marks, 0)} out of ${formatNumber(total, 0)}, which is ${formatPercentage(percentage, 1)}.`,
    };
  },

  content: {
    summary:
      "The Marks Percentage Calculator converts your marks into a percentage. It helps you understand your exam or assignment score as a percentage.",
    howToUse: [
      "Enter the marks you obtained.",
      "Enter the total possible marks.",
      "Press Calculate to see your percentage.",
    ],
    interpretation:
      "The percentage shows your score relative to the total. It is calculated by dividing your marks by the total and multiplying by 100.",
    formula: "Percentage = (Marks / Total) × 100",
    variables: [
      { symbol: "M", name: "Marks", description: "The marks you obtained." },
      { symbol: "T", name: "Total", description: "The maximum possible marks." },
    ],
    example: {
      title: "Example: 78 out of 100",
      inputs: { Marks: "78", Total: "100" },
      steps: [
        "Percentage = (78 / 100) × 100",
        "= 0.78 × 100",
        "= 78%",
      ],
      result: "78%",
    },
    factors: [
      "Different exams may have different total marks.",
      "The percentage is relative to the total marks.",
      "Some exams use additional grading criteria.",
    ],
    edgeCases: [
      "Zero marks result in 0%.",
      "Full marks result in 100%.",
      "Marks above the total are invalid.",
    ],
    commonMistakes: [
      "Entering the total incorrectly.",
      "Confusing marks with percentage.",
    ],
    assumptions: [
      "All marks are equally weighted.",
      "The total is correctly entered.",
    ],
    limitations: [
      "Does not account for negative marking or bonus marks.",
      "Some exams have different weightage for sections.",
    ],
    faqs: [
      {
        question: "How do I calculate my exam percentage?",
        answer:
          "Divide the marks you obtained by the total marks and multiply by 100. For example, 78/100 × 100 = 78%.",
      },
    ],
  },

  relatedCalculators: ["percentage", "exam-percentage", "grade", "final-grade"],

  seo: {
    title: "Marks Percentage Calculator – Convert Marks to %",
    description:
      "Convert your marks to percentage instantly. Enter marks obtained and total marks to see your score percentage. Free and accurate.",
    keywords: ["marks percentage calculator", "marks to percentage", "exam percentage"],
    primaryIntent: "Convert marks to percentage",
    secondaryIntents: ["Exam score percentage", "Assignment percentage"],
  },
};