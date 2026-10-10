import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { isLocale, locales, siteUrl } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Background } from "@/components/Background";
import { SpecularTracker } from "@/components/effects/SpecularTracker";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Providers } from "@/components/effects/Providers";
import { notFound } from "next/navigation";

const anybody = localFont({
  src: "../fonts/Anybody.woff2",
  variable: "--font-anybody",
  display: "swap",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
});

const jost = localFont({
  src: "../fonts/Jost.woff2",
  variable: "--font-jost",
  display: "swap",
  weight: "100 900",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0a1226",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    applicationName: "AN Digital",
    openGraph: {
      type: "website",
      siteName: "AN Digital",
      locale: lang === "es" ? "es_US" : "en_US",
      images: [{ url: t.ogImage, width: 1200, height: 630, alt: "AN Digital" }],
    },
    twitter: { card: "summary_large_image", images: [t.ogImage] },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} className={`${anybody.variable} ${jost.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          {t.a11y.skip}
        </a>
        <Background />
        <Providers>{children}</Providers>
        <SpecularTracker />
        <SmoothScroll />
      </body>
    </html>
  );
}
