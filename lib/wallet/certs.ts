import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/*
  Certificados para firmar la tarjeta AN Club. NUNCA se guardan en el repo.

  · Producción (Vercel): variables de entorno con el contenido de cada archivo en base64
      APPLE_PASS_CERT_B64   ← pass.pem
      APPLE_PASS_KEY_B64    ← anclub.key
      APPLE_WWDR_CERT_B64   ← wwdr.pem
      APPLE_PASS_KEY_PASSPHRASE (opcional; anclub.key no tiene contraseña)

  · Local: en .env.local, APPLE_CERTS_DIR apunta a la carpeta privada con los tres archivos
      APPLE_CERTS_DIR="C:\AN DIGITAL\clave apple"
*/

export type PassCertificates = {
  wwdr: Buffer;
  signerCert: Buffer;
  signerKey: Buffer;
  signerKeyPassphrase?: string;
};

let cached: Promise<PassCertificates> | null = null;

export function getPassCertificates(): Promise<PassCertificates> {
  cached ??= load().catch((err) => {
    cached = null; // permite reintentar después de corregir la configuración
    throw err;
  });
  return cached;
}

async function load(): Promise<PassCertificates> {
  const passphrase = process.env.APPLE_PASS_KEY_PASSPHRASE || undefined;
  const b64 = {
    signerCert: process.env.APPLE_PASS_CERT_B64,
    signerKey: process.env.APPLE_PASS_KEY_B64,
    wwdr: process.env.APPLE_WWDR_CERT_B64,
  };

  if (b64.signerCert || b64.signerKey || b64.wwdr) {
    const missing = Object.entries({
      APPLE_PASS_CERT_B64: b64.signerCert,
      APPLE_PASS_KEY_B64: b64.signerKey,
      APPLE_WWDR_CERT_B64: b64.wwdr,
    })
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);

    return {
      signerCert: decodePem(b64.signerCert!, "APPLE_PASS_CERT_B64"),
      signerKey: decodePem(b64.signerKey!, "APPLE_PASS_KEY_B64"),
      wwdr: decodePem(b64.wwdr!, "APPLE_WWDR_CERT_B64"),
      signerKeyPassphrase: passphrase,
    };
  }

  const dir = process.env.APPLE_CERTS_DIR;
  if (!dir) {
    throw new Error(
      "No hay certificados configurados: define APPLE_PASS_CERT_B64 / APPLE_PASS_KEY_B64 / APPLE_WWDR_CERT_B64 (Vercel) o APPLE_CERTS_DIR (local).",
    );
  }
  const read = (name: string) =>
    readFile(path.join(dir, name)).catch(() => {
      throw new Error(`No se pudo leer ${name} en APPLE_CERTS_DIR`);
    });
  const [signerCert, signerKey, wwdr] = await Promise.all([read("pass.pem"), read("anclub.key"), read("wwdr.pem")]);
  return { signerCert, signerKey, wwdr, signerKeyPassphrase: passphrase };
}

// Decodifica base64 y comprueba que el resultado sea PEM (sin mostrar nunca el contenido)
function decodePem(value: string, name: string): Buffer {
  const buf = Buffer.from(value.trim(), "base64");
  if (!buf.subarray(0, 64).toString("utf8").includes("-----BEGIN ")) {
    throw new Error(`${name} no parece un PEM en base64 (revisa que copiaste el archivo completo)`);
  }
  return buf;
}
