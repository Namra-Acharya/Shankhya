/**
 * Business Days Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { countBusinessDays, diffInDays } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const businessDaysCalculator: CalculatorDefinition = {
  id: "business-days",
  slug: "business-days-calculator",
  name: "Business Days Calculator",
  category: "date-time",
  shortDescription: "Count working days (Mon-Fri) between two dates.",
  icon: "briefcase",
  accent: "date-time",
  popularity: 80,

  inputs: [
    {
      id: "startDate",
      label: "Start date",
      type: "date",
      hint: "The first date.",
      example: "e.g. Jan 1, 2024",
      defaultValue: "2024-01-01",
      validation: { required: true },
    },
    {
      id: "endDate",
      label: "End date",
      type: "date",
      hint: "The second date.",
      example: "e.g. Jan 31, 2024",
      defaultValue: "2024-01-31",
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const start = parseDate(values.startDate) ?? new Date();
    const end = parseDate(values.endDate) ?? new Date();

    const businessDays = countBusinessDays(start, end);
    const totalDays = diffInDays(start, end);
    const weekendDays = Math.max(0, totalDays + 1 - businessDays);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "businessDays",
              label: "BUSINESS DAYS",
              value: formatNumber(businessDays, 0),
              format: "number",
              primary: true,
              description: `from ${formatDate(start)} to ${formatDate(end)}`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Day breakdown",
          values: [
            { id: "total", label: "Total days", value: formatNumber(totalDays + 1, 0), format: "number" },
            { id: "weekend", label: "Weekend days", value: formatNumber(weekendDays, 0), format: "number" },
          ],
        },
      ],
      interpretation: `There are ${formatNumber(businessDays, 0)} business days (Monday-Friday) between ${formatDate(start)} and ${formatDate(end)}, including both dates.`,
    };
  },

  content: {
    summary:
      "The Business Days Calculator counts the number of working days (Monday-Friday) between two dates. It excludes weekends.",
    howToUse: [
      "Enter the start date.",
      "Enter the end date.",
      "Press Calculate to see the number of business days.",
    ],
    interpretation:
      "Business days are Monday through Friday. The count includes both the start and end dates. Weekends are excluded.",
    formula: "Business Days = Count of Mon-Fri between start and end (inclusive)",
    variables: [
      { symbol: "Start", name: "Start date", description: "The first date." },
      { symbol: "End", name: "End date", description: "The second date." },
    ],
    example: {
      title: "Example: Jan 1 (Mon) to Jan 5 (Fri), 2024",
      inputs: { "Start date": "Jan 1, 2024", "End date": "Jan 5, 2024" },
      steps: [
        "Jan 1 (Mon) - business day",
        "Jan 2 (Tue) - business day",
        "Jan 3 (Wed) - business day",
        "Jan 4 (Thu) - business day",
        "Jan 5 (Fri) - business day",
        "Total = 5 business days",
      ],
      result: "5 business days",
    },
    factors: [
      "Weekends (Sat, Sun) are excluded.",
      "Public holidays are not excluded.",
      "Both start and end dates are included.",
    ],
    edgeCases: [
      "Same date on a weekday = 1 business day.",
      "Same date on a weekend = 0 business days.",
      "A full week = 5 business days.",
    ],
    commonMistakes: [
      "Forgetting that public holidays are not excluded.",
      "Not including both start and end dates.",
    ],
    assumptions: [
      "Business days are Monday through Friday.",
      "No public holidays are excluded.",
    ],
    limitations: [
      "Does not account for public holidays.",
      "Different countries have different holidays.",
    ],
    faqs: [
      {
        question: "Are public holidays excluded?",
        answer:
          "No. This calculator only excludes weekends. To account for public holidays, you would need to subtract them manually based on your country's holiday calendar.",
      },
    ],
  },

  relatedCalculators: ["date-difference", "days-between-dates", "date", "weeks-between-dates"],

  seo: {
    title: "Business Days Calculator – Count Working Days",
    description:
      "Count the number of business days (Monday-Friday) between two dates. Excludes weekends. Free, instant and accurate.",
    keywords: ["business days calculator", "working days calculator", "work days between dates"],
    primaryIntent: "Count business days between dates",
    secondaryIntents: ["Working days calculator", "Weekdays between dates"],
  },
};