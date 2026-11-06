"use client";

import { useState } from "react";
import Link from "next/link";
import { CATALOG_URL } from "@/lib/catalog";
import { DESIGNS, designHref, viewerHref, type Design } from "@/lib/designs";
import ChooseDesign from "./ChooseDesign";
import styles from "./viewer.module.css";

// Visor de demostraciones: la demo real dentro de un marco, con cambio de dispositivo
// y paso al estilo anterior o siguiente, como en las tiendas de plantillas.
const DEVICES = [
  { id: "escritorio", label: "Escritorio", width: "100%" },
  { id: "tablet", label: "Tablet", width: "820px" },
  { id: "celular", label: "Celular", width: "390px" },
] as const;

export default function DemoViewer({ d }: { d: Design }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("escritorio");
  const i = DESIGNS.findIndex((x) => x.slug === d.slug);
  const prev = DESIGNS[(i - 1 + DESIGNS.length) % DESIGNS.length];
  const next = DESIGNS[(i + 1) % DESIGNS.length];
  const width = DEVICES.find((x) => x.id === device)!.width;

  return (
    <div className={styles.viewer}>
      <header className={styles.bar}>
        <Link href={`${CATALOG_URL}#diseno-${d.slug}`} className={styles.back}>← Catálogo</Link>
        <div className={styles.nav}>
          <Link href={viewerHref(prev)} aria-label={`Estilo anterior: ${prev.n} ${prev.name}`} className={styles.arrow}>‹</Link>
          <h1 className={styles.name}><span>{d.n}</span> {d.name}</h1>
          <Link href={viewerHref(next)} aria-label={`Estilo siguiente: ${next.n} ${next.name}`} className={styles.arrow}>›</Link>
        </div>
        <div className={styles.devices} role="group" aria-label="Ver en">
          {DEVICES.map((x) => (
            <button key={x.id} type="button" aria-pressed={device === x.id} onClick={() => setDevice(x.id)}>{x.label}</button>
          ))}
        </div>
        <a href={designHref(d)} target="_blank" rel="noopener" className={styles.full}>Pantalla completa</a>
        <ChooseDesign slug={d.slug} className={styles.choose}>Seleccionar este diseño</ChooseDesign>
      </header>
      <p className={styles.note}><b>Demo de diseño SIBNOVA</b> · {d.short} Negocio ficticio.</p>
      <div id="contenido" className={styles.stage} data-device={device}>
        <iframe key={d.slug} src={designHref(d)} title={`Demostración del diseño ${d.n} ${d.name}`} style={{ width }} className={styles.frame} />
      </div>
    </div>
  );
}
