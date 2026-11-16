import { createHash, timingSafeEqual } from "node:crypto";
import { createAnClubPass, PKPASS_MIME } from "@/lib/wallet/createAnClubPass";

/*
  Tarjeta AN Club de PRUEBA (datos fijos), solo para probar en un iPhone real.
    GET /api/wallet/prueba?key=<WALLET_TEST_KEY>&sellos=7&nombre=Airton
  Cada descarga reemplaza la misma tarjeta en Wallet (mismo serialNumber).
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameSecret(given: string, expected: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const expected = process.env.WALLET_TEST_KEY;
  if (!expected || expected.length < 16) {
    return new Response("Endpoint de prueba desactivado (falta WALLET_TEST_KEY de 16+ caracteres).", { status: 503 });
  }

  const params = new URL(request.url).searchParams;
  if (!sameSecret(params.get("key") ?? "", expected)) {
    return new Response("No autorizado", { status: 401 });
  }

  const stamps = Number.parseInt(params.get("sellos") ?? "7", 10);
  const name = (params.get("nombre") ?? "Airton").slice(0, 40);

  try {
    const pkpass = await createAnClubPass({
      serialNumber: "ANCLUB-TEST-0001",
      memberId: "AN-0001",
      name,
      stamps: Number.isFinite(stamps) ? stamps : 0,
      memberSince: new Date("2026-11-15T12:00:00Z"),
    });

    return new Response(new Uint8Array(pkpass), {
      headers: {
        "Content-Type": PKPASS_MIME,
        "Content-Disposition": 'attachment; filename="anclub.pkpass"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    // Se registra el mensaje (nunca el contenido de los certificados) para verlo en los logs de Vercel
    console.error("[wallet/prueba] Error generando el pase:", err instanceof Error ? err.message : err);
    return new Response("No se pudo generar la tarjeta. Revisa los logs del servidor.", { status: 500 });
  }
}
