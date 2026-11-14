import Link from "next/link";
import { formatBs } from "@/lib/catalog";
import { BENEFICIOS, COMBOS, CONDICIONES, INICIO, PASOS, PRECIO, PROMO, REDES_PDF, SUELTOS, waLink } from "@/lib/redes";
import { ArrowRight, IconCheck } from "@/components/ui/icons";
import styles from "@/components/catalog/catalog.module.css";
import service from "@/components/service/service.module.css";
import r from "./redes.module.css";

export default function RedesCatalog() {
  return (
    <>
      {/* ---------- Cabecera ---------- */}
      <section className={styles.hero} aria-labelledby="redes-titulo">
        <div className={styles.glow} aria-hidden="true" />
        <div className="wrap">
          <div className={styles.heroInner}>
            <nav aria-label="Ruta" className={service.crumbs} data-reveal>
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Redes sociales</span>
            </nav>
            <span className="num" data-reveal>Catálogo de redes sociales</span>
            <h1 id="redes-titulo" className={`display ${styles.title}`} data-reveal>Nos encargamos de tus redes para que tú te encargues de tu negocio</h1>
            <p className="lead" data-reveal>Grabamos videos en tu negocio, diseñamos tus publicaciones, publicamos en Facebook, Instagram y TikTok, y respondemos a tus clientes. Contrata cada servicio por separado o en un combo que te sale más barato.</p>
            <p className={r.promoPill} data-reveal><b>{PROMO.pct} % de descuento</b> en los combos para quienes contraten hasta el {PROMO.hasta}</p>
            <div className={r.ctas} data-reveal>
              <a href="#combos" className="btn btn-primary btn-lg">Ver los combos <ArrowRight /></a>
              <a href={REDES_PDF} className="btn btn-ghost btn-lg" target="_blank" rel="noopener">Descargar en PDF</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Beneficios ---------- */}
      <section className="section" aria-labelledby="beneficios-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="beneficios-titulo" className="display h2">¿Qué gana tu negocio con <em className={styles.accent}>este servicio</em>?</h2>
            <p className="lead" data-reveal>Lo que pagas cada mes se convierte en clientes que te conocen, te escriben y confían en ti.</p>
          </div>
          <ol className={styles.benefits}>
            {BENEFICIOS.map((b, i) => (
              <li key={b.t} data-reveal><span>{String(i + 1).padStart(2, "0")}</span><b>{b.t}</b><p>{b.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Combos ---------- */}
      <section id="combos" className={styles.plansSection} aria-labelledby="combos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="combos-titulo" className="display h2">Elige tu <em className={styles.accent}>combo mensual</em></h2>
            <p className="lead" data-reveal>Todo lo que hacemos cada mes en tus redes, en un solo precio. Con {PROMO.pct} % menos durante los {PROMO.meses} primeros meses.</p>
          </div>
          <ul className={r.combos}>
            {COMBOS.map((c) => (
              <li key={c.slug} id={c.slug} className={`${styles.plan} ${c.featured ? styles.featured : ""}`} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>Cada mes{c.featured && <em>El más elegido</em>}</span>
                  <h3 className={styles.planName}>{c.name}</h3>
                  <p className={styles.kind}>{c.pitch}</p>
                </div>
                <p className={styles.price}>
                  <span className={r.antes}>Precio normal {formatBs(c.normal)}</span>
                  <b>{formatBs(c.precio)} <span className={r.mes}>/mes</span></b>
                  <span className={r.ahorro}>Ahorras {formatBs(c.normal - c.precio)} cada mes los {PROMO.meses} primeros meses</span>
                </p>
                <span className={r.label}>Cada mes hacemos</span>
                <ul className={styles.includes}>
                  {c.hacemos.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <div className={r.regalos}>
                  <span className={r.label}>De regalo</span>
                  <ul>{c.regalos.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
                <a href={waLink(`Hola SIBNOVA, me interesa el ${c.name} de redes sociales (${formatBs(c.precio)} al mes con la promoción). ¿Me cuentan cómo empezamos?`)} className={`btn ${c.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`} target="_blank" rel="noopener">Quiero este combo</a>
              </li>
            ))}
          </ul>

          <div className={r.inicio} data-reveal>
            <div>
              <h3>¿Todavía no tienes logo o redes?</h3>
              <p>Tu logo con foto de perfil, portada e ícono ({formatBs(PRECIO.logo)}), más la creación de tu Facebook, Instagram y TikTok con todo cargado ({formatBs(PRECIO.red)} cada una). Después eliges tu combo mensual para que manejemos tus redes.</p>
            </div>
            <div className={r.inicioPrecio}>
              <b>{formatBs(INICIO.precio)}</b>
              <span className={r.mes}>pago único</span>
              <a href={waLink(`Hola SIBNOVA, quiero el logo + la creación de Facebook, Instagram y TikTok (${formatBs(INICIO.precio)}).`)} className="btn btn-ghost" target="_blank" rel="noopener">Lo quiero</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Precios por separado ---------- */}
      <section id="precios" className="section" aria-labelledby="precios-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="precios-titulo" className="display h2">Cada servicio <em className={styles.accent}>por separado</em></h2>
            <p className="lead" data-reveal>Compra solo lo que necesitas o suma extras a tu combo cuando quieras.</p>
          </div>
          <ul className={r.lista} data-reveal>
            {SUELTOS.flatMap((g) => [
              <li key={g.grupo} className={r.grupo}>{g.grupo}</li>,
              ...g.items.map((it) => (
                <li key={it.t} className={r.item}>
                  <b>{it.t}</b>
                  <p>{it.d}</p>
                  <span className={r.itemPrecio}><strong>{it.precio === null ? "A cotizar" : formatBs(it.precio)}</strong><small>{it.unidad}</small></span>
                </li>
              )),
            ])}
          </ul>
        </div>
      </section>

      {/* ---------- Cómo trabajamos ---------- */}
      <section className="section" aria-labelledby="pasos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="pasos-titulo" className="display h2">¿Cómo <em className={styles.accent}>empezamos</em>?</h2>
            <p className="lead" data-reveal>Tú siempre ves y apruebas antes de que publiquemos.</p>
          </div>
          <ol className={r.pasos}>
            {PASOS.map((p) => <li key={p.t} data-reveal><b>{p.t}</b><p>{p.d}</p></li>)}
          </ol>
        </div>
      </section>

      {/* ---------- Condiciones ---------- */}
      <section className={styles.termsSection} aria-labelledby="condiciones-titulo">
        <div className="wrap">
          <h2 id="condiciones-titulo" className={styles.subTitle}>Condiciones</h2>
          <ul className={r.condiciones}>{CONDICIONES.map((c) => <li key={c}>{c}</li>)}</ul>
          <div className={r.pdf}>
            <p>¿Prefieres guardarlo o compartirlo? Descarga este catálogo en PDF.</p>
            <a href={REDES_PDF} className="btn btn-ghost" target="_blank" rel="noopener">Descargar en PDF</a>
          </div>
        </div>
      </section>
    </>
  );
}
