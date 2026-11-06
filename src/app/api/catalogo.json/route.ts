import { PRODUCT_RANGES, REQUEST_PACKAGES, WHATSAPP_CATALOG } from "@/lib/catalog";
import { DESIGNS } from "@/lib/designs";
import { BUDGETS, FEATURES, FILES, STATUSES } from "@/lib/request";

// Fuente de precios y opciones para el servidor de solicitudes: el PHP la lee desde el disco
// del hosting, así el precio nunca depende de lo que envíe el navegador.
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    paquetes: REQUEST_PACKAGES.map((p) => ({ id: p.id, nombre: p.name, tipo: p.kind, precio: p.price, desde: p.from, tienda: p.store })),
    catalogo: { nombre: WHATSAPP_CATALOG.name, precio: WHATSAPP_CATALOG.price, solo_con: "empresa" },
    productos: PRODUCT_RANGES,
    disenos: DESIGNS.map((d) => ({ id: d.slug, n: d.n, nombre: d.name })),
    funciones: FEATURES,
    presupuestos: BUDGETS,
    estados: STATUSES,
    archivos: FILES,
  });
}
