import Link from "next/link";
import { CATALOG_FAQ, COMPARE, PAYMENT, WEB_PLANS, formatBs, type WebPlan } from "@/lib/catalog";
import { chooseText, modelHref, modelsOf, pagesLabel, PLANS } from "@/lib/models";
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
          <p className="lead" data-reveal>Cuatro paquetes con precio de partida claro y modelos listos para elegir. Tú eliges el que más te gusta y lo adaptamos a tu marca.</p>
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
                <a href={`#modelos-${p.slug}`} className={styles.seeModels}>Ver 4 modelos <ArrowRight /></a>
                <a href={planLink(p)} target="_blank" rel="noopener" className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`}>
                  <IconWhatsApp width={18} height={18} /> Quiero este paquete
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Precios de partida en bolivianos. El monto exacto queda escrito en tu proforma.</p>
        </div>
      </section>

      {/* ---------- Modelos para elegir ---------- */}
      <section id="modelos" className="section" aria-labelledby="modelos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="modelos-titulo" className="display h2">Elige tu <em className={styles.accent}>modelo</em></h2>
            <p className="lead" data-reveal>Abre cada modelo, navega sus páginas y dinos cuál prefieres. Los negocios y datos son de ejemplo.</p>
          </div>
          {PLANS.map((plan) => (
            <div key={plan.id} id={`modelos-${plan.id}`} className={styles.modelGroup}>
              <h3 className={styles.modelPlan}>{plan.label}</h3>
              <ul className={styles.models}>
                {modelsOf(plan.id).map((m) => (
                  <li key={m.slug} className={styles.model} data-reveal>
                    <Link href={modelHref(m)} className={styles.thumb}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/modelos/capturas/${m.slug}.webp`} alt={`Vista del modelo ${m.code}: ${m.plan.label}, ${m.rubro.label.toLowerCase()}`} width={640} height={400} loading="lazy" />
                    </Link>
                    <p className={styles.modelMeta}><b>{m.code}</b>{m.rubro.label}<small>{pagesLabel(m)}</small></p>
                    <div className={styles.modelActs}>
                      <Link href={modelHref(m)} className="btn btn-ghost">Ver modelo</Link>
                      <a href={waLink(chooseText(m))} target="_blank" rel="noopener" className="btn btn-primary" aria-label={`Elegir el modelo ${m.code}`}>Elegir</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
