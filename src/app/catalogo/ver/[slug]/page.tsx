import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoViewer from "@/components/designs/DemoViewer";
import { DESIGNS, getDesign } from "@/lib/designs";
import { SITE } from "@/lib/site";

// Visor de las 20 demos del catálogo; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/catalogo/ver/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) return {};
  // La demo en sí está indexada en /catalogo/disenos/; el visor es solo la forma de mirarla.
  return { title: `Ver diseño ${d.n} ${d.name} | ${SITE.name}`, robots: { index: false, follow: true }, alternates: { canonical: `/catalogo/disenos/${d.slug}/` } };
}

export default async function ViewerPage(props: PageProps<"/catalogo/ver/[slug]">) {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) notFound();
  return <DemoViewer d={d} />;
}
