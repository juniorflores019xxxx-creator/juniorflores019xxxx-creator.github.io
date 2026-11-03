import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DesignDemo from "@/components/designs/DesignDemo";
import { DESIGNS, getDesign, photoSrc } from "@/lib/designs";
import { SITE } from "@/lib/site";

// Solo existen las 20 demos del catálogo; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/catalogo/disenos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) return {};
  const title = `Diseño ${d.n} ${d.name}: demo de página web | ${SITE.name}`;
  return {
    title,
    description: `${d.short} Demo de diseño SIBNOVA con un negocio ficticio.`,
    alternates: { canonical: `/catalogo/disenos/${d.slug}/` },
    openGraph: { title, description: d.short, url: `/catalogo/disenos/${d.slug}/`, type: "website", locale: "es_BO", siteName: SITE.name, images: [photoSrc(d.demo.photos[0])] },
  };
}

export default async function DesignPage(props: PageProps<"/catalogo/disenos/[slug]">) {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) notFound();
  return <DesignDemo d={d} />;
}
