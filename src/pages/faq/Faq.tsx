import { motion } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle, Award } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Shield, Image, Laptop, Trophy } from 'lucide-react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          q: "How do I create a model profile?",
          a: "Creating a profile is simple. Click on 'Sign Up', choose 'Model Account', and follow the guided steps to complete your profile with photos and information."
        },
        {
          q: "What are the requirements to join?",
          a: "To join as a model, you must be 18+ years old, have professional photos, and meet our community guidelines. We welcome diverse talent from across Africa."
        }
      ]
    },
    {
      title: "Competitions",
      icon: Trophy,
      questions: [
        {
          q: "How does voting work?",
          a: "Voting is conducted through our secure platform. Each vote is verified to ensure fairness, and results are updated in real-time on the leaderboard."
        },
        {
          q: "Can I participate in multiple competitions?",
          a: "Yes, you can participate in multiple competitions simultaneously, provided you meet each competition's specific requirements."
        }
      ]
    },
    {
      title: "Account & Security",
      icon: Shield,
      questions: [
        {
          q: "How do I reset my password?",
          a: "Go to the login page, click 'Forgot Password', and follow the instructions sent to your email. For security, links expire after 24 hours."
        },
        {
          q: "Is my personal information secure?",
          a: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information without consent."
        }
      ]
    },
      
    {
      title: "Portfolio Management",
      icon: Image,
      questions: [
        {
          q: "What types of photos should I upload?",
          a: "Upload high-quality professional photos showing diverse looks. Include headshots, full-body shots, and editorial style images. All photos must follow our community guidelines."
        },
        {
          q: "How often should I update my portfolio?",
          a: "We recommend updating your portfolio every 3-6 months with new content to keep your profile fresh and competitive."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Laptop,
      questions: [
        {
          q: "What devices/browsers are supported?",
          a: "Our platform works best on modern browsers (Chrome, Safari, Firefox, Edge). For the best experience, ensure your browser is updated to the latest version."
        },
        {
          q: "The website isn't loading properly, what should I do?",
          a: "First, clear your browser cache and cookies. If issues persist, check your internet connection or contact our support team."
        }
      ]
    }
  ];

  // Filter questions based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#AEE0AE]/30 to-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Luxury Header */}
        <div className="text-center mb-20 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#6B8E6E]"></div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#344C3D] mt-8 mb-6 font-['Playfair_Display']">
            Frequently Asked Questions
          </h1>
          
          <p className="text-[#49695C] text-lg max-w-2xl mx-auto mb-12">
            Find answers to common questions about our platform, competitions, and services.
          </p>
          
          {/* Luxury Search */}
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-full text-lg border-2 border-[#89B890]/30 focus:border-[#89B890] focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm shadow-sm placeholder-[#89B890]"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#89B890]" />
          </div>
        </div>

        {/* Category Navigation - Horizontal Tabs */}
        <div className="mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {faqCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-4 rounded-full flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
                  activeCategory === index 
                    ? 'bg-[#344C3D] text-white shadow-md' 
                    : 'bg-white/80 text-[#344C3D] hover:bg-[#89B890]/10 border border-[#89B890]/30'
                }`}
              >
                <category.icon className={`w-5 h-5 ${activeCategory === index ? 'text-[#89B890]' : 'text-[#6B8E6E]'}`} />
                <span className="font-medium">{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs - Luxury Accordion */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#89B890]/10">
          <div className="flex items-center gap-3 mb-8 border-b border-[#89B890]/20 pb-6">
            <div className="w-12 h-12 rounded-full bg-[#344C3D] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#6B8E6E]" />
            </div>
            <h2 className="text-2xl font-bold text-[#344C3D] font-['Playfair_Display']">
              {faqCategories[activeCategory].title}
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqCategories[activeCategory].questions.map((faq, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border border-[#89B890]/20 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#89B890]/5 transition-all duration-300"
                >
                  <span className="text-xl font-medium text-[#344C3D] pr-8">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    activeIndex === index ? 'bg-[#344C3D]' : 'bg-[#89B890]/20'
                  }`}>
                    {activeIndex === index ? (
                      <Minus className="w-4 h-4 text-[#89B890]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#89B890]" />
                    )}
                  </div>
                </button>
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: activeIndex === index ? "auto" : 0,
                    opacity: activeIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-[#AEE0AE]/20">
                    <p className="text-lg text-[#49695C] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support - Luxury Style */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-[#344C3D] text-white p-10 rounded-2xl shadow-lg relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 right-4 w-40 h-40 rounded-full border border-[#89B890]/50"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-[#89B890]/50"></div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 font-['Playfair_Display']">Still Have Questions?</h3>
          <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
            Our dedicated support team is ready to assist you with any inquiries not covered in our FAQ.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6B8E6E] text-white rounded-full hover:bg-[#89B890] transition-colors font-medium"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}