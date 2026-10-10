import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, pathFor } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { contact, whatsappLink } from "@/lib/contact";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { TicketForm } from "@/components/support/TicketForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/soporte">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.supportTitle,
    description: t.supportDescription,
    alternates: {
      canonical: pathFor("support", lang),
      languages: { es: pathFor("support", "es"), en: pathFor("support", "en") },
    },
  };
}

const levelDot: Record<string, string> = {
  high: "bg-amber shadow-[0_0_10px_rgb(233_168_43/0.9)]",
  medium: "bg-amber-soft/70",
  low: "bg-mist/60",
};

export default async function SupportPage({ params }: PageProps<"/[lang]/soporte">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const s = t.support;

  return (
    <>
      <SiteNav lang={lang} page="support" nav={t.nav} a11y={t.a11y} />
      <main id="contenido" className="pt-32 sm:pt-40">
        <div className="wrap">
          <h1 className="t-display text-[clamp(3.25rem,9vw,6.5rem)]" style={{ fontVariationSettings: '"wdth" 118, "wght" 640' }}>
            {s.title}
          </h1>
          <p className="t-lede mt-6 max-w-[38rem]">{s.lede}</p>
        </div>

        <div className="wrap mt-14 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
          <TicketForm t={s} />

          <aside className="grid gap-6">
            <section aria-labelledby="times-title" className="glass p-6 sm:p-7" style={{ "--g-radius": "32px" } as React.CSSProperties}>
              <h2 id="times-title" className="t-h3 text-[1.25rem]">
                {s.timesTitle}
              </h2>
              <dl className="mt-5 grid gap-3">
                {s.times.map((row) => (
                  <div key={row.level} className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                    <dt className="flex items-center gap-2.5 text-ivory/85">
                      <span className={`h-2 w-2 rounded-full ${levelDot[row.level]}`} />
                      {row.label}
                    </dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-small mt-5 text-mist">{s.hours}</p>
            </section>

            <section aria-labelledby="channels-title" className="glass p-6 sm:p-7" style={{ "--g-radius": "32px" } as React.CSSProperties}>
              <h2 id="channels-title" className="t-h3 text-[1.25rem]">
                {s.channelsTitle}
              </h2>
              <ul className="mt-5 grid gap-3">
                <li>
                  <a href={whatsappLink("")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-amber-soft">
                    <WhatsAppIcon className="h-5 w-5 text-amber" />
                    <span className="tabular-nums">{contact.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={contact.phoneHref} className="inline-flex items-center gap-3 hover:text-amber-soft">
                    <PhoneIcon className="h-5 w-5 text-amber" />
                    <span className="tabular-nums">{contact.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.supportEmail}`} className="inline-flex items-center gap-3 break-all hover:text-amber-soft">
                    <MailIcon className="h-5 w-5 shrink-0 text-amber" />
                    {contact.supportEmail}
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </div>

        <section aria-labelledby="faq-title" className="section wrap">
          <h2 id="faq-title" className="t-h2">
            {s.faqTitle}
          </h2>
          <div className="mt-10 grid gap-3">
            {s.faq.map((item) => (
              <details key={item.q} className="faq glass group" style={{ "--g-radius": "24px" } as React.CSSProperties}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[24px] px-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/8">
                    <span className="absolute h-[1.5px] w-3.5 rounded bg-ivory" />
                    <span className="absolute h-3.5 w-[1.5px] rounded bg-ivory transition-transform duration-300 group-open:rotate-90 group-open:scale-0" />
                  </span>
                </summary>
                <p className="t-body max-w-[60ch] px-6 pb-6">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
