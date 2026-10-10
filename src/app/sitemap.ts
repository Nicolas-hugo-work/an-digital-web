import type { MetadataRoute } from "next";
import { locales, pagePaths, siteUrl } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { key: "home", priority: 1 },
    { key: "support", priority: 0.6 },
    { key: "privacy", priority: 0.2 },
  ] as const;
  return pages.flatMap(({ key, priority }) =>
    locales.map((lang) => ({
      url: `${siteUrl}${pagePaths[key][lang]}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${pagePaths[key][l]}`])),
      },
    })),
  );
}
