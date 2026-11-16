import type { Metadata } from "next";
import { AddToWalletButton } from "@/components/AddToWalletButton";

// Página de PRUEBA de la tarjeta AN Club: /club?key=<WALLET_TEST_KEY>&sellos=7
export const metadata: Metadata = {
  title: "AN Club — Tu tarjeta de fidelización",
  robots: { index: false, follow: false },
};

export default async function ClubPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const qs = new URLSearchParams({ key: one(sp.key), sellos: one(sp.sellos) || "7" });

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "48px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 420, display: "grid", gap: 16, justifyItems: "center" }}>
        <p style={{ color: "var(--cyan)", letterSpacing: "0.14em", fontSize: 13, fontWeight: 600 }}>AN CLUB</p>
        <h1 style={{ fontFamily: "var(--display)", fontSize: 34, lineHeight: 1.1 }}>Tu tarjeta de fidelización</h1>
        <p style={{ color: "var(--muted)" }}>
          Suma un sello por cada servicio. Al completar 10, tu 11° servicio es gratis.
        </p>
        <AddToWalletButton href={`/api/wallet/prueba?${qs}`} />
        <p style={{ color: "var(--faint)", fontSize: 13 }}>Ábrelo desde Safari en tu iPhone.</p>
      </div>
    </main>
  );
}
