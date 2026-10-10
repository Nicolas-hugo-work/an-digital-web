"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function SmoothScroll() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
  if (reduced) return null;
  return <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -88 }, autoRaf: true }} />;
}
