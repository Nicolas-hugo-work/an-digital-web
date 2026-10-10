import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, pathFor } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { contact } from "@/lib/contact";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.privacyTitle,
    description: t.privacyDescription,
    alternates: {
      canonical: pathFor("privacy", lang),
      languages: { es: pathFor("privacy", "es"), en: pathFor("privacy", "en") },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacidad">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const p = t.privacy;

  return (
    <>
      <SiteNav lang={lang} page="privacy" nav={t.nav} a11y={t.a11y} />
      <main id="contenido" className="wrap pt-32 pb-16 sm:pt-40">
        <article className="glass mx-auto max-w-[46rem] p-7 sm:p-12" style={{ "--g-radius": "36px" } as React.CSSProperties}>
          <h1 className="t-h2">{p.title}</h1>
          <p className="t-small mt-3 text-mist">{p.updated}</p>
          {p.sections.map((section) => (
            <section key={section.h} className="mt-9">
              <h2 className="t-h3 text-[1.3125rem]">{section.h}</h2>
              <p className="t-body mt-3">{section.p.replace("{email}", contact.supportEmail)}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
