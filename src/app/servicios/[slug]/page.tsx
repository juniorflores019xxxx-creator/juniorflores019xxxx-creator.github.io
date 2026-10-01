import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SearchPalette from "@/components/search/SearchPalette";
import Contact from "@/components/sections/Contact";
import ServiceDetail from "@/components/service/ServiceDetail";
import { SERVICES, getService } from "@/lib/services";
import { SITE } from "@/lib/site";

// Solo existen las cuatro páginas de servicio; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getService(slug);
  if (!s) return {};
  const title = `${s.title} | ${SITE.name}`;
  return {
    title,
    description: `${s.short} ${s.intro}`.slice(0, 160),
    alternates: { canonical: `/servicios/${s.slug}/` },
    openGraph: { title, description: s.short, url: `/servicios/${s.slug}/`, type: "website", locale: "es_BO", siteName: SITE.name },
    twitter: { card: "summary_large_image", title, description: s.short },
  };
}

export default async function ServicePage(props: PageProps<"/servicios/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <ScrollToTop />
      <Header />
      <main id="contenido">
        <ServiceDetail service={service} />
        <Contact defaultTopic={service.topic} />
      </main>
      <Footer />
      <WhatsAppFloat />
      <SearchPalette />
      <Motion />
    </>
  );
}
