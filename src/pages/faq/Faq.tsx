import { motion,  } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Shield, Image, Laptop } from 'lucide-react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
      icon: HelpCircle,
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

  // Add these imports at the top of the file

  return (
    <div className="min-h-screen bg-white py-20 mt-4 rounded-3xl">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#344c3d] mb-6 font-['Clash_Display']">
            Frequently Asked
            <span className="block mt-2">Questions</span>
          </h1>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-6 rounded-full text-lg border-2 border-[#344c3d]/10 focus:border-[#344c3d] focus:ring-0 transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#344c3d]/40" />
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#344c3d]/5 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-[#344c3d]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#344c3d]">{category.title}</h2>
              </div>
              
              <div className="space-y-3">
                {category.questions.map((faq, index) => (
                  <motion.div key={`${categoryIndex}-${index}`} className="bg-white">
                    <button
                      onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[#344c3d]/5 border-b-2 border-[#344c3d]/10 transition-all duration-300"
                    >
                      <span className="text-xl font-medium text-[#344c3d] pr-8">{faq.q}</span>
                      {activeIndex === index ? (
                        <Minus className="w-6 h-6 text-[#344c3d]" />
                      ) : (
                        <Plus className="w-6 h-6 text-[#344c3d]" />
                      )}
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
                      <div className="p-6 bg-[#344c3d]/5">
                        <p className="text-lg text-[#4a6d57] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[#4a6d57] text-lg">
            Still have questions? {" "}
            <a href="/contact" className="text-[#344c3d] font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}