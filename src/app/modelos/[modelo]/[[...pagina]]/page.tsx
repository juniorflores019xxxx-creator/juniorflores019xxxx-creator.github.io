import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModelSite from "@/components/modelos/ModelSite";
import { MODELS, getModel } from "@/lib/models";
import { SITE } from "@/lib/site";

// Solo existen los modelos del catálogo; cualquier otra ruta es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MODELS.flatMap((m) =>
    m.plan.pages.map((p) => ({ modelo: m.slug, pagina: p.slug ? [p.slug] : undefined }))
  );
}

type Props = PageProps<"/modelos/[modelo]/[[...pagina]]">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { modelo } = await props.params;
  const m = getModel(modelo);
  if (!m) return {};
  // Son ejemplos con negocios ficticios: no deben aparecer en Google.
  return { title: `Modelo ${m.code}: ${m.plan.label}, ${m.rubro.label} | ${SITE.name}`, robots: { index: false, follow: true } };
}

export default async function ModelPage(props: Props) {
  const { modelo, pagina } = await props.params;
  const m = getModel(modelo);
  const page = pagina?.[0] ?? "";
  if (!m || !m.plan.pages.some((p) => p.slug === page)) notFound();
  return <ModelSite m={m} page={page} />;
}
