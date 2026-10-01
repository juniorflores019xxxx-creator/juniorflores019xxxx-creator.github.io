import { FOUNDERS } from "@/lib/site";
import Split from "@/components/ui/Split";
import styles from "./company.module.css";

export default function Company() {
  return (
    <section id="nosotros" className={`section ${styles.section}`} aria-label="Nosotros">
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.copy}>
          <Split as="h2" text="Construimos tecnología que *resuelve.*" className="display h2" />
          <p className="lead" data-reveal>
            SIBNOVA nace para ayudar a empresas y emprendedores a convertir ideas complejas en soluciones digitales
            simples, escalables y eficientes.
          </p>
          <p className={styles.place} data-reveal>Santa Cruz de la Sierra, Bolivia</p>
        </div>

        <ul className={styles.team}>
          {FOUNDERS.map((f, i) => {
            const [position, specialty] = f.role.split(" · ");
            return (
              <li key={f.name} className={styles.member} data-reveal style={{ marginTop: i % 2 === 1 ? "var(--offset)" : undefined }}>
                <figure className={styles.figure}>
                  <div className={styles.frame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.photo} alt={`${f.name}, ${position.toLowerCase() === "ceo" ? "CEO" : position.toLowerCase()}${specialty ? ` y ${specialty.toLowerCase()}` : ""} de SIBNOVA`} width={800} height={1200} loading="lazy" data-zoom />
                  </div>
                  <figcaption className={styles.caption}>
                    <b>{f.name}</b>
                    <span className={styles.position}>{position}</span>
                    {specialty && <span className={styles.specialty}>{specialty}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
