/**
 * Date utilities for date-related calculators.
 */

export interface DateParts {
  years: number;
  months: number;
  days: number;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
  dayOfWeek: string;
  bornOnLeapYear: boolean;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  // month is 0-indexed
  return new Date(year, month + 1, 0).getDate();
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffInDays(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1).getTime();
  const d2 = startOfDay(date2).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function diffInMonths(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

export function diffInWeeks(date1: Date, date2: Date): number {
  return diffInDays(date1, date2) / 7;
}

/**
 * Calculate the difference between two dates in years, months and days.
 * Handles month-end edge cases correctly.
 */
export function diffInYearsMonthsDays(from: Date, to: Date): DateParts {
  const start = startOfDay(from);
  const end = startOfDay(to);

  if (end < start) {
    return diffInYearsMonthsDays(end, start);
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // Get the last day of the previous month
    const prevMonthEnd = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthEnd;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculate a person's age from date of birth to a target date.
 */
export function calculateAge(birthDate: Date, targetDate: Date = new Date()): AgeResult {
  const birth = startOfDay(birthDate);
  const target = startOfDay(targetDate);

  const { years, months, days } = diffInYearsMonthsDays(birth, target);
  const totalDays = diffInDays(birth, target);

  // Next birthday
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= target) {
    nextBirthday.setFullYear(target.getFullYear() + 1);
  }
  // Handle Feb 29 birthdays in non-leap years
  if (birth.getMonth() === 1 && birth.getDate() === 29 && !isLeapYear(nextBirthday.getFullYear())) {
    nextBirthday.setDate(28);
  }

  const daysUntilNextBirthday = diffInDays(target, nextBirthday);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: diffInMonths(birth, target),
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    totalSeconds: totalDays * 24 * 60 * 60,
    nextBirthday,
    daysUntilNextBirthday,
    dayOfWeek: birth.toLocaleDateString("en-IN", { weekday: "long" }),
    bornOnLeapYear: isLeapYear(birth.getFullYear()),
  };
}

/**
 * Add days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date, handling month-end edge cases.
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = daysInMonth(result.getFullYear(), result.getMonth());
  result.setDate(Math.min(day, lastDay));
  return result;
}

/**
 * Add years to a date, handling Feb 29 edge cases.
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setFullYear(result.getFullYear() + years);
  if (result.getDate() !== day) {
    result.setDate(0); // Last day of previous month (Feb 28 in non-leap years)
  }
  return result;
}

/**
 * Check if a date is a weekend (Saturday or Sunday).
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Count business days (Mon-Fri) between two dates, inclusive of both.
 */
export function countBusinessDays(from: Date, to: Date): number {
  const start = startOfDay(from);
  const end = startOfDay(to);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Format a date as YYYY-MM-DD for input values.
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD.
 */
export function todayISO(): string {
  return toISODate(new Date());
}