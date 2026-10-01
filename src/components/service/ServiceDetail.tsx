import Link from "next/link";
import { SERVICES, serviceHref, type Service } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/site";
import { SERVICE_ICONS } from "@/components/ui/serviceIcons";
import { ArrowRight, IconCheck, IconWhatsApp } from "@/components/ui/icons";
import Split from "@/components/ui/Split";
import styles from "./service.module.css";

export default function ServiceDetail({ service }: { service: Service }) {
  const Icon = SERVICE_ICONS[service.icon];
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const waText = encodeURIComponent(`Hola SIBNOVA, quiero información sobre ${service.title.toLowerCase()}.`);

  return (
    <>
      {/* ---------- Cabecera del servicio ---------- */}
      <section className={styles.hero} aria-labelledby="servicio-titulo">
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wrap ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <nav aria-label="Ruta" className={styles.crumbs} data-reveal>
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#servicios">Servicios</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{service.title}</span>
            </nav>
            <span className="num" data-reveal>{service.n} · Servicio</span>
            <h1 id="servicio-titulo" className={`display ${styles.title}`} data-reveal>{service.title}</h1>
            <p className={styles.short} data-reveal>{service.short}</p>
            <p className="lead" data-reveal>{service.intro}</p>
            <div className={styles.ctas} data-reveal>
              <a href="#contacto" className="btn btn-primary btn-lg">Hablemos de tu proyecto <ArrowRight /></a>
              <a href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noopener" className="btn btn-ghost btn-lg">
                <IconWhatsApp width={18} height={18} /> Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true" data-reveal>
            <span className={styles.orbit} />
            <span className={`${styles.orbit} ${styles.orbit2}`} />
            <span className={styles.core}><Icon /></span>
            {service.tech.slice(0, 4).map((t, i) => (
              <span key={t} className={styles.chip} style={{ ["--a" as string]: `${-60 + i * 95}deg` }}>
                <span>{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Lo que resolvemos ---------- */}
      <section className={`section ${styles.painSection}`} aria-labelledby="que-resolvemos">
        <div className="wrap">
          <div className={styles.head}>
            <Split as="h2" text="¿Te *pasa* esto?" className="display h2" />
            <p className="lead" data-reveal>Lo que más escuchamos de las empresas y cómo lo resolvemos.</p>
          </div>
          <span id="que-resolvemos" className="sr-only">Lo que resolvemos</span>
          <ul className={styles.pains}>
            {service.problems.map((p) => (
              <li key={p.pain} className={styles.pain} data-reveal>
                <p className={styles.painQ}>{p.pain}</p>
                <p className={styles.painA}><ArrowRight aria-hidden="true" />{p.fix}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Qué construimos ---------- */}
      <section className="section" aria-labelledby="que-construimos">
        <div className="wrap">
          <div className={styles.head}>
            <Split as="h2" text="Qué *construimos*" className="display h2" />
            <p className="lead" data-reveal>Soluciones concretas, diseñadas para el problema de cada negocio.</p>
          </div>
          <span id="que-construimos" className="sr-only">Qué construimos</span>
          <ul className={styles.builds}>
            {service.builds.map((b, i) => (
              <li key={b.t} data-reveal className={styles.build}>
                <span className={styles.bn}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.buildBody}><b>{b.t}</b><span>{b.d}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Ejemplos por rubro ---------- */}
      <section className={`section ${styles.casesSection}`} aria-label="Ejemplos por rubro">
        <div className="wrap">
          <div className={styles.head}>
            <Split as="h2" text="Ejemplos por *rubro*" className="display h2" />
            <p className="lead" data-reveal>Así se ve este servicio en distintos tipos de negocio. Cada proyecto se adapta a tu operación.</p>
          </div>
          <ul className={styles.cases}>
            {service.useCases.map((u) => (
              <li key={u.sector} className={styles.case} data-reveal>
                <span className={styles.sector}>{u.sector}</span>
                <p>{u.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Cómo lo hacemos ---------- */}
      <section className={`section ${styles.stepsSection}`} aria-label="Cómo lo hacemos">
        <div className="wrap">
          <div className={styles.head}>
            <Split as="h2" text="Cómo lo *hacemos*" className="display h2" />
            <p className="lead" data-reveal>Un proceso claro, con etapas que puedes seguir y revisar en cada momento.</p>
          </div>
          <ol className={styles.steps}>
            {service.steps.map((s, i) => (
              <li key={s.title} className={styles.step} data-reveal>
                <span className={styles.stepDot} aria-hidden="true" />
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className={styles.out}><IconCheck width={14} height={14} aria-hidden="true" />{s.out}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Tecnologías, entregables y para quién ---------- */}
      <section className="section" aria-label="Tecnologías y entregables">
        <div className={`wrap ${styles.three}`}>
          <div className={styles.panel} data-reveal>
            <h2 className={styles.panelTitle}>Tecnologías</h2>
            <ul className={styles.tech}>
              {service.tech.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className={styles.panel} data-reveal>
            <h2 className={styles.panelTitle}>Qué recibes</h2>
            <ul className={styles.checks}>
              {service.deliverables.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
            </ul>
          </div>
          <div className={styles.panel} data-reveal>
            <h2 className={styles.panelTitle}>Para quién es</h2>
            <ul className={styles.checks}>
              {service.idealFor.map((d) => <li key={d}><IconCheck width={18} height={18} />{d}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section className="section" aria-labelledby="faq-titulo">
        <div className={`wrap ${styles.faqGrid}`}>
          <div className={styles.faqHead}>
            <Split as="h2" text="Preguntas *frecuentes*" className="display h2" />
            <p className="lead" data-reveal>¿Tienes otra duda? Escríbenos por WhatsApp y te respondemos.</p>
            <span id="faq-titulo" className="sr-only">Preguntas frecuentes</span>
          </div>
          <div className={styles.faq}>
            {service.faq.map((f, i) => (
              <details key={f.q} className={styles.qa} data-reveal open={i === 0}>
                <summary>{f.q}<span className={styles.plus} aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Otros servicios ---------- */}
      <section className={`section ${styles.othersSection}`} aria-label="Otros servicios">
        <div className="wrap">
          <Split as="h2" text="Otros *servicios*" className="display h2" />
          <ul className={styles.others}>
            {others.map((o) => {
              const OIcon = SERVICE_ICONS[o.icon];
              return (
                <li key={o.slug} data-reveal>
                  <Link href={serviceHref(o.slug)} className={`spot ${styles.other}`}>
                    <span className={styles.otherIcon}><OIcon /></span>
                    <span className="num">{o.n}</span>
                    <b>{o.title}</b>
                    <small>{o.short}</small>
                    <span className={styles.otherGo}>Ver servicio <ArrowRight /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
