import type { NextConfig } from "next";

// Next.js con servidor (Vercel): necesario para firmar la tarjeta AN Club en /api/wallet/*
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // El modelo y las strips de la tarjeta se leen del disco: hay que incluirlos en la función de Vercel
  outputFileTracingIncludes: {
    "/api/wallet/*": ["./passes/**/*"],
  },
};

export default nextConfig;
