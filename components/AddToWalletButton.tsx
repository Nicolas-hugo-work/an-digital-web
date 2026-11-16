/*
  Botón "Agregar a Apple Wallet" con el badge OFICIAL de Apple (no se puede dibujar uno propio).
  Descarga el badge en español desde https://developer.apple.com/wallet/add-to-apple-wallet-guidelines/
  y guárdalo como: public/wallet/agregar-a-apple-wallet.svg
  Reglas de Apple: alto mínimo 30 pt, sin modificar colores ni proporciones, con espacio libre alrededor.
*/
export function AddToWalletButton({ href, height = 48 }: { href: string; height?: number }) {
  return (
    <a href={href} style={{ display: "inline-block", lineHeight: 0, padding: 8 }} rel="nofollow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/wallet/agregar-a-apple-wallet.svg" alt="Agregar a Apple Wallet" height={height} style={{ height, width: "auto" }} />
    </a>
  );
}
