import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SearchPalette from "@/components/search/SearchPalette";
import RequestForm from "@/components/designs/RequestForm";
import { REQUEST_URL } from "@/lib/designs";
import { SITE } from "@/lib/site";
import styles from "../../legal.module.css";
import service from "@/components/service/service.module.css";

const title = `Solicitar mi página web | ${SITE.name}`;
const description = "Elige tu diseño y paquete, cuéntanos de tu negocio y envíanos tu solicitud de página web.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: REQUEST_URL },
  robots: { index: false, follow: true },
};

export default function SolicitudPage() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="contenido">
        <section className={styles.hero} aria-labelledby="solicitud-titulo">
          <div className={`wrap ${styles.heroInner}`}>
            <nav aria-label="Ruta" className={service.crumbs}>
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link href="/catalogo/">Catálogo</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Solicitud</span>
            </nav>
            <h1 id="solicitud-titulo" className="display h2">Solicita tu página web</h1>
            <p className="lead">Completa estos pasos y te enviamos una proforma con el alcance, el plazo y el precio final.</p>
          </div>
        </section>
        <div id="solicitud" className="wrap" style={{ paddingBottom: 96, scrollMarginTop: "calc(var(--header-h) + 16px)" }}>
          <RequestForm />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
      <SearchPalette />
    </>
  );
}
