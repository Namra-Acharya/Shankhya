import { buildMetadata } from "@/lib/seo/metadata";
import { SectionHeading, Paragraph, List } from "@/components/content/blocks";

export const metadata = buildMetadata({
  title: "About Shankhya – A Calm Calculation Platform",
  description:
    "Learn about Shankhya, a calculation platform built for clarity. Transparent formulas, tested calculations, and clear explanations.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-content">
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="h1 text-balance">About Shankhya</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Shankhya is a calculation platform built on a simple idea: the answer should be easy to
          find, easy to understand, and easy to trust.
        </p>

        <SectionHeading>Why Shankhya exists</SectionHeading>
        <Paragraph>
          Most calculator websites bury the calculator under ads, clutter and walls of text. We
          believe the calculator is the hero. Every page on Shankhya puts the tool first, the
          explanation second, and nothing else in the way.
        </Paragraph>

        <SectionHeading>What makes us different</SectionHeading>
        <List
          items={[
            "The calculator is always the most prominent element on the page.",
            "Every result includes the formula and a step-by-step example.",
            "Every calculator explains its assumptions, edge cases and limitations.",
            "Calculations run instantly in your browser — no waiting, no server calls.",
            "The design is calm, spacious and free of unnecessary decoration.",
            "Mobile is a first-class experience, not an afterthought.",
          ]}
        />

        <SectionHeading>Our standards</SectionHeading>
        <Paragraph>
          Every calculator on Shankhya follows the same rigorous process:
        </Paragraph>
        <List
          items={[
            "Formulas are verified against established mathematical and financial standards.",
            "Calculations are tested with normal values, boundary values and edge cases.",
            "Content is written to answer real questions, not to pad word counts.",
            "Pages are designed for accessibility, performance and search engines.",
          ]}
        />

        <SectionHeading>What we do not do</SectionHeading>
        <Paragraph>
          We do not invent experts. We do not fabricate testimonials. We do not present calculator
          output as professional advice. Financial, health and legal calculators on this site are
          educational tools — always consult a qualified professional for decisions that matter.
        </Paragraph>

        <SectionHeading>Contact</SectionHeading>
        <Paragraph>
          Have a question, suggestion or correction? Visit our{" "}
          <a
            href="/contact"
            className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            contact page
          </a>
          .
        </Paragraph>
      </div>
    </div>
  );
}