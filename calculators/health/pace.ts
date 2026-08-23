/**
 * Pace Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

export const paceCalculator: CalculatorDefinition = {
  id: "pace",
  slug: "pace-calculator",
  name: "Pace Calculator",
  category: "health",
  shortDescription: "Calculate running pace, speed, or finish time.",
  icon: "footprints",
  accent: "health",
  popularity: 90,

  inputs: [
    {
      id: "mode", label: "What do you want to calculate?", type: "radio", defaultValue: "pace",
      options: [
        { label: "Pace (min/km)", value: "pace" },
        { label: "Speed (km/h)", value: "speed" },
        { label: "Finish time", value: "time" },
      ],
    },
    { id: "distance", label: "Distance", type: "number", unit: "km", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0.1, max: 1000 } },
    { id: "time", label: "Time (minutes)", type: "number", unit: "min", placeholder: "50", defaultValue: 50, validation: { required: true, min: 1, max: 1440 } },
  ],

  calculate: (values) => {
    const mode = String(values.mode ?? "pace");
    const distance = parseNumber(values.distance) ?? 0;
    const timeMin = parseNumber(values.time) ?? 0;

    let paceMinPerKm = 0;
    let speedKmh = 0;

    if (distance > 0 && timeMin > 0) {
      paceMinPerKm = timeMin / distance;
      speedKmh = distance / (timeMin / 60);
    }

    const paceMin = Math.floor(paceMinPerKm);
    const paceSec = Math.round((paceMinPerKm - paceMin) * 60);

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "result",
              label: mode === "pace" ? "YOUR PACE" : mode === "speed" ? "YOUR SPEED" : "FINISH TIME",
              value: mode === "pace" ? `${paceMin}:${String(paceSec).padStart(2, "0")} min/km` : mode === "speed" ? `${formatNumber(speedKmh, 1)} km/h` : `${formatNumber(timeMin, 0)} min`,
              format: "text",
              primary: true,
              description: `for ${formatNumber(distance, 1)} km`,
            },
          ],
        },
        {
          id: "details",
          title: "Pace details",
          values: [
            { id: "pace", label: "Pace", value: `${paceMin}:${String(paceSec).padStart(2, "0")} min/km`, format: "text" },
            { id: "speed", label: "Speed", value: `${formatNumber(speedKmh, 1)} km/h`, format: "text" },
          ],
        },
      ],
      interpretation: `For a distance of ${formatNumber(distance, 1)} km in ${formatNumber(timeMin, 0)} minutes, your pace is ${paceMin}:${String(paceSec).padStart(2, "0")} min/km and your speed is ${formatNumber(speedKmh, 1)} km/h.`,
    };
  },

  content: {
    summary: "The Pace Calculator converts between running pace, speed, and finish time for any distance.",
    howToUse: ["Enter your distance.", "Enter your time in minutes.", "Press Calculate to see pace and speed."],
    interpretation: "Pace is the time per kilometer. Speed is the distance per hour. Both describe the same performance in different units.",
    formula: "Pace = Time / Distance\nSpeed = Distance / (Time / 60)",
    variables: [
      { symbol: "D", name: "Distance", description: "Distance in km." },
      { symbol: "T", name: "Time", description: "Time in minutes." },
    ],
    example: {
      title: "Example: 10 km in 50 minutes",
      inputs: { Distance: "10km", Time: "50 min" },
      steps: ["Pace = 50 / 10 = 5 min/km", "Speed = 10 / (50/60) = 12 km/h"],
      result: "5:00 min/km, 12 km/h",
    },
    factors: ["Terrain affects pace.", "Elevation changes pace."],
    edgeCases: ["Very short distances give extreme paces."],
    commonMistakes: ["Using hours instead of minutes."],
    assumptions: ["Flat terrain.", "Consistent pace."],
    limitations: ["Does not account for terrain or weather."],
    faqs: [{ question: "What is a good running pace?", answer: "A good pace depends on fitness level. Beginners often run 6-8 min/km, while experienced runners may run 4-5 min/km." }],
  },

  relatedCalculators: ["calorie", "bmi", "bmr", "tdee"],
  seo: {
    title: "Pace Calculator – Running Pace, Speed & Finish Time",
    description: "Calculate your running pace, speed, or finish time. Convert between min/km and km/h. Free, instant and accurate.",
    keywords: ["pace calculator", "running pace", "speed calculator", "finish time"],
    primaryIntent: "Calculate running pace",
    secondaryIntents: ["Running speed", "Finish time calculator"],
  },
};