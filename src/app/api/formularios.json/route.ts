import { ACCEPT, FORMS } from "@/lib/forms";
import { FILES } from "@/lib/request";

// Definición de los formularios de datos para el servidor (public/api/datos.php) y la bandeja:
// el PHP valida cada campo contra esta lista, que se genera en cada build desde src/lib/forms.ts.
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    formularios: FORMS.map((f) => ({
      id: f.id,
      titulo: f.title,
      resumen: f.short,
      campos: f.sections.flatMap((s) => s.fields.map((x) => ({
        name: x.name, label: x.label, type: x.type, required: !!x.required, max: x.max ?? 1000, options: x.options ?? [], ext: x.accept ? ACCEPT[x.accept] : [], seccion: s.title,
      }))),
    })),
    archivos: { maxFiles: 20, maxFileMB: FILES.maxFileMB, maxTotalMB: 80 },
  });
}
