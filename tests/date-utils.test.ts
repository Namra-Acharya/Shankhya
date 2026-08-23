import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  addYears,
  calculateAge,
  countBusinessDays,
  diffInDays,
  diffInMonths,
  diffInWeeks,
  diffInYearsMonthsDays,
  isLeapYear,
  isWeekend,
  startOfDay,
  daysInMonth,
} from "@/lib/utils/date";

describe("isLeapYear", () => {
  it("detects leap years", () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2004)).toBe(true);
    expect(isLeapYear(2024)).toBe(true);
  });

  it("detects non-leap years", () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2001)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });
});

describe("daysInMonth", () => {
  it("returns correct days for each month", () => {
    expect(daysInMonth(2024, 0)).toBe(31); // Jan
    expect(daysInMonth(2024, 1)).toBe(29); // Feb (leap)
    expect(daysInMonth(2023, 1)).toBe(28); // Feb (non-leap)
    expect(daysInMonth(2024, 2)).toBe(31); // Mar
    expect(daysInMonth(2024, 3)).toBe(30); // Apr
    expect(daysInMonth(2024, 10)).toBe(30); // Nov
    expect(daysInMonth(2024, 11)).toBe(31); // Dec
  });
});

describe("diffInDays", () => {
  it("calculates 0 for same dates", () => {
    expect(diffInDays(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(0);
  });

  it("calculates positive difference", () => {
    expect(diffInDays(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(1);
    expect(diffInDays(new Date(2024, 0, 1), new Date(2024, 1, 1))).toBe(31);
  });

  it("calculates negative difference", () => {
    expect(diffInDays(new Date(2024, 0, 2), new Date(2024, 0, 1))).toBe(-1);
  });

  it("handles leap years", () => {
    // Feb 28 to Mar 1 in a leap year = 2 days
    expect(diffInDays(new Date(2024, 1, 28), new Date(2024, 2, 1))).toBe(2);
    // Feb 28 to Mar 1 in a non-leap year = 1 day
    expect(diffInDays(new Date(2023, 1, 28), new Date(2023, 2, 1))).toBe(1);
  });
});

describe("diffInMonths", () => {
  it("calculates month difference", () => {
    expect(diffInMonths(new Date(2024, 0, 1), new Date(2024, 1, 1))).toBe(1);
    expect(diffInMonths(new Date(2024, 0, 1), new Date(2024, 12, 1))).toBe(12);
    expect(diffInMonths(new Date(2023, 0, 1), new Date(2024, 0, 1))).toBe(12);
  });
});

describe("diffInWeeks", () => {
  it("calculates week difference", () => {
    expect(diffInWeeks(new Date(2024, 0, 1), new Date(2024, 0, 8))).toBe(1);
    expect(diffInWeeks(new Date(2024, 0, 1), new Date(2024, 0, 15))).toBe(2);
  });
});

describe("diffInYearsMonthsDays", () => {
  it("calculates exact age breakdown", () => {
    const result = diffInYearsMonthsDays(
      new Date(1995, 2, 15), // Mar 15, 1995
      new Date(2026, 7, 10)  // Aug 10, 2026
    );
    expect(result.years).toBe(31);
    expect(result.months).toBe(4);
    expect(result.days).toBe(26);
  });

  it("handles same date", () => {
    const result = diffInYearsMonthsDays(
      new Date(2000, 0, 1),
      new Date(2000, 0, 1)
    );
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it("handles day borrowing", () => {
    // Jan 31 to Feb 28 = 0 months, 28 days
    const result = diffInYearsMonthsDays(
      new Date(2024, 0, 31),
      new Date(2024, 1, 28)
    );
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(28);
  });

  it("handles month borrowing", () => {
    // Nov 15 2023 to Feb 10 2024 = 0 years, 2 months, 26 days
    const result = diffInYearsMonthsDays(
      new Date(2023, 10, 15),
      new Date(2024, 1, 10)
    );
    expect(result.years).toBe(0);
    expect(result.months).toBe(2);
    expect(result.days).toBe(26);
  });

  it("handles year boundaries", () => {
    const result = diffInYearsMonthsDays(
      new Date(1999, 11, 31),
      new Date(2000, 0, 1)
    );
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(1);
  });

  it("swaps dates if reversed", () => {
    const result = diffInYearsMonthsDays(
      new Date(2024, 0, 1),
      new Date(2000, 0, 1)
    );
    expect(result.years).toBe(24);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });
});

describe("calculateAge", () => {
  it("calculates complete age", () => {
    const age = calculateAge(new Date(1995, 2, 15), new Date(2026, 7, 10));
    expect(age.years).toBe(31);
    expect(age.months).toBe(4);
    expect(age.days).toBe(26);
    expect(age.totalDays).toBeGreaterThan(0);
    expect(age.daysUntilNextBirthday).toBeGreaterThan(0);
  });

  it("handles leap day birthdays", () => {
    const age = calculateAge(new Date(2000, 1, 29), new Date(2024, 1, 28));
    // Born Feb 29 2000, target Feb 28 2024 (non-leap year birthday = Feb 28)
    expect(age.years).toBe(23);
    expect(age.months).toBe(11);
    expect(age.days).toBe(30);
  });

  it("handles birthday today", () => {
    const age = calculateAge(new Date(1990, 5, 15), new Date(2024, 5, 15));
    expect(age.years).toBe(34);
    expect(age.months).toBe(0);
    expect(age.days).toBe(0);
    expect(age.daysUntilNextBirthday).toBe(365); // Or 366 in next leap year
  });

  it("calculates next birthday correctly", () => {
    const age = calculateAge(new Date(1995, 2, 15), new Date(2026, 7, 10));
    // Next birthday: March 15, 2027
    expect(age.nextBirthday.getFullYear()).toBe(2027);
    expect(age.nextBirthday.getMonth()).toBe(2);
    expect(age.nextBirthday.getDate()).toBe(15);
  });

  it("handles age 0", () => {
    const age = calculateAge(new Date(2024, 11, 1), new Date(2024, 11, 1));
    expect(age.years).toBe(0);
    expect(age.months).toBe(0);
    expect(age.days).toBe(0);
    expect(age.totalDays).toBe(0);
  });
});

describe("addDays", () => {
  it("adds days correctly", () => {
    expect(addDays(new Date(2024, 0, 28), 1).getDate()).toBe(29);
    expect(addDays(new Date(2024, 1, 28), 1).getDate()).toBe(29);
    expect(addDays(new Date(2023, 1, 28), 1).getDate()).toBe(1);
  });

  it("handles month boundaries", () => {
    const result = addDays(new Date(2024, 0, 31), 1);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });
});

describe("addMonths", () => {
  it("adds months correctly", () => {
    const result = addMonths(new Date(2024, 0, 15), 1);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(15);
  });

  it("handles month-end edge cases", () => {
    // Jan 31 + 1 month = Feb 29 (leap year) or Feb 28
    const leap = addMonths(new Date(2024, 0, 31), 1);
    expect(leap.getDate()).toBe(29);

    const nonLeap = addMonths(new Date(2023, 0, 31), 1);
    expect(nonLeap.getDate()).toBe(28);
  });
});

describe("addYears", () => {
  it("adds years correctly", () => {
    const result = addYears(new Date(2024, 5, 15), 10);
    expect(result.getFullYear()).toBe(2034);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it("handles Feb 29 edge case", () => {
    const result = addYears(new Date(2024, 1, 29), 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getDate()).toBe(28); // Feb 28 in non-leap year
  });
});

describe("isWeekend", () => {
  it("detects weekends", () => {
    expect(isWeekend(new Date(2024, 0, 6))).toBe(true); // Saturday
    expect(isWeekend(new Date(2024, 0, 7))).toBe(true); // Sunday
  });

  it("detects weekdays", () => {
    expect(isWeekend(new Date(2024, 0, 1))).toBe(false); // Monday
    expect(isWeekend(new Date(2024, 0, 5))).toBe(false); // Friday
  });
});

describe("countBusinessDays", () => {
  it("counts business days including both dates", () => {
    // Jan 1 (Mon) to Jan 5 (Fri) = 5 business days
    expect(countBusinessDays(new Date(2024, 0, 1), new Date(2024, 0, 5))).toBe(5);
  });

  it("excludes weekends", () => {
    // Jan 4 (Thu) to Jan 8 (Mon) = 3 business days (Thu, Fri, Mon)
    expect(countBusinessDays(new Date(2024, 0, 4), new Date(2024, 0, 8))).toBe(3);
  });

  it("handles single day", () => {
    expect(countBusinessDays(new Date(2024, 0, 2), new Date(2024, 0, 2))).toBe(1);
  });
});