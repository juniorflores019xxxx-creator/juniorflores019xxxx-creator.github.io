// Catálogo de diseños web: 20 estilos visuales con una demo cada uno (/catalogo/disenos/<slug>/).
// El estilo es solo la apariencia: no cambia el precio. El precio sale del paquete (src/lib/catalog.ts).
// Los negocios de las demos son ficticios. Fotos de Unsplash (licencia libre) en public/disenos/fotos/.
export const CATEGORIES = [
  "Empresarial", "Inmobiliaria", "Restaurante", "Clínica y consultorio", "Tienda online", "Landing page",
  "Portafolio", "Hotel y turismo", "Construcción", "Tecnología", "Servicios profesionales",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type HeroLayout = "split" | "full" | "center" | "editorial" | "bento" | "poster";
export type BodyLayout = "grid" | "bento" | "list" | "zigzag";

export type Design = {
  n: string;
  slug: string;
  name: string;
  short: string;
  traits: string[];
  categories: Category[];
  hero: HeroLayout;
  body: BodyLayout;
  demo: {
    brand: string;
    kind: string;
    nav: string[];
    kicker: string;
    title: string;
    text: string;
    cta: string;
    cta2: string;
    features: { t: string; d: string }[];
    aboutTitle: string;
    about: string;
    points: string[];
    photos: string[];      // claves de public/disenos/fotos/<clave>.webp; la primera es la portada
    band: string;
  };
};

export const DESIGNS: Design[] = [
  {
    n: "01", slug: "minimalista", name: "Minimalista",
    short: "Mucho espacio en blanco, tipografía limpia y solo lo esencial. Transmite orden y seguridad.",
    traits: ["Blanco y negro", "Tipografía fina", "Pocas secciones"],
    categories: ["Empresarial", "Construcción", "Servicios profesionales", "Portafolio"],
    hero: "split", body: "list",
    demo: {
      brand: "Línea Blanca", kind: "Estudio de arquitectura", nav: ["Proyectos", "Estudio", "Servicios", "Contacto"],
      kicker: "Arquitectura e interiores", title: "Espacios simples para vivir mejor.",
      text: "Diseñamos casas y oficinas con luz natural, materiales nobles y nada que sobre.",
      cta: "Ver proyectos", cta2: "Agendar visita",
      features: [
        { t: "Arquitectura", d: "Viviendas y oficinas desde el primer boceto hasta la obra." },
        { t: "Interiores", d: "Mobiliario y luz pensados para cada ambiente." },
        { t: "Remodelación", d: "Renovamos espacios existentes sin perder su carácter." },
      ],
      aboutTitle: "Menos, pero mejor.", about: "Cada proyecto empieza escuchando cómo vives o trabajas. Después quitamos todo lo que no hace falta.",
      points: ["Planos y renders", "Dirección de obra", "Selección de materiales"],
      photos: ["edificio-blanco", "interior-minimo", "sillon-amarillo", "cocina-blanca"],
      band: "¿Tienes un terreno o un espacio para renovar?",
    },
  },
  {
    n: "02", slug: "moderno", name: "Moderno",
    short: "Colores vivos, bordes redondeados y bloques claros. Se siente actual y cercano.",
    traits: ["Color de acento fuerte", "Tarjetas redondeadas", "Lectura rápida"],
    categories: ["Tecnología", "Empresarial", "Servicios profesionales", "Landing page"],
    hero: "split", body: "grid",
    demo: {
      brand: "Nodo Digital", kind: "Agencia de marketing digital", nav: ["Servicios", "Método", "Equipo", "Contacto"],
      kicker: "Marketing digital", title: "Haz que tu marca se vea y se venda.",
      text: "Campañas en redes, contenido y anuncios con objetivos claros y reportes cada semana.",
      cta: "Pedir propuesta", cta2: "Ver servicios",
      features: [
        { t: "Redes sociales", d: "Calendario de contenido, diseño y publicación." },
        { t: "Anuncios", d: "Campañas en Meta y Google con presupuesto controlado." },
        { t: "Reportes", d: "Un resumen semanal de lo que funcionó y lo que no." },
      ],
      aboutTitle: "Un equipo que trabaja contigo", about: "Planificamos juntos, publicamos rápido y ajustamos con datos.",
      points: ["Estrategia mensual", "Diseño de piezas", "Atención por WhatsApp"],
      photos: ["equipo-trabajo", "escritorio-codigo", "reunion", "cowork"],
      band: "Empieza este mes con una campaña de prueba.",
    },
  },
  {
    n: "03", slug: "corporativo", name: "Corporativo",
    short: "Sobrio, ordenado y confiable. Pensado para empresas que necesitan transmitir solidez.",
    traits: ["Azul institucional", "Estructura clásica", "Datos y servicios claros"],
    categories: ["Empresarial", "Servicios profesionales", "Construcción"],
    hero: "full", body: "grid",
    demo: {
      brand: "Andes Consultores", kind: "Consultora contable y legal", nav: ["Nosotros", "Servicios", "Sectores", "Contacto"],
      kicker: "Asesoría empresarial", title: "Tu empresa en orden, para que crezca tranquila.",
      text: "Contabilidad, impuestos y asesoría legal para empresas en Bolivia, con un solo equipo.",
      cta: "Solicitar reunión", cta2: "Conocer servicios",
      features: [
        { t: "Contabilidad", d: "Registros, estados financieros y reportes mensuales." },
        { t: "Impuestos", d: "Declaraciones al día y planificación tributaria." },
        { t: "Legal", d: "Constitución de empresas, contratos y trámites." },
      ],
      aboutTitle: "Asesoría con responsables claros", about: "Cada cliente tiene un responsable asignado y un calendario de entregas.",
      points: ["Reuniones mensuales", "Reportes por escrito", "Confidencialidad"],
      photos: ["torres", "presentacion", "oficina-festejo", "oficina-pasillo"],
      band: "Agenda una reunión de diagnóstico.",
    },
  },
  {
    n: "04", slug: "premium-luxury", name: "Premium Luxury",
    short: "Negro, dorado y fotografías grandes. Para marcas que venden exclusividad.",
    traits: ["Negro y dorado", "Tipografía con serifa", "Fotos a pantalla completa"],
    categories: ["Inmobiliaria", "Hotel y turismo", "Tienda online"],
    hero: "full", body: "zigzag",
    demo: {
      brand: "Residencias Aurum", kind: "Inmobiliaria de lujo", nav: ["Propiedades", "Proyectos", "Asesoría", "Contacto"],
      kicker: "Propiedades exclusivas", title: "Viva donde siempre imaginó.",
      text: "Residencias seleccionadas con piscina, jardín y acabados de primer nivel.",
      cta: "Ver propiedades", cta2: "Hablar con un asesor",
      features: [
        { t: "Residencias", d: "Casas con amplios jardines en las mejores zonas." },
        { t: "Departamentos", d: "Pisos con vista y servicios privados." },
        { t: "Asesoría privada", d: "Visitas personalizadas y acompañamiento legal." },
      ],
      aboutTitle: "Cada propiedad, una historia", about: "Seleccionamos pocas propiedades y las presentamos con el detalle que merecen.",
      points: ["Visitas privadas", "Fotografía profesional", "Trámites acompañados"],
      photos: ["villa-blanca", "casa-moderna", "villa-piscina", "living-luz"],
      band: "Agende una visita privada.",
    },
  },
  {
    n: "05", slug: "futurista", name: "Futurista",
    short: "Fondos oscuros, luces de neón y líneas finas. Comunica innovación y tecnología.",
    traits: ["Neón sobre negro", "Líneas y cuadrículas", "Tipografía técnica"],
    categories: ["Tecnología", "Landing page", "Empresarial"],
    hero: "center", body: "grid",
    demo: {
      brand: "Quantia Labs", kind: "Empresa de inteligencia artificial", nav: ["Soluciones", "Tecnología", "Casos", "Contacto"],
      kicker: "Inteligencia artificial", title: "Datos que piensan por tu negocio.",
      text: "Modelos de IA que predicen demanda, detectan riesgos y automatizan decisiones.",
      cta: "Solicitar demo", cta2: "Ver soluciones",
      features: [
        { t: "Predicción", d: "Anticipa ventas e inventario con tus propios datos." },
        { t: "Visión", d: "Reconoce productos y documentos en imágenes." },
        { t: "Automatización", d: "Decisiones repetitivas resueltas en segundos." },
      ],
      aboutTitle: "Del dato a la decisión", about: "Conectamos tus sistemas, entrenamos el modelo y lo ponemos a trabajar.",
      points: ["Integración por API", "Panel de resultados", "Datos protegidos"],
      photos: ["tierra-noche", "circuito-neon", "circuito", "laptop-oscura"],
      band: "Prueba la plataforma con tus datos.",
    },
  },
  {
    n: "06", slug: "dark-mode", name: "Dark Mode",
    short: "Interfaz oscura, elegante y fácil para la vista. Ideal para productos digitales.",
    traits: ["Fondo oscuro", "Contraste suave", "Capturas de producto"],
    categories: ["Tecnología", "Landing page", "Empresarial"],
    hero: "split", body: "bento",
    demo: {
      brand: "Pulso Analytics", kind: "Software de reportes", nav: ["Producto", "Precios", "Recursos", "Ingresar"],
      kicker: "Reportes en tiempo real", title: "Todas tus ventas en un solo panel.",
      text: "Conecta tu tienda, tu caja y tus redes, y mira tus números al instante.",
      cta: "Probar gratis", cta2: "Ver el panel",
      features: [
        { t: "Panel en vivo", d: "Ventas, clientes y productos actualizados al minuto." },
        { t: "Alertas", d: "Avisos por WhatsApp cuando algo cambia." },
        { t: "Reportes", d: "Resúmenes listos para la reunión del lunes." },
      ],
      aboutTitle: "Hecho para equipos que deciden rápido", about: "Sin hojas de cálculo: tus datos llegan solos y se ven claros.",
      points: ["Conexión con tu sistema", "Usuarios por rol", "Exporta a Excel"],
      photos: ["dashboard", "teclado-neon", "laptop-planta", "laptop-graficos"],
      band: "Conecta tu primer reporte en minutos.",
    },
  },
  {
    n: "07", slug: "glassmorphism", name: "Glassmorphism",
    short: "Paneles translúcidos tipo vidrio sobre fondos de color. Moderno, ligero y amable.",
    traits: ["Vidrio esmerilado", "Degradados suaves", "Sensación de calma"],
    categories: ["Clínica y consultorio", "Tecnología", "Servicios profesionales"],
    hero: "center", body: "grid",
    demo: {
      brand: "Vitta Clínica", kind: "Clínica de medicina general", nav: ["Especialidades", "Médicos", "Citas", "Contacto"],
      kicker: "Salud para tu familia", title: "Tu cita médica, sin filas ni esperas.",
      text: "Reserva en línea con el especialista que necesitas y recibe recordatorios en tu celular.",
      cta: "Reservar cita", cta2: "Ver especialidades",
      features: [
        { t: "Medicina general", d: "Consultas para adultos y niños." },
        { t: "Especialidades", d: "Cardiología, pediatría, ginecología y más." },
        { t: "Laboratorio", d: "Resultados enviados a tu correo." },
      ],
      aboutTitle: "Atención cercana y ordenada", about: "Horarios claros, historial disponible y recordatorios automáticos.",
      points: ["Reserva en línea", "Recordatorios", "Atención de lunes a sábado"],
      photos: ["medico", "medico-celular", "clinica-recepcion", "dentista"],
      band: "Reserva tu próxima cita en un minuto.",
    },
  },
  {
    n: "08", slug: "3d-immersive", name: "3D Immersive",
    short: "Profundidad, perspectiva y capas que se mueven. Para causar una primera impresión fuerte.",
    traits: ["Perspectiva 3D", "Capas en movimiento", "Gran impacto visual"],
    categories: ["Inmobiliaria", "Construcción", "Tecnología"],
    hero: "poster", body: "grid",
    demo: {
      brand: "Torre Mirador", kind: "Proyecto inmobiliario", nav: ["El proyecto", "Departamentos", "Ubicación", "Contacto"],
      kicker: "Preventa", title: "Mira la ciudad desde arriba.",
      text: "Departamentos de uno a tres dormitorios con terraza, gimnasio y áreas sociales.",
      cta: "Reservar departamento", cta2: "Ver plantas",
      features: [
        { t: "1 dormitorio", d: "Ideal para profesionales y para invertir." },
        { t: "2 dormitorios", d: "Espacio para la familia con balcón." },
        { t: "3 dormitorios", d: "Plantas amplias con vista panorámica." },
      ],
      aboutTitle: "Un edificio pensado en capas", about: "Áreas sociales abajo, vivienda en el medio y terraza común en la cima.",
      points: ["Preventa con plan de pagos", "Recorrido virtual", "Entrega estimada en el contrato"],
      photos: ["edificio-curvas", "torres-gris", "casa-noche", "living-moderno"],
      band: "Agenda tu recorrido por el proyecto.",
    },
  },
  {
    n: "09", slug: "editorial", name: "Editorial",
    short: "Como una revista: titulares grandes, columnas y fotos que cuentan una historia.",
    traits: ["Titulares de revista", "Columnas de texto", "Fotos narrativas"],
    categories: ["Restaurante", "Portafolio", "Hotel y turismo"],
    hero: "editorial", body: "zigzag",
    demo: {
      brand: "Mesa Larga", kind: "Restaurante de cocina boliviana", nav: ["Carta", "Historia", "Reservas", "Contacto"],
      kicker: "Cocina de autor", title: "Sabores de casa, servidos con calma.",
      text: "Recetas de la abuela con productos de temporada, para compartir sin apuro.",
      cta: "Reservar mesa", cta2: "Ver la carta",
      features: [
        { t: "Almuerzos", d: "Menú del día con sopa, segundo y postre." },
        { t: "Cenas", d: "Carta de autor y vinos bolivianos." },
        { t: "Eventos", d: "Mesas largas para celebraciones." },
      ],
      aboutTitle: "Una mesa que reúne", about: "Empezamos cocinando para la familia. Hoy cocinamos para la tuya.",
      points: ["Productos locales", "Reservas por WhatsApp", "Salón privado"],
      photos: ["cena-mesa", "platos-mesa", "cena-amigos", "restaurante-salon"],
      band: "Reserva tu mesa para este fin de semana.",
    },
  },
  {
    n: "10", slug: "brutalista", name: "Brutalista",
    short: "Crudo, directo y sin adornos: bordes gruesos, tipografía enorme y contraste fuerte.",
    traits: ["Bordes negros gruesos", "Tipografía gigante", "Sin sombras ni adornos"],
    categories: ["Tienda online", "Portafolio", "Landing page"],
    hero: "poster", body: "grid",
    demo: {
      brand: "CRUDO", kind: "Marca de ropa urbana", nav: ["Tienda", "Colección", "Marca", "Contacto"],
      kicker: "Colección nueva", title: "ROPA SIN FILTRO.",
      text: "Prendas hechas en Bolivia, en tiradas cortas y para todos los días.",
      cta: "Comprar ahora", cta2: "Ver colección",
      features: [
        { t: "Poleras", d: "Algodón grueso y estampados propios." },
        { t: "Chaquetas", d: "Mezclilla y lona que duran años." },
        { t: "Accesorios", d: "Gorras, bolsos y más." },
      ],
      aboutTitle: "HECHO AQUÍ.", about: "Diseñamos, cortamos y cosemos en talleres locales.",
      points: ["Envíos a todo el país", "Pago con QR", "Cambios en 7 días"],
      photos: ["tienda-ropa", "ropa-colgada", "retrato-joven", "open-shop"],
      band: "NUEVA COLECCIÓN. POCAS PIEZAS.",
    },
  },
  {
    n: "11", slug: "bento-grid", name: "Bento Grid",
    short: "Contenido en bloques de distintos tamaños, como una caja bento. Mucho en poco espacio.",
    traits: ["Bloques modulares", "Mucha información ordenada", "Ideal para productos"],
    categories: ["Tienda online", "Tecnología", "Landing page"],
    hero: "bento", body: "bento",
    demo: {
      brand: "Sónica", kind: "Tienda de tecnología", nav: ["Audio", "Relojes", "Accesorios", "Carrito"],
      kicker: "Tecnología para tu día", title: "Lo mejor en audio y relojes, en un solo lugar.",
      text: "Productos originales con garantía y envío en el día dentro de la ciudad.",
      cta: "Ver productos", cta2: "Ofertas",
      features: [
        { t: "Audífonos", d: "Inalámbricos, con cancelación de ruido." },
        { t: "Relojes", d: "Inteligentes y clásicos." },
        { t: "Accesorios", d: "Cargadores, fundas y cables." },
      ],
      aboutTitle: "Compra fácil", about: "Elige, paga con QR y recibe en tu casa.",
      points: ["Garantía", "Envío el mismo día", "Pago con QR"],
      photos: ["audifonos", "reloj", "laptop-graficos", "tableta"],
      band: "Envío gratis en compras grandes.",
    },
  },
  {
    n: "12", slug: "neumorphism", name: "Neumorphism",
    short: "Botones y tarjetas en relieve suave, como si salieran del fondo. Tranquilo y táctil.",
    traits: ["Relieve suave", "Tonos pastel", "Sensación táctil"],
    categories: ["Clínica y consultorio", "Servicios profesionales", "Landing page"],
    hero: "split", body: "grid",
    demo: {
      brand: "Sonrisa Clara", kind: "Consultorio odontológico", nav: ["Tratamientos", "Equipo", "Citas", "Contacto"],
      kicker: "Odontología", title: "Cuida tu sonrisa sin miedo.",
      text: "Tratamientos explicados paso a paso, con citas puntuales y precios claros.",
      cta: "Agendar cita", cta2: "Ver tratamientos",
      features: [
        { t: "Limpieza", d: "Profilaxis y control cada seis meses." },
        { t: "Ortodoncia", d: "Brackets y alineadores." },
        { t: "Estética", d: "Blanqueamiento y carillas." },
      ],
      aboutTitle: "Tranquilidad en cada cita", about: "Te explicamos cada tratamiento antes de empezar.",
      points: ["Primera consulta de evaluación", "Planes de pago", "Recordatorios"],
      photos: ["dentista", "retrato-sonrisa", "sonrisa-mujer", "clinica-recepcion"],
      band: "Agenda tu evaluación.",
    },
  },
  {
    n: "13", slug: "swiss-design", name: "Swiss Design",
    short: "Cuadrícula estricta, tipografía sin serifa y mucho orden. Un clásico del diseño gráfico.",
    traits: ["Cuadrícula visible", "Rojo, negro y blanco", "Jerarquía muy clara"],
    categories: ["Portafolio", "Servicios profesionales", "Empresarial"],
    hero: "editorial", body: "list",
    demo: {
      brand: "Raster Studio", kind: "Estudio de diseño gráfico", nav: ["Trabajos", "Estudio", "Servicios", "Contacto"],
      kicker: "Diseño gráfico", title: "Identidad, orden y claridad.",
      text: "Creamos marcas, editoriales y señalética con un sistema que funciona en todas partes.",
      cta: "Ver trabajos", cta2: "Escribir",
      features: [
        { t: "Identidad", d: "Logo, colores y manual de marca." },
        { t: "Editorial", d: "Revistas, libros e informes." },
        { t: "Señalética", d: "Sistemas para edificios y eventos." },
      ],
      aboutTitle: "Un sistema, no un adorno", about: "Diseñamos reglas que tu equipo puede seguir sin nosotros.",
      points: ["Manual de marca", "Plantillas editables", "Archivos para imprenta"],
      photos: ["paleta-color", "edificio-blanco", "casa-fachada", "planos"],
      band: "Cuéntanos qué necesitas comunicar.",
    },
  },
  {
    n: "14", slug: "gradient-design", name: "Gradient Design",
    short: "Degradados intensos y formas fluidas. Energía, juventud y movimiento.",
    traits: ["Degradados vibrantes", "Formas fluidas", "Muy llamativo"],
    categories: ["Tecnología", "Landing page", "Tienda online"],
    hero: "center", body: "grid",
    demo: {
      brand: "Ola Pagos", kind: "App de pagos y cobros", nav: ["Cómo funciona", "Comercios", "Seguridad", "Descargar"],
      kicker: "Cobra con QR", title: "Cobra en segundos, desde tu celular.",
      text: "Genera tu QR, recibe pagos y mira cada venta en tiempo real.",
      cta: "Crear cuenta", cta2: "Cómo funciona",
      features: [
        { t: "QR propio", d: "Imprímelo o compártelo por WhatsApp." },
        { t: "Ventas al día", d: "Historial claro de cada cobro." },
        { t: "Equipo", d: "Accesos para tus vendedores." },
      ],
      aboutTitle: "Hecho para comercios", about: "Desde el puesto del mercado hasta la tienda con varias sucursales.",
      points: ["Registro rápido", "Reportes diarios", "Soporte por chat"],
      photos: ["pago-tarjeta", "tienda-pago", "tableta", "laptop-oscura"],
      band: "Crea tu cuenta y cobra hoy.",
    },
  },
  {
    n: "15", slug: "glass-luxury", name: "Glass Luxury",
    short: "Vidrio, reflejos y tonos profundos con detalles dorados. Lujo moderno y sereno.",
    traits: ["Vidrio sobre fotografía", "Detalles dorados", "Ambiente nocturno"],
    categories: ["Hotel y turismo", "Inmobiliaria", "Restaurante"],
    hero: "full", body: "zigzag",
    demo: {
      brand: "Hotel Cumbre", kind: "Hotel boutique", nav: ["Habitaciones", "Spa", "Restaurante", "Reservar"],
      kicker: "Hotel boutique", title: "Una noche que se queda contigo.",
      text: "Suites con vista, spa y cocina de autor a pocos minutos del centro.",
      cta: "Reservar estadía", cta2: "Ver habitaciones",
      features: [
        { t: "Suites", d: "Camas amplias, tina y vista a la piscina." },
        { t: "Spa", d: "Masajes y circuito de aguas." },
        { t: "Restaurante", d: "Desayuno incluido y cena de autor." },
      ],
      aboutTitle: "Descanso con detalle", about: "Pocas habitaciones para atender a cada huésped por su nombre.",
      points: ["Desayuno incluido", "Traslado desde el aeropuerto", "Reserva directa"],
      photos: ["hotel-noche", "hotel-cabanas", "hotel-suite", "hotel-habitacion"],
      band: "Reserva directo y recibe la mejor tarifa.",
    },
  },
  {
    n: "16", slug: "retro-vintage", name: "Retro / Vintage",
    short: "Colores cálidos, tipografías clásicas y texturas de otra época. Cercano y con carácter.",
    traits: ["Tonos crema y marrón", "Tipografía clásica", "Sellos y marcos"],
    categories: ["Restaurante", "Tienda online", "Portafolio"],
    hero: "center", body: "grid",
    demo: {
      brand: "Café La Esquina", kind: "Cafetería y tostaduría", nav: ["Carta", "Café en grano", "Historia", "Visítanos"],
      kicker: "Desde el barrio", title: "Café de verdad, como antes.",
      text: "Tostamos granos de los Yungas cada semana y los servimos como en casa.",
      cta: "Ver la carta", cta2: "Comprar café",
      features: [
        { t: "Espresso", d: "Granos de altura, tostado medio." },
        { t: "Repostería", d: "Hecha cada mañana." },
        { t: "Café en grano", d: "Bolsas de 250 g y 1 kg." },
      ],
      aboutTitle: "Una esquina con historia", about: "Un lugar para conversar sin mirar el reloj.",
      points: ["Abierto todos los días", "Wifi gratis", "Envíos de café en grano"],
      photos: ["bar-cafe", "cafe-brindis", "cafe-latte", "cafe-granos"],
      band: "Te esperamos con la cafetera lista.",
    },
  },
  {
    n: "17", slug: "organic-natural", name: "Organic / Natural",
    short: "Formas suaves, tonos tierra y verde, y fotos de naturaleza. Calma y bienestar.",
    traits: ["Verde y tierra", "Formas orgánicas", "Fotos de naturaleza"],
    categories: ["Hotel y turismo", "Restaurante", "Servicios profesionales"],
    hero: "split", body: "zigzag",
    demo: {
      brand: "Selva Viva", kind: "Ecolodge y turismo de naturaleza", nav: ["Cabañas", "Experiencias", "Cómo llegar", "Reservar"],
      kicker: "Ecolodge", title: "Despierta con el sonido del bosque.",
      text: "Cabañas de madera, comida de la huerta y caminatas guiadas por la selva.",
      cta: "Reservar cabaña", cta2: "Ver experiencias",
      features: [
        { t: "Cabañas", d: "Madera local, hamaca y terraza." },
        { t: "Caminatas", d: "Rutas guiadas para todos los niveles." },
        { t: "Cocina de huerta", d: "Platos con productos cultivados aquí." },
      ],
      aboutTitle: "Turismo que cuida", about: "Trabajamos con guías y productores de la comunidad.",
      points: ["Guías locales", "Energía solar", "Grupos pequeños"],
      photos: ["lodge-piscina", "resort-piscina", "colinas-verdes", "bowl"],
      band: "Reserva tu escapada a la naturaleza.",
    },
  },
  {
    n: "18", slug: "artistic-creative", name: "Artistic / Creative",
    short: "Composición libre, colores audaces y elementos que rompen la cuadrícula. Pura personalidad.",
    traits: ["Composición libre", "Colores audaces", "Tipografía expresiva"],
    categories: ["Portafolio", "Servicios profesionales", "Tienda online"],
    hero: "poster", body: "bento",
    demo: {
      brand: "Taller Color", kind: "Estudio de arte y talleres", nav: ["Obras", "Talleres", "Artistas", "Contacto"],
      kicker: "Arte contemporáneo", title: "Pinta fuera de la línea.",
      text: "Obras originales, encargos y talleres de pintura para todas las edades.",
      cta: "Ver obras", cta2: "Inscribirme a un taller",
      features: [
        { t: "Obras originales", d: "Pintura y técnica mixta de artistas locales." },
        { t: "Encargos", d: "Murales y cuadros a pedido." },
        { t: "Talleres", d: "Grupos para niños y adultos." },
      ],
      aboutTitle: "Un taller abierto", about: "Un espacio donde se crea, se enseña y se comparte.",
      points: ["Talleres los sábados", "Materiales incluidos", "Venta de obras"],
      photos: ["arte-abstracto", "pinceles", "pintura-color", "paleta-color"],
      band: "Inscríbete al próximo taller.",
    },
  },
  {
    n: "19", slug: "one-page", name: "One Page",
    short: "Todo en una sola página que se recorre con el scroll. Rápida, directa y fácil de compartir.",
    traits: ["Una sola página", "Menú con anclas", "Llamado a la acción claro"],
    categories: ["Landing page", "Construcción", "Empresarial"],
    hero: "full", body: "list",
    demo: {
      brand: "Obra Firme", kind: "Empresa constructora", nav: ["Servicios", "Obras", "Proceso", "Cotizar"],
      kicker: "Construcción y obras civiles", title: "Construimos lo que planificas.",
      text: "Casas, galpones y edificios con presupuesto claro y avance semanal.",
      cta: "Cotizar mi obra", cta2: "Ver servicios",
      features: [
        { t: "Viviendas", d: "Desde los cimientos hasta la entrega de llaves." },
        { t: "Galpones", d: "Estructuras metálicas para industria y comercio." },
        { t: "Refacciones", d: "Ampliaciones y mejoras sin parar tu actividad." },
      ],
      aboutTitle: "Obra con avances visibles", about: "Cada semana recibes fotos y el estado de tu obra.",
      points: ["Presupuesto por etapas", "Supervisión técnica", "Reportes semanales"],
      photos: ["obra-aerea", "obra-equipo", "planos", "edificio-depto"],
      band: "Cotiza tu obra sin compromiso.",
    },
  },
  {
    n: "20", slug: "interactive-motion", name: "Interactive / Motion",
    short: "Animaciones al hacer scroll y elementos que responden al cursor. Una experiencia que se siente viva.",
    traits: ["Animaciones al hacer scroll", "Efectos al pasar el cursor", "Experiencia envolvente"],
    categories: ["Hotel y turismo", "Tecnología", "Landing page"],
    hero: "center", body: "bento",
    demo: {
      brand: "Ruta Andina", kind: "Agencia de viajes", nav: ["Destinos", "Paquetes", "Experiencias", "Reservar"],
      kicker: "Viajes por Bolivia", title: "Tu próxima aventura empieza aquí.",
      text: "Salar, lagos y montañas con guías locales y todo organizado.",
      cta: "Ver destinos", cta2: "Armar mi viaje",
      features: [
        { t: "Salar y desierto", d: "Tres días entre sal, lagunas y estrellas." },
        { t: "Lago y cultura", d: "Islas, comunidades y gastronomía." },
        { t: "Montaña", d: "Caminatas y cumbres para todos los niveles." },
      ],
      aboutTitle: "Viajes con todo resuelto", about: "Transporte, alojamiento y guía en un solo paquete.",
      points: ["Grupos pequeños", "Guías certificados", "Pago en cuotas"],
      photos: ["cumbres-nubes", "lago-montanas", "ruta-canon", "valle-niebla", "mapa-viaje"],
      band: "Arma tu viaje con nosotros.",
    },
  },
];

export const getDesign = (slug: string) => DESIGNS.find((d) => d.slug === slug);
export const designHref = (d: Design) => `/catalogo/disenos/${d.slug}/`;
export const photoSrc = (key: string) => `/disenos/fotos/${key}.webp`;
export const shotSrc = (d: Design) => `/disenos/capturas/${d.slug}.webp`;
export const REQUEST_URL = "/catalogo/solicitud/";
