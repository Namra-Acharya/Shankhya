import type { MetadataRoute } from "next";

import { getAllCalculators, categories } from "@/lib/calculators/registry";
import { SITE_URL } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1 },
    { path: "/calculators", priority: 0.9 },
    { path: "/about", priority: 0.5 },
    { path: "/methodology", priority: 0.5 },
    { path: "/contact", priority: 0.3 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  const categoryPages = categories.map((cat) => ({
    path: `/calculators/${cat.slug}`,
    priority: 0.8,
  }));

  const calculatorPages = getAllCalculators().map((calc) => ({
    path: `/calculators/${calc.slug}`,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages].map((page) => ({
    url: `${SITE_URL}${page.path}`,
    priority: page.priority,
  }));
}
