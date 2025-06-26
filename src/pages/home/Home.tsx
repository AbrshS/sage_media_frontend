
import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/Howitworks";
import CompetitionSection from "@/components/CompetitionSection"; // Make sure this path is correct
import FeaturedModels from "@/components/FeaturedModels";
import About from "../about/About";
import FAQ from "../faq/Faq";
import Contact from "../contact/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      
        <HeroSection />
        <HowItWorks />
        <CompetitionSection /> {/* This should now use the updated component */}
        <FeaturedModels />
        <About />
        {/* <Testimonials /> */}
        <FAQ />
        <Contact />
        {/* <CTA /> */}
        <Footer />
      </Suspense>
    </div>
  );
}