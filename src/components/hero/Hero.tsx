"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { ArrowRight } from "@/components/ui/icons";
import { CAPABILITIES } from "./capabilities";
import styles from "./hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const reduced = prefersReducedMotion();
    const mobile = window.matchMedia("(max-width: 899px)").matches;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Three.js se carga aparte para no bloquear la primera pintura.
    import("./HeroScene").then(({ HeroScene }) => {
      if (disposed) return;
      const scene = new HeroScene({
        canvas,
        logoUrl: "/brand/sn-logo.png",
        mobile,
        onFrame: (labels) => {
          labels.forEach((l, i) => {
            const el = labelRefs.current[i];
            if (!el) return;
            el.style.transform = `translate3d(${l.x}px, ${l.y}px, 0) translate(-50%, -50%)`;
            el.style.opacity = String(l.alpha);
          });
        },
      });

      const sticky = canvas.parentElement!;
      const ro = new ResizeObserver(() => {
        scene.resize(sticky.clientWidth, sticky.clientHeight);
        if (reduced) scene.renderStatic(0);
      });
      ro.observe(sticky);
      scene.resize(sticky.clientWidth, sticky.clientHeight);

      if (reduced) {
        scene.renderStatic(0);
        cleanup = () => { ro.disconnect(); scene.dispose(); };
        return;
      }

      // Scroll → progreso de la escena
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => scene.setProgress(self.progress),
      });

      // Ratón → parallax de cámara
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // Solo renderizar cuando el hero está en pantalla y la pestaña visible
      let inView = true;
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) scene.start();
        else scene.stop();
      });
      io.observe(section);
      const onVis = () => (document.hidden || !inView ? scene.stop() : scene.start());
      document.addEventListener("visibilitychange", onVis);
      scene.start();

      cleanup = () => {
        st.kill();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        scene.dispose();
      };
    });

    // Textos del hero: entrada al cargar y salida cinematográfica con el scroll
    const ctx = gsap.context(() => {
      if (reduced) return;
      const items = contentRef.current!.querySelectorAll("[data-hero-in]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 28, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.15 }
      );
      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "32% top", scrub: true },
      })
        .to(contentRef.current, { opacity: 0, y: -70, scale: 0.96, filter: "blur(12px)", ease: "none" }, 0)
        .to(hintRef.current, { opacity: 0, ease: "none" }, 0);
    }, section);

    return () => {
      disposed = true;
      ctx.revert();
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className={styles.hero} aria-label="Presentación">
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />

        <div className={styles.labels} aria-hidden="true">
          {CAPABILITIES.map((c, i) => (
            <span key={c} ref={(el) => { labelRefs.current[i] = el; }} className={styles.label}>
              {c}
            </span>
          ))}
        </div>

        <div ref={contentRef} className={`wrap ${styles.content}`}>
          <h1 className={`display ${styles.title}`}>
            <span data-hero-in className={styles.line}>Transformamos ideas</span>{" "}
            <span data-hero-in className={styles.line}>
              en <span className={styles.accent}>tecnología.</span>
            </span>
          </h1>
          <p data-hero-in className={styles.sub}>
            Desarrollamos aplicaciones, automatizamos negocios con inteligencia artificial y creamos experiencias
            digitales que hacen crecer empresas.
          </p>
          <div data-hero-in className={styles.ctas}>
            <a href="#servicios" className="btn btn-primary btn-lg">
              Conoce nuestros servicios <ArrowRight />
            </a>
            <a href="#contacto" className="btn btn-ghost btn-lg">
              Habla con nosotros
            </a>
          </div>
        </div>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>Desliza</span>
          <i />
        </div>
      </div>
      <span className="sr-only">Capacidades: {CAPABILITIES.join(", ")}.</span>
    </section>
  );
}
