"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { INDEX, QUICK, SUGGESTIONS, search, words, norm, type Entry } from "./searchIndex";
import { IconDoc, IconGrid, IconMail, IconPhone, IconPin, IconSearch, IconSend, IconSpark, IconUser, IconWhatsApp } from "@/components/ui/icons";
import styles from "./search.module.css";

export const OPEN_SEARCH_EVENT = "sibnova:buscar";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));

const ICONS = { grid: IconGrid, spark: IconSpark, doc: IconDoc, user: IconUser, send: IconSend, phone: IconPhone, pin: IconPin, mail: IconMail, wa: IconWhatsApp };

type Item = Entry & { custom?: string };

function Highlight({ text, query }: { text: string; query: string }) {
  const qs = words(query).filter((w) => w.length >= 2);
  if (!qs.length) return <>{text}</>;
  return (
    <>
      {text.split(/(\s+)/).map((part, i) => {
        const n = norm(part).trim();
        const hit = n && qs.some((w) => n.startsWith(w) || (w.startsWith(n) && n.length >= 3));
        return hit ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<Element | null>(null);
  const router = useRouter();

  const found = useMemo(() => (query.trim() ? search(query) : QUICK.map((t) => INDEX.find((e) => e.t === t)!)), [query]);
  const items: Item[] = useMemo(() => {
    const q = query.trim();
    return q
      ? [...found, { t: `Contarnos: «${q}»`, d: "Te llevamos al formulario con este texto ya escrito", type: "Acción", icon: "send", k: "", href: "#contacto", prefill: true, custom: q }]
      : found;
  }, [found, query]);

  const show = useCallback(() => {
    openerRef.current = document.activeElement;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    const el = openerRef.current as HTMLElement | null;
    el?.focus?.({ preventScroll: true });
  }, []);

  // Atajos: Ctrl/Cmd + K, "/" y el evento del botón del header
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = document.activeElement;
      const typing = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || (t as HTMLElement | null)?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => { if (!o) { openerRef.current = document.activeElement; setQuery(""); setActive(0); } return !o; }); }
      else if (e.key === "/" && !typing) { e.preventDefault(); show(); }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, show);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(OPEN_SEARCH_EVENT, show); };
  }, [show]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (item?: Item) => {
    if (!item) return;
    close();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    if (item.url) { window.open(item.url, item.url.startsWith("http") ? "_blank" : "_self", "noopener"); return; }

    if (item.prefill) {
      const text = item.custom ?? (query.trim() ? `Consulta: ${query.trim()}` : "");
      document.getElementById("contacto")?.scrollIntoView({ behavior });
      setTimeout(() => {
        const area = document.getElementById("c-mensaje") as HTMLTextAreaElement | null;
        if (area && text) {
          const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
          setter?.call(area, area.value.trim() ? `${area.value.trim()}\n${text}` : text);
          area.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (item.topic) (document.querySelector(`input[name="tema"][value="${item.topic}"]`) as HTMLInputElement | null)?.click();
        area?.focus({ preventScroll: true });
      }, reduced ? 0 : 700);
      return;
    }

    // El diagnóstico es una página estática fuera de Next: carga completa
    if (item.href === "/diagnostico/") { window.location.assign(item.href); return; }
    // Páginas propias (p. ej. /servicios/desarrollo-web/)
    if (item.href?.startsWith("/")) { router.push(item.href); return; }

    let target: HTMLElement | null = item.href ? document.querySelector(item.href) : null;
    // Sección que no está en esta página → ir a la portada
    if (!target && item.href) { router.push(`/${item.href}`); return; }
    if (item.card) {
      const h = Array.from(document.querySelectorAll<HTMLElement>("#servicios h3")).find((x) => x.textContent?.trim() === item.card);
      target = h?.closest("article") ?? target;
    }
    if (!target) return;
    target.scrollIntoView({ behavior, block: item.card ? "center" : "start" });
    if (item.card) {
      target.classList.remove("flash");
      void target.offsetWidth;
      target.classList.add("flash");
      setTimeout(() => target?.classList.remove("flash"), 2000);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + items.length) % items.length); }
    else if (e.key === "Enter") { e.preventDefault(); choose(items[active]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") { e.preventDefault(); } // el foco se queda en el buscador
  };

  if (!open) return null;
  const q = query.trim();

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={close} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="buscador-titulo">
        <h2 id="buscador-titulo" className="sr-only">Buscar en SIBNOVA</h2>
        <div className={styles.head}>
          <IconSearch width={20} height={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="¿Qué necesitas? Ej.: un chatbot para mi negocio"
            role="combobox"
            aria-expanded="true"
            aria-controls="buscador-lista"
            aria-activedescendant={items.length ? `buscador-op-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button type="button" className={styles.esc} onClick={close} aria-label="Cerrar buscador">Esc</button>
        </div>

        <div className={styles.body}>
          {!q && (
            <div className={styles.suggest}>
              <p className={styles.label}>Prueba con</p>
              <div className={styles.chips}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => { setQuery(s); setActive(0); inputRef.current?.focus(); }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <p className={styles.label} id="buscador-etiqueta">
            {q ? (found.length ? "Resultados" : "No encontramos una coincidencia exacta, pero podemos ayudarte") : "Accesos rápidos"}
          </p>
          <ul ref={listRef} id="buscador-lista" role="listbox" aria-labelledby="buscador-etiqueta" className={styles.list}>
            {items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <li
                  key={item.t + i}
                  id={`buscador-op-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`${styles.item} ${item.custom ? styles.action : ""}`}
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => choose(item)}
                >
                  <span className={styles.icon}><Icon width={18} height={18} /></span>
                  <span className={styles.text}>
                    <b>{item.custom ? item.t : <Highlight text={item.t} query={q} />}</b>
                    <small>{item.d}</small>
                  </span>
                  <span className={styles.type}>{item.type}</span>
                </li>
              );
            })}
          </ul>
          <p className="sr-only" aria-live="polite">{q ? `${found.length} resultados` : ""}</p>
        </div>

        <div className={styles.foot}>
          <span><kbd>↑</kbd><kbd>↓</kbd> moverse</span>
          <span><kbd>Enter</kbd> abrir</span>
          <span><kbd>Esc</kbd> cerrar</span>
        </div>
      </div>
    </div>
  );
}
