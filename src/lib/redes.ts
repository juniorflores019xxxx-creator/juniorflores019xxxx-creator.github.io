// Catálogo de marketing digital y community manager (página /redes-sociales/). Los mismos precios están en el PDF
// public/catalogos/sibnova-servicios-redes-sociales.pdf y en la lista CATALOGOS del CRM (public/admin/index.php):
// si cambias un precio aquí, cámbialo también allá.
import { SITE } from "@/lib/site";

export const REDES_URL = "/redes-sociales/";
export const REDES_PDF = "/catalogos/sibnova-servicios-redes-sociales.pdf";
export const PROMO = { pct: 20, hasta: "31 de enero de 2027", meses: 3 };

export const PRECIO = {
  logo: 450, red: 200, estrategia: 250, manejo: 300, domingos: 300, post: 120, historia: 40, carrusel: 350,
  video: 550, videoCombo: 400, informe: 200, reunion: 150, publicidad: 600,
  // marketing (sin manejo de redes)
  plan: 1500, ads: 1200, maps: 700, campana: 2500, marca: 900, whatsapp: 450, comercial: 1800,
} as const;
type Pieza = keyof typeof PRECIO;

const promo = (n: number) => Math.floor((n * (100 - PROMO.pct)) / 100 / 10) * 10;
export const waLink = (texto: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;

export const BENEFICIOS = [
  { t: "Más gente conoce tu negocio", d: "Publicamos con constancia y en los horarios en que tus clientes miran sus redes, para que te encuentren y te recuerden." },
  { t: "Ningún cliente se queda sin respuesta", d: "Respondemos comentarios y mensajes rápido. Una consulta respondida a tiempo es una venta que no se va a la competencia." },
  { t: "Videos reales que generan confianza", d: "Grabamos en tu negocio: tu local, tu equipo y tus productos. La gente compra a quien ve de verdad, no a imágenes de internet." },
  { t: "Te ahorras tiempo", d: "No tienes que pensar qué publicar, diseñar ni editar. Tú atiendes tu negocio y nosotros nos encargamos de tus redes." },
  { t: "Imagen profesional y ordenada", d: "Todo con tu logo y tus colores, con textos bien escritos. Tu marca se ve seria y confiable en cada publicación." },
  { t: "Sabes qué funciona", d: "Cada mes te mostramos cuántas personas te vieron y te escribieron, y qué conviene mejorar. Sin palabras raras." },
];

// Paso 1: planes de contenido (lo hacemos nosotros; el cliente lo publica). Paso 2: gestión (lo publicamos y respondemos).
// Plan + gestión = lo mismo que costaban los combos de manejo de redes.
export type Combo = { slug: string; name: string; pitch: string; featured?: boolean; items: [Pieza, number][]; hacemos: string[]; regalos: string[]; normal: number; precio: number; form: string;
  gestion: { redes: string; items: [Pieza, number][]; normal: number; precio: number; detalle: string } };
type ComboIn = Omit<Combo, "normal" | "precio" | "gestion"> & { gestion: { redes: string; items: [Pieza, number][]; detalle: string } };
const suma = (items: [Pieza, number][]) => items.reduce((t, [k, q]) => t + PRECIO[k] * q, 0);
const combo = (c: ComboIn): Combo => {
  const normal = suma(c.items), gNormal = suma(c.gestion.items);
  return { ...c, normal, precio: promo(normal), gestion: { ...c.gestion, normal: gNormal, precio: promo(gNormal) } };
};

export const COMBOS: Combo[] = [
  combo({
    slug: "esencial", name: "Plan Esencial", form: "combo-esencial", pitch: "Para empezar a tener presencia con videos de tu negocio.",
    items: [["estrategia", 1], ["post", 5], ["videoCombo", 2], ["informe", 1]],
    hacemos: ["2 videos grabados en tu negocio, con guion y edición", "5 publicaciones con imagen y texto", "Plan y calendario del mes: qué publicar y qué día", "Informe de resultados a fin de mes"],
    regalos: ["Fotos de la sesión de grabación", "Mejora de tu perfil: descripción, horario y botón de WhatsApp"],
    gestion: { redes: "Facebook e Instagram", items: [["manejo", 2]], detalle: "Publicamos y respondemos en Facebook e Instagram de lunes a sábado" },
  }),
  combo({
    slug: "profesional", name: "Plan Profesional", form: "combo-profesional", featured: true, pitch: "Para crecer con un video cada semana y más consultas.",
    items: [["estrategia", 1], ["post", 8], ["historia", 8], ["videoCombo", 4], ["informe", 1], ["reunion", 1]],
    hacemos: ["4 videos grabados en tu negocio (1 por semana)", "8 publicaciones con imagen y texto", "8 historias de 24 horas", "Plan y calendario del mes: qué publicar y qué día", "Informe de resultados y reunión mensual"],
    regalos: ["Fotos de la sesión de grabación", "Mejora de tus perfiles", "Respuestas listas para las preguntas que más te hacen"],
    gestion: { redes: "Facebook, Instagram y TikTok", items: [["manejo", 3]], detalle: "Publicamos y respondemos en Facebook, Instagram y TikTok de lunes a sábado" },
  }),
  combo({
    slug: "premium", name: "Plan Premium", form: "combo-premium", pitch: "Para liderar tu rubro y llegar a más clientes con publicidad.",
    items: [["estrategia", 1], ["post", 12], ["historia", 12], ["videoCombo", 8], ["publicidad", 1], ["informe", 1], ["reunion", 1]],
    hacemos: ["8 videos grabados en tu negocio (2 días de grabación)", "12 publicaciones con imagen y texto", "12 historias de 24 horas", "Manejo de publicidad pagada (lo que pagas a Facebook o TikTok va aparte)", "Plan y calendario del mes: qué publicar y qué día", "Informe de resultados y reunión mensual"],
    regalos: ["Fotos de las sesiones de grabación", "Mejora de tus perfiles", "Respuestas listas para las preguntas que más te hacen", "Portada especial para fechas importantes (aniversario, Navidad…)"],
    gestion: { redes: "Facebook, Instagram y TikTok", items: [["manejo", 3], ["domingos", 1]], detalle: "Publicamos y respondemos en Facebook, Instagram y TikTok, también domingos y feriados" },
  }),
];

// Paso 3: más clientes nuevos (publicidad pagada + Google Maps), cada mes
export const MAS_CLIENTES = (() => {
  const normal = PRECIO.ads + PRECIO.maps;
  return { normal, precio: promo(normal), form: "combo-visibilidad",
    hacemos: ["Publicidad pagada en Facebook, Instagram, TikTok o Google: 3 anuncios, a quién mostrarlos y ajustes cada semana", "Google Maps y búsquedas: tu ficha de Google con fotos, horario, reseñas y publicaciones", "Informe: cuántos te vieron, cuántos te escribieron y cuánto costó cada cliente"] };
})();

// Diseño gráfico y creación de cuentas (pago único, costo aparte de los planes)
export const INICIO = { precio: PRECIO.logo + 3 * PRECIO.red };
export const DISENO: { t: string; d: string; precio: number | null; unidad: string }[] = [
  { t: "Logo de tu empresa", d: "3 propuestas para elegir y 2 rondas de ajustes. Recibes tu logo para imprimir y para internet, más tu foto de perfil, tu portada y tu ícono para redes.", precio: PRECIO.logo, unidad: "pago único" },
  { t: "Página de Facebook, Instagram o TikTok", d: "La creamos con tu correo y tu número, y subimos tu foto de perfil, tu portada, tu descripción y tus datos de contacto.", precio: PRECIO.red, unidad: "por red" },
  { t: "WhatsApp Business", d: "Tu WhatsApp de empresa con catálogo de productos, respuestas automáticas y mensajes de difusión.", precio: PRECIO.whatsapp, unidad: "pago único" },
  { t: "Manual de marca", d: "Colores, letras, cómo usar tu logo y 5 plantillas editables para redes.", precio: PRECIO.marca, unidad: "pago único" },
  { t: "Otros diseños", d: "Tarjetas, letreros, banners, volantes, menús o etiquetas.", precio: null, unidad: "según el trabajo" },
];

// Proyectos de marketing de una sola vez
export type ComboMk = { slug: string; name: string; pitch: string; items: [Pieza, number][]; hacemos: string[]; normal: number; precio: number; nota?: string; form: string };
const comboMk = (c: Omit<ComboMk, "normal" | "precio"> & { desc: number }): ComboMk => {
  const normal = suma(c.items);
  const { desc, ...rest } = c;
  return { ...rest, normal, precio: Math.floor((normal * (100 - desc)) / 100 / 10) * 10 };
};
export const COMBOS_MK: ComboMk[] = [
  comboMk({ slug: "despegue", name: "Combo Despegue", form: "combo-despegue", desc: 10, pitch: "Ordena tu marca y tu estrategia antes de invertir en publicidad.",
    items: [["plan", 1], ["marca", 1], ["whatsapp", 1]],
    hacemos: ["Plan de marketing: estudiamos tu negocio, tu competencia y a tus clientes, y te decimos qué hacer los próximos 3 meses", "Manual de marca con 5 plantillas para redes", "WhatsApp Business listo con catálogo y respuestas automáticas"] }),
  comboMk({ slug: "lanzamiento", name: "Combo Lanzamiento", form: "combo-lanzamiento", desc: 15, pitch: "Para lanzar un producto, una apertura o una promoción con fuerza.",
    items: [["plan", 1], ["campana", 1], ["comercial", 1], ["maps", 1]],
    hacemos: ["Plan de marketing de la campaña", "Campaña de un mes: idea, 6 imágenes, 2 historias, 1 carrusel, 2 reels y anuncios configurados", "1 video publicitario de 30 a 60 segundos", "Google Maps y búsquedas durante el mes, e informe final"],
    nota: "Lo que pagas a Facebook, TikTok o Google por los anuncios va aparte." }),
];

export const SUELTOS: { grupo: string; items: { t: string; d: string; precio: number | null; unidad: string }[] }[] = [
  { grupo: "Marketing", items: [
    { t: "Plan de marketing", d: "Estudiamos tu negocio, tu competencia y a tus clientes, y te entregamos qué hacer los próximos 3 meses.", precio: PRECIO.plan, unidad: "pago único" },
    { t: "Publicidad pagada", d: "Creamos y vigilamos tus anuncios en Facebook, Instagram, TikTok o Google. Lo que pagas por los anuncios va aparte.", precio: PRECIO.ads, unidad: "por mes" },
    { t: "Google Maps y búsquedas", d: "Que tu negocio aparezca en Google y en el mapa, con fotos, horario, reseñas y publicaciones.", precio: PRECIO.maps, unidad: "por mes" },
    { t: "Campaña de lanzamiento", d: "Un mes para lanzar un producto o promoción: idea, piezas, 2 reels y anuncios configurados.", precio: PRECIO.campana, unidad: "por campaña" },
    { t: "Video publicitario", d: "Comercial de 30 a 60 segundos con guion, grabación en tu negocio y edición.", precio: PRECIO.comercial, unidad: "cada uno" },
  ] },
  { grupo: "Contenido y redes (cada mes)", items: [
    { t: "Plan y calendario del mes", d: "Decidimos qué publicar según tu negocio y te lo mostramos para que lo apruebes.", precio: PRECIO.estrategia, unidad: "por mes" },
    { t: "Gestión de una red social", d: "Publicamos en los mejores horarios y respondemos comentarios y mensajes de lunes a sábado.", precio: PRECIO.manejo, unidad: "por red, por mes" },
    { t: "Publicación con imagen y texto", d: "Imagen con tu marca y texto con etiquetas (#) e invitación a escribirte.", precio: PRECIO.post, unidad: "cada una" },
    { t: "Historia de 24 horas", d: "Imagen vertical para promociones, avisos o preguntas. Se ve un día y desaparece.", precio: PRECIO.historia, unidad: "cada una" },
    { t: "Carrusel (5 a 7 imágenes)", d: "Varias imágenes que se pasan con el dedo, para explicar un servicio o mostrar productos.", precio: PRECIO.carrusel, unidad: "cada uno" },
    { t: "Video corto grabado en tu negocio", d: "Guion, grabación en tu negocio y edición con música, textos y tu logo. Incluye fotos de la sesión. Dentro de un plan te sale a Bs 400.", precio: PRECIO.video, unidad: "cada uno" },
    { t: "Manejo de publicidad pagada", d: "Creamos y vigilamos tus anuncios para que lleguen a las personas correctas. Lo que pagas a Facebook o TikTok va aparte.", precio: PRECIO.publicidad, unidad: "por mes" },
    { t: "Atención domingos y feriados", d: "Respondemos también los fines de semana y feriados.", precio: PRECIO.domingos, unidad: "por mes" },
    { t: "Informe de resultados", d: "Los números de tus redes explicados en palabras simples.", precio: PRECIO.informe, unidad: "por mes" },
    { t: "Reunión mensual", d: "30 minutos, presencial o por videollamada, para revisar resultados y planificar.", precio: PRECIO.reunion, unidad: "por mes" },
    { t: "Toma con dron", d: "Fotos o video desde el aire de tu local, terreno, obra o evento.", precio: null, unidad: "según la toma" },
  ] },
];

export const PASOS = [
  { t: "Conversamos", d: "15 minutos sobre tu negocio, tus clientes y lo que quieres lograr." },
  { t: "Eliges", d: "Tu plan, quién publica y si quieres publicidad. Te enviamos un formulario corto con las preguntas de lo que elegiste." },
  { t: "Apruebas", d: "Te mostramos el calendario y los guiones del mes, y agendamos la grabación." },
  { t: "Arrancamos", d: "Te entregamos el contenido o lo publicamos por ti, y a fin de mes recibes tu informe de resultados." },
];

export const CONDICIONES = [
  `Promoción del ${PROMO.pct} % en los planes, la gestión y la publicidad para quienes contraten hasta el ${PROMO.hasta}. Dura los ${PROMO.meses} primeros meses; desde el cuarto mes rige el precio normal.`,
  "Los planes se pagan mes a mes, por adelantado. Puedes sumar la gestión, la publicidad o servicios extra cuando quieras.",
  "Si publicas tú, te entregamos todo listo con su calendario. Los resultados dependen de que publiques en las fechas indicadas.",
  "Los planes usan tu logo actual. Crear o cambiar tu logo, crear tus redes, el manual de marca y los diseños para imprimir se cobran aparte, una sola vez.",
  "La grabación se agenda con anticipación según el calendario del mes.",
  "Lo que pagas a Facebook o TikTok por la publicidad pagada no está incluido.",
  "Tus cuentas quedan a tu nombre. Nunca pedimos contraseñas por formularios ni por internet.",
  "Precios en bolivianos. Si necesitas factura, consúltanos.",
];
