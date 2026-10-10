import type { Dictionary } from "@/i18n/get-dictionary";
import { NfcIcon, PhoneIcon, StarIcon } from "../icons";

type V = Dictionary["services"]["visuals"];

/** Marco interior donde vive cada objeto ilustrativo. */
function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[20px] bg-ink/45 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08),inset_0_1px_2px_rgb(0_0_0/0.4)] ${className}`}
    >
      {children}
    </div>
  );
}

const miniPasses = [
  { name: "Café Altura", color: "#E9A82B", ink: "#0a1226", filled: 7, rotate: -9, x: "-22%" },
  { name: "Barbería Norte", color: "#3E63DD", ink: "#f3efe4", filled: 4, rotate: 0, x: "0%" },
  { name: "Panadería Sol", color: "#F3EFE4", ink: "#0a1226", filled: 9, rotate: 9, x: "22%" },
];

export function LoyaltyVisual() {
  return (
    <Screen className="grid h-full min-h-[240px] place-items-center">
      <div className="relative h-[200px] w-[200px]">
        {miniPasses.map((p, i) => (
          <div
            key={p.name}
            className="absolute inset-0 m-auto h-[188px] w-[132px] rounded-[16px] p-3 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.7)]"
            style={{
              background: `linear-gradient(160deg, ${p.color}, color-mix(in oklab, ${p.color} 70%, #0a1226))`,
              color: p.ink,
              transform: `translateX(${p.x}) rotate(${p.rotate}deg)`,
              zIndex: i === 1 ? 3 : 1,
            }}
          >
            <p className="font-display text-[0.8125rem] leading-tight" style={{ fontVariationSettings: '"wdth" 110, "wght" 640' }}>
              {p.name}
            </p>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {Array.from({ length: 10 }, (_, s) => (
                <span
                  key={s}
                  className="aspect-square rounded-full"
                  style={{
                    background: s < p.filled ? p.ink : "transparent",
                    boxShadow: `inset 0 0 0 1px ${p.ink}`,
                    opacity: s < p.filled ? 0.9 : 0.35,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-3 right-3 h-9 rounded-md" style={{ background: p.ink, opacity: 0.85 }} />
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function NfcVisual({ v }: { v: V }) {
  return (
    <Screen className="flex h-[180px] items-center justify-center gap-5 px-4">
      <div className="relative grid h-[118px] w-[84px] place-items-center rounded-[14px] bg-[linear-gradient(160deg,#1f2c4f,#0e1730)] shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_14px_30px_-12px_rgb(0_0_0/0.7)]">
        <NfcIcon className="h-9 w-9 text-amber" />
        <span className="absolute bottom-2 text-[0.625rem] text-ivory/70">{v.nfcTap}</span>
      </div>
      <div className="grid gap-2">
        <div className="flex gap-0.5 text-amber">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className="h-5 w-5" />
          ))}
        </div>
        <span className="rounded-full bg-ivory/90 px-3 py-1 text-[0.8125rem] font-medium text-ink">{v.nfcReview}</span>
      </div>
    </Screen>
  );
}

export function LandingVisual({ v }: { v: V }) {
  return (
    <Screen className="h-[180px]">
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-ivory/25" />
        <span className="h-2 w-2 rounded-full bg-ivory/25" />
        <span className="h-2 w-2 rounded-full bg-ivory/25" />
        <span className="ml-2 h-4 flex-1 rounded-full bg-white/8" />
      </div>
      <div className="grid gap-2 p-4">
        <p className="font-display text-[1.0625rem] leading-tight" style={{ fontVariationSettings: '"wdth" 112, "wght" 640' }}>
          {v.landingHeadline}
        </p>
        <span className="h-2 w-4/5 rounded-full bg-white/12" />
        <span className="h-2 w-3/5 rounded-full bg-white/12" />
        <span className="mt-2 w-fit rounded-full bg-amber px-3.5 py-1.5 text-[0.75rem] font-medium text-ink">{v.landingCta}</span>
      </div>
    </Screen>
  );
}

export function AppVisual({ v }: { v: V }) {
  const bars = [38, 52, 44, 70, 62, 92, 58];
  return (
    <Screen className="h-[180px] p-4">
      <p className="text-[0.8125rem] text-ivory/80">{v.appTitle}</p>
      <div className="mt-3 flex h-[78px] items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span
              className="w-full rounded-t-[5px]"
              style={{ height: `${h * 0.7}px`, background: i === 5 ? "#E9A82B" : "rgb(243 239 228 / 0.22)" }}
            />
            <span className="text-[0.625rem] text-mist">{v.appDays[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[0.75rem] text-mist">
        <span>
          {v.appRows[0]} <b className="font-medium text-ivory">128</b>
        </span>
        <span>
          {v.appRows[1]} <b className="font-medium text-ivory">24</b>
        </span>
      </div>
    </Screen>
  );
}

export function MaintenanceVisual({ v }: { v: V }) {
  const rows = [v.statusOnline, v.statusBackup, v.statusUpdates];
  return (
    <Screen className="h-[180px] p-4">
      <ul className="grid gap-2.5">
        {rows.map((row) => (
          <li key={row} className="flex items-center gap-2.5 text-[0.8125rem] text-ivory/85">
            <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_10px_rgb(111_220_170/0.8)]" />
            {row}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-[3px]">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="h-6 flex-1 rounded-[2px] bg-ok/70" style={{ opacity: 0.45 + (i % 5) * 0.1 }} />
        ))}
      </div>
    </Screen>
  );
}

export function AiCallVisual({ v }: { v: V }) {
  const wave = [6, 14, 22, 12, 28, 18, 34, 20, 10, 26, 16, 30, 12, 22, 8, 18, 26, 14, 6];
  return (
    <Screen className="grid h-full min-h-[220px] content-center gap-4 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-ok/90 text-ink">
          <PhoneIcon className="h-5 w-5" />
        </span>
        <span className="text-[0.875rem] text-ivory/85">{v.callIncoming}</span>
        <div className="ml-auto flex h-9 items-center gap-[3px]">
          {wave.map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-amber" style={{ height: `${h}px`, opacity: 0.55 + (h / 34) * 0.45 }} />
          ))}
        </div>
      </div>
      <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2 text-[0.875rem]">{v.callCaller}</p>
      <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-amber px-3.5 py-2 text-[0.875rem] text-ink">{v.callAgent}</p>
    </Screen>
  );
}
