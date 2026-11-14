import Link from "next/link";
import {
  ADDONS, CATALOG_FAQ, COMPARE, CONCEPTS, FOUNDERS, PAYMENT, STORE_PLANS, WEB_PLANS, WHATSAPP_CATALOG, WORKS, formatBs, priceLabel,
} from "@/lib/catalog";
import { DESIGNS, REQUEST_URL, shotSrc } from "@/lib/designs";
import Gallery3D from "@/components/ui/Gallery3D";
import DesignCatalog from "@/components/designs/DesignCatalog";
import { ArrowRight, ArrowUpRight, IconCheck } from "@/components/ui/icons";
import Split from "@/components/ui/Split";
import { COMBOS, INICIO, PRECIO, PROMO, REDES_URL } from "@/lib/redes";
import styles from "./catalog.module.css";
import service from "@/components/service/service.module.css";

const requestFor = (paquete: string, extra = "") => `${REQUEST_URL}?paquete=${paquete}${extra}`;

export default function Catalog() {
  return (
    <>
      {/* ---------- Cabecera ---------- */}
      <section className={styles.hero} aria-labelledby="catalogo-titulo">
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wrap ${styles.heroGrid}`}>
        <div className={styles.heroInner}>
          <nav aria-label="Ruta" className={service.crumbs} data-reveal>
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/servicios/desarrollo-web/">Desarrollo web</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Catálogo</span>
          </nav>
          <span className="num" data-reveal>Catálogo de páginas web</span>
          <h1 id="catalogo-titulo" className={`display ${styles.title}`} data-reveal>Elige la web que tu negocio necesita</h1>
          <p className="lead" data-reveal>Paquetes con precio claro y 20 estilos que puedes ver funcionando antes de contratar. Tú eliges el diseño y nosotros lo adaptamos a tu marca.</p>
          <a href="#fundadores" className={styles.founderPill} data-reveal>
            <b>Clientes Fundadores</b> {FOUNDERS.slots} cupos hasta el {FOUNDERS.deadline} <ArrowRight />
          </a>
          <a href="#marketing" className={styles.founderPill} data-reveal>
            <b>Nuevo:</b> marketing digital y community manager <ArrowRight />
          </a>
        </div>
        <Gallery3D
          variant="stack"
          className={styles.heroVisual}
          images={["futurista", "glassmorphism", "premium-luxury"].map((slug) => {
            const d = DESIGNS.find((x) => x.slug === slug)!;
            return { src: shotSrc(d), alt: `Vista del diseño ${d.n} ${d.name}`, label: `${d.n} · ${d.name}` };
          })}
        />
        </div>
      </section>

      {/* ---------- Paquetes ---------- */}
      <section id="paquetes" className={styles.plansSection} aria-label="Paquetes">
        <div className="wrap">
          <ul className={styles.plans}>
            {WEB_PLANS.map((p) => (
              <li key={p.slug} id={p.slug} className={`${styles.plan} ${p.featured ? styles.featured : ""}`} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>{p.n}{p.featured && <em>Recomendado</em>}{p.quote && <em className={styles.quoteTag}>Cotización</em>}</span>
                  <h2 className={styles.planName}>{p.name}</h2>
                  <p className={styles.kind}>{p.kind}</p>
                </div>
                <p className={styles.price}>{p.from && <small>Desde</small>}<b>{formatBs(p.price)}</b></p>
                <p className={styles.weeks}>Plazo estimado: {p.weeks}</p>
                <p className={styles.pitch}>{p.pitch}</p>
                <ul className={styles.includes}>
                  {p.includes.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <p className={styles.excludes}>{p.excludes}</p>
                <p className={styles.ideal}><b>Ideal para:</b> {p.idealFor}</p>
                <Link href={requestFor(p.slug)} className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`}>
                  {p.quote ? "Pedir cotización" : "Quiero este paquete"}
                </Link>
              </li>
            ))}
            <li id={WHATSAPP_CATALOG.slug} className={`${styles.plan} ${styles.addon}`} data-reveal>
              <div className={styles.planHead}>
                <span className={styles.planNum}>+ Adicional de Empresa</span>
                <h2 className={styles.planName}>{WHATSAPP_CATALOG.name}</h2>
              </div>
              <p className={styles.price}><b>+ {formatBs(WHATSAPP_CATALOG.price)}</b></p>
              <p className={styles.pitch}>{WHATSAPP_CATALOG.pitch}</p>
              <ul className={styles.includes}>
                {WHATSAPP_CATALOG.includes.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
              </ul>
              <p className={styles.excludes}>{WHATSAPP_CATALOG.excludes}</p>
              <Link href={requestFor("empresa", "&catalogo=1")} className={`btn btn-ghost ${styles.planBtn}`}>Empresa + catálogo</Link>
            </li>
          </ul>
          <p className={styles.note}>Precios en bolivianos. El monto exacto, el alcance y el plazo quedan escritos en tu proforma. <a href="#disenos">Ver los 20 diseños</a></p>
        </div>
      </section>

      {/* ---------- Marketing digital y community manager ---------- */}
      <section id="marketing" className="section" aria-labelledby="marketing-titulo">
        <div className="wrap">
          <div className={service.head}>
            <div>
              <span className={styles.soon}>Nuevo · {PROMO.pct} % de descuento hasta el {PROMO.hasta}</span>
              <h2 id="marketing-titulo" className="display h2">Marketing digital y <em className={styles.accent}>community manager</em></h2>
            </div>
            <p className="lead" data-reveal>Manejamos tus redes sociales cada mes: videos grabados en tu negocio, publicaciones, respuesta a tus clientes e informe de resultados.</p>
          </div>
          <ul className={styles.stores}>
            {COMBOS.map((c) => (
              <li key={c.slug} className={`${styles.plan} ${c.featured ? styles.featured : ""}`} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>Cada mes{c.featured && <em>El más elegido</em>}</span>
                  <h3 className={styles.planName}>{c.name}</h3>
                  <p className={styles.kind}>{c.pitch}</p>
                </div>
                <p className={styles.price}><small>Precio normal {formatBs(c.normal)}</small><b>{formatBs(c.precio)} <small>/mes</small></b><small>con {PROMO.pct} % menos los {PROMO.meses} primeros meses</small></p>
                <ul className={styles.includes}>
                  {c.hacemos.slice(0, 4).map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <Link href={`${REDES_URL}#${c.slug}`} className={`btn ${c.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`}>Ver el detalle</Link>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Para empezar: logo con perfil, portada e ícono {formatBs(PRECIO.logo)} · creación de cada red {formatBs(PRECIO.red)} · logo + Facebook, Instagram y TikTok {formatBs(INICIO.precio)}. <Link href={REDES_URL}>Ver el catálogo completo de redes sociales</Link></p>
        </div>
      </section>

      {/* ---------- Tiendas online ---------- */}
      <section id="tiendas" className="section" aria-labelledby="tiendas-titulo">
        <div className="wrap">
          <div className={service.head}>
            <div>
              <span className={styles.soon}>Lanzamiento próximo · precios de referencia</span>
              <h2 id="tiendas-titulo" className="display h2">Tiendas <em className={styles.accent}>online</em></h2>
            </div>
            <p className="lead" data-reveal>Estamos preparando nuestras tiendas. Reserva la tuya: te enviamos una cotización con el plazo de entrega según tu catálogo.</p>
          </div>
          <ul className={styles.stores}>
            {STORE_PLANS.map((s) => (
              <li key={s.slug} id={s.slug} className={`${styles.plan} ${s.featured ? styles.featured : ""}`} data-reveal>
                <div className={styles.planHead}>
                  <span className={styles.planNum}>{s.products}{s.featured && <em>Recomendada</em>}</span>
                  <h3 className={styles.planName}>{s.name}</h3>
                </div>
                <p className={styles.price}>{s.from && <small>Desde</small>}<b>{formatBs(s.price)}</b>{s.from && <small>Cotización personalizada</small>}</p>
                <p className={styles.previewLabel}>Características previstas</p>
                <ul className={styles.includes}>
                  {s.includes.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
                </ul>
                <Link href={requestFor(s.slug)} className={`btn ${s.featured ? "btn-primary" : "btn-ghost"} ${styles.planBtn}`}>Reservar mi tienda</Link>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Los pagos en línea, la facturación automática y las integraciones no están incluidos en estos precios.</p>
        </div>
      </section>

      {/* ---------- Adicionales ---------- */}
      <section id="adicionales" className={styles.addonsSection} aria-labelledby="adicionales-titulo">
        <div className="wrap">
          <h2 id="adicionales-titulo" className={styles.subTitle}>Servicios adicionales</h2>
          <ul className={styles.addons}>
            {ADDONS.map((a) => <li key={a.t}><span>{a.t}</span><b>{formatBs(a.price)}{a.unit && <small> {a.unit}</small>}</b></li>)}
          </ul>
        </div>
      </section>

      {/* ---------- Clientes Fundadores ---------- */}
      <section id="fundadores" className="section" aria-labelledby="fundadores-titulo">
        <div className="wrap">
          <div className={styles.founders} data-reveal>
            <div className={styles.foundersHead}>
              <span className={styles.soon}>Hasta el {FOUNDERS.deadline} · máximo {FOUNDERS.slots} clientes</span>
              <h2 id="fundadores-titulo" className="display h2">Programa de Clientes Fundadores <em className={styles.accent}>SIBNOVA</em></h2>
              <p className="lead">Para los primeros {FOUNDERS.slots} clientes que contraten {FOUNDERS.appliesTo}. Mismo precio, más beneficios.</p>
            </div>
            <ol className={styles.benefits}>
              {FOUNDERS.benefits.map((b, i) => (
                <li key={b.t}><span>{String(i + 1).padStart(2, "0")}</span><b>{b.t}</b><p>{b.d}</p></li>
              ))}
            </ol>
            <p className={styles.small}>Los cupos se asignan por orden de pago del anticipo. El programa termina el {FOUNDERS.deadline} o al completarse los {FOUNDERS.slots} cupos, lo que ocurra primero. Los beneficios no se canjean por dinero.</p>
            <Link href={requestFor("empresa")} className="btn btn-primary btn-lg">Quiero ser cliente fundador <ArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ---------- Proyectos realizados ---------- */}
      <section id="trabajos" className="section" aria-labelledby="trabajos-titulo">
        <div className="wrap">
          <div className={service.head}>
            <h2 id="trabajos-titulo" className="display h2">Proyectos <em className={styles.accent}>realizados</em></h2>
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
                  <a href={w.href} target="_blank" rel="noopener" className={styles.helpLink}>Ver proyecto <ArrowUpRight /></a>
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
            <p className="lead" data-reveal>Abre cada demostración, mírala en computadora y en celular, y selecciona el estilo que mejor representa tu empresa.</p>
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
                  {WEB_PLANS.map((p) => <th key={p.slug} scope="col">{p.name}<small className={styles.thPrice}>{priceLabel(p)}</small></th>)}
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
            <p className={styles.help}>En Presencia: 50 % al iniciar y 50 % a la entrega.</p>
          </div>
          <div className={service.panel} data-reveal>
            <h2 className={service.panelTitle}>Va aparte y a tu nombre</h2>
            <ul className={service.checks}>
              <li><IconCheck width={18} height={18} />Dominio, hosting y correo: los pagas directo al proveedor</li>
              <li><IconCheck width={18} height={18} />Renovaciones y licencias</li>
              <li><IconCheck width={18} height={18} />Servicios externos de terceros</li>
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
