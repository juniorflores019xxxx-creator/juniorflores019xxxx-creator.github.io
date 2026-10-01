"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Split from "@/components/ui/Split";
import styles from "./process.module.css";

const STEPS = [
  { n: "01", title: "Descubrimos", text: "Analizamos el negocio, los problemas y las oportunidades." },
  { n: "02", title: "Diseñamos", text: "Definimos la experiencia, la arquitectura y la estrategia tecnológica." },
  { n: "03", title: "Desarrollamos", text: "Construimos software, aplicaciones e integraciones." },
  { n: "04", title: "Automatizamos", text: "Incorporamos inteligencia artificial y automatizaciones." },
  { n: "05", title: "Escalamos", text: "Medimos resultados, optimizamos y hacemos crecer la solución." },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const steps = gsap.utils.toArray<HTMLElement>(`.${styles.step}`, section);
    const fill = section.querySelector<HTMLElement>(`.${styles.fill}`)!;
    const light = (p: number) =>
      steps.forEach((s, i) => s.classList.toggle(styles.lit, p >= (i + 0.35) / steps.length));

    const mm = gsap.matchMedia();

    // Escritorio: la sección se fija y la línea recorre las cinco etapas
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "center center",
          end: "+=85%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => light(self.progress),
        },
      });
      tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      steps.forEach((s, i) => {
        tl.fromTo(s.querySelector(`.${styles.body}`), { opacity: 0.25, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 }, i / steps.length);
      });
    });

    // Móvil: línea vertical ligada al scroll, sin fijar la sección
    mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: {
          trigger: section.querySelector(`.${styles.track}`), start: "top 70%", end: "bottom 60%", scrub: true,
          onUpdate: (self) => light(self.progress),
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => light(1));

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="proceso" className={`section ${styles.section}`} aria-label="Proceso">
      <div ref={pinRef} className={`wrap ${styles.pin}`}>
        <div className={styles.head}>
          <Split as="h2" text="De la idea al *sistema.*" className="display h2" />
          <p className="lead" data-reveal>Un proceso claro, en cinco etapas, para pasar de un problema de negocio a una solución que funciona y crece.</p>
        </div>

        <ol className={styles.track}>
          <li className={styles.line} aria-hidden="true"><span className={styles.fill} /></li>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.body}>
                <span className="num">{s.n}</span>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.text}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
