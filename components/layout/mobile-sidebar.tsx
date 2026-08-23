"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { categories, getCalculatorsByCategory } from "@/lib/calculators/registry";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - navigation only, no branding */}
      <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col border-l border-border bg-page dark:border-dark-border dark:bg-dark-page">
        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
          <nav className="space-y-1 p-3" aria-label="Mobile">
            {/* Calculators - direct link to all calculators */}
            <Link
              href="/calculators"
              onClick={onClose}
              className="block rounded-lg px-3 py-3 text-base font-medium text-text-primary hover:bg-surface-secondary dark:text-dark-text-primary dark:hover:bg-dark-secondary"
            >
              Calculators
            </Link>

            {/* Categories accordion */}
            <div>
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-text-primary hover:bg-surface-secondary dark:text-dark-text-primary dark:hover:bg-dark-secondary"
                aria-expanded={categoriesOpen}
              >
                Categories
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-150 ${categoriesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {categoriesOpen && (
                <div className="mt-1 space-y-1 pl-3">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <div className="flex items-center">
                        {/* Category name navigates */}
                        <Link
                          href={`/calculators/${cat.slug}`}
                          onClick={onClose}
                          className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
                        >
                          {cat.name}
                        </Link>
                        {/* Chevron expands/collapses */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCat(expandedCat === cat.id ? null : cat.id);
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-muted dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
                          aria-expanded={expandedCat === cat.id}
                          aria-label={`${expandedCat === cat.id ? "Collapse" : "Expand"} ${cat.name} calculators`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-150 ${
                              expandedCat === cat.id ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      {expandedCat === cat.id && (
                        <div className="mt-1 space-y-0.5 pl-3">
                          {getCalculatorsByCategory(cat.id).map((calc) => (
                            <Link
                              key={calc.id}
                              href={`/calculators/${calc.slug}`}
                              onClick={onClose}
                              className="block rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-secondary dark:hover:text-dark-text-primary"
                            >
                              {calc.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <Link
              href="/about"
              onClick={onClose}
              className="block rounded-lg px-3 py-3 text-base font-medium text-text-secondary hover:bg-surface-secondary dark:text-dark-text-secondary dark:hover:bg-dark-secondary"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}