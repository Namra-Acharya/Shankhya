/**
 * CGPA Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const cgpaCalculator: CalculatorDefinition = {
  id: "cgpa",
  slug: "cgpa-calculator",
  name: "CGPA Calculator",
  category: "education",
  shortDescription: "Calculate your CGPA from semester grade points.",
  icon: "graduation-cap",
  accent: "education",
  featured: true,
  popularity: 97,

  inputs: [
    {
      id: "numSubjects",
      label: "Number of subjects",
      type: "number",
      placeholder: "5",
      hint: "How many subjects you have.",
      example: "e.g. 5 subjects",
      defaultValue: 5,
      validation: { required: true, min: 1, max: 20 },
    },
    {
      id: "maxGrade",
      label: "Maximum grade point",
      type: "dropdown",
      defaultValue: "10",
      options: [
        { label: "10-point scale", value: "10" },
        { label: "4-point scale", value: "4" },
      ],
    },
    {
      id: "grade",
      label: "Grade point",
      type: "decimal",
      placeholder: "9",
      hint: "The grade point for each subject.",
      example: "e.g. 9 on a 10-point scale",
      defaultValue: 9,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numSubjects",
        rowLabel: "Subject",
        startIndex: 1,
      },
    },
  ],

  calculate: (values) => {
    const numSubjects = Math.min(Math.max(parseNumber(values.numSubjects) ?? 5, 1), 20);
    const maxGrade = parseNumber(values.maxGrade) ?? 10;

    // Collect grade points from dynamic inputs
    const gradePoints: number[] = [];
    for (let i = 1; i <= numSubjects; i++) {
      const gp = parseNumber(values[`grade${i}`]);
      if (gp !== null) gradePoints.push(gp);
    }

    const totalPoints = gradePoints.reduce((sum, gp) => sum + gp, 0);
    const cgpa = gradePoints.length > 0 ? totalPoints / gradePoints.length : 0;
    const percentage = maxGrade === 10 ? cgpa * 9.5 : cgpa * 25;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "cgpa",
              label: "YOUR CGPA",
              value: formatNumber(cgpa, 2),
              format: "number",
              primary: true,
              description: `on a ${maxGrade}-point scale`,
            },
          ],
        },
        {
          id: "conversion",
          title: "Conversion",
          values: [
            {
              id: "percentage",
              label: "Approximate percentage",
              value: formatPercentage(percentage, 1),
              format: "percentage",
              description: maxGrade === 10 ? "using the common ×9.5 conversion" : "using the ×25 conversion",
            },
          ],
        },
      ],
      interpretation: `Your CGPA is ${formatNumber(cgpa, 2)} on a ${maxGrade}-point scale. This approximately converts to ${formatPercentage(percentage, 1)}.`,
    };
  },

  content: {
    summary:
      "The CGPA Calculator computes your Cumulative Grade Point Average from your subject grade points. It also provides an approximate percentage conversion.",
    howToUse: [
      "Enter the number of subjects.",
      "Select your grading scale (10-point or 4-point).",
      "Enter the grade point for each subject.",
      "Press Calculate to see your CGPA.",
    ],
    interpretation:
      "CGPA is the average of your grade points across all subjects. A higher CGPA indicates better academic performance. The percentage conversion is approximate and varies by institution.",
    formula: "CGPA = Sum of Grade Points / Number of Subjects\n\nPercentage (10-point) ≈ CGPA × 9.5\nPercentage (4-point) ≈ CGPA × 25",
    variables: [
      { symbol: "GP", name: "Grade point", description: "The grade point for each subject." },
      { symbol: "N", name: "Subjects", description: "Total number of subjects." },
    ],
    example: {
      title: "Example: 5 subjects with grade points 9, 8, 10, 7, 9",
      inputs: { Subjects: "5", "Grade points": "9, 8, 10, 7, 9" },
      steps: [
        "Sum = 9 + 8 + 10 + 7 + 9 = 43",
        "CGPA = 43 / 5 = 8.6",
        "Percentage ≈ 8.6 × 9.5 = 81.7%",
      ],
      result: "CGPA = 8.6, Percentage ≈ 81.7%",
    },
    factors: [
      "Each subject's grade point contributes equally (unweighted).",
      "Some institutions use credit-weighted CGPAs.",
      "The conversion factor varies by institution.",
    ],
    edgeCases: [
      "Zero grade points result in a CGPA of 0.",
      "Maximum CGPA equals the scale maximum (10 or 4).",
      "Different institutions may use different conversion formulas.",
    ],
    commonMistakes: [
      "Using credit-weighted averages when credits are not provided.",
      "Assuming the ×9.5 conversion is universal.",
      "Entering percentages instead of grade points.",
    ],
    assumptions: [
      "All subjects have equal weight.",
      "Grade points are on the selected scale.",
    ],
    limitations: [
      "The percentage conversion is approximate.",
      "Credit-weighted CGPAs require additional information.",
      "Different universities may calculate CGPA differently.",
    ],
    faqs: [
      {
        question: "What is CGPA?",
        answer:
          "CGPA stands for Cumulative Grade Point Average. It is the average of grade points obtained in all subjects, typically on a 10-point or 4-point scale.",
      },
      {
        question: "How do I convert CGPA to percentage?",
        answer:
          "A common conversion for the 10-point scale is CGPA × 9.5. For the 4-point scale, a common conversion is CGPA × 25. However, the exact formula varies by institution.",
      },
      {
        question: "What is a good CGPA?",
        answer:
          "On a 10-point scale, a CGPA of 8.5+ is generally considered excellent, 7.5-8.5 is good, and 6.5-7.5 is average. On a 4-point scale, 3.5+ is excellent.",
      },
    ],
  },

  relatedCalculators: ["gpa", "grade", "semester-gpa", "weighted-grade"],

  seo: {
    title: "CGPA Calculator – Calculate Your CGPA & Percentage",
    description:
      "Calculate your CGPA from subject grade points. Get approximate percentage conversion. Free, instant and accurate for 10-point and 4-point scales.",
    keywords: ["cgpa calculator", "cgpa to percentage", "calculate cgpa", "grade point average"],
    primaryIntent: "Calculate CGPA from grade points",
    secondaryIntents: ["CGPA to percentage", "Semester CGPA calculation"],
  },
};