import { SITE, WHATSAPP_URL } from "@/lib/site";

export type Entry = {
  t: string;            // título
  d: string;            // descripción corta
  type: "Servicio" | "Proyecto" | "Sección" | "Contacto" | "Acción";
  icon: "grid" | "spark" | "doc" | "wa" | "mail" | "phone" | "pin" | "send" | "user";
  k: string;            // palabras clave y sinónimos
  href?: string;        // sección de la página
  card?: string;        // título exacto de una tarjeta a resaltar
  url?: string;         // enlace externo (WhatsApp, correo, teléfono)
  prefill?: boolean;    // lleva al formulario con el texto escrito
  topic?: string;       // tema del formulario a marcar
};

export const INDEX: Entry[] = [
  // Diagnóstico
  { t: "Diagnóstico digital gratuito", d: "10 preguntas para saber qué digitalizar y automatizar primero", type: "Acción", icon: "doc", href: "/diagnostico/",
    k: "diagnostico diagnóstico test evaluacion evaluación formulario encuesta cuestionario gratis gratuito por donde empezar madurez digital analisis análisis" },

  // Servicios
  { t: "Desarrollo de aplicaciones", d: "Aplicaciones móviles y plataformas digitales", type: "Servicio", icon: "grid", href: "/servicios/desarrollo-de-aplicaciones/", topic: "Aplicación",
    k: "app aplicacion aplicaciones movil celular android ios iphone play store plataforma marketplace apk" },
  { t: "Inteligencia artificial", d: "Automatización inteligente para optimizar procesos y costos", type: "Servicio", icon: "spark", href: "/servicios/inteligencia-artificial/", topic: "Inteligencia artificial",
    k: "ia inteligencia artificial chatbot bot asistente agente agentes gpt chatgpt robot responder automaticamente analisis documentos" },
  { t: "Automatización empresarial", d: "Conectamos herramientas y procesos de tu empresa", type: "Servicio", icon: "grid", href: "/servicios/automatizacion-empresarial/", topic: "Automatización",
    k: "automatizar automatizacion automatico procesos ventas atencion cliente reservas reserva citas cita turnos agenda agendar whatsapp excel manual tareas repetitivas crm erp inventario stock" },
  { t: "Desarrollo web", d: "Sitios y plataformas web rápidas que convierten", type: "Servicio", icon: "grid", href: "/servicios/desarrollo-web/", topic: "Desarrollo web",
    k: "web pagina sitio website landing ecommerce tienda online virtual internet vender venta portal catalogo dominio" },
  // Secciones
  { t: "Cómo trabajamos", d: "Descubrimos, diseñamos, desarrollamos, automatizamos y escalamos", type: "Sección", icon: "doc", href: "#proceso",
    k: "proceso metodologia pasos etapas como trabajan trabajamos plazo tiempo" },
  { t: "Ecosistema tecnológico", d: "AI, cloud, APIs, mobile, web, datos y automatización conectados", type: "Sección", icon: "spark", href: "#ecosistema",
    k: "ecosistema tecnologia tecnologias api apis integracion integraciones integrar conectar cloud nube servidor hosting datos data dashboard reportes base mobile" },
  { t: "Te Resuelvo", d: "Nuestro producto: conecta personas con trabajadores y proveedores", type: "Proyecto", icon: "doc", href: "#proyectos",
    k: "te resuelvo proyecto proyectos producto productos portafolio portfolio casos trabajos marketplace servicios trabajadores" },
  { t: "Business AI", d: "Sistemas inteligentes para automatizar procesos empresariales", type: "Proyecto", icon: "spark", href: "#proyectos",
    k: "business ai empresa empresas negocio clinica restaurante tienda inmobiliaria cotizar cotizaciones automatizar ia agente" },
  { t: "Nosotros", d: "Equipo fundador de SIBNOVA en Santa Cruz de la Sierra", type: "Sección", icon: "user", href: "#nosotros",
    k: "nosotros quienes somos equipo fundadores fundador cofundador empresa sibnova junior herlan flores valeriano juan jose limon quiroz jose luis florero ceo gerente director desarrollador asesor gestion empresarial estratega comercial ventas inteligencia artificial" },
  // Contacto
  { t: "Escribir por WhatsApp", d: SITE.phoneDisplay, type: "Contacto", icon: "wa", url: WHATSAPP_URL,
    k: "whatsapp wsp wasap escribir mensaje chatear hablar contacto celular numero" },
  { t: "Llamar por teléfono", d: "76486765", type: "Contacto", icon: "phone", url: `tel:${SITE.phone}`,
    k: "telefono llamar llamada numero celular contacto" },
  { t: "Enviar un correo", d: SITE.email, type: "Contacto", icon: "mail", url: `mailto:${SITE.email}`,
    k: "correo email mail gmail escribir contacto" },
  { t: "Ubicación", d: SITE.city, type: "Contacto", icon: "pin", href: "#contacto",
    k: "ubicacion direccion donde estan oficina santa cruz bolivia ciudad" },
  { t: "Pedir una cotización", d: "Cuéntanos tu proyecto y te respondemos", type: "Contacto", icon: "send", href: "#contacto", prefill: true,
    k: "precio precios costo costos cuanto cuesta cotizacion cotizar presupuesto tarifa valor pagar" },
];

export const QUICK = ["Pedir una cotización", "Escribir por WhatsApp", "Inteligencia artificial", "Desarrollo de aplicaciones", "Te Resuelvo"];
export const SUGGESTIONS = ["Agendar citas por WhatsApp", "Una app para mi negocio", "Un chatbot con IA", "¿Cuánto cuesta?", "Vender por internet"];

const STOP = new Set("a al algo con como de del el en es esta este la las lo los me mi mis mas o para por que quiero necesito tengo se su sus un una uno unos y ya hacer hay sobre tu tus yo nos nuestro nuestra".split(" "));
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ");
const stem = (w: string) => (w.length > 4 ? w.replace(/(es|s)$/, "") : w);
export const words = (s: string) => norm(s).split(/\s+/).filter((w) => w && !STOP.has(w)).map(stem);

// ¿Distancia de edición ≤ 1? (incluye dos letras intercambiadas)
function near(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const d: number[] = [];
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d.push(i);
    if (d.length === 1) return true;
    if (d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]]) return true;
    return false;
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  for (let i = 0; i < l.length; i++) if (l.slice(0, i) + l.slice(i + 1) === s) return true;
  return false;
}

const prepared = INDEX.map((e) => ({ e, t: words(e.t), k: words(e.k), raw: ` ${norm(`${e.t} ${e.k}`)} ` }));

export function search(q: string): Entry[] {
  const qw = words(q);
  const raw = norm(q).trim().replace(/\s+/g, " ");
  if (!qw.length) return [];
  return prepared
    .map(({ e, t, k, raw: r }) => {
      let s = 0, hits = 0;
      for (const w of qw) {
        let best = 0;
        if (t.includes(w)) best = 6;
        else if (k.includes(w)) best = 4;
        else if (w.length >= 3 && (t.some((x) => x.startsWith(w)) || k.some((x) => x.startsWith(w)))) best = 2.5;
        else if (w.length >= 5 && (t.some((x) => near(x, w)) || k.some((x) => near(x, w)))) best = 2;
        if (best) hits++;
        s += best;
      }
      if (raw.length > 3 && r.includes(` ${raw} `)) s += 5;
      return { e, s: hits ? (s * hits) / qw.length : 0 };
    })
    .filter((r) => r.s > 1.5)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map((r) => r.e);
}
