/**
 * Age Calculator
 * Reference-quality calculator with comprehensive content.
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { calculateAge, todayISO } from "@/lib/utils/date";
import { formatNumber, formatDate, formatDateLong } from "@/lib/utils/format";
import { parseDate } from "@/lib/utils/validation";

export const ageCalculator: CalculatorDefinition = {
  id: "age",
  slug: "age-calculator",
  name: "Age Calculator",
  category: "date-time",
  shortDescription: "Calculate your exact age in years, months and days.",
  icon: "calendar",
  accent: "date-time",
  featured: true,
  popularity: 100,

  inputs: [
    {
      id: "birthDate",
      label: "Date of birth",
      type: "date",
      hint: "The day you were born.",
      example: "e.g. 15 March 1995",
      validation: {
        required: true,
        maxDate: todayISO(),
        message: "Date of birth cannot be in the future.",
      },
    },
    {
      id: "targetDate",
      label: "Age as of",
      type: "date",
      hint: "The date you want to calculate your age on.",
      example: "e.g. today",
      defaultValue: todayISO(),
      validation: {
        required: true,
        message: "Please select a target date.",
      },
    },
  ],

  calculate: (values) => {
    const birthDate = parseDate(values.birthDate);
    const targetDate = parseDate(values.targetDate) ?? new Date();

    if (!birthDate) {
      return {
        sections: [
          {
            id: "error",
            values: [
              {
                id: "error",
                label: "Please enter a valid date of birth",
                value: "—",
                format: "text",
              },
            ],
          },
        ],
      };
    }

    const age = calculateAge(birthDate, targetDate);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "age",
              label: "Your age",
              value: `${age.years} years, ${age.months} months, ${age.days} days`,
              format: "text",
              primary: true,
              description: `As of ${formatDate(targetDate)}`,
            },
          ],
        },
        {
          id: "totals",
          title: "Total time lived",
          values: [
            {
              id: "totalDays",
              label: "Total days",
              value: formatNumber(age.totalDays, 0),
              format: "number",
            },
            {
              id: "totalWeeks",
              label: "Total weeks",
              value: formatNumber(age.totalWeeks, 0),
              format: "number",
            },
            {
              id: "totalMonths",
              label: "Total months",
              value: formatNumber(age.totalMonths, 0),
              format: "number",
            },
            {
              id: "totalHours",
              label: "Total hours",
              value: formatNumber(age.totalHours, 0),
              format: "number",
            },
          ],
        },
        {
          id: "birthday",
          title: "Birthday",
          values: [
            {
              id: "nextBirthday",
              label: "Next birthday",
              value: formatDateLong(age.nextBirthday),
              format: "text",
            },
            {
              id: "daysUntil",
              label: "Days until next birthday",
              value: formatNumber(age.daysUntilNextBirthday, 0),
              format: "number",
            },
            {
              id: "bornOn",
              label: "Born on a",
              value: age.dayOfWeek,
              format: "text",
            },
          ],
        },
      ],
      chart: {
        type: "timeline",
        title: "Your life timeline",
        data: [],
        milestones: [
          { label: "Birth", date: formatDate(birthDate) },
          { label: "Today", date: formatDate(targetDate), value: age.years },
          { label: "Next birthday", date: formatDateLong(age.nextBirthday) },
        ],
      },
      interpretation: `You are ${age.years} years, ${age.months} months and ${age.days} days old. You have lived approximately ${formatNumber(age.totalDays, 0)} days. Your next birthday is in ${formatNumber(age.daysUntilNextBirthday, 0)} days.`,
    };
  },

  content: {
    summary:
      "The Age Calculator tells you exactly how old you are in years, months and days. It also shows the total number of days, weeks, months and hours you have lived, and when your next birthday falls.",
    howToUse: [
      "Enter your date of birth in the first field.",
      "Choose the date you want to calculate your age for. By default, this is today.",
      "Press Calculate to see your exact age and the total time you have lived.",
    ],
    interpretation:
      "The primary result shows your age broken into years, months and days. This is the most common way people describe their age. The secondary results show the same age expressed in different units — total days, weeks, months and hours — which can be useful for medical records, legal documents or simply curiosity.",
    formula:
      "Age = Target Date − Date of Birth\n\nYears = Target Year − Birth Year\nMonths = Target Month − Birth Month\nDays = Target Day − Birth Day\n\nIf Days < 0: borrow from months\nIf Months < 0: borrow from years",
    variables: [
      {
        symbol: "Y",
        name: "Years",
        description: "The number of complete years between the birth date and target date.",
      },
      {
        symbol: "M",
        name: "Months",
        description: "The remaining months after counting complete years.",
      },
      {
        symbol: "D",
        name: "Days",
        description: "The remaining days after counting complete years and months.",
      },
    ],
    example: {
      title: "Example: Age on 15 March 1995 as of 10 August 2026",
      inputs: {
        "Date of birth": "15 March 1995",
        "Age as of": "10 August 2026",
      },
      steps: [
        "Start with the birth date: 15 March 1995.",
        "Count complete years: from 15 March 1995 to 15 March 2026 is 31 years.",
        "Count remaining months: from 15 March 2026 to 15 August 2026 is 4 months.",
        "Count remaining days: from 15 August 2026 to 10 August 2026 is −5 days, so borrow 1 month (31 days in July).",
        "Result: 31 years, 3 months, 26 days.",
      ],
      result: "31 years, 3 months, 26 days",
    },
    factors: [
      "Leap years add an extra day to February, which affects the total day count.",
      "The target date determines how many complete years, months and days have passed.",
      "Month lengths vary (28–31 days), which affects the day calculation when borrowing.",
    ],
    edgeCases: [
      "If you were born on 29 February (leap day), your birthday is celebrated on 28 February in non-leap years.",
      "If the target date is before the birth date, the calculator swaps the dates and shows the absolute difference.",
      "If the birth date and target date are the same, the age is 0 years, 0 months, 0 days.",
      "Month-end dates: if you were born on 31 January, your age on 28 February is 0 months and 28 days, not 1 month.",
    ],
    commonMistakes: [
      "Counting the birth year as a full year. You are 0 years old on your first birthday, not 1.",
      "Forgetting that months have different lengths when calculating days.",
      "Using the current date when a specific date is needed (e.g., for legal documents).",
    ],
    assumptions: [
      "The calculator uses the Gregorian calendar.",
      "A person is considered to have completed a year on the anniversary of their birth date.",
      "The day count includes the birth date but not the target date (standard convention).",
    ],
    limitations: [
      "The calculator does not account for time zones. If you were born in a different time zone, the exact age may differ by a few hours.",
      "For legal purposes, always verify the age with official documents.",
      "The calculator assumes a standard 24-hour day, ignoring daylight saving time changes.",
    ],
    faqs: [
      {
        question: "How is my age calculated?",
        answer:
          "Your age is calculated by subtracting your date of birth from the target date. The calculator first counts complete years, then the remaining months, then the remaining days. When the day or month of the target date is smaller than your birth day or month, the calculator borrows from the previous unit — just like subtraction in arithmetic.",
      },
      {
        question: "How many days old am I?",
        answer:
          "The total days figure is the exact number of days between your birth date and the target date, counting the birth date but not the target date. This is the most precise measure of time lived and is useful for medical records, legal documents, or simply curiosity.",
      },
      {
        question: "How is my age calculated if I was born on 29 February?",
        answer:
          "If you were born on 29 February (a leap day), your birthday is celebrated on 28 February in non-leap years. The calculator handles this automatically. For example, someone born on 29 February 2000 would be considered 1 year old on 28 February 2001.",
      },
      {
        question: "Can I calculate my age on a future date?",
        answer:
          "Yes. The 'Age as of' field lets you choose any date — past, present, or future. This is useful for planning, such as checking how old you will be on a specific future date like a retirement date or a milestone birthday.",
      },
      {
        question: "Why can total months differ from years × 12 in calendar calculations?",
        answer:
          "Because months have different lengths (28–31 days), the total number of months is not simply years × 12. The calculator counts actual calendar months between the two dates, accounting for the varying lengths of each month. For example, 1 year and 1 month could be 395 days (if it spans February) or 397 days (if it spans two 31-day months).",
      },
      {
        question: "Why does the calculator show my age in years, months and days?",
        answer:
          "This is the most precise and commonly understood way to express age. It tells you exactly how many complete years, months and days have passed since your birth, which is more useful than just the number of years.",
      },
      {
        question: "What is the difference between chronological age and biological age?",
        answer:
          "Chronological age is the time that has passed since your birth, which is what this calculator shows. Biological age is an estimate of how well your body has aged compared to others of the same chronological age, and requires medical assessment.",
      },
      {
        question: "Can I calculate someone else's age?",
        answer:
          "Yes. Simply enter their date of birth and the target date. The calculator works for anyone, not just yourself.",
      },
      {
        question: "Why does the total number of days matter?",
        answer:
          "Total days is useful for medical records, calculating medication dosages, legal documents, or simply understanding your age in a different way. It is the most precise measure of time lived.",
      },
    ],
  },

  relatedCalculators: ["date-difference", "days-between-dates", "birthday", "days-until-birthday"],

  seo: {
    title: "Age Calculator – Calculate Your Exact Age in Years, Months & Days",
    description:
      "Calculate your exact age in years, months and days. See total days lived, weeks, months, hours and your next birthday. Free, instant and accurate.",
    keywords: ["age calculator", "how old am i", "calculate age", "age in years months days", "date of birth age"],
    primaryIntent: "Calculate exact age from date of birth",
    secondaryIntents: [
      "How old am I in years, months and days",
      "Total days lived",
      "Next birthday countdown",
      "Age on a specific date",
    ],
  },
};