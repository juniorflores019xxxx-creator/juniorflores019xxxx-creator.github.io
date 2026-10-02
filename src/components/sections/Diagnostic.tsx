import { ArrowRight } from "@/components/ui/icons";
import styles from "./diagnostic.module.css";

// Invitación al diagnóstico digital gratuito (formulario en /diagnostico/).
const POINTS = ["10 preguntas", "2 minutos", "Resultado al instante", "Gratis y sin compromiso"];

export default function Diagnostic() {
  return (
    <section id="diagnostico" className={styles.section} aria-labelledby="diag-titulo">
      <div className="wrap">
        <div className={styles.card} data-reveal>
          <div className={styles.copy}>
            <span className="num">Diagnóstico digital gratuito</span>
            <h2 id="diag-titulo" className={`display ${styles.title}`}>¿No sabes por dónde empezar?</h2>
            <p className={styles.text}>
              Responde unas preguntas sobre tu negocio y descubre qué procesos puedes digitalizar y automatizar primero.
              Recibes tu resultado en pantalla y puedes enviárnoslo por WhatsApp para preparar una propuesta.
            </p>
            <ul className={styles.points}>
              {POINTS.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <a href="/diagnostico/" className={`btn btn-primary btn-lg ${styles.btn}`}>
            Hacer el diagnóstico <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
