import Link from "next/link";
import { CATALOG_URL, formatBs } from "@/lib/catalog";
import { chooseText, modelHref, type Model } from "@/lib/models";
import { WHATSAPP_URL } from "@/lib/site";
import { IconCheck, IconWhatsApp } from "@/components/ui/icons";
import Art from "./Art";
import styles from "./model.module.css";

type P = { m: Model; page: string };

const Forms = ({ fields, cta }: { fields: string[]; cta: string }) => (
  <form className={styles.form} aria-label="Formulario de ejemplo">
    {fields.map((f) => <label key={f}>{f}<input name={f} placeholder="Ejemplo" readOnly /></label>)}
    <button type="button" className={styles.btn}>{cta}</button>
    <small>Formulario de ejemplo: no envía datos.</small>
  </form>
);

const Services = ({ m }: { m: Model }) => (
  <ul className={styles.cards}>
    {m.rubro.services.map((s, i) => (
      <li key={s.t}><Art rubro={m.rubro.id} i={i} /><h3>{s.t}</h3><p>{s.d}</p></li>
    ))}
  </ul>
);

const Gallery = ({ m, n = 6 }: { m: Model; n?: number }) => (
  <div className={styles.gallery}>
    {Array.from({ length: n }, (_, i) => <Art key={i} rubro={m.rubro.id} i={i} />)}
  </div>
);

const Faq = ({ m }: { m: Model }) => (
  <div className={styles.faq}>
    {m.rubro.faq.map((f) => <details key={f.q} open><summary>{f.q}</summary><p>{f.a}</p></details>)}
  </div>
);

const Contact = ({ m }: { m: Model }) => (
  <div className={styles.split}>
    <div>
      <h2>Escríbenos</h2>
      <p>{m.rubro.brand} · {m.rubro.tagline}</p>
      <p>Santa Cruz de la Sierra · Teléfono y dirección de ejemplo</p>
      <p>Lunes a sábado, de 9:00 a 19:00</p>
    </div>
    <Forms fields={["Nombre", "WhatsApp", "Mensaje"]} cta="Enviar por WhatsApp" />
  </div>
);

const Products = ({ m, n = 6 }: { m: Model; n?: number }) => (
  <ul className={styles.products}>
    {m.rubro.products.slice(0, n).map((p, i) => (
      <li key={p.n}>
        <Link href={modelHref(m, "producto")}>
          <Art rubro={m.rubro.id} i={i} />
          <b>{p.n}</b><span>{p.d}</span><em>{formatBs(p.p)}</em>
        </Link>
      </li>
    ))}
  </ul>
);

/* ---------- Presencia: una sola página con secciones ---------- */
function Presencia({ m }: { m: Model }) {
  const r = m.rubro;
  return (
    <div className={styles.site}>
      <header className={styles.top}><b>{r.brand}</b><nav><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a></nav></header>
      <main id="contenido">
        <section className={styles.heroSplit}>
          <div><span>{r.tagline}</span><h1>{r.lead}</h1><a className={styles.btn} href="#contacto">Escríbenos por WhatsApp</a></div>
          <Art rubro={r.id} i={0} label={`Ilustración de ${r.label.toLowerCase()}`} />
        </section>
        <section id="servicios" className={styles.block}><h2>Lo que ofrecemos</h2><Services m={m} /></section>
        <section id="nosotros" className={`${styles.block} ${styles.alt}`}>
          <div className={styles.split}>
            <Art rubro={r.id} i={1} />
            <div><h2>Sobre nosotros</h2><p>{r.about}</p><ul className={styles.checks}>{r.values.map((v) => <li key={v}><IconCheck width={18} height={18} />{v}</li>)}</ul></div>
          </div>
        </section>
        <section id="contacto" className={styles.block}><Contact m={m} /></section>
      </main>
    </div>
  );
}

/* ---------- Empresa: sitio de seis páginas ---------- */
function Empresa({ m, page }: P) {
  const r = m.rubro;
  const label = m.plan.pages.find((p) => p.slug === page)!.label;
  return (
    <div className={styles.site}>
      <header className={styles.top}>
        <Link href={modelHref(m)}><b>{r.brand}</b></Link>
        <nav>{m.plan.pages.map((p) => <Link key={p.slug} href={modelHref(m, p.slug)} aria-current={p.slug === page ? "page" : undefined}>{p.label}</Link>)}</nav>
      </header>
      <main id="contenido">
        {page === "" ? (
          <>
            <section className={styles.heroFull}>
              <Art rubro={r.id} i={2} />
              <div><span>{r.tagline}</span><h1>{r.lead}</h1><Link className={styles.btn} href={modelHref(m, "contacto")}>Contáctanos</Link></div>
            </section>
            <section className={styles.block}><h2>Nuestros servicios</h2><Services m={m} /></section>
            <section className={`${styles.block} ${styles.alt}`}><h2>Por qué elegirnos</h2><ul className={styles.checks}>{r.values.map((v) => <li key={v}><IconCheck width={18} height={18} />{v}</li>)}</ul></section>
          </>
        ) : (
          <>
            <section className={styles.pageHead}><h1>{label}</h1><p>{r.brand} · {r.tagline}</p></section>
            <section className={styles.block}>
              {page === "nosotros" && <div className={styles.split}><Art rubro={r.id} i={1} /><div><h2>Nuestra historia</h2><p>{r.about}</p><ul className={styles.checks}>{r.values.map((v) => <li key={v}><IconCheck width={18} height={18} />{v}</li>)}</ul></div></div>}
              {page === "servicios" && <Services m={m} />}
              {page === "galeria" && <Gallery m={m} />}
              {page === "preguntas" && <Faq m={m} />}
              {page === "contacto" && <Contact m={m} />}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

/* ---------- Tienda: compra de principio a fin ---------- */
function Tienda({ m, page }: P) {
  const r = m.rubro;
  const [a, b] = r.products;
  const total = a.p + b.p;
  return (
    <div className={styles.site}>
      <header className={styles.top}>
        <Link href={modelHref(m)}><b>{r.brand}</b></Link>
        <nav>
          {m.plan.pages.filter((p) => ["", "catalogo", "contacto"].includes(p.slug)).map((p) => <Link key={p.slug} href={modelHref(m, p.slug)} aria-current={p.slug === page ? "page" : undefined}>{p.label}</Link>)}
          <Link href={modelHref(m, "carrito")} className={styles.cart} aria-current={page === "carrito" ? "page" : undefined}>Carrito (2)</Link>
        </nav>
      </header>
      <main id="contenido">
        {page === "" && (
          <>
            <section className={styles.heroBand}>
              <div><span>{r.tagline}</span><h1>{r.lead}</h1><Link className={styles.btn} href={modelHref(m, "catalogo")}>Ver {r.productsLabel.toLowerCase()}</Link></div>
              <Art rubro={r.id} i={3} />
            </section>
            <section className={styles.block}><h2>Lo más pedido</h2><Products m={m} n={3} /></section>
          </>
        )}
        {page === "catalogo" && <section className={styles.block}><h1 className={styles.h1}>{r.productsLabel}</h1><Products m={m} /></section>}
        {page === "producto" && (
          <section className={styles.block}>
            <div className={styles.split}>
              <Art rubro={r.id} i={0} />
              <div>
                <h1 className={styles.h1}>{a.n}</h1><p>{a.d}</p><p className={styles.price}>{formatBs(a.p)}</p>
                <Link className={styles.btn} href={modelHref(m, "carrito")}>Agregar al carrito</Link>
              </div>
            </div>
          </section>
        )}
        {page === "carrito" && (
          <section className={styles.block}>
            <h1 className={styles.h1}>Tu carrito</h1>
            <ul className={styles.lines}>{[a, b].map((p, i) => <li key={p.n}><Art rubro={r.id} i={i} /><span><b>{p.n}</b><small>{p.d}</small></span><em>{formatBs(p.p)}</em></li>)}</ul>
            <p className={styles.price}>Total: {formatBs(total)}</p>
            <Link className={styles.btn} href={modelHref(m, "pago")}>Ir a pagar</Link>
          </section>
        )}
        {page === "pago" && (
          <section className={styles.block}>
            <h1 className={styles.h1}>Pago</h1>
            <div className={`${styles.split} ${styles.below}`}>
              <Forms fields={["Nombre", "WhatsApp", "Dirección de entrega"]} cta="Confirmar pedido" />
              <div className={styles.qr}>
                <h2>Paga con QR</h2>
                <svg viewBox="0 0 90 90" role="img" aria-label="Código QR de ejemplo">
                  {Array.from({ length: 81 }, (_, i) => ((i * 7 + (i % 5) * 3) % 3 === 0 ? <rect key={i} x={(i % 9) * 10} y={Math.floor(i / 9) * 10} width="10" height="10" /> : null))}
                </svg>
                <p className={styles.price}>Total: {formatBs(total)}</p>
                <small>QR de ejemplo: no realiza cobros.</small>
              </div>
            </div>
          </section>
        )}
        {page === "contacto" && <section className={styles.block}><h1 className={styles.h1}>Contacto</h1><div className={styles.below}><Contact m={m} /></div></section>}
      </main>
    </div>
  );
}

/* ---------- A medida: sistema con panel ---------- */
function AMedida({ m, page }: P) {
  const r = m.rubro;
  const { app } = r;
  const label = m.plan.pages.find((p) => p.slug === page)!.label;
  const table = (
    <div className={styles.tableWrap}>
      <table>
        <thead><tr>{app.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{app.rows.map((row) => <tr key={row[0]}>{row.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
  return (
    <div className={styles.app}>
      <aside>
        <Link href={modelHref(m)}><b>{r.brand}</b></Link>
        <nav>{m.plan.pages.map((p) => <Link key={p.slug} href={modelHref(m, p.slug)} aria-current={p.slug === page ? "page" : undefined}>{p.slug === "registros" ? app.module : p.label}</Link>)}</nav>
      </aside>
      <main id="contenido">
        <h1 className={styles.h1}>{page === "registros" ? app.module : page === "nuevo" ? `Nuevo: ${app.item}` : label}</h1>
        {page === "" && (
          <>
            <ul className={styles.kpis}>{app.kpis.map((k) => <li key={k.l}><span>{k.l}</span><b>{k.v}</b></li>)}</ul>
            <h2>{app.module} recientes</h2>{table}
          </>
        )}
        {page === "registros" && table}
        {page === "nuevo" && <Forms fields={app.fields} cta="Guardar" />}
        {page === "reportes" && (
          <>
            <h2>Actividad de ejemplo</h2>
            <ul className={styles.bars}>{app.report.map((x) => <li key={x.l}><span>{x.l}</span><i style={{ width: `${x.v}%` }} /><b>{x.v}</b></li>)}</ul>
          </>
        )}
        {page === "usuarios" && (
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th scope="col">Usuario</th><th scope="col">Rol</th><th scope="col">Acceso</th></tr></thead>
              <tbody>
                <tr><td>Administración</td><td>Administrador</td><td>Todo el sistema</td></tr>
                <tr><td>Atención</td><td>Operador</td><td>{app.module}</td></tr>
                <tr><td>Gerencia</td><td>Consulta</td><td>Reportes</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {page === "ajustes" && <Forms fields={["Nombre del negocio", "Sucursal", "Horario de atención"]} cta="Guardar cambios" />}
      </main>
    </div>
  );
}

export default function ModelSite({ m, page }: P) {
  const wa = `${WHATSAPP_URL}?text=${encodeURIComponent(chooseText(m))}`;
  const Site = { presencia: Presencia, empresa: Empresa, tienda: Tienda, "a-medida": AMedida }[m.plan.id];
  return (
    <div className={`${styles.root} ${styles[m.rubro.id]}`}>
      <div className={styles.bar}>
        <Link href={`${CATALOG_URL}#modelos`}>← Catálogo</Link>
        <span>Modelo <b>{m.code}</b> · {m.plan.label} · Negocio ficticio</span>
        <a href={wa} target="_blank" rel="noopener"><IconWhatsApp width={16} height={16} /> Elegir este modelo</a>
      </div>
      <Site m={m} page={page} />
    </div>
  );
}
