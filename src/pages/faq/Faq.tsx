import { motion } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header - Simplified */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#344c3d]/10 text-[#344c3d] mb-4">
            <span className="text-sm font-medium">HELP CENTER</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          
          <div className="h-1 w-16 bg-[#344c3d] mx-auto mb-6"></div>
          
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our platform, competitions, and services.
          </p>
          
          {/* Search - Simplified */}
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#344c3d] focus:border-[#344c3d]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Category Navigation - Horizontal Tabs - Simplified */}
        <div className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {faqCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-5 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ${
                  activeCategory === index 
                    ? 'bg-[#344c3d] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs - Simplified Accordion */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center">
             
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
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
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all duration-300"
                >
                  <span className="text-lg font-medium text-gray-900 pr-8">{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    activeIndex === index ? 'bg-[#344c3d]' : 'bg-gray-200'
                  }`}>
                    {activeIndex === index ? (
                      <Minus className="w-3 h-3 text-white" />
                    ) : (
                      <Plus className="w-3 h-3 text-gray-600" />
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
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support - Simplified */}
        <div className="bg-[#344c3d]/5 border border-[#344c3d]/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Our dedicated support team is ready to assist you with any inquiries not covered in our FAQ.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#344c3d] text-white rounded-md hover:bg-[#344c3d]/90 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}