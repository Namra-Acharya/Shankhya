import { CalculatorCard } from "@/components/calculators/calculator-card";
import { CalculatorSearch } from "@/components/search/calculator-search";
import { categories, getAllCalculators } from "@/lib/calculators/registry";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "All Calculators – Free Online Calculation Tools",
  description:
    "Browse all free calculators at Shankhya. Age, EMI, loans, percentages, dates and more. Clear tools with clear explanations.",
  path: "/calculators",
});

export default function AllCalculatorsPage() {
  const calculators = getAllCalculators();

  return (
    <div className="container-content">
      <div className="mt-10 max-w-3xl">
        <h1 className="h1 text-balance">All Calculators</h1>
        <p className="mt-3 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Every calculator on Shankhya, organized by category. Search for what you need or browse
          below.
        </p>
      </div>

      <div className="mt-8 max-w-xl">
        <CalculatorSearch />
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const catCalculators = calculators.filter((c) => c.category === cat.id);
        if (catCalculators.length === 0) return null;
        return (
          <section key={cat.id} className="mt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="h2">{cat.name} Calculators</h2>
              <a
                href={`/calculators/${cat.slug}`}
                className="text-sm font-medium text-accent-700 transition-colors hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
              >
                View all →
              </a>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catCalculators.map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}