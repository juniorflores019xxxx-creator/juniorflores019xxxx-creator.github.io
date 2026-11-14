"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useTilt } from "@/components/ui/useTilt";
import { ArrowRight } from "@/components/ui/icons";
import { SERVICE_ICONS } from "@/components/ui/serviceIcons";
import { SERVICES, serviceHref } from "@/lib/services";
import Split from "@/components/ui/Split";
import styles from "./services.module.css";

export default function Services() {
  const gridRef = useRef<HTMLUListElement>(null);
  useTilt(`.${styles.card}`, 7);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.item}`,
        { opacity: 0, y: 80, rotateX: 16, z: -120, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, rotateX: 0, z: 0, filter: "blur(0px)", duration: 1.4, ease: "expo.out", stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="section" aria-label="Servicios">
      <div className="wrap">
        <div className={styles.head}>
          <Split as="h2" text="Lo que *construimos.*" className="display h2" />
          <p className="lead" data-reveal>
            Cinco capacidades, un mismo equipo: del primer boceto al sistema funcionando, y tu marca activa en redes sociales.
          </p>
        </div>

        <ul ref={gridRef} className={styles.grid}>
          {SERVICES.map(({ slug, n, title, short, icon, status }) => {
            const Icon = SERVICE_ICONS[icon];
            return (
              <li key={slug} className={styles.item}>
                <Link href={serviceHref(slug)} className={styles.link} aria-label={`${title}: ver cómo lo hacemos`}>
                  <article className={`spot ${styles.card}`}>
                    <div className={styles.top}>
                      <span className="num">{n}{status && <em className={styles.status}>{status}</em>}</span>
                      <span className={styles.icon}><Icon /></span>
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.text}>{short}</p>
                    <span className={styles.more}>
                      Ver cómo lo hacemos <ArrowRight />
                    </span>
                    <span className={styles.bar} aria-hidden="true" />
                  </article>
                </Link>
              </li>
            );
          })}
          <li className={`${styles.item} ${styles.wide}`}>
            <Link href="/redes-sociales/" className={styles.link} aria-label="Marketing digital y community manager: ver combos y precios">
              <article className={`spot ${styles.card}`}>
                <div className={styles.top}>
                  <span className="num">05<em className={styles.isNew}>Nuevo</em></span>
                  <span className={styles.icon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className="draw" d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></svg>
                  </span>
                </div>
                <h3 className={styles.title}>Marketing digital y community manager</h3>
                <p className={styles.text}>Manejamos tus redes sociales: videos grabados en tu negocio, publicaciones, respuesta a tus clientes e informe mensual. Combos con precio claro.</p>
                <span className={styles.more}>Ver combos y precios <ArrowRight /></span>
                <span className={styles.bar} aria-hidden="true" />
              </article>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
