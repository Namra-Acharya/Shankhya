/**
 * Days Between Dates Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { diffInDays, diffInWeeks, diffInMonths, diffInYearsMonthsDays } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const daysBetweenDatesCalculator: CalculatorDefinition = {
  id: "days-between-dates",
  slug: "days-between-dates-calculator",
  name: "Days Between Dates",
  category: "date-time",
  shortDescription: "Count the exact number of days between two dates.",
  icon: "calendar-days",
  accent: "date-time",
  popularity: 84,

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
      example: "e.g. today",
      defaultValue: "2024-12-31",
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const start = parseDate(values.startDate) ?? new Date();
    const end = parseDate(values.endDate) ?? new Date();

    const totalDays = diffInDays(start, end);
    const totalWeeks = diffInWeeks(start, end);
    const totalMonths = diffInMonths(start, end);
    const { years, months, days } = diffInYearsMonthsDays(start, end);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "days",
              label: "DAYS BETWEEN DATES",
              value: formatNumber(totalDays, 0),
              format: "number",
              primary: true,
              description: `from ${formatDate(start)} to ${formatDate(end)}`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Breakdown",
          values: [
            { id: "ymd", label: "Years, months, days", value: `${years}y ${months}m ${days}d`, format: "text" },
            { id: "weeks", label: "Total weeks", value: formatNumber(totalWeeks, 1), format: "number" },
            { id: "months", label: "Total months", value: formatNumber(totalMonths, 0), format: "number" },
          ],
        },
      ],
      interpretation: `There are ${formatNumber(totalDays, 0)} days between ${formatDate(start)} and ${formatDate(end)}.`,
    };
  },

  content: {
    summary:
      "The Days Between Dates Calculator counts the exact number of days between two dates. It also shows the difference in weeks, months, and years/months/days.",
    howToUse: [
      "Enter the start date.",
      "Enter the end date.",
      "Press Calculate to see the number of days.",
    ],
    interpretation:
      "The result is the total number of days between the two dates. The breakdown shows the same difference in different units.",
    formula: "Days = End Date − Start Date",
    variables: [
      { symbol: "Start", name: "Start date", description: "The first date." },
      { symbol: "End", name: "End date", description: "The second date." },
    ],
    example: {
      title: "Example: Jan 1 to Dec 31, 2024",
      inputs: { "Start date": "Jan 1, 2024", "End date": "Dec 31, 2024" },
      steps: [
        "Count days from Jan 1 to Dec 31",
        "Total = 365 days (2024 is a leap year)",
      ],
      result: "365 days",
    },
    factors: [
      "Leap years add an extra day.",
      "Month lengths vary.",
    ],
    edgeCases: [
      "Same dates result in 0 days.",
      "Reversed dates are handled by swapping.",
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
    ],
    faqs: [
      {
        question: "How many days are in a year?",
        answer: "A common year has 365 days. A leap year has 366 days. Leap years occur every 4 years, except for century years not divisible by 400.",
      },
    ],
  },

  relatedCalculators: ["date-difference", "date", "weeks-between-dates", "months-between-dates"],

  seo: {
    title: "Days Between Dates – Count Days Between Two Dates",
    description:
      "Count the exact number of days between two dates. See the difference in weeks, months and years. Free, instant and accurate.",
    keywords: ["days between dates", "days calculator", "count days between dates"],
    primaryIntent: "Count days between two dates",
    secondaryIntents: ["Days from date to date", "Date duration in days"],
  },
};