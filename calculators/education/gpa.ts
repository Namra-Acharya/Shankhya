/**
 * GPA Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const gpaCalculator: CalculatorDefinition = {
  id: "gpa",
  slug: "gpa-calculator",
  name: "GPA Calculator",
  category: "education",
  shortDescription: "Calculate your GPA from course grades and credit hours.",
  icon: "book-open",
  accent: "education",
  popularity: 96,

  inputs: [
    {
      id: "numCourses",
      label: "Number of courses",
      type: "number",
      placeholder: "4",
      hint: "How many courses you have.",
      example: "e.g. 4 courses",
      defaultValue: 4,
      validation: { required: true, min: 1, max: 20 },
    },
    {
      id: "scale",
      label: "GPA scale",
      type: "dropdown",
      defaultValue: "4",
      options: [
        { label: "4.0 scale", value: "4" },
        { label: "5.0 scale", value: "5" },
        { label: "10.0 scale", value: "10" },
      ],
    },
    {
      id: "grade",
      label: "Grade point",
      type: "decimal",
      placeholder: "3.5",
      hint: "The grade point for each course.",
      example: "e.g. 3.5 on a 4.0 scale",
      defaultValue: 3.5,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numCourses",
        rowLabel: "Course",
        startIndex: 1,
      },
    },
    {
      id: "credits",
      label: "Credit hours",
      type: "decimal",
      placeholder: "3",
      hint: "The credit weight of each course.",
      example: "e.g. 3 credits",
      defaultValue: 3,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numCourses",
        rowLabel: "Course",
        startIndex: 1,
      },
    },
  ],

  calculate: (values) => {
    const numCourses = Math.min(Math.max(parseNumber(values.numCourses) ?? 4, 1), 20);
    const scale = parseNumber(values.scale) ?? 4;

    let totalPoints = 0;
    let totalCredits = 0;

    for (let i = 1; i <= numCourses; i++) {
      const grade = parseNumber(values[`grade${i}`]);
      const credits = parseNumber(values[`credits${i}`]);
      if (grade !== null && credits !== null) {
        totalPoints += grade * credits;
        totalCredits += credits;
      }
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "gpa",
              label: "YOUR GPA",
              value: formatNumber(gpa, 2),
              format: "number",
              primary: true,
              description: `on a ${scale}.0 scale`,
            },
          ],
        },
        {
          id: "details",
          title: "Calculation details",
          values: [
            { id: "totalPoints", label: "Total grade points", value: formatNumber(totalPoints, 1), format: "number" },
            { id: "totalCredits", label: "Total credits", value: formatNumber(totalCredits, 1), format: "number" },
          ],
        },
      ],
      interpretation: `Your GPA is ${formatNumber(gpa, 2)} on a ${scale}.0 scale, calculated from ${formatNumber(totalCredits, 1)} total credit hours.`,
    };
  },

  content: {
    summary:
      "The GPA Calculator computes your Grade Point Average using course grades and credit hours. It supports 4.0, 5.0 and 10.0 scales.",
    howToUse: [
      "Enter the number of courses.",
      "Select your GPA scale.",
      "Enter the grade point and credit hours for each course.",
      "Press Calculate to see your GPA.",
    ],
    interpretation:
      "GPA is a credit-weighted average of your grades. Courses with more credits have a greater impact on your GPA.",
    formula: "GPA = Σ(Grade × Credits) / Σ(Credits)",
    variables: [
      { symbol: "Grade", name: "Grade point", description: "The grade point for each course." },
      { symbol: "Credits", name: "Credit hours", description: "The credit weight of each course." },
    ],
    example: {
      title: "Example: 4 courses with grades and credits",
      inputs: { Courses: "4", "Course 1": "A (4.0, 3 cr)", "Course 2": "B (3.0, 4 cr)", "Course 3": "A (4.0, 3 cr)", "Course 4": "B+ (3.3, 3 cr)" },
      steps: [
        "Total points = (4.0×3) + (3.0×4) + (4.0×3) + (3.3×3) = 12 + 12 + 12 + 9.9 = 45.9",
        "Total credits = 3 + 4 + 3 + 3 = 13",
        "GPA = 45.9 / 13 = 3.53",
      ],
      result: "GPA = 3.53",
    },
    factors: [
      "Credit hours determine how much each course affects your GPA.",
      "Higher grades in high-credit courses boost GPA more.",
      "The scale determines the maximum possible GPA.",
    ],
    edgeCases: [
      "Zero credits result in an undefined GPA.",
      "Maximum GPA equals the scale maximum.",
    ],
    commonMistakes: [
      "Using unweighted averages instead of credit-weighted.",
      "Entering letter grades instead of grade points.",
    ],
    assumptions: [
      "All grades are on the selected scale.",
      "Credit hours are correctly entered.",
    ],
    limitations: [
      "Different institutions may use different grade point values.",
      "Plus/minus grading may vary by institution.",
    ],
    faqs: [
      {
        question: "What is the difference between GPA and CGPA?",
        answer:
          "GPA typically refers to a single semester or term average. CGPA (Cumulative GPA) is the average across all semesters. Both use the same credit-weighted calculation method.",
      },
      {
        question: "How do I convert letter grades to grade points?",
        answer:
          "On a 4.0 scale: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, F=0.0. Values may vary slightly by institution.",
      },
    ],
  },

  relatedCalculators: ["cgpa", "semester-gpa", "weighted-grade", "final-grade"],

  seo: {
    title: "GPA Calculator – Calculate Your Grade Point Average",
    description:
      "Calculate your GPA from course grades and credit hours. Supports 4.0, 5.0 and 10.0 scales. Free, instant and accurate.",
    keywords: ["gpa calculator", "grade point average", "calculate gpa", "gpa from grades"],
    primaryIntent: "Calculate GPA from grades and credits",
    secondaryIntents: ["Credit-weighted GPA", "Semester GPA calculation"],
  },
};