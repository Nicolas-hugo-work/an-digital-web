import type { Locale } from "./config";

export const sectionIds: Record<Locale, { services: string; process: string; quote: string }> = {
  es: { services: "servicios", process: "proceso", quote: "cotizar" },
  en: { services: "services", process: "process", quote: "quote" },
};
