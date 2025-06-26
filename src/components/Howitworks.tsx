import { motion } from "framer-motion";
import { Camera, Globe, Award, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Camera className="w-6 h-6" />,
      title: "Create Portfolio",
      description: "Build your professional modeling portfolio with our state-of-the-art digital tools"
    },
    {
      number: "02",
      icon: <Globe className="w-6 h-6" />,
      title: "Global Exposure",
      description: "Connect with elite international agencies and prestigious fashion brands"
    },
    {
      number: "03",
      icon: <Award className="w-6 h-6" />,
      title: "Win Competitions",
      description: "Compete in exclusive international modeling events and prestigious showcases"
    }
  ];

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      {/* Unique background pattern - diagonal stripes */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'repeating-linear-gradient(45deg, #344c3d, #344c3d 1px, transparent 1px, transparent 10px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-[#344c3d]/5 animate-float-slow hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-[#344c3d]/5 animate-float-medium hidden lg:block"></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-[#344c3d]/5 animate-float-fast hidden lg:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with unique style */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 relative">
            <span className="absolute -inset-1 rounded-lg bg-[#344c3d]/10 transform -rotate-1"></span>
            <h2 className="relative text-3xl md:text-4xl font-bold text-[#344c3d] px-6 py-2">
              How It Works
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our innovative platform transforms African modeling talent into global fashion icons through a simple yet powerful process
          </p>
        </div>
        
        {/* Unique vertical timeline with offset cards */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#344c3d]/0 via-[#344c3d]/30 to-[#344c3d]/0"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-20 md:mb-32 ${index === steps.length - 1 ? 'mb-0' : ''}`}
            >
              <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Step number in circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-white border-4 border-[#344c3d] flex items-center justify-center font-bold text-[#344c3d]">
                  {step.number}
                </div>
                
                {/* Content card with unique shape */}
                <div className={`w-full md:w-[calc(50%-2rem)] bg-white p-6 rounded-lg shadow-md relative ${
                  index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                }`}>
                  {/* Triangle pointer */}
                  <div className={`absolute top-4 ${
                    index % 2 === 0 ? 'left-full md:left-auto md:right-full' : 'right-full'
                  } transform ${
                    index % 2 === 0 ? 'rotate-90 md:rotate-0 md:-scale-x-100' : '-rotate-90 md:rotate-0'
                  } hidden md:block`}>
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-r-[16px] border-r-white"></div>
                  </div>
                  
                  {/* Card content with unique styling */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="mb-4 w-16 h-16 rounded-lg bg-[#344c3d]/10 flex items-center justify-center text-[#344c3d]">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#344c3d] mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    
                    {/* Unique animated arrow for each step */}
                    {index < steps.length - 1 && (
                      <div className="mt-4 text-[#344c3d]">
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-[#344c3d] text-white rounded-md hover:bg-[#2a3e31] transition-colors">
            <span>Start Your Journey</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
      
    </section>
  );
}