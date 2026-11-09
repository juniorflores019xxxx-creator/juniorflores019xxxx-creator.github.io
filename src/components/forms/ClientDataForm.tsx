"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ACCEPT, getForm, type DataForm, type Field } from "@/lib/forms";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import FilePicker from "./FilePicker";
import styles from "@/components/designs/request.module.css";

// Formulario de datos para clientes. Lee el formulario de ?f=<id>, lo muestra por pasos
// y lo envía a /api/datos.php. Si el servidor no responde, ofrece mandar los textos por WhatsApp.
// Lo escrito se guarda en el navegador del cliente (no los archivos), para que pueda ir a WhatsApp y volver.
const API = "/api/datos.php";
const MAX_MB = 10;
const SKIP = new Set(["t0", "formulario", "sitio_web", "archivos_whatsapp[]"]);
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Qué preguntas condicionales se ven según lo respondido (los controles ocultos no entran en FormData)
function visibility(form: DataForm, el: HTMLFormElement | null) {
  const fd = el ? new FormData(el) : null;
  const vis: Record<string, boolean> = {};
  for (const s of form.sections) for (const f of s.fields) {
    const w = f.when;
    if (!w) { vis[f.name] = true; continue; }
    const vals = fd ? [...fd.getAll(w.field), ...fd.getAll(`${w.field}[]`)].map(String) : [];
    vis[f.name] = (vis[w.field] ?? true) && vals.some((v) => w.in.includes(v));
  }
  return vis;
}

// Recorre los controles en orden; la clave lleva el número de aparición porque varios comparten nombre
function controls(el: HTMLFormElement) {
  const seen: Record<string, number> = {};
  return ([...el.elements] as Control[]).filter((c) => c.name && !SKIP.has(c.name) && c.type !== "file" && c.type !== "hidden").map((c) => {
    const i = (seen[c.name] = (seen[c.name] ?? -1) + 1);
    return [`${c.name}#${i}`, c] as const;
  });
}

function FieldInput({ f, context }: { f: Field; context: string }) {
  if (f.type === "note") {
    return (
      <div className={styles.note} role="note">
        <b>{f.label}</b>
        <p>{f.help}</p>
        {f.wa && <a className="btn btn-ghost" href={`${WHATSAPP_URL}?text=${encodeURIComponent(f.wa)}`} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Enviar por WhatsApp</a>}
      </div>
    );
  }
  const id = `c-${f.name}`;
  const label = <span>{f.label}{!f.required && <small> (opcional)</small>}</span>;
  const help = f.help && <small className={styles.help}>{f.help}</small>;
  if (f.type === "select") {
    return (
      <label className={styles.field}>{label}
        <select name={f.name} required={f.required} defaultValue=""><option value="" disabled={f.required}>Elige</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>{help}
      </label>
    );
  }
  if (f.type === "multi") {
    return (
      <div className={styles.field} role="group" aria-label={f.label}><span>{label}</span>
        <div className={styles.checks}>{f.options!.map((o) => <label key={o}><input type="checkbox" name={`${f.name}[]`} value={o} data-required={f.required ? f.name : undefined} /><span>{o}</span></label>)}</div>{help}
      </div>
    );
  }
  if (f.type === "colors") {
    return (
      <div className={styles.field}><span>{label}</span>
        <div className={styles.colors}>
          {[0, 1, 2].map((i) => (
            <label key={i} className={styles.color}>
              <input type="checkbox" name={`${f.name}_usar[]`} value={String(i)} aria-label={`Usar el color ${i + 1}`} />
              <input type="color" name={`${f.name}[]`} defaultValue={["#1c64e6", "#0b0d12", "#f5b700"][i]} aria-label={`Color ${i + 1}`} />
              <span>Color {i + 1}</span>
            </label>
          ))}
        </div>
        <small className={styles.help}>{f.help} Marca la casilla de los colores que quieras enviar.</small>
      </div>
    );
  }
  if (f.type === "file") {
    return <FilePicker name={`${f.name}[]`} label={f.label} help={f.help} ext={ACCEPT[f.accept ?? "todo"]} maxMB={MAX_MB} context={context} />;
  }
  if (f.type === "textarea") {
    return <label className={styles.field}>{label}<textarea id={id} name={f.name} rows={4} required={f.required} maxLength={f.max} placeholder={f.placeholder} />{help}</label>;
  }
  const pattern = f.type === "tel" ? String.raw`[0-9 +\(\)\-]{7,20}` : undefined;
  return <label className={styles.field}>{label}<input id={id} name={f.name} type={f.type} required={f.required} maxLength={f.max} placeholder={f.placeholder} pattern={pattern} />{help}</label>;
}

export default function ClientDataForm() {
  const [form, setForm] = useState<DataForm | null | undefined>(undefined);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"" | "enviando" | "error">("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [waHref, setWaHref] = useState(WHATSAPP_URL);
  const [t0] = useState(() => String(Date.now()));
  const [vis, setVis] = useState<Record<string, boolean>>({});
  const [restored, setRestored] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const steps = useRef<(HTMLFieldSetElement | null)[]>([]);
  const draftKey = form ? `sibnova:datos:${form.id}` : "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(getForm(new URLSearchParams(window.location.search).get("f") ?? "") ?? null);
  }, []);

  // Recupera lo que el cliente ya había escrito en este dispositivo
  useEffect(() => {
    if (!form || !ref.current) return;
    let saved: { step?: number; v?: Record<string, string | boolean> } | null = null;
    try { saved = JSON.parse(localStorage.getItem(`sibnova:datos:${form.id}`) || "null"); } catch { saved = null; }
    if (saved?.v) {
      for (const [k, c] of controls(ref.current)) {
        const v = saved.v[k];
        if (v === undefined) continue;
        if (c instanceof HTMLInputElement && (c.type === "checkbox" || c.type === "radio")) c.checked = v === true;
        else c.value = String(v);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestored(true);
    }
    setVis(visibility(form, ref.current));
    if (typeof saved?.step === "number" && saved.step > 0 && saved.step < form.sections.length) setStep(saved.step);
  }, [form]);

  function remember(nextStep = step) {
    if (!form || !ref.current) return;
    setVis(visibility(form, ref.current));
    const v: Record<string, string | boolean> = {};
    for (const [k, c] of controls(ref.current)) v[k] = c instanceof HTMLInputElement && (c.type === "checkbox" || c.type === "radio") ? c.checked : c.value;
    try { localStorage.setItem(draftKey, JSON.stringify({ step: nextStep, v })); } catch { /* sin almacenamiento: el formulario sigue funcionando */ }
  }

  if (form === undefined) return null;
  if (form === null) {
    return (
      <div className={styles.done}>
        <h2>Este enlace no es válido</h2>
        <p>Pide a SIBNOVA el enlace correcto de tu formulario.</p>
        <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Escribir a SIBNOVA</a>
      </div>
    );
  }
  const total = form.sections.length;

  function validStep(i: number) {
    const fs = steps.current[i];
    if (!fs) return true;
    const active = (x: HTMLInputElement) => !x.matches(":disabled");
    for (const name of new Set([...fs.querySelectorAll<HTMLInputElement>("[data-required]")].filter(active).map((x) => x.dataset.required!))) {
      const boxes = [...fs.querySelectorAll<HTMLInputElement>(`input[data-required="${name}"]`)].filter(active);
      if (!boxes.some((b) => b.checked)) { boxes[0].setCustomValidity("Elige al menos una opción."); boxes[0].reportValidity(); boxes[0].setCustomValidity(""); return false; }
    }
    const bad = [...fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")].find((x) => !x.checkValidity());
    if (bad) { bad.reportValidity(); return false; }
    return true;
  }

  function go(to: number) {
    if (to > step && !validStep(step)) return;
    setStatus(""); setStep(to); remember(to);
    requestAnimationFrame(() => { document.getElementById("datos")?.scrollIntoView({ behavior: "smooth" }); steps.current[to]?.querySelector<HTMLElement>("legend")?.focus(); });
  }

  function whatsappText(fd: FormData) {
    const lines = [`Hola SIBNOVA, completé el formulario «${form!.title}».`, ""];
    for (const s of form!.sections) for (const f of s.fields) {
      if (f.type === "file" || f.type === "colors" || f.type === "note") continue;
      const v = f.type === "multi" ? fd.getAll(`${f.name}[]`).join(", ") : String(fd.get(f.name) ?? "").trim();
      if (v) lines.push(`${f.label}: ${v}`);
    }
    lines.push("", "Los archivos los envío por este chat.");
    return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n").slice(0, 3500))}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (let i = 0; i < total; i++) if (!validStep(i)) { setStep(i); return; }
    const fd = new FormData(e.currentTarget);
    setStatus("enviando"); setError("");
    try {
      const res = await fetch(API, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "No pudimos recibir tus datos.");
      setSent(json.numero); setStatus("");
      try { localStorage.removeItem(draftKey); } catch { /* nada que borrar */ }
    } catch (err) {
      setWaHref(whatsappText(fd));
      setStatus("error");
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "No pudimos conectar con el servidor.");
    }
  }

  if (sent) {
    return (
      <div className={styles.done} role="status">
        <IconCheck width={40} height={40} aria-hidden="true" />
        <h2>¡Gracias! Recibimos tus datos</h2>
        <p>Tu número de envío es <b>{sent}</b>. Revisaremos la información y te escribiremos si falta algo.</p>
        <a className="btn btn-primary" href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola SIBNOVA, envié el formulario ${sent}.`)}`} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Avisar por WhatsApp</a>
      </div>
    );
  }

  return (
    <>
      <h1 className="display h2">{form.title}</h1>
      <p className="lead" style={{ margin: "12px 0 28px" }}>{form.intro}</p>
      <form ref={ref} id="datos" className={styles.form} onSubmit={onSubmit} onChange={() => remember()} noValidate encType="multipart/form-data" style={{ scrollMarginTop: "calc(var(--header-h) + 16px)" }}>
        <div className={styles.progress}>
          <p>Paso {step + 1} de {total}: <b>{form.sections[step].title}</b></p>
          <div className={styles.bar} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Avance"><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
          <small className={styles.help}>{restored ? "Recuperamos lo que ya habías escrito. " : ""}Lo que escribes se guarda solo en este dispositivo: puedes ir a WhatsApp y volver. Lo que no sepas, déjalo en blanco.</small>
        </div>
        <div className={styles.hp} aria-hidden="true"><label>No completar <input name="sitio_web" tabIndex={-1} autoComplete="off" /></label></div>
        <input type="hidden" name="t0" value={t0} />
        <input type="hidden" name="formulario" value={form.id} />
        {form.sections.map((s, i) => (
          <fieldset key={s.title + i} ref={(el) => { steps.current[i] = el; }} hidden={step !== i} className={styles.step}>
            <legend tabIndex={-1}>{s.title}</legend>
            {s.intro && <p className={styles.help}>{s.intro}</p>}
            {s.fields.map((f) => {
              const input = <FieldInput key={f.name} f={f} context={`formulario «${form.title}»`} />;
              if (!f.when) return input;
              const on = !!vis[f.name];
              return <fieldset key={f.name} className={styles.cond} disabled={!on} hidden={!on}>{input}</fieldset>;
            })}
            {i === total - 1 && (
              <label className={styles.consent}>
                <input type="checkbox" name="acepto" value="si" required />
                <span>Acepto que SIBNOVA use estos datos y archivos solo para realizar mi proyecto. SIBNOVA los trata como confidenciales: no los vende, no los comparte ni los usa con fines comerciales propios (<a href="/privacidad/#confidencialidad" target="_blank">Política de privacidad</a>).</span>
              </label>
            )}
          </fieldset>
        ))}
        <p className={styles.warn}>No escribas contraseñas en este formulario. Si hace falta un acceso, te pediremos enviarlo solo por WhatsApp privado.</p>
        <div className={styles.nav}>
          {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>Atrás</button>}
          {step < total - 1
            ? <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>Continuar <ArrowRight /></button>
            : <button type="submit" className="btn btn-primary" disabled={status === "enviando"}>{status === "enviando" ? "Enviando…" : "Enviar mis datos"}</button>}
        </div>
        {status === "error" && (
          <div className={styles.fail} role="alert">
            <p><b>{error}</b> Puedes intentarlo de nuevo o mandarnos los textos por WhatsApp al {SITE.phoneDisplay} y los archivos por el mismo chat.</p>
            <a className="btn btn-ghost" href={waHref} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Enviar por WhatsApp</a>
          </div>
        )}
      </form>
    </>
  );
}
