import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, pathFor, siteUrl } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { sectionIds } from "@/i18n/sections";
import { contact } from "@/lib/contact";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { SupportTeaser } from "@/components/home/SupportTeaser";
import { QuoteForm } from "@/components/home/QuoteForm";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    alternates: {
      canonical: pathFor("home", lang),
      languages: { es: pathFor("home", "es"), en: pathFor("home", "en"), "x-default": "/es" },
    },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const ids = sectionIds[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "AN Digital",
    url: `${siteUrl}${pathFor("home", lang)}`,
    logo: `${siteUrl}/brand/an-digital-logo.jpg`,
    image: `${siteUrl}${t.meta.ogImage}`,
    description: t.meta.description,
    telephone: "+1-703-944-3469",
    email: contact.supportEmail,
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Bolivia" },
    ],
    availableLanguage: ["es", "en"],
    address: { "@type": "PostalAddress", addressRegion: "VA", addressCountry: "US" },
    knowsAbout: Object.values(t.services.items).map((s) => s.name),
  };

  return (
    <>
      <SiteNav lang={lang} page="home" nav={t.nav} a11y={t.a11y} />
      <main id="contenido">
        <Hero t={t} servicesId={ids.services} />
        <Services t={t.services} id={ids.services} quoteId={ids.quote} />
        <Process t={t.process} id={ids.process} />
        <SupportTeaser t={t.supportTeaser} href={pathFor("support", lang)} />
        <QuoteForm t={t.quote} services={t.services.items} id={ids.quote} />
      </main>
      <Footer lang={lang} t={t} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
