/*
  Genera las imágenes de la tarjeta AN Club (Apple Wallet, storeCard) a partir del isotipo de AN DIGITAL.
  Se corre a mano cuando cambia el diseño:  npm run pass:assets

  Salida (no son secretas, pero tampoco van en public/):
    passes/anclub.pass/icon.png  @2x @3x   → 29×29 · 58×58 · 87×87     (obligatorio: notificaciones y pantalla de bloqueo)
    passes/anclub.pass/logo.png  @2x @3x   → 62×30 · 124×60 · 186×90   (máx. Apple 160×50 @1x; el texto "AN Club" lo pone logoText)
    passes/strips/strip-N.png    @2x @3x   → 375×123 · 750×246 · 1125×369, para N = 0…10 sellos
*/
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelDir = path.join(root, "passes", "anclub.pass");
const stripsDir = path.join(root, "passes", "strips");

// Paleta de marca (app/globals.css)
const C = {
  bg: "#0A1226",
  ink: "#EEF0FA",
  violet: "#6B5CE7",
  lavender: "#C9C2FF",
  cyan: "#7DE3F4",
};

const SCALES = [
  { suffix: "", k: 1 },
  { suffix: "@2x", k: 2 },
  { suffix: "@3x", k: 3 },
];

async function render(svg, width, height, file) {
  await sharp(Buffer.from(svg), { density: 72 * Math.max(1, width / 100) })
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(file);
}

/* ── Ícono: el mismo de la pestaña del navegador (app/icon.svg) ── */
async function icon() {
  const svg = await readFile(path.join(root, "app", "icon.svg"), "utf8");
  for (const { suffix, k } of SCALES) {
    await render(svg, 29 * k, 29 * k, path.join(modelDir, `icon${suffix}.png`));
  }
}

/* ── Logo: isotipo (tira de 8 sellos, el último es el aro del premio), fondo transparente ── */
function logoSvg() {
  // Mismas coordenadas que ISO_DOTS en components/Lockup.tsx (viewBox 43×21), con margen para que no se corte
  const dots = [
    [5, 5], [16, 5], [27, 5], [38, 5],
    [5, 16], [16, 16], [27, 16],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${C.ink}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -0.39 45 21.78">
    ${dots}
    <circle cx="38" cy="16" r="3.65" fill="none" stroke="${C.lavender}" stroke-width="2.2"/>
  </svg>`;
}

async function logo() {
  const svg = logoSvg();
  for (const { suffix, k } of SCALES) {
    await render(svg, 62 * k, 30 * k, path.join(modelDir, `logo${suffix}.png`));
  }
}

/* ── Strip: 10 sellos en 5×2. Ganados = blanco; pendientes = contorno tenue; el 10° = aro lavanda (premio) ── */
function stripSvg(earned) {
  const W = 375, H = 123;
  const r = 17, dx = 52, dy = 48;
  const x0 = (W - 4 * dx) / 2;
  const y0 = H / 2 - dy / 2;
  let out = "";
  for (let i = 0; i < 10; i++) {
    const cx = x0 + (i % 5) * dx;
    const cy = y0 + Math.floor(i / 5) * dy;
    const got = i < earned;
    const prize = i === 9;
    if (prize && got) {
      // Premio desbloqueado: relleno lavanda con halo cian
      out += `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${C.cyan}" opacity="0.22"/>`;
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.lavender}"/>`;
      out += `<circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="none" stroke="${C.bg}" stroke-width="2.6"/>`;
    } else if (prize) {
      out += `<circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="none" stroke="${C.lavender}" stroke-width="4"/>`;
    } else if (got) {
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.ink}"/>`;
    } else {
      out += `<circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="none" stroke="${C.ink}" stroke-opacity="0.28" stroke-width="2" stroke-dasharray="4 4"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="65%">
        <stop offset="0" stop-color="${C.violet}" stop-opacity="0.38"/>
        <stop offset="1" stop-color="${C.violet}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${out}
  </svg>`;
}

async function strips() {
  for (let n = 0; n <= 10; n++) {
    const svg = stripSvg(n);
    for (const { suffix, k } of SCALES) {
      await render(svg, 375 * k, 123 * k, path.join(stripsDir, `strip-${n}${suffix}.png`));
    }
  }
}

await mkdir(modelDir, { recursive: true });
await mkdir(stripsDir, { recursive: true });
await icon();
await logo();
await strips();
console.log("Listo: imágenes de AN Club generadas en passes/");
