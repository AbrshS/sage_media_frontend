import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, ChevronRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring animation for smoother cursor tracking
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 100 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        cursorX.set(x);
        cursorY.set(y);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [cursorX, cursorY]);

  return (
    <div ref={containerRef} className="w-full bg-[#f8f5f0] text-[#344c3d] py-16 font-['Inter',sans-serif] overflow-hidden relative">
      {/* Cursor tracker */}
      <motion.div 
        className="pointer-events-none absolute z-0 rounded-full opacity-20 bg-[#344c3d] blur-3xl"
        style={{
          x: springX,
          y: springY,
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      <div className="container mx-auto px-4 relative">
        {/* Enhanced abstract shapes with animation */}
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#344c3d]/20 to-[#4a6b58]/5 rounded-full blur-3xl -mr-48 -mt-48 z-0"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FFD700]/10 to-[#FFD700]/5 rounded-full blur-3xl -ml-40 -mb-40 z-0"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-1 h-20 bg-gradient-to-b from-[#FFD700] to-transparent opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-16 bg-gradient-to-b from-[#344c3d] to-transparent opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-30"></div>
        
        {/* Main content with enhanced grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left content with enhanced animations */}
          <motion.div 
            className="lg:col-span-5 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-[#344c3d]/10 backdrop-blur-sm rounded-full text-sm mb-4 border border-[#344c3d]/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(52, 76, 61, 0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="w-4 h-4 text-[#344c3d] mr-2" />
              <span>Empowering African Models</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight font-['Clash_Display',sans-serif]">
              <motion.span 
                className="block bg-clip-text text-transparent bg-gradient-to-r from-[#344c3d] via-[#344c3d]/90 to-[#344c3d]/80"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover
              </motion.span>
              <motion.span 
                className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#344c3d] via-[#4a6b58] to-[#5d8a6f]"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Exceptional
              </motion.span>
              <motion.span 
                className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#344c3d] via-[#344c3d]/90 to-[#344c3d]/80"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Talent
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg text-[#4a6d57] max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Showcase your unique abilities, compete with the best, and elevate your modeling career to unprecedented heights.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button className="bg-gradient-to-r from-[#344c3d] to-[#4a6b58] hover:from-[#4a6b58] hover:to-[#5d8a6f] text-white rounded-full px-8 py-6 text-lg flex items-center gap-2 shadow-lg shadow-[#344c3d]/20 border border-[#5d8a6f]/30">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button variant="outline" className="border-[#344c3d]/20 text-[#344c3d] hover:bg-[#344c3d]/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm">
                Explore Models
              </Button>
            </motion.div>
            
            <motion.div 
              className="pt-12 grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div 
                className="text-center p-3 rounded-xl backdrop-blur-sm bg-[#344c3d]/5 border border-[#344c3d]/10"
                whileHover={{ y: -5, backgroundColor: "rgba(52, 76, 61, 0.1)" }}
              >
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#344c3d] to-[#344c3d]/70">5000+</p>
                <p className="text-sm text-[#4a6d57]/80 mt-1">Active models</p>
              </motion.div>
              <motion.div 
                className="text-center p-3 rounded-xl backdrop-blur-sm bg-[#344c3d]/5 border border-[#344c3d]/10"
                whileHover={{ y: -5, backgroundColor: "rgba(52, 76, 61, 0.1)" }}
              >
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#344c3d] to-[#344c3d]/70">30.3k</p>
                <p className="text-sm text-[#4a6d57]/80 mt-1">Downloads</p>
              </motion.div>
              <motion.div 
                className="text-center p-3 rounded-xl backdrop-blur-sm bg-[#344c3d]/5 border border-[#344c3d]/10"
                whileHover={{ y: -5, backgroundColor: "rgba(52, 76, 61, 0.1)" }}
              >
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#344c3d] to-[#344c3d]/70">1200+</p>
                <p className="text-sm text-[#4a6d57]/80 mt-1">Competitions</p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right content - Enhanced 3D model showcase with parallax effect */}
          <motion.div 
            className="lg:col-span-7 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center">
              {/* Main model image with enhanced styling */}
              <motion.div
                className="absolute z-20 transform"
                initial={{ scale: 0.9, rotateY: -5 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
              >
                <div className="relative">
                  <img 
                    src="hero1.png" 
                    alt="Featured Model" 
                    className="h-[450px] sm:h-[550px] object-cover rounded-2xl shadow-2xl"
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(52, 76, 61, 0.25), 0 0 0 1px rgba(52, 76, 61, 0.1) inset",
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#f8f5f0]/30 via-transparent to-transparent"></div>
                  
                  {/* Animated glow effect */}
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-[#344c3d]/0 via-[#FFD700]/20 to-[#344c3d]/0 rounded-2xl blur-xl opacity-30 -z-10"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      repeatType: "loop" 
                    }}
                  />
                </div>
                
                {/* Enhanced floating badge */}
                <motion.div 
                  className="absolute -right-10 top-1/4 bg-[#344c3d]/10 backdrop-blur-md rounded-xl p-4 border border-[#344c3d]/20 shadow-xl"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(52, 76, 61, 0.15)" }}
                >
                  <div className="text-sm font-medium mb-1 text-[#344c3d]">Top Rated</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + star * 0.1 }}
                      >
                        <Star fill="#FFD700" className="w-4 h-4 text-[#FFD700]" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Enhanced category tag */}
                <motion.div 
                  className="absolute -left-6 bottom-20 bg-gradient-to-r from-[#344c3d] to-[#4a6b58] px-6 py-3 rounded-full shadow-lg border border-[#5d8a6f]/30"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  whileHover={{ scale: 1.05, x: -3 }}
                >
                  <span className="text-white font-medium">High Fashion</span>
                </motion.div>
              </motion.div>
              
              {/* Enhanced background models with parallax effect */}
              <motion.div 
                className="absolute left-0 bottom-0 z-10 opacity-70"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                whileHover={{ x: -10, opacity: 0.9 }}
              >
                <div className="relative">
                  <img 
                    src="mobileapp.png" 
                    alt="Model App" 
                    className="h-[300px] object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f8f5f0]/60 via-transparent to-[#f8f5f0]/60"></div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute right-0 top-10 z-10 opacity-70"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                whileHover={{ x: 10, opacity: 0.9 }}
              >
                <div className="relative">
                  <img 
                    src="mobileapp.png" 
                    alt="Model App" 
                    className="h-[250px] object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f8f5f0]/60 via-transparent to-[#f8f5f0]/60"></div>
                </div>
              </motion.div>
              
              {/* Enhanced floating elements with interaction */}
              <motion.div 
                className="absolute -bottom-10 right-20 bg-[#344c3d]/10 backdrop-blur-md rounded-full p-4 border border-[#344c3d]/20 shadow-xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                whileHover={{ y: -5, scale: 1.1, backgroundColor: "rgba(52, 76, 61, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-6 h-6 text-[#344c3d]" />
              </motion.div>
              
              <motion.div 
                className="absolute top-10 left-1/4 bg-[#344c3d]/10 backdrop-blur-md rounded-full p-3 border border-[#344c3d]/20 shadow-xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                whileHover={{ y: 5, scale: 1.1, backgroundColor: "rgba(52, 76, 61, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-3 h-3 bg-[#FFD700] rounded-full"></div>
              </motion.div>
              
              {/* New decorative elements */}
              <motion.div 
                className="absolute top-1/3 right-1/3 bg-[#344c3d]/5 backdrop-blur-sm rounded-full p-2 border border-[#344c3d]/10 shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <div className="w-2 h-2 bg-[#344c3d] rounded-full"></div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-1/4 left-1/3 w-20 h-1 bg-gradient-to-r from-[#FFD700]/50 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{ duration: 0.8, delay: 2 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    
    
    {/* Scroll indicator */}
    <motion.div 
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
    >
      <p className="text-[#344c3d]/70 text-sm mb-2">Scroll to explore</p>
      <motion.div 
        className="w-6 h-10 border-2 border-[#344c3d]/30 rounded-full flex justify-center p-1"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div 
          className="w-1.5 h-1.5 bg-[#344c3d]/50 rounded-full"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
    
    
    {/* Vertical motion line that spans the entire page */}
    <div className="absolute left-8 top-0 bottom-0 hidden lg:block">
      <div className="h-full w-px bg-gradient-to-b from-transparent via-[#344c3d]/20 to-transparent relative">
        <motion.div 
          className="absolute w-1.5 h-1.5 bg-[#344c3d] rounded-full -left-[2px]"
          animate={{ 
            y: [0, '100vh', 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>
    </div>
    
    {/* Floating elements that appear throughout the page */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#344c3d]/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  </div>
  );
}