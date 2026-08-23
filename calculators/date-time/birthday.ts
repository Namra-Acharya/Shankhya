/**
 * Birthday Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { calculateAge, todayISO } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const birthdayCalculator: CalculatorDefinition = {
  id: "birthday",
  slug: "birthday-calculator",
  name: "Birthday Calculator",
  category: "date-time",
  shortDescription: "Find your next birthday, day of week, and age details.",
  icon: "cake",
  accent: "date-time",
  popularity: 82,

  inputs: [
    {
      id: "birthDate",
      label: "Date of birth",
      type: "date",
      hint: "The day you were born.",
      example: "e.g. 15 March 1995",
      defaultValue: "1995-03-15",
      validation: { required: true, maxDate: todayISO() },
    },
  ],

  calculate: (values) => {
    const birthDate = parseDate(values.birthDate) ?? new Date();
    const age = calculateAge(birthDate, new Date());

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "nextBirthday",
              label: "NEXT BIRTHDAY",
              value: formatDate(age.nextBirthday),
              format: "text",
              primary: true,
              description: `in ${formatNumber(age.daysUntilNextBirthday, 0)} days`,
            },
          ],
        },
        {
          id: "details",
          title: "Birthday details",
          values: [
            { id: "age", label: "Current age", value: `${age.years} years, ${age.months} months, ${age.days} days`, format: "text" },
            { id: "weekday", label: "Born on a", value: age.dayOfWeek, format: "text" },
            { id: "nextWeekday", label: "Next birthday falls on", value: age.nextBirthday.toLocaleDateString("en-IN", { weekday: "long" }), format: "text" },
          ],
        },
      ],
      interpretation: `Your next birthday is on ${formatDate(age.nextBirthday)}, which is in ${formatNumber(age.daysUntilNextBirthday, 0)} days. You are currently ${age.years} years old.`,
    };
  },

  content: {
    summary:
      "The Birthday Calculator tells you when your next birthday is, what day of the week it falls on, and your current age details.",
    howToUse: [
      "Enter your date of birth.",
      "Press Calculate to see your next birthday details.",
    ],
    interpretation:
      "The next birthday is calculated based on your birth date. If your birthday is today, the next one is a year away.",
    formula: "Next Birthday = Next occurrence of birth month/day after today",
    variables: [
      { symbol: "DOB", name: "Date of birth", description: "The day you were born." },
    ],
    example: {
      title: "Example: Born March 15, 1995",
      inputs: { "Date of birth": "March 15, 1995" },
      steps: [
        "Find the next March 15 after today",
        "Count days until that date",
        "Determine the day of the week",
      ],
      result: "Next birthday date and countdown",
    },
    factors: [
      "Leap day birthdays are celebrated on Feb 28 in non-leap years.",
      "The day of the week changes each year.",
    ],
    edgeCases: [
      "Feb 29 birthdays are handled correctly.",
      "Birthday today means next one is a year away.",
    ],
    commonMistakes: [
      "Forgetting that Feb 29 birthdays shift to Feb 28.",
    ],
    assumptions: [
      "Uses the Gregorian calendar.",
    ],
    limitations: [
      "Does not account for time zones.",
    ],
    faqs: [
      {
        question: "What if I was born on February 29?",
        answer:
          "Your birthday is celebrated on February 28 in non-leap years. The calculator handles this automatically.",
      },
    ],
  },

  relatedCalculators: ["age", "days-until-birthday", "date", "date-difference"],

  seo: {
    title: "Birthday Calculator – Next Birthday & Age Details",
    description:
      "Find your next birthday date, day of the week, and countdown. See your current age in years, months and days. Free and instant.",
    keywords: ["birthday calculator", "next birthday", "birthday countdown"],
    primaryIntent: "Find next birthday details",
    secondaryIntents: ["Birthday countdown", "Birthday day of week"],
  },
};