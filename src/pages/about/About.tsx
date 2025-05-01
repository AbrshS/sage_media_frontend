import { useEffect, useRef, useState } from 'react';
import { Award, ChevronRight, Globe, Shield, Users } from 'lucide-react';

export default function About() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Simple scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop - 300 && 
              scrollPosition < sectionTop + sectionHeight - 300) {
            setActiveSection(index);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="bg-white">
      {/* Subtle navigation dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center gap-3">
          {['Hero', 'About', 'Mission', 'Team', 'Values'].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-[#344c3d] w-3 h-3' 
                  : 'bg-[#344c3d]/20 hover:bg-[#344c3d]/30'
              }`}
              aria-label={`Navigate to ${_} section`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section - Simple and Elegant */}
      <section 
        ref={el => sectionRefs.current[0] = el}
        className="relative min-h-[90vh] flex items-center"
      >
        <div className="absolute inset-0 ">
          {/* Simple overlay */}
          <div className="absolute inset-0 opacity-30">
            <img 
              src="/aboutus.png" 
              alt="About Us"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#344c3d]/90 to-[#344c3d]/80" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6">
              <span className="text-sm font-medium">OUR STORY</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Redefining African Beauty
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              We're on a mission to showcase African talent on the global stage, 
              breaking barriers and creating opportunities through innovation and community.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#344c3d] text-white rounded-md hover:bg-[#344c3d]/90 transition-colors font-medium">
                <span>Our Journey</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 text-white rounded-md hover:bg-white/5 transition-colors font-medium">
                <span>Meet Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Clean and Simple */}
      <section 
        ref={el => sectionRefs.current[1] = el}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="/about-story.jpg" 
                  alt="Our Story" 
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/aboutus.png";
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#344c3d]/10 text-[#344c3d] mb-4">
                <span className="text-sm font-medium">About Us</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Our Journey Since 2018
              </h2>
              
              <div className="h-1 w-16 bg-[#344c3d] mb-6"></div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded in 2018, Sage Media began with a simple mission: to showcase the beauty and talent of African models to the world. What started as a small platform has grown into a global movement.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                We've pioneered innovative approaches to model discovery, leveraging technology to break down geographical barriers and create opportunities previously unavailable to African talent.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center mt-1">
                    <Globe className="w-5 h-5 text-[#344c3d]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Global Reach</h4>
                    <p className="text-gray-600 text-sm">Connecting talent with international opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center mt-1">
                    <Shield className="w-5 h-5 text-[#344c3d]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Integrity</h4>
                    <p className="text-gray-600 text-sm">Fair and transparent voting systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Simple and Clean */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "5000+", label: "Models Registered" },
              { number: "150+", label: "Competitions Worldwide" },
              { number: "1M+", label: "Votes Cast" },
              { number: "80+", label: "Countries Represented" }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-3xl font-bold text-[#344c3d] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Simple Cards */}
      <section 
        ref={el => sectionRefs.current[2] = el}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#344c3d]/10 text-[#344c3d] mb-4">
              <span className="text-sm font-medium">Our Mission</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Creating Opportunities Through Innovation
            </h2>
            
            <div className="h-1 w-16 bg-[#344c3d] mx-auto mb-6"></div>
            
            <p className="text-gray-700">
              We're committed to transforming the modeling industry by creating platforms that showcase African talent and connect them with global opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: "Global Platform", 
                desc: "Connecting African models with international opportunities and industry professionals."
              },
              { 
                icon: Shield, 
                title: "Fair Voting", 
                desc: "Transparent and secure voting system ensuring integrity in all our competitions."
              },
              { 
                icon: Users, 
                title: "Community", 
                desc: "Building supportive networks for aspiring models to learn, grow, and succeed together."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#344c3d]/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#344c3d]" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Simple and Elegant */}
      <section 
        ref={el => sectionRefs.current[3] = el}
        className="py-20 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#344c3d]/10 text-[#344c3d] mb-4">
              <span className="text-sm font-medium">Our Team</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              The Visionaries Behind Our Success
            </h2>
            
            <div className="h-1 w-16 bg-[#344c3d] mx-auto mb-6"></div>
            
            <p className="text-gray-700">
              Meet the dedicated team working tirelessly to transform the modeling industry and create opportunities for African talent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Sarah Johnson", 
                role: "Founder & CEO", 
                image: "/team-1.jpg"
              },
              { 
                name: "Michael Okafor", 
                role: "Creative Director", 
                image: "/team-2.jpg"
              },
              { 
                name: "Amara Kone", 
                role: "Head of Talent", 
                image: "/team-3.jpg"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-[3/4]">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=400&width=300";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#344c3d]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Simple and Clean */}
      <section 
        ref={el => sectionRefs.current[4] = el}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#344c3d]/10 text-[#344c3d] mb-4">
                <span className="text-sm font-medium">Our Values</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Principles That Guide Us
              </h2>
              
              <div className="h-1 w-16 bg-[#344c3d] mb-6"></div>
              
              <div className="space-y-6">
                {[
                  { title: "Diversity & Inclusion", desc: "We celebrate the rich diversity of African beauty in all its forms, ensuring representation across the continent." },
                  { title: "Integrity & Transparency", desc: "We operate with honesty and openness in all our competitions and initiatives, building trust with our community." },
                  { title: "Innovation & Excellence", desc: "We constantly push boundaries to create better opportunities for our models through technological advancement." },
                  { title: "Community & Support", desc: "We foster a nurturing environment where models can grow and thrive with mentorship and resources." }
                ].map((value, index) => (
                  <div 
                    key={index}
                    className="flex gap-4"
                  >
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-[#344c3d]/10 flex items-center justify-center text-[#344c3d] font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/values-1.jpg" 
                      alt="Our Values" 
                      className="w-full h-[200px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/aboutus.png";
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/values-2.jpg" 
                      alt="Our Values" 
                      className="w-full h-[150px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/aboutus.png";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/values-3.jpg" 
                      alt="Our Values" 
                      className="w-full h-[150px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/aboutus.png";
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/values-4.jpg" 
                      alt="Our Values" 
                      className="w-full h-[200px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/aboutus.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple and Elegant */}
      <section className="py-16 px-4 bg-[#344c3d] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Movement?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Whether you're a model looking for opportunities or a brand seeking talent, 
            we invite you to be part of our growing community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white text-[#344c3d] rounded-md hover:bg-gray-100 transition-colors font-medium">
              Apply as Model
            </button>
            <button className="px-6 py-3 bg-transparent border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors font-medium">
              Partner with Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}