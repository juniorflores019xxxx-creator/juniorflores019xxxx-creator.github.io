// Reglas del formulario de solicitud. El servidor (public/api/solicitud.php) aplica las mismas
// a partir de /api/catalogo.json, que se genera desde estos datos en cada build.
export const REQUEST_API = "/api/solicitud.php";

export const FEATURES = [
  { id: "panel", label: "Panel administrativo" },
  { id: "catalogo", label: "Catálogo de productos o servicios" },
  { id: "tienda", label: "Tienda online" },
  { id: "whatsapp", label: "Integración con WhatsApp" },
  { id: "redes", label: "Integración con redes sociales" },
  { id: "pagos", label: "Pasarela de pagos" },
  { id: "formularios", label: "Formularios" },
  { id: "reservas", label: "Reservas" },
  { id: "correo", label: "Correo corporativo" },
] as const;

export const BUDGETS = ["Bs 1.500 a 5.000", "Bs 5.000 a 10.000", "Bs 10.000 a 20.000", "Más de Bs 20.000", "Prefiero conversarlo"] as const;

export const STATUSES = [
  "Nueva solicitud", "Pendiente de revisión", "Contactado", "Cotización enviada", "En negociación",
  "Aprobado", "En desarrollo", "Entregado", "Cancelado",
] as const;

export const FILES = {
  maxFiles: 10,
  maxFileMB: 10,
  maxTotalMB: 40,
  ext: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "mp4", "mov"],
};
