import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { CalculatorSearch } from "@/components/search/calculator-search";
import { CalculatorCarousel, type CarouselCalculator } from "@/components/calculators/calculator-carousel";
import { getCalculatorsByCategory, getPopularCalculators, getCategoryById } from "@/lib/calculators/registry";
import { getCategoryIcon } from "@/lib/icons/calculator-icons";
import { buildMetadata } from "@/lib/seo/metadata";
import type { CalculatorDefinition } from "@/lib/calculators/types";

function toCarouselData(calc: CalculatorDefinition): CarouselCalculator {
  return {
    id: calc.id,
    name: calc.name,
    slug: calc.slug,
    category: calc.category,
    shortDescription: calc.shortDescription,
  };
}

export const metadata = buildMetadata({
  title: "Free Online Calculators – Finance, Health, Math & More",
  description:
    "Free online calculators for finance, health, math, construction, education and everyday decisions. Fast, accurate and easy to use with clear explanations.",
  path: "/",
});

// Editorial popularity ranking
const POPULAR_ORDER = [
  "percentage", "bmi", "age", "loan", "emi", "compound-interest", "gpa", "calorie", "sip", "cgpa", "bmr", "gst",
];

export default function HomePage() {
  const allCalculators = getPopularCalculators(40);
  const popular = POPULAR_ORDER
    .map((id) => allCalculators.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 12)
    .map(toCarouselData);

  const math = getCalculatorsByCategory("math");
  const finance = getCalculatorsByCategory("finance");
  const education = getCalculatorsByCategory("education");
  const health = getCalculatorsByCategory("health");

  const categorySections = [
    { id: "math", category: getCategoryById("math"), calculators: math },
    { id: "finance", category: getCategoryById("finance"), calculators: finance },
    { id: "education", category: getCategoryById("education"), calculators: education },
    { id: "health", category: getCategoryById("health"), calculators: health },
  ];

  return (
    <div className="container-content">
      {/* Hero */}
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary">
            <Sparkles className="h-3 w-3 text-accent-500" aria-hidden="true" />
            Simple calculations. Clear answers.
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-balance text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl dark:text-dark-text-primary"
          >
            Calculate with clarity.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            Fast, accurate calculators for the numbers that matter.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <CalculatorSearch />
          </div>
        </div>
      </section>

      {/* Popular calculators carousel */}
      <section className="py-8" aria-labelledby="popular-heading">
        <CalculatorCarousel calculators={popular} label="Popular calculators" />
      </section>

      {/* Featured calculator */}
      <section className="py-10" aria-labelledby="featured-heading">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                Featured
              </p>
              <h2 id="featured-heading" className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl dark:text-dark-text-primary">
                Age Calculator
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                Calculate your exact age from your date of birth. See years, months, days and your next birthday.
              </p>
              <Link
                href="/calculators/age-calculator"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Open calculator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex items-center justify-center rounded-xl bg-surface-secondary p-8 dark:bg-dark-secondary">
              <div className="text-center">
                <p className="text-sm text-text-muted dark:text-dark-text-muted">Example result</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-accent-600 dark:text-accent-400">
                  31 years
                </p>
                <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                  4 months, 26 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categorySections.map(({ id, category, calculators }) => {
        if (!category) return null;
        const Icon = getCategoryIcon(category.id);
        return (
          <section key={id} className="py-10" aria-labelledby={`${id}-heading`}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent-600 dark:text-accent-400" aria-hidden="true" />
                  <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight text-text-primary dark:text-dark-text-primary">
                    {category.name}
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-text-secondary dark:text-dark-text-secondary">
                  {category.shortDescription}
                </p>
              </div>
              <Link
                href={`/calculators/${category.slug}`}
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-600 transition-colors hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Explore all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            <CalculatorCarousel calculators={calculators.slice(0, 6).map(toCarouselData)} label={`${category.name} calculators`} />
          </section>
        );
      })}

      {/* Need something else? */}
      <section className="py-10" aria-labelledby="discovery-heading">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-950/50">
            <Search className="h-5 w-5 text-accent-600 dark:text-accent-400" aria-hidden="true" />
          </div>
          <h2 id="discovery-heading" className="mt-4 text-xl font-semibold tracking-tight text-text-primary dark:text-dark-text-primary">
            {`Can't find the calculation?`}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary dark:text-dark-text-secondary">
            Search all calculators or explore categories to find the tool you need.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <CalculatorSearch />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categorySections.map(({ category }) => (
              <Link
                key={category!.id}
                href={`/calculators/${category!.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-300 hover:text-accent-600 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-accent-700 dark:hover:text-accent-400"
              >
                {category!.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compact trust */}
      <section className="py-8" aria-labelledby="trust-heading">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: "Fast and instant", text: "Calculations run locally in your browser." },
            { title: "Transparent formulas", text: "Every result shows the formula and steps." },
            { title: "Clear explanations", text: "Understand what your result means." },
          ].map((item) => (
            <div key={item.title}>
              <h2 id="trust-heading" className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}