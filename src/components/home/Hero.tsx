import type { Dictionary } from "@/i18n/get-dictionary";
import { whatsappLink } from "@/lib/contact";
import { HeroTitle } from "./HeroTitle";
import { LoyaltyCard } from "./LoyaltyCard";
import { HeroRail } from "./HeroLens";
import { WhatsAppIcon } from "../icons";

type Props = { t: Dictionary; servicesId: string };

export function Hero({ t, servicesId }: Props) {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-x-clip pt-28 pb-16 lg:pt-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        <div className="min-w-0">
          <HeroTitle lines={t.hero.lines} fit={t.hero.fit} />
          <HeroRail />
          <p className="t-lede mt-8 max-w-[36rem]">{t.hero.sub}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={whatsappLink(t.hero.primaryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-amber"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.hero.primary}
            </a>
            <a href={`#${servicesId}`} className="glass glass-pill btn btn-glass">
              {t.hero.secondary}
            </a>
          </div>
          <p className="t-small mt-7 text-mist">{t.hero.reach}</p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="brand-ring left-1/2 top-[44%] w-[min(560px,118%)] -translate-x-1/2 -translate-y-1/2"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[42%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(233_168_43/0.32),rgb(233_168_43/0)_65%)]"
          />
          <LoyaltyCard t={t.card} />
          <p className="t-small mt-4 text-center text-ivory/70">{t.card.wallets}</p>
        </div>
      </div>
    </section>
  );
}
