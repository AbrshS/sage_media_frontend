import { motion } from 'framer-motion';
import { Users, Target, Award, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

export default function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Elegant Design */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/aboutus.png" 
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#344c3d]/90 to-[#344c3d]/70" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-white/10 rounded-full" />
            <div className="absolute bottom-[30%] right-[15%] w-48 h-48 border border-white/10 rounded-full" />
          </div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
            >
              <span className="text-sm font-medium tracking-wide">OUR STORY</span>
              <div className="w-1 h-1 rounded-full bg-white/70"></div>
              <span className="text-sm text-white/70">SINCE 2018</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-['Clash_Display'] leading-tight tracking-tight">
              Empowering <span className="relative inline-block">
                African
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-2 bg-white/30 blur-sm"
                />
              </span> Beauty
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Redefining beauty standards and creating opportunities for African models on the global stage through innovation and community.
            </p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#344c3d] rounded-full hover:bg-white/90 transition-colors font-medium"
            >
              <span>Our Journey</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards with Elegant Design */}
      <div className="relative -mt-32 mb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { number: "5000+", label: "Models", sublabel: "Registered" },
              { number: "150+", label: "Competitions", sublabel: "Worldwide" },
              { number: "1M+", label: "Votes Cast", sublabel: "And counting" },
              { number: "80+", label: "Countries", sublabel: "Represented" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-xl rounded-2xl group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6 md:p-8 text-center">
                  <h3 className="text-3xl md:text-5xl font-bold text-[#344c3d] mb-1 font-['Clash_Display']">
                    {stat.number}
                  </h3>
                  <p className="text-[#4a6d57] font-medium mb-1">{stat.label}</p>
                  <p className="text-[#4a6d57]/60 text-sm">{stat.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4 bg-[#f8f5f0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#344c3d]"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-[#344c3d]"></div>
                <img 
                  src="/about-story.jpg" 
                  alt="Our Story" 
                  className="w-full h-[500px] object-cover rounded-xl"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#344c3d]/10 text-[#344c3d] mb-6">
                <span className="text-sm font-medium">Our Journey</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#344c3d] mb-6 font-['Clash_Display'] leading-tight">
                From Vision to Global Movement
              </h2>
              
              <div className="h-1 w-20 bg-[#344c3d]/20 mb-8"></div>
              
              <p className="text-[#4a6d57] text-lg leading-relaxed mb-6">
                Founded in 2018, Sage Media began with a simple mission: to showcase the beauty and talent of African models to the world. What started as a small platform has grown into a global movement.
              </p>
              
              <p className="text-[#4a6d57] text-lg leading-relaxed mb-8">
                We've pioneered innovative approaches to model discovery, leveraging technology to break down geographical barriers and create opportunities previously unavailable to African talent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#344c3d]" />
                  </div>
                  <span className="text-[#4a6d57] font-medium">Global Reach</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#344c3d]" />
                  </div>
                  <span className="text-[#4a6d57] font-medium">Industry Recognition</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section with Elegant Cards */}
      <div className="py-24 px-4 bg-[#344c3d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-['Clash_Display'] max-w-3xl mx-auto leading-tight">
              Creating Opportunities Through Innovation
            </h2>
            <div className="h-1 w-24 bg-white/20 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Global Platform", desc: "Connecting African models with international opportunities and industry professionals." },
              { icon: Award, title: "Fair Voting", desc: "Transparent and secure voting system ensuring integrity in all our competitions." },
              { icon: Users, title: "Community", desc: "Building supportive networks for aspiring models to learn, grow, and succeed together." },
              { icon: Sparkles, title: "Innovation", desc: "Using cutting-edge technology to break industry barriers and create new possibilities." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl group hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#344c3d]/10 text-[#344c3d] text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#344c3d] mb-6 font-['Clash_Display'] max-w-3xl mx-auto leading-tight">
              The Visionaries Behind Our Success
            </h2>
            <div className="h-1 w-24 bg-[#344c3d]/20 mx-auto mb-6"></div>
            <p className="text-[#4a6d57] max-w-2xl mx-auto text-lg">
              Meet the dedicated team working tirelessly to transform the modeling industry and create opportunities for African talent.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO", image: "/team-1.jpg" },
              { name: "Michael Okafor", role: "Creative Director", image: "/team-2.jpg" },
              { name: "Amara Kone", role: "Head of Talent", image: "/team-3.jpg" }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <div className="aspect-[3/4] bg-[#344c3d]/5">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=400&width=300";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6">
                      <div className="flex gap-3">
                        <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors">
                          <span className="sr-only">Twitter</span>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#344c3d] mb-1">{member.name}</h3>
                <p className="text-[#4a6d57]/80">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 bg-[#f8f5f0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#344c3d]/10 text-[#344c3d] mb-6">
                <span className="text-sm font-medium">Our Values</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#344c3d] mb-6 font-['Clash_Display'] leading-tight">
                Principles That Guide Us
              </h2>
              
              <div className="h-1 w-20 bg-[#344c3d]/20 mb-8"></div>
              
              <div className="space-y-8">
                {[
                  { title: "Diversity & Inclusion", desc: "We celebrate the rich diversity of African beauty in all its forms." },
                  { title: "Integrity & Transparency", desc: "We operate with honesty and openness in all our competitions and initiatives." },
                  { title: "Innovation & Excellence", desc: "We constantly push boundaries to create better opportunities for our models." },
                  { title: "Community & Support", desc: "We foster a nurturing environment where models can grow and thrive." }
                ].map((value, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#344c3d] flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#344c3d] mb-2">{value.title}</h3>
                      <p className="text-[#4a6d57] leading-relaxed">{value.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="rounded-xl overflow-hidden h-[250px]">
                    <img src="/values-1.jpg" alt="Our Values" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden h-[180px]">
                    <img src="/values-2.jpg" alt="Our Values" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="rounded-xl overflow-hidden h-[180px]">
                    <img src="/values-3.jpg" alt="Our Values" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden h-[250px]">
                    <img src="/values-4.jpg" alt="Our Values" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}