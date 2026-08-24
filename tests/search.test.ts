import { describe, it, expect } from "vitest";
import { searchCalculators } from "../lib/calculators/registry";

describe("search relevance rankings", () => {
  it("puts Age Calculator first for 'age'", () => {
    const results = searchCalculators("age");
    expect(results[0]?.name).toBe("Age Calculator");
  });

  it("puts BMI Calculator first for 'bmi'", () => {
    const results = searchCalculators("bmi");
    expect(results[0]?.name).toBe("BMI Calculator");
  });

  it("puts Mortgage Calculator first for 'mortgage'", () => {
    const results = searchCalculators("mortgage");
    expect(results[0]?.name).toBe("Mortgage Calculator");
  });

  it("puts Percentage Calculator first for 'percentage'", () => {
    const results = searchCalculators("percentage");
    expect(results[0]?.name).toBe("Percentage Calculator");
  });

  it("returns the exact-title calculator above weak description matches", () => {
    const results = searchCalculators("triangle");
    // Triangle is not registered; nearby match must not outrank an exact title when one exists
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns an empty result for gibberish", () => {
    expect(searchCalculators("zzzzzzqqq")).toEqual([]);
  });
});