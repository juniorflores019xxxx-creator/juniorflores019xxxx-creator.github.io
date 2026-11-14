// Catálogo de redes sociales (página /redes-sociales/). Los mismos precios están en el PDF
// public/catalogos/sibnova-servicios-redes-sociales.pdf y en la lista CATALOGOS del CRM (public/admin/index.php):
// si cambias un precio aquí, cámbialo también allá.
import { SITE } from "@/lib/site";

export const REDES_URL = "/redes-sociales/";
export const REDES_PDF = "/catalogos/sibnova-servicios-redes-sociales.pdf";
export const PROMO = { pct: 20, hasta: "31 de enero de 2027", meses: 3 };

export const PRECIO = {
  logo: 2400, red: 300, estrategia: 250, manejo: 300, domingos: 300, post: 120, historia: 40, carrusel: 350,
  video: 400, informe: 200, reunion: 150, publicidad: 600,
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

export type Combo = { slug: string; name: string; pitch: string; featured?: boolean; items: [Pieza, number][]; hacemos: string[]; regalos: string[]; normal: number; precio: number; form: string };
const combo = (c: Omit<Combo, "normal" | "precio">): Combo => {
  const normal = c.items.reduce((s, [k, q]) => s + PRECIO[k] * q, 0);
  return { ...c, normal, precio: promo(normal) };
};

export const COMBOS: Combo[] = [
  combo({
    slug: "esencial", name: "Combo Esencial", form: "combo-esencial", pitch: "Para empezar a tener presencia con videos de tu negocio.",
    items: [["estrategia", 1], ["manejo", 2], ["post", 5], ["video", 2], ["informe", 1]],
    hacemos: ["2 videos grabados en tu negocio, con guion y edición", "5 publicaciones con imagen y texto", "Manejo de Facebook e Instagram: publicamos y respondemos de lunes a sábado", "Plan y calendario del mes para que lo apruebes", "Informe de resultados a fin de mes"],
    regalos: ["Fotos de la sesión de grabación", "Mejora de tu perfil: descripción, horario y botón de WhatsApp"],
  }),
  combo({
    slug: "profesional", name: "Combo Profesional", form: "combo-profesional", featured: true, pitch: "Para crecer con un video cada semana y más consultas.",
    items: [["estrategia", 1], ["manejo", 3], ["post", 8], ["historia", 8], ["video", 4], ["informe", 1], ["reunion", 1]],
    hacemos: ["4 videos grabados en tu negocio (1 por semana)", "8 publicaciones con imagen y texto", "8 historias de 24 horas", "Manejo de Facebook, Instagram y TikTok: publicamos y respondemos de lunes a sábado", "Plan y calendario del mes para que lo apruebes", "Informe de resultados y reunión mensual"],
    regalos: ["Fotos de la sesión de grabación", "Mejora de tus perfiles", "Respuestas listas para las preguntas que más te hacen"],
  }),
  combo({
    slug: "premium", name: "Combo Premium", form: "combo-premium", pitch: "Para liderar tu rubro y llegar a más clientes con publicidad.",
    items: [["estrategia", 1], ["manejo", 3], ["domingos", 1], ["post", 12], ["historia", 12], ["video", 8], ["publicidad", 1], ["informe", 1], ["reunion", 1]],
    hacemos: ["8 videos grabados en tu negocio (2 días de grabación)", "12 publicaciones con imagen y texto", "12 historias de 24 horas", "Manejo de Facebook, Instagram y TikTok, también domingos y feriados", "Manejo de publicidad pagada (lo que pagas a Facebook o TikTok va aparte)", "Plan y calendario del mes para que lo apruebes", "Informe de resultados y reunión mensual"],
    regalos: ["Fotos de las sesiones de grabación", "Mejora de tus perfiles", "Respuestas listas para las preguntas que más te hacen", "Portada especial para fechas importantes (aniversario, Navidad…)"],
  }),
];

export const INICIO = { normal: PRECIO.logo + 3 * PRECIO.red, precio: promo(PRECIO.logo + 3 * PRECIO.red) };

export const SUELTOS: { grupo: string; items: { t: string; d: string; precio: number | null; unidad: string }[] }[] = [
  { grupo: "Para empezar (pago único)", items: [
    { t: "Logo de tu empresa", d: "Varias propuestas para elegir y 2 rondas de ajustes. Recibes el logo para imprimir y para internet, más tu foto de perfil, portada e ícono.", precio: PRECIO.logo, unidad: "pago único" },
    { t: "Creación de una red social", d: "Abrimos tu página en Facebook, Instagram o TikTok con tu correo y tu número, la verificamos y la dejamos completa con tus datos.", precio: PRECIO.red, unidad: "por red" },
  ] },
  { grupo: "Contenido y atención (cada mes)", items: [
    { t: "Plan y calendario del mes", d: "Decidimos qué publicar según tu negocio y te lo mostramos para que lo apruebes.", precio: PRECIO.estrategia, unidad: "por mes" },
    { t: "Manejo de una red social", d: "Publicamos en los mejores horarios y respondemos comentarios y mensajes de lunes a sábado.", precio: PRECIO.manejo, unidad: "por red, por mes" },
    { t: "Publicación con imagen y texto", d: "Imagen con tu marca y texto con etiquetas (#) e invitación a escribirte.", precio: PRECIO.post, unidad: "cada una" },
    { t: "Historia de 24 horas", d: "Imagen vertical para promociones, avisos o preguntas. Se ve un día y desaparece.", precio: PRECIO.historia, unidad: "cada una" },
    { t: "Carrusel (5 a 7 imágenes)", d: "Varias imágenes que se pasan con el dedo, para explicar un servicio o mostrar productos.", precio: PRECIO.carrusel, unidad: "cada uno" },
    { t: "Video corto grabado en tu negocio", d: "Guion, grabación en tu negocio y edición con música, textos y tu logo. Incluye fotos de la sesión.", precio: PRECIO.video, unidad: "cada uno" },
    { t: "Manejo de publicidad pagada", d: "Creamos y vigilamos tus anuncios para que lleguen a las personas correctas. Lo que pagas a Facebook o TikTok va aparte.", precio: PRECIO.publicidad, unidad: "por mes" },
    { t: "Atención domingos y feriados", d: "Respondemos también los fines de semana y feriados.", precio: PRECIO.domingos, unidad: "por mes" },
    { t: "Informe de resultados", d: "Los números de tus redes explicados en palabras simples.", precio: PRECIO.informe, unidad: "por mes" },
    { t: "Reunión mensual", d: "30 minutos, presencial o por videollamada, para revisar resultados y planificar.", precio: PRECIO.reunion, unidad: "por mes" },
    { t: "Toma con dron", d: "Fotos o video desde el aire de tu local, terreno, obra o evento.", precio: null, unidad: "según la toma" },
  ] },
];

export const PASOS = [
  { t: "Conversamos", d: "15 minutos sobre tu negocio, tus clientes y lo que quieres lograr." },
  { t: "Eliges", d: "Un combo o servicios sueltos. Te enviamos un formulario corto con las preguntas de lo que elegiste." },
  { t: "Apruebas", d: "Te mostramos el calendario y los guiones del mes, y agendamos la grabación." },
  { t: "Publicamos", d: "Tus redes se activan y a fin de mes recibes tu informe de resultados." },
];

export const CONDICIONES = [
  `Promoción del ${PROMO.pct} % para quienes contraten hasta el ${PROMO.hasta}. Dura los ${PROMO.meses} primeros meses; desde el cuarto mes rige el precio normal.`,
  "Los combos se pagan mes a mes, por adelantado. Puedes sumar servicios extra cuando quieras.",
  "La grabación se agenda con anticipación según el calendario del mes.",
  "Lo que pagas a Facebook o TikTok por la publicidad pagada no está incluido.",
  "Tus cuentas quedan a tu nombre. Nunca pedimos contraseñas por formularios ni por internet.",
  "Precios en bolivianos. Si necesitas factura, consúltanos.",
];
