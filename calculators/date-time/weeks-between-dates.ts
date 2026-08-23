/**
 * Weeks Between Dates Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { diffInDays, diffInWeeks, diffInYearsMonthsDays } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const weeksBetweenDatesCalculator: CalculatorDefinition = {
  id: "weeks-between-dates",
  slug: "weeks-between-dates-calculator",
  name: "Weeks Between Dates",
  category: "date-time",
  shortDescription: "Calculate the number of weeks between two dates.",
  icon: "calendar-range",
  accent: "date-time",
  popularity: 79,

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
      example: "e.g. Mar 31, 2024",
      defaultValue: "2024-03-31",
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const start = parseDate(values.startDate) ?? new Date();
    const end = parseDate(values.endDate) ?? new Date();

    const totalWeeks = diffInWeeks(start, end);
    const totalDays = diffInDays(start, end);
    const { years, months, days } = diffInYearsMonthsDays(start, end);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "weeks",
              label: "WEEKS BETWEEN DATES",
              value: formatNumber(totalWeeks, 1),
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
            { id: "days", label: "Total days", value: formatNumber(totalDays, 0), format: "number" },
            { id: "ymd", label: "Years, months, days", value: `${years}y ${months}m ${days}d`, format: "text" },
          ],
        },
      ],
      interpretation: `There are approximately ${formatNumber(totalWeeks, 1)} weeks between ${formatDate(start)} and ${formatDate(end)}.`,
    };
  },

  content: {
    summary:
      "The Weeks Between Dates Calculator shows how many weeks are between two dates, along with the total days and the breakdown in years, months and days.",
    howToUse: [
      "Enter the start date.",
      "Enter the end date.",
      "Press Calculate to see the number of weeks.",
    ],
    interpretation:
      "The result shows the total number of weeks between the two dates. A week is 7 days, so the result may include a fractional part.",
    formula: "Weeks = (End Date − Start Date) / 7",
    variables: [
      { symbol: "Start", name: "Start date", description: "The first date." },
      { symbol: "End", name: "End date", description: "The second date." },
    ],
    example: {
      title: "Example: Jan 1 to Mar 31, 2024",
      inputs: { "Start date": "Jan 1, 2024", "End date": "Mar 31, 2024" },
      steps: [
        "Days = 90 (Jan 31 + Feb 29 + Mar 30)",
        "Weeks = 90 / 7 = 12.86",
      ],
      result: "12.9 weeks",
    },
    factors: [
      "Leap years add an extra day.",
      "Month lengths vary.",
    ],
    edgeCases: [
      "Same dates result in 0 weeks.",
      "Reversed dates are handled by swapping.",
    ],
    commonMistakes: [
      "Rounding weeks to whole numbers when precision is needed.",
    ],
    assumptions: [
      "Uses the Gregorian calendar.",
      "A week is exactly 7 days.",
    ],
    limitations: [
      "Does not account for time zones.",
    ],
    faqs: [
      {
        question: "How many weeks are in a year?",
        answer: "A common year has 52 weeks and 1 day (365 days). A leap year has 52 weeks and 2 days (366 days).",
      },
    ],
  },

  relatedCalculators: ["date-difference", "days-between-dates", "months-between-dates", "date"],

  seo: {
    title: "Weeks Between Dates – Calculate Weeks Between Two Dates",
    description:
      "Calculate the number of weeks between two dates. See total days and the breakdown in years, months and days. Free and instant.",
    keywords: ["weeks between dates", "weeks calculator", "weeks between two dates"],
    primaryIntent: "Calculate weeks between two dates",
    secondaryIntents: ["Weeks from date to date", "Week count between dates"],
  },
};