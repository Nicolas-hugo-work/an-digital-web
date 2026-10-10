import type { Dictionary } from "@/i18n/get-dictionary";
import type { ServiceKey } from "@/lib/quote-bus";
import { CheckIcon } from "../icons";
import { QuoteLink } from "./QuoteLink";
import {
  AiCallVisual,
  AppVisual,
  LandingVisual,
  LoyaltyVisual,
  MaintenanceVisual,
  NfcVisual,
} from "./ServiceVisuals";

type Props = { t: Dictionary["services"]; id: string; quoteId: string };

export function Services({ t, id, quoteId }: Props) {
  const v = t.visuals;
  const cards: { key: ServiceKey; span: string; wide?: boolean; visual: React.ReactNode }[] = [
    { key: "loyalty", span: "md:col-span-2 lg:col-span-4", wide: true, visual: <LoyaltyVisual /> },
    { key: "nfc", span: "lg:col-span-2", visual: <NfcVisual v={v} /> },
    { key: "landing", span: "lg:col-span-2", visual: <LandingVisual v={v} /> },
    { key: "webapps", span: "lg:col-span-2", visual: <AppVisual v={v} /> },
    { key: "maintenance", span: "lg:col-span-2", visual: <MaintenanceVisual v={v} /> },
    { key: "aiCalls", span: "md:col-span-2 lg:col-span-6", wide: true, visual: <AiCallVisual v={v} /> },
  ];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="wrap">
        <div className="max-w-[40rem]">
          <h2 id={`${id}-title`} className="t-h2">
            {t.title}
          </h2>
          <p className="t-lede mt-5">{t.intro}</p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {cards.map(({ key, span, wide, visual }) => {
            const item = t.items[key];
            return (
              <li
                key={key}
                className={`glass flex flex-col gap-6 p-4 sm:p-5 ${span} ${wide ? "lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-8" : ""}`}
                style={{ "--g-radius": "32px" } as React.CSSProperties}
              >
                <div className={wide ? "lg:order-2" : ""}>{visual}</div>
                <div className={`flex flex-1 flex-col px-1 pb-1 ${wide ? "lg:order-1 lg:justify-center lg:py-4 lg:pl-3" : ""}`}>
                  <h3 className="t-h3">{item.name}</h3>
                  <p className="t-body mt-3">{item.desc}</p>
                  <ul className="mt-4 grid gap-1.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-[0.9375rem] text-ivory/85">
                        <CheckIcon className="h-4 w-4 shrink-0 text-amber" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-1 lg:mt-auto">
                    <QuoteLink service={key} href={`#${quoteId}`} label={t.quote} serviceName={item.name} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
