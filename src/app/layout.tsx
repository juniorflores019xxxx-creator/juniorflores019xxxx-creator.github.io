import type { Metadata, Viewport } from "next";
import { Sora, Onest, JetBrains_Mono } from "next/font/google";
import { SITE, SOCIAL_PROFILES } from "@/lib/site";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  keywords: [
    "desarrollo de aplicaciones Bolivia",
    "inteligencia artificial Bolivia",
    "automatización empresarial",
    "desarrollo web Santa Cruz",
    "software a medida",
    "SIBNOVA",
  ],
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050609",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.fullLegalName,
  alternateName: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/brand/sibnova-logo-completo.png`,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  sameAs: SOCIAL_PROFILES.map((s) => s.href),
  address: { "@type": "PostalAddress", addressLocality: "Santa Cruz de la Sierra", addressCountry: "BO" },
  founder: [
    { "@type": "Person", name: "Junior Herlan Flores Valeriano", jobTitle: "CEO · Desarrollador en inteligencia artificial" },
    { "@type": "Person", name: "Juan José Limón Quiróz", jobTitle: "Cofundador · Asesor en gestión empresarial" },
    { "@type": "Person", name: "José Luis Florero", jobTitle: "Cofundador · Estratega comercial con inteligencia artificial" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-BO" className={`${sora.variable} ${onest.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que JS está activo antes de pintar, para que los revelados no parpadeen */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#contenido">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}
