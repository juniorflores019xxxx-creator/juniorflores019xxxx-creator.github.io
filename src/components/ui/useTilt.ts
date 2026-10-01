"use client";

import { useEffect } from "react";

/**
 * Inclinación 3D ligera + luz que sigue al cursor para tarjetas.
 * Solo en dispositivos con ratón y sin movimiento reducido.
 */
export function useTilt(selector: string, max = 6) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const handlers = cards.map((card) => {
      let raf = 0;
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
          card.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
          card.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
        });
      };
      const leave = () => {
        cancelAnimationFrame(raf);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
    });
    return () => handlers.forEach((off) => off());
  }, [selector, max]);
}
