import About from "@/components/About";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ZodiacSelector from "@/components/ZodiacSelector";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Navigation from "@/components/Navigation";
import TodaysPanchang from "@/components/TodaysPanchang";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <TodaysPanchang />
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
