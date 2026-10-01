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
            Cuatro capacidades, un mismo equipo: del primer boceto al sistema funcionando.
          </p>
        </div>

        <ul ref={gridRef} className={styles.grid}>
          {SERVICES.map(({ slug, n, title, short, icon }) => {
            const Icon = SERVICE_ICONS[icon];
            return (
              <li key={slug} className={styles.item}>
                <Link href={serviceHref(slug)} className={styles.link} aria-label={`${title}: ver cómo lo hacemos`}>
                  <article className={`spot ${styles.card}`}>
                    <div className={styles.top}>
                      <span className="num">{n}</span>
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
        </ul>
      </div>
    </section>
  );
}
