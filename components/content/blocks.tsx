/**
 * Reusable content blocks for calculator pages.
 */

import { AlertTriangle, Info, Lightbulb } from "lucide-react";

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="h2 mt-10 scroll-mt-20 first:mt-0">
      {children}
    </h2>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="h3 mt-8">{children}</h3>;
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary">
      {children}
    </p>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2.5 text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700 dark:bg-accent-900 dark:text-accent-200">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function FormulaBlock({ formula }: { formula: string }) {
  return (
    <div className="mt-4">
      <div className="formula-block whitespace-pre-line">{formula}</div>
    </div>
  );
}

export function VariablesTable({
  variables,
}: {
  variables: { symbol: string; name: string; description: string }[];
}) {
  return (
    <div className="table-wrap mt-4">
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="w-20">Symbol</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((v) => (
            <tr key={v.symbol}>
              <td className="font-mono font-semibold text-accent-700 dark:text-accent-400">
                {v.symbol}
              </td>
              <td className="font-medium">{v.name}</td>
              <td>{v.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExampleBlock({
  title,
  inputs,
  steps,
  result,
}: {
  title: string;
  inputs: Record<string, string | number>;
  steps: string[];
  result: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
      <div className="border-b border-border px-4 py-3 dark:border-dark-border">
        <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{title}</p>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(inputs).map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1 text-xs text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary"
            >
              <span className="font-medium text-text-primary dark:text-dark-text-primary">{key}:</span>
              {value}
            </span>
          ))}
        </div>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[10px] font-semibold text-accent-700 dark:bg-accent-900 dark:text-accent-200">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="rounded-lg bg-accent-50 px-4 py-3 dark:bg-accent-950">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-700 dark:text-accent-300">
            Result
          </p>
          <p className="mt-0.5 text-base font-semibold text-accent-900 dark:text-accent-100">
            {result}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const Icon = type === "warning" ? AlertTriangle : Info;
  return (
    <div className={`callout-${type} mt-4`}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <div className="mt-0.5 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <div className="mt-4 space-y-3">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="group rounded-lg border border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-text-primary transition-colors hover:text-accent-700 dark:text-dark-text-primary dark:hover:text-accent-400">
            {faq.question}
            <span className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-45 dark:text-dark-text-muted">
              +
            </span>
          </summary>
          <div className="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export function DefinitionBlock({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-lg border-l-2 border-accent-500 bg-surface-secondary px-4 py-3 dark:bg-dark-secondary">
      <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{term}</p>
      <div className="mt-1 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
        {children}
      </div>
    </div>
  );
}

export function TipBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg bg-surface-secondary px-4 py-3 dark:bg-dark-secondary">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-600 dark:text-accent-400" aria-hidden="true" />
      <div className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
        {children}
      </div>
    </div>
  );
}

export function GlossarySection({
  items,
}: {
  items: { term: string; definition: string }[];
}) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <details
          key={item.term}
          className="group rounded-lg border border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-text-primary transition-colors hover:text-accent-700 dark:text-dark-text-primary dark:hover:text-accent-400">
            {item.term}
            <span className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-45 dark:text-dark-text-muted">
              +
            </span>
          </summary>
          <div className="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-text-secondary dark:border-dark-border dark:text-dark-text-secondary">
            {item.definition}
          </div>
        </details>
      ))}
    </div>
  );
}

export function ScenariosSection({
  items,
}: {
  items: { title: string; situation: string; analysis: string }[];
}) {
  return (
    <div className="mt-4 space-y-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-lg border border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
        >
          <div className="border-b border-border px-4 py-3 dark:border-dark-border">
            <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{item.title}</p>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{item.situation}</p>
            <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
              <span className="font-medium text-accent-700 dark:text-accent-400">What it means: </span>
              {item.analysis}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RelatedConceptsSection({
  items,
}: {
  items: { title: string; explanation: string; calculatorSlug?: string }[];
}) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border border-border bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-surface">
          <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{item.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            {item.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CostBreakdownSection({
  items,
}: {
  items: { item: string; description: string; included: boolean }[];
}) {
  return (
    <div className="table-wrap mt-4">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Cost item</th>
            <th scope="col">Included</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.item}>
              <td className="font-medium">{row.item}</td>
              <td>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.included
                      ? "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200"
                      : "bg-surface-secondary text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary"
                  }`}
                >
                  {row.included ? "Included" : "Not included"}
                </span>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
