import { buildMetadata } from "@/lib/seo/metadata";
import { SectionHeading, Paragraph } from "@/components/content/blocks";

export const metadata = buildMetadata({
  title: "Privacy Policy – Shankhya",
  description:
    "Read the Shankhya privacy policy. We collect minimal data and store personal information only on your device when necessary.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-content">
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="h1 text-balance">Privacy Policy</h1>
        <p className="mt-4 text-lg leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          Last updated: August 2026
        </p>

        <SectionHeading>Our approach to privacy</SectionHeading>
        <Paragraph>
          Shankhya is designed to be a calm calculation tool. That means we collect as little data
          as possible. We do not require accounts, do not use authentication, and do not store your
          calculations on our servers.
        </Paragraph>

        <SectionHeading>What we store on your device</SectionHeading>
        <Paragraph>
          We use localStorage in your browser for:
        </Paragraph>
        <ul className="mt-3 space-y-2">
          {[
            "Your theme preference (light or dark mode)",
            "Your recent searches (up to 5 entries)",
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
        <Paragraph>
          This data never leaves your device. You can clear it at any time by clearing your browser
          data for this site.
        </Paragraph>

        <SectionHeading>What we do not collect</SectionHeading>
        <Paragraph>
          We do not collect your name, email address, IP address, or any personal information when
          you use our calculators. We do not use tracking cookies for advertising.
        </Paragraph>

        <SectionHeading>Analytics</SectionHeading>
        <Paragraph>
          We may use privacy-respecting, aggregate analytics to understand which calculators are
          used and improve the site. This data is anonymized and does not identify individual users.
        </Paragraph>

        <SectionHeading>Third-party services</SectionHeading>
        <Paragraph>
          We do not currently use third-party advertising or tracking services. If this changes, we
          will update this policy and only use providers that respect user privacy.
        </Paragraph>

        <SectionHeading>Contact</SectionHeading>
        <Paragraph>
          For privacy questions, contact us at{" "}
          <a
            href="mailto:privacy@Shankhya.example.com"
            className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
          >
            privacy@Shankhya.example.com
          </a>
          .
        </Paragraph>
      </div>
    </div>
  );
}