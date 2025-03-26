import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden mt-9 rounded-3xl">
      {/* Background with evergreen color and subtle pattern */}
      <div className="absolute inset-0 bg-[#344c3d]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a3e31]/20 to-[#3d5847]/20" />
        <div className="absolute inset-0 opacity-10 bg-[url('/subtle-pattern.png')] mix-blend-overlay" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto backdrop-blur-sm p-8 rounded-3xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[#f5f5f0] mb-6 font-['Clash_Display'] tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-[#f5f5f0]/90 text-lg mb-12 leading-relaxed">
            Join thousands of models and industry professionals on Africa's leading modeling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#f5f5f0] hover:bg-white text-[#344c3d] font-medium h-12 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-[#f5f5f0]/80 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 h-12 px-8 rounded-xl transition-all duration-300 hover:border-[#f5f5f0]"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Decorative elements */}
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#f5f5f0]/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#f5f5f0]/5 rounded-full blur-3xl"></div>
    </section>
  );
}