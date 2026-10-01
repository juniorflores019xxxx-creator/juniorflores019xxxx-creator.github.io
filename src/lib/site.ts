// Datos reales de SIBNOVA. Todo el sitio toma el contacto de aquí.
export const SITE = {
  name: "SIBNOVA",
  legalName: "SIBNOVA LTDA.",
  fullLegalName: "Soluciones Informáticas de Bolivia SIBNOVA Ltda.",
  tagline: "Soluciones Informáticas de Bolivia",
  url: "https://sibnova.com.bo",
  title: "SIBNOVA | Soluciones Informáticas de Bolivia",
  description:
    "Desarrollo de aplicaciones, inteligencia artificial, automatización empresarial y soluciones digitales en Bolivia.",
  phone: "+59176486765",
  phoneDisplay: "+591 7648 6765",
  whatsapp: "59176486765",
  email: "sibnovaltda@gmail.com",
  city: "Santa Cruz de la Sierra, Bolivia",
} as const;

export const WHATSAPP_URL = `https://wa.me/${SITE.whatsapp}`;

export const NAV = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
] as const;

// Redes sociales: solo se muestran las que tienen URL real.
// Añade aquí Facebook, Instagram, LinkedIn o TikTok cuando existan las cuentas.
export const SOCIAL: { label: string; href: string; icon: "whatsapp" | "mail" | "instagram" | "facebook" | "linkedin" | "tiktok" }[] = [
  { label: "WhatsApp", href: WHATSAPP_URL, icon: "whatsapp" },
  { label: "Correo", href: `mailto:${SITE.email}`, icon: "mail" },
  // { label: "Instagram", href: "https://www.instagram.com/…", icon: "instagram" },
  // { label: "LinkedIn", href: "https://www.linkedin.com/company/…", icon: "linkedin" },
];

export const FOUNDERS = [
  { name: "Junior Herlan Flores Valeriano", role: "CEO · Desarrollador en inteligencia artificial", photo: "/img/junior-flores.jpg" },
  { name: "Juan José Limón Quiróz", role: "Cofundador · Asesor en gestión empresarial", photo: "/img/juan-jose-limon.jpg" },
  { name: "José Luis Florero", role: "Cofundador · Estratega comercial con inteligencia artificial", photo: "/img/jose-luis-florero.jpg" },
] as const;
