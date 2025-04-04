import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Award, Camera, Globe, Sparkles, Star } from "lucide-react";


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
    <><div className="w-full py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Enhanced decorative elements */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#6cbc8b]/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }} />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border border-[#3a4b3c]/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }} />

        {/* Refined Header */}
        <div className="text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-4 px-5 py-2 bg-[#3a4b3c]/5 rounded-full border border-[#3a4b3c]/10"
          >
            <Sparkles className="w-4 h-4 text-[#6cbc8b] mr-2" />
            <span className="text-[#3a4b3c] font-medium text-sm">Global Fashion Platform</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3a4b3c] via-[#6cbc8b] to-[#3a4b3c]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Your Path to Global Success
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="h-[2px] w-32 bg-gradient-to-r from-[#3a4b3c]/20 via-[#6cbc8b] to-[#3a4b3c]/20 mx-auto mb-8" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-[#4e6a56] max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Experience a revolutionary platform that transforms African modeling talent into
            global fashion icons through our innovative, internationally-recognized process
          </motion.p>
        </div>

      </div>
    </div>
    <div className="w-full py-20 overflow-hidden relative -mt-10">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-[#e2f8e5]/30 to-white z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Simple header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#3a4b3c] mb-4">
              How It Works
            </h2>
            <div className="h-1 w-20 bg-[#6cbc8b] mx-auto"></div>
          </motion.div>

          {/* Horizontal steps layout */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-0 w-full h-[2px] bg-[#97d8a6]/30 hidden md:block"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex-1 relative bg-white rounded-xl p-6 shadow-sm border border-[#97d8a6]/20 md:max-w-[32%]"
              >
                {/* Step number */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#3a4b3c] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 text-center pt-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e2f8e5] text-[#3a4b3c]">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#3a4b3c] mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-[#4e6a56] text-center">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div></>
  );
}