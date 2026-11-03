import Link from "next/link";
import { CATALOG_URL } from "@/lib/catalog";
import { photoSrc, type Design } from "@/lib/designs";
import ChooseDesign from "./ChooseDesign";
import styles from "./demo.module.css";

// Demo de una página comercial con el estilo elegido. Cada estilo cambia composición y apariencia
// (demo.module.css); el contenido es de un negocio ficticio.
const Img = ({ k, alt, className, eager }: { k: string; alt: string; className?: string; eager?: boolean }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={photoSrc(k)} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />
);

function Hero({ d }: { d: Design }) {
  const { demo } = d;
  const [p0, p1, p2] = demo.photos;
  const copy = (
    <div className={styles.heroCopy}>
      <span className={styles.kicker}>{demo.kicker}</span>
      <h1 className={styles.title}>{demo.title}</h1>
      <p className={styles.lead}>{demo.text}</p>
      <div className={styles.ctas}>
        <a href="#contacto" className={styles.btn}>{demo.cta}</a>
        <a href="#servicios" className={styles.btn2}>{demo.cta2}</a>
      </div>
    </div>
  );
  const alt = `${demo.kind}: imagen de ejemplo`;
  switch (d.hero) {
    case "full":
      return <section className={`${styles.hero} ${styles.heroFull}`}><Img k={p0} alt={alt} className={styles.heroBg} eager />{copy}</section>;
    case "center":
      return <section className={`${styles.hero} ${styles.heroCenter}`}>{copy}<div className={styles.heroMedia}><Img k={p0} alt={alt} eager /></div></section>;
    case "editorial":
      return (
        <section className={`${styles.hero} ${styles.heroEditorial}`}>
          {copy}
          <figure className={styles.heroMedia}><Img k={p0} alt={alt} eager /><figcaption>{demo.kind} · {demo.brand}</figcaption></figure>
        </section>
      );
    case "bento":
      return (
        <section className={`${styles.hero} ${styles.heroBento}`}>
          {copy}
          <Img k={p0} alt={alt} className={styles.b1} eager />
          <Img k={p1} alt={`${demo.kind}: producto de ejemplo`} className={styles.b2} />
          <Img k={p2} alt={`${demo.kind}: producto de ejemplo`} className={styles.b3} />
        </section>
      );
    case "poster":
      return (
        <section className={`${styles.hero} ${styles.heroPoster}`}>
          <div className={styles.layers} aria-hidden="true">
            <Img k={p0} alt="" className={styles.l1} eager />
            <Img k={p1} alt="" className={styles.l2} />
          </div>
          {copy}
        </section>
      );
    default:
      return <section className={`${styles.hero} ${styles.heroSplit}`}>{copy}<div className={styles.heroMedia}><Img k={p0} alt={alt} eager /></div></section>;
  }
}

function Body({ d }: { d: Design }) {
  const { demo } = d;
  const [, p1, p2, p3, p4] = demo.photos;
  const features = (
    <ul className={styles.features}>
      {demo.features.map((f, i) => (
        <li key={f.t} className={styles.feature}>
          <span className={styles.fNum}>{String(i + 1).padStart(2, "0")}</span>
          <h3>{f.t}</h3>
          <p>{f.d}</p>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <section id="servicios" className={`${styles.section} ${styles[`body_${d.body}`]}`} aria-labelledby={`${d.slug}-servicios`}>
        <h2 id={`${d.slug}-servicios`} className={styles.h2}>Lo que ofrecemos</h2>
        {d.body === "bento" ? (
          <div className={styles.bento}>
            {demo.features.map((f, i) => (
              <article key={f.t} className={`${styles.cell} ${styles[`c${i}`]}`}>
                {i === 0 && <Img k={p1 ?? demo.photos[0]} alt={`${f.t}: imagen de ejemplo`} />}
                <div><h3>{f.t}</h3><p>{f.d}</p></div>
              </article>
            ))}
            <article className={`${styles.cell} ${styles.c3}`}><Img k={p2 ?? demo.photos[0]} alt={`${demo.kind}: imagen de ejemplo`} /></article>
          </div>
        ) : features}
      </section>

      <section className={`${styles.section} ${styles.about}`}>
        <div className={styles.aboutMedia}><Img k={p3 ?? p1} alt={`${demo.kind}: el equipo o el lugar`} /></div>
        <div className={styles.aboutCopy}>
          <h2 className={styles.h2}>{demo.aboutTitle}</h2>
          <p>{demo.about}</p>
          <ul className={styles.points}>{demo.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.gallerySec}`} aria-label="Galería">
        <div className={styles.gallery}>
          {[p1, p2, p4 ?? p3].filter(Boolean).map((k, i) => <Img key={`${k}-${i}`} k={k!} alt={`${demo.kind}: foto ${i + 1} de ejemplo`} />)}
        </div>
      </section>

      <section id="contacto" className={`${styles.section} ${styles.band}`}>
        <h2 className={styles.h2}>{demo.band}</h2>
        <a href="#contacto" className={styles.btn}>{demo.cta}</a>
        <p className={styles.fake}>Datos de contacto de ejemplo · Santa Cruz de la Sierra</p>
      </section>
    </>
  );
}

export default function DesignDemo({ d }: { d: Design }) {
  return (
    <div className={`${styles.root} ${styles[`s${d.n}`]}`}>
      <div className={styles.bar} role="note">
        <Link href={`${CATALOG_URL}#disenos`}>← Catálogo</Link>
        <span><b>Demo de diseño SIBNOVA</b> · {d.n} {d.name} · Negocio ficticio</span>
        <ChooseDesign slug={d.slug} className={styles.barChoose}>Elegir este diseño</ChooseDesign>
      </div>
      <header className={styles.header}>
        <a href="#" className={styles.brand}>{d.demo.brand}</a>
        <nav aria-label={`Menú de ${d.demo.brand}`}>{d.demo.nav.map((n) => <a key={n} href="#servicios">{n}</a>)}</nav>
        <a href="#contacto" className={styles.headCta}>{d.demo.cta}</a>
      </header>
      <main id="contenido">
        <Hero d={d} />
        <Body d={d} />
      </main>
      <footer className={styles.footer}>
        <b>{d.demo.brand}</b>
        <span>{d.demo.kind} · Negocio ficticio para la demo {d.n} de SIBNOVA</span>
        <span>Fotos: Unsplash</span>
      </footer>
    </div>
  );
}
