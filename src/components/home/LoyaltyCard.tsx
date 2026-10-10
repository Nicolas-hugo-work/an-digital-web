"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { t: Dictionary["card"] };

const TOTAL = 10;
const START = 6;

function CupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5 9h11v4.5A4.5 4.5 0 0 1 11.5 18h-2A4.5 4.5 0 0 1 5 13.5V9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 10.5h1.25a2.25 2.25 0 0 1 0 4.5H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8.5 3.5c-.6.8.6 1.6 0 2.5M12 3.5c-.6.8.6 1.6 0 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Patrón tipo QR determinista (decorativo). */
function QrPattern() {
  const cells = useMemo(() => {
    const n = 21;
    const out: [number, number][] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const finder = (x: number, y: number) =>
      [0, n - 7].some((fx) => [0, n - 7].some((fy) => !(fx === n - 7 && fy === n - 7) && x >= fx && x < fx + 7 && y >= fy && y < fy + 7));
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (!finder(x, y) && rand() > 0.52) out.push([x, y]);
    return out;
  }, []);
  const finders = [
    [0, 0],
    [14, 0],
    [0, 14],
  ];
  return (
    <svg viewBox="0 0 21 21" className="h-full w-full" aria-hidden="true" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0a1226" />
      ))}
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#0a1226" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#f3efe4" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0a1226" />
        </g>
      ))}
    </svg>
  );
}

export function LoyaltyCard({ t }: Props) {
  const [count, setCount] = useState(START);
  const [touched, setTouched] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Inclinación 3D con el puntero
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 160, damping: 18 });
  const sheenX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const sheenY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const sheen = useTransform(
    [sheenX, sheenY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x} ${y}, rgb(255 255 255 / 0.16), rgb(255 255 255 / 0) 55%)`,
  );

  const onMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const full = count >= TOTAL;
  const onAction = () => {
    setTouched(true);
    setCount((c) => (c >= TOTAL ? 0 : c + 1));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="w-full max-w-[380px] [perspective:1100px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ rotateX: rx, rotateY: ry }} className="will-change-transform">
            <div
              ref={cardRef}
              className={`glass overflow-hidden p-5 sm:p-6 transition-shadow duration-700 ${full ? "shadow-[0_0_0_1px_rgb(233_168_43/0.6),0_30px_80px_-20px_rgb(233_168_43/0.55)]" : ""}`}
              style={{ "--g-radius": "30px", "--g-tint": "0.06" } as React.CSSProperties}
            >
              <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: sheen }} />

              {/* Encabezado del pase */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-amber text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
                    <CupIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-[1.1875rem] leading-tight" style={{ fontVariationSettings: '"wdth" 112, "wght" 620' }}>
                      {t.business}
                    </p>
                    <p className="t-small text-mist">{t.kind}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="t-small text-mist">{t.stamps}</p>
                  <p className="font-display text-[1.75rem] leading-none tabular-nums" style={{ fontVariationSettings: '"wdth" 100, "wght" 640' }}>
                    {count}
                    <span className="text-mist">/{TOTAL}</span>
                  </p>
                </div>
              </div>

              {/* Sellos */}
              <div className="mt-6 grid grid-cols-5 gap-2.5 sm:gap-3">
                {Array.from({ length: TOTAL }, (_, i) => {
                  const filled = i < count;
                  return (
                    <div key={i} className="relative aspect-square">
                      <span className="absolute inset-0 rounded-full border border-dashed border-ivory/25" />
                      {filled && (
                        <motion.span
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={
                            touched
                              ? { type: "spring", stiffness: 520, damping: 22 }
                              : { type: "spring", stiffness: 420, damping: 20, delay: 1.25 + i * 0.12 }
                          }
                          className="absolute inset-0 grid place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffe2a1_0%,#e9a82b_55%,#c9850f_100%)] text-ink shadow-[inset_0_1px_1px_rgb(255_255_255/0.7),0_4px_14px_-4px_rgb(233_168_43/0.8)]"
                        >
                          <CupIcon className="h-[55%] w-[55%]" />
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 min-h-6 t-small text-ivory/85" aria-live="polite">
                {full ? <span className="text-amber-soft">{t.ready}</span> : t.progress.replace("{n}", String(count))}
              </p>

              {/* Campos y código */}
              <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/12 pt-5">
                <dl className="grid gap-3">
                  <div>
                    <dt className="t-small text-mist">{t.reward}</dt>
                    <dd className="font-medium">{t.rewardValue}</dd>
                  </div>
                  <div>
                    <dt className="t-small text-mist">{t.member}</dt>
                    <dd className="font-medium tabular-nums">{t.memberValue}</dd>
                  </div>
                </dl>
                <div className="h-[86px] w-[86px] shrink-0 rounded-xl bg-ivory p-1.5 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.6)]">
                  <QrPattern />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button type="button" onClick={onAction} className="glass glass-pill btn btn-glass" style={{ "--g-tint": "0.1" } as React.CSSProperties}>
          {full ? t.redeem : t.add}
        </button>
        <p className="t-small max-w-[30ch] text-center text-mist">{t.caption}</p>
      </div>
    </div>
  );
}
