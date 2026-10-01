"use client";

import { useEffect } from "react";

/**
 * Al entrar a una página de detalle, la lleva al inicio.
 * Next.js 16 conserva la posición de scroll si la página nueva sigue visible,
 * así que al venir desde la mitad de la portada se abría a media página.
 * Si la URL trae un ancla (#contacto), se respeta.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
