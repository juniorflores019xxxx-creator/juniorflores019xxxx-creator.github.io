import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SearchPalette from "@/components/search/SearchPalette";
import Contact from "@/components/sections/Contact";
import Catalog from "@/components/catalog/Catalog";
import { CATALOG_FAQ, CATALOG_URL, WEB_PLANS, formatBs } from "@/lib/catalog";
import { SITE } from "@/lib/site";

const title = `Catálogo de páginas web | ${SITE.name}`;
const description = `Cuatro paquetes de páginas web en Bolivia, desde ${formatBs(WEB_PLANS[0].price)}: página de presentación, sitio corporativo, tienda en línea y plataforma a medida.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: CATALOG_URL },
  openGraph: { title, description, url: CATALOG_URL, type: "website", locale: "es_BO", siteName: SITE.name, images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image.png"] },
};

export default function CatalogoPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CATALOG_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <ScrollToTop />
      <Header />
      <main id="contenido">
        <Catalog />
        <Contact defaultTopic="Desarrollo web" />
      </main>
      <Footer />
      <WhatsAppFloat />
      <SearchPalette />
      <Motion />
    </>
  );
}
