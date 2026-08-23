/**
 * Date Calculator - Add or subtract days from a date
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { addDays, addMonths, addYears, todayISO } from "@/lib/utils/date";
import { formatDate } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const dateCalculator: CalculatorDefinition = {
  id: "date",
  slug: "date-calculator",
  name: "Date Calculator",
  category: "date-time",
  shortDescription: "Add or subtract days, weeks, months or years from any date.",
  icon: "calendar",
  accent: "date-time",
  popularity: 86,

  inputs: [
    {
      id: "startDate",
      label: "Start date",
      type: "date",
      hint: "The date you want to start from.",
      example: "e.g. today",
      defaultValue: todayISO(),
      validation: { required: true },
    },
    {
      id: "operation",
      label: "Operation",
      type: "radio",
      defaultValue: "add",
      options: [
        { label: "Add", value: "add" },
        { label: "Subtract", value: "subtract" },
      ],
    },
    {
      id: "amount",
      label: "Amount",
      type: "number",
      placeholder: "30",
      hint: "How many days, weeks, months or years.",
      example: "e.g. 30",
      defaultValue: 30,
      validation: { required: true, min: 1, max: 10000 },
    },
    {
      id: "unit",
      label: "Unit",
      type: "dropdown",
      defaultValue: "days",
      options: [
        { label: "Days", value: "days" },
        { label: "Weeks", value: "weeks" },
        { label: "Months", value: "months" },
        { label: "Years", value: "years" },
      ],
    },
  ],

  calculate: (values) => {
    const startDate = parseDate(values.startDate) ?? new Date();
    const operation = String(values.operation ?? "add");
    const amount = Number(values.amount) || 0;
    const unit = String(values.unit ?? "days");

    const sign = operation === "subtract" ? -1 : 1;
    let resultDate: Date;

    switch (unit) {
      case "weeks":
        resultDate = addDays(startDate, sign * amount * 7);
        break;
      case "months":
        resultDate = addMonths(startDate, sign * amount);
        break;
      case "years":
        resultDate = addYears(startDate, sign * amount);
        break;
      default:
        resultDate = addDays(startDate, sign * amount);
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "result",
              label: "RESULT DATE",
              value: formatDate(resultDate),
              format: "text",
              primary: true,
              description: `${operation === "add" ? "Adding" : "Subtracting"} ${amount} ${unit} from ${formatDate(startDate)}`,
            },
          ],
        },
        {
          id: "details",
          title: "Date details",
          values: [
            { id: "start", label: "Start date", value: formatDate(startDate), format: "text" },
            { id: "weekday", label: "Day of week", value: resultDate.toLocaleDateString("en-IN", { weekday: "long" }), format: "text" },
          ],
        },
      ],
      interpretation: `${formatDate(startDate)} ${operation === "add" ? "plus" : "minus"} ${amount} ${unit} is ${formatDate(resultDate)}.`,
    };
  },

  content: {
    summary:
      "The Date Calculator adds or subtracts days, weeks, months or years from any date. It handles month-end and leap year edge cases correctly.",
    howToUse: [
      "Select the start date.",
      "Choose whether to add or subtract.",
      "Enter the amount and unit.",
      "Press Calculate to see the result date.",
    ],
    interpretation:
      "The result date is the start date adjusted by the specified amount. Month-end dates are handled correctly (e.g., Jan 31 + 1 month = Feb 28 or 29).",
    formula: "Result = Start Date ± Amount × Unit",
    variables: [
      { symbol: "Start", name: "Start date", description: "The date you begin from." },
      { symbol: "Amount", name: "Amount", description: "How many units to add or subtract." },
      { symbol: "Unit", name: "Unit", description: "Days, weeks, months or years." },
    ],
    example: {
      title: "Example: Jan 31, 2024 + 1 month",
      inputs: { "Start date": "Jan 31, 2024", Operation: "Add", Amount: "1", Unit: "Month" },
      steps: [
        "Jan 31 + 1 month = Feb 31 (doesn't exist)",
        "Clamp to last day of February: Feb 29, 2024 (leap year)",
      ],
      result: "Feb 29, 2024",
    },
    factors: [
      "Month lengths vary, affecting month calculations.",
      "Leap years add an extra day to February.",
      "Adding months to month-end dates clamps to the last valid day.",
    ],
    edgeCases: [
      "Jan 31 + 1 month = Feb 28 or 29 (clamped).",
      "Feb 29 + 1 year = Feb 28 in non-leap years.",
      "Adding 0 days returns the same date.",
    ],
    commonMistakes: [
      "Assuming all months have 30 days.",
      "Not accounting for leap years.",
    ],
    assumptions: [
      "Uses the Gregorian calendar.",
      "Month-end dates are clamped to the last valid day.",
    ],
    limitations: [
      "Does not account for time zones.",
      "Business day calculations are not included.",
    ],
    faqs: [
      {
        question: "What happens when I add a month to January 31?",
        answer:
          "The calculator clamps to the last valid day of the target month. January 31 + 1 month = February 28 (or 29 in a leap year).",
      },
    ],
  },

  relatedCalculators: ["date-difference", "days-between-dates", "business-days", "weeks-between-dates"],

  seo: {
    title: "Date Calculator – Add or Subtract Days, Weeks, Months",
    description:
      "Add or subtract days, weeks, months or years from any date. Handles month-end and leap year edge cases. Free, instant and accurate.",
    keywords: ["date calculator", "add days to date", "subtract days", "date arithmetic"],
    primaryIntent: "Add or subtract time from a date",
    secondaryIntents: ["Days from today", "Date after N days", "Date before N days"],
  },
};