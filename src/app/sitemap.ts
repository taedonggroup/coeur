import type { MetadataRoute } from "next";

const BASE = "https://coeurworks.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["/", "/about", "/portfolio", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
