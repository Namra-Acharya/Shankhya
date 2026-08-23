/**
 * Days Until Birthday Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { calculateAge, todayISO } from "@/lib/utils/date";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const daysUntilBirthdayCalculator: CalculatorDefinition = {
  id: "days-until-birthday",
  slug: "days-until-birthday-calculator",
  name: "Days Until Birthday",
  category: "date-time",
  shortDescription: "Count down the days until your next birthday.",
  icon: "party-popper",
  accent: "date-time",
  popularity: 81,

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
              id: "days",
              label: "DAYS UNTIL BIRTHDAY",
              value: formatNumber(age.daysUntilNextBirthday, 0),
              format: "number",
              primary: true,
              description: `until ${formatDate(age.nextBirthday)}`,
            },
          ],
        },
        {
          id: "details",
          title: "Birthday details",
          values: [
            { id: "date", label: "Next birthday", value: formatDate(age.nextBirthday), format: "text" },
            { id: "weekday", label: "Falls on", value: age.nextBirthday.toLocaleDateString("en-IN", { weekday: "long" }), format: "text" },
            { id: "age", label: "You will turn", value: `${age.years + 1} years old`, format: "text" },
          ],
        },
      ],
      interpretation: `Your next birthday is in ${formatNumber(age.daysUntilNextBirthday, 0)} days on ${formatDate(age.nextBirthday)}. You will be ${age.years + 1} years old.`,
    };
  },

  content: {
    summary:
      "The Days Until Birthday Calculator counts down the days until your next birthday and tells you what day it falls on.",
    howToUse: [
      "Enter your date of birth.",
      "Press Calculate to see the countdown.",
    ],
    interpretation:
      "The result shows the number of days until your next birthday, the date, and the day of the week.",
    formula: "Days = Next Birthday − Today",
    variables: [
      { symbol: "DOB", name: "Date of birth", description: "The day you were born." },
    ],
    example: {
      title: "Example: Born March 15, 1995",
      inputs: { "Date of birth": "March 15, 1995" },
      steps: [
        "Find the next March 15 after today",
        "Count the days between today and that date",
      ],
      result: "Days until next birthday",
    },
    factors: [
      "Leap day birthdays shift to Feb 28 in non-leap years.",
      "The countdown resets after each birthday.",
    ],
    edgeCases: [
      "Birthday today means 365 (or 366) days until the next one.",
      "Feb 29 birthdays are handled correctly.",
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
        question: "What if my birthday is today?",
        answer: "The calculator shows the days until your next birthday, which will be approximately 365 days away (366 if the next year is a leap year).",
      },
    ],
  },

  relatedCalculators: ["birthday", "age", "date", "date-difference"],

  seo: {
    title: "Days Until Birthday – Birthday Countdown Calculator",
    description:
      "Count down the days until your next birthday. See the exact date, day of the week, and how old you'll be. Free and instant.",
    keywords: ["days until birthday", "birthday countdown", "days to birthday"],
    primaryIntent: "Count days until next birthday",
    secondaryIntents: ["Birthday countdown", "Days to birthday"],
  },
};