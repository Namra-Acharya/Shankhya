/**
 * Months Between Dates Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { diffInDays, diffInMonths, diffInYearsMonthsDays } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const monthsBetweenDatesCalculator: CalculatorDefinition = {
  id: "months-between-dates",
  slug: "months-between-dates-calculator",
  name: "Months Between Dates",
  category: "date-time",
  shortDescription: "Calculate the number of months between two dates.",
  icon: "calendar-clock",
  accent: "date-time",
  popularity: 78,

  inputs: [
    {
      id: "startDate",
      label: "Start date",
      type: "date",
      hint: "The first date.",
      example: "e.g. Jan 15, 2024",
      defaultValue: "2024-01-15",
      validation: { required: true },
    },
    {
      id: "endDate",
      label: "End date",
      type: "date",
      hint: "The second date.",
      example: "e.g. Aug 10, 2024",
      defaultValue: "2024-08-10",
      validation: { required: true },
    },
  ],

  calculate: (values) => {
    const start = parseDate(values.startDate) ?? new Date();
    const end = parseDate(values.endDate) ?? new Date();

    const totalMonths = diffInMonths(start, end);
    const totalDays = diffInDays(start, end);
    const { years, months, days } = diffInYearsMonthsDays(start, end);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "months",
              label: "MONTHS BETWEEN DATES",
              value: formatNumber(totalMonths, 0),
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
      interpretation: `There are ${formatNumber(totalMonths, 0)} complete months between ${formatDate(start)} and ${formatDate(end)}.`,
    };
  },

  content: {
    summary:
      "The Months Between Dates Calculator shows how many complete months are between two dates, along with the total days and the breakdown in years, months and days.",
    howToUse: [
      "Enter the start date.",
      "Enter the end date.",
      "Press Calculate to see the number of months.",
    ],
    interpretation:
      "The result shows the number of complete months between the two dates. The breakdown shows the same difference in years, months and days.",
    formula: "Months = (End Year − Start Year) × 12 + (End Month − Start Month)",
    variables: [
      { symbol: "Start", name: "Start date", description: "The first date." },
      { symbol: "End", name: "End date", description: "The second date." },
    ],
    example: {
      title: "Example: Jan 15 to Aug 10, 2024",
      inputs: { "Start date": "Jan 15, 2024", "End date": "Aug 10, 2024" },
      steps: [
        "Months = (2024 − 2024) × 12 + (7 − 0) = 7",
        "Days remaining = 26 (Aug 15 to Aug 10 is negative, borrow)",
        "Result: 6 months, 26 days",
      ],
      result: "6 months, 26 days",
    },
    factors: [
      "Month lengths vary.",
      "The day of the month affects the count.",
    ],
    edgeCases: [
      "Same dates result in 0 months.",
      "Reversed dates are handled by swapping.",
      "Month-end dates are handled correctly.",
    ],
    commonMistakes: [
      "Counting partial months as complete months.",
      "Not accounting for different month lengths.",
    ],
    assumptions: [
      "Uses the Gregorian calendar.",
      "A month is a calendar month, not 30 days.",
    ],
    limitations: [
      "Does not account for time zones.",
    ],
    faqs: [
      {
        question: "How many months are in a year?",
        answer: "There are 12 months in a year. The number of days in each month varies from 28 to 31.",
      },
    ],
  },

  relatedCalculators: ["date-difference", "days-between-dates", "weeks-between-dates", "date"],

  seo: {
    title: "Months Between Dates – Calculate Months Between Two Dates",
    description:
      "Calculate the number of months between two dates. See total days and the breakdown in years, months and days. Free and instant.",
    keywords: ["months between dates", "months calculator", "months between two dates"],
    primaryIntent: "Calculate months between two dates",
    secondaryIntents: ["Months from date to date", "Month count between dates"],
  },
};