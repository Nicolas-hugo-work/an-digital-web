# AN Digital: sitio web

Sitio de presentación de **AN Digital**: tarjetas de fidelización para Apple Wallet y Google Wallet, tarjetas NFC para reseñas, landing pages, aplicaciones web, mantenimiento web y agentes de IA para llamadas.

- Bilingüe: español (`/es`) e inglés (`/en`). La raíz `/` detecta el idioma del navegador.
- Soporte con URL propia: `/soporte` (español) y `/support` (inglés).
- Estilo Liquid Glass: vidrio translúcido, brillo que sigue al puntero, refracción real en Chrome/Edge.

## Stack

| Pieza | Uso |
|---|---|
| Next.js 16 (App Router) + TypeScript | Páginas estáticas, rutas por idioma, SEO |
| Tailwind CSS 4 | Tokens de color y utilidades |
| Motion 12 | Tarjeta 3D, sellos, menú que se transforma, selector de idioma |
| Lenis | Scroll suave (se apaga si el visitante pidió menos movimiento) |
| Anybody + Jost (alojadas en el proyecto) | Titulares y texto |

## Direcciones del sitio

| Dirección | Página |
|---|---|
| `/` | Redirige a `/es` o `/en` según el idioma del navegador |
| `/es`, `/en` | Inicio |
| `/soporte` → `/es/soporte` | Soporte en español |
| `/support` → `/en/support` | Soporte en inglés |
| `/privacidad`, `/privacy` | Privacidad |
| `/sitemap.xml`, `/robots.txt` | Para Google |

## Cómo editar lo más común

- **Textos (español):** `src/i18n/dictionaries/es.ts`
- **Textos (inglés):** `src/i18n/dictionaries/en.ts`
- **Teléfono, WhatsApp y correo de soporte:** `src/lib/contact.ts`
- **Colores:** bloque `@theme` al inicio de `src/app/globals.css`
- **Imagen al compartir el link (WhatsApp/Facebook):** `public/brand/og-es.png` y `og-en.png`
- **Logo:** `public/brand/an-digital-logo.jpg`

Los tiempos de respuesta y el horario de soporte están en `support.times` y `support.hours` de cada diccionario. Ajústalos a lo que de verdad puedas cumplir.

## Trabajar en tu computadora

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compila como en producción
```

## Publicar en Vercel

1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. **Add New → Project** y elige el repositorio `an-digital-web`.
3. Deja todo como viene (Vercel detecta Next.js) y pulsa **Deploy**.
4. Cada vez que subas cambios a GitHub, Vercel publica la nueva versión solo.

Cuando conectes un dominio propio, agrega la variable de entorno `NEXT_PUBLIC_SITE_URL` (por ejemplo `https://andigital.com`) en **Settings → Environment Variables** para que el sitemap y las imágenes al compartir usen ese dominio. Si quieres `soporte.tudominio.com`, agrega ese subdominio en Vercel y redirígelo a `/es/soporte`.
