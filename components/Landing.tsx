"use client";

/*
  AN DIGITAL — Landing (Next.js + React + TypeScript)
  Skills: landing (estructura + GSAP), epic-design (capas de profundidad + técnicas), copywriting (textos ES/EN)
  Inspiración visual: objeto 3D violeta de almohadillas infladas con malla wireframe (reference/minot-ref.png) + Liquid Glass.
  No se copia el logo ni la marca de la referencia: el lockup "an digital." y su isotipo de sellos son propios.

  Técnicas aplicadas (catálogo epic-design):
    - Hero a sangre con objeto WebGL (Three.js, shader propio): esfera de almohadillas infladas con malla wireframe
    - Lockup en blanco con isotipo de sellos que "se estampan" al entrar + masked line reveal en wordmark y titular
    - Liquid Glass: paneles translúcidos con reflejo especular, brillo que sigue al puntero (--mx/--my)
      y refracción real (feTurbulence + feDisplacementMap como backdrop-filter) solo en Chromium
    - Tarjeta de Wallet de ejemplo con inclinación 3D al puntero y notificación flotante
    - Parallax de ratón (objeto 3D y texto) y parallax de scroll en el objeto
    - Word-by-word scroll lighting en el manifiesto
    - Cascading card stack (tarjetas sticky) en el proceso
    - Bleed typography con el lockup en el pie + eco de la malla de almohadillas en el CTA final
    - prefers-reduced-motion + reducción en dispositivos táctiles (pointer: coarse)
*/

import { Fragment, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  ChevronDown,
  Coffee,
  Gift,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageCircle,
  Nfc,
  PhoneCall,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Lockup } from "./Lockup";
import { Dock } from "./Dock";
import { Rich } from "./Rich";
import { CONTACT_EMAIL, MARQUEE, TAGLINES, WHATSAPP, parseRich, waLink, type Key, type Lang } from "@/lib/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// El objeto 3D se carga solo en el cliente y después del primer pintado (no bloquea el LCP)
const PadSphere = dynamic(() => import("./PadSphere"), { ssr: false });

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* ═════════ Datos de secciones ═════════ */
const SERVICES: { icon: LucideIcon; title: Key; desc: Key; tags: Key[]; star?: boolean }[] = [
  { icon: Wallet, title: "s1.title", desc: "s1.desc", tags: ["s1.t1", "s1.t2", "s1.t3", "s1.t4"], star: true },
  { icon: Nfc, title: "s2.title", desc: "s2.desc", tags: ["s2.t1", "s2.t2"] },
  { icon: Megaphone, title: "s3.title", desc: "s3.desc", tags: ["s3.t1", "s3.t2"] },
  { icon: LayoutDashboard, title: "s4.title", desc: "s4.desc", tags: ["s4.t1", "s4.t2"] },
  { icon: Wrench, title: "s5.title", desc: "s5.desc", tags: ["s5.t1", "s5.t2"] },
  { icon: PhoneCall, title: "s6.title", desc: "s6.desc", tags: ["s6.t1", "s6.t2"] },
];

const PRINCIPLES: [Key, Key][] = [
  ["pr1.title", "pr1.desc"],
  ["pr2.title", "pr2.desc"],
  ["pr3.title", "pr3.desc"],
];

const STEPS: { title: Key; desc: Key; tone: string }[] = [
  { title: "p1.title", desc: "p1.desc", tone: "violet" },
  { title: "p2.title", desc: "p2.desc", tone: "glass" },
  { title: "p3.title", desc: "p3.desc", tone: "lavender" },
  { title: "p4.title", desc: "p4.desc", tone: "cyan" },
];

/* ═════════ Piezas pequeñas ═════════ */
function Eyebrow({ children, className = "", enter = false }: { children: React.ReactNode; className?: string; enter?: boolean }) {
  return (
    <span className={`eyebrow ${className}`} data-enter={enter || undefined}>
      <span className="dot" aria-hidden="true" />
      {children}
    </span>
  );
}

function CtaButton({ href, label, icon: Icon = ArrowUpRight, variant = "primary", external = false }: { href: string; label: string; icon?: LucideIcon; variant?: "primary" | "glass"; external?: boolean }) {
  return (
    <a
      className={variant === "primary" ? "btn-primary" : "btn-glass glass"}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="label">{label}</span>
      <Icon size={17} strokeWidth={2} aria-hidden="true" />
    </a>
  );
}

/* QR decorativo determinista (mismo resultado en servidor y cliente) */
const QR_N = 21;
const QR_PATH = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [[0, 0], [QR_N - 7, 0], [0, QR_N - 7]]) {
      if (inBox(ox, oy)) {
        const dx = x - ox, dy = y - oy;
        const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
      if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0;
    }
    return -1;
  };
  let d = "";
  for (let y = 0; y < QR_N; y++) {
    for (let x = 0; x < QR_N; x++) {
      const f = finder(x, y);
      const on = f === -1 ? rnd() > 0.52 : f === 1;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
})();

/* ═════════ Tarjeta de Wallet de ejemplo: «Café Altura» ═════════ */
function WalletScene({ t }: { t: (k: Key) => string }) {
  const STAMPS = 10;
  const FILLED = 9;
  return (
    <div className="pass-scene" role="img" aria-label={t("pass.label")}>
      {/* Depth 1: manchas de color detrás del vidrio (para que la refracción se vea) */}
      <div className="pass-orbs" aria-hidden="true">
        <span className="pass-orb pass-orb--a" />
        <span className="pass-orb pass-orb--b" />
        <span className="pass-orb pass-orb--c" />
      </div>

      {/* Depth 5: notificación al celular */}
      <div className="notif-float" aria-hidden="true">
        <div className="notif glass refract">
          <span className="notif-icon"><Coffee size={16} strokeWidth={2} color="#0A1226" /></span>
          <span className="notif-body">
            <span className="notif-head"><strong>{t("notif.app")}</strong><span>{t("notif.time")}</span></span>
            <span className="notif-text">{t("notif.text")}</span>
          </span>
        </div>
      </div>

      {/* Depth 3: la tarjeta (inclinación 3D al puntero) */}
      <div className="pass glass refract" aria-hidden="true">
        <div className="pass-head">
          <span className="pass-logo">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <circle cx="16" cy="16" r="15" fill="#F4F1FF" />
              <path d="M6 22 L13 12 L17 17 L20 13.5 L26 22 Z" fill="#4B3CC9" />
              <circle cx="22" cy="10" r="2.4" fill="#7DE3F4" />
            </svg>
          </span>
          <span className="pass-name">Café Altura</span>
          <span className="pass-count">
            <small>{t("pass.stamps")}</small>
            <b>{FILLED}/{STAMPS}</b>
          </span>
        </div>

        <div className="pass-stamps">
          {Array.from({ length: STAMPS }, (_, i) => (
            <span key={i} className={`stamp ${i < FILLED ? "is-on" : ""}`}>
              {i < FILLED ? <Coffee size={15} strokeWidth={2.2} /> : <Gift size={15} strokeWidth={2} />}
            </span>
          ))}
        </div>

        <div className="pass-fields">
          <div>
            <small>{t("pass.reward")}</small>
            <b>{t("pass.rewardValue")}</b>
          </div>
          <div>
            <small>{t("pass.left")}</small>
            <b>{t("pass.leftValue")}</b>
          </div>
        </div>

        <div className="pass-qr">
          <svg viewBox={`-2 -2 ${QR_N + 4} ${QR_N + 4}`} width="92" height="92" shapeRendering="crispEdges">
            <rect x="-2" y="-2" width={QR_N + 4} height={QR_N + 4} rx="2" fill="#FFFFFF" />
            <path d={QR_PATH} fill="#0A1226" />
          </svg>
          <small>{t("pass.scan")}</small>
        </div>
      </div>
    </div>
  );
}

/* ═════════ Manifiesto: cada palabra en un <span> para la iluminación por scroll ═════════ */
function Manifesto({ lang, text }: { lang: Lang; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".w",
          { opacity: 0.18 },
          {
            opacity: 1, stagger: 0.08, ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <p className="manifesto-text" ref={ref}>
      {parseRich(text).map((seg, i) => {
        const words = seg.text.split(/(\s+)/).map((part, j) =>
          /^\s+$/.test(part) || !part ? <Fragment key={j}>{part}</Fragment> : <span className="w" key={j}>{part}</span>,
        );
        return seg.em ? <em key={i}>{words}</em> : <Fragment key={i}>{words}</Fragment>;
      })}
    </p>
  );
}

/* ═════════ Liquid Glass: refracción progresiva + brillo que sigue al puntero ═════════ */
function useLiquidGlass() {
  useEffect(() => {
    const html = document.documentElement;
    // La refracción con backdrop-filter: url(#glass) solo se pinta bien en Chromium.
    // Safari y Firefox se quedan con el vidrio normal (blur + saturación).
    const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
    const chromium = !!brands?.some((b) => /Chromium/i.test(b.brand));
    if (chromium && CSS.supports("backdrop-filter", "url(#glass)")) html.classList.add("refract-on");

    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      // Actualiza el panel bajo el puntero y sus paneles de vidrio padres
      let el = (e.target as Element | null)?.closest?.<HTMLElement>(".glass") ?? null;
      while (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el = el.parentElement?.closest<HTMLElement>(".glass") ?? null;
      }
      // Inclinación 3D de la tarjeta de Wallet
      const scene = (e.target as Element | null)?.closest?.<HTMLElement>(".pass-scene");
      if (scene && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        scene.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
        scene.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
      }
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = (e: PointerEvent) => {
      const scene = (e.target as Element | null)?.closest?.<HTMLElement>(".pass-scene");
      if (scene && !scene.contains(e.relatedTarget as Node | null)) {
        scene.style.setProperty("--ry", "0deg");
        scene.style.setProperty("--rx", "0deg");
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

/* ═════════ Página ═════════ */
export function Landing() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const marquee = MARQUEE[lang];
  const waMsg = t("wa.msg");

  useLiquidGlass();

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lang]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, fine: "(pointer: fine)" }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        if (!motion) return;

        // 1 · Estados iniciales (evita FOUC en lo que está fuera de pantalla)
        gsap.set(".feature-card", { opacity: 0, y: 55, rotateX: 14 });
        gsap.set(".reveal", { opacity: 0, y: 40 });

        // 2 · Entrada del hero: letras que se inflan + masked line reveal
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => document.documentElement.classList.add("hero-done"),
        });
        // Los sellos del isotipo se "estampan" uno a uno y el wordmark sube desde su máscara
        tl.fromTo(
          ".hero-lockup .iso-dot",
          { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 0.7, stagger: 0.07, ease: "back.out(2.6)" },
        )
          .fromTo(".hero-lockup .wm-inner", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, ease: "power4.out" }, "-=0.55")
          .fromTo(".hero .line-inner", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1, stagger: 0.12, ease: "power4.out" }, "-=0.7")
          .fromTo(".hero .subtitle", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
          .fromTo(".hero .cta-wrap", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
          .fromTo(".scroll-down", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
          .fromTo(".dock", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.6)" }, "-=0.4");

        // 3 · Parallax de ratón por capas + cursor circular (solo con puntero fino)
        let onMove: ((e: MouseEvent) => void) | undefined;
        if (fine) {
          const layers = [
            { el: ".hero-lockup", x: 10, y: 6 },
            { el: ".hero-copy", x: 5, y: 3 },
          ].map((l) => ({
            ...l,
            toX: gsap.quickTo(l.el, "x", { duration: 0.8, ease: "power3" }),
            toY: gsap.quickTo(l.el, "y", { duration: 0.8, ease: "power3" }),
          }));
          const cursorX = gsap.quickTo(".cursor", "x", { duration: 0.35, ease: "power3" });
          const cursorY = gsap.quickTo(".cursor", "y", { duration: 0.35, ease: "power3" });
          const cursor = document.querySelector<HTMLElement>(".cursor");
          onMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            layers.forEach((l) => { l.toX(x * l.x); l.toY(y * l.y); });
            cursorX(e.clientX);
            cursorY(e.clientY);
            const target = e.target as HTMLElement | null;
            cursor?.classList.toggle("is-hover", !!target?.closest("a, button"));
            cursor?.classList.add("is-visible");
          };
          window.addEventListener("mousemove", onMove);
        }

        // 4 · Salida del hero al hacer scroll
        gsap.to(".hero-inner", {
          yPercent: -14, opacity: 0.2, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });

        // 5 · Tarjetas de servicios
        ScrollTrigger.batch(".feature-card", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
              onComplete: () => { gsap.set(batch, { clearProps: "transform,opacity" }); },
            }),
        });

        // 6 · Revelado de encabezados y bloques
        ScrollTrigger.batch(".reveal", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
              onComplete: () => { gsap.set(batch, { clearProps: "transform,opacity" }); },
            }),
        });

        // 7 · Cascading card stack del proceso
        const steps = gsap.utils.toArray<HTMLElement>(".step");
        steps.forEach((step, i) => {
          const next = steps[i + 1];
          if (!next) return;
          gsap.to(step, {
            scale: 0.93, ease: "none",
            scrollTrigger: { trigger: next, start: "top 90%", end: "top 25%", scrub: true },
          });
        });

        // 8 · Lockup del pie: los sellos se estampan y el wordmark sube al entrar en pantalla
        const footTl = gsap.timeline({ scrollTrigger: { trigger: "footer", start: "top 80%" } });
        footTl
          .fromTo(".bleed .iso-dot", { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.06, ease: "back.out(2.4)" })
          .fromTo(".bleed .wm-inner", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.45");

        return () => {
          if (onMove) window.removeEventListener("mousemove", onMove);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">{t("skip")}</a>
      <div className="cursor" aria-hidden="true" />

      {/* Filtro de refracción del vidrio (se usa como backdrop-filter: url(#glass) en Chromium) */}
      <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="11" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="56" xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feGaussianBlur in="refracted" stdDeviation="1.2" />
        </filter>
      </svg>

      <Dock />

      <main id="main">
        {/* ═════════ HERO ═════════ */}
        <section className="scene hero" id="top" data-scene="hero">
          {/* Depth 0 · fallback CSS (degradado violeta) visible hasta que WebGL pinta o si no hay WebGL */}
          <div className="hero-fallback layer depth-0" data-depth="0" aria-hidden="true" />
          {/* Depth 3 · objeto 3D a sangre (Three.js) */}
          <PadSphere />
          {/* Depth 1 · velo oscuro detrás del texto (garantiza el contraste) */}
          <div className="hero-veil layer depth-1" data-depth="1" aria-hidden="true" />

          <div className="hero-inner container" data-depth="4">
            <Lockup className="hero-lockup" as="p" />
            <div className="hero-copy">
              <h1>
                {t("hero.title").split("\n").map((line, i) => (
                  <span className="line" key={i}>
                    <span className="line-inner">
                      <Rich value={line} />
                    </span>
                  </span>
                ))}
              </h1>
              <p className="subtitle" data-enter>{t("hero.sub")}</p>
              <span className="cta-wrap" data-enter>
                <CtaButton href="#contacto" label={t("hero.cta")} icon={MessageCircle} />
                <CtaButton href="#servicios" label={t("hero.cta2")} icon={ChevronDown} variant="glass" />
              </span>
            </div>
          </div>

          <a className="scroll-down" href="#servicios" data-enter>
            <span>{t("hero.scroll")}</span>
            <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        </section>

        {/* ═════════ MARQUEE ═════════ */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* ═════════ SERVICIOS ═════════ */}
        <section className="block features" id="servicios" data-scene="services">
          <div className="section-aura" aria-hidden="true" />
          <div className="container">
            <div className="section-head">
              <div>
                <Eyebrow className="reveal">{t("services.eyebrow")}</Eyebrow>
                <h2 className="reveal"><Rich value={t("services.title")} /></h2>
              </div>
              <p className="reveal">{t("services.lead")}</p>
            </div>

            <div className="features-grid">
              {SERVICES.map(({ icon: Icon, title, desc, tags, star }, i) => (
                <article className={`feature-card glass ${star ? "feature-card--star" : ""}`} key={title}>
                  <div className="feature-main">
                    <div className="feature-top">
                      <div className="feature-icon" aria-hidden="true">
                        <Icon size={star ? 28 : 24} strokeWidth={1.8} color="#fff" />
                      </div>
                      {star ? (
                        <span className="feature-badge">{t("s.featured")}</span>
                      ) : (
                        <span className="feature-num">{String(i + 1).padStart(2, "0")}</span>
                      )}
                    </div>
                    <h3>{t(title)}</h3>
                    <p>{t(desc)}</p>
                    <ul className="tags">
                      {tags.map((tag) => <li key={tag}>{t(tag)}</li>)}
                    </ul>
                    {star && (
                      <a className="feature-link" href="#contacto">
                        {t("nav.cta")} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  {star && <WalletScene t={t} />}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ MANIFIESTO ═════════ */}
        <section className="block manifesto" id="enfoque" data-scene="manifesto">
          <div className="manifesto-glow" aria-hidden="true" />
          <div className="container">
            <Eyebrow>{t("manifesto.eyebrow")}</Eyebrow>
            <Manifesto lang={lang} text={t("manifesto.text")} />
            <div className="principles">
              {PRINCIPLES.map(([title, desc], i) => (
                <div className="principle glass reveal" key={title}>
                  <span className="principle-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(title)}</h3>
                  <p>{t(desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ PROCESO ═════════ */}
        <section className="block process" id="proceso" data-scene="process">
          <div className="container">
            <div className="section-head">
              <div>
                <Eyebrow className="reveal">{t("process.eyebrow")}</Eyebrow>
                <h2 className="reveal"><Rich value={t("process.title")} /></h2>
              </div>
              <p className="reveal">{t("process.lead")}</p>
            </div>

            <div className="steps">
              {STEPS.map((step, i) => (
                <article className={`step step--${step.tone}`} key={step.title} style={{ "--i": i } as React.CSSProperties}>
                  <div>
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{t(step.title)}</h3>
                  </div>
                  <div className="step-body">
                    <p>{t(step.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ CTA FINAL ═════════ */}
        <section className="scene closing-cta" id="contacto" data-scene="contact">
          <div className="cta-aura" aria-hidden="true" />
          <div className="container">
            <div className="cta-panel glass refract" data-depth="4">
              <div className="cta-glow-bg" data-depth="0" aria-hidden="true" />
              {/* Eco discreto de las almohadillas con malla del hero */}
              <span className="cta-mesh" data-depth="1" aria-hidden="true" />
              <h2 className="reveal"><Rich value={t("cta.title")} /></h2>
              <p className="reveal">{t("cta.sub")}</p>
              <div className="cta-buttons reveal">
                <CtaButton href={waLink(WHATSAPP.us, waMsg)} label={t("cta.us")} icon={MessageCircle} external />
                <CtaButton href={waLink(WHATSAPP.bo, waMsg)} label={t("cta.bo")} icon={MessageCircle} external />
              </div>
              <p className="mail reveal">
                <Mail size={15} strokeWidth={2} aria-hidden="true" />
                {t("cta.mail")}{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("mail.subject"))}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ═════════ FOOTER ═════════ */}
      <footer>
        <div className="container">
          <div className="footer-top">
            {/* Eslogan siempre visible en ambos idiomas */}
            <div className="footer-tagline">
              <p lang="es">{TAGLINES.es}</p>
              <p lang="en">{TAGLINES.en}</p>
            </div>
            <nav className="footer-links" aria-label="Footer">
              <a href="#servicios">{t("nav.services")}</a>
              <a href="#enfoque">{t("nav.approach")}</a>
              <a href="#proceso">{t("nav.process")}</a>
              <a href="#contacto">{t("nav.contact")}</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} AN DIGITAL. {t("footer.rights")}</span>
            <span>{t("footer.where")}</span>
            <span>{t("footer.made")}</span>
          </div>
        </div>
        <div className="bleed" aria-hidden="true">
          <Lockup className="lockup--bleed" />
        </div>
      </footer>
    </div>
  );
}
