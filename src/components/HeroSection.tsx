import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star, Crown, Sparkles, ChevronDown, Instagram, Camera, Award, Users, Globe, Facebook, Twitter as TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [0, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 300], [-5, 5]);
  
  const categories = [
    { name: "Fashion", icon: <Camera className="w-4 h-4" />, color: "#344c3d" },
    { name: "Runway", icon: <Crown className="w-4 h-4" />, color: "#6cbc8b" },
    { name: "Commercial", icon: <Award className="w-4 h-4" />, color: "#344c3d" },
    { name: "Fitness", icon: <Users className="w-4 h-4" />, color: "#6cbc8b" },
    { name: "Editorial", icon: <Globe className="w-4 h-4" />, color: "#344c3d" },
  ];

  // Countdown timer
  useEffect(() => {
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

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
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
  }, [mouseX, mouseY]);

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory(prev => (prev + 1) % categories.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [categories.length]);

  // Calculate progress percentage for countdown
  const totalDays = 30;
  const progressPercentage = ((totalDays - timeLeft.days) / totalDays) * 100;

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-screen relative overflow-hidden bg-[#f9f9f7]"
    >
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#344c3d]/10 via-white to-[#6cbc8b]/10"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'linear-gradient(to right, #344c3d 1px, transparent 1px), linear-gradient(to bottom, #344c3d 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'radial-gradient(circle, rgba(52,76,61,0.05) 0%, rgba(52,76,61,0) 70%)' : 
                                        'radial-gradient(circle, rgba(108,188,139,0.05) 0%, rgba(108,188,139,0) 70%)'
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left column - Main content */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Social proof bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8 bg-white/80 backdrop-blur-sm rounded-full py-2 px-4 shadow-sm border border-[#344c3d]/10 w-fit"
            >
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
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
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-[#344c3d] fill-[#344c3d]" />
                ))}
              </div>
              <span className="text-xs font-medium text-[#344c3d]">
                <span className="font-bold">230+</span> joined today
              </span>
            </motion.div>
            
            {/* Animated category selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-[#344c3d]/70">Categories:</span>
                <div className="relative h-8 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute"
                    >
                      <div 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${categories[activeCategory].color}10` }}
                      >
                        <div className="text-[#344c3d]">{categories[activeCategory].icon}</div>
                        <span className="text-sm font-medium" style={{ color: categories[activeCategory].color }}>
                          {categories[activeCategory].name}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            
            {/* Main headline with animated gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
            >
              <span className="block">Discover Your</span>
              <span className="relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#344c3d] via-[#6cbc8b] to-[#344c3d] bg-[length:200%_auto] animate-gradient">
                  Modeling Potential
                </span>
                <motion.span 
                  className="absolute -bottom-2 left-0 h-3 bg-[#6cbc8b]/20 w-full rounded-sm z-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-[#344c3d]/80 mb-8 max-w-lg"
            >
              Join Africa's premier modeling competition platform. Showcase your talent, connect with top agencies, and launch your international career.
            </motion.p>
            
            {/* Stats with animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: <Users className="w-5 h-5" />, value: "1,234+", label: "Models" },
                { icon: <Award className="w-5 h-5" />, value: "$50K", label: "Prizes" },
                { icon: <Globe className="w-5 h-5" />, value: "35+", label: "Countries" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-[#344c3d]/10 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#344c3d]/5 flex items-center justify-center mx-auto mb-2 text-[#344c3d]">
                    {stat.icon}
                  </div>
                  <div className="text-xl font-bold text-[#344c3d]">{stat.value}</div>
                  <div className="text-xs text-[#344c3d]/70 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button 
                className="bg-[#344c3d] hover:bg-[#2a3e31] text-white px-8 py-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#344c3d]/20 group relative overflow-hidden"
                asChild
              >
                <Link to="/competitions">
                  <span className="relative z-10 flex items-center">
                    Enter Competition
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 bg-[#6cbc8b] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-[#344c3d] text-[#344c3d] hover:bg-[#344c3d] hover:text-white px-8 py-6 rounded-xl transition-all duration-300"
                asChild
              >
                <Link to="/leaderboard">
                  View Leaderboard
                </Link>
              </Button>
            </motion.div>
            
            {/* Social media integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-[#344c3d]/70">Follow us:</span>
              {[Instagram, TwitterIcon, Facebook].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#344c3d]/10 text-[#344c3d] hover:bg-[#344c3d] hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>
          
          {/* Right column - 3D card and countdown */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3D Model Card */}
              <motion.div
                style={{ 
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d",
                  perspective: 1000
                }}
                className="md:col-span-2 lg:col-span-1 h-[500px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl relative"
              >
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <img 
                    src="/images/featured-model.jpg" 
                    alt="Featured Model" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#344c3d]/90 via-transparent to-transparent"></div>
                  
                  {/* Social media style overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured Model
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        4.9
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                          <img 
                            src="/images/model-avatar.jpg" 
                            alt="Model Avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://randomuser.me/api/portraits/women/44.jpg";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Amara Kente</h3>
                          <p className="text-white/80 text-xs">@amarakente • Fashion Model</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="bg-white text-[#344c3d] hover:bg-white/90 text-sm px-4 py-2 rounded-lg flex-1"
                        >
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white/20 text-sm px-4 py-2 rounded-lg"
                        >
                          Vote
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Countdown and competition info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#344c3d]/10 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center mr-3 text-[#344c3d]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[#344c3d] font-bold">Competition Ends In:</h3>
                      <p className="text-xs text-[#344c3d]/70">Don't miss your opportunity</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { value: timeLeft.days, label: "Days" },
                      { value: timeLeft.hours, label: "Hours" },
                      { value: timeLeft.minutes, label: "Min" },
                      { value: timeLeft.seconds, label: "Sec" }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-[#f7f9f7] rounded-lg p-2 border border-[#344c3d]/5">
                          <div className="text-xl font-bold text-[#344c3d]">
                            {item.value < 10 ? `0${item.value}` : item.value}
                          </div>
                          <div className="text-[10px] text-[#344c3d]/70 uppercase">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#f7f9f7] rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#344c3d] to-[#6cbc8b] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-[#344c3d]/70 mb-4">
                    <span>Started</span>
                    <span>{Math.round(progressPercentage)}% Complete</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#344c3d] hover:bg-[#2a3e31] text-white py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                  asChild
                >
                  <Link to="/competitions">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              
              {/* Categories showcase */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-[#344c3d]/10"
              >
                <h3 className="text-[#344c3d] font-bold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Competition Categories
                </h3>
                
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#344c3d]/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${category.color}10` }}
                        >
                          <div className="text-[#344c3d]">{category.icon}</div>
                        </div>
                        <span className="font-medium text-[#344c3d]">{category.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#344c3d]/50" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Link to="/categories" className="text-sm text-[#344c3d] font-medium hover:text-[#6cbc8b] transition-colors inline-flex items-center">
                    View all categories
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs text-[#344c3d]/70 mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-[#344c3d]/30 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-[#344c3d]"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Add CSS for text gradient animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-gradient {
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </div>
  );
}