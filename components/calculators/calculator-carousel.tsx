"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { getCalculatorIcon } from "@/lib/icons/calculator-icons";

export interface CarouselCalculator {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
}

interface CalculatorCarouselProps {
  calculators: CarouselCalculator[];
  label?: string;
}

const categoryAccents: Record<string, string> = {
  finance: "text-accent-600 dark:text-accent-400",
  education: "text-accent-600 dark:text-accent-400",
  health: "text-accent-600 dark:text-accent-400",
  "date-time": "text-accent-600 dark:text-accent-400",
};

const categoryBackgrounds: Record<string, string> = {
  finance: "bg-accent-50 dark:bg-accent-950/50",
  education: "bg-accent-50 dark:bg-accent-950/50",
  health: "bg-accent-50 dark:bg-accent-950/50",
  "date-time": "bg-accent-50 dark:bg-accent-950/50",
};

const categoryNames: Record<string, string> = {
  finance: "Finance",
  education: "Education",
  health: "Health",
  "date-time": "Date & Time",
};

export function CalculatorCarousel({ calculators, label = "Popular calculators" }: CalculatorCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl dark:text-dark-text-primary">
          {label}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            disabled={!canScrollLeft}
            aria-label="Previous calculators"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-accent-300 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-accent-700 dark:hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            disabled={!canScrollRight}
            aria-label="Next calculators"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-accent-300 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-secondary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-accent-700 dark:hover:text-accent-400"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {calculators.map((calc) => {
          const Icon = getCalculatorIcon(calc.id);
          const accentColor = categoryAccents[calc.category] ?? "text-accent-600";
          const accentBg = categoryBackgrounds[calc.category] ?? "bg-accent-50";
          const categoryName = categoryNames[calc.category] ?? "Calculator";
          return (
            <Link
              key={calc.id}
              href={`/calculators/${calc.slug}`}
              className="group relative flex w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card dark:border-dark-border dark:bg-dark-surface dark:hover:border-accent-800 min-[400px]:w-[280px] sm:w-[300px]"
            >
              <div className="flex items-start justify-between">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${accentColor}`}>
                  {categoryName}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent-600 dark:text-dark-text-muted dark:group-hover:text-accent-400"
                  aria-hidden="true"
                />
              </div>

              <div className={`mt-4 flex h-10 w-10 items-center justify-center rounded-xl ${accentBg}`}>
                <Icon className={`h-5 w-5 ${accentColor}`} aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-tight text-text-primary dark:text-dark-text-primary">
                {calc.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {calc.shortDescription}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}