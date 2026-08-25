import { describe, expect, it } from "vitest";

import { calculateEMI, emiCalculator } from "@/calculators/finance/emi";
import { ageCalculator } from "@/calculators/date-time/age";
import { validateCalculator } from "@/lib/utils/validation";
import { formatMoney } from "@/lib/currency/format";

describe("calculateEMI", () => {
  it("calculates standard EMI correctly", () => {
    // ₹5,00,000 at 8.5% for 20 years → ₹4,339/month
    // Verified: EMI = 500000 × 0.0070833 × (1.0070833)^240 / ((1.0070833)^240 − 1)
    const emi = calculateEMI(500000, 8.5, 240);
    expect(emi).toBeCloseTo(4339, 0);
  });

  it("returns principal / months for zero interest", () => {
    const emi = calculateEMI(120000, 0, 12);
    expect(emi).toBe(10000);
  });

  it("handles 1-month tenure", () => {
    const emi = calculateEMI(100000, 12, 1);
    // 100000 * 1.01 = 101000 (principal + 1 month interest)
    expect(emi).toBeCloseTo(101000, 2);
  });

  it("handles large values", () => {
    const emi = calculateEMI(10000000, 9.5, 240); // ₹1 crore
    expect(emi).toBeGreaterThan(0);
    expect(emi).toBeLessThan(100000);
  });

  it("handles small values", () => {
    const emi = calculateEMI(1000, 5, 12);
    expect(emi).toBeGreaterThan(80);
    expect(emi).toBeLessThan(100);
  });

  it("handles very high interest rates", () => {
    // ₹50,000 at 30% for 6 months → ₹9,077/month
    // Verified: EMI = 50000 × 0.025 × (1.025)^6 / ((1.025)^6 − 1)
    const emi = calculateEMI(50000, 30, 6);
    expect(emi).toBeCloseTo(9077, 0);
  });
});

describe("EMI Calculator integration", () => {
  it("produces a complete result", () => {
    const result = emiCalculator.calculate({
      principal: 500000,
      rate: 8.5,
      tenure: 20,
    });

    const primarySection = result.sections.find((s) =>
      s.values.some((v) => v.primary)
    );
    expect(primarySection).toBeDefined();
    const primary = primarySection!.values.find((v) => v.primary);
    expect(primary).toBeDefined();
    // Calculated EMI is a raw number; formatting in INR shows the currency symbol.
    expect(formatMoney(Number(primary!.value), "INR")).toContain("₹");
    expect(Number(primary!.value)).toBeCloseTo(4339, 0);
  });

  it("includes loan summary", () => {
    const result = emiCalculator.calculate({
      principal: 500000,
      rate: 8.5,
      tenure: 20,
    });

    const summary = result.sections.find((s) => s.id === "totals");
    expect(summary).toBeDefined();
    const values = summary!.values;
    expect(values).toHaveLength(3);
  });

  it("includes chart data", () => {
    const result = emiCalculator.calculate({
      principal: 500000,
      rate: 8.5,
      tenure: 20,
    });
    expect(result.chart).toBeDefined();
    expect(result.chart!.data).toHaveLength(2);
  });

  it("handles zero values safely", () => {
    const result = emiCalculator.calculate({
      principal: 0,
      rate: 0,
      tenure: 0,
    });
    expect(result.sections.length).toBeGreaterThan(0);
  });
});

describe("Age Calculator integration", () => {
  it("calculates age from birth date", () => {
    const result = ageCalculator.calculate({
      birthDate: "1995-03-15",
      targetDate: "2026-08-10",
    });

    const primarySection = result.sections.find((s) =>
      s.values.some((v) => v.primary)
    );
    expect(primarySection).toBeDefined();
    const primary = primarySection!.values.find((v) => v.primary);
    expect(primary).toBeDefined();
    expect(String(primary!.value)).toContain("31 years");
  });

  it("handles missing birth date gracefully", () => {
    const result = ageCalculator.calculate({
      targetDate: "2026-08-10",
    });
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it("validates future birth date", () => {
    const errors = validateCalculator(ageCalculator.inputs, {
      birthDate: "2030-01-01",
      targetDate: "2026-08-10",
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("Calculator validation", () => {
  it("validates EMI inputs", () => {
    const errors = validateCalculator(emiCalculator.inputs, {
      principal: 100, // below minimum
      rate: 8.5,
      tenure: 20,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts valid EMI inputs", () => {
    const errors = validateCalculator(emiCalculator.inputs, {
      principal: 500000,
      rate: 8.5,
      tenure: 20,
    });
    expect(errors).toHaveLength(0);
  });

  it("validates missing required inputs", () => {
    const errors = validateCalculator(ageCalculator.inputs, {});
    expect(errors.length).toBeGreaterThan(0);
  });
});