"use client";

import { useTilt } from "@/components/ui/useTilt";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import Split from "@/components/ui/Split";
import styles from "./projects.module.css";

function BusinessAIVisual() {
  const outputs = ["CRM actualizado", "Tarea asignada", "Reporte generado"];
  return (
    <div className={styles.flow} aria-hidden="true">
      <div className={`${styles.fcard} ${styles.fin}`}>
        <span className={styles.fwa}><IconWhatsApp width={16} height={16} /></span>
        <div>
          <small>Mensaje entrante</small>
          <b>“Necesito cotizar 40 unidades”</b>
        </div>
      </div>
      <svg className={styles.fwires} viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M50 0 V22" />
        <path d="M50 38 C50 48 16 46 16 60" />
        <path d="M50 38 V60" />
        <path d="M50 38 C50 48 84 46 84 60" />
      </svg>
      <div className={styles.agent}>
        <span className={styles.agentDot} />
        Agente IA <em>analiza y decide</em>
      </div>
      <div className={styles.fouts}>
        {outputs.map((o, i) => (
          <div key={o} className={styles.fout} style={{ animationDelay: `${1.2 + i * 0.35}s` }}>
            <IconCheck width={14} height={14} /> {o}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  useTilt(`.${styles.tilt}`, 4);

  return (
    <section id="proyectos" className="section" aria-label="Proyectos">
      <div className="wrap">
        <div className={styles.head}>
          <Split as="h2" text="Productos y *soluciones.*" className="display h2" />
          <p className="lead" data-reveal>Construimos productos propios y soluciones para empresas. Esto es parte de lo que hacemos.</p>
        </div>

        {/* Te Resuelvo — producto propio */}
        <article className={`spot ${styles.tilt} ${styles.feature}`} data-reveal>
          <div className={styles.featCopy}>
            <div className={styles.brand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/te-resuelvo-icono.png" alt="" width={256} height={256} loading="lazy" />
              <div>
                <h3>Te Resuelvo</h3>
                <span className={styles.tags}>Producto propio · Aplicación móvil · Marketplace</span>
              </div>
            </div>
            <p className={styles.featText}>
              Plataforma digital que conecta personas que necesitan soluciones con trabajadores y proveedores de servicios.
            </p>
            <ul className={styles.points}>
              <li>Solicitudes por categoría de servicio</li>
              <li>Ubicación del usuario al crear una solicitud</li>
              <li>Seguimiento de la solicitud activa</li>
            </ul>
            <a href="#contacto" className="btn btn-ghost">
              Quiero un producto así <ArrowRight />
            </a>
          </div>

          <div className={styles.featVisual}>
            <div className={styles.trGlow} aria-hidden="true" />
            <div className={styles.phone} data-parallax="0.08">
              <div className={styles.screen}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/te-resuelvo-app.jpg"
                  alt="Pantalla de inicio de la aplicación Te Resuelvo: buscador de servicios, categorías y botón para publicar una solicitud"
                  width={612}
                  height={1288}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Business AI — línea de soluciones */}
        <article className={`spot ${styles.tilt} ${styles.second}`} data-reveal>
          <div className={styles.featCopy}>
            <h3 className={styles.secondTitle}>Business AI</h3>
            <span className={styles.tags}>Línea de soluciones · Inteligencia artificial · Automatización</span>
            <p className={styles.featText}>Sistemas inteligentes para automatizar procesos empresariales.</p>
            <a href="#contacto" className="btn btn-ghost">
              Automatizar mi empresa <ArrowRight />
            </a>
          </div>
          <div className={styles.secondVisual}>
            <BusinessAIVisual />
          </div>
        </article>
      </div>
    </section>
  );
}
