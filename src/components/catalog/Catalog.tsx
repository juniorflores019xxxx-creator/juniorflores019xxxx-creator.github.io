import Link from "next/link";
import { CATALOG_FAQ, COMPARE, CONCEPTS, PAYMENT, WEB_PLANS, WORKS, formatBs, type WebPlan } from "@/lib/catalog";
import DesignCatalog from "@/components/designs/DesignCatalog";
import { WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import Split from "@/components/ui/Split";
import styles from "./catalog.module.css";
import service from "@/components/service/service.module.css";

const waLink = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
const planLink = (p: WebPlan) => waLink(`Hola SIBNOVA, me interesa el paquete ${p.name} (${p.kind.toLowerCase()}) del catálogo de páginas web.`);

export default function Catalog() {
  return (
    <>
      {/* ---------- Cabecera ---------- */}
      <section className={styles.hero} aria-labelledby="catalogo-titulo">
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wrap ${styles.heroInner}`}>
          <nav aria-label="Ruta" className={service.crumbs} data-reveal>
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/servicios/desarrollo-web/">Desarrollo web</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Catálogo</span>
          </nav>
          <span className="num" data-reveal>Catálogo de páginas web</span>
          <h1 id="catalogo-titulo" className={`display ${styles.title}`} data-reveal>Elige la web que tu negocio necesita</h1>
          <p className="lead" data-reveal>Cuatro paquetes con precio de partida claro y 20 diseños para elegir. Tú eliges el estilo que más te gusta y lo adaptamos a tu marca.</p>
        </div>
      </section>

      {/* ---------- Paquetes ---------- */}
      <section id="paquetes" className={styles.plansSection} aria-label="Paquetes">
        <div className="wrap">
          <ul className={styles.plans}>
            {WEB_PLANS.map((p) => (
              <li key={p.slug} id={p.slug} className={`${styles.plan} ${p.featured ? styles.featured : ""}`} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>{p.n}{p.featured && <em>Recomendado</em>}</span>
                  <h2 className={styles.planName}>{p.name}</h2>
                  <p className={styles.kind}>{p.kind}</p>
                </div>
                <p className={styles.price}><small>Desde</small><b>{formatBs(p.price)}</b></p>
                <p className={styles.weeks}>Plazo estimado: {p.weeks}</p>
                <p className={styles.pitch}>{p.pitch}</p>
                <ul className={styles.includes}>
                  {p.includes.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <p className={styles.ideal}><b>Ideal para:</b> {p.idealFor}</p>
                <a href="#disenos" className={styles.seeModels}>Ver los 20 diseños <ArrowRight /></a>
                <a href={planLink(p)} target="_blank" rel="noopener" className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`}>
                  <IconWhatsApp width={18} height={18} /> Quiero este paquete
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Precios iniciales en bolivianos. El presupuesto final depende de las funciones, el contenido y el alcance de tu proyecto, y queda escrito en tu proforma.</p>
        </div>
      </section>

      {/* ---------- Trabajos reales ---------- */}
      <section id="trabajos" className="section" aria-labelledby="trabajos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="trabajos-titulo" className="display h2">Webs que ya <em className={styles.accent}>hicimos</em></h2>
            <p className="lead" data-reveal>Sitios reales diseñados y desarrollados por SIBNOVA.</p>
          </div>
          <ul className={styles.works}>
            {WORKS.map((w) => (
              <li key={w.name} className={styles.work} data-reveal>
                <div className={styles.workShots}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/trabajos/${w.shot}-pc.webp`} alt={`Web de ${w.name} en computadora`} width={1200} height={750} loading="lazy" className={styles.workPc} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/trabajos/${w.shot}-movil.webp`} alt={`Web de ${w.name} en celular`} width={390} height={844} loading="lazy" className={styles.workPhone} />
                </div>
                <div className={styles.workBody}>
                  <span className={styles.workKind}>{w.kind}</span>
                  <h3>{w.name}</h3>
                  <p>{w.text}</p>
                  <ul className={service.checks}>
                    {w.points.map((p) => <li key={p}><IconCheck width={18} height={18} />{p}</li>)}
                  </ul>
                  {w.href
                    ? <a href={w.href} target="_blank" rel="noopener" className={styles.helpLink}>Ver la web <ArrowRight /></a>
                    : <span className={styles.workStatus}>{w.status}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Catálogo de diseños ---------- */}
      <section id="disenos" className="section" aria-labelledby="disenos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="disenos-titulo" className="display h2">Encuentra el diseño web ideal para tu <em className={styles.accent}>negocio</em></h2>
            <p className="lead" data-reveal>Explora nuestros modelos de diseño web, visualiza demostraciones y selecciona el estilo que mejor representa tu empresa.</p>
          </div>
          <DesignCatalog />
          <ul className={styles.concepts} aria-label="Qué eliges en cada paso">
            {CONCEPTS.map((c, i) => <li key={c.t}><span>{String(i + 1).padStart(2, "0")}</span><b>{c.t}</b><p>{c.d}</p></li>)}
          </ul>
        </div>
      </section>

      {/* ---------- Comparación ---------- */}
      <section className="section" aria-labelledby="comparar-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="comparar-titulo" className="display h2">Compara los <em className={styles.accent}>paquetes</em></h2>
            <p className="lead" data-reveal>Lo principal de cada opción, de un vistazo.</p>
          </div>
          <div className={styles.tableWrap} data-reveal tabIndex={0} role="region" aria-labelledby="comparar-titulo">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Característica</span></th>
                  {WEB_PLANS.map((p) => <th key={p.slug} scope="col">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={WEB_PLANS[i].slug}>
                        {v === true && <><IconCheck width={18} height={18} className={styles.yes} /><span className="sr-only">Incluido</span></>}
                        {v === false && <><span className={styles.no} aria-hidden="true">—</span><span className="sr-only">No incluido</span></>}
                        {typeof v === "string" && v}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Soporte mensual opcional</th>
                  {WEB_PLANS.map((p) => <td key={p.slug}>{formatBs(p.support)}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- Condiciones ---------- */}
      <section className={styles.termsSection} aria-label="Condiciones">
        <div className={`wrap ${service.three}`}>
          <div className={service.panel} data-reveal>
            <h2 className={service.panelTitle}>Forma de pago</h2>
            <ul className={styles.payment}>
              {PAYMENT.map((p) => <li key={p.when}><b>{p.pct}</b>{p.when}</li>)}
            </ul>
          </div>
          <div className={service.panel} data-reveal>
            <h2 className={service.panelTitle}>Va aparte</h2>
            <ul className={service.checks}>
              <li><IconCheck width={18} height={18} />Dominio y hosting</li>
              <li><IconCheck width={18} height={18} />Comisiones del proveedor de pagos</li>
              <li><IconCheck width={18} height={18} />Servicios externos y licencias</li>
            </ul>
          </div>
          <div className={service.panel} data-reveal>
            <h2 className={service.panelTitle}>¿No sabes cuál elegir?</h2>
            <p className={styles.help}>Responde el diagnóstico gratuito y te orientamos según tu negocio.</p>
            <a href="/diagnostico/" className={styles.helpLink}>Hacer el diagnóstico <ArrowRight /></a>
          </div>
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section className="section" aria-labelledby="faq-titulo">
        <div className={`wrap ${service.faqGrid}`}>
          <div className={service.faqHead}>
            <Split as="h2" text="Preguntas *frecuentes*" className="display h2" />
            <p className="lead" data-reveal>¿Tienes otra duda? Escríbenos por WhatsApp y te respondemos.</p>
            <span id="faq-titulo" className="sr-only">Preguntas frecuentes</span>
          </div>
          <div className={service.faq}>
            {CATALOG_FAQ.map((f, i) => (
              <details key={f.q} className={service.qa} data-reveal open={i === 0}>
                <summary>{f.q}<span className={service.plus} aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
