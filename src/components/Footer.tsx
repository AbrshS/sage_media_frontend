import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#f5f5f0]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#344c3d]/5 via-transparent to-[#f5f5f0]/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#344c3d]/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl mb-24 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#344c3d] mb-4 font-['Clash_Display']">
                Stay in the Spotlight
              </h3>
              <p className="text-[#344c3d]/80">
                Get exclusive modeling opportunities and industry insights delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#344c3d]/5 border border-[#344c3d]/20 rounded-xl px-6 py-3 text-[#344c3d] placeholder:text-[#344c3d]/60 focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30"
              />
              <Button className="bg-[#344c3d] hover:bg-[#344c3d]/90 text-[#f5f5f0] px-6 rounded-xl">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <img src="/logo.png" alt="Sage Media" className="h-12" />
            <p className="text-[#344c3d]/80">
              Empowering African beauty through innovative digital platforms.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#344c3d]/10 flex items-center justify-center hover:bg-[#344c3d] transition-colors duration-300 group"
                >
                  <Icon className="w-5 h-5 text-[#344c3d] group-hover:text-[#f5f5f0]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {[
            {
              title: "Company",
              links: ["About Us", "Careers", "Press Kit", "Contact"]
            },
            {
              title: "Resources",
              links: ["Help Center", "Blog", "Newsletter", "Terms of Service"]
            },
            {
              title: "Features",
              links: ["Competitions", "Portfolio", "Voting System", "Agency Connect"]
            }
          ].map((column, index) => (
            <div key={index} className="space-y-6">
              <h4 className="text-[#344c3d] font-semibold text-lg">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-[#344c3d]/70 hover:text-[#344c3d] flex items-center group"
                    >
                      {link}
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#344c3d]/10">
          <p className="text-[#344c3d]/60 text-sm mb-4 md:mb-0">
            © 2024 Sage Media. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#344c3d]/60 hover:text-[#344c3d] text-sm">Privacy Policy</a>
            <a href="#" className="text-[#344c3d]/60 hover:text-[#344c3d] text-sm">Terms of Service</a>
            <a href="#" className="text-[#344c3d]/60 hover:text-[#344c3d] text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}