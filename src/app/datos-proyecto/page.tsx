import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ClientDataForm from "@/components/forms/ClientDataForm";
import { SITE } from "@/lib/site";

// Página privada: SIBNOVA envía el enlace a cada cliente. No aparece en el menú ni en Google.
export const metadata: Metadata = {
  title: `Datos de tu proyecto | ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default function DatosProyectoPage() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="contenido" className="wrap" style={{ paddingTop: "calc(var(--header-h) + 48px)", paddingBottom: 96 }}>
        <span className="num">Formulario de datos · SIBNOVA</span>
        <ClientDataForm />
      </main>
      <Footer />
    </>
  );
}
