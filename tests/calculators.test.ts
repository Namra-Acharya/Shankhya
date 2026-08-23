import { describe, expect, it } from "vitest";

import { getAllCalculators } from "@/lib/calculators/registry";
import { validateCalculator } from "@/lib/utils/validation";
import type { CalculatorInput, CalculatorValues } from "@/lib/calculators/types";
import { expandInputs } from "@/lib/calculators/types";

/**
 * Builds a valid value for each input from its own definition.
 * Uses defaultValue, else min (or a sensible default), so we never
 * guess field ids — we read them from the actual schema.
 */
function defaultValueFor(input: CalculatorInput): string | number | boolean {
  if (input.defaultValue !== undefined) return input.defaultValue;
  if (input.type === "dropdown" || input.type === "radio") {
    return input.options?.[0]?.value ?? "";
  }
  if (input.type === "checkbox") return true;
  if (input.type === "date") return "2026-01-01";
  if (input.type === "time") return "09:00";
  if (input.validation?.min !== undefined) return input.validation.min;
  // Sensible defaults per type
  if (input.type === "percentage") return 50;
  if (input.type === "currency" || input.type === "number" || input.type === "decimal") return 100;
  return 1;
}

function autoInputs(inputs: CalculatorInput[], values: CalculatorValues): CalculatorValues {
  const result: CalculatorValues = { ...values };
  for (const input of inputs) {
    if (input.repeat) {
      // count input drives rows; set it to a small value
      const countInput = inputs.find((i) => i.id === input.repeat!.countInputId);
      if (countInput && result[countInput.id] === undefined) {
        result[countInput.id] = 2;
      }
    } else if (result[input.id] === undefined) {
      result[input.id] = defaultValueFor(input);
    }
  }
  return result;
}

describe("All calculators produce valid results", () => {
  const calculators = getAllCalculators();

  it("registers every calculator", () => {
    expect(calculators.length).toBeGreaterThan(20);
  });

  for (const calc of calculators) {
    it(`${calc.name} (${calc.id}) produces a valid result`, () => {
      const values = autoInputs(calc.inputs, {});
      // Provide repeatable row values if any inputs repeat
      const expanded = expandInputs(calc.inputs, values);
      for (const input of expanded) {
        if (values[input.id] === undefined) {
          values[input.id] = defaultValueFor(input);
        }
      }

      const result = calc.calculate(values);
      expect(result.sections.length, `${calc.id} produced no sections`).toBeGreaterThan(0);

      const primarySection = result.sections.find((s) =>
        s.values.some((v) => v.primary)
      );
      expect(primarySection, `${calc.id} should have a primary result`).toBeDefined();
      const primary = primarySection!.values.find((v) => v.primary)!;
      expect(String(primary.value).length).toBeGreaterThan(0);
    });
  }
});

describe("All calculators validate their auto-generated inputs", () => {
  const calculators = getAllCalculators();

  for (const calc of calculators) {
    it(`${calc.name} (${calc.id}) accepts auto-generated inputs`, () => {
      const values = autoInputs(calc.inputs, {});
      const expanded = expandInputs(calc.inputs, values);
      for (const input of expanded) {
        if (values[input.id] === undefined) {
          values[input.id] = defaultValueFor(input);
        }
      }
      const errors = validateCalculator(calc.inputs, values);
      expect(errors, `${calc.id} errors: ${JSON.stringify(errors)}`).toHaveLength(0);
    });
  }
});

describe("Known-value correctness checks", () => {
  const byId = Object.fromEntries(getAllCalculators().map((c) => [c.id, c]));
  const primaryOf = (id: string, values: CalculatorValues) => {
    const result = byId[id].calculate(values);
    const section = result.sections.find((s) => s.values.some((v) => v.primary))!;
    return String(section.values.find((v) => v.primary)!.value);
  };

  it("SIP: ₹5,000/mo at 12% for 10 years ≈ ₹11,61,695", () => {
    expect(primaryOf("sip", { monthlyInvestment: 5000, annualReturn: 12, years: 10 })).toContain("11,61");
  });

  it("Percentage: 20% of 150 = 30", () => {
    expect(primaryOf("percentage", { mode: "of", value1: 20, value2: 150 })).toContain("30");
  });

  it("CGPA: 9, 8, 10 on 10-point = 9.0", () => {
    expect(primaryOf("cgpa", { numSubjects: 3, maxGrade: "10", grade1: 9, grade2: 8, grade3: 10 })).toContain("9");
  });

  it("Attendance: 42/50 = 84%", () => {
    expect(primaryOf("attendance", { classesAttended: 42, totalClasses: 50, requiredPct: 75 })).toContain("84");
  });

  it("GPA: (3.5×3 + 4×4)/(3+4) = 3.79", () => {
    expect(primaryOf("gpa", { numCourses: 2, scale: "4", grade1: 3.5, credits1: 3, grade2: 4, credits2: 4 })).toContain("3.79");
  });

  it("Simple interest: ₹50,000 at 6% for 3 years = ₹9,000", () => {
    expect(primaryOf("simple-interest", { principal: 50000, rate: 6, years: 3 })).toContain("9,000");
  });

  it("GST exclusive: ₹10,000 at 18% = GST ₹1,800", () => {
    expect(primaryOf("gst", { amount: 10000, rate: 18, type: "exclusive" })).toContain("1,800");
  });

  it("Age: 1995-03-15 to 2026-08-10 = 31 years", () => {
    expect(primaryOf("age", { birthDate: "1995-03-15", targetDate: "2026-08-10" })).toContain("31");
  });

  it("Grade: 85/100 = B", () => {
    expect(primaryOf("grade", { score: 85, total: 100, scale: "standard" })).toContain("B");
  });

  it("Date difference: 2026-01-01 to 2026-06-15", () => {
    const result = byId["date-difference"].calculate({ startDate: "2026-01-01", endDate: "2026-06-15" });
    expect(result.sections.length).toBeGreaterThan(0);
  });
});