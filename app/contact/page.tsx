import { buildMetadata } from "@/lib/seo/metadata";
import { SectionHeading, Paragraph } from "@/components/content/blocks";

export const metadata = buildMetadata({
  title: "Contact Shankhya – Questions, Suggestions & Corrections",
  description:
    "Contact Shankhya with questions, suggestions or corrections. We read every message and use your feedback to improve our calculators.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-content">
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="h1 text-balance">Contact</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Found an error? Have a suggestion for a new calculator? We read every message.
        </p>

        <SectionHeading>What to include</SectionHeading>
        <Paragraph>
          To help us respond quickly, please include:
        </Paragraph>
        <ul className="mt-3 space-y-2">
          {[
            "The calculator or page you are referring to",
            "The values you entered",
            "The result you expected vs. what you saw",
            "Any error messages you encountered",
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

        <SectionHeading>Email</SectionHeading>
        <Paragraph>
          You can reach us at{" "}
          <a
            href="mailto:hello@Shankhya.example.com"
            className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            hello@Shankhya.example.com
          </a>
          .
        </Paragraph>

        <SectionHeading>Response time</SectionHeading>
        <Paragraph>
          We aim to respond to all messages within 3–5 business days. For urgent issues, please
          include &ldquo;URGENT&rdquo; in the subject line.
        </Paragraph>
      </div>
    </div>
  );
}