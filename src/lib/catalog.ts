// Catálogo de páginas web (/catalogo/). Es el único lugar del sitio con precios públicos:
// el catálogo, el formulario de solicitud y el servidor (/api/catalogo.json) leen todo de aquí.
export type WebPlan = {
  slug: string;           // ancla para compartir y valor del formulario: /catalogo/#empresa
  n: string;
  name: string;
  kind: string;           // qué es, en palabras simples
  price: number;          // precio en Bs
  from?: boolean;         // se muestra «Desde»
  quote?: boolean;        // el precio final requiere cotización
  weeks: string;          // plazo estimado
  pitch: string;
  idealFor: string;
  includes: string[];
  excludes: string;
  featured?: boolean;
};

export const WEB_PLANS: WebPlan[] = [
  {
    slug: "presencia",
    n: "01",
    name: "Presencia",
    kind: "Página de presentación",
    price: 1500,
    weeks: "Hasta 2 semanas",
    pitch: "Tu negocio en internet con una página clara y lista para recibir contactos.",
    idealFor: "Emprendedores y pequeños negocios.",
    includes: [
      "Página web de una sola página, hasta 5 secciones",
      "Uno de los 20 estilos, con tus colores y logotipo",
      "Diseño adaptado a celular, tablet y computadora",
      "Contacto por WhatsApp y formulario básico",
      "SEO técnico básico",
      "1 ronda de modificaciones",
      "Corrección de errores durante 15 días",
    ],
    excludes: "Tú entregas los textos, imágenes y logotipo. No incluye funciones personalizadas ni cambios de estructura después de aprobar el diseño.",
  },
  {
    slug: "empresa",
    n: "02",
    name: "Empresa",
    kind: "Sitio corporativo",
    price: 4990,
    weeks: "2 a 3 semanas",
    pitch: "Un sitio completo que presenta tu empresa y convierte visitas en contactos.",
    idealFor: "Empresas de servicios, clínicas, constructoras y estudios.",
    includes: [
      "Hasta 5 páginas",
      "Uno de los 20 estilos, adaptado a tu identidad visual",
      "Diseño adaptado a todos los dispositivos",
      "Formularios de contacto y WhatsApp",
      "SEO técnico básico",
      "Search Console y Analytics, si nos das acceso",
      "2 rondas de modificaciones y capacitación básica",
      "Corrección de errores durante 30 días",
    ],
    excludes: "No incluye panel para editar (CMS), blog, traducciones, integraciones ni sistemas personalizados: se cotizan aparte.",
    featured: true,
  },
  {
    slug: "a-medida",
    n: "03",
    name: "A medida",
    kind: "Desarrollo personalizado",
    price: 16000,
    from: true,
    quote: true,
    weeks: "Según el alcance",
    pitch: "Sistemas y aplicaciones web pensados para cómo trabaja tu empresa.",
    idealFor: "Empresas que necesitan reservas, pedidos, gestión interna o automatización.",
    includes: [
      "Sistemas de reservas o de pedidos",
      "Sistemas administrativos y aplicaciones web",
      "Automatizaciones e integraciones",
      "Plataformas personalizadas",
      "Diagnóstico y propuesta según los módulos que necesites",
    ],
    excludes: "El precio final depende del alcance y requiere cotización.",
  },
];

// Extra del paquete Empresa: se entrega hoy con la tecnología actual.
export const WHATSAPP_CATALOG = {
  slug: "catalogo-whatsapp",
  name: "Catálogo digital con WhatsApp",
  price: 2390,
  pitch: "Muestra tus productos y recibe los pedidos directo en tu WhatsApp.",
  includes: ["Hasta 50 productos", "Categorías", "Imágenes, precios y descripciones", "Botón de pedido o consulta por WhatsApp en cada producto"],
  excludes: "No incluye carrito de compras, pagos en línea, inventario ni administración automática: se cotizan aparte.",
};

// Tiendas en línea: precios de referencia. Se presentan como lanzamiento próximo y bajo
// cotización hasta tener la base técnica probada; no se anuncian pagos en línea ni integraciones.
export type StorePlan = { slug: string; name: string; price: number; from?: boolean; products: string; includes: string[]; featured?: boolean };

export const STORE_PLANS: StorePlan[] = [
  {
    slug: "tienda-basica",
    name: "Tienda Básica",
    price: 9900,
    products: "Hasta 100 productos",
    includes: ["Catálogo de hasta 100 productos", "Categorías", "Página de producto con imágenes y descripciones", "Carrito de compras y proceso de pedidos", "Panel para gestionar productos y precios", "Gestión básica de pedidos", "Capacitación"],
  },
  {
    slug: "tienda-profesional",
    name: "Tienda Profesional",
    price: 14900,
    products: "Hasta 500 productos",
    includes: ["Todo lo de la Tienda Básica", "Hasta 500 productos", "Categorías y subcategorías", "Búsqueda y filtros", "Gestión de pedidos", "Gestión básica de stock", "Capacitación"],
    featured: true,
  },
  {
    slug: "tienda-empresarial",
    name: "Tienda Empresarial",
    price: 19900,
    from: true,
    products: "Más de 500 productos",
    includes: ["Desarrollo personalizado según la cantidad de productos", "Inventario e integraciones según tu negocio", "Automatizaciones a medida", "Cotización personalizada"],
  },
];

export const PRODUCT_RANGES = ["Hasta 100 productos", "Hasta 500 productos", "Más de 500 productos"] as const;

// Servicios adicionales con precio fijo. El panel editable (CMS) no se publica hasta tenerlo probado.
export const ADDONS = [
  { t: "Página adicional", price: 490, unit: "" },
  { t: "Ronda de modificaciones adicional", price: 490, unit: "" },
  { t: "50 productos adicionales", price: 490, unit: "" },
  { t: "Soporte básico", price: 350, unit: "al mes" },
];

// Programa de Clientes Fundadores. Sin contadores: 10 cupos y fecha límite reales.
export const FOUNDERS = {
  slots: 10,
  deadline: "31 de enero de 2027",
  appliesTo: "Presencia y Empresa",
  benefits: [
    { t: "Configuración de dominio y hosting", d: "Te ayudamos a configurarlos sin cobrar honorarios de gestión. Tú contratas y pagas directamente al proveedor, y las cuentas y el dominio quedan a tu nombre." },
    { t: "Página adicional", d: "Si contratas el paquete Empresa, te regalamos una página más: hasta 6 páginas." },
    { t: "Cambio de estilo", d: "Puedes cambiar a otro de los 20 estilos una vez, dentro de los 7 días desde la presentación inicial y antes de cargar el contenido definitivo." },
    { t: "Soporte básico gratis", d: "1 mes con Presencia y 2 meses con Empresa, desde la entrega. Incluye hasta 2 horas al mes de cambios menores (textos, imágenes o precios) y corrección de errores. No incluye nuevas páginas, funciones ni cambios grandes. Después, el soporte cuesta Bs 350 al mes." },
    { t: "Referidos", d: "Por cada cliente que nos recomiendes y que contrate y pague un servicio, recibes un mes de soporte básico gratis. Hasta 3 meses acumulados, además del soporte de fundador." },
  ],
};

export const COMPARE: { label: string; values: (boolean | string)[] }[] = [
  { label: "Páginas", values: ["1 (hasta 5 secciones)", "Hasta 5", "Según el alcance"] },
  { label: "Elegir entre 20 estilos", values: [true, true, "Diseño propio"] },
  { label: "Adaptada a celular", values: [true, true, true] },
  { label: "WhatsApp y formulario", values: [true, true, true] },
  { label: "SEO técnico básico", values: [true, true, "Según el alcance"] },
  { label: "Search Console y Analytics", values: [false, true, "Según el alcance"] },
  { label: "Catálogo con WhatsApp", values: [false, "+ Bs 2.390", "Según el alcance"] },
  { label: "Rondas de modificaciones", values: ["1", "2", "Según el alcance"] },
  { label: "Corrección de errores", values: ["15 días", "30 días", "Según el alcance"] },
];

export const PAYMENT = [
  { pct: "50 %", when: "al iniciar" },
  { pct: "30 %", when: "al avance" },
  { pct: "20 %", when: "a la entrega" },
];

// Cuatro conceptos distintos que el cliente elige por separado.
export const CONCEPTS = [
  { t: "Estilo visual", d: "Cómo se ve tu web: colores, tipografía y composición. Elige uno de los 20 diseños; no cambia el precio." },
  { t: "Tipo de página", d: "Qué es: página de presentación, sitio de empresa, tienda en línea o sistema a medida." },
  { t: "Paquete", d: "Qué incluye y cuánto cuesta: Presencia, Empresa, una tienda o A medida." },
  { t: "Adicionales", d: "Lo que sumas: catálogo con WhatsApp, páginas o productos extra y soporte mensual." },
];

// Sitios reales diseñados por SIBNOVA. Capturas en public/trabajos/; solo datos confirmados.
export const WORKS: { name: string; kind: string; text: string; points: string[]; shot: string; href: string }[] = [
  {
    name: "E.F.O. Ltda.",
    kind: "Sitio corporativo · Empresa de energía",
    text: "Web de una empresa boliviana de combustibles, energía y electromovilidad, pensada para que empresas, instituciones y particulares pidan una cotización.",
    points: ["8 páginas, incluida la política de privacidad", "Formulario que envía la consulta por WhatsApp", "Diseño adaptado a celular"],
    shot: "efo-inicio",
    href: "https://efo.com.bo/",
  },
  {
    name: "Te Resuelvo",
    kind: "Página de presentación · Producto propio de SIBNOVA",
    text: "Web de nuestra app para pedir técnicos en Santa Cruz. Explica cómo funcionará y recibe pre-registros de clientes y técnicos.",
    points: ["Portada con video y 11 servicios", "Pre-registro de clientes y técnicos por WhatsApp", "Términos y política de privacidad"],
    shot: "te-resuelvo-inicio",
    href: "https://juniorflores019xxxx-creator.github.io/te-resuelvo-app/",
  },
];

export const CATALOG_FAQ = [
  { q: "¿El precio es final?", a: "Es el precio del alcance que describe cada paquete. Antes de empezar te enviamos una proforma con el monto, el alcance y el plazo por escrito." },
  { q: "¿El diseño que elijo cambia el precio?", a: "No. El estilo visual es la apariencia de tu web y se puede usar con cualquier paquete. El precio depende del paquete y de los adicionales que pidas." },
  { q: "¿De quién son el dominio y el hosting?", a: "Tuyos. Se registran a tu nombre y los pagas directamente al proveedor. Nosotros te ayudamos a configurarlos." },
  { q: "¿Qué es una ronda de modificaciones?", a: "Una sola lista con todos los cambios que quieres, enviada de una vez. Cada ronda adicional cuesta Bs 490." },
  { q: "¿Cuándo estarán las tiendas online?", a: "Estamos preparando las tiendas. Puedes reservar la tuya desde el formulario y te enviamos una cotización y el plazo de entrega." },
  { q: "¿De qué dependen los plazos?", a: "Son estimados y empiezan cuando recibimos todo el contenido: textos, fotos y logotipo. El plazo de tu proyecto queda escrito en la proforma." },
];

export const CATALOG_URL = "/catalogo/";
export const formatBs = (n: number) => `Bs ${String(n).replace(/\B(?=(\d{3})+$)/g, ".")}`;
export const priceLabel = (p: { price: number; from?: boolean }) => `${p.from ? "Desde " : ""}${formatBs(p.price)}`;

// Opciones del formulario de solicitud: cada paquete y tienda con su precio de referencia.
export const REQUEST_PACKAGES = [
  ...WEB_PLANS.map((p) => ({ id: p.slug, name: p.name, kind: p.kind, price: p.price, from: !!p.from, store: false })),
  ...STORE_PLANS.map((s) => ({ id: s.slug, name: s.name, kind: s.products, price: s.price, from: !!s.from, store: true })),
];
