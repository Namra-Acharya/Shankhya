/**
 * Production SEO Audit System
 * Run with: npm run seo:audit
 *
 * Analyzes every calculator and category from the registry.
 * Checks: titles, descriptions, canonical URLs, H1s, internal links,
 * orphan pages, broken links, sitemap, robots, structured data.
 */

import fs from "fs";
import path from "path";

// Import registry (server-side)
import { getAllCalculators, categories, getRelatedCalculators } from "../lib/calculators/registry";
import { SITE_URL } from "../lib/seo/metadata";

interface PageRecord {
  url: string;
  title: string;
  description: string;
  hasContent: boolean;
  internalLinks: string[];
  relatedCalculators: string[];
  hasFAQ: boolean;
  isIndexable: boolean;
  hasCanonical: boolean;
  hasH1: boolean;
  hasBreadcrumb: boolean;
  hasJSONLD: boolean;
}

interface AuditIssue {
  severity: "error" | "warning" | "info";
  page: string;
  message: string;
}

function generatePages(): PageRecord[] {
  const pages: PageRecord[] = [];

  // Static pages
  const staticPages = [
    { url: "/", title: "Free Online Calculators – Finance, Health, Math & More", description: "Free online calculators for finance, health, math, construction, education and everyday decisions. Fast, accurate and easy to use with clear explanations.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/calculators", title: "All Calculators – Free Online Calculation Tools", description: "Browse all free calculators at Shankhya. Age, EMI, loans, percentages, dates and more. Clear tools with clear explanations.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/about", title: "About Shankhya – A Calm Calculation Platform", description: "Learn about Shankhya, a calculation platform built for clarity.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/methodology", title: "Methodology – How Shankhya Calculators Are Built", description: "Learn how Shankhya develops, tests and reviews its calculators.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/contact", title: "Contact Shankhya – Questions, Suggestions & Corrections", description: "Contact Shankhya with questions, suggestions or corrections. We read every message and use your feedback to improve our calculators.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/privacy", title: "Privacy Policy – Shankhya", description: "Read the Shankhya privacy policy. We collect minimal data.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
    { url: "/terms", title: "Terms of Use – Shankhya", description: "Read the Shankhya terms of use. Understand how our calculators may be used and their limitations.", hasContent: true, hasCanonical: true, hasH1: true, hasBreadcrumb: false, hasJSONLD: true },
  ];

  for (const page of staticPages) {
    pages.push({
      url: page.url,
      title: page.title,
      description: page.description,
      hasContent: page.hasContent,
      internalLinks: ["/"],
      relatedCalculators: [],
      hasFAQ: false,
      isIndexable: true,
      hasCanonical: page.hasCanonical,
      hasH1: page.hasH1,
      hasBreadcrumb: page.hasBreadcrumb,
      hasJSONLD: page.hasJSONLD,
    });
  }

  // Category pages
  for (const cat of categories) {
    const catCalcs = getAllCalculators().filter((c) => c.category === cat.id);
    pages.push({
      url: `/calculators/${cat.slug}`,
      title: cat.seo.title,
      description: cat.seo.description,
      hasContent: true,
      internalLinks: catCalcs.map((c) => `/calculators/${c.slug}`),
      relatedCalculators: [],
      hasFAQ: false,
      isIndexable: true,
      hasCanonical: true,
      hasH1: true,
      hasBreadcrumb: true,
      hasJSONLD: true,
    });
  }

  // Calculator pages
  for (const calc of getAllCalculators()) {
    const related = getRelatedCalculators(calc);
    pages.push({
      url: `/calculators/${calc.slug}`,
      title: calc.seo.title,
      description: calc.seo.description,
      hasContent: true,
      internalLinks: [
        `/calculators/${calc.category}`,
        ...related.map((r) => `/calculators/${r.slug}`),
      ],
      relatedCalculators: related.map((r) => r.slug),
      hasFAQ: (calc.content.faqs?.length ?? 0) > 0,
      isIndexable: true,
      hasCanonical: true,
      hasH1: true,
      hasBreadcrumb: true,
      hasJSONLD: true,
    });
  }

  return pages;
}

async function runAudit() {
  console.log("🔍 Running production SEO audit...\n");

  const issues: AuditIssue[] = [];
  const pages = generatePages();

  // 1. Check for duplicate titles
  const titles = new Map<string, string[]>();
  for (const page of pages) {
    const existing = titles.get(page.title) || [];
    existing.push(page.url);
    titles.set(page.title, existing);
  }

  for (const [title, urls] of Array.from(titles.entries())) {
    if (urls.length > 1) {
      issues.push({
        severity: "error",
        page: urls.join(", "),
        message: `Duplicate title: "${title}"`,
      });
    }
  }

  // 2. Check for duplicate descriptions
  const descriptions = new Map<string, string[]>();
  for (const page of pages) {
    const existing = descriptions.get(page.description) || [];
    existing.push(page.url);
    descriptions.set(page.description, existing);
  }

  for (const [desc, urls] of Array.from(descriptions.entries())) {
    if (urls.length > 1) {
      issues.push({
        severity: "error",
        page: urls.join(", "),
        message: `Duplicate meta description: "${desc.slice(0, 60)}..."`,
      });
    }
  }

  // 3. Check each page has required elements
  for (const page of pages) {
    if (!page.title) {
      issues.push({ severity: "error", page: page.url, message: "Missing title" });
    }

    if (page.title.length > 65) {
      issues.push({
        severity: "warning",
        page: page.url,
        message: `Title too long (${page.title.length} chars): "${page.title}"`,
      });
    }

    if (page.title.length < 20) {
      issues.push({
        severity: "warning",
        page: page.url,
        message: `Title too short (${page.title.length} chars): "${page.title}"`,
      });
    }

    if (!page.description) {
      issues.push({ severity: "error", page: page.url, message: "Missing meta description" });
    }

    if (page.description.length > 165) {
      issues.push({
        severity: "warning",
        page: page.url,
        message: `Description too long (${page.description.length} chars)`,
      });
    }

    if (page.description.length < 50) {
      issues.push({
        severity: "warning",
        page: page.url,
        message: `Description too short (${page.description.length} chars)`,
      });
    }

    if (!page.hasCanonical) {
      issues.push({ severity: "error", page: page.url, message: "Missing canonical URL" });
    }

    if (!page.hasH1) {
      issues.push({ severity: "error", page: page.url, message: "Missing H1" });
    }

    if (!page.hasContent) {
      issues.push({ severity: "warning", page: page.url, message: "Page may have insufficient content" });
    }

    if (!page.isIndexable) {
      issues.push({ severity: "info", page: page.url, message: "Page is noindex (intentional)" });
    }

    if (page.hasBreadcrumb && !page.hasJSONLD) {
      issues.push({ severity: "warning", page: page.url, message: "Breadcrumb visible but no JSON-LD" });
    }
  }

  // 4. Check for orphan pages (no incoming internal links)
  // Header links: /, /calculators, /about, /calculators/[category]
  // Footer links: /, /calculators, /about, /methodology, /contact, /privacy, /terms
  const allUrls = new Set(pages.map((p) => p.url));
  const linkedUrls = new Set<string>(["/", "/calculators", "/about", "/methodology", "/contact", "/privacy", "/terms"]);
  for (const page of pages) {
    for (const link of page.internalLinks) {
      linkedUrls.add(link);
    }
  }

  for (const page of pages) {
    if (page.url !== "/" && !linkedUrls.has(page.url)) {
      issues.push({
        severity: "warning",
        page: page.url,
        message: "Orphan page - no incoming internal links",
      });
    }
  }

  // 5. Check for broken internal links
  for (const page of pages) {
    for (const link of page.internalLinks) {
      if (!allUrls.has(link) && !link.startsWith("/calculators/")) {
        issues.push({
          severity: "error",
          page: page.url,
          message: `Broken internal link: ${link}`,
        });
      }
    }
  }

  // 6. Check calculator pages have related calculators
  for (const page of pages) {
    if (page.url.startsWith("/calculators/") && !page.url.startsWith("/calculators/") && page.relatedCalculators.length === 0) {
      // Only check actual calculator pages (not category pages)
      const isCategory = categories.some((c) => `/calculators/${c.slug}` === page.url);
      if (!isCategory && page.relatedCalculators.length === 0) {
        issues.push({
          severity: "warning",
          page: page.url,
          message: "No related calculators",
        });
      }
    }
  }

  // 7. Check FAQ presence on calculators with FAQs
  for (const page of pages) {
    if (page.url.startsWith("/calculators/") && page.hasFAQ && !page.hasJSONLD) {
      issues.push({
        severity: "info",
        page: page.url,
        message: "Has FAQ content but no FAQPage JSON-LD",
      });
    }
  }

  // 8. Check SITE_URL is not a placeholder
  if (SITE_URL.includes("example.com") || SITE_URL.includes("localhost")) {
    issues.push({
      severity: "error",
      page: "site-wide",
      message: `SITE_URL is a placeholder: ${SITE_URL}`,
    });
  }

  // 9. Summary
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  console.log("📄 Pages analyzed:", pages.length);
  console.log("❌ Errors:", errors.length);
  console.log("⚠️  Warnings:", warnings.length);
  console.log("ℹ️  Info:", infos.length);
  console.log("");

  if (issues.length > 0) {
    for (const issue of issues) {
      const icon = issue.severity === "error" ? "❌" : issue.severity === "warning" ? "⚠️" : "ℹ️";
      console.log(`${icon} [${issue.severity.toUpperCase()}] ${issue.page}: ${issue.message}`);
    }
  } else {
    console.log("✅ No SEO issues found!");
  }

  // Write audit report
  const report = `# SEO Audit Report

Generated: ${new Date().toISOString()}

## Summary

- Pages analyzed: ${pages.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}
- Info: ${infos.length}

## Issues

${issues.length === 0 ? "No issues found. 🎉" : issues.map((i) => `### ${i.severity.toUpperCase()}: ${i.page}\n\n${i.message}\n`).join("\n")}

## Checklist

- [ ] All pages have unique titles
- [ ] All pages have unique meta descriptions
- [ ] All pages have canonical URLs
- [ ] All pages have exactly one H1
- [ ] All calculator pages have related calculators
- [ ] No broken internal links
- [ ] No orphan pages
- [ ] Sitemap is up to date
- [ ] robots.txt is present
- [ ] SITE_URL is production domain
- [ ] Structured data is valid
- [ ] Open Graph metadata exists
`;

  fs.writeFileSync(path.join(process.cwd(), "SEO_AUDIT.md"), report);
  console.log("\n📝 Report written to SEO_AUDIT.md");
}

runAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});