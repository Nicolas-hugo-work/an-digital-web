import type { Locale } from "./config";
import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";

const dictionaries = { es, en };

export const getDictionary = (lang: Locale) => dictionaries[lang];
export type { Dictionary } from "./dictionaries/es";
