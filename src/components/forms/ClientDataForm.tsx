"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ACCEPT, getForm, type DataForm, type Field } from "@/lib/forms";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import styles from "@/components/designs/request.module.css";

// Formulario de datos para clientes. Lee el formulario de ?f=<id>, lo muestra por pasos
// y lo envía a /api/datos.php. Si el servidor no responde, ofrece mandar los textos por WhatsApp.
const API = "/api/datos.php";
const MAX_MB = 10;

function FieldInput({ f }: { f: Field }) {
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
    const ext = ACCEPT[f.accept ?? "todo"];
    return (
      <label className={styles.field}>{label}
        <input type="file" name={`${f.name}[]`} multiple accept={ext.map((e) => `.${e}`).join(",")} />
        <small className={styles.help}>{f.help ? `${f.help} ` : ""}Formatos: {ext.join(", ")}. Hasta {MAX_MB} MB por archivo.</small>
      </label>
    );
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
  const ref = useRef<HTMLFormElement>(null);
  const steps = useRef<(HTMLFieldSetElement | null)[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(getForm(new URLSearchParams(window.location.search).get("f") ?? "") ?? null);
  }, []);

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
    for (const f of [...fs.querySelectorAll<HTMLInputElement>("input[type=file]")]) {
      const big = [...(f.files ?? [])].find((x) => x.size > MAX_MB * 1024 * 1024);
      if (big) { setError(`«${big.name}» pesa más de ${MAX_MB} MB. Compártelo con un enlace de Drive.`); setStatus("error"); return false; }
    }
    for (const name of new Set([...fs.querySelectorAll<HTMLInputElement>("[data-required]")].map((x) => x.dataset.required!))) {
      const boxes = [...fs.querySelectorAll<HTMLInputElement>(`input[data-required="${name}"]`)];
      if (!boxes.some((b) => b.checked)) { boxes[0].setCustomValidity("Elige al menos una opción."); boxes[0].reportValidity(); boxes[0].setCustomValidity(""); return false; }
    }
    const bad = [...fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")].find((x) => !x.checkValidity());
    if (bad) { bad.reportValidity(); return false; }
    return true;
  }

  function go(to: number) {
    if (to > step && !validStep(step)) return;
    setStatus(""); setStep(to);
    requestAnimationFrame(() => { document.getElementById("datos")?.scrollIntoView({ behavior: "smooth" }); steps.current[to]?.querySelector<HTMLElement>("legend")?.focus(); });
  }

  function whatsappText(fd: FormData) {
    const lines = [`Hola SIBNOVA, completé el formulario «${form!.title}».`, ""];
    for (const s of form!.sections) for (const f of s.fields) {
      if (f.type === "file" || f.type === "colors") continue;
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
      <form ref={ref} id="datos" className={styles.form} onSubmit={onSubmit} noValidate encType="multipart/form-data" style={{ scrollMarginTop: "calc(var(--header-h) + 16px)" }}>
        <div className={styles.progress}>
          <p>Paso {step + 1} de {total}: <b>{form.sections[step].title}</b></p>
          <div className={styles.bar} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Avance"><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
        </div>
        <div className={styles.hp} aria-hidden="true"><label>No completar <input name="sitio_web" tabIndex={-1} autoComplete="off" /></label></div>
        <input type="hidden" name="t0" value={t0} />
        <input type="hidden" name="formulario" value={form.id} />
        {form.sections.map((s, i) => (
          <fieldset key={s.title + i} ref={(el) => { steps.current[i] = el; }} hidden={step !== i} className={styles.step}>
            <legend tabIndex={-1}>{s.title}</legend>
            {s.intro && <p className={styles.help}>{s.intro}</p>}
            {s.fields.map((f) => <FieldInput key={f.name} f={f} />)}
            {i === total - 1 && (
              <label className={styles.consent}>
                <input type="checkbox" name="acepto" value="si" required />
                <span>Acepto que SIBNOVA use estos datos y archivos para realizar mi proyecto, según la <a href="/privacidad/" target="_blank">Política de privacidad</a>.</span>
              </label>
            )}
          </fieldset>
        ))}
        <p className={styles.warn}>Nunca te pediremos contraseñas de tu correo, tus redes sociales, tu banco o tu hosting. No las escribas aquí.</p>
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
