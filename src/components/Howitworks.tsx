import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Users, Award, Camera, Globe, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Create Portfolio",
      description: "Build your professional modeling portfolio with our easy-to-use tools"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Global Exposure",
      description: "Gain visibility with international agencies and brands worldwide"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Win Competitions",
      description: "Participate in prestigious international modeling competitions"
    }
  ];

  return (
    <div className="w-full py-20 bg-gradient-to-b from-[#f8f5f0] to-[#f0ebe0] overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-[#344c3d]/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border border-[#344c3d]/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Header */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-3 px-4 py-1.5 bg-[#344c3d]/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[#344c3d] mr-2" />
            <span className="text-[#344c3d] font-medium text-sm">International Platform</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-[#344c3d] mb-6 tracking-tight"
          >
            How Sage Media Works
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#344c3d] to-transparent mx-auto mb-6"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[#344c3d]/80 max-w-2xl mx-auto text-lg"
          >
            Our platform connects African models with global opportunities through an innovative, 
            internationally-recognized process designed by industry experts
          </motion.p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left feature panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white rounded-[2rem] p-10 shadow-[0_20px_80px_-15px_rgba(52,76,61,0.15)] overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#344c3d] via-[#5d8a6f] to-[#344c3d]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0ebe0]/50 rounded-bl-[8rem]"></div>
            
            <div className="mb-10 relative">
              <h3 className="text-2xl font-bold text-[#344c3d] mb-4">Global Fashion Categories</h3>
              <p className="text-[#344c3d]/70">
                Our platform hosts competitions across international fashion categories, 
                giving you diverse opportunities to showcase your talent on the world stage.
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {[
                'Paris Runway', 
                'Milan Editorial', 
                'New York Commercial', 
                'Tokyo Avant-Garde',
                'London Street Style', 
                'African Haute Couture'
              ].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f0ebe0] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#344c3d]/10 flex items-center justify-center text-[#344c3d]">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-[#344c3d]">{category}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="inline-flex items-center gap-2 text-[#344c3d] font-medium cursor-pointer"
            >
              <span>Explore all international categories</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Right steps panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#344c3d] rounded-[2rem] p-10 text-white relative overflow-hidden"
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-0 right-0 w-80 h-80 bg-[#5d8a6f]/20 rounded-full blur-3xl -mr-40 -mt-40"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-80 h-80 bg-[#5d8a6f]/10 rounded-full blur-3xl -ml-40 -mb-40"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />

            <div className="absolute top-10 right-10 flex space-x-1">
              {[1, 2, 3].map((dot) => (
                <motion.div 
                  key={dot}
                  className="w-2 h-2 rounded-full bg-white/30"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: dot * 0.3,
                    repeatType: "reverse" 
                  }}
                />
              ))}
            </div>

            <h3 className="text-3xl font-bold mb-10 relative z-10">Your Global Journey in 3 Steps</h3>

            <div className="space-y-10 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                  viewport={{ once: true }}
                  className="flex gap-8 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#344c3d]">
                        {step.icon}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <motion.div 
                        className="w-[2px] h-16 bg-gradient-to-b from-white/40 to-white/10 ml-7 my-2"
                        initial={{ height: 0 }}
                        whileInView={{ height: 64 }}
                        transition={{ duration: 0.8, delay: 0.4 + (0.2 * index) }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                    <p className="text-white/80 text-lg">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 relative z-10"
            >
              <Button className="bg-white text-[#344c3d] hover:bg-white/90 rounded-full px-8 py-7 text-lg shadow-xl shadow-black/10">
                <span className="mr-2">Start Your Global Career</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* International testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-xs"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/women/28.jpg"
                    alt="Testimonial"
                    className="w-14 h-14 rounded-xl border-2 border-white/50 object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <img src="/flags/nigeria.svg" alt="Nigeria" className="w-4 h-4 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.svg 
                        key={star} 
                        className="w-4 h-4 text-yellow-400 fill-current" 
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + (star * 0.1) }}
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-sm text-white/90 italic mb-2">
                    "From Lagos to Milan! Sage Media connected me with international agencies I never thought possible."
                  </p>
                  <p className="font-bold text-sm">Amara Okafor</p>
                  <p className="text-xs text-white/80">International Model, Lagos → Milan</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}