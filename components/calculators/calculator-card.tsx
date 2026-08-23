import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { getCategoryById } from "@/lib/calculators/registry";
import { calculatorIcons } from "@/lib/icons/calculator-icons";

export function CalculatorCard({ calculator }: { calculator: CalculatorDefinition }) {
  const category = getCategoryById(calculator.category);
  const accentColor = "text-accent-600 dark:text-accent-400";
  const accentBg = "bg-accent-50 dark:bg-accent-950/50";
  const Icon = calculatorIcons[calculator.id] ?? calculatorIcons.percentage;

  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card dark:border-dark-border dark:bg-dark-surface dark:hover:border-accent-800"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentBg}`}>
        <Icon className={`h-5 w-5 ${accentColor}`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary transition-colors group-hover:text-accent-700 dark:text-dark-text-primary dark:group-hover:text-accent-400">
            {calculator.name}
          </h3>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600 dark:text-dark-text-muted dark:group-hover:text-accent-400"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          {calculator.shortDescription}
        </p>
      </div>
    </Link>
  );
}