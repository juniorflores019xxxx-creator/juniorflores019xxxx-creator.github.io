"use client";

import { useEffect } from "react";

// Fija el título de la pestaña en páginas sin metadata propia (por ejemplo, la 404).
// Next vuelve a escribir el título del layout al hidratar, así que se vigila <head> y se restaura.
export default function DocTitle({ title }: { title: string }) {
  useEffect(() => {
    const fix = () => { if (document.title !== title) document.title = title; };
    fix();
    const obs = new MutationObserver(fix);
    obs.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => obs.disconnect();
  }, [title]);
  return null;
}
