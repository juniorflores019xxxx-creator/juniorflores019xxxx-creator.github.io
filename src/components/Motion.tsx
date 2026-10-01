"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Orquesta las animaciones de scroll de toda la página:
 *  [data-split]     titulares que entran palabra a palabra
 *  [data-reveal]    elementos que aparecen con desenfoque y desplazamiento (en grupo, escalonados)
 *  [data-parallax]  movimiento diferencial (valor = intensidad)
 *  [data-zoom]      imágenes que hacen zoom al entrar
 * Con prefers-reduced-motion todo se muestra directamente.
 */
export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".split-word"),
          { yPercent: 110, opacity: 0, rotate: 2 },
          {
            yPercent: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "expo.out", stagger: 0.045,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 36, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out", stagger: 0.09, overwrite: true, clearProps: "transform,filter" }
          ),
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(el, { yPercent: amount * 100 }, {
          yPercent: -amount * 100, ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((el) => {
        gsap.fromTo(el, { scale: 1.18 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "center center", scrub: true },
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-reveal], .split-word", { opacity: 1, clearProps: "transform,filter" });
    });

    // Recalcular posiciones cuando cargan fuentes e imágenes
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
