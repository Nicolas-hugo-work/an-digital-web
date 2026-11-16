import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PKPass } from "passkit-generator";
import { CONTACT_EMAIL, WHATSAPP } from "@/lib/i18n";
import { getPassCertificates } from "./certs";

export const STAMPS_GOAL = 10;
export const PKPASS_MIME = "application/vnd.apple.pkpass";

// passes/ se incluye en el deploy de Vercel con outputFileTracingIncludes (next.config.ts)
const PASSES_DIR = path.join(process.cwd(), "passes");
const MODEL_DIR = path.join(PASSES_DIR, "anclub.pass");
const STRIPS_DIR = path.join(PASSES_DIR, "strips");

export type AnClubMember = {
  /** Único por tarjeta y estable (Wallet lo usa junto al passTypeIdentifier para identificar el pase) */
  serialNumber: string;
  /** Lo que lleva el QR y se ve debajo, ej. "AN-0001" */
  memberId: string;
  name: string;
  /** 0…10 */
  stamps: number;
  memberSince: Date;
};

export async function createAnClubPass(member: AnClubMember): Promise<Buffer> {
  const stamps = Math.max(0, Math.min(STAMPS_GOAL, Math.trunc(member.stamps)));
  const complete = stamps >= STAMPS_GOAL;

  const pass = await PKPass.from(
    { model: MODEL_DIR, certificates: await getPassCertificates() },
    { serialNumber: member.serialNumber },
  );

  // Strip con los sellos ganados (pre-generada: npm run pass:assets)
  for (const suffix of ["", "@2x", "@3x"]) {
    pass.addBuffer(`strip${suffix}.png`, await readFile(path.join(STRIPS_DIR, `strip-${stamps}${suffix}.png`)));
  }

  pass.headerFields.push({
    key: "stamps",
    label: "SELLOS",
    value: `${stamps}/${STAMPS_GOAL}`,
    changeMessage: "¡Nuevo sello! Ahora tienes %@",
  });

  pass.secondaryFields.push(
    { key: "member", label: "CLIENTE", value: member.name },
    {
      key: "reward",
      label: "PREMIO",
      value: complete ? "¡Listo para canjear!" : "11° servicio gratis",
      textAlignment: "PKTextAlignmentRight",
    },
  );

  pass.auxiliaryFields.push({
    key: "since",
    label: "MIEMBRO DESDE",
    value: member.memberSince.toISOString(),
    dateStyle: "PKDateStyleMedium",
    timeStyle: "PKDateStyleNone",
  });

  pass.backFields.push(
    {
      key: "how",
      label: "Cómo funciona",
      value: `Suma un sello por cada servicio que contratas con AN DIGITAL. Al completar ${STAMPS_GOAL} sellos, tu 11° servicio es gratis.`,
    },
    { key: "id", label: "Número de miembro", value: member.memberId },
    {
      key: "contact",
      label: "Contacto",
      value: `WhatsApp EE.UU.: ${WHATSAPP.us}\nWhatsApp Bolivia: ${WHATSAPP.bo}\n${CONTACT_EMAIL}`,
      dataDetectorTypes: ["PKDataDetectorTypeLink"],
    },
    {
      key: "terms",
      label: "Condiciones",
      value: "Tarjeta personal e intransferible. El premio se canjea en el siguiente servicio contratado.",
    },
  );

  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: member.memberId,
    messageEncoding: "iso-8859-1",
    altText: member.memberId,
  });

  return pass.getAsBuffer();
}
