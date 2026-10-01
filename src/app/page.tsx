import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
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
