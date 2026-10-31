import type { RubroId } from "@/lib/models";

// Ilustraciones propias de los modelos: ocupan el lugar de las fotos reales de cada cliente.
const MOTIFS: Record<RubroId, string[]> = {
  restaurante: [
    "M4 13h16a8 8 0 0 1-16 0zM2 21h20M9 9c0-2 2-2 2-4M14 9c0-2 2-2 2-4",
    "M12 3c3 4 6 6 6 11a6 6 0 0 1-12 0c0-2 1-4 3-6 0 2 1 3 2 3 1-2 0-5 1-8z",
    "M7 3v7a3 3 0 0 0 6 0V3M10 3v18M18 3c-2 1-3 4-3 8h3v10",
    "M7 3h10l-1 18H8zM7.5 9h9",
  ],
  salud: [
    "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
    "M12 21C5 16 3 12 3 8.500A4.500 4.500 0 0 1 12 6a4.500 4.500 0 0 1 9 2.500C21 12 19 16 12 21z",
    "M6 3v6a5 5 0 0 0 10 0V3M11 14v3a4 4 0 0 0 8 0v-2M19 13a2 2 0 1 0 0-.1",
    "M8 3c-3 0-4 3-4 6 0 4 2 6 2 9 0 2 1 3 2 3 2 0 1-6 4-6s2 6 4 6c1 0 2-1 2-3 0-3 2-5 2-9 0-3-1-6-4-6-2 0-3 1-4 1S10 3 8 3z",
  ],
  construccion: [
    "M4 21V8l8-5 8 5v13M2 21h20M9 21v-6h6v6M9 10h.01M15 10h.01",
    "M5 21V4h11M5 8l5-4M5 4h15l-3 5H5M16 9v5M14 14h4v3h-4zM2 21h7",
    "M3 15a9 9 0 0 1 18 0zM2 15h20v3H2zM10 6.300V11M14 6.300V11",
    "M3 21V10l6 3v-3l6 3V5h6v16zM7 17h2M12 17h2M17 17h1",
  ],
  comercio: [
    "M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3c-1 2-3 3-4 3S9 5 8 3z",
    "M6 8h12l2 13H4zM9 11V6a3 3 0 0 1 6 0v5",
    "M3 12V3h9l9 9-9 9zM8 8h.01",
    "M3 17c0-2 2-2 5-4l3-5 3 1c0 3 3 5 7 6v4H3z",
  ],
};

export default function Art({ rubro, i = 0, label, className }: { rubro: RubroId; i?: number; label?: string; className?: string }) {
  const id = `art-${rubro}-${i}`;
  const d = MOTIFS[rubro][i % 4];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${i * 35} .5 .5)`}>
          <stop offset="0" style={{ stopColor: "var(--brand)" }} />
          <stop offset="1" style={{ stopColor: "var(--brand-2)" }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />
      <circle cx={70 + (i * 83) % 260} cy={60 + (i * 47) % 180} r="130" fill="#fff" opacity=".07" />
      <circle cx={340 - (i * 61) % 240} cy={250 - (i * 37) % 160} r="90" fill="#000" opacity=".08" />
      <g transform="translate(116 66) scale(7)" fill="none" stroke="#fff" strokeOpacity=".92" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </g>
    </svg>
  );
}
