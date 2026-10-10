"use client";

import { useRef } from "react";
import { useRefraction } from "../effects/refraction";

export function HeroRail() {
  const ref = useRef<HTMLSpanElement>(null);
  useRefraction(ref, { scale: -70, bezel: 0.5, blur: 0, saturate: 1.6, brightness: 1.12 });
  return (
    <div className="hero-rail" aria-hidden="true">
      <span className="hero-rail-line" />
      <span ref={ref} className="glass hero-lens" />
    </div>
  );
}
