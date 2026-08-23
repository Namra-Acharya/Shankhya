"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/providers/theme-provider";
import { Logo } from "@/components/layout/logo";
import { categories, getCalculatorsByCategory } from "@/lib/calculators/registry";
import { CalculatorSearch } from "@/components/search/calculator-search";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCategoriesOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Close mobile menu + dropdowns on route change
  // Uses the "adjust state when props change" pattern (React docs)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setCategoriesOpen(false);
    setSearchOpen(false);
  }

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ONLY toggles the sidebar. Never navigates.
  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  const currentCategory = categories.find((c) => isActive(`/calculators/${c.slug}`));

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border bg-page/80 backdrop-blur-md dark:border-dark-border dark:bg-dark-page/80">
      <nav className="container-content flex h-16 items-center justify-between gap-3 sm:h-[72px]" aria-label="Main">
        {/* Logo - navigates to home */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Shankhya home">
          <Logo size={32} showWordmark />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/calculators"
            className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
              isActive("/calculators") && !currentCategory
                ? "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
            }`}
          >
            Calculators
          </Link>

          {/* Categories dropdown */}
          <div ref={categoriesRef} className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                currentCategory
                  ? "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
              }`}
              aria-expanded={categoriesOpen}
              aria-controls="categories-menu"
              aria-haspopup="true"
            >
              Categories
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-150 ${categoriesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {categoriesOpen && (
              <div
                id="categories-menu"
                className="absolute left-0 top-full z-50 mt-2 w-[720px] rounded-xl border border-border bg-surface p-5 shadow-lg shadow-black/5 dark:border-dark-border dark:bg-dark-surface dark:shadow-black/20"
              >
                <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                  {categories.map((cat) => {
                    const catCalcs = getCalculatorsByCategory(cat.id).slice(0, 4);
                    const isCurrent = currentCategory?.id === cat.id;
                    return (
                      <div key={cat.id}>
                        <Link
                          href={`/calculators/${cat.slug}`}
                          className={`mb-2 block text-xs font-semibold uppercase tracking-wider transition-colors ${
                            isCurrent
                              ? "text-accent-700 dark:text-accent-400"
                              : "text-text-muted hover:text-text-primary dark:text-dark-text-muted dark:hover:text-dark-text-primary"
                          }`}
                        >
                          {cat.name}
                        </Link>
                        <ul className="space-y-1">
                          {catCalcs.map((calc) => (
                            <li key={calc.id}>
                              <Link
                                href={`/calculators/${calc.slug}`}
                                className="block rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
                              >
                                {calc.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 border-t border-border pt-3 dark:border-dark-border">
                  <Link
                    href="/calculators"
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-950/50"
                  >
                    <span>View all calculators</span>
                    <span className="text-xs text-text-muted transition-transform group-hover:translate-x-0.5 dark:text-dark-text-muted">
                      Explore the complete library →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
              isActive("/about")
                ? "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
            }`}
          >
            About
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Desktop search - always visible on lg+ */}
          <div ref={searchRef} className="relative hidden lg:block">
            <div className="w-56">
              <CalculatorSearch />
            </div>
          </div>

          {/* Mobile search toggle */}
          <div className="relative lg:hidden">
            {searchOpen ? (
              <div className="absolute right-0 top-1/2 z-50 w-64 -translate-y-1/2">
                <CalculatorSearch autoFocus />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
                aria-label="Search calculators"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Mobile hamburger - ONLY toggles the sidebar. NO navigation. */}
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary lg:hidden dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

    </header>

    {/* Mobile sidebar - rendered OUTSIDE header as true viewport overlay */}
    <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
