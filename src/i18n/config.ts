export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Páginas del sitio y su URL pública en cada idioma. */
export type PageKey = "home" | "support" | "privacy";

export const pagePaths: Record<PageKey, Record<Locale, string>> = {
  home: { es: "/es", en: "/en" },
  support: { es: "/es/soporte", en: "/en/support" },
  privacy: { es: "/es/privacidad", en: "/en/privacy" },
};

export const pathFor = (page: PageKey, lang: Locale) => pagePaths[page][lang];

export const otherLocale = (lang: Locale): Locale => (lang === "es" ? "en" : "es");

export const siteUrl = (() => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
})();
