import Link from "next/link";
import { pathFor, type Locale } from "@/i18n/config";
import { sectionIds } from "@/i18n/sections";
import type { Dictionary } from "@/i18n/get-dictionary";
import { contact } from "@/lib/contact";
import { Logo } from "./Logo";

type Props = { lang: Locale; t: Dictionary };

export function Footer({ lang, t }: Props) {
  const home = pathFor("home", lang);
  const ids = sectionIds[lang];
  return (
    <footer className="wrap pb-10 pt-16">
      <div className="flex flex-col gap-10 border-t border-white/10 pt-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="t-body t-small mt-4">{t.footer.tagline}</p>
          <a className="t-small mt-3 inline-block break-all text-ivory/80 hover:text-ivory" href={`mailto:${contact.supportEmail}`}>
            {contact.supportEmail}
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-[0.9375rem] sm:grid-cols-3">
          <Link className="text-ivory/80 hover:text-ivory" href={`${home}#${ids.services}`}>
            {t.nav.services}
          </Link>
          <Link className="text-ivory/80 hover:text-ivory" href={`${home}#${ids.process}`}>
            {t.nav.process}
          </Link>
          <Link className="text-ivory/80 hover:text-ivory" href={pathFor("support", lang)}>
            {t.nav.support}
          </Link>
          <Link className="text-ivory/80 hover:text-ivory" href={`${home}#${ids.quote}`}>
            {t.nav.quote}
          </Link>
          <Link className="text-ivory/80 hover:text-ivory" href={pathFor("privacy", lang)}>
            {t.footer.privacy}
          </Link>
        </nav>
      </div>
      <p className="t-small mt-10 text-mist">
        © {2026} AN Digital. {t.footer.rights}
      </p>
    </footer>
  );
}
