// Contenido de los servicios: tarjetas de la portada y páginas de detalle (/servicios/[slug]/).
// Regla del contenido: nada de cifras de resultados, clientes, precios ni plazos garantizados.
export type ServiceIcon = "apps" | "ai" | "automation" | "web";

export type Service = {
  slug: string;
  n: string;
  title: string;
  short: string;          // texto de la tarjeta en la portada
  icon: ServiceIcon;
  topic: string;          // tema que se marca en el formulario de contacto
  intro: string;
  problems: { pain: string; fix: string }[];       // lo que resolvemos
  builds: { t: string; d: string }[];              // qué construimos
  useCases: { sector: string; text: string }[];    // ejemplos por rubro
  steps: { title: string; text: string; out: string }[]; // cómo lo hacemos + entregable de la etapa
  tech: string[];
  deliverables: string[]; // qué recibes
  idealFor: string[];     // para quién es
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "desarrollo-de-aplicaciones",
    n: "01",
    title: "Desarrollo de aplicaciones",
    short: "Aplicaciones móviles y plataformas digitales diseñadas para resolver problemas reales.",
    icon: "apps",
    topic: "Aplicación",
    intro:
      "Diseñamos y desarrollamos aplicaciones para iOS, Android y la web pensadas desde el problema que resuelven: quién las usa, qué necesita hacer y cómo encajan en tu negocio. Empezamos por una primera versión con lo esencial y la hacemos crecer con datos reales.",
    problems: [
      { pain: "Tu servicio depende de llamadas y mensajes sueltos.", fix: "Tus clientes piden, pagan y siguen su pedido desde una app." },
      { pain: "Tienes la idea clara, pero no sabes por dónde empezar.", fix: "Validamos con un prototipo antes de invertir en el desarrollo completo." },
      { pain: "Tu equipo en terreno trabaja con papeles y fotos por chat.", fix: "Una app interna registra todo en el momento, con fotos, ubicación y firma." },
      { pain: "Dependes de plataformas de terceros que cobran comisión.", fix: "Tu propia plataforma, con tus reglas, tu marca y tus datos." },
    ],
    builds: [
      { t: "Apps móviles para iOS y Android", d: "Una sola base de código para las dos tiendas, con inicio de sesión, notificaciones, pagos y mapas cuando el proyecto lo necesita." },
      { t: "Plataformas web y paneles de administración", d: "Para gestionar usuarios, pedidos, contenidos y reportes desde el navegador." },
      { t: "Marketplaces", d: "Plataformas que conectan oferta y demanda, con perfiles, búsqueda, calificaciones y pagos. Así construimos Te Resuelvo, nuestro producto propio." },
      { t: "Apps internas para equipos", d: "Visitas, entregas, inspecciones u órdenes de trabajo registradas desde el celular, con evidencia y reporte automático." },
      { t: "Portales para clientes", d: "Tus clientes consultan su estado de cuenta, hacen pedidos y siguen sus solicitudes sin tener que escribirte." },
      { t: "Prototipos y primeras versiones (MVP)", d: "Lo esencial para probar la idea con usuarios reales antes de invertir en todo lo demás." },
    ],
    useCases: [
      { sector: "Salud", text: "App de reservas con agenda por profesional, historial de atenciones y recordatorios para pacientes." },
      { sector: "Comercio y distribución", text: "App de pedidos para clientes y vendedores, con catálogo, precios por cliente y seguimiento de entregas." },
      { sector: "Servicios técnicos", text: "Órdenes de trabajo en terreno con fotos, firma del cliente y reporte que se envía solo al terminar." },
      { sector: "Educación", text: "Plataforma de inscripciones, pagos, materiales y comunicación con estudiantes y padres." },
    ],
    steps: [
      { title: "Descubrimos", text: "Entendemos el problema, a los usuarios y lo que debe hacer la primera versión.", out: "Alcance y lista de funciones" },
      { title: "Diseñamos", text: "Flujos y pantallas en un prototipo navegable que pruebas antes de programar.", out: "Prototipo navegable" },
      { title: "Desarrollamos", text: "Construimos por etapas cortas; en cada una recibes una versión para probar.", out: "Versiones de prueba" },
      { title: "Publicamos", text: "Preparamos la ficha, las capturas y la revisión en App Store y Google Play, o la publicación web.", out: "App publicada" },
      { title: "Escalamos", text: "Medimos el uso, corregimos y sumamos funciones con datos reales.", out: "Plan de mejoras" },
    ],
    tech: ["React", "React Native", "Next.js", "Node.js", "Python", "PostgreSQL", "APIs", "Cloud"],
    deliverables: [
      "Prototipo navegable aprobado por ti",
      "Aplicación publicada en las tiendas o en la web",
      "Panel de administración cuando el proyecto lo necesita",
      "Código, cuentas de las tiendas y accesos a nombre de tu empresa",
      "Capacitación y manual de uso para tu equipo",
      "Soporte posterior con planes mensuales",
    ],
    idealFor: [
      "Emprendedores con una idea de producto digital",
      "Empresas que quieren digitalizar un servicio",
      "Negocios con equipos en terreno que registran en papel",
      "Empresas que necesitan una app para sus clientes",
    ],
    faq: [
      { q: "¿Cuánto cuesta una aplicación?", a: "Depende de las funciones, las integraciones y las plataformas. Después de un diagnóstico te enviamos una proforma con opciones; también podemos empezar por una primera versión para controlar la inversión." },
      { q: "¿Cuánto tiempo toma?", a: "Depende del alcance. Una primera versión con lo esencial se mide en semanas; el plazo estimado queda escrito en la proforma y lo revisamos contigo en cada entrega." },
      { q: "¿Necesito app para iOS y Android?", a: "Desarrollamos con una sola base de código para las dos plataformas. Si tus usuarios usan sobre todo una, podemos empezar por ella." },
      { q: "¿La aplicación será mía?", a: "Sí. El código, las cuentas de las tiendas y los accesos quedan a nombre de tu empresa." },
      { q: "¿Puede cobrar pagos en línea?", a: "Sí. Integramos pagos con QR, tarjeta o pasarelas de pago. Las comisiones las cobra directamente el proveedor de pagos." },
      { q: "¿Qué pasa después de publicarla?", a: "Ofrecemos planes de soporte mensual para corregir errores, mantenerla al día con las tiendas y sumar mejoras." },
    ],
  },
  {
    slug: "inteligencia-artificial",
    n: "02",
    title: "Inteligencia artificial",
    short: "Automatización inteligente para optimizar procesos, reducir costos y aumentar productividad.",
    icon: "ai",
    topic: "Inteligencia artificial",
    intro:
      "Incorporamos inteligencia artificial en los procesos de tu empresa para responder, analizar y decidir más rápido. En Bolivia casi todo empieza por WhatsApp, así que ahí suele estar la primera oportunidad: un asistente que atiende, vende y registra mientras tu equipo se ocupa de lo importante.",
    problems: [
      { pain: "Respondes las mismas preguntas todo el día.", fix: "Un asistente responde al instante con la información de tu negocio." },
      { pain: "Los mensajes de la noche y del fin de semana se enfrían.", fix: "Atención 24/7 que toma los datos y deja todo listo para tu equipo." },
      { pain: "Tus vendedores no saben a qué contactos dar prioridad.", fix: "La IA clasifica cada contacto según su interés y avisa a quien corresponde." },
      { pain: "Pierdes horas leyendo y copiando datos de documentos.", fix: "Extraemos los datos de facturas, contratos o formularios de forma automática." },
    ],
    builds: [
      { t: "Asistentes para WhatsApp y la web", d: "Responden consultas, muestran productos o servicios, toman pedidos o citas y pasan la conversación a una persona cuando hace falta." },
      { t: "Agentes que ejecutan tareas", d: "No solo conversan: agendan, registran en tu sistema, preparan cotizaciones y hacen seguimiento." },
      { t: "Calificación de prospectos", d: "Detectan qué contactos están listos para comprar y avisan a tu equipo de ventas." },
      { t: "Lectura de documentos", d: "Extraen datos de facturas, comprobantes, contratos o formularios y los cargan en tu sistema." },
      { t: "Reportes y resúmenes automáticos", d: "Convierten tus datos en resúmenes diarios o semanales, listos para decidir." },
      { t: "Asistentes internos", d: "Responden a tu equipo con tus manuales, políticas y procedimientos." },
    ],
    useCases: [
      { sector: "Salud", text: "Asistente que informa horarios y especialidades, agenda citas y envía recordatorios a los pacientes." },
      { sector: "Comercio", text: "Agente de ventas por WhatsApp que muestra el catálogo, toma el pedido y avisa al vendedor." },
      { sector: "Inmobiliarias", text: "Califica a los interesados por presupuesto y zona, y agenda visitas con el asesor." },
      { sector: "Cobranzas", text: "Recordatorios de pago personalizados y respuestas a consultas de saldo, con derivación a una persona." },
      { sector: "Educación", text: "Responde sobre inscripciones, costos y horarios, y registra a los interesados para darles seguimiento." },
    ],
    steps: [
      { title: "Identificamos", text: "Buscamos los procesos donde la IA aporta valor: mucho volumen, tareas repetidas o respuestas lentas.", out: "Mapa de oportunidades" },
      { title: "Diseñamos", text: "Definimos qué hace la IA, qué revisa una persona, con qué información trabaja y con qué tono habla.", out: "Guion y reglas del asistente" },
      { title: "Construimos", text: "Desarrollamos el asistente o agente y lo conectamos con WhatsApp, tu agenda o tu CRM.", out: "Asistente integrado" },
      { title: "Probamos", text: "Lo validamos con casos reales de tu negocio antes de abrirlo a tus clientes.", out: "Pruebas aprobadas" },
      { title: "Mejoramos", text: "Revisamos las conversaciones y lo seguimos afinando con el uso.", out: "Informe de uso" },
    ],
    tech: ["Modelos de lenguaje", "Agentes de IA", "API de WhatsApp Business", "Python", "Node.js", "APIs", "Cloud"],
    deliverables: [
      "Mapa de procesos con oportunidades de IA",
      "Asistente o agente funcionando e integrado",
      "Derivación a una persona cuando la IA no debe responder",
      "Panel para revisar conversaciones y resultados",
      "Capacitación para tu equipo",
      "Ajustes a partir del uso real",
    ],
    idealFor: [
      "Empresas que reciben muchas consultas repetidas",
      "Equipos de ventas que atienden por WhatsApp",
      "Equipos que pierden horas en análisis o carga de datos",
      "Negocios que quieren atender 24/7 sin perder el trato personal",
    ],
    faq: [
      { q: "¿La IA reemplaza a mi equipo?", a: "No. Se encarga de lo repetitivo y pasa a una persona los casos que lo necesitan. Tu equipo dedica su tiempo a vender y atender mejor." },
      { q: "¿Puede responder algo incorrecto?", a: "Trabaja solo con la información de tu negocio, con reglas sobre lo que no debe responder y con derivación a una persona. Revisamos las conversaciones para corregirla con el uso." },
      { q: "¿Funciona con mi número de WhatsApp?", a: "Trabajamos con la API oficial de WhatsApp Business, que requiere verificar la empresa con Meta. Revisamos contigo si conviene usar tu número actual o uno nuevo." },
      { q: "¿Tiene costos mensuales?", a: "Sí, además del desarrollo: los mensajes de WhatsApp los cobra Meta y el consumo de IA depende del proveedor y del volumen. Te los explicamos antes de empezar." },
      { q: "¿Qué pasa con los datos de mis clientes?", a: "Usamos accesos por rol, conexiones cifradas y la información se usa solo para tu servicio. Definimos contigo qué datos maneja el asistente." },
    ],
  },
  {
    slug: "automatizacion-empresarial",
    n: "03",
    title: "Automatización empresarial",
    short: "Conectamos herramientas y procesos para que las empresas trabajen de manera más eficiente.",
    icon: "automation",
    topic: "Automatización",
    intro:
      "Conectamos las herramientas que ya usas y eliminamos tareas manuales repetitivas para que la información fluya sola entre ventas, atención, operaciones y administración. Empezamos por el proceso que más tiempo te quita.",
    problems: [
      { pain: "Copias datos del WhatsApp al Excel a mano.", fix: "La información pasa sola de un sistema a otro." },
      { pain: "Los seguimientos dependen de la memoria de alguien.", fix: "Los recordatorios y mensajes salen solos en el momento justo." },
      { pain: "Armar el reporte semanal te toma medio día.", fix: "El reporte se genera y llega solo a tu correo o WhatsApp." },
      { pain: "Pedidos y aprobaciones internas se pierden en los chats.", fix: "Un flujo claro, con responsables, estados y alertas." },
    ],
    builds: [
      { t: "Ventas y seguimiento", d: "Cada contacto nuevo entra al CRM, se asigna a un vendedor y recibe seguimiento automático." },
      { t: "Agenda y reservas", d: "Citas que se agendan, confirman y recuerdan solas, sin cruces de horarios." },
      { t: "Cobranzas", d: "Recordatorios de pago por WhatsApp o correo según vencimientos, y registro de lo cobrado." },
      { t: "Integración de herramientas", d: "Conectamos WhatsApp, formularios, CRM, hojas de cálculo, correo y sistemas contables." },
      { t: "Operaciones internas", d: "Órdenes de trabajo, inventario, compras y aprobaciones con estados y responsables." },
      { t: "Reportes y alertas", d: "Indicadores que se calculan solos y avisos cuando algo necesita atención." },
    ],
    useCases: [
      { sector: "Comercio y distribución", text: "Pedido recibido → descuento de stock → factura → aviso de despacho al cliente, sin volver a escribir los datos." },
      { sector: "Servicios profesionales", text: "Formulario de contacto → propuesta → seguimiento → recordatorio si no hay respuesta." },
      { sector: "Gastronomía", text: "Pedidos por WhatsApp que llegan ordenados a cocina y se suman al reporte de ventas del día." },
      { sector: "Construcción e inmobiliarias", text: "Solicitudes de compra con aprobación, control de avance de obra y reportes para la gerencia." },
      { sector: "Recursos humanos", text: "Incorporación de personal, permisos y vacaciones con aprobaciones y registro automático." },
    ],
    steps: [
      { title: "Mapeamos", text: "Documentamos cómo se hace hoy el proceso, paso a paso y con quién.", out: "Diagrama del proceso actual" },
      { title: "Priorizamos", text: "Elegimos las tareas que más horas consumen o más errores generan.", out: "Lista priorizada" },
      { title: "Diseñamos", text: "Definimos el flujo automatizado, sus reglas y qué pasa cuando algo falla.", out: "Flujo y reglas" },
      { title: "Implementamos", text: "Conectamos tus sistemas y lo hacemos funcionar junto al proceso actual hasta validarlo.", out: "Automatización en marcha" },
      { title: "Monitoreamos", text: "Cada ejecución queda registrada y recibimos alertas si algo no sale como debe.", out: "Panel de seguimiento" },
    ],
    tech: ["APIs", "Webhooks", "n8n", "Node.js", "Python", "PostgreSQL", "Google Workspace", "Cloud"],
    deliverables: [
      "Diagrama del proceso actual y del proceso automatizado",
      "Automatizaciones funcionando y conectadas",
      "Registro de cada ejecución y alertas de error",
      "Documentación del flujo para tu equipo",
      "Capacitación a las personas que lo usan",
      "Soporte mensual opcional",
    ],
    idealFor: [
      "Empresas que coordinan su operación por WhatsApp y Excel",
      "Equipos que repiten las mismas tareas todos los días",
      "Negocios con cobranzas o seguimientos atrasados",
      "Empresas que quieren crecer sin sumar trabajo manual",
    ],
    faq: [
      { q: "¿Tengo que cambiar mis herramientas?", a: "No necesariamente. Primero conectamos las que ya usas; si alguna no lo permite, te proponemos una alternativa." },
      { q: "¿Por dónde conviene empezar?", a: "Por el proceso más repetitivo o con más errores. Suele dar resultados visibles pronto y ordena el camino para los siguientes." },
      { q: "¿Qué pasa si una automatización falla?", a: "Cada ejecución queda registrada y configuramos alertas para detectar el problema y corregirlo." },
      { q: "¿Es lo mismo que la inteligencia artificial?", a: "No. La automatización sigue reglas fijas: si pasa esto, haz aquello. La IA se suma cuando hay que entender textos, clasificar o decidir. Muchas soluciones combinan las dos." },
      { q: "¿Se puede conectar con mi sistema de facturación?", a: "Si tu sistema contable o de facturación permite conexión por API, sí. Lo revisamos en el diagnóstico." },
    ],
  },
  {
    slug: "desarrollo-web",
    n: "04",
    title: "Desarrollo web",
    short: "Experiencias digitales modernas, rápidas y diseñadas para convertir visitantes en clientes.",
    icon: "web",
    topic: "Desarrollo web",
    intro:
      "Creamos sitios y plataformas web modernas, rápidas y diseñadas para convertir visitantes en clientes. Cada página tiene un objetivo claro, se ve bien en el celular y está conectada a tu WhatsApp, tus formularios y tu medición.",
    problems: [
      { pain: "Tu negocio no aparece cuando te buscan en Google.", fix: "SEO técnico y una estructura pensada para que te encuentren." },
      { pain: "Recibes visitas, pero pocos contactos.", fix: "Mensajes claros, llamados a la acción y contacto directo por WhatsApp." },
      { pain: "Tu sitio es lento o se ve mal en el celular.", fix: "Diseño pensado primero para móvil y carga rápida." },
      { pain: "Dependes de alguien para cambiar un texto o un precio.", fix: "Un panel para editar contenidos y productos sin programar." },
    ],
    builds: [
      { t: "Sitios corporativos", d: "Presentan tu empresa, servicios y equipo, con formularios y contacto por WhatsApp." },
      { t: "Landing pages", d: "Páginas para campañas en Meta o Google, con un solo objetivo y medición de resultados." },
      { t: "Tiendas en línea", d: "Catálogo, carrito, pagos con QR o tarjeta, envíos y gestión de pedidos." },
      { t: "Portales para clientes y proveedores", d: "Acceso con usuario para pedidos, documentos o estado de cuenta." },
      { t: "Sistemas web a medida", d: "Reservas, cotizadores y herramientas de gestión que funcionan en el navegador." },
      { t: "SEO técnico y analítica", d: "Velocidad, estructura, Google Search Console, Analytics y píxeles para tus anuncios." },
    ],
    useCases: [
      { sector: "Empresas de servicios", text: "Sitio corporativo con cotizador en línea y contacto directo a WhatsApp." },
      { sector: "Comercio", text: "Tienda en línea con pagos por QR, control de inventario y aviso de pedidos al equipo." },
      { sector: "Profesionales y clínicas", text: "Página con reservas en línea y recordatorios para los pacientes o clientes." },
      { sector: "Constructoras e inmobiliarias", text: "Catálogo de proyectos con filtros, fotos y formulario de interés que llega al asesor." },
    ],
    steps: [
      { title: "Descubrimos", text: "Definimos objetivos, público y el contenido de cada página.", out: "Mapa del sitio" },
      { title: "Diseñamos", text: "Creamos la experiencia y la identidad visual para cada pantalla.", out: "Diseño aprobado" },
      { title: "Desarrollamos", text: "Construimos con tecnología moderna, rápida y segura.", out: "Sitio en revisión" },
      { title: "Publicamos", text: "Configuramos dominio, hosting, certificado SSL, SEO y analítica.", out: "Sitio en línea" },
      { title: "Mejoramos", text: "Medimos visitas y contactos para seguir optimizando.", out: "Informe de resultados" },
    ],
    tech: ["Next.js", "React", "Node.js", "PostgreSQL", "SEO técnico", "Google Analytics", "Cloud"],
    deliverables: [
      "Diseño adaptado a móvil, tablet y escritorio",
      "Sitio publicado en tu dominio con certificado SSL",
      "SEO técnico y analítica configurados",
      "Formularios y contacto conectados a WhatsApp o correo",
      "Panel para editar contenidos cuando lo necesitas",
      "Capacitación para actualizar tu sitio",
    ],
    idealFor: [
      "Empresas que necesitan una presencia digital profesional",
      "Negocios que quieren vender en línea",
      "Marcas que invierten en publicidad y necesitan convertir",
      "Proyectos que requieren un sistema web a medida",
    ],
    faq: [
      { q: "¿Incluye dominio y hosting?", a: "Te ayudamos a registrarlos a nombre de tu empresa. Su costo anual o mensual va aparte y queda detallado en la proforma." },
      { q: "¿Podré editar el contenido?", a: "Sí. Si lo necesitas, incluimos un panel para cambiar textos, imágenes, productos o publicaciones sin programar." },
      { q: "¿Mi sitio aparecerá en Google?", a: "Dejamos el SEO técnico listo: velocidad, estructura y registro en Search Console. El posicionamiento también depende del contenido y de la competencia, por eso no prometemos un puesto fijo." },
      { q: "¿Puedo cobrar en línea?", a: "Sí. Integramos pagos con QR, tarjeta o pasarelas de pago. Las comisiones las cobra directamente el proveedor." },
      { q: "¿Cuánto demora?", a: "Depende de la cantidad de páginas y funciones: una landing page toma menos que una tienda en línea. El plazo estimado queda escrito en la proforma." },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceHref = (slug: string) => `/servicios/${slug}/`;
