// Catálogo de páginas web (/catalogo/). Es el único lugar del sitio con precios públicos.
// Los montos y plazos salen del programa de cotización de SIBNOVA: si cambian, se cambian solo aquí.
export type WebPlan = {
  slug: string;           // ancla para compartir: /catalogo/#tienda
  n: string;
  name: string;
  kind: string;           // qué es, en palabras simples
  price: number;          // precio de partida en Bs
  weeks: string;          // plazo estimado
  pitch: string;
  idealFor: string;
  includes: string[];
  support: number;        // soporte mensual opcional sugerido en Bs
  featured?: boolean;
};

export const WEB_PLANS: WebPlan[] = [
  {
    slug: "presencia",
    n: "01",
    name: "Presencia",
    kind: "Página de presentación",
    price: 2100,
    weeks: "2 semanas",
    pitch: "Tu negocio en internet con una página clara y lista para recibir contactos.",
    idealFor: "Emprendedores, profesionales y campañas en redes.",
    includes: [
      "Una página con secciones, a partir del modelo que elijas",
      "Diseño adaptado a celular, tablet y computadora",
      "Botón de WhatsApp y formulario de contacto",
      "SEO básico",
      "Publicación en tu dominio con certificado SSL",
      "Capacitación de entrega",
    ],
    support: 350,
  },
  {
    slug: "empresa",
    n: "02",
    name: "Empresa",
    kind: "Sitio corporativo",
    price: 6400,
    weeks: "2 semanas",
    pitch: "Un sitio completo que presenta tu empresa y convierte visitas en contactos.",
    idealFor: "Empresas de servicios, clínicas, constructoras y estudios.",
    includes: [
      "Hasta 6 páginas: inicio, nosotros, servicios, galería, preguntas y contacto",
      "Modelo adaptado a tu marca y a todos los dispositivos",
      "Formularios y contacto conectados a WhatsApp o correo",
      "SEO técnico y Google Search Console",
      "Google Analytics configurado",
      "Publicación en tu dominio con certificado SSL",
      "Capacitación de entrega",
    ],
    support: 350,
    featured: true,
  },
  {
    slug: "tienda",
    n: "03",
    name: "Tienda",
    kind: "Tienda en línea",
    price: 13600,
    weeks: "2 a 3 semanas",
    pitch: "Vende por internet con catálogo, carrito y pagos en tu propia tienda.",
    idealFor: "Comercios y marcas que quieren vender en línea.",
    includes: [
      "Hasta 6 páginas: inicio, catálogo, producto, carrito, pago y contacto",
      "Pagos con QR",
      "Panel para gestionar productos y pedidos",
      "Avisos de pedidos para tu equipo",
      "SEO técnico y analítica",
      "Publicación en tu dominio con certificado SSL",
      "Capacitación para tu equipo",
    ],
    support: 750,
  },
  {
    slug: "a-medida",
    n: "04",
    name: "A medida",
    kind: "Plataforma web",
    price: 19800,
    weeks: "4 a 5 semanas",
    pitch: "Un sistema web diseñado para cómo funciona tu negocio.",
    idealFor: "Empresas que necesitan reservas, cotizadores, portales o gestión interna.",
    includes: [
      "Hasta 6 pantallas diseñadas a partir de tu proceso",
      "Usuarios con accesos por rol",
      "Un módulo principal: reservas, pedidos, obras o inventario",
      "Panel de administración y reportes",
      "Una integración con tus herramientas",
      "Publicación en la nube con certificado SSL",
      "Capacitación para tu equipo",
    ],
    support: 750,
  },
];

// Tabla comparativa: true = incluido, false = no incluido, texto = detalle.
export const COMPARE: { label: string; values: (boolean | string)[] }[] = [
  { label: "Páginas", values: ["1", "Hasta 6", "Hasta 6", "Hasta 6 pantallas"] },
  { label: "Adaptada a celular", values: [true, true, true, true] },
  { label: "WhatsApp y formulario", values: [true, true, true, true] },
  { label: "SEO", values: ["Básico", "Técnico", "Técnico", "Según el alcance"] },
  { label: "Analítica de visitas", values: [false, true, true, "Según el alcance"] },
  { label: "Panel de administración", values: [false, false, true, true] },
  { label: "Pagos en línea", values: [false, false, "QR", "Opcional"] },
  { label: "Usuarios y accesos por rol", values: [false, false, false, true] },
  { label: "Integraciones", values: [false, false, "Pago con QR", "1 incluida"] },
];

export const PAYMENT = [
  { pct: "50 %", when: "al iniciar" },
  { pct: "30 %", when: "al avance" },
  { pct: "20 %", when: "a la entrega" },
];

export const CATALOG_FAQ = [
  { q: "¿El precio es final?", a: "Es el precio de partida para lo que describe cada paquete. Después de conversar sobre tu proyecto te enviamos una proforma con el monto exacto, el alcance y el plazo por escrito." },
  { q: "¿Cómo funcionan los modelos?", a: "Elige el modelo que más te guste y lo adaptamos a tu marca con tus textos, fotos y colores. Puedes elegir un modelo de otro rubro: el diseño se ajusta a tu negocio." },
  { q: "¿Puedo agregar algo que no esté en el paquete?", a: "Sí. Puedes sumar funciones como pagos con tarjeta, más módulos, un panel para editar contenidos, un asistente de IA o automatizaciones. Lo que agregues queda detallado en la proforma antes de empezar." },
  { q: "¿Incluye dominio y hosting?", a: "Te ayudamos a registrarlos a nombre de tu empresa. Su costo va aparte y queda detallado en la proforma." },
  { q: "¿Hay pagos mensuales?", a: "El soporte mensual es opcional. Los costos de dominio, hosting y servicios externos los cobra cada proveedor. En la tienda en línea, las comisiones las cobra directamente el proveedor de pagos." },
  { q: "¿De qué dependen los plazos?", a: "Son estimados y dependen de la cantidad de contenido y de que recibamos a tiempo textos, fotos y aprobaciones. El plazo de tu proyecto queda escrito en la proforma." },
];

export const CATALOG_URL = "/catalogo/";
export const formatBs = (n: number) => `Bs ${String(n).replace(/\B(?=(\d{3})+$)/g, ".")}`;
