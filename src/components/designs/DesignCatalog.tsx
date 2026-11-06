"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, DESIGNS, shotSrc, viewerHref, type Category } from "@/lib/designs";
import { norm } from "@/components/search/searchIndex";
import { IconSearch } from "@/components/ui/icons";
import ChooseDesign from "./ChooseDesign";
import styles from "./catalog-designs.module.css";

// Catálogo de los 20 estilos con buscador por nombre y filtro por tipo de negocio.
export default function DesignCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "">("");

  const list = useMemo(() => {
    const t = norm(q).trim();
    return DESIGNS.filter((d) =>
      (!cat || d.categories.includes(cat)) &&
      (!t || norm(`${d.n} ${d.name} ${d.short} ${d.traits.join(" ")}`).includes(t))
    );
  }, [q, cat]);

  return (
    <>
      <div className={styles.tools}>
        <label className={styles.search}>
          <IconSearch width={18} height={18} aria-hidden="true" />
          <span className="sr-only">Buscar por nombre del estilo</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar estilo: minimalista, dark, 3D…" autoComplete="off" />
        </label>
        <div className={styles.chips} role="group" aria-label="Filtrar por tipo de negocio">
          <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>Todos</button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(cat === c ? "" : c)}>{c}</button>
          ))}
        </div>
      </div>

      <p className={styles.count} role="status" aria-live="polite">
        {list.length === DESIGNS.length ? `${list.length} diseños` : `${list.length} de ${DESIGNS.length} diseños`}
      </p>

      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>No encontramos un estilo con esa búsqueda.</p>
          <button type="button" className="btn btn-ghost" onClick={() => { setQ(""); setCat(""); }}>Ver todos los diseños</button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {list.map((d) => (
            <li key={d.slug} id={`diseno-${d.slug}`} className={styles.card}>
              <Link href={viewerHref(d)} className={styles.thumb} tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shotSrc(d)} alt="" width={800} height={500} loading="lazy" decoding="async" />
              </Link>
              <div className={styles.body}>
                <p className={styles.head}><span className={styles.num}>{d.n}</span><b>{d.name}</b></p>
                <p className={styles.short}>{d.short}</p>
                <ul className={styles.traits} aria-label="Características visuales">
                  {d.traits.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p className={styles.for}><b>Recomendado para:</b> {d.categories.join(", ")}</p>
                <div className={styles.acts}>
                  <Link href={viewerHref(d)} className="btn btn-ghost">Ver demostración</Link>
                  <ChooseDesign slug={d.slug} className="btn btn-primary" label={`Seleccionar el diseño ${d.n} ${d.name}`}>Seleccionar este diseño</ChooseDesign>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
