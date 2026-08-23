import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { categories } from "@/lib/calculators/registry";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
      <div className="container-content py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center">
              <Logo size={32} />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-text-secondary dark:text-dark-text-secondary">
              A calm, precise calculation platform. Clear tools, clear results, clear explanations.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              Category
            </h2>
            <ul className="mt-3 space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/calculators/${cat.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                  >
                    {cat.name} Calculators
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              Company
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              Legal
            </h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-secondary transition-colors hover:text-accent-700 dark:text-dark-text-secondary dark:hover:text-accent-400"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 dark:border-dark-border">
          <p className="text-xs text-text-muted dark:text-dark-text-muted">
            © {year} Shankhya. Calculators are provided for informational purposes and do not
            constitute professional financial, legal, or medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}