type Props = { lines: string[]; fit: number };

/**
 * Titular de la portada. Cada letra se expande (eje de ancho de Anybody)
 * desde condensada a normal, como si la línea ámbar la fuera encendiendo.
 */
export function HeroTitle({ lines, fit }: Props) {
  return (
    <div className="hero-title" style={{ "--fit": fit } as React.CSSProperties}>
      <h1 id="hero-title" className="t-display">
        <span className="sr-only">{lines.join(" ")}</span>
        <span aria-hidden="true">
          {lines.map((line, li) => {
            const lineStart = 80 + li * 150;
            const chars = Array.from(line);
            return (
              <span key={li} className="hero-line">
                {chars.map((ch, ci) => {
                  return (
                    <span
                      key={ci}
                      className="hero-char"
                      style={{ "--d": lineStart + ci * 32 } as React.CSSProperties}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      </h1>
    </div>
  );
}
