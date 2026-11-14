import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SearchPalette from "@/components/search/SearchPalette";
import Contact from "@/components/sections/Contact";
import RedesCatalog from "@/components/redes/RedesCatalog";
import { formatBs } from "@/lib/catalog";
import { COMBOS, REDES_URL } from "@/lib/redes";
import { SITE } from "@/lib/site";

const title = `Marketing digital y community manager | ${SITE.name}`;
const description = `Contenido mensual con videos grabados en tu negocio, gestión de Facebook, Instagram y TikTok, publicidad pagada y Google Maps. Planes desde ${formatBs(COMBOS[0].precio)} al mes en Santa Cruz, Bolivia. Logo y creación de redes aparte.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: REDES_URL },
  openGraph: { title, description, url: REDES_URL, type: "website", locale: "es_BO", siteName: SITE.name, images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image.png"] },
};

export default function RedesSocialesPage() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="contenido">
        <RedesCatalog />
        <Contact defaultTopic="Otro" />
      </main>
      <Footer />
      <WhatsAppFloat />
      <SearchPalette />
      <Motion />
    </>
  );
}
