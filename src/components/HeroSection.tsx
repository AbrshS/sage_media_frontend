import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Ticket, Star, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Spring animation for smoother cursor tracking
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 100 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 100 });

  // Countdown timer
  useEffect(() => {
    // Set end date to 30 days from now for demo
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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

  // Calculate progress percentage for countdown
  const totalDays = 30; // Total campaign days
  const progressPercentage = ((totalDays - timeLeft.days) / totalDays) * 100;

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-screen relative bg-gradient-to-b from-white to-[#f8f5f0] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Elegant accent lines */}
        <motion.div 
          className="absolute top-[15%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6cbc8b]/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
        <motion.div 
          className="absolute top-[85%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3a4b3c]/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.5 }}
        />
        
        {/* Decorative circles */}
        <motion.div 
          className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="w-full h-full border-[40px] border-[#3a4b3c] rounded-full" />
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="w-full h-full border-[40px] border-[#6cbc8b] rounded-full" />
        </motion.div>
        
        {/* Subtle sparkle elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 10 + 8
            }}
          >
            <Sparkles className="text-[#6cbc8b]" size={Math.random() * 16 + 8} />
          </motion.div>
        ))}
      </div>
      
      {/* Cursor follower */}
      <motion.div 
        className="pointer-events-none absolute z-0 rounded-full opacity-10 bg-[#6cbc8b] blur-3xl"
        style={{
          x: springX,
          y: springY,
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Main content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Main content */}
          <div className="max-w-xl">
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#6cbc8b]/30 shadow-sm mb-8"
            >
              <Crown className="h-4 w-4 text-[#6cbc8b] mr-2" />
              <span className="text-[#3a4b3c] font-medium">Premium Modeling Competition</span>
            </motion.div>
            
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
              style={{ 
                fontFamily: "'Clash Display', sans-serif",
                background: "linear-gradient(to right, #3a4b3c, #6cbc8b, #3a4b3c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                animation: "textShine 3s linear infinite"
              }}
            >
              Africa's Premier <br />
              <span>Modeling Competition</span>
            </motion.h1>
            
            {/* Elegant divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-[2px] w-32 bg-gradient-to-r from-[#3a4b3c]/20 via-[#6cbc8b] to-[#3a4b3c]/20 mb-8"
            />
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-[#4e6a56] mb-10 font-light leading-relaxed"
            >
              Showcase your talent, gain international exposure, and win career-changing opportunities with Africa's most prestigious modeling platform
            </motion.p>
            
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8 mb-10"
            >
              {[
                { value: "1,234+", label: "Models Entered" },
                { value: "$50,000", label: "Prize Pool" },
                { value: "35+", label: "Countries" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="text-3xl font-bold text-[#3a4b3c] mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#4e6a56] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
            
            {/* CTA buttons with luxury styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button 
                className="bg-[#3a4b3c] hover:bg-[#4e6a56] text-white text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#6cbc8b]/20"
                asChild
              >
                <Link to="/competitions">
                  Enter Competition
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-[#4e6a56] text-[#4e6a56] hover:bg-[#4e6a56] hover:text-white text-lg px-8 py-6 rounded-xl transition-all duration-300"
                asChild
              >
                <Link to="/leaderboard">
                  View Leaderboard
                </Link>
              </Button>
            </motion.div>
            
            {/* Testimonial for social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#6cbc8b]/10"
            >
              <div className="flex -space-x-3 mr-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={`/images/model-${i+1}.jpg`} 
                      alt="Model" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i+20}.jpg`;
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-[#6cbc8b] fill-[#6cbc8b]" />
                  ))}
                </div>
                <p className="text-sm text-[#4e6a56]">
                  <span className="font-medium">230+ models</span> joined in the last 24 hours
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Countdown and image */}
          <div>
            {/* Countdown timer with luxury styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white rounded-2xl p-8 shadow-[0_10px_50px_-12px_rgba(108,188,139,0.25)] border border-[#6cbc8b]/10 mb-8 relative z-10"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#3a4b3c]/5 flex items-center justify-center mr-4">
                  <Clock className="text-[#3a4b3c] h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3a4b3c]">Competition Closes In:</h3>
                  <p className="text-sm text-[#4e6a56]">Don't miss your opportunity to showcase your talent</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-[#f7f9f7] rounded-xl p-4 border border-[#6cbc8b]/10">
                      <div 
                        className="text-4xl font-bold text-[#3a4b3c] mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {item.value < 10 ? `0${item.value}` : item.value}
                      </div>
                      <div className="text-xs text-[#4e6a56] uppercase tracking-wider">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#f7f9f7] rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#3a4b3c] to-[#6cbc8b] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 1.2 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-sm text-[#4e6a56] mb-6">
                <span>Campaign Started</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              
              {/* Quick apply button */}
              <Button 
                className="w-full bg-[#3a4b3c] hover:bg-[#4e6a56] text-white text-lg py-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#6cbc8b]/20"
                asChild
              >
                <Link to="/competitions">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            {/* Featured model image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img 
                src="/images/featured-model.jpg" 
                alt="Featured Model" 
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3 w-fit">
                  <Crown className="h-3 w-3 text-white mr-1" />
                  <span className="text-white text-xs font-medium">2023 Winner</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Amara Kente</h3>
                <p className="text-white/80 text-sm">International Model & Brand Ambassador</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for text gradient animation */}
      <style>{`
        @keyframes textShine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}