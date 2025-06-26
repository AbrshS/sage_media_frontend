
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <img src="/logo.png" alt="Sage Media" className="h-8 mb-4" />
            <p className="text-gray-600 text-sm mb-4">
              Empowering African beauty through innovative digital platforms.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Youtube, href: "#" }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#344c3d] transition-colors duration-300 group"
                >
                  <item.Icon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-medium text-base mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Press Kit", "Contact"].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-[#344c3d] text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-medium text-base mb-4">Features</h4>
            <ul className="space-y-2">
              {["Competitions", "Portfolio", "Voting System", "Agency Connect"].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-[#344c3d] text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 font-medium text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-500 text-sm">123 Fashion Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500 text-sm">+234 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500 text-sm">info@sagemedia.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter - Simple version */}
        <div className="border-t border-gray-100 pt-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-gray-900 font-medium text-base mb-1">Stay updated</h4>
              <p className="text-gray-500 text-sm">Subscribe to our newsletter</p>
            </div>
            <div className="flex max-w-md w-full">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#344c3d] focus:border-[#344c3d]"
              />
              <button className="bg-[#344c3d] hover:bg-[#2a3e31] text-white px-4 py-2 rounded-r-md text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-4 md:mb-0">
            © 2024 Sage Media. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}