"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Split from "@/components/ui/Split";
import styles from "./ecosystem.module.css";

const INNER = ["AI", "APIs", "DATA"];
const OUTER = ["CLOUD", "MOBILE", "WEB", "AUTOMATION"];

function Orbit({ items, radius, dur, offset, reverse }: { items: string[]; radius: number; dur: number; offset: number; reverse?: boolean }) {
  return (
    <div className={styles.orbit} style={{ ["--dur" as string]: `${dur}s`, ["--dir" as string]: reverse ? "reverse" : "normal" }}>
      <svg className={styles.links} viewBox="-50 -50 100 100" aria-hidden="true">
        <circle r={radius} className={styles.ring} />
        {items.map((_, i) => {
          const a = ((offset + (i * 360) / items.length) * Math.PI) / 180;
          const x = Math.cos(a) * radius, y = Math.sin(a) * radius;
          return <line key={i} x1={Math.cos(a) * 9} y1={Math.sin(a) * 9} x2={x} y2={y} className={styles.link} style={{ animationDelay: `${i * -0.7}s` }} />;
        })}
      </svg>
      {items.map((label, i) => {
        const deg = offset + (i * 360) / items.length;
        return (
          <span key={label} className={styles.node} style={{ ["--a" as string]: `${deg}deg`, ["--r" as string]: radius }}>
            <span className={styles.chip}>{label}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function Ecosystem() {
  const sysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(sysRef.current, { scale: 0.78, rotate: -18, opacity: 0.2 }, {
        scale: 1, rotate: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: sysRef.current, start: "top 95%", end: "center 55%", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="ecosistema" className={`section ${styles.section}`} aria-label="Ecosistema tecnológico">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.copy}>
          <Split as="h2" text="Todo conectado en un mismo *ecosistema.*" className="display h2" />
          <p className="lead" data-reveal>
            Cada solución que construimos se integra con las demás: tus aplicaciones, tus datos y tus procesos
            trabajan como un solo sistema.
          </p>
        </div>

        <div className={styles.stage}>
          <div ref={sysRef} className={styles.system} role="img" aria-label="SIBNOVA en el centro, conectada con AI, APIs, DATA, CLOUD, MOBILE, WEB y AUTOMATION">
            <div className={styles.halo} aria-hidden="true" />
            <Orbit items={OUTER} radius={46} dur={90} offset={-60} />
            <Orbit items={INNER} radius={29} dur={60} offset={-90} reverse />
            <div className={styles.core} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/sn-logo.png" alt="" width={865} height={407} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
