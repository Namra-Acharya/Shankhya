import { buildMetadata } from "@/lib/seo/metadata";
import { SectionHeading, Paragraph, List, OrderedList } from "@/components/content/blocks";

export const metadata = buildMetadata({
  title: "Methodology – How Shankhya Calculators Are Built",
  description:
    "Learn how Shankhya develops, tests and reviews its calculators. Transparent formulas, verified calculations and honest limitations.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <div className="container-content">
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="h1 text-balance">Methodology</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Every calculator on Shankhya is built with the same transparent process. Here is exactly
          how we develop, verify and maintain our tools.
        </p>

        <SectionHeading>How formulas are selected</SectionHeading>
        <Paragraph>
          Each calculator starts with a genuine user need. We identify the primary question people
          ask and select the standard formula that best answers it. Formulas come from established
          sources:
        </Paragraph>
        <List
          items={[
            "Standard financial formulas (e.g., the reducing-balance EMI formula)",
            "Internationally recognized date and calendar conventions",
            "Common grading and percentage systems used in education",
            "Publicly published mathematical and statistical methods",
          ]}
        />

        <SectionHeading>How calculations are tested</SectionHeading>
        <Paragraph>
          Every calculation function is independently testable and covered by automated tests. Each
          calculator is tested with:
        </Paragraph>
        <List
          items={[
            "Normal values – typical inputs users would enter",
            "Zero and negative values where mathematically relevant",
            "Decimal values and high-precision inputs",
            "Very large and very small boundary values",
            "Invalid and missing inputs to verify error handling",
            "Date-specific edge cases like leap years and month-end dates",
          ]}
        />

        <SectionHeading>How edge cases are handled</SectionHeading>
        <Paragraph>
          Date calculators handle leap years, month boundaries, year boundaries, same-date inputs,
          reverse-date inputs and end-of-month cases. Financial calculators handle zero interest
          rates, rounding precision and payment boundaries. Education calculators handle credit
          weighting, zero marks and decimal grades.
        </Paragraph>

        <SectionHeading>How content is reviewed</SectionHeading>
        <Paragraph>
          Each calculator page includes content that answers real questions. Before publishing, every
          page is checked against our quality standards:
        </Paragraph>
        <List
          items={[
            "Accuracy – does the formula produce the correct result?",
            "Clarity – can a person understand the result without a math degree?",
            "Completeness – are assumptions, limitations and edge cases explained?",
            "Originality – is the content unique and not copied from competitors?",
            "Usefulness – does the page answer the question a real person asked?",
          ]}
        />

        <SectionHeading>How updates are handled</SectionHeading>
        <Paragraph>
          Calculators are reviewed when:
        </Paragraph>
        <List
          items={[
            "A user reports an error or confusing behavior",
            "A formula or convention changes (e.g., tax rate changes)",
            "A new edge case is discovered",
            "Browser or platform compatibility issues arise",
          ]}
        />

        <SectionHeading>Our review checklist</SectionHeading>
        <Paragraph>
          Every new calculator must pass a 20-point checklist covering purpose, accuracy, inputs,
          results, content completeness, SEO, accessibility, mobile quality and performance.
        </Paragraph>

        <SectionHeading>Limitations of our tools</SectionHeading>
        <Paragraph>
          Shankhya calculators are educational tools. They provide estimates and explanations, not
          professional advice. Financial results may differ from actual lender quotes due to fees,
          rounding conventions and policy variations. Medical or health-related calculators cannot
          replace evaluation by a qualified professional.
        </Paragraph>
      </div>
    </div>
  );
}