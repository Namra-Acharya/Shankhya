/**
 * Time Duration Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatDuration } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const timeDurationCalculator: CalculatorDefinition = {
  id: "time-duration",
  slug: "time-duration-calculator",
  name: "Time Duration Calculator",
  category: "date-time",
  shortDescription: "Calculate the duration between two times.",
  icon: "clock",
  accent: "date-time",
  popularity: 83,

  inputs: [
    {
      id: "startTime",
      label: "Start time",
      type: "time",
      hint: "When the period begins.",
      example: "e.g. 09:00",
      defaultValue: "09:00",
      validation: { required: true },
    },
    {
      id: "endTime",
      label: "End time",
      type: "time",
      hint: "When the period ends.",
      example: "e.g. 17:30",
      defaultValue: "17:30",
      validation: { required: true },
    },
    {
      id: "crossesMidnight",
      label: "Crosses midnight?",
      type: "checkbox",
      defaultValue: false,
      hint: "Check if the end time is on the next day.",
    },
  ],

  calculate: (values) => {
    const startStr = String(values.startTime ?? "09:00");
    const endStr = String(values.endTime ?? "17:30");
    const crossesMidnight = Boolean(values.crossesMidnight);

    const [sh, sm] = startStr.split(":").map(Number);
    const [eh, em] = endStr.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    if (crossesMidnight) {
      endMinutes += 24 * 60;
    }

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "duration",
              label: "TIME DURATION",
              value: `${hours} hours ${minutes} minutes`,
              format: "text",
              primary: true,
              description: `from ${startStr} to ${endStr}${crossesMidnight ? " (next day)" : ""}`,
            },
          ],
        },
        {
          id: "details",
          title: "Duration details",
          values: [
            { id: "minutes", label: "Total minutes", value: String(durationMinutes), format: "text" },
            { id: "hours", label: "Total hours", value: (durationMinutes / 60).toFixed(2), format: "text" },
          ],
        },
      ],
      interpretation: `The duration from ${startStr} to ${endStr}${crossesMidnight ? " (next day)" : ""} is ${hours} hours and ${minutes} minutes.`,
    };
  },

  content: {
    summary:
      "The Time Duration Calculator finds the exact duration between two times. It handles periods that cross midnight.",
    howToUse: [
      "Enter the start time.",
      "Enter the end time.",
      "Check 'crosses midnight' if the end time is on the next day.",
      "Press Calculate to see the duration.",
    ],
    interpretation:
      "The duration is the difference between the two times. If the end time is earlier than the start time, the calculator assumes it crosses midnight unless you specify otherwise.",
    formula: "Duration = End Time − Start Time\n\nIf negative, add 24 hours",
    variables: [
      { symbol: "Start", name: "Start time", description: "When the period begins." },
      { symbol: "End", name: "End time", description: "When the period ends." },
    ],
    example: {
      title: "Example: 09:00 to 17:30",
      inputs: { "Start time": "09:00", "End time": "17:30" },
      steps: [
        "Start = 9 × 60 = 540 minutes",
        "End = 17 × 60 + 30 = 1050 minutes",
        "Duration = 1050 − 540 = 510 minutes",
        "= 8 hours 30 minutes",
      ],
      result: "8 hours 30 minutes",
    },
    factors: [
      "Times are in 24-hour format.",
      "Crossing midnight adds 24 hours to the end time.",
    ],
    edgeCases: [
      "Same times result in 0 duration.",
      "End before start without midnight flag is treated as same-day.",
    ],
    commonMistakes: [
      "Forgetting to check 'crosses midnight' for overnight shifts.",
      "Using 12-hour format without AM/PM.",
    ],
    assumptions: [
      "Times are in 24-hour format.",
      "The duration is always positive.",
    ],
    limitations: [
      "Does not account for time zones.",
      "Does not handle seconds.",
    ],
    faqs: [
      {
        question: "What does 'crosses midnight' mean?",
        answer:
          "It means the end time is on the next day. For example, a shift from 22:00 to 06:00 crosses midnight. Check the box to add 24 hours to the end time.",
      },
    ],
  },

  relatedCalculators: ["date", "date-difference", "business-days", "days-between-dates"],

  seo: {
    title: "Time Duration Calculator – Calculate Time Between Times",
    description:
      "Calculate the duration between two times. Handles overnight periods. Free, instant and accurate.",
    keywords: ["time duration calculator", "time between times", "hours calculator"],
    primaryIntent: "Calculate duration between two times",
    secondaryIntents: ["Hours between times", "Overnight duration"],
  },
};