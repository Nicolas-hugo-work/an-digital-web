import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { t: Dictionary["supportTeaser"]; href: string };

export function SupportTeaser({ t, href }: Props) {
  return (
    <section aria-labelledby="support-teaser-title" className="wrap">
      <div
        className="glass flex flex-col gap-8 p-7 sm:p-10 md:flex-row md:items-center md:justify-between"
        style={{ "--g-radius": "36px" } as React.CSSProperties}
      >
        <div className="max-w-[36rem]">
          <h2 id="support-teaser-title" className="t-h3 text-[1.875rem]">
            {t.title}
          </h2>
          <p className="t-body mt-3">{t.body}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <span className="rounded-full bg-ink/50 px-4 py-2 font-medium text-amber-soft shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
            {href}
          </span>
          <Link href={href} className="btn btn-amber">
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
