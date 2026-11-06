"use client";

import { useEffect, useRef } from "react";
import styles from "./gallery3d.module.css";

// Imágenes de referencia con profundidad 3D: el conjunto se inclina siguiendo el cursor,
// la imagen señalada pasa al frente y aparecen con un giro suave al hacer scroll.
// Sin ratón o con «reducir movimiento», se muestran quietas.
export type Gallery3DImage = { src: string; alt: string; label?: string };

export default function Gallery3D({ images, eyebrow, title, variant = "fan", className = "" }: {
  images: Gallery3DImage[];
  eyebrow?: string;
  title?: string;
  variant?: "fan" | "stack";
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
        el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
      });
    };
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  const body = (
    <div ref={stage} className={`${styles.stage} ${styles[variant]}`}>
      <div className={styles.scene}>
        {images.slice(0, 3).map((img, i) => (
          <figure key={img.src} className={`${styles.card} ${styles[`c${i}`]}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading={variant === "stack" ? "eager" : "lazy"} decoding="async" width={1600} height={1067} />
            <span className={styles.glare} aria-hidden="true" />
            {img.label && <figcaption>{img.label}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );

  if (variant === "stack") return <div className={className}>{body}</div>;

  return (
    <section className={`section ${styles.band} ${className}`} aria-label={title ?? "Imágenes de referencia"}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div className={styles.head}>
            {eyebrow && <span className="num">{eyebrow}</span>}
            {title && <h2 className="display">{title}</h2>}
          </div>
        )}
        {body}
      </div>
    </section>
  );
}
