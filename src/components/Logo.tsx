type Props = { className?: string; withWordmark?: boolean };

/** Monograma AN con la barra ámbar, igual que el logo de la marca. */
export function Logo({ className, withWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect x="4" y="53" width="92" height="8" fill="#E9A82B" />
        <path d="M10 80 L31 18 L52 80 H42 L31 46 L20 80 Z" fill="#F3EFE4" />
        <path d="M58 80 V20 H67.5 L83 57 V20 H92 V80 H82.5 L67 43 V80 Z" fill="#F3EFE4" />
      </svg>
      {withWordmark && (
        <span
          className="font-display text-[1.0625rem] tracking-[0.01em]"
          style={{ fontVariationSettings: '"wdth" 118, "wght" 600' }}
        >
          AN Digital
        </span>
      )}
    </span>
  );
}
