import { describe, expect, it } from "vitest";

// Exported calculation functions
import { calculateEMI } from "@/calculators/finance/emi";
import { calculateSIP } from "@/calculators/finance/sip";
import { calculateCompoundInterest } from "@/calculators/finance/compound-interest";
import { calculateFD } from "@/calculators/finance/fd";
import { calculateRD } from "@/calculators/finance/rd";
import { calculateBMR } from "@/calculators/health/bmr";
import { calculateTDEE } from "@/calculators/health/calorie";
import { calculateBMI, getBMICategory } from "@/calculators/health/bmi";
import { calculateAge, diffInYearsMonthsDays } from "@/lib/utils/date";

describe("EMI calculation - mathematical correctness", () => {
  it("₹5,00,000 at 8.5% for 20 years → ₹4,339/month", () => {
    const emi = calculateEMI(500000, 8.5, 240);
    expect(round(emi)).toBe(4339);
  });

  it("zero interest: EMI = principal / months", () => {
    expect(calculateEMI(120000, 0, 12)).toBe(10000);
  });

  it("1-month tenure: EMI includes one month interest", () => {
    // 100000 at 12% for 1 month = 100000 × 1.01 = 101000
    expect(calculateEMI(100000, 12, 1)).toBeCloseTo(101000, 2);
  });

  it("₹1 crore at 9.5% for 20 years → between ₹90k-95k/month", () => {
    const emi = calculateEMI(10000000, 9.5, 240);
    expect(emi).toBeGreaterThan(90000);
    expect(emi).toBeLessThan(95000);
  });

  it("total payment = EMI × months", () => {
    const principal = 500000, rate = 8.5, months = 240;
    const emi = calculateEMI(principal, rate, months);
    expect(emi * months).toBeGreaterThan(principal);
  });
});

describe("SIP calculation - mathematical correctness", () => {
  it("₹5,000/mo at 12% for 10 years → approx ₹11,61,695", () => {
    const { futureValue } = calculateSIP(5000, 12, 10);
    expect(round(futureValue)).toBe(1161695);
  });

  it("zero return: future value = total invested", () => {
    const { futureValue, invested } = calculateSIP(5000, 0, 10);
    expect(futureValue).toBe(invested);
    expect(invested).toBe(5000 * 120);
  });

  it("wealth gain = future value - invested", () => {
    const { futureValue, invested, wealthGain } = calculateSIP(5000, 12, 10);
    expect(wealthGain).toBeCloseTo(futureValue - invested, 2);
  });

  it("invested amount correct", () => {
    const { invested } = calculateSIP(2000, 10, 5);
    expect(invested).toBe(2000 * 60);
  });
});

describe("Compound interest - mathematical correctness", () => {
  it("₹1,00,000 at 8% for 5 years compounded monthly → ~₹1,48,985", () => {
    // 100000 × (1 + 0.08/12)^60 = 100000 × 1.489846 = 148985
    const { amount } = calculateCompoundInterest(100000, 8, 5, 12);
    expect(round(amount)).toBe(148985);
  });

  it("₹1,00,000 at 8% for 5 years compounded annually → ~₹1,46,933", () => {
    const { amount } = calculateCompoundInterest(100000, 8, 5, 1);
    expect(round(amount)).toBe(146933);
  });

  it("interest = amount - principal", () => {
    const { amount, interest } = calculateCompoundInterest(50000, 10, 3, 4);
    expect(interest).toBeCloseTo(amount - 50000, 2);
  });

  it("simple interest fallback when compoundsPerYear=0", () => {
    const { amount } = calculateCompoundInterest(100000, 10, 3, 0);
    // Simple interest: 100000 × (1 + 0.10×3) = 130000
    expect(round(amount)).toBe(130000);
  });
});

describe("Fixed Deposit - mathematical correctness", () => {
  it("₹1,00,000 at 7% for 5 years quarterly → ~₹1,41,478", () => {
    // 100000 × (1 + 0.07/4)^20 = 100000 × 1.0175^20 = 100000 × 1.414778 = 141478
    const { maturityValue } = calculateFD(100000, 7, 5, 4);
    expect(round(maturityValue)).toBe(141478);
  });

  it("zero rate: maturity = principal", () => {
    const { maturityValue } = calculateFD(50000, 0, 5, 4);
    expect(maturityValue).toBe(50000);
  });

  it("interest = maturity - principal", () => {
    const { maturityValue, interestEarned } = calculateFD(100000, 7, 5, 4);
    expect(interestEarned).toBeCloseTo(maturityValue - 100000, 2);
  });
});

describe("Recurring Deposit - mathematical correctness", () => {
  it("₹2,000/mo at 6.5% for 5 years → ~₹1,42,114", () => {
    // M = 2000 × ((1 + 0.065/12)^60 - 1) / (0.065/12) × (1 + 0.065/12)
    // = 2000 × ((1.0054167)^60 - 1) / 0.0054167 × 1.0054167
    // = 2000 × 70.595 × 1.005417 = 142114
    const { maturityValue } = calculateRD(2000, 6.5, 5);
    expect(round(maturityValue)).toBe(142114);
  });

  it("zero rate: maturity = total invested", () => {
    const { maturityValue, invested } = calculateRD(2000, 0, 5);
    expect(maturityValue).toBe(invested);
    expect(invested).toBe(2000 * 60);
  });

  it("interest = maturity - invested", () => {
    const { maturityValue, invested, interestEarned } = calculateRD(2000, 6.5, 5);
    expect(interestEarned).toBeCloseTo(maturityValue - invested, 2);
  });
});

describe("BMR (Mifflin-St Jeor) - mathematical correctness", () => {
  it("Male 70kg 175cm 30yo → ~1,649 kcal", () => {
    const bmr = calculateBMR("male", 70, 175, 30);
    expect(round(bmr)).toBe(1649);
  });

  it("Female 60kg 165cm 30yo → ~1,320 kcal", () => {
    // BMR = 10×60 + 6.25×165 - 5×30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
    const bmr = calculateBMR("female", 60, 165, 30);
    expect(round(bmr)).toBe(1320);
  });

  it("male formula = base + 5; female = base - 161", () => {
    const base = 10 * 70 + 6.25 * 175 - 5 * 30;
    expect(calculateBMR("male", 70, 175, 30)).toBe(base + 5);
    expect(calculateBMR("female", 70, 175, 30)).toBe(base - 161);
  });
});

describe("TDEE - mathematical correctness", () => {
  it("BMR × multipliers", () => {
    const bmr = calculateBMR("male", 70, 175, 30);
    expect(round(calculateTDEE(bmr, "sedentary"))).toBe(round(bmr * 1.2));
    expect(round(calculateTDEE(bmr, "light"))).toBe(round(bmr * 1.375));
    expect(round(calculateTDEE(bmr, "moderate"))).toBe(round(bmr * 1.55));
    expect(round(calculateTDEE(bmr, "active"))).toBe(round(bmr * 1.725));
    expect(round(calculateTDEE(bmr, "veryActive"))).toBe(round(bmr * 1.9));
  });
});

describe("BMI - mathematical correctness", () => {
  it("70kg 175cm → BMI 22.9", () => {
    const bmi = calculateBMI(70, 175);
    expect(bmi).toBeCloseTo(22.86, 1);
  });

  it("categories are correct", () => {
    expect(getBMICategory(16)).toBe("Underweight");
    expect(getBMICategory(20)).toBe("Normal weight");
    expect(getBMICategory(27)).toBe("Overweight");
    expect(getBMICategory(33)).toBe("Obese");
  });

  it("boundary values", () => {
    expect(getBMICategory(18.5)).toBe("Normal weight");
    expect(getBMICategory(25)).toBe("Overweight");
    expect(getBMICategory(30)).toBe("Obese");
  });
});

describe("Age calculation - mathematical correctness", () => {
  it("1995-03-15 to 2026-08-10 = 31y 4m 26d", () => {
    const { years, months, days } = diffInYearsMonthsDays(
      new Date(1995, 2, 15),
      new Date(2026, 7, 10)
    );
    expect(years).toBe(31);
    expect(months).toBe(4);
    expect(days).toBe(26);
  });

  it("leap day birthday handled", () => {
    const age = calculateAge(new Date(2000, 1, 29), new Date(2024, 1, 28));
    expect(age.years).toBe(23);
  });

  it("same date = zero age", () => {
    const age = calculateAge(new Date(2024, 11, 1), new Date(2024, 11, 1));
    expect(age.years).toBe(0);
    expect(age.months).toBe(0);
    expect(age.days).toBe(0);
  });
});

// Helper: round to nearest rupee (or whole number)
function round(n: number): number {
  return Math.round(n);
}