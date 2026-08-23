/**
 * Attendance Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, formatPercentage } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const attendanceCalculator: CalculatorDefinition = {
  id: "attendance",
  slug: "attendance-calculator",
  name: "Attendance Calculator",
  category: "education",
  shortDescription: "Calculate your attendance percentage and classes needed.",
  icon: "calendar-check",
  accent: "education",
  popularity: 91,

  inputs: [
    {
      id: "classesAttended",
      label: "Classes attended",
      type: "number",
      placeholder: "42",
      hint: "How many classes you have attended.",
      example: "e.g. 42",
      defaultValue: 42,
      validation: { required: true, min: 0 },
    },
    {
      id: "totalClasses",
      label: "Total classes",
      type: "number",
      placeholder: "50",
      hint: "The total number of classes held.",
      example: "e.g. 50",
      defaultValue: 50,
      validation: { required: true, min: 1 },
    },
    {
      id: "requiredPct",
      label: "Required attendance",
      type: "percentage",
      unit: "%",
      placeholder: "75",
      hint: "The minimum attendance required.",
      example: "e.g. 75%",
      defaultValue: 75,
      validation: { required: true, min: 1, max: 100 },
    },
  ],

  calculate: (values) => {
    const attended = parseNumber(values.classesAttended) ?? 0;
    const total = parseNumber(values.totalClasses) ?? 0;
    const requiredPct = parseNumber(values.requiredPct) ?? 75;

    const currentPct = total > 0 ? (attended / total) * 100 : 0;
    const isMeeting = currentPct >= requiredPct;

    // Calculate classes needed to reach required percentage
    // (attended + x) / (total + x) >= requiredPct/100
    // attended + x >= (requiredPct/100)(total + x)
    // attended + x >= (requiredPct/100)total + (requiredPct/100)x
    // x(1 - requiredPct/100) >= (requiredPct/100)total - attended
    const r = requiredPct / 100;
    const classesNeeded = r < 1
      ? Math.max(0, Math.ceil((r * total - attended) / (1 - r)))
      : 0;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "attendance",
              label: "CURRENT ATTENDANCE",
              value: formatPercentage(currentPct, 1),
              format: "percentage",
              primary: true,
              description: `${formatNumber(attended, 0)} out of ${formatNumber(total, 0)} classes`,
            },
          ],
        },
        {
          id: "status",
          title: "Attendance status",
          values: [
            {
              id: "status",
              label: "Status",
              value: isMeeting ? "Meeting requirement" : "Below requirement",
              format: "text",
            },
            {
              id: "classesNeeded",
              label: "Classes needed to reach target",
              value: formatNumber(classesNeeded, 0),
              format: "number",
              description: `to reach ${formatPercentage(requiredPct, 0)}`,
            },
          ],
        },
      ],
      chart: {
        type: "comparison",
        title: "Current attendance vs target",
        data: [
          {
            label: "Current",
            value: Math.min(Math.max(currentPct, 0), 100),
            secondaryValue: requiredPct,
            color: "var(--accent)",
          },
        ],
      },
      interpretation: `Your current attendance is ${formatPercentage(currentPct, 1)}. You need ${formatNumber(classesNeeded, 0)} more consecutive classes to reach the required ${formatPercentage(requiredPct, 0)}.`,
    };
  },

  content: {
    summary:
      "The Attendance Calculator shows your current attendance percentage and how many more classes you need to attend to meet the required threshold.",
    howToUse: [
      "Enter the number of classes you have attended.",
      "Enter the total number of classes held.",
      "Enter the required attendance percentage.",
      "Press Calculate to see your status.",
    ],
    interpretation:
      "The current attendance is your attended classes divided by total classes. The classes needed shows how many consecutive classes you must attend to reach the required percentage.",
    formula: "Attendance % = (Attended / Total) × 100\n\nClasses needed = ceil((R × Total − Attended) / (1 − R))\nwhere R = required % / 100",
    variables: [
      { symbol: "A", name: "Attended", description: "Classes you have attended." },
      { symbol: "T", name: "Total", description: "Total classes held." },
      { symbol: "R", name: "Required", description: "Required attendance as a decimal." },
    ],
    example: {
      title: "Example: 42 attended out of 50, need 75%",
      inputs: { Attended: "42", Total: "50", Required: "75%" },
      steps: [
        "Current = 42 / 50 × 100 = 84%",
        "Already meeting the 75% requirement",
      ],
      result: "84% - Meeting requirement",
    },
    factors: [
      "The required attendance percentage varies by institution.",
      "Some institutions have different requirements for different courses.",
      "Attendance is often calculated per subject.",
    ],
    edgeCases: [
      "Zero attendance results in 0%.",
      "Perfect attendance results in 100%.",
      "If already meeting the requirement, classes needed is 0.",
    ],
    commonMistakes: [
      "Not accounting for future classes in the calculation.",
      "Using the wrong required percentage.",
    ],
    assumptions: [
      "All classes are equally weighted.",
      "The required percentage is constant.",
    ],
    limitations: [
      "Does not account for excused absences.",
      "Some institutions have different attendance policies.",
    ],
    faqs: [
      {
        question: "What is the minimum attendance required in most colleges?",
        answer:
          "Most Indian colleges require 75% attendance to be eligible for exams. However, this varies by institution and course.",
      },
    ],
  },

  relatedCalculators: ["marks-percentage", "exam-percentage", "percentage", "grade"],

  seo: {
    title: "Attendance Calculator – Check Your Attendance %",
    description:
      "Calculate your attendance percentage and see how many classes you need to attend to meet the requirement. Free, instant and accurate.",
    keywords: ["attendance calculator", "attendance percentage", "classes needed"],
    primaryIntent: "Calculate attendance percentage",
    secondaryIntents: ["Classes needed for 75%", "Attendance requirement check"],
  },
};