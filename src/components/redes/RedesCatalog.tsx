import Link from "next/link";
import { formatBs } from "@/lib/catalog";
import { BENEFICIOS, COMBOS, COMBOS_MK, CONDICIONES, DISENO, INICIO, MAS_CLIENTES, PASOS, PROMO, REDES_PDF, SUELTOS, waLink } from "@/lib/redes";
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
              <span aria-current="page">Marketing digital y community manager</span>
            </nav>
            <span className="num" data-reveal>Marketing digital y community manager</span>
            <h1 id="redes-titulo" className={`display ${styles.title}`} data-reveal>Contenido, redes y publicidad para tu negocio</h1>
            <p className="lead" data-reveal>Elige en 3 pasos: cuánto contenido necesitas cada mes, quién lo publica (tú o nosotros) y si quieres publicidad para llegar a más clientes.</p>
            <p className={r.promoPill} data-reveal><b>{PROMO.pct} % de descuento</b> en los planes para quienes contraten hasta el {PROMO.hasta}</p>
            <div className={r.ctas} data-reveal>
              <a href="#planes" className="btn btn-primary btn-lg">Ver planes y precios <ArrowRight /></a>
              <a href="#diseno" className="btn btn-ghost btn-lg">Logo y creación de redes</a>
              <a href={REDES_PDF} className="btn btn-ghost btn-lg" target="_blank" rel="noopener">Descargar en PDF</a>
            </div>
            <dl className={r.defs} data-reveal>
              <div><dt>Marketing</dt><dd>Hacer que te conozcan y te compren. Incluye la estrategia, el contenido y la publicidad.</dd></div>
              <div><dt>Community manager</dt><dd>La persona que publica en tus redes todos los días y responde los comentarios y mensajes.</dd></div>
            </dl>
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

      {/* ---------- Pasos 1 y 2: plan de contenido + gestión ---------- */}
      <section id="planes" className={styles.plansSection} aria-labelledby="planes-titulo">
        <div className="wrap">
          <div className={service.head}>
            <div>
              <span className={r.paso}>Paso 1 y paso 2</span>
              <h2 id="planes-titulo" className="display h2">Elige tu <em className={styles.accent}>plan de contenido</em></h2>
            </div>
            <p className="lead" data-reveal>Nosotros hacemos los videos, los diseños y los textos de cada mes. Tú decides si lo publicas tú con nuestro calendario, o si lo publicamos y respondemos por ti.</p>
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
                  <span className={r.ahorro}>Tú publicas con nuestro calendario</span>
                </p>
                <span className={r.label}>Cada mes hacemos</span>
                <ul className={styles.includes}>
                  {c.hacemos.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <div className={r.regalos}>
                  <span className={r.label}>De regalo</span>
                  <ul>{c.regalos.map((g) => <li key={g}>{g}</li>)}</ul>
                </div>
                <div className={r.gestion}>
                  <span className={r.label}>Paso 2 · ¿Que lo publiquemos nosotros?</span>
                  <p>{c.gestion.detalle}.</p>
                  <p className={r.gestionPrecio}><b>+ {formatBs(c.gestion.precio)}</b> al mes · Todo junto: <b>{formatBs(c.precio + c.gestion.precio)}/mes</b></p>
                </div>
                <a href={waLink(`Hola SIBNOVA, me interesa el ${c.name} (${formatBs(c.precio)} al mes, o ${formatBs(c.precio + c.gestion.precio)} con la gestión de mis redes). ¿Me cuentan cómo empezamos?`)} className={`btn ${c.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`} target="_blank" rel="noopener">Quiero este plan</a>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Precios con {PROMO.pct} % de descuento durante los {PROMO.meses} primeros meses. Sin la promoción, la gestión cuesta {COMBOS.map((c) => `${formatBs(c.gestion.normal)} (${c.name.replace("Plan ", "")})`).join(", ")} al mes.</p>

          {/* Paso 3 */}
          <div id="mas-clientes" className={r.inicio} data-reveal>
            <div>
              <span className={r.paso}>Paso 3 · Opcional</span>
              <h3>¿Quieres más clientes nuevos? Publicidad pagada y Google Maps</h3>
              <ul className={r.mini}>{MAS_CLIENTES.hacemos.map((d) => <li key={d}>{d}</li>)}</ul>
              <p>Se suma a cualquier plan o se contrata solo. Lo que pagas a Facebook, TikTok o Google por los anuncios va aparte. El Plan Premium ya trae la publicidad: solo suma Google Maps.</p>
            </div>
            <div className={r.inicioPrecio}>
              <span className={r.antes}>{formatBs(MAS_CLIENTES.normal)}</span>
              <b>+ {formatBs(MAS_CLIENTES.precio)} <span className={r.mes}>/mes</span></b>
              <a href={waLink(`Hola SIBNOVA, me interesa la publicidad pagada y Google Maps (${formatBs(MAS_CLIENTES.precio)} al mes).`)} className="btn btn-ghost" target="_blank" rel="noopener">Lo quiero</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Diseño gráfico y creación de redes (pago único) ---------- */}
      <section id="diseno" className="section" aria-labelledby="diseno-titulo">
        <div className="wrap">
          <div className={service.head}>
            <div>
              <span className={r.paso}>Pago único · Aparte de los planes</span>
              <h2 id="diseno-titulo" className="display h2">Logo, diseño y <em className={styles.accent}>creación de redes</em></h2>
            </div>
            <p className="lead" data-reveal>Los planes usan tu logo actual. Si todavía no tienes logo o redes, o quieres renovarlos, empieza aquí. Se paga una sola vez.</p>
          </div>
          <ul className={r.diseno} data-reveal>
            {DISENO.map((it) => (
              <li key={it.t}>
                <b>{it.t}</b>
                <p>{it.d}</p>
                <span className={r.itemPrecio}><strong>{it.precio === null ? "A cotizar" : formatBs(it.precio)}</strong><small>{it.unidad}</small></span>
              </li>
            ))}
          </ul>
          <div className={r.inicio} data-reveal>
            <div>
              <h3>Para arrancar: logo + Facebook, Instagram y TikTok</h3>
              <p>Tu logo (eliges entre 3 propuestas) con foto de perfil, portada e ícono, más la creación de tus 3 redes con todo cargado. Después eliges tu plan de contenido.</p>
            </div>
            <div className={r.inicioPrecio}>
              <b>{formatBs(INICIO.precio)}</b>
              <span className={r.mes}>pago único</span>
              <a href={waLink(`Hola SIBNOVA, quiero el logo + la creación de Facebook, Instagram y TikTok (${formatBs(INICIO.precio)}).`)} className="btn btn-primary" target="_blank" rel="noopener">Lo quiero</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Proyectos de marketing (pago único) ---------- */}
      <section id="proyectos" className={styles.plansSection} aria-labelledby="proyectos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <div>
              <span className={r.paso}>Pago único</span>
              <h2 id="proyectos-titulo" className="display h2">Proyectos de <em className={styles.accent}>marketing</em></h2>
            </div>
            <p className="lead" data-reveal>Trabajos de una sola vez para ordenar tu marca o lanzar algo nuevo con fuerza.</p>
          </div>
          <ul className={`${r.combos} ${r.dos}`}>
            {COMBOS_MK.map((c) => (
              <li key={c.slug} id={c.slug} className={styles.plan} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>Pago único</span>
                  <h3 className={styles.planName}>{c.name}</h3>
                  <p className={styles.kind}>{c.pitch}</p>
                </div>
                <p className={styles.price}>
                  <span className={r.antes}>Por separado {formatBs(c.normal)}</span>
                  <b>{formatBs(c.precio)}</b>
                  <span className={r.ahorro}>Ahorras {formatBs(c.normal - c.precio)}</span>
                </p>
                <ul className={styles.includes}>
                  {c.hacemos.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                {c.nota && <p className={styles.excludes}>{c.nota}</p>}
                <a href={waLink(`Hola SIBNOVA, me interesa el ${c.name} (${formatBs(c.precio)}). ¿Me cuentan cómo empezamos?`)} className={`btn btn-ghost ${styles.planBtn}`} target="_blank" rel="noopener">Quiero este combo</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Precios por separado ---------- */}
      <section id="precios" className="section" aria-labelledby="precios-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="precios-titulo" className="display h2">Cada servicio <em className={styles.accent}>por separado</em></h2>
            <p className="lead" data-reveal>Compra solo lo que necesitas o suma extras a tu plan cuando quieras.</p>
          </div>
          <details className={r.detalles} data-reveal>
            <summary>Ver todos los precios por separado</summary>
            <ul className={r.lista}>
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
          </details>
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
