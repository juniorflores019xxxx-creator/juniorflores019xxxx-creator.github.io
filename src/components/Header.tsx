"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV, SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconSearch, IconWhatsApp } from "@/components/ui/icons";
import { openSearch } from "@/components/search/SearchPalette";
import styles from "./header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fondo al hacer scroll + se esconde al bajar y reaparece al subir
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 420 && y > last + 4);
        if (y < last - 4 || y < 420) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Enlace activo según la sección visible
  useEffect(() => {
    const ids = NAV.map((n) => n.href.split("#")[1]);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Menú móvil: bloquear scroll, cerrar con Esc y mantener el foco dentro
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (e.key === "Tab" && menuRef.current) {
        const f = [toggleRef.current!, ...menuRef.current.querySelectorAll<HTMLElement>("a")];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${hidden && !open ? styles.hidden : ""} ${open ? styles.isOpen : ""}`}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name}, ir al inicio`} onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className={styles.plate}><img src="/brand/sn-logo.png" alt="" width={865} height={407} className={styles.symbol} /></span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sibnova-nombre-claro.png" alt="" width={631} height={84} className={styles.wordmark} />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={active === item.href.split("#")[1] ? styles.active : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <button type="button" className={styles.search} onClick={() => { setOpen(false); openSearch(); }} aria-label="Buscador inteligente (Ctrl + K)" aria-haspopup="dialog">
          <IconSearch width={18} height={18} />
          <span className={styles.searchLabel}>Buscar</span>
          <kbd className={styles.kbd}>Ctrl K</kbd>
        </button>

        <a href="#contacto" className={`btn btn-primary ${styles.cta}`}>Hablemos</a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <i /><i />
        </button>
      </div>

      <div id="menu-movil" ref={menuRef} className={styles.menu} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <nav className={`wrap ${styles.menuNav}`} aria-label="Menú móvil">
          {NAV.map((item, i) => (
            <a key={item.href} href={item.href} style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }} onClick={() => setOpen(false)}>
              <span className="num">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={`wrap ${styles.menuFoot}`} style={{ transitionDelay: open ? "380ms" : "0ms" }}>
          <a href="#contacto" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}>
            Hablemos <ArrowRight />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={styles.menuWa}>
            <IconWhatsApp width={18} height={18} /> {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
