/*
  Lockup de AN DIGITAL: isotipo de puntos + wordmark "an digital." en minúsculas.
  Isotipo propio: una tira de 8 sellos (4 × 2), como una tarjeta de fidelización; el último es un aro vacío
  (el premio que falta). No repite la disposición de puntos de la referencia.
*/

export const ISO_DOTS: { x: number; y: number; ring?: boolean }[] = [
  { x: 5, y: 5 }, { x: 16, y: 5 }, { x: 27, y: 5 }, { x: 38, y: 5 },
  { x: 5, y: 16 }, { x: 16, y: 16 }, { x: 27, y: 16 }, { x: 38, y: 16, ring: true },
];

export function Isotipo({ className = "" }: { className?: string }) {
  return (
    <svg className={`iso ${className}`} viewBox="0 0 43 21" aria-hidden="true" focusable="false">
      {ISO_DOTS.map((d, i) =>
        d.ring ? (
          <circle key={i} className="iso-dot" cx={d.x} cy={d.y} r={3.65} fill="none" stroke="currentColor" strokeWidth={1.9} />
        ) : (
          <circle key={i} className="iso-dot" cx={d.x} cy={d.y} r={4.6} fill="currentColor" />
        ),
      )}
    </svg>
  );
}

export function Lockup({ className = "", as: Tag = "span" }: { className?: string; as?: "span" | "div" | "p" }) {
  return (
    <Tag className={`lockup ${className}`} role="img" aria-label="AN DIGITAL">
      <Isotipo />
      <span className="wordmark" aria-hidden="true">
        <span className="wm-inner">an digital<span className="wm-dot">.</span></span>
      </span>
    </Tag>
  );
}
