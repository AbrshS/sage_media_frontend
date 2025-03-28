import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MotionBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Transform values based on scroll position
  const verticalDotY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const rightLineOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.3, 0.3, 0.1]);
  
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left vertical line with traveling dot */}
      <div className="absolute left-8 top-0 bottom-0 hidden lg:block">
        <div className="h-full w-px bg-gradient-to-b from-transparent via-[#344c3d]/20 to-transparent relative">
          <motion.div 
            className="absolute w-1.5 h-1.5 bg-[#344c3d] rounded-full -left-[2px]"
            style={{ top: verticalDotY }}
          />
        </div>
      </div>
      
      {/* Right vertical line */}
      <div className="absolute right-8 top-0 bottom-0 hidden lg:block">
        <motion.div 
          className="h-full w-px bg-gradient-to-b from-transparent via-[#344c3d]/20 to-transparent relative"
          style={{ opacity: rightLineOpacity }}
        />
      </div>
      
      {/* Horizontal lines that appear at different scroll positions */}
      <motion.div 
        className="absolute left-8 right-8 h-px bg-gradient-to-r from-[#344c3d]/10 via-[#344c3d]/20 to-[#344c3d]/10"
        style={{ 
          top: "25%",
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.3, 1], [0, 0.3, 0, 0])
        }}
      />
      
      <motion.div 
        className="absolute left-8 right-8 h-px bg-gradient-to-r from-[#344c3d]/10 via-[#344c3d]/20 to-[#344c3d]/10"
        style={{ 
          top: "50%",
          opacity: useTransform(scrollYProgress, [0, 0.4, 0.5, 1], [0, 0, 0.3, 0])
        }}
      />
      
      <motion.div 
        className="absolute left-8 right-8 h-px bg-gradient-to-r from-[#344c3d]/10 via-[#344c3d]/20 to-[#344c3d]/10"
        style={{ 
          top: "75%",
          opacity: useTransform(scrollYProgress, [0, 0.7, 0.8, 1], [0, 0, 0.3, 0])
        }}
      />
      
      {/* Floating elements that appear throughout the page */}
      {[...Array(12)].map((_, i) => {
        const delay = i * 0.5;
        const duration = 15 + Math.random() * 20;
        const size = 2 + Math.random() * 3;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#344c3d]/10"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: size,
              height: size,
              opacity: useTransform(
                scrollYProgress, 
                [Math.max(0, i/20 - 0.1), i/20, Math.min(1, i/20 + 0.1)], 
                [0, 0.8, 0]
              )
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() > 0.5 ? 50 : -50, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
      
      {/* Gold accent elements */}
      {[...Array(5)].map((_, i) => {
        const delay = i * 0.7;
        const duration = 20 + Math.random() * 10;
        const size = 1 + Math.random() * 2;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FFD700]/20"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: size,
              height: size,
              opacity: useTransform(
                scrollYProgress, 
                [Math.max(0, i/10 - 0.1), i/10, Math.min(1, i/10 + 0.2)], 
                [0, 0.6, 0]
              )
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() > 0.5 ? 70 : -70, 0],
              scale: [1, 2, 1]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}