"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./cta.module.css";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(ref);
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 30%", scrub: true } })
        .fromTo(q(`.${styles.big}`), { scale: 0.86, opacity: 0.2, filter: "blur(14px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", ease: "none" }, 0)
        .fromTo(q(`.${styles.light}`), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, ease: "none" }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} id="cta" className={styles.cta} aria-label="Empieza tu proyecto">
      <div className={styles.light} aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className={styles.horizon} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <h2 className={`display ${styles.big}`}>¿Tienes una idea?</h2>
        <p className={styles.sub} data-reveal>Nosotros podemos convertirla en tecnología.</p>
        <div data-reveal>
          <a href="#contacto" className="btn btn-light btn-lg">
            Hablar con SIBNOVA <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
