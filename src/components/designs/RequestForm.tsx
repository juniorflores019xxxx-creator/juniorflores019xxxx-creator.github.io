"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { WEB_PLANS, formatBs } from "@/lib/catalog";
import { CATEGORIES, DESIGNS, designHref, getDesign, shotSrc } from "@/lib/designs";
import { BUDGETS, FEATURES, FILES, REQUEST_API } from "@/lib/request";
import { clearSelection, readSelection, saveSelection } from "@/lib/selection";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import styles from "./request.module.css";

const STEPS = ["Diseño y paquete", "Tus datos", "Tu negocio", "Diseño", "Funciones", "Materiales", "Plazos y envío"];

type Sent = { numero: string } | null;

export default function RequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("empresa");
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"" | "enviando" | "error">("");
  const [error, setError] = useState("");
  const [waHref, setWaHref] = useState(WHATSAPP_URL);
  const [sent, setSent] = useState<Sent>(null);
  const [t0] = useState(() => String(Date.now()));

  // La selección llega por la URL (?diseno=) o desde el navegador; la URL manda.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("diseno") ?? "";
    const initial = getDesign(fromUrl) ? fromUrl : readSelection()?.slug ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) { setSlug(initial); saveSelection(initial); }
  }, []);

  const design = getDesign(slug);
  const pkg = WEB_PLANS.find((p) => p.slug === plan)!;

  function changeDesign(v: string) {
    setSlug(v);
    if (v) {
      saveSelection(v);
      const u = new URL(window.location.href); u.searchParams.set("diseno", v); window.history.replaceState(null, "", u);
    }
  }

  function checkFiles(list: FileList | null) {
    const files = [...(list ?? [])];
    let msg = "";
    if (files.length > FILES.maxFiles) msg = `Puedes subir hasta ${FILES.maxFiles} archivos.`;
    for (const f of files) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!FILES.ext.includes(ext)) { msg = `«${f.name}» no es un formato permitido.`; break; }
      if (f.size > FILES.maxFileMB * 1024 * 1024) { msg = `«${f.name}» pesa más de ${FILES.maxFileMB} MB.`; break; }
    }
    const total = files.reduce((s, f) => s + f.size, 0);
    if (!msg && total > FILES.maxTotalMB * 1024 * 1024) msg = `Entre todos los archivos no pueden pasar de ${FILES.maxTotalMB} MB.`;
    setFileError(msg);
    return !msg;
  }

  function validStep(i: number) {
    const fs = stepRefs.current[i];
    if (!fs) return true;
    if (i === 0 && !design) { (fs.querySelector("select") as HTMLSelectElement | null)?.focus(); return false; }
    if (i === 5 && !checkFiles((fs.querySelector("input[type=file]") as HTMLInputElement | null)?.files ?? null)) return false;
    const fields = [...fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")];
    const bad = fields.find((f) => !f.checkValidity());
    if (bad) { bad.reportValidity(); return false; }
    return true;
  }

  function go(to: number) {
    if (to > step && !validStep(step)) return;
    setStep(to);
    requestAnimationFrame(() => {
      document.getElementById("solicitud")?.scrollIntoView({ behavior: "smooth", block: "start" });
      stepRefs.current[to]?.querySelector<HTMLElement>("legend")?.focus();
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (let i = 0; i < STEPS.length; i++) if (!validStep(i)) { setStep(i); return; }
    setStatus("enviando"); setError("");
    try {
      const res = await fetch(REQUEST_API, { method: "POST", body: new FormData(e.currentTarget), headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "No pudimos registrar la solicitud.");
      clearSelection();
      setSent({ numero: json.numero });
      setStatus("");
      requestAnimationFrame(() => document.getElementById("solicitud")?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      setWaHref(waFallback());
      setStatus("error");
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "No pudimos conectar con el servidor.");
    }
  }

  function waFallback() {
    const f = formRef.current;
    if (!f) return WHATSAPP_URL;
    const g = (n: string) => String(new FormData(f).get(n) || "").trim();
    const text = [
      "Hola SIBNOVA, quiero solicitar una página web.",
      design && `Diseño: ${design.n} ${design.name}`,
      `Paquete: ${pkg.name} (desde ${formatBs(pkg.price)})`,
      `Nombre: ${g("nombre")}`, g("empresa") && `Empresa: ${g("empresa")}`, `Contacto: ${g("telefono")} · ${g("correo")}`,
      `Ciudad: ${g("ciudad")}, ${g("pais")}`, g("descripcion") && `Negocio: ${g("descripcion")}`,
    ].filter(Boolean).join("\n");
    return `${WHATSAPP_URL}?text=${encodeURIComponent(text.slice(0, 1800))}`;
  }

  if (sent) {
    return (
      <div className={styles.done} role="status">
        <IconCheck width={40} height={40} aria-hidden="true" />
        <h2>Recibimos tu solicitud</h2>
        <p>Tu número de solicitud es <b>{sent.numero}</b>. Te escribiremos por WhatsApp o correo para revisar tu proyecto y enviarte la cotización.</p>
        <div className={styles.doneActs}>
          <a className="btn btn-primary" href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hola SIBNOVA, envié la solicitud ${sent.numero}.`)}`} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Avisar por WhatsApp</a>
          <Link className="btn btn-ghost" href="/catalogo/">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate encType="multipart/form-data" aria-describedby="paso-actual">
      <div className={styles.progress}>
        <p id="paso-actual">Paso {step + 1} de {STEPS.length}: <b>{STEPS[step]}</b></p>
        <div className={styles.bar} role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Avance de la solicitud"><i style={{ width: `${pct}%` }} /></div>
        <ol className={styles.dots}>
          {STEPS.map((s, i) => (
            <li key={s}>
              <button type="button" onClick={() => (i < step ? go(i) : undefined)} disabled={i > step} aria-current={i === step ? "step" : undefined} aria-label={`Paso ${i + 1}: ${s}`}>
                {i < step ? <IconCheck width={14} height={14} /> : i + 1}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.hp} aria-hidden="true"><label>No completar <input name="sitio_web" tabIndex={-1} autoComplete="off" /></label></div>
      <input type="hidden" name="t0" value={t0} />
      <input type="hidden" name="diseno" value={slug} />

      {/* 1. Diseño y paquete */}
      <fieldset ref={(el) => { stepRefs.current[0] = el; }} hidden={step !== 0} className={styles.step}>
        <legend tabIndex={-1}>Diseño y paquete</legend>
        <div className={styles.summary}>
          {design ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shotSrc(design)} alt={`Vista del diseño ${design.n} ${design.name}`} width={800} height={500} />
              <div>
                <span className={styles.tag}>Modelo seleccionado</span>
                <b className={styles.sumName}>{design.n} · {design.name}</b>
                <p>{design.short}</p>
                <Link href={designHref(design)} className={styles.link}>Ver la demostración <ArrowRight /></Link>
              </div>
            </>
          ) : (
            <p className={styles.noSel}>Todavía no elegiste un diseño. Elige uno aquí o <Link href="/catalogo/#disenos" className={styles.link}>míralos en el catálogo</Link>.</p>
          )}
        </div>
        <label className={styles.field}>
          Diseño
          <select value={slug} onChange={(e) => changeDesign(e.target.value)} required>
            <option value="">Elige un diseño</option>
            {DESIGNS.map((d) => <option key={d.slug} value={d.slug}>{d.n} · {d.name}</option>)}
          </select>
        </label>
        <div className={styles.field} role="radiogroup" aria-label="Paquete">
          <span>Paquete</span>
          <div className={styles.plans}>
            {WEB_PLANS.map((p) => (
              <label key={p.slug} className={styles.plan}>
                <input type="radio" name="paquete" value={p.slug} checked={plan === p.slug} onChange={() => setPlan(p.slug)} required />
                <span><b>{p.name}</b><small>{p.kind}</small><em>Desde {formatBs(p.price)}</em></span>
              </label>
            ))}
          </div>
        </div>
        <p className={styles.priceNote}>
          <b>Precio inicial: {formatBs(pkg.price)}.</b> El estilo visual no cambia el precio. El presupuesto final depende de las funciones, el contenido y el alcance, y te lo enviamos en una proforma.
        </p>
      </fieldset>

      {/* 2. Tus datos */}
      <fieldset ref={(el) => { stepRefs.current[1] = el; }} hidden={step !== 1} className={styles.step}>
        <legend tabIndex={-1}>Tus datos</legend>
        <div className={styles.grid}>
          <label className={styles.field}>Nombre completo<input name="nombre" autoComplete="name" required minLength={3} maxLength={120} /></label>
          <label className={styles.field}>Nombre de la empresa <small>(opcional)</small><input name="empresa" autoComplete="organization" maxLength={120} /></label>
          <label className={styles.field}>NIT <small>(si corresponde)</small><input name="nit" inputMode="numeric" pattern="[0-9]{5,15}" maxLength={15} /></label>
          <label className={styles.field}>Cargo <small>(opcional)</small><input name="cargo" autoComplete="organization-title" maxLength={80} /></label>
          <label className={styles.field}>Correo electrónico<input name="correo" type="email" autoComplete="email" required maxLength={120} /></label>
          <label className={styles.field}>Teléfono y WhatsApp<input name="telefono" type="tel" autoComplete="tel" required pattern="[+0-9 ()-]{7,20}" placeholder="+591 …" maxLength={20} /></label>
          <label className={styles.field}>Ciudad<input name="ciudad" autoComplete="address-level2" required maxLength={60} /></label>
          <label className={styles.field}>País<input name="pais" autoComplete="country-name" required defaultValue="Bolivia" maxLength={60} /></label>
        </div>
      </fieldset>

      {/* 3. Tu negocio */}
      <fieldset ref={(el) => { stepRefs.current[2] = el; }} hidden={step !== 2} className={styles.step}>
        <legend tabIndex={-1}>Tu negocio</legend>
        <div className={styles.grid}>
          <label className={styles.field}>Nombre comercial <small>(opcional)</small><input name="nombre_comercial" maxLength={120} /></label>
          <label className={styles.field}>Rubro
            <select name="rubro" required defaultValue="">
              <option value="" disabled>Elige tu rubro</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              <option>Otro</option>
            </select>
          </label>
        </div>
        <label className={styles.field}>Describe tu empresa<textarea name="descripcion" rows={3} required minLength={15} maxLength={1500} placeholder="¿Qué hace tu empresa y desde cuándo?" /></label>
        <label className={styles.field}>Servicios o productos <small>(opcional)</small><textarea name="servicios" rows={2} maxLength={1500} /></label>
        <label className={styles.field}>Público objetivo <small>(opcional)</small><input name="publico" maxLength={300} placeholder="¿A quién le vendes?" /></label>
        <label className={styles.field}>Objetivos de la página web<textarea name="objetivos" rows={2} required minLength={10} maxLength={1000} placeholder="Por ejemplo: recibir más consultas, vender en línea, mostrar mis proyectos" /></label>
      </fieldset>

      {/* 4. Diseño */}
      <fieldset ref={(el) => { stepRefs.current[3] = el; }} hidden={step !== 3} className={styles.step}>
        <legend tabIndex={-1}>Diseño</legend>
        <p className={styles.help}>Modelo seleccionado: <b>{design ? `${design.n} · ${design.name}` : "sin elegir"}</b></p>
        <label className={styles.field}>Colores preferidos <small>(opcional)</small><input name="colores" maxLength={200} placeholder="Por ejemplo: los colores de mi logo, azul y blanco" /></label>
        <div className={styles.grid}>
          <label className={styles.field}>¿Tienes logo?
            <select name="logo" required defaultValue=""><option value="" disabled>Elige</option><option value="si">Sí</option><option value="no">No</option><option value="en_proceso">Lo estoy haciendo</option></select>
          </label>
          <label className={styles.field}>¿Tienes manual de marca?
            <select name="manual" required defaultValue=""><option value="" disabled>Elige</option><option value="si">Sí</option><option value="no">No</option></select>
          </label>
        </div>
        <label className={styles.field}>Páginas web de referencia <small>(opcional)</small><textarea name="referencias" rows={2} maxLength={800} placeholder="Pega los enlaces de páginas que te gustan" /></label>
        <label className={styles.field}>¿Qué quieres conservar o cambiar del diseño? <small>(opcional)</small><textarea name="cambios" rows={2} maxLength={1000} /></label>
      </fieldset>

      {/* 5. Funciones */}
      <fieldset ref={(el) => { stepRefs.current[4] = el; }} hidden={step !== 4} className={styles.step}>
        <legend tabIndex={-1}>Funciones</legend>
        <div className={styles.grid}>
          <label className={styles.field}>¿Tienes dominio propio?
            <select name="dominio" required defaultValue=""><option value="" disabled>Elige</option><option value="si">Sí</option><option value="no">No</option><option value="no_se">No sé</option></select>
          </label>
          <label className={styles.field}>¿Tienes hosting propio?
            <select name="hosting" required defaultValue=""><option value="" disabled>Elige</option><option value="si">Sí</option><option value="no">No</option><option value="no_se">No sé</option></select>
          </label>
        </div>
        <div className={styles.field}>
          <span>¿Qué necesita tu web? <small>(marca las que apliquen)</small></span>
          <div className={styles.checks}>
            {FEATURES.map((f) => <label key={f.id}><input type="checkbox" name="funciones[]" value={f.id} /><span>{f.label}</span></label>)}
          </div>
        </div>
        <label className={styles.field}>Funcionalidades adicionales <small>(opcional)</small><textarea name="adicionales" rows={2} maxLength={1000} /></label>
        <p className={styles.help}>Las funciones adicionales se cotizan aparte y quedan detalladas en la proforma.</p>
      </fieldset>

      {/* 6. Materiales */}
      <fieldset ref={(el) => { stepRefs.current[5] = el; }} hidden={step !== 5} className={styles.step}>
        <legend tabIndex={-1}>Materiales</legend>
        <p className={styles.help}>Sube tu logo, fotos, videos, documentos comerciales, catálogo o textos. Hasta {FILES.maxFiles} archivos, {FILES.maxFileMB} MB cada uno y {FILES.maxTotalMB} MB en total. Formatos: {FILES.ext.join(", ")}.</p>
        <label className={styles.field}>Archivos <small>(opcional)</small>
          <input type="file" name="archivos[]" multiple accept={FILES.ext.map((e) => `.${e}`).join(",")} onChange={(e) => checkFiles(e.target.files)} aria-describedby="error-archivos" />
        </label>
        {fileError && <p id="error-archivos" className={styles.err} role="alert">{fileError}</p>}
        <p className={styles.help}>Si tus videos o fotos pesan más, envíanos un enlace de Google Drive en el último paso.</p>
        <p className={styles.warn}>Nunca te pediremos contraseñas de tu correo, tu banco o tu hosting. No las escribas en este formulario.</p>
      </fieldset>

      {/* 7. Plazos y envío */}
      <fieldset ref={(el) => { stepRefs.current[6] = el; }} hidden={step !== 6} className={styles.step}>
        <legend tabIndex={-1}>Plazos y envío</legend>
        <div className={styles.grid}>
          <label className={styles.field}>Fecha deseada de entrega <small>(opcional)</small><input type="date" name="fecha_entrega" /></label>
          <label className={styles.field}>Presupuesto aproximado
            <select name="presupuesto" required defaultValue=""><option value="" disabled>Elige</option>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select>
          </label>
          <label className={styles.field}>¿Quién aprueba el proyecto? <small>(opcional)</small><input name="aprobador" maxLength={120} placeholder="Nombre y cargo" /></label>
        </div>
        <label className={styles.field}>Observaciones <small>(opcional)</small><textarea name="observaciones" rows={3} maxLength={1500} /></label>
        <label className={styles.consent}>
          <input type="checkbox" name="acepto" value="si" required />
          <span>Acepto que SIBNOVA use estos datos para responder mi solicitud, según la <a href="/privacidad/" target="_blank">Política de privacidad</a>.</span>
        </label>
        <div className={styles.recap}>
          <b>Resumen</b>
          <span>Diseño: {design ? `${design.n} · ${design.name}` : "sin elegir"}</span>
          <span>Paquete: {pkg.name} · desde {formatBs(pkg.price)}</span>
        </div>
      </fieldset>

      <div className={styles.nav}>
        {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>Atrás</button>}
        {step < STEPS.length - 1
          ? <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>Continuar <ArrowRight /></button>
          : <button type="submit" className="btn btn-primary" disabled={status === "enviando"}>{status === "enviando" ? "Enviando…" : "Enviar solicitud"}</button>}
      </div>

      {status === "error" && (
        <div className={styles.fail} role="alert">
          <p><b>{error}</b> Puedes intentarlo de nuevo o enviarnos tu solicitud por WhatsApp al {SITE.phoneDisplay} (sin los archivos).</p>
          <a className="btn btn-ghost" href={waHref} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Enviar por WhatsApp</a>
        </div>
      )}
    </form>
  );
}
