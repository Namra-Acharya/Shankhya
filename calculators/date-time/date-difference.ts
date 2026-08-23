/**
 * Date Difference Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { diffInDays, diffInMonths, diffInWeeks, diffInYearsMonthsDays } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const dateDifferenceCalculator: CalculatorDefinition = {
  id: "date-difference",
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  category: "date-time",
  shortDescription: "Calculate the difference between two dates in multiple units.",
  icon: "git-compare",
  accent: "date-time",
  popularity: 85,

  inputs: [
    {
      id: "startDate",
      label: "Start date",
      type: "date",
      hint: "The earlier date.",
      example: "e.g. Jan 1, 2024",
      defaultValue: "2024-01-01",
      validation: { required: true },
    },
    {
      id: "endDate",
      label: "End date",
      type: "date",
      hint: "The later date.",
      example: "e.g. today",
      defaultValue: "2024-12-31",
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const start = parseDate(values.startDate) ?? new Date();
    const end = parseDate(values.endDate) ?? new Date();

    const { years, months, days } = diffInYearsMonthsDays(start, end);
    const totalDays = diffInDays(start, end);
    const totalWeeks = diffInWeeks(start, end);
    const totalMonths = diffInMonths(start, end);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "difference",
              label: "DATE DIFFERENCE",
              value: `${years} years, ${months} months, ${days} days`,
              format: "text",
              primary: true,
              description: `from ${formatDate(start)} to ${formatDate(end)}`,
            },
          ],
        },
        {
          id: "totals",
          title: "Total in different units",
          values: [
            { id: "days", label: "Total days", value: formatNumber(totalDays, 0), format: "number" },
            { id: "weeks", label: "Total weeks", value: formatNumber(totalWeeks, 1), format: "number" },
            { id: "months", label: "Total months", value: formatNumber(totalMonths, 0), format: "number" },
          ],
        },
      ],
      interpretation: `The difference between ${formatDate(start)} and ${formatDate(end)} is ${years} years, ${months} months and ${days} days, which is ${formatNumber(totalDays, 0)} total days.`,
    };
  },

  content: {
    summary:
      "The Date Difference Calculator shows the exact difference between two dates in years, months and days, plus the total in days, weeks and months.",
    howToUse: [
      "Enter the start date.",
      "Enter the end date.",
      "Press Calculate to see the difference.",
    ],
    interpretation:
      "The primary result shows the difference broken into years, months and days. The secondary results show the same difference in different units.",
    formula: "Difference = End Date − Start Date\n\nBroken into years, months and days",
    variables: [
      { symbol: "Start", name: "Start date", description: "The earlier date." },
      { symbol: "End", name: "End date", description: "The later date." },
    ],
    example: {
      title: "Example: Jan 1, 2024 to Dec 31, 2024",
      inputs: { "Start date": "Jan 1, 2024", "End date": "Dec 31, 2024" },
      steps: [
        "Years = 0 (same year)",
        "Months = 11 (Jan to Dec)",
        "Days = 30 (Dec 1 to Dec 31)",
        "Total days = 365 (leap year)",
      ],
      result: "11 months, 30 days (365 total days)",
    },
    factors: [
      "Leap years add an extra day.",
      "Month lengths vary.",
      "The order of dates matters for the sign.",
    ],
    edgeCases: [
      "Same dates result in 0 difference.",
      "Reversed dates are handled by swapping.",
      "Leap day (Feb 29) is handled correctly.",
    ],
    commonMistakes: [
      "Counting the start date as a full day.",
      "Not accounting for leap years.",
    ],
    assumptions: [
      "Uses the Gregorian calendar.",
      "The difference is always positive.",
    ],
    limitations: [
      "Does not account for time zones.",
      "Business day differences are not included.",
    ],
    faqs: [
      {
        question: "How is the difference calculated?",
        answer:
          "The calculator counts complete years, then remaining months, then remaining days. It handles month-end and leap year cases correctly.",
      },
    ],
  },

  relatedCalculators: ["days-between-dates", "date", "weeks-between-dates", "months-between-dates"],

  seo: {
    title: "Date Difference Calculator – Days, Weeks, Months Between Dates",
    description:
      "Calculate the exact difference between two dates in years, months, days, weeks and total days. Free, instant and accurate.",
    keywords: ["date difference calculator", "days between dates", "date gap calculator"],
    primaryIntent: "Calculate difference between two dates",
    secondaryIntents: ["Days between dates", "Weeks between dates", "Months between dates"],
  },
};