/**
 * Macro Calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber, roundTo } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";
import { calculateBMR } from "@/calculators/health/bmr";
import { calculateTDEE } from "@/calculators/health/calorie";

export const macroCalculator: CalculatorDefinition = {
  id: "macro",
  slug: "macro-calculator",
  name: "Macro Calculator",
  category: "health",
  shortDescription: "Calculate your daily protein, carb and fat targets.",
  icon: "dumbbell",
  accent: "health",
  popularity: 92,

  inputs: [
    {
      id: "sex", label: "Sex", type: "radio", defaultValue: "male",
      options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
    },
    { id: "weight", label: "Weight", type: "number", unit: "kg", placeholder: "70", defaultValue: 70, validation: { required: true, min: 20, max: 500 } },
    { id: "height", label: "Height", type: "number", unit: "cm", placeholder: "175", defaultValue: 175, validation: { required: true, min: 100, max: 250 } },
    { id: "age", label: "Age", type: "number", unit: "years", placeholder: "30", defaultValue: 30, validation: { required: true, min: 15, max: 100 } },
    {
      id: "activity", label: "Activity level", type: "dropdown", defaultValue: "moderate",
      options: [
        { label: "Sedentary", value: "sedentary" },
        { label: "Light (1-3 days/week)", value: "light" },
        { label: "Moderate (3-5 days/week)", value: "moderate" },
        { label: "Active (6-7 days/week)", value: "active" },
        { label: "Very active", value: "veryActive" },
      ],
    },
    {
      id: "goal", label: "Goal", type: "dropdown", defaultValue: "maintain",
      options: [
        { label: "Maintain weight", value: "maintain" },
        { label: "Lose weight", value: "lose" },
        { label: "Gain muscle", value: "gain" },
      ],
    },
  ],

  calculate: (values) => {
    const sex = String(values.sex ?? "male");
    const weight = parseNumber(values.weight) ?? 0;
    const height = parseNumber(values.height) ?? 0;
    const age = parseNumber(values.age) ?? 30;
    const activity = String(values.activity ?? "moderate");
    const goal = String(values.goal ?? "maintain");

    const bmr = calculateBMR(sex, weight, height, age);
    const tdee = calculateTDEE(bmr, activity);

    let calorieTarget = tdee;
    if (goal === "lose") calorieTarget = tdee - 500;
    if (goal === "gain") calorieTarget = tdee + 300;

    const protein = weight * 1.8;
    const fat = (calorieTarget * 0.25) / 9;
    const carbs = (calorieTarget - protein * 4 - fat * 9) / 4;

    return {
      sections: [
        {
          id: "primary",
          values: [
            { id: "calories", label: "DAILY CALORIE TARGET", value: formatNumber(calorieTarget, 0), format: "number", primary: true, description: `for ${goal === "lose" ? "weight loss" : goal === "gain" ? "muscle gain" : "maintenance"}` },
          ],
        },
        {
          id: "macros",
          title: "Daily macro targets",
          values: [
            { id: "protein", label: "Protein", value: `${formatNumber(protein, 0)}g`, format: "text" },
            { id: "carbs", label: "Carbohydrates", value: `${formatNumber(carbs, 0)}g`, format: "text" },
            { id: "fat", label: "Fat", value: `${formatNumber(fat, 0)}g`, format: "text" },
          ],
        },
      ],
      chart: {
        type: "bar",
        title: "Macro breakdown (grams)",
        data: [
          { label: "Protein", value: roundTo(protein, 0), color: "var(--accent)" },
          { label: "Carbs", value: roundTo(carbs, 0), color: "var(--muted)" },
          { label: "Fat", value: roundTo(fat, 0), color: "var(--muted)" },
        ],
      },
      interpretation: `Based on your details and ${goal === "lose" ? "weight loss" : goal === "gain" ? "muscle gain" : "maintenance"} goal, your daily targets are approximately ${formatNumber(calorieTarget, 0)} calories with ${formatNumber(protein, 0)}g protein, ${formatNumber(carbs, 0)}g carbs and ${formatNumber(fat, 0)}g fat. These are estimates.`,
    };
  },

  content: {
    summary: "The Macro Calculator estimates daily calorie, protein, carb, and fat targets based on your body metrics and goal.",
    howToUse: ["Enter your details.", "Select your activity level.", "Choose your goal.", "Press Calculate."],
    interpretation: "Macros are the three main nutrient groups: protein, carbohydrates, and fat. The calculator estimates daily targets based on your calorie goal.",
    formula: "Protein = 1.8g/kg body weight\nFat = 25% of calories\nCarbs = remaining calories",
    variables: [
      { symbol: "W", name: "Weight", description: "Body weight in kg." },
      { symbol: "TDEE", name: "TDEE", description: "Total Daily Energy Expenditure." },
    ],
    example: {
      title: "Example: 70kg, moderate activity, maintain",
      inputs: { Weight: "70kg", Activity: "Moderate", Goal: "Maintain" },
      steps: ["TDEE ≈ 2,556 calories", "Protein = 70 × 1.8 = 126g", "Fat = 25% of 2556 / 9 = 71g", "Carbs = (2556 - 504 - 639) / 4 = 353g"],
      result: "≈ 126g protein, 71g fat, 353g carbs",
    },
    factors: ["Activity level determines calories.", "Goal adjusts the calorie target."],
    edgeCases: ["Estimates vary by individual."],
    commonMistakes: ["Forgetting to adjust macros for goals."],
    assumptions: ["Standard nutrient partitioning."],
    limitations: ["This is an estimate, not personalized nutrition advice."],
    faqs: [{ question: "What are macros?", answer: "Macros (macronutrients) are protein, carbohydrates, and fat. They provide the calories in food and are tracked to support fitness goals." }],
    glossary: [
      { term: "Macronutrient", definition: "A nutrient the body needs in large amounts. The three main macronutrients are protein, carbohydrates, and fat." },
      { term: "Protein", definition: "A nutrient used to build and repair tissue, including muscle. It provides 4 calories per gram." },
      { term: "Carbohydrates", definition: "The body's preferred energy source, found in foods like grains, fruit, and vegetables. They provide 4 calories per gram." },
      { term: "Fat", definition: "A concentrated energy source and essential nutrient, providing 9 calories per gram. Fat supports hormones and nutrient absorption." },
      { term: "Calorie target", definition: "The daily energy intake goal, adjusted for your maintenance needs plus or minus a surplus or deficit for your goal." },
      { term: "Nutrient partitioning", definition: "How the body directs nutrients toward muscle building, fat storage, or energy use. This varies between individuals." },
      { term: "TDEE", definition: "Total Daily Energy Expenditure — the total calories you burn in a day, including rest and activity." },
    ],
    scenarios: [
      {
        title: "Weight-loss macro adjustment",
        situation: "A person lowers their calorie target by 500 calories for gradual weight loss.",
        analysis: "The calculator keeps protein relatively high to help preserve muscle during a deficit, then fills the remainder with carbs and fat. The exact split works for many people but is not a perfect prescription for everyone.",
      },
      {
        title: "Muscle-gain approach",
        situation: "A person adds 300 calories above maintenance and keeps protein at 1.8g per kg of body weight.",
        analysis: "The surplus provides energy for training, while the higher protein supports muscle repair. Same as weight loss, the ideal surplus and protein level vary by individual and training intensity.",
      },
      {
        title: "Changing protein needs",
        situation: "Two people of the same weight have different activity levels.",
        analysis: "The calculator uses a fixed protein-per-kg multiplier. A highly active person or serious athlete may benefit from a higher protein ratio than the default, so it is a solid starting point rather than a rule.",
      },
      {
        title: "Macro targets vs calorie targets",
        situation: "A user tracks grams and a different user tracks only calories.",
        analysis: "Macro targets break a calorie goal into total food groups; calorie-only tracking is simpler but may not cover protein needs. Choosing the method that fits your lifestyle is the most sustainable approach.",
      },
    ],
    relatedConcepts: [
      {
        title: "Basal metabolic rate",
        explanation: "Your BMR sets the resting foundation for your calorie target before macro splits are applied.",
        calculatorSlug: "bmr-calculator",
      },
      {
        title: "Daily calorie needs",
        explanation: "Macros build on your estimated total calorie needs, so understanding TDEE helps you interpret the grams.",
        calculatorSlug: "calorie-calculator",
      },
      {
        title: "Body composition",
        explanation: "Lean mass affects calorie needs and protein requirements. A body-fat estimate gives context for how your macro targets relate to muscle.",
        calculatorSlug: "body-fat-calculator",
      },
      {
        title: "Ideal weight range",
        explanation: "Your reference range from an ideal-weight tool can help you choose which macro goal to focus on first.",
        calculatorSlug: "ideal-weight-calculator",
      },
    ],
  },

  relatedCalculators: ["protein", "calorie", "tdee", "bmr"],
  seo: {
    title: "Macro Calculator – Daily Protein, Carbs & Fat Targets",
    description: "Calculate your daily macro targets for protein, carbs and fat. Based on your body metrics and fitness goal. Free and instant.",
    keywords: ["macro calculator", "macronutrient calculator", "protein carbs fat"],
    primaryIntent: "Calculate daily macro targets",
    secondaryIntents: ["Protein carb fat split", "Macros for fitness goals"],
  },
};