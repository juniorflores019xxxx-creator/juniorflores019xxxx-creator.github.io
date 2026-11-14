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

const title = `Redes sociales para tu negocio | ${SITE.name}`;
const description = `Manejo de Facebook, Instagram y TikTok con videos grabados en tu negocio, publicaciones y atención a tus clientes. Combos desde ${formatBs(COMBOS[0].precio)} al mes en Santa Cruz, Bolivia.`;

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
