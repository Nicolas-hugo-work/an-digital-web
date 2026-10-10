"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { t: Dictionary["process"]; id: string };

export function Process({ t, id }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="wrap">
        <h2 id={`${id}-title`} className="t-h2 max-w-[40rem]">
          {t.title}
        </h2>

        <div className="relative mt-14">
          {/* La línea ámbar une los pasos */}
          <motion.span
            aria-hidden="true"
            className="process-rail absolute left-6 top-6 hidden h-[3px] w-[calc(100%-3rem)] rounded-full bg-[linear-gradient(90deg,#d9951c,#e9a82b_40%,#f6cb72)] shadow-[0_0_18px_rgb(233_168_43/0.5)] lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            aria-hidden="true"
            className="process-rail absolute left-6 top-6 block h-[calc(100%-3rem)] w-[3px] origin-top rounded-full bg-[linear-gradient(180deg,#d9951c,#e9a82b_40%,#f6cb72)] shadow-[0_0_18px_rgb(233_168_43/0.5)] lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {t.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-5 lg:block">
                <span
                  className="glass glass-pill grid h-12 w-12 place-items-center font-display text-lg tabular-nums"
                  style={{ "--g-tint": "0.12", fontVariationSettings: '"wdth" 100, "wght" 640' } as React.CSSProperties}
                >
                  {i + 1}
                </span>
                <div className="lg:mt-7 lg:pr-4">
                  <h3 className="t-h3">{step.title}</h3>
                  <p className="t-body mt-3">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
