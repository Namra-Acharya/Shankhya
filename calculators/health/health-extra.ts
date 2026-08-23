/**
 * Health Calculators - Pregnancy, Ovulation, Period, One Rep Max, Target Heart Rate
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

const fin = {
  summary: "Calculate health metrics with clear, accurate results.",
  howToUse: ["Enter your details.", "Press Calculate."],
  interpretation: "The result provides an estimate based on your inputs.",
  formula: "",
  variables: [] as { symbol: string; name: string; description: string }[],
  example: { title: "Example", inputs: { A: 1, B: 2 }, steps: ["Step 1"], result: "Result" },
  factors: ["Individual results may vary."],
  edgeCases: ["Zero inputs produce zero results."],
  commonMistakes: ["Enter values correctly."],
  assumptions: ["Standard medical formulas."],
  limitations: ["Estimates only - consult a healthcare professional."],
  faqs: [{ question: "Are results accurate?", answer: "Yes, based on standard formulas and your inputs. Always consult a healthcare professional for medical advice." }],
};

// ============ PREGNANCY DUE DATE ============
export const pregnancyDueDateCalculator: CalculatorDefinition = {
  id: "pregnancy-due-date", slug: "pregnancy-due-date-calculator", name: "Pregnancy Due Date Calculator", category: "health",
  shortDescription: "Estimate your due date based on your last menstrual period.", icon: "baby", accent: "health", popularity: 90,
  inputs: [
    { id: "lmp", label: "First day of last period", type: "date", defaultValue: "2026-01-01", validation: { required: true } },
    { id: "cycle", label: "Cycle length", type: "number", unit: "days", placeholder: "28", defaultValue: 28, validation: { required: true, min: 21, max: 35 } },
  ],
  calculate: (v) => {
    const lmp = new Date(String(v.lmp ?? "2026-01-01"));
    const cycle = parseNumber(v.cycle) ?? 28;
    const due = new Date(lmp);
    due.setDate(due.getDate() + 280 + (cycle - 28));
    const today = new Date();
    const weeks = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const days = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000)) % 7);
    const remaining = Math.max(0, Math.ceil((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
    return {
      sections: [
        { id: "primary", values: [{ id: "due", label: "ESTIMATED DUE DATE", value: due.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), format: "text", primary: true, description: `based on LMP ${lmp.toLocaleDateString("en-IN")}` }] },
        { id: "details", title: "Pregnancy details", values: [{ id: "weeks", label: "Current week", value: `${weeks}w ${days}d`, format: "text" }, { id: "remaining", label: "Days remaining", value: `${remaining} days`, format: "text" }] },
      ],
      interpretation: `Based on your last period of ${lmp.toLocaleDateString("en-IN")}, your estimated due date is ${due.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. You are currently ${weeks} weeks and ${days} days pregnant.`,
    };
  },
  content: { ...fin, summary: "The Pregnancy Due Date Calculator estimates your due date using Naegele's rule." },
  relatedCalculators: ["pregnancy-weight-gain", "ovulation", "period", "age"],
  seo: { title: "Pregnancy Due Date Calculator – Estimate Your Due Date", description: "Estimate your pregnancy due date based on your last menstrual period. Free, instant and accurate.", keywords: ["pregnancy due date calculator", "due date calculator"], primaryIntent: "Estimate pregnancy due date", secondaryIntents: ["Pregnancy week calculator"] },
};

// ============ PREGNANCY WEIGHT GAIN ============
export const pregnancyWeightGainCalculator: CalculatorDefinition = {
  id: "pregnancy-weight-gain", slug: "pregnancy-weight-gain-calculator", name: "Pregnancy Weight Gain Calculator", category: "health",
  shortDescription: "Calculate recommended weight gain during pregnancy.", icon: "scale", accent: "health", popularity: 88,
  inputs: [
    { id: "preWeight", label: "Pre-pregnancy weight", type: "number", unit: "kg", placeholder: "60", defaultValue: 60, validation: { required: true, min: 30, max: 200 } },
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "165", defaultValue: 165, validation: { required: true, min: 100, max: 250 } },
    { id: "weeks", label: "Current week", type: "number", unit: "weeks", placeholder: "20", defaultValue: 20, validation: { required: true, min: 1, max: 42 } },
  ],
  calculate: (v) => {
    const weight = parseNumber(v.preWeight) ?? 0, height = parseNumber(v.height) ?? 0, weeks = parseNumber(v.weeks) ?? 20;
    const bmi = height > 0 ? weight / Math.pow(height / 100, 2) : 0;
    let range: [number, number];
    if (bmi < 18.5) range = [12.5, 18];
    else if (bmi < 25) range = [11.5, 16];
    else if (bmi < 30) range = [7, 11.5];
    else range = [5, 9];
    const current = range[0] + (range[1] - range[0]) * (weeks / 40);
    return {
      sections: [
        { id: "primary", values: [{ id: "range", label: "RECOMMENDED GAIN", value: `${range[0]} - ${range[1]} kg`, format: "text", primary: true, description: `total for pregnancy` }] },
        { id: "details", title: "Weight details", values: [{ id: "bmi", label: "Pre-pregnancy BMI", value: bmi.toFixed(1), format: "text" }, { id: "current", label: "Est. gain by week", value: `${current.toFixed(1)} kg`, format: "text" }] },
      ],
      interpretation: `With a pre-pregnancy BMI of ${bmi.toFixed(1)}, the recommended total weight gain is ${range[0]} to ${range[1]} kg. By week ${weeks}, you may have gained about ${current.toFixed(1)} kg.`,
    };
  },
  content: { ...fin, summary: "The Pregnancy Weight Gain Calculator shows recommended weight gain based on pre-pregnancy BMI." },
  relatedCalculators: ["pregnancy-due-date", "bmi", "ovulation", "period"],
  seo: { title: "Pregnancy Weight Gain Calculator – Healthy Gain Range", description: "Calculate recommended weight gain during pregnancy based on your BMI. Free, instant and accurate.", keywords: ["pregnancy weight gain calculator", "pregnancy weight"], primaryIntent: "Calculate pregnancy weight gain", secondaryIntents: ["Healthy pregnancy weight"] },
};

// ============ OVULATION ============
export const ovulationCalculator: CalculatorDefinition = {
  id: "ovulation", slug: "ovulation-calculator", name: "Ovulation Calculator", category: "health",
  shortDescription: "Estimate your ovulation and fertile window.", icon: "calendar-heart", accent: "health", popularity: 89,
  inputs: [
    { id: "lmp", label: "First day of last period", type: "date", defaultValue: "2026-01-01", validation: { required: true } },
    { id: "cycle", label: "Cycle length", type: "number", unit: "days", placeholder: "28", defaultValue: 28, validation: { required: true, min: 21, max: 35 } },
  ],
  calculate: (v) => {
    const lmp = new Date(String(v.lmp ?? "2026-01-01"));
    const cycle = parseNumber(v.cycle) ?? 28;
    const ovulation = new Date(lmp);
    ovulation.setDate(ovulation.getDate() + cycle - 14);
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    return {
      sections: [
        { id: "primary", values: [{ id: "ovulation", label: "ESTIMATED OVULATION", value: ovulation.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), format: "text", primary: true, description: `day ${cycle - 14} of your cycle` }] },
        { id: "details", title: "Fertile window", values: [{ id: "fertile", label: "Fertile window", value: `${fertileStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${fertileEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, format: "text" }, { id: "next", label: "Next period", value: nextPeriod.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), format: "text" }] },
      ],
      interpretation: `With a ${cycle}-day cycle, ovulation is estimated around ${ovulation.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}. Your fertile window is ${fertileStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} to ${fertileEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`,
    };
  },
  content: { ...fin, summary: "The Ovulation Calculator estimates your fertile window based on your cycle." },
  relatedCalculators: ["period", "pregnancy-due-date", "pregnancy-weight-gain", "age"],
  seo: { title: "Ovulation Calculator – Find Your Fertile Window", description: "Estimate your ovulation and fertile window. Free, instant and accurate.", keywords: ["ovulation calculator", "fertile window"], primaryIntent: "Estimate ovulation", secondaryIntents: ["Fertile days"] },
};

// ============ PERIOD ============
export const periodCalculator: CalculatorDefinition = {
  id: "period", slug: "period-calculator", name: "Period Calculator", category: "health",
  shortDescription: "Track your menstrual cycle and predict next periods.", icon: "calendar", accent: "health", popularity: 87,
  inputs: [
    { id: "lmp", label: "First day of last period", type: "date", defaultValue: "2026-01-01", validation: { required: true } },
    { id: "cycle", label: "Cycle length", type: "number", unit: "days", placeholder: "28", defaultValue: 28, validation: { required: true, min: 21, max: 35 } },
    { id: "periodDays", label: "Period length", type: "number", unit: "days", placeholder: "5", defaultValue: 5, validation: { required: true, min: 2, max: 10 } },
  ],
  calculate: (v) => {
    const lmp = new Date(String(v.lmp ?? "2026-01-01"));
    const cycle = parseNumber(v.cycle) ?? 28, periodDays = parseNumber(v.periodDays) ?? 5;
    const next = new Date(lmp); next.setDate(next.getDate() + cycle);
    const after = new Date(next); after.setDate(after.getDate() + cycle);
    const ovulation = new Date(lmp); ovulation.setDate(ovulation.getDate() + cycle - 14);
    return {
      sections: [
        { id: "primary", values: [{ id: "next", label: "NEXT PERIOD", value: next.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), format: "text", primary: true, description: `in ${Math.max(0, Math.ceil((next.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))} days` }] },
        { id: "details", title: "Cycle details", values: [{ id: "after", label: "Following period", value: after.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), format: "text" }, { id: "ovulation", label: "Ovulation", value: ovulation.toLocaleDateString("en-IN", { day: "numeric", month: "long" }), format: "text" }] },
      ],
      interpretation: `With a ${cycle}-day cycle, your next period is expected around ${next.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}. Ovulation is estimated around ${ovulation.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.`,
    };
  },
  content: { ...fin, summary: "The Period Calculator predicts your next periods and ovulation based on your cycle." },
  relatedCalculators: ["ovulation", "pregnancy-due-date", "pregnancy-weight-gain", "age"],
  seo: { title: "Period Calculator – Track Your Cycle", description: "Predict your next period and ovulation. Free, instant and accurate.", keywords: ["period calculator", "menstrual cycle calculator"], primaryIntent: "Predict next period", secondaryIntents: ["Cycle tracking"] },
};

// ============ ONE REP MAX ============
export const oneRepMaxCalculator: CalculatorDefinition = {
  id: "one-rep-max", slug: "one-rep-max-calculator", name: "One Rep Max Calculator", category: "health",
  shortDescription: "Estimate your one-rep max from a lighter lift.", icon: "dumbbell", accent: "health", popularity: 86,
  inputs: [
    { id: "weight", label: "Weight lifted", type: "number", unit: "kg", placeholder: "60", defaultValue: 60, validation: { required: true, min: 1, max: 500 } },
    { id: "reps", label: "Reps performed", type: "number", placeholder: "5", defaultValue: 5, validation: { required: true, min: 1, max: 20 } },
  ],
  calculate: (v) => {
    const weight = parseNumber(v.weight) ?? 0, reps = parseNumber(v.reps) ?? 5;
    const epley = weight * (1 + reps / 30);
    const brzycki = reps > 1 ? weight * (36 / (37 - reps)) : weight;
    const lombardi = weight * Math.pow(reps, 0.1);
    return {
      sections: [
        { id: "primary", values: [{ id: "orm", label: "ESTIMATED 1RM", value: `${formatNumber(epley, 1)} kg`, format: "text", primary: true, description: `Epley formula` }] },
        { id: "details", title: "Other estimates", values: [{ id: "brzycki", label: "Brzycki", value: `${formatNumber(brzycki, 1)} kg`, format: "text" }, { id: "lombardi", label: "Lombardi", value: `${formatNumber(lombardi, 1)} kg`, format: "text" }] },
      ],
      interpretation: `Lifting ${weight} kg for ${reps} reps estimates a one-rep max of about ${formatNumber(epley, 1)} kg (Epley formula).`,
    };
  },
  content: { ...fin, summary: "The One Rep Max Calculator estimates your 1RM from a lighter lift using multiple formulas." },
  relatedCalculators: ["macro", "protein", "bmi", "calorie"],
  seo: { title: "One Rep Max Calculator – Estimate Your 1RM", description: "Estimate your one-rep max from any lift. Free, instant and accurate.", keywords: ["one rep max calculator", "1rm calculator"], primaryIntent: "Estimate one rep max", secondaryIntents: ["1RM from reps"] },
};

// ============ TARGET HEART RATE ============
export const targetHeartRateCalculator: CalculatorDefinition = {
  id: "target-heart-rate", slug: "target-heart-rate-calculator", name: "Target Heart Rate Calculator", category: "health",
  shortDescription: "Calculate your target heart rate zones for exercise.", icon: "heart-pulse", accent: "health", popularity: 85,
  inputs: [
    { id: "age", label: "Age", type: "number", unit: "years", placeholder: "30", defaultValue: 30, validation: { required: true, min: 15, max: 100 } },
    { id: "resting", label: "Resting heart rate", type: "number", unit: "bpm", placeholder: "70", defaultValue: 70, validation: { required: true, min: 40, max: 120 } },
  ],
  calculate: (v) => {
    const age = parseNumber(v.age) ?? 30, resting = parseNumber(v.resting) ?? 70;
    const maxHR = 220 - age;
    const hrr = maxHR - resting;
    const zones = [
      { name: "Warm-up", low: 0.5, high: 0.6 },
      { name: "Fat burn", low: 0.6, high: 0.7 },
      { name: "Cardio", low: 0.7, high: 0.8 },
      { name: "Peak", low: 0.8, high: 0.9 },
    ];
    return {
      sections: [
        { id: "primary", values: [{ id: "max", label: "MAX HEART RATE", value: `${maxHR} bpm`, format: "text", primary: true, description: `220 - ${age}` }] },
        { id: "zones", title: "Target zones", values: zones.map((z, i) => ({ id: `zone${i}`, label: z.name, value: `${Math.round(resting + hrr * z.low)} - ${Math.round(resting + hrr * z.high)} bpm`, format: "text" as const })) },
      ],
      interpretation: `Your max heart rate is ${maxHR} bpm. Target zones range from ${Math.round(resting + hrr * 0.5)} bpm (warm-up) to ${Math.round(resting + hrr * 0.9)} bpm (peak).`,
    };
  },
  content: { ...fin, summary: "The Target Heart Rate Calculator shows your exercise zones using the Karvonen formula." },
  relatedCalculators: ["bmi", "calorie", "bmr", "pace"],
  seo: { title: "Target Heart Rate Calculator – Find Your Zones", description: "Calculate your target heart rate zones for exercise. Free, instant and accurate.", keywords: ["target heart rate calculator", "heart rate zones"], primaryIntent: "Calculate target heart rate", secondaryIntents: ["Exercise zones"] },
};