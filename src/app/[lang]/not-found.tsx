import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { isLocale, pathFor, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export default async function NotFound() {
  const value = await rootLang();
  const lang: Locale = value && isLocale(value) ? value : "es";
  const t = getDictionary(lang);
  return (
    <>
      <SiteNav lang={lang} page="home" nav={t.nav} a11y={t.a11y} />
      <main id="contenido" className="wrap grid min-h-[80svh] place-items-center pt-28 pb-16">
        <div className="glass max-w-[36rem] p-8 text-center sm:p-12" style={{ "--g-radius": "40px" } as React.CSSProperties}>
          <p
            aria-hidden="true"
            className="font-display text-[clamp(4.5rem,16vw,8rem)] leading-none text-amber"
            style={{ fontVariationSettings: '"wdth" 140, "wght" 700' }}
          >
            404
          </p>
          <h1 className="t-h3 mt-6 text-[1.875rem]">{t.notFound.title}</h1>
          <p className="t-body mt-3">{t.notFound.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={pathFor("home", lang)} className="btn btn-amber">
              {t.notFound.home}
            </Link>
            <Link href={pathFor("support", lang)} className="glass glass-pill btn btn-glass">
              {t.notFound.support}
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
