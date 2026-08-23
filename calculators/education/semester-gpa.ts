/**
 * Semester GPA Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const semesterGpaCalculator: CalculatorDefinition = {
  id: "semester-gpa",
  slug: "semester-gpa-calculator",
  name: "Semester GPA Calculator",
  category: "education",
  shortDescription: "Calculate your GPA for a single semester.",
  icon: "book-marked",
  accent: "education",
  popularity: 89,

  inputs: [
    {
      id: "numCourses",
      label: "Number of courses",
      type: "number",
      placeholder: "5",
      hint: "How many courses this semester.",
      example: "e.g. 5 courses",
      defaultValue: 5,
      validation: { required: true, min: 1, max: 20 },
    },
    {
      id: "scale",
      label: "GPA scale",
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
      hint: "The grade point for each course.",
      example: "e.g. 9 on a 10-point scale",
      defaultValue: 9,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numCourses",
        rowLabel: "Course",
        startIndex: 1,
      },
    },
    {
      id: "credits",
      label: "Credits",
      type: "decimal",
      placeholder: "4",
      hint: "The credit hours for each course.",
      example: "e.g. 4 credits",
      defaultValue: 4,
      validation: { required: true, min: 0 },
      repeat: {
        countInputId: "numCourses",
        rowLabel: "Course",
        startIndex: 1,
      },
    },
  ],

  calculate: (values) => {
    const numCourses = Math.min(Math.max(parseNumber(values.numCourses) ?? 5, 1), 20);
    const scale = parseNumber(values.scale) ?? 10;

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
              label: "SEMESTER GPA",
              value: formatNumber(gpa, 2),
              format: "number",
              primary: true,
              description: `on a ${scale}-point scale`,
            },
          ],
        },
        {
          id: "details",
          title: "Semester details",
          values: [
            { id: "points", label: "Total grade points", value: formatNumber(totalPoints, 1), format: "number" },
            { id: "credits", label: "Total credits", value: formatNumber(totalCredits, 1), format: "number" },
          ],
        },
      ],
      interpretation: `Your semester GPA is ${formatNumber(gpa, 2)} on a ${scale}-point scale, based on ${formatNumber(totalCredits, 1)} total credits.`,
    };
  },

  content: {
    summary:
      "The Semester GPA Calculator computes your Grade Point Average for a single semester using course grades and credit hours.",
    howToUse: [
      "Enter the number of courses this semester.",
      "Select your GPA scale.",
      "Enter the grade point and credits for each course.",
      "Press Calculate to see your semester GPA.",
    ],
    interpretation:
      "Semester GPA is the credit-weighted average of your grades for one semester. It is used to track academic performance term by term.",
    formula: "GPA = Σ(Grade × Credits) / Σ(Credits)",
    variables: [
      { symbol: "Grade", name: "Grade point", description: "Grade point for each course." },
      { symbol: "Credits", name: "Credits", description: "Credit hours for each course." },
    ],
    example: {
      title: "Example: 5 courses in a semester",
      inputs: { Courses: "5", "Course 1": "9 (4 cr)", "Course 2": "8 (3 cr)", "Course 3": "10 (4 cr)", "Course 4": "7 (3 cr)", "Course 5": "9 (2 cr)" },
      steps: [
        "Points = (9×4) + (8×3) + (10×4) + (7×3) + (9×2) = 36 + 24 + 40 + 21 + 18 = 139",
        "Credits = 4 + 3 + 4 + 3 + 2 = 16",
        "GPA = 139 / 16 = 8.69",
      ],
      result: "Semester GPA = 8.69",
    },
    factors: [
      "Credit hours determine course weight.",
      "Higher grades in high-credit courses boost GPA more.",
      "The scale determines the maximum GPA.",
    ],
    edgeCases: [
      "Zero credits result in undefined GPA.",
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
      "Some institutions round GPA differently.",
    ],
    faqs: [
      {
        question: "What is the difference between semester GPA and CGPA?",
        answer:
          "Semester GPA is for one term. CGPA is the cumulative average across all semesters. CGPA is typically the weighted average of all semester GPAs.",
      },
    ],
  },

  relatedCalculators: ["gpa", "cgpa", "weighted-grade", "final-grade"],

  seo: {
    title: "Semester GPA Calculator – Calculate Your Term GPA",
    description:
      "Calculate your semester GPA from course grades and credits. Supports 10-point and 4-point scales. Free, instant and accurate.",
    keywords: ["semester gpa calculator", "term gpa", "semester grade point average"],
    primaryIntent: "Calculate semester GPA",
    secondaryIntents: ["Term GPA calculation", "Credit-weighted semester GPA"],
  },
};