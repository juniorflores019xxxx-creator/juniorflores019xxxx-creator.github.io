// Formularios de datos para clientes (/datos-proyecto/?f=<id>). No aparecen en el menú ni en Google:
// SIBNOVA envía el enlace desde la bandeja (/admin/ → Formularios). Las respuestas llegan a la bandeja.
// Para crear un formulario nuevo: agrega una entrada en FORMS reutilizando los bloques de abajo.
// Nunca pedir contraseñas en un formulario: si hace falta un acceso, el cliente lo manda por WhatsApp privado.
// «note» es un aviso sin respuesta (con botón de WhatsApp si tiene «wa»). «when» muestra la pregunta solo si
// otra pregunta anterior tiene alguno de esos valores; si está oculta no se pide ni se guarda.
export type FieldType = "text" | "textarea" | "email" | "tel" | "url" | "date" | "select" | "multi" | "colors" | "file" | "note";
export type When = { field: string; in: string[] };
export type Field = { name: string; label: string; type: FieldType; required?: boolean; help?: string; placeholder?: string; options?: string[]; accept?: "imagenes" | "videos" | "documentos" | "todo"; max?: number; when?: When; wa?: string };
export type Section = { title: string; intro?: string; fields: Field[] };
export type DataForm = { id: string; title: string; short: string; intro: string; sections: Section[] };

/* ---------- Bloques reutilizables ---------- */
const CONTACTO: Section = {
  title: "Tus datos de contacto",
  fields: [
    { name: "nombre", label: "Nombre completo", type: "text", required: true, max: 120 },
    { name: "empresa", label: "Nombre de la empresa o marca", type: "text", required: true, max: 120 },
    { name: "telefono", label: "WhatsApp", type: "tel", required: true, placeholder: "+591 …", max: 20 },
    { name: "correo", label: "Correo electrónico", type: "email", required: true, max: 120 },
    { name: "cargo", label: "Tu cargo", type: "text", max: 80 },
  ],
};

const EMPRESA: Section = {
  title: "Tu empresa",
  fields: [
    { name: "razon_social", label: "Razón social", type: "text", max: 160 },
    { name: "nit", label: "NIT", type: "text", max: 20 },
    { name: "rubro", label: "¿A qué se dedica tu empresa?", type: "textarea", required: true, max: 1500, placeholder: "Qué haces, desde cuándo y qué te diferencia" },
    { name: "direccion", label: "Dirección", type: "text", max: 200 },
    { name: "ciudad", label: "Ciudad", type: "text", max: 60 },
    { name: "horarios", label: "Horarios de atención", type: "text", max: 200, placeholder: "Lunes a viernes de 8:00 a 18:00…" },
    { name: "telefonos", label: "Teléfonos y WhatsApp para mostrar", type: "text", max: 200 },
    { name: "correos", label: "Correos para mostrar", type: "text", max: 200 },
    { name: "publico", label: "¿Quiénes son tus clientes?", type: "textarea", max: 800 },
  ],
};

const REDES_ACTUALES: Field = { name: "redes_actuales", label: "Enlaces de tus redes sociales actuales", type: "textarea", max: 800, placeholder: "Facebook, Instagram, TikTok, LinkedIn…" };

const COLORES: Section = {
  title: "Colores y estilo",
  fields: [
    { name: "colores_origen", label: "¿Cómo definimos los colores?", type: "select", required: true, options: ["Los de mi logo actual", "Tengo colores definidos", "No tengo logo ni colores: que SIBNOVA me proponga", "Todavía no sé"] },
    { name: "colores", label: "Tus colores (hasta 3)", type: "colors", help: "Elige los que ya usas.", when: { field: "colores_origen", in: ["Los de mi logo actual", "Tengo colores definidos"] } },
    { name: "colores_texto", label: "Describe los colores o códigos que usas", type: "text", max: 200, placeholder: "Por ejemplo: azul marino y dorado, #0B2A5B", when: { field: "colores_origen", in: ["Los de mi logo actual", "Tengo colores definidos"] } },
    { name: "colores_gusto", label: "¿Algún color que te guste para tu marca?", type: "text", max: 200, placeholder: "Por ejemplo: verde y blanco", when: { field: "colores_origen", in: ["No tengo logo ni colores: que SIBNOVA me proponga", "Todavía no sé"] } },
    { name: "colores_evitar", label: "Colores que NO quieres", type: "text", max: 200 },
    { name: "estilo", label: "¿Cómo quieres que se sienta tu marca?", type: "multi", options: ["Moderna", "Elegante", "Seria y confiable", "Juvenil", "Divertida", "Minimalista", "Tecnológica", "Natural", "Lujosa"] },
    { name: "referencias", label: "Marcas o páginas que te gustan", type: "textarea", max: 800, placeholder: "Pega enlaces y cuéntanos qué te gusta de cada una" },
  ],
};

const ARCHIVOS_MARCA: Field = { name: "archivos_marca", label: "Logo actual y manual de marca", type: "file", accept: "todo", help: "Si los tienes, súbelos en la mejor calidad (PNG, PDF o SVG convertido a PDF)." };
const FOTOS: Field = { name: "fotos", label: "Fotos", type: "file", accept: "imagenes", help: "De tu local, equipo, productos o trabajos. Mejor si son horizontales y nítidas." };
const VIDEOS: Field = { name: "videos", label: "Videos cortos", type: "file", accept: "videos" };
const DOCUMENTOS: Field = { name: "documentos", label: "Documentos", type: "file", accept: "documentos", help: "Catálogo, lista de precios, presentación de la empresa, etc." };
const REF_LOGO: Field = { name: "referencias_logo", label: "Logos o diseños que te gustan", type: "file", accept: "imagenes", help: "Capturas o fotos de logos que te inspiran. Si no tienes, sáltalo." };
const PESADOS = "Si un archivo pesa mucho, usa «Enviar por WhatsApp» y vuelve a esta página: lo que ya escribiste se queda guardado.";
const DRIVE: Field = { name: "enlace_archivos", label: "Enlace a Google Drive o Dropbox", type: "text", help: "Para videos o carpetas que pesan mucho. Si los mandaste por WhatsApp, escríbelo aquí.", max: 500 };
const CIERRE: Section = {
  title: "Para terminar",
  fields: [
    { name: "fecha_deseada", label: "¿Para cuándo lo necesitas?", type: "date" },
    { name: "observaciones", label: "¿Algo más que debamos saber?", type: "textarea", max: 1500 },
  ],
};

/* ---------- Formularios ---------- */
export const FORMS: DataForm[] = [
  {
    id: "pagina-web",
    title: "Datos para tu página web",
    short: "Empresa, contacto, colores, textos, productos, fotos y diseño elegido.",
    intro: "Con esta información armamos tu página. Completa lo que tengas; lo que falte lo vemos juntos.",
    sections: [
      CONTACTO,
      EMPRESA,
      { ...COLORES, fields: [...COLORES.fields, { name: "diseno", label: "Diseño elegido del catálogo (de los 20)", type: "text", max: 80, placeholder: "Por ejemplo: 07 Glassmorphism" }] },
      {
        title: "Contenido de la página",
        fields: [
          { name: "paginas", label: "¿Qué páginas o secciones quieres?", type: "multi", options: ["Inicio", "Nosotros", "Servicios", "Productos", "Galería", "Preguntas frecuentes", "Contacto"] },
          { name: "servicios", label: "Tus servicios o productos (con precios si quieres mostrarlos)", type: "textarea", max: 3000 },
          { name: "textos", label: "Textos para la página", type: "textarea", max: 4000, help: "Historia, misión, por qué elegirte… Si no los tienes, escribe ideas y los ordenamos." },
          REDES_ACTUALES,
          { name: "dominio", label: "¿Tienes dominio?", type: "select", options: ["Sí, ya tengo", "No, quiero registrarlo", "No sé"] },
          { name: "dominio_nombre", label: "Dominio actual o el que te gustaría", type: "text", max: 100, placeholder: "miempresa.com.bo" },
        ],
      },
      { title: "Archivos", intro: "Logo, fotos, videos y documentos.", fields: [ARCHIVOS_MARCA, FOTOS, VIDEOS, DOCUMENTOS, DRIVE] },
      CIERRE,
    ],
  },
  {
    id: "catalogo-whatsapp",
    title: "Datos para tu catálogo con WhatsApp",
    short: "Lista de productos, categorías, precios y fotos de cada producto.",
    intro: "Con esta información cargamos tu catálogo de hasta 50 productos.",
    sections: [
      CONTACTO,
      {
        title: "Tus productos",
        fields: [
          { name: "categorias", label: "Categorías", type: "textarea", required: true, max: 1000, placeholder: "Una por línea" },
          { name: "productos", label: "Productos: nombre, precio y descripción corta", type: "textarea", max: 6000, help: "Uno por línea, o sube tu lista en Excel abajo." },
          { name: "whatsapp_pedidos", label: "Número de WhatsApp que recibe los pedidos", type: "tel", required: true, max: 20 },
        ],
      },
      { title: "Archivos", fields: [{ ...DOCUMENTOS, label: "Lista de productos (Excel o PDF)" }, { ...FOTOS, label: "Fotos de los productos", help: "Ponle a cada foto el nombre del producto." }, DRIVE] },
      CIERRE,
    ],
  },
  {
    id: "logo",
    title: "Datos para el diseño de tu logo",
    short: "Nombre, personalidad de la marca, colores, referencias y usos del logo.",
    intro: "Cuéntanos sobre tu marca para diseñar un logo que te represente.",
    sections: [
      CONTACTO,
      {
        title: "Tu marca",
        fields: [
          { name: "nombre_logo", label: "Nombre exacto como debe aparecer en el logo", type: "text", required: true, max: 80 },
          { name: "eslogan", label: "Eslogan (si tiene)", type: "text", max: 120 },
          { name: "historia", label: "¿Qué significa el nombre o cómo nació tu marca?", type: "textarea", max: 1000, help: "Nos da ideas para el logo. Si no tiene una historia, déjalo en blanco." },
          { name: "rubro", label: "¿A qué se dedica tu marca?", type: "textarea", required: true, max: 1500 },
          { name: "publico", label: "¿A quién le vendes?", type: "textarea", max: 800 },
          { name: "tipo_trabajo", label: "¿Qué necesitas?", type: "select", required: true, options: ["Logo nuevo", "Rediseñar mi logo actual"] },
          { name: "tipo_logo", label: "¿Qué tipo de logo te imaginas?", type: "select", options: ["Solo texto con el nombre", "Ícono más el nombre", "Solo un ícono", "No sé, que me propongan"] },
          { name: "ideas", label: "Ideas, símbolos o elementos que te gustaría", type: "textarea", max: 1500 },
          { name: "evitar", label: "Lo que NO quieres en tu logo", type: "textarea", max: 800 },
          { name: "usos", label: "¿Dónde vas a usar el logo?", type: "multi", options: ["Redes sociales", "Página web", "Letrero", "Uniformes", "Tarjetas", "Empaques", "Vehículos"] },
        ],
      },
      COLORES,
      { title: "Archivos", intro: PESADOS, fields: [REF_LOGO, { ...ARCHIVOS_MARCA, label: "Logo actual (si es rediseño)" }] },
      CIERRE,
    ],
  },
  {
    id: "redes-sociales",
    title: "Datos para tus redes sociales",
    short: "Redes a crear o administrar, datos del perfil, contenido, fotos y videos.",
    intro: "Con esta información creamos tus perfiles y preparamos el contenido. No escribas contraseñas: te explicamos cómo darnos acceso de forma segura.",
    sections: [
      CONTACTO,
      {
        title: "Tus redes",
        fields: [
          { name: "redes", label: "¿Qué redes quieres?", type: "multi", required: true, options: ["Facebook", "Instagram", "TikTok", "LinkedIn", "WhatsApp Business", "Perfil de Google (Maps)", "YouTube"] },
          { name: "objetivo", label: "¿Para qué quieres tus redes?", type: "multi", options: ["Vender más", "Recibir pedidos o consultas por WhatsApp", "Que más gente conozca mi marca", "Mostrar mis productos o trabajos", "Dar confianza a mis clientes"] },
          { name: "trabajo_redes", label: "¿Qué necesitas?", type: "select", required: true, options: ["Crear las redes desde cero", "Mejorar las que ya tengo", "Crear algunas y mejorar otras"] },
          { ...REDES_ACTUALES, when: { field: "trabajo_redes", in: ["Mejorar las que ya tengo", "Crear algunas y mejorar otras"] } },
          { name: "usuario_deseado", label: "Nombre de usuario que te gustaría", type: "text", max: 80, placeholder: "@miempresa", help: "Si no sabes, te proponemos uno." },
          { name: "quien_crea", label: "¿Quién crea las cuentas?", type: "select", required: true, options: ["Todavía no tengo cuentas: que SIBNOVA las cree por mí, con mi correo y mi número", "Las creo yo y les doy acceso a SIBNOVA", "Ya tengo las cuentas: solo les doy acceso"] },
          { name: "correo_cuentas", label: "Correo con el que se crearán las cuentas", type: "email", max: 120, help: "Las cuentas quedan a tu nombre." },
          { name: "telefono_cuentas", label: "Número con el que se crearán las cuentas", type: "tel", max: 20, placeholder: "+591 …", help: "A este número llegan los códigos de verificación. Puede ser tu mismo WhatsApp." },
          { name: "aviso_seguridad", label: "Tu seguridad primero", type: "note", help: "Nunca escribas contraseñas en este formulario. Creamos las cuentas a tu nombre, con tu correo y tu número, y al terminar te entregamos el control total. Tu información es confidencial: solo la usamos para tu proyecto, no la vendemos ni la usamos con fines de lucro.", when: { field: "quien_crea", in: ["Todavía no tengo cuentas: que SIBNOVA las cree por mí, con mi correo y mi número"] } },
          { name: "verificacion", label: "¿Cómo verificamos tu correo al crear las cuentas?", type: "select", required: true, options: ["Con una llamada corta: les dicto los códigos que me lleguen (recomendado)", "Les envío la contraseña de mi correo por WhatsApp privado"], when: { field: "quien_crea", in: ["Todavía no tengo cuentas: que SIBNOVA las cree por mí, con mi correo y mi número"] } },
          { name: "aviso_whatsapp", label: "Envíanos el acceso solo por WhatsApp privado", type: "note", help: "No la escribas aquí. Mándala solo al WhatsApp oficial de SIBNOVA con el botón de abajo y luego vuelve a esta página para seguir: lo que ya escribiste se queda guardado. La usamos solo para crear tus cuentas, no la guardamos en ningún sistema y al terminar te avisamos para que la cambies.", wa: "Hola SIBNOVA, por este chat privado les envío el acceso de mi correo para crear mis redes sociales. Avísenme al terminar para cambiar la contraseña.", when: { field: "verificacion", in: ["Les envío la contraseña de mi correo por WhatsApp privado"] } },
          { name: "autorizacion_cuentas", label: "Autorización", type: "multi", required: true, options: ["Autorizo a SIBNOVA a crear y configurar a mi nombre las cuentas indicadas, con mi correo y mi número, solo para este proyecto. Las cuentas son mías, SIBNOVA me entregará el control total al terminar y no usará mi información con fines de lucro."], when: { field: "quien_crea", in: ["Todavía no tengo cuentas: que SIBNOVA las cree por mí, con mi correo y mi número"] } },
        ],
      },
      {
        title: "Información del perfil",
        fields: [
          { name: "descripcion_perfil", label: "Descripción corta del negocio para la biografía", type: "textarea", max: 500, help: "Si prefieres, la escribimos nosotros con lo que nos cuentes." },
          { name: "ciudad", label: "Ciudad", type: "text", max: 60 },
          { name: "direccion", label: "Dirección", type: "text", max: 200, help: "Déjalo en blanco si no atiendes en un local." },
          { name: "horarios", label: "Horarios de atención", type: "text", max: 200 },
          { name: "telefonos", label: "Teléfonos y WhatsApp para mostrar", type: "text", max: 200 },
          { name: "web", label: "Página web (si tiene)", type: "url", max: 200 },
        ],
      },
      {
        title: "Contenido",
        fields: [
          { name: "servicios", label: "Productos o servicios que quieres mostrar", type: "textarea", required: true, max: 3000 },
          { name: "promociones", label: "Promociones u ofertas actuales", type: "textarea", max: 1500 },
          { name: "tono", label: "¿Cómo quieres hablarle a tus clientes?", type: "select", options: ["Cercano y amigable", "Profesional", "Divertido", "Elegante"] },
          { name: "frecuencia", label: "¿Cuántas publicaciones al mes te gustaría?", type: "select", options: ["Las que incluye mi paquete", "8 al mes (2 por semana)", "12 al mes (3 por semana)", "Lo que me recomienden"], help: "Antes de empezar te confirmamos cuántas incluye tu paquete." },
          { name: "precios", label: "¿Mostramos precios en tus publicaciones?", type: "select", options: ["Sí", "No", "Solo algunos", "Lo que me recomienden"] },
          { name: "responde", label: "¿Quién responderá los mensajes y comentarios?", type: "select", options: ["Yo o mi equipo", "Quiero que SIBNOVA me ayude (se cotiza aparte)", "Todavía no sé"] },
          { name: "publicidad", label: "¿Piensas invertir en publicidad pagada (Facebook, Instagram, TikTok)?", type: "select", options: ["Sí", "No por ahora", "Quiero que me asesoren"] },
          { name: "monto_publicidad", label: "¿Cuánto más o menos al mes?", type: "text", max: 80, placeholder: "Por ejemplo: Bs 300", when: { field: "publicidad", in: ["Sí"] } },
          { name: "temas", label: "Temas o mensajes importantes para publicar", type: "textarea", max: 1500 },
          { name: "competencia", label: "Cuentas que te gustan o de tu competencia", type: "textarea", max: 800 },
          { name: "imagenes_referencia", label: "¿Usamos imágenes de referencia de bancos libres para tus publicaciones?", type: "select", options: ["Sí, combínalas con mis fotos", "Sí, cuando no tenga fotos propias", "No, solo mis fotos"] },
          { name: "tipo_imagenes", label: "¿Qué imágenes de referencia te gustarían?", type: "textarea", max: 800, placeholder: "Por ejemplo: pan recién horneado, clientes felices, el local por dentro…" },
        ],
      },
      { title: "Archivos", intro: "Todo lo que podamos usar en tus publicaciones. " + PESADOS, fields: [ARCHIVOS_MARCA, FOTOS, VIDEOS, DRIVE] },
      CIERRE,
    ],
  },
  {
    id: "logo-redes",
    title: "Datos para tu logo y redes sociales",
    short: "Logo nuevo y creación de redes con su contenido, en un solo formulario.",
    intro: "Primero diseñamos tu logo y con él creamos tus redes sociales. Lo que no sepas, déjalo en blanco o elige «que me propongan». Tu información es confidencial: solo la usamos para tu proyecto, nunca con fines de lucro.",
    sections: [] as Section[], // se completa abajo combinando los formularios de logo y redes
  },
  {
    id: "aplicacion",
    title: "Datos para tu aplicación",
    short: "Usuarios, funciones, flujo de uso, ejemplos y material de la marca.",
    intro: "Con esta información preparamos el análisis y la propuesta de tu aplicación.",
    sections: [
      CONTACTO,
      EMPRESA,
      {
        title: "Tu aplicación",
        fields: [
          { name: "objetivo_app", label: "¿Qué problema resuelve la aplicación?", type: "textarea", required: true, max: 2000 },
          { name: "usuarios", label: "¿Quiénes la usarán?", type: "textarea", required: true, max: 1000, placeholder: "Clientes, vendedores, repartidores, administradores…" },
          { name: "funciones", label: "Funciones que necesita", type: "textarea", required: true, max: 3000, placeholder: "Una por línea, de la más importante a la menos importante" },
          { name: "flujo", label: "Cuéntanos paso a paso cómo se usaría", type: "textarea", max: 3000 },
          { name: "plataforma", label: "¿Dónde se usará?", type: "select", options: ["Android y iPhone", "Solo Android", "Web en el celular", "No sé"] },
          { name: "ejemplos", label: "Apps que se parecen a lo que quieres", type: "textarea", max: 1000 },
          { name: "integraciones", label: "Sistemas con los que debe conectarse", type: "textarea", max: 1000 },
        ],
      },
      { title: "Archivos", intro: "Logo, bocetos, pantallas o documentos del proyecto.", fields: [ARCHIVOS_MARCA, { ...FOTOS, label: "Bocetos o capturas de referencia" }, DOCUMENTOS, DRIVE] },
      CIERRE,
    ],
  },
  {
    id: "inteligencia-artificial",
    title: "Datos para tu asistente de IA",
    short: "Preguntas frecuentes, precios, horarios, documentos y casos que pasan a una persona.",
    intro: "Con esta información entrenamos al asistente para que responda con los datos reales de tu negocio.",
    sections: [
      CONTACTO,
      EMPRESA,
      {
        title: "Lo que debe saber el asistente",
        fields: [
          { name: "canal", label: "¿Dónde atenderá?", type: "multi", required: true, options: ["WhatsApp", "Página web", "Facebook / Instagram", "Uso interno del equipo"] },
          { name: "preguntas", label: "Preguntas frecuentes de tus clientes, con su respuesta", type: "textarea", required: true, max: 6000 },
          { name: "precios", label: "Precios, servicios y condiciones", type: "textarea", max: 4000 },
          { name: "tareas", label: "¿Qué debe hacer además de responder?", type: "multi", options: ["Tomar pedidos", "Agendar citas", "Registrar datos del cliente", "Enviar información", "Pasar el caso a una persona"] },
          { name: "derivar", label: "Casos que siempre deben pasar a una persona", type: "textarea", max: 1500 },
          { name: "tono", label: "¿Cómo debe hablar?", type: "select", options: ["Cercano y amigable", "Profesional", "Formal"] },
        ],
      },
      { title: "Archivos", fields: [{ ...DOCUMENTOS, label: "Documentos para el asistente (precios, manuales, catálogos)" }, DRIVE] },
      CIERRE,
    ],
  },
  {
    id: "automatizacion",
    title: "Datos para tu automatización",
    short: "Procesos paso a paso, herramientas, responsables y planillas de ejemplo.",
    intro: "Con esta información diseñamos el flujo que se hará solo.",
    sections: [
      CONTACTO,
      EMPRESA,
      {
        title: "Tus procesos",
        fields: [
          { name: "procesos", label: "¿Qué proceso quieres automatizar?", type: "textarea", required: true, max: 2000 },
          { name: "pasos", label: "¿Cómo se hace hoy, paso a paso?", type: "textarea", required: true, max: 4000 },
          { name: "herramientas", label: "Herramientas que usan", type: "multi", options: ["WhatsApp Business", "Excel o Google Sheets", "Correo", "Un CRM", "Sistema contable", "Formularios en línea", "Otro"] },
          { name: "responsables", label: "¿Quiénes participan y qué hace cada uno?", type: "textarea", max: 1500 },
          { name: "resultado", label: "¿Qué resultado esperas?", type: "textarea", max: 1500 },
        ],
      },
      { title: "Archivos", fields: [{ ...DOCUMENTOS, label: "Planillas o documentos de ejemplo" }, DRIVE] },
      CIERRE,
    ],
  },
];

// Logo + redes: une los dos formularios sin repetir el contacto ni el cierre
{
  const logo = FORMS.find((f) => f.id === "logo")!;
  const redes = FORMS.find((f) => f.id === "redes-sociales")!;
  const middle = (f: DataForm) => f.sections.filter((s) => s !== CONTACTO && s !== CIERRE && s.title !== "Archivos");
  FORMS.find((f) => f.id === "logo-redes")!.sections = [
    CONTACTO,
    ...middle(logo),
    ...middle(redes),
    { title: "Archivos", intro: "Logos que te gustan, tu logo actual (si existe), fotos y videos para tus publicaciones. " + PESADOS, fields: [REF_LOGO, { ...ARCHIVOS_MARCA, label: "Logo actual (si tienes)" }, FOTOS, VIDEOS, DRIVE] },
    CIERRE,
  ];
}

export const getForm = (id: string) => FORMS.find((f) => f.id === id);
export const FORM_URL = "/datos-proyecto/";
export const ACCEPT: Record<NonNullable<Field["accept"]>, string[]> = {
  imagenes: ["jpg", "jpeg", "png", "webp"],
  videos: ["mp4", "mov"],
  documentos: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
  todo: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "mp4", "mov"],
};
