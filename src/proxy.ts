import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["es", "en"] as const;

/** Atajos cortos que se pueden imprimir en tarjetas o compartir. */
const SHORTCUTS: Record<string, string> = {
  "/soporte": "/es/soporte",
  "/support": "/en/support",
  "/privacidad": "/es/privacidad",
  "/privacy": "/en/privacy",
};

/** URL pública en inglés → carpeta interna (la carpeta usa el nombre en español). */
const EN_REWRITES: Record<string, string> = {
  "/en/support": "/en/soporte",
  "/en/privacy": "/en/privacidad",
};

/** Corrige URLs mezcladas para que cada idioma tenga una sola dirección. */
const CANONICAL: Record<string, string> = {
  "/en/soporte": "/en/support",
  "/en/privacidad": "/en/privacy",
  "/es/support": "/es/soporte",
  "/es/privacy": "/es/privacidad",
};

function preferredLocale(request: NextRequest): (typeof LOCALES)[number] {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.lang)
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((entry) => entry.lang === "es" || entry.lang === "en");
  return (match?.lang as "es" | "en") ?? "es";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  const shortcut = SHORTCUTS[path.toLowerCase()];
  if (shortcut) {
    const url = request.nextUrl.clone();
    url.pathname = shortcut;
    return NextResponse.redirect(url, 308);
  }

  const canonical = CANONICAL[path];
  if (canonical) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.redirect(url, 308);
  }

  const rewrite = EN_REWRITES[path];
  if (rewrite) {
    const url = request.nextUrl.clone();
    url.pathname = rewrite;
    return NextResponse.rewrite(url);
  }

  const hasLocale = LOCALES.some((l) => path === `/${l}` || path.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${path === "/" ? "" : path}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Todo excepto archivos internos de Next, archivos con extensión y rutas de metadatos.
    "/((?!_next|api|favicon.ico|icon.svg|apple-icon.png|sitemap.xml|robots.txt|brand/|.*\\..*).*)",
  ],
};
