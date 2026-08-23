import Link from "next/link";

import { CalculatorSearch } from "@/components/search/calculator-search";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { getPopularCalculators } from "@/lib/calculators/registry";

export default function NotFound() {
  const popular = getPopularCalculators(3);

  return (
    <div className="container-content">
      <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-accent-600 dark:text-accent-400">
          404
        </p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl dark:text-dark-text-primary">
          {`That calculation doesn't exist.`}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          {`The page you're looking for may have moved or never existed. Try searching for what`}
          you need.
        </p>

        <div className="mx-auto mt-8 max-w-xl text-left">
          <CalculatorSearch />
        </div>

        {popular.length > 0 && (
          <div className="mt-12 text-left">
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              Popular calculators
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {popular.map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
            </div>
          </div>
        )}

        <Link
          href="/"
          className="btn-primary mt-12"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}