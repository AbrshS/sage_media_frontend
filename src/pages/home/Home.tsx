
import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/Howitworks";
import CompetitionSection from "@/components/CompetitionSection";
import FeaturedModels from "@/components/FeaturedModels";
import About from "../about/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "../faq/Faq";
import Contact from "../contact/Contact";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Header />
        <HeroSection />
        <HowItWorks />
        <CompetitionSection />
        <FeaturedModels />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
        <CTA />
        <Footer />
      </Suspense>
    </div>
  );
}