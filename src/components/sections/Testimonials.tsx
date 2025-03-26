import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Model",
      image: "testimonial1.png",
      quote: "Sage Media transformed my modeling career. The platform's reach and opportunities are unmatched in Africa.",
      rating: 5,
      achievement: "Winner of African Model of the Year 2023"
    },
    {
      name: "Michael Okonjo",
      role: "Agency Partner",
      image: "testimonial2.png",
      quote: "The quality of talent we discover through this platform is exceptional. It's revolutionizing the African modeling industry.",
      rating: 5,
      achievement: "Represented 50+ successful models"
    },
    {
      name: "Aisha Mohammed",
      role: "Competition Winner",
      image: "testimonial3.png",
      quote: "Winning the competition opened doors I never thought possible. The platform is truly empowering African beauty.",
      rating: 5,
      achievement: "Featured in Vogue Africa"
    }
  ];

  return (
    <section className="py-20 bg-[#344c3d] text-white mt-5 rounded-3xl">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-['Clash_Display']">
            Success Stories
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5">
                    <Quote className="w-3 h-3 text-[#344c3d]" />
                  </div>
                </div>
                <div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-white/80">{item.achievement}</p>
                </div>
              </div>

              <blockquote className="mb-6">
                <p className="text-lg leading-relaxed text-white/90">
                  "{item.quote}"
                </p>
              </blockquote>

              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-white/70">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}