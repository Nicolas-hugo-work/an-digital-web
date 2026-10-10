"use client";

import { requestQuote, type ServiceKey } from "@/lib/quote-bus";

type Props = { service: ServiceKey; href: string; label: string; serviceName: string };

export function QuoteLink({ service, href, label, serviceName }: Props) {
  return (
    <a
      href={href}
      onClick={() => requestQuote(service)}
      aria-label={`${label}: ${serviceName}`}
      className="inline-flex min-h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium text-amber-soft shadow-[inset_0_0_0_1px_rgb(233_168_43/0.45)] transition-colors hover:bg-amber hover:text-ink"
    >
      {label}
    </a>
  );
}
