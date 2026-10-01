"use client";

import { useState, type FormEvent } from "react";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowUpRight, IconMail, IconPin, IconWhatsApp } from "@/components/ui/icons";
import Split from "@/components/ui/Split";
import styles from "./contact.module.css";

const TOPICS = ["Aplicación", "Inteligencia artificial", "Automatización", "Desarrollo web", "Otro"];

type Errors = Partial<Record<"nombre" | "contacto" | "mensaje", string>>;

export default function Contact({ defaultTopic = "Aplicación" }: { defaultTopic?: string }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("empresa_web")) return; // trampa anti-spam
    const nombre = String(data.get("nombre") || "").trim();
    const contacto = String(data.get("contacto") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();

    const next: Errors = {};
    if (nombre.length < 2) next.nombre = "Escribe tu nombre.";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contacto);
    const isPhone = /^\+?[\d\s().-]{7,}$/.test(contacto) && contacto.replace(/\D/g, "").length >= 7;
    if (!isEmail && !isPhone) next.contacto = "Escribe un WhatsApp o un correo válido.";
    if (mensaje.length < 10) next.mensaje = "Cuéntanos un poco más (al menos 10 caracteres).";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    const text = `Hola SIBNOVA, quiero hablar sobre un proyecto.\n\nNombre: ${nombre}\nContacto: ${contacto}\nTema: ${topic}\n\n${mensaje}`.slice(0, 1800);
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setStatus(`Abrimos WhatsApp con tu mensaje listo. Solo presiona enviar allí. Si no se abrió, escríbenos al ${SITE.phoneDisplay}.`);
  }

  return (
    <section id="contacto" className="section" aria-label="Contacto">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.copy}>
          <Split as="h2" text="Hablemos de tu *proyecto.*" className="display h2" />
          <p className="lead" data-reveal>Cuéntanos qué quieres construir o automatizar. Te respondemos personalmente.</p>
          <ul className={styles.channels} data-reveal>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener">
                <span className={styles.ci}><IconWhatsApp width={20} height={20} /></span>
                <span><small>WhatsApp</small>{SITE.phoneDisplay}</span>
                <ArrowUpRight className={styles.go} width={18} height={18} />
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>
                <span className={styles.ci}><IconMail width={20} height={20} /></span>
                <span><small>Correo</small>{SITE.email}</span>
                <ArrowUpRight className={styles.go} width={18} height={18} />
              </a>
            </li>
            <li>
              <div>
                <span className={styles.ci}><IconPin width={20} height={20} /></span>
                <span><small>Ubicación</small>{SITE.city}</span>
              </div>
            </li>
          </ul>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate data-reveal>
          <div className={styles.hp} aria-hidden="true">
            <label>No completar <input name="empresa_web" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <div className={styles.field}>
            <label htmlFor="c-nombre">Nombre</label>
            <input id="c-nombre" name="nombre" autoComplete="name" aria-invalid={!!errors.nombre} aria-describedby="e-nombre" />
            {errors.nombre && <span id="e-nombre" className={styles.err}>{errors.nombre}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="c-contacto">WhatsApp o correo</label>
            <input id="c-contacto" name="contacto" autoComplete="tel" inputMode="email" placeholder="+591 …" aria-invalid={!!errors.contacto} aria-describedby="e-contacto" />
            {errors.contacto && <span id="e-contacto" className={styles.err}>{errors.contacto}</span>}
          </div>

          <fieldset className={styles.field}>
            <legend>¿Qué necesitas?</legend>
            <div className={styles.chips}>
              {TOPICS.map((t) => (
                <label key={t} className={styles.chip}>
                  <input type="radio" name="tema" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor="c-mensaje">Cuéntanos tu idea</label>
            <textarea id="c-mensaje" name="mensaje" rows={5} maxLength={1200} placeholder="¿Qué quieres construir, automatizar o mejorar?" aria-invalid={!!errors.mensaje} aria-describedby="e-mensaje" />
            {errors.mensaje && <span id="e-mensaje" className={styles.err}>{errors.mensaje}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            <IconWhatsApp width={18} height={18} /> Continuar en WhatsApp
          </button>
          <p className={styles.note}>Se abrirá WhatsApp con tu mensaje ya redactado para que lo envíes.</p>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
        </form>
      </div>
    </section>
  );
}
