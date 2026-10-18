import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import styles from "../legal.module.css";

const title = `Política de privacidad | ${SITE.name}`;
const description = "Cómo SIBNOVA recopila, usa y protege los datos que nos envías por el formulario de contacto, el diagnóstico digital y WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidad/" },
  openGraph: { title, description, url: "/privacidad/", type: "website", locale: "es_BO", siteName: SITE.name, images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image.png"] },
};

const SECCIONES = [
  ["responsable", "Responsable de tus datos"],
  ["datos", "Qué datos recopilamos"],
  ["uso", "Para qué los usamos"],
  ["whatsapp", "WhatsApp y otros servicios"],
  ["guarda", "Cuánto tiempo los guardamos"],
  ["derechos", "Tus derechos"],
  ["cookies", "Cookies y medición"],
  ["seguridad", "Seguridad"],
  ["proyectos", "Datos de proyectos de clientes"],
  ["cambios", "Cambios a esta política"],
] as const;

export default function Privacidad() {
  const n = (id: string) => String(SECCIONES.findIndex(([k]) => k === id) + 1).padStart(2, "0");
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="contenido">
        <section className={styles.hero} aria-labelledby="priv-titulo">
          <div className={`wrap ${styles.heroInner}`}>
            <span className="num">Legal</span>
            <h1 id="priv-titulo" className="display h2">Política de privacidad</h1>
            <p className="lead">Te explicamos qué datos nos envías, para qué los usamos y cómo puedes pedir que los corrijamos o eliminemos.</p>
            <p className={styles.meta}><span>Versión <b>1.0</b></span><span>Vigente desde <b>octubre de 2026</b></span></p>
          </div>
        </section>

        <div className={`wrap ${styles.body}`}>
          <nav className={styles.toc} aria-label="Contenido">
            <p>Contenido</p>
            <ol>
              {SECCIONES.map(([id, t]) => (
                <li key={id}><a href={`#${id}`}>{t}</a></li>
              ))}
            </ol>
          </nav>

          <article className={styles.doc}>
            <h2 id="responsable"><span>{n("responsable")}</span>Responsable de tus datos</h2>
            <p>
              El responsable es <strong>{SITE.fullLegalName}</strong> («SIBNOVA», «nosotros»), con domicilio en {SITE.city}.
              Para cualquier consulta sobre tus datos escríbenos a <a href={`mailto:${SITE.email}`}>{SITE.email}</a> o
              por WhatsApp al <a href={WHATSAPP_URL} target="_blank" rel="noopener">{SITE.phoneDisplay}</a>.
            </p>

            <h2 id="datos"><span>{n("datos")}</span>Qué datos recopilamos</h2>
            <p>Solo los que tú nos das, en estos casos:</p>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Dónde</th><th>Datos</th></tr></thead>
                <tbody>
                  <tr><td>Formulario «Hablemos de tu proyecto»</td><td>Nombre, WhatsApp o correo, el tema que te interesa y tu mensaje.</td></tr>
                  <tr><td>Diagnóstico digital</td><td>Tus respuestas sobre el negocio (rubro, tamaño, herramientas, problemas, objetivos, plazo y presupuesto aproximado) y tus datos de contacto: nombre, WhatsApp y, si quieres, empresa, ciudad y correo.</td></tr>
                  <tr><td>WhatsApp y correo</td><td>Lo que nos escribas, tu número o dirección y tu nombre de perfil.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>El sitio no guarda tus datos en nuestros servidores.</strong> Al enviar el formulario o el diagnóstico se
              abre WhatsApp con el mensaje ya escrito: nos llega solo si tú lo envías. Las respuestas del diagnóstico se
              guardan en tu propio navegador para que no las pierdas si recargas la página; puedes borrarlas con «Hacer el
              diagnóstico de nuevo» o limpiando los datos del navegador.
            </p>

            <h2 id="uso"><span>{n("uso")}</span>Para qué los usamos</h2>
            <ul>
              <li>Responder tu consulta y analizar tu diagnóstico.</li>
              <li>Preparar una propuesta o cotización si la pides.</li>
              <li>Hacer seguimiento de esa conversación.</li>
            </ul>
            <p><strong>No vendemos ni alquilamos tus datos</strong> y no te enviaremos publicidad masiva sin tu permiso.</p>

            <h2 id="whatsapp"><span>{n("whatsapp")}</span>WhatsApp y otros servicios</h2>
            <p>
              Los mensajes que nos envías por WhatsApp pasan por los servidores de WhatsApp (Meta) y se rigen también por su
              política de privacidad. El sitio está alojado en Hostinger, que registra datos técnicos de cada visita (como la
              dirección IP y el navegador) para la seguridad y el funcionamiento del servidor.
            </p>

            <h2 id="guarda"><span>{n("guarda")}</span>Cuánto tiempo los guardamos</h2>
            <p>
              Conservamos las conversaciones y los datos de contacto mientras dure la relación comercial y hasta <strong>2 años</strong> después
              del último contacto. Si no llegamos a trabajar juntos, los eliminamos antes si nos lo pides.
            </p>

            <h2 id="derechos"><span>{n("derechos")}</span>Tus derechos</h2>
            <p>En cualquier momento puedes pedirnos:</p>
            <ul>
              <li><strong>Saber</strong> qué datos tuyos tenemos.</li>
              <li><strong>Corregirlos</strong> si están mal o incompletos.</li>
              <li><strong>Eliminarlos</strong> y dejar de recibir mensajes nuestros.</li>
            </ul>
            <p>
              Escríbenos a <a href={`mailto:${SITE.email}`}>{SITE.email}</a> o por WhatsApp. Respondemos en un plazo máximo de
              10 días hábiles. Estos derechos se reconocen en la Constitución Política del Estado Plurinacional de Bolivia.
            </p>

            <h2 id="cookies"><span>{n("cookies")}</span>Cookies y medición</h2>
            <p>
              Hoy el sitio <strong>no usa cookies de publicidad ni herramientas de medición de visitas</strong>. Si en el futuro
              las agregamos, actualizaremos esta política y, cuando corresponda, te pediremos permiso.
            </p>

            <h2 id="seguridad"><span>{n("seguridad")}</span>Seguridad</h2>
            <p>
              El sitio funciona siempre con conexión cifrada (HTTPS). Solo el equipo de SIBNOVA que atiende tu consulta accede
              a tus mensajes.
            </p>

            <h2 id="proyectos"><span>{n("proyectos")}</span>Datos de proyectos de clientes</h2>
            <p>
              Cuando desarrollamos un sistema para tu empresa, la información de tu negocio y de tus clientes se maneja según
              el contrato y el acuerdo de confidencialidad que firmemos para ese proyecto.
            </p>

            <h2 id="cambios"><span>{n("cambios")}</span>Cambios a esta política</h2>
            <p>
              Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha. Los cambios importantes
              los avisaremos en el sitio.
            </p>
          </article>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
