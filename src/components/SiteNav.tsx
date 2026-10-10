"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { pathFor, type Locale, type PageKey } from "@/i18n/config";
import { sectionIds } from "@/i18n/sections";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";
import { useRefraction } from "./effects/refraction";

type Props = {
  lang: Locale;
  page: PageKey;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
};

export function SiteNav({ lang, page, nav, a11y }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  useRefraction(barRef, { scale: -26, bezel: 0.22, blur: 11, chroma: false });

  const home = pathFor("home", lang);
  const ids = sectionIds[lang];
  const base = page === "home" ? "" : home;
  const links = [
    { href: `${base}#${ids.services}`, label: nav.services },
    { href: `${base}#${ids.process}`, label: nav.process },
    { href: pathFor("support", lang), label: nav.support, current: page === "support" },
  ];
  const quoteHref = `${base}#${ids.quote}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        ref={barRef}
        data-scrolled={scrolled}
        className="glass glass-pill glass-strong mx-auto flex max-w-[1120px] items-center justify-between gap-3 py-2 pr-2 pl-4 transition-[padding,background-color] duration-500 data-[scrolled=true]:py-1.5"
      >
        <Link href={home} aria-label={a11y.home} className="rounded-full py-1">
          <Logo />
        </Link>

        <nav aria-label={a11y.mainNav} className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className="rounded-full px-3.5 py-2 text-[0.9375rem] text-ivory/80 transition-colors hover:bg-white/8 hover:text-ivory aria-[current=page]:text-amber-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LangSwitch lang={lang} page={page} label={a11y.language} idPrefix="bar" />
          </div>
          <Link href={quoteHref} className="btn btn-amber hidden min-h-10 px-4 text-[0.9375rem] md:inline-flex">
            {nav.quote}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.closeMenu : a11y.menu}
            className="relative grid h-10 w-10 place-items-center rounded-full md:hidden"
          >
            {!open && (
              <motion.span
                layoutId="menu-glass"
                className="glass glass-pill absolute inset-0"
                style={{ "--g-tint": "0.12" } as React.CSSProperties}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 rounded bg-ivory transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 rounded bg-ivory transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            layoutId="menu-glass"
            className="glass glass-strong mx-auto mt-2 max-w-[1120px] overflow-hidden md:hidden"
            style={{ borderRadius: 28 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="grid gap-1 p-3"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={link.current ? "page" : undefined}
                  className="rounded-2xl px-4 py-3 text-lg hover:bg-white/8 aria-[current=page]:text-amber-soft"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-3 px-1 pb-1">
                <LangSwitch lang={lang} page={page} label={a11y.language} idPrefix="sheet" />
                <Link href={quoteHref} onClick={() => setOpen(false)} className="btn btn-amber">
                  {nav.quote}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
