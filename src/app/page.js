import About from "@/components/About";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ZodiacSelector from "@/components/ZodiacSelector";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Services />
        <ZodiacSelector />
        <Testimonials />
        <Footer />
        <WhatsAppFloat />
      </main>
    </>
  );
}
