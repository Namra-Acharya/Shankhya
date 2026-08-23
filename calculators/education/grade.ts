/**
 * Grade Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const gradeCalculator: CalculatorDefinition = {
  id: "grade",
  slug: "grade-calculator",
  name: "Grade Calculator",
  category: "education",
  shortDescription: "Calculate your letter grade from percentage or points.",
  icon: "award",
  accent: "education",
  popularity: 94,

  inputs: [
    {
      id: "score",
      label: "Your score",
      type: "number",
      placeholder: "85",
      hint: "The marks or points you received.",
      example: "e.g. 85",
      defaultValue: 85,
      validation: { required: true, min: 0 },
    },
    {
      id: "total",
      label: "Total possible",
      type: "number",
      placeholder: "100",
      hint: "The maximum possible score.",
      example: "e.g. 100",
      defaultValue: 100,
      validation: { required: true, min: 1 },
    },
    {
      id: "scale",
      label: "Grading scale",
      type: "dropdown",
      defaultValue: "standard",
      options: [
        { label: "Standard (A-F)", value: "standard" },
        { label: "10-point (India)", value: "india10" },
        { label: "4-point GPA", value: "gpa4" },
      ],
    },
  ],

  calculate: (values) => {
    const score = parseNumber(values.score) ?? 0;
    const total = parseNumber(values.total) ?? 100;
    const scale = String(values.scale ?? "standard");

    const percentage = total > 0 ? (score / total) * 100 : 0;

    let letterGrade: string;
    let gradePoint: number;

    if (scale === "india10") {
      if (percentage >= 90) { letterGrade = "A+"; gradePoint = 10; }
      else if (percentage >= 80) { letterGrade = "A"; gradePoint = 9; }
      else if (percentage >= 70) { letterGrade = "B+"; gradePoint = 8; }
      else if (percentage >= 60) { letterGrade = "B"; gradePoint = 7; }
      else if (percentage >= 50) { letterGrade = "C+"; gradePoint = 6; }
      else if (percentage >= 40) { letterGrade = "C"; gradePoint = 5; }
      else if (percentage >= 33) { letterGrade = "D"; gradePoint = 4; }
      else { letterGrade = "F"; gradePoint = 0; }
    } else if (scale === "gpa4") {
      if (percentage >= 90) { letterGrade = "A"; gradePoint = 4.0; }
      else if (percentage >= 80) { letterGrade = "B"; gradePoint = 3.0; }
      else if (percentage >= 70) { letterGrade = "C"; gradePoint = 2.0; }
      else if (percentage >= 60) { letterGrade = "D"; gradePoint = 1.0; }
      else { letterGrade = "F"; gradePoint = 0; }
    } else {
      if (percentage >= 90) { letterGrade = "A"; gradePoint = 4.0; }
      else if (percentage >= 80) { letterGrade = "B"; gradePoint = 3.0; }
      else if (percentage >= 70) { letterGrade = "C"; gradePoint = 2.0; }
      else if (percentage >= 60) { letterGrade = "D"; gradePoint = 1.0; }
      else { letterGrade = "F"; gradePoint = 0; }
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "grade",
              label: "YOUR GRADE",
              value: letterGrade,
              format: "text",
              primary: true,
              description: `${formatPercentage(percentage, 1)} (${formatNumber(score, 0)} out of ${formatNumber(total, 0)})`,
            },
          ],
        },
        {
          id: "details",
          title: "Grade details",
          values: [
            { id: "percentage", label: "Percentage", value: formatPercentage(percentage, 1), format: "percentage" },
            { id: "gradePoint", label: "Grade point", value: formatNumber(gradePoint, 1), format: "number" },
          ],
        },
      ],
      interpretation: `Your score of ${formatNumber(score, 0)} out of ${formatNumber(total, 0)} is ${formatPercentage(percentage, 1)}, which corresponds to a ${letterGrade} grade.`,
    };
  },

  content: {
    summary:
      "The Grade Calculator converts your score into a letter grade and grade point. It supports standard A-F, Indian 10-point, and 4-point GPA scales.",
    howToUse: [
      "Enter your score.",
      "Enter the total possible score.",
      "Select your grading scale.",
      "Press Calculate to see your letter grade.",
    ],
    interpretation:
      "The letter grade is determined by your percentage. Different institutions may use slightly different grade boundaries.",
    formula: "Percentage = Score / Total × 100\n\nGrade determined by percentage thresholds",
    variables: [
      { symbol: "Score", name: "Your score", description: "The marks or points you received." },
      { symbol: "Total", name: "Total possible", description: "The maximum possible score." },
    ],
    example: {
      title: "Example: 85 out of 100",
      inputs: { Score: "85", Total: "100", Scale: "Standard" },
      steps: [
        "Percentage = 85 / 100 × 100 = 85%",
        "85% ≥ 80% → Grade B",
      ],
      result: "Grade B",
    },
    factors: [
      "Grade boundaries vary by institution.",
      "Some institutions use plus/minus grades.",
      "The grading scale determines the letter grade.",
    ],
    edgeCases: [
      "A score of 0 results in an F grade.",
      "A perfect score results in the highest grade.",
      "Scores above the total are invalid.",
    ],
    commonMistakes: [
      "Using the wrong grading scale.",
      "Entering percentage directly instead of score and total.",
    ],
    assumptions: [
      "The grading scale is correctly selected.",
      "Grade boundaries follow common standards.",
    ],
    limitations: [
      "Grade boundaries may differ from your institution's policy.",
      "Some institutions use different letter grade systems.",
    ],
    faqs: [
      {
        question: "What percentage is an A grade?",
        answer:
          "In most standard systems, 90% and above is an A. Some institutions use 93%+ for A and 90-92% for A-. Check your institution's specific policy.",
      },
      {
        question: "What is a passing grade?",
        answer:
          "In most systems, a D (60%) or above is passing. In India, the passing mark is often 33-40% depending on the board or university.",
      },
    ],
  },

  relatedCalculators: ["marks-percentage", "exam-percentage", "final-grade", "weighted-grade"],

  seo: {
    title: "Grade Calculator – Convert Score to Letter Grade",
    description:
      "Convert your score to a letter grade and grade point. Supports standard, Indian 10-point and 4-point GPA scales. Free and instant.",
    keywords: ["grade calculator", "letter grade calculator", "score to grade"],
    primaryIntent: "Convert score to letter grade",
    secondaryIntents: ["Grade from percentage", "Grade point calculation"],
  },
};