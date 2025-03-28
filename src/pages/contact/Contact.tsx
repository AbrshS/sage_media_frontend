import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-20 px-4 mt-4 rounded-3xl">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#344c3d] space-y-8 lg:space-y-12 order-2 lg:order-1"
          >
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-4xl sm:text-5xl font-['Clash_Display'] font-bold">
                Let's Start a 
                <span className="block">Conversation</span>
              </h1>
              <p className="text-[#4a6d57] text-base sm:text-lg max-w-md">
                Have questions or want to collaborate? We're here to help bring your vision to life.
              </p>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {[
                { 
                  icon: Phone, 
                  title: "Call Us Anytime",
                  info: "+234 123 456 7890",
                  desc: "Mon-Fri from 8am to 5pm WAT"
                },
                { 
                  icon: Mail,
                  title: "Email Us",
                  info: "contact@sagemedia.com",
                  desc: "We'll respond within 24 hours"
                },
                { 
                  icon: MapPin,
                  title: "Visit Our Office",
                  info: "123 Fashion Street",
                  desc: "Addis Ababa, Ethiopia"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-4 lg:gap-6"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#344c3d] flex items-center justify-center">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-[#4a6d57] font-medium">{item.info}</p>
                    <p className="text-[#4a6d57]/60 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#344c3d] rounded-3xl p-6 sm:p-8 lg:p-12 order-1 lg:order-2"
          >
            <div className="flex items-center gap-4 mb-6 lg:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#344c3d]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Send a Message</h2>
                <p className="text-white/80">We'd love to hear from you</p>
              </div>
            </div>

            <form className="space-y-5 lg:space-y-6">
              <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <Input 
                    placeholder="John Doe"
                    className="h-12 sm:h-14 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input 
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 sm:h-14 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Subject</label>
                <Input 
                  placeholder="How can we help?"
                  className="h-12 sm:h-14 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Message</label>
                <Textarea 
                  placeholder="Write your message here..."
                  className="min-h-[180px] sm:min-h-[200px] rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white resize-none" 
                />
              </div>

              <Button className="w-full bg-white hover:bg-white/90 text-[#344c3d] h-12 sm:h-14 rounded-xl text-base font-medium transition-all duration-300">
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}