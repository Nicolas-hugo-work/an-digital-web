import type { Metadata, Viewport } from "next";
// Anybody (titulares, con eje de anchura) y Jost (texto), autoalojadas con Fontsource: funciona con output: export
import "@fontsource-variable/anybody/standard.css";
import "@fontsource-variable/anybody/standard-italic.css";
import "@fontsource-variable/jost";
import "@fontsource-variable/jost/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AN DIGITAL — Tu negocio, en el celular de tus clientes",
  description:
    "Tarjetas de fidelización para Apple Wallet y Google Wallet, tarjetas NFC para reseñas y páginas web para negocios pequeños en Virginia y Bolivia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1226",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
