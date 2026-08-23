import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CalculatorForm } from "@/components/calculators/calculator-form";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { CalculatorSearch } from "@/components/search/calculator-search";
import {
  categories,
  getAllCalculators,
  getCalculator,
  getCategory,
  getCategoryById,
  getRelatedCalculators,
  getCalculatorsByCategory,
} from "@/lib/calculators/registry";
import {
  buildMetadata,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildFAQSchema,
} from "@/lib/seo/metadata";
import {
  SectionHeading,
  SubHeading,
  Paragraph,
  List,
  OrderedList,
  FormulaBlock,
  VariablesTable,
  ExampleBlock,
  Callout,
  FAQSection,
  GlossarySection,
  ScenariosSection,
  RelatedConceptsSection,
  CostBreakdownSection,
} from "@/components/content/blocks";

interface CalculatorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const calculatorSlugs = getAllCalculators().map((calc) => ({ slug: calc.slug }));
  const categorySlugs = categories.map((cat) => ({ slug: cat.slug }));
  return [...calculatorSlugs, ...categorySlugs];
}

export async function generateMetadata({ params }: CalculatorPageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (calculator) {
    return buildMetadata({
      title: calculator.seo.title,
      description: calculator.seo.description,
      path: `/calculators/${calculator.slug}`,
    });
  }

  const category = getCategory(slug);
  if (category) {
    return buildMetadata({
      title: category.seo.title,
      description: category.seo.description,
      path: `/calculators/${category.slug}`,
    });
  }

  return buildMetadata({
    title: "Calculator Not Found",
    description: "This calculator does not exist.",
    path: `/calculators/${slug}`,
    noindex: true,
  });
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);

  // Category page
  if (!calculator) {
    const category = getCategory(slug);
    if (!category) notFound();

    const catCalculators = getCalculatorsByCategory(category.id);
    const relatedCategories = category.relatedCategories
      .map((id) => getCategoryById(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators" },
      { name: category.name, path: `/calculators/${category.slug}` },
    ]);

    const webPageSchema = buildWebPageSchema({
      title: category.seo.title,
      description: category.seo.description,
      path: `/calculators/${category.slug}`,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />

        <div className="container-content">
          <nav aria-label="Breadcrumb" className="breadcrumb pt-6">
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator" aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
            <Link href="/calculators" className="breadcrumb-link">Calculators</Link>
            <span className="breadcrumb-separator" aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
            <span aria-current="page" className="text-text-primary dark:text-dark-text-primary">
              {category.name}
            </span>
          </nav>

          <div className="mt-6 max-w-3xl">
            <h1 className="h1 text-balance">{category.name} Calculators</h1>
            <p className="mt-3 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
              {category.description}
            </p>
          </div>

          <div className="mt-8 max-w-xl">
            <CalculatorSearch />
          </div>

          <div className="mt-10">
            <h2 className="h2">All {category.name} calculators</h2>
            {catCalculators.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catCalculators.map((calc) => (
                  <CalculatorCard key={calc.id} calculator={calc} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-border bg-surface p-8 text-center dark:border-dark-border dark:bg-dark-surface">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {category.name} calculators are being added. Check back soon.
                </p>
              </div>
            )}
          </div>

          {relatedCategories.length > 0 && (
            <div className="mt-12">
              <h2 className="h2">Related categories</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/calculators/${cat.slug}`}
                    className="group rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:border-accent-300 hover:shadow-sm dark:border-dark-border dark:bg-dark-surface dark:hover:border-accent-700"
                  >
                    <h3 className="text-sm font-semibold text-text-primary transition-colors group-hover:text-accent-700 dark:text-dark-text-primary dark:group-hover:text-accent-400">
                      {cat.name} Calculators
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                      {cat.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Calculator page
  const category = getCategoryById(calculator.category);
  const relatedCalculators = getRelatedCalculators(calculator);
  const categoryCalculators = category
    ? getCalculatorsByCategory(category.id).filter((c) => c.id !== calculator.id)
    : [];
  const content = calculator.content;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: category?.name ?? "Calculators", path: `/calculators/${category?.slug ?? ""}` },
    { name: calculator.name, path: `/calculators/${calculator.slug}` },
  ]);

  const webPageSchema = buildWebPageSchema({
    title: calculator.seo.title,
    description: calculator.seo.description,
    path: `/calculators/${calculator.slug}`,
  });

  const faqSchema = content.faqs ? buildFAQSchema(content.faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container-content">
        <nav aria-label="Breadcrumb" className="breadcrumb pt-6">
          <Link href="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
          {category && (
            <>
              <Link href={`/calculators/${category.slug}`} className="breadcrumb-link">
                {category.name}
              </Link>
              <span className="breadcrumb-separator" aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </>
          )}
          <span aria-current="page" className="text-text-primary dark:text-dark-text-primary">
            {calculator.name}
          </span>
        </nav>

        <div className="mt-6 max-w-3xl">
          <h1 className="h1 text-balance">{calculator.name}</h1>
          <p className="mt-2 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            {content.summary}
          </p>
        </div>

        <div className="mt-8">
          <CalculatorForm slug={calculator.slug} />
        </div>

        <div className="mt-10 max-w-3xl">
          <SectionHeading id="what-the-result-means">What the result means</SectionHeading>
          <Paragraph>{content.interpretation}</Paragraph>
        </div>

        <div className="mt-6 max-w-3xl">
          <SectionHeading id="how-to-use">How to use this calculator</SectionHeading>
          <OrderedList items={content.howToUse} />
        </div>

        {content.formula && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="formula">The formula</SectionHeading>
            <Paragraph>
              The calculation uses a standard, verifiable formula. Here it is in its simplest form.
            </Paragraph>
            <FormulaBlock formula={content.formula} />
            {content.variables && content.variables.length > 0 && (
              <>
                <SubHeading>What each variable means</SubHeading>
                <VariablesTable variables={content.variables} />
              </>
            )}
          </div>
        )}

        {content.example && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="example">Step-by-step example</SectionHeading>
            <ExampleBlock
              title={content.example.title}
              inputs={content.example.inputs}
              steps={content.example.steps}
              result={content.example.result}
            />
          </div>
        )}

        {content.factors && content.factors.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="factors">What changes the result</SectionHeading>
            <List items={content.factors} />
          </div>
        )}

        {content.edgeCases && content.edgeCases.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="edge-cases">Edge cases to be aware of</SectionHeading>
            <Callout type="info" title="Unusual situations handled correctly">
              <ul className="space-y-2">
                {content.edgeCases.map((edge, i) => (
                  <li key={i}>{edge}</li>
                ))}
              </ul>
            </Callout>
          </div>
        )}

        {content.commonMistakes && content.commonMistakes.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="common-mistakes">Common mistakes</SectionHeading>
            <Callout type="warning" title="Avoid these errors">
              <ul className="space-y-2">
                {content.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </Callout>
          </div>
        )}

        {(content.assumptions || content.limitations) && (
          <div className="mt-6">
            <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
              {content.assumptions && content.assumptions.length > 0 && (
                <div>
                  <SectionHeading id="assumptions">Assumptions</SectionHeading>
                  <List items={content.assumptions} />
                </div>
              )}
              {content.limitations && content.limitations.length > 0 && (
                <div>
                  <SectionHeading id="limitations">Limitations</SectionHeading>
                  <List items={content.limitations} />
                </div>
              )}
            </div>
          </div>
        )}

        {content.glossary && content.glossary.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="glossary">Key terms to know</SectionHeading>
            <GlossarySection items={content.glossary} />
          </div>
        )}

        {content.scenarios && content.scenarios.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="scenarios">Real-world scenarios</SectionHeading>
            <ScenariosSection items={content.scenarios} />
          </div>
        )}

        {content.relatedConcepts && content.relatedConcepts.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="related-concepts">Related concepts</SectionHeading>
            <RelatedConceptsSection items={content.relatedConcepts} />
          </div>
        )}

        {content.costBreakdown && content.costBreakdown.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="cost-breakdown">What this estimate includes</SectionHeading>
            <CostBreakdownSection items={content.costBreakdown} />
          </div>
        )}

        {content.faqs && content.faqs.length > 0 && (
          <div className="mt-6 max-w-3xl">
            <SectionHeading id="faq">Frequently asked questions</SectionHeading>
            <FAQSection faqs={content.faqs} />
          </div>
        )}

        <div className="mt-12">
          <SectionHeading id="related-calculators">Related calculators</SectionHeading>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCalculators.map((calc) => (
              <CalculatorCard key={calc.id} calculator={calc} />
            ))}
            {relatedCalculators.length === 0 &&
              categoryCalculators.slice(0, 3).map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
          </div>
        </div>

        {categoryCalculators.length > 0 && (
          <div className="mt-10">
            <SectionHeading id="more-in-category">
              More {category?.name} calculators
            </SectionHeading>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCalculators.slice(0, 3).map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
            </div>
          </div>
        )}

        {category && (
          <div className="mt-10 border-t border-border pt-6 dark:border-dark-border">
            <Link
              href={`/calculators/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 transition-colors hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
            >
              View all {category.name} calculators
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}