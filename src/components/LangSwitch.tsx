"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { locales, pathFor, type Locale, type PageKey } from "@/i18n/config";
import { sectionIds } from "@/i18n/sections";
import { useRefraction } from "./effects/refraction";

type Props = { lang: Locale; page: PageKey; label: string; idPrefix: string };

export function LangSwitch({ lang, page, label, idPrefix }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<Locale>(lang);
  const groupRef = useRef<HTMLDivElement>(null);
  useRefraction(groupRef, { scale: -40, bezel: 0.3, blur: 1, chroma: false });

  const go = (target: Locale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === lang) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const hash = window.location.hash.slice(1);
    const key = (Object.keys(sectionIds[lang]) as (keyof (typeof sectionIds)["es"])[]).find(
      (k) => sectionIds[lang][k] === hash,
    );
    const href = pathFor(page, target) + (key ? `#${sectionIds[target][key]}` : "");
    setActive(target);
    window.setTimeout(() => router.push(href), 280);
  };

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      className="glass glass-pill glass-clear flex items-center p-1"
      style={{ "--g-blur": "4px" } as React.CSSProperties}
    >
      {locales.map((l) => (
        <a
          key={l}
          href={pathFor(page, l)}
          hrefLang={l}
          lang={l}
          onClick={go(l)}
          aria-current={l === lang ? "true" : undefined}
          className="relative grid h-8 min-w-11 place-items-center rounded-full px-3 text-[0.875rem] font-medium tracking-[0.04em]"
        >
          {active === l && (
            <motion.span
              layoutId={`${idPrefix}-lang-lens`}
              className="glass glass-pill absolute inset-0"
              style={{ "--g-tint": "0.16", "--g-blur": "2px" } as React.CSSProperties}
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.9 }}
            />
          )}
          <span className={active === l ? "text-ivory" : "text-mist"}>{l.toUpperCase()}</span>
        </a>
      ))}
    </div>
  );
}
