// Modelos de ejemplo del catálogo: 4 rubros × 4 paquetes = 16 sitios navegables en /modelos/.
// Todos los negocios, precios y datos son ficticios; el cliente elige un modelo y se adapta a su marca.
export type PlanId = "presencia" | "empresa" | "tienda" | "a-medida";
export type RubroId = "restaurante" | "salud" | "construccion" | "comercio";

export type Rubro = {
  id: RubroId;
  n: number;
  label: string;
  brand: string;
  tagline: string;
  lead: string;
  about: string;
  values: string[];
  services: { t: string; d: string }[];
  productsLabel: string;
  products: { n: string; d: string; p: number }[];
  faq: { q: string; a: string }[];
  app: {
    module: string;
    item: string;           // singular de lo que se registra
    cols: string[];
    rows: string[][];
    kpis: { l: string; v: string }[];
    report: { l: string; v: number }[];
    fields: string[];
  };
};

export const RUBROS: Rubro[] = [
  {
    id: "restaurante", n: 1, label: "Restaurante", brand: "Brasa y Leña",
    tagline: "Parrilla y cocina cruceña",
    lead: "Cortes a la brasa, platos de la casa y un lugar para compartir en familia.",
    about: "Somos un restaurante familiar que cocina a la leña con ingredientes de la región. Cada plato sale de nuestra cocina como en casa.",
    values: ["Cocina a la leña", "Ingredientes frescos", "Atención familiar"],
    services: [
      { t: "Almuerzos", d: "Menú del día con sopa, segundo y refresco." },
      { t: "Parrilladas", d: "Cortes a la brasa para compartir en la mesa." },
      { t: "Eventos", d: "Cumpleaños y reuniones con menú a elección." },
      { t: "Delivery", d: "Pide por WhatsApp y recibe en tu casa." },
    ],
    productsLabel: "Menú",
    products: [
      { n: "Parrillada para dos", d: "Cortes mixtos con yuca y ensalada", p: 120 },
      { n: "Pique macho", d: "Clásico para compartir", p: 75 },
      { n: "Majadito de charque", d: "Con huevo y plátano frito", p: 45 },
      { n: "Costilla a la brasa", d: "Con arroz y yuca", p: 65 },
      { n: "Sopa de maní", d: "Receta de la casa", p: 25 },
      { n: "Limonada frozen", d: "Jarra de un litro", p: 30 },
    ],
    faq: [
      { q: "¿Hacen delivery?", a: "Sí, recibimos pedidos por WhatsApp dentro de la ciudad." },
      { q: "¿Se puede reservar mesa?", a: "Sí, escríbenos con el día, la hora y la cantidad de personas." },
      { q: "¿Atienden eventos?", a: "Sí, armamos menús para grupos y reuniones." },
    ],
    app: {
      module: "Pedidos", item: "pedido",
      cols: ["Pedido", "Cliente", "Estado", "Total"],
      rows: [["#1024", "Mesa 4", "En cocina", "Bs 240"], ["#1025", "Delivery · Ana", "En camino", "Bs 120"], ["#1026", "Mesa 2", "Servido", "Bs 95"], ["#1027", "Delivery · Luis", "En cocina", "Bs 150"], ["#1028", "Mesa 7", "Pagado", "Bs 310"]],
      kpis: [{ l: "Pedidos de hoy", v: "48" }, { l: "En cocina", v: "6" }, { l: "Ventas de hoy", v: "Bs 4.260" }],
      report: [{ l: "Lun", v: 52 }, { l: "Mar", v: 61 }, { l: "Mié", v: 48 }, { l: "Jue", v: 74 }, { l: "Vie", v: 96 }],
      fields: ["Cliente o mesa", "Plato", "Observaciones"],
    },
  },
  {
    id: "salud", n: 2, label: "Clínica y salud", brand: "Alba Salud",
    tagline: "Centro médico familiar",
    lead: "Atención cercana para toda la familia, con citas simples y especialistas en un solo lugar.",
    about: "Somos un centro médico enfocado en la atención cercana. Reunimos varias especialidades para que tu familia se atienda en un solo lugar.",
    values: ["Trato cercano", "Varias especialidades", "Citas organizadas"],
    services: [
      { t: "Medicina general", d: "Consultas para adultos y control de rutina." },
      { t: "Pediatría", d: "Controles y atención para los más pequeños." },
      { t: "Odontología", d: "Limpieza, curaciones y ortodoncia." },
      { t: "Laboratorio", d: "Análisis clínicos con resultados en línea." },
    ],
    productsLabel: "Farmacia",
    products: [
      { n: "Tensiómetro digital", d: "Para control en casa", p: 280 },
      { n: "Termómetro infrarrojo", d: "Lectura sin contacto", p: 160 },
      { n: "Vitamina C", d: "Frasco de 60 cápsulas", p: 75 },
      { n: "Botiquín familiar", d: "Kit de primeros auxilios", p: 190 },
      { n: "Alcohol en gel", d: "Presentación de 500 ml", p: 28 },
      { n: "Mascarillas", d: "Caja de 50 unidades", p: 45 },
    ],
    faq: [
      { q: "¿Cómo reservo una cita?", a: "Escríbenos por WhatsApp con la especialidad y el horario que prefieres." },
      { q: "¿Atienden sábados?", a: "Sí, atendemos los sábados por la mañana." },
      { q: "¿Cómo recibo mis resultados?", a: "Te los enviamos por WhatsApp o correo cuando estén listos." },
    ],
    app: {
      module: "Agenda", item: "cita",
      cols: ["Hora", "Paciente", "Especialidad", "Estado"],
      rows: [["08:30", "María R.", "Pediatría", "Confirmada"], ["09:00", "Jorge P.", "Medicina general", "En consulta"], ["09:30", "Lucía T.", "Odontología", "Confirmada"], ["10:00", "Carlos M.", "Laboratorio", "Pendiente"], ["10:30", "Ana V.", "Pediatría", "Confirmada"]],
      kpis: [{ l: "Citas de hoy", v: "32" }, { l: "Por confirmar", v: "5" }, { l: "Especialistas", v: "8" }],
      report: [{ l: "Lun", v: 70 }, { l: "Mar", v: 64 }, { l: "Mié", v: 82 }, { l: "Jue", v: 58 }, { l: "Vie", v: 90 }],
      fields: ["Paciente", "Especialidad", "Fecha y hora"],
    },
  },
  {
    id: "construccion", n: 3, label: "Construcción", brand: "Cimiento Norte",
    tagline: "Constructora y obras civiles",
    lead: "Construimos casas, edificios y locales con planificación clara de principio a fin.",
    about: "Somos una constructora que acompaña cada proyecto desde el diseño hasta la entrega, con avances claros en cada etapa.",
    values: ["Planificación clara", "Avances por etapa", "Equipo propio"],
    services: [
      { t: "Construcción", d: "Casas, edificios y locales comerciales." },
      { t: "Refacciones", d: "Ampliaciones y mejoras de espacios." },
      { t: "Diseño y planos", d: "Proyectos de arquitectura e ingeniería." },
      { t: "Supervisión", d: "Control de obra y de avance." },
    ],
    productsLabel: "Materiales",
    products: [
      { n: "Cemento", d: "Bolsa de 50 kg", p: 62 },
      { n: "Fierro corrugado", d: "Barra de 12 mm", p: 85 },
      { n: "Ladrillo de 6 huecos", d: "Paquete de 100 piezas", p: 180 },
      { n: "Pintura látex", d: "Balde de 18 litros", p: 420 },
      { n: "Cerámica de piso", d: "Caja de 2 m²", p: 145 },
      { n: "Malla electrosoldada", d: "Panel de 2 × 3 m", p: 230 },
    ],
    faq: [
      { q: "¿Trabajan en toda la ciudad?", a: "Sí, y revisamos proyectos en otras ciudades según su tamaño." },
      { q: "¿Hacen planos?", a: "Sí, podemos encargarnos del diseño y de la obra." },
      { q: "¿Cómo pido una cotización?", a: "Cuéntanos del proyecto por WhatsApp y coordinamos una visita." },
    ],
    app: {
      module: "Obras", item: "obra",
      cols: ["Obra", "Cliente", "Avance", "Estado"],
      rows: [["Casa Equipetrol", "Familia R.", "75 %", "En obra"], ["Local Av. Banzer", "Comercial S.", "40 %", "En obra"], ["Edificio Norte", "Inversiones K.", "15 %", "Fundación"], ["Refacción Urubó", "Familia M.", "90 %", "Acabados"], ["Galpón Parque Ind.", "Logística T.", "5 %", "Inicio"]],
      kpis: [{ l: "Obras activas", v: "12" }, { l: "Cotizaciones", v: "7" }, { l: "Entregas del mes", v: "3" }],
      report: [{ l: "Jun", v: 40 }, { l: "Jul", v: 55 }, { l: "Ago", v: 62 }, { l: "Sep", v: 78 }, { l: "Oct", v: 88 }],
      fields: ["Nombre de la obra", "Cliente", "Fecha de inicio"],
    },
  },
  {
    id: "comercio", n: 4, label: "Comercio y moda", brand: "Casa Lila",
    tagline: "Ropa y accesorios",
    lead: "Prendas para todos los días, seleccionadas con cariño y listas para llevar.",
    about: "Somos una tienda de ropa y accesorios. Elegimos cada colección pensando en prendas cómodas, actuales y fáciles de combinar.",
    values: ["Nuevas colecciones", "Envíos a todo el país", "Atención por WhatsApp"],
    services: [
      { t: "Mujer", d: "Vestidos, blusas y prendas de temporada." },
      { t: "Hombre", d: "Camisas, poleras y básicos." },
      { t: "Accesorios", d: "Bolsos, cinturones y complementos." },
      { t: "Mayoristas", d: "Precios especiales por cantidad." },
    ],
    productsLabel: "Colección",
    products: [
      { n: "Vestido Lino", d: "Tallas S a L", p: 240 },
      { n: "Blusa Aurora", d: "Tres colores", p: 130 },
      { n: "Jean clásico", d: "Corte recto", p: 220 },
      { n: "Bolso Tote", d: "Cuero sintético", p: 180 },
      { n: "Polera básica", d: "Algodón peinado", p: 85 },
      { n: "Sandalias Sol", d: "Tallas 35 a 40", p: 195 },
    ],
    faq: [
      { q: "¿Hacen envíos?", a: "Sí, enviamos a todo el país por transportadora." },
      { q: "¿Puedo cambiar una prenda?", a: "Sí, coordinamos el cambio por WhatsApp según disponibilidad." },
      { q: "¿Venden por mayor?", a: "Sí, escríbenos para conocer los precios por cantidad." },
    ],
    app: {
      module: "Inventario", item: "producto",
      cols: ["Producto", "Sucursal", "Stock", "Estado"],
      rows: [["Vestido Lino", "Centro", "24", "Disponible"], ["Blusa Aurora", "Centro", "6", "Stock bajo"], ["Jean clásico", "Norte", "31", "Disponible"], ["Bolso Tote", "Norte", "0", "Agotado"], ["Polera básica", "Centro", "58", "Disponible"]],
      kpis: [{ l: "Productos", v: "320" }, { l: "Stock bajo", v: "14" }, { l: "Ventas de hoy", v: "Bs 3.180" }],
      report: [{ l: "Lun", v: 45 }, { l: "Mar", v: 52 }, { l: "Mié", v: 60 }, { l: "Jue", v: 57 }, { l: "Vie", v: 84 }],
      fields: ["Producto", "Sucursal", "Cantidad"],
    },
  },
];

export const PLANS: { id: PlanId; letter: string; label: string; pages: { slug: string; label: string }[] }[] = [
  { id: "presencia", letter: "P", label: "Presencia", pages: [{ slug: "", label: "Inicio" }] },
  { id: "empresa", letter: "E", label: "Empresa", pages: [
    { slug: "", label: "Inicio" }, { slug: "nosotros", label: "Nosotros" }, { slug: "servicios", label: "Servicios" },
    { slug: "galeria", label: "Galería" }, { slug: "preguntas", label: "Preguntas" }, { slug: "contacto", label: "Contacto" },
  ] },
  { id: "tienda", letter: "T", label: "Tienda", pages: [
    { slug: "", label: "Inicio" }, { slug: "catalogo", label: "Catálogo" }, { slug: "producto", label: "Producto" },
    { slug: "carrito", label: "Carrito" }, { slug: "pago", label: "Pago" }, { slug: "contacto", label: "Contacto" },
  ] },
  { id: "a-medida", letter: "M", label: "A medida", pages: [
    { slug: "", label: "Panel" }, { slug: "registros", label: "Registros" }, { slug: "nuevo", label: "Nuevo" },
    { slug: "reportes", label: "Reportes" }, { slug: "usuarios", label: "Usuarios" }, { slug: "ajustes", label: "Ajustes" },
  ] },
];

export type Model = { slug: string; code: string; plan: (typeof PLANS)[number]; rubro: Rubro };

export const MODELS: Model[] = PLANS.flatMap((plan) =>
  RUBROS.map((rubro) => ({ slug: `${plan.id}-${rubro.id}`, code: `${plan.letter}${rubro.n}`, plan, rubro }))
);

export const getModel = (slug: string) => MODELS.find((m) => m.slug === slug);
export const modelHref = (m: Model, page = "") => `/modelos/${m.slug}/${page ? `${page}/` : ""}`;
export const modelsOf = (plan: PlanId) => MODELS.filter((m) => m.plan.id === plan);
export const pagesLabel = (m: Model) =>
  m.plan.pages.length === 1 ? "1 página" : `${m.plan.pages.length} ${m.plan.id === "a-medida" ? "pantallas" : "páginas"}`;
export const chooseText = (m: Model) =>
  `Hola SIBNOVA, elegí el modelo ${m.code} (${m.plan.label}, ${m.rubro.label.toLowerCase()}) del catálogo de páginas web.`;
