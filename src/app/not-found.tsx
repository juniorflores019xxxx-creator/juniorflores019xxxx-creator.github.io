import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SITE, WHATSAPP_URL } from "@/lib/site";
import { ArrowRight, IconWhatsApp } from "@/components/ui/icons";
import DocTitle from "@/components/ui/DocTitle";
import styles from "./legal.module.css";

// Se exporta como out/404.html; Hostinger la muestra en cualquier ruta inexistente (.htaccess → ErrorDocument 404).
export default function NotFound() {
  return (
    <>
      <title>{`Página no encontrada | ${SITE.name}`}</title>
      <meta name="robots" content="noindex" />
      <DocTitle title={`Página no encontrada | ${SITE.name}`} />
      <Header />
      <main id="contenido" className={styles.nf}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wrap ${styles.nfInner}`}>
          <p className={styles.code} aria-hidden="true">404</p>
          <h1 className="display h2">Esta página <span className={styles.accent}>no existe.</span></h1>
          <p className="lead">El enlace está mal escrito o la página se movió. Desde aquí puedes seguir:</p>
          <div className={styles.acts}>
            <Link href="/" className="btn btn-primary btn-lg">Volver al inicio <ArrowRight /></Link>
            <Link href="/diagnostico/" className="btn btn-ghost btn-lg">Hacer el diagnóstico</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="btn btn-ghost btn-lg">
              <IconWhatsApp width={18} height={18} /> Escribirnos
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
