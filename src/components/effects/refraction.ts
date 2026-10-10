"use client";

import { useEffect, type RefObject } from "react";

/**
 * Refracción tipo Liquid Glass.
 * Genera un mapa de desplazamiento del tamaño exacto del elemento y lo aplica
 * con `backdrop-filter: url(#filtro)`. Solo Chromium soporta filtros SVG en
 * backdrop-filter; Safari y Firefox se quedan con el vidrio esmerilado del CSS.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
let supported: boolean | null = null;
let defs: SVGDefsElement | null = null;
let counter = 0;

function canRefract() {
  if (supported !== null) return supported;
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const chromium = /Chrome\/\d+/.test(ua) && !/CriOS|FxiOS/.test(ua);
  const reduced = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  supported = chromium && !reduced && CSS.supports("backdrop-filter", "blur(1px)");
  if (supported) document.documentElement.classList.add("can-refract");
  return supported;
}

function ensureDefs() {
  if (defs) return defs;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  defs = document.createElementNS(SVG_NS, "defs");
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

function displacementMap(w: number, h: number, r: number, bezel: number) {
  const b = Math.max(2, Math.min(w, h) * bezel);
  const innerR = Math.max(0, r - b);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="${w}" height="${h}" fill="black"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#r)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#b)" style="mix-blend-mode:difference"/><rect x="${b}" y="${b}" width="${Math.max(0, w - 2 * b)}" height="${Math.max(0, h - 2 * b)}" rx="${innerR}" fill="hsl(0 0% 50% / 0.94)" style="filter:blur(${Math.max(4, b * 0.9)}px)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export type RefractionOptions = {
  /** Fuerza de la refracción en px (negativo = efecto lupa). */
  scale?: number;
  /** Proporción del borde que curva la luz. */
  bezel?: number;
  /** Desenfoque del fondo antes de refractar. */
  blur?: number;
  saturate?: number;
  brightness?: number;
  /** Aberración cromática sutil en el borde. */
  chroma?: boolean;
};

export function useRefraction<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { scale = -70, bezel = 0.22, blur = 2, saturate = 1.7, brightness = 1.06, chroma = true }: RefractionOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !canRefract()) return;

    const id = `lg-${++counter}`;
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "100%");
    filter.setAttribute("height", "100%");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    filter.innerHTML = chroma
      ? `<feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
         <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${scale}" result="dr"/>
         <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red"/>
         <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${scale * 1.06}" result="dg"/>
         <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green"/>
         <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${scale * 1.12}" result="db"/>
         <feColorMatrix in="db" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue"/>
         <feBlend in="red" in2="green" mode="screen" result="rg"/>
         <feBlend in="rg" in2="blue" mode="screen"/>`
      : `<feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
         <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="${scale}"/>`;
    ensureDefs().appendChild(filter);
    const image = filter.querySelector("feImage");

    const update = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h || !image) return;
      const cssRadius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const r = Math.min(cssRadius, Math.min(w, h) / 2);
      image.setAttribute("href", displacementMap(w, h, r, bezel));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    const value = `blur(${blur}px) url(#${id}) saturate(${saturate}) brightness(${brightness})`;
    el.style.backdropFilter = value;
    el.style.setProperty("-webkit-backdrop-filter", value);

    return () => {
      ro.disconnect();
      filter.remove();
      el.style.backdropFilter = "";
      el.style.removeProperty("-webkit-backdrop-filter");
    };
  }, [ref, scale, bezel, blur, saturate, brightness, chroma]);
}
