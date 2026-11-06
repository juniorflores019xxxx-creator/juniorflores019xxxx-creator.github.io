import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import Diagnostic from "@/components/sections/Diagnostic";
import Gallery3D from "@/components/ui/Gallery3D";
import Process from "@/components/sections/Process";
import Ecosystem from "@/components/sections/Ecosystem";
import Projects from "@/components/sections/Projects";
import Company from "@/components/sections/Company";
import FinalCTA from "@/components/sections/FinalCTA";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import SearchPalette from "@/components/search/SearchPalette";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Services />
        <Gallery3D
          eyebrow="Lo que construimos"
          title="Tecnología pensada para cómo trabaja tu negocio"
          images={[
            { src: "/img/3d/escritorio-codigo.webp", alt: "Computadora portátil con código en pantalla sobre un escritorio claro", label: "Software a medida" },
            { src: "/img/3d/dashboard.webp", alt: "Monitor con gráficos y reportes de datos", label: "Datos y reportes" },
            { src: "/img/3d/equipo-trabajo.webp", alt: "Personas trabajando juntas con computadoras portátiles", label: "Trabajo junto a tu equipo" },
          ]}
        />
        <Diagnostic />
        <Process />
        <Ecosystem />
        <Projects />
        <Company />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <SearchPalette />
      <Motion />
    </>
  );
}
