/**
 * Content Depth Audit
 * Measures current informational content for every calculator.
 * Run with: npx tsx scripts/content-audit.ts
 */

import { getAllCalculators, categories } from "../lib/calculators/registry";
import type { CalculatorDefinition } from "../lib/calculators/types";

function countWords(text: string): number {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function measureCalculatorContent(calc: CalculatorDefinition) {
  const c = calc.content;
  let words = 0;

  // Summary
  words += countWords(c.summary);

  // How to use
  for (const step of c.howToUse) words += countWords(step);

  // Interpretation
  words += countWords(c.interpretation);

  // Formula
  if (c.formula) words += countWords(c.formula);

  // Variables
  for (const v of c.variables ?? []) {
    words += countWords(v.name) + countWords(v.description);
  }

  // Example
  if (c.example) {
    words += countWords(c.example.title);
    for (const step of c.example.steps) words += countWords(step);
    words += countWords(c.example.result);
  }

  // Factors
  for (const f of c.factors ?? []) words += countWords(f);

  // Edge cases
  for (const e of c.edgeCases ?? []) words += countWords(e);

  // Common mistakes
  for (const m of c.commonMistakes ?? []) words += countWords(m);

  // Assumptions
  for (const a of c.assumptions ?? []) words += countWords(a);

  // Limitations
  for (const l of c.limitations ?? []) words += countWords(l);

  // FAQs
  for (const faq of c.faqs ?? []) {
    words += countWords(faq.question) + countWords(faq.answer);
  }

  return words;
}

function main() {
  const all = getAllCalculators();
  console.log("=== SHANKHYA CALCULATOR CONTENT INVENTORY ===\n");
  console.log(`Total calculators: ${all.length}`);
  console.log(`Total categories: ${categories.length}\n`);

  let totalWords = 0;
  const rows: { name: string; slug: string; category: string; words: number }[] = [];

  for (const calc of all) {
    const words = measureCalculatorContent(calc);
    totalWords += words;
    rows.push({
      name: calc.name,
      slug: calc.slug,
      category: calc.category,
      words,
    });
  }

  rows.sort((a, b) => a.words - b.words);

  console.log("Thinnest calculators first:\n");
  for (const row of rows) {
    const min = row.words * 2;
    console.log(
      `  ${row.name.padEnd(35)} ${row.category.padEnd(12)} ${String(row.words).padStart(5)} words  →  target ≥ ${min}`
    );
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Total informational words across all calculators: ${totalWords}`);
  console.log(`Average words per calculator: ${Math.round(totalWords / all.length)}`);
  console.log(`Target total (2×): ${totalWords * 2}`);

  const categoriesMap = new Map<string, { count: number; words: number }>();
  for (const row of rows) {
    const existing = categoriesMap.get(row.category) ?? { count: 0, words: 0 };
    existing.count++;
    existing.words += row.words;
    categoriesMap.set(row.category, existing);
  }
  console.log("\nBy category:");
  for (const [cat, data] of categoriesMap) {
    console.log(`  ${cat.padEnd(12)} ${data.count.toString().padStart(3)} calcs  ${String(data.words).padStart(6)} words  avg ${Math.round(data.words / data.count)}`);
  }
}

main();