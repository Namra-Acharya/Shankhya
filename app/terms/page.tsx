import { buildMetadata } from "@/lib/seo/metadata";
import { SectionHeading, Paragraph } from "@/components/content/blocks";

export const metadata = buildMetadata({
  title: "Terms of Use – Shankhya",
  description:
    "Read the Shankhya terms of use. Understand how our calculators may be used and their limitations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-content">
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="h1 text-balance">Terms of Use</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Last updated: August 2026
        </p>

        <SectionHeading>1. Acceptance of terms</SectionHeading>
        <Paragraph>
          By accessing or using Shankhya, you agree to these terms. If you do not agree, please do
          not use the site.
        </Paragraph>

        <SectionHeading>2. Nature of the service</SectionHeading>
        <Paragraph>
          Shankhya provides online calculators and educational content. The calculators are tools
          for estimation and education. They are not professional financial, legal, medical, or
          engineering services.
        </Paragraph>

        <SectionHeading>3. No professional advice</SectionHeading>
        <Paragraph>
          Results from our calculators should not be the sole basis for significant decisions.
          Consult a qualified professional for financial, legal, health, or engineering matters.
        </Paragraph>

        <SectionHeading>4. Accuracy</SectionHeading>
        <Paragraph>
          We work to keep our calculators accurate and our formulas correct. However, we do not
          guarantee that results are error-free or suitable for any particular purpose.
        </Paragraph>

        <SectionHeading>5. Acceptable use</SectionHeading>
        <Paragraph>
          You agree not to:
        </Paragraph>
        <ul className="mt-3 space-y-2">
          {[
            "Use the site to mislead others or provide false information",
            "Attempt to disrupt, overload, or compromise the site",
            "Scrape or mass-copy content without permission",
            "Use the site for unlawful purposes",
          ].map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-base leading-relaxed text-text-secondary dark:text-dark-text-secondary"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <SectionHeading>6. Intellectual property</SectionHeading>
        <Paragraph>
          {`The content, design, and code on Shankhya are protected by applicable intellectual property laws. You may use the calculators for personal purposes but not reproduce the site's content at scale without permission.`}
        </Paragraph>

        <SectionHeading>7. Limitation of liability</SectionHeading>
        <Paragraph>
          Shankhya is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest
          extent permitted by law, we are not liable for damages arising from use of the site.
        </Paragraph>

        <SectionHeading>8. Changes to these terms</SectionHeading>
        <Paragraph>
          We may update these terms from time to time. Continued use of the site after changes means
          you accept the updated terms.
        </Paragraph>

        <SectionHeading>9. Contact</SectionHeading>
        <Paragraph>
          Questions about these terms? Contact us at{" "}
          <a
            href="mailto:legal@Shankhya.example.com"
            className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            legal@Shankhya.example.com
          </a>
          .
        </Paragraph>
      </div>
    </div>
  );
}