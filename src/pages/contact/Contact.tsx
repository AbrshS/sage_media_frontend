import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
    policyAgreement: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      policyAgreement: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/contact', formData);
      setShowSuccessDialog(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: '',
        policyAgreement: false
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this before the return statement
  const SuccessDialog = () => (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-[#344c3d]">
            Message Sent Successfully!
          </DialogTitle>
          <DialogDescription className="text-center text-[#49695c]">
            Thank you for reaching out. We have received your message and will get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="bg-[#344c3d] hover:bg-[#49695c] text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      {/* Add the SuccessDialog component right after the opening div */}
      <SuccessDialog />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 right-10 w-40 h-40 rounded-full border border-[#344c3d]/10 hidden lg:block"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full border border-[#344c3d]/10 hidden lg:block"></div>
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block">
            <div className="h-1 w-20 bg-[#6b8e6e] mx-auto mb-6"></div>
            <h1 className="text-5xl sm:text-6xl font-['Playfair_Display'] font-bold text-[#344c3d] mb-4">
              Contact Us
            </h1>
            <p className="text-[#49695c] text-lg max-w-2xl mx-auto">
              We're here to answer any questions you may have about our services, competitions, or opportunities.
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-5">
              {/* Left Side - Contact Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 bg-[#344c3d] text-white p-10 lg:p-12 relative overflow-hidden"
              >
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-80 h-80 rounded-full border border-white/30"></div>
                  <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full border border-white/30"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-12">
                    <h2 className="text-3xl font-['Playfair_Display'] font-bold mb-4">Let's Start a Conversation</h2>
                    <div className="h-1 w-16 bg-[#89b890] mb-6"></div>
                    <p className="text-white/80">
                      We'd love to hear from you. Reach out to us through any of these channels.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        icon: Phone, 
                        title: "Call Us",
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
                        className="flex items-start gap-5"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#89b890]/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-[#aee0ae]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          <p className="text-white/90 font-medium">{item.info}</p>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-white/20">
                    <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                    <div className="flex gap-4">
                      {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                        <a 
                          key={index}
                          href="#" 
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#89b890]/30 transition-colors"
                        >
                          <span className="sr-only">{social}</span>
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                            {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                            {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                            {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3 p-10 lg:p-16"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="mb-10">
                    <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#344c3d] mb-4">Send Us a Message</h2>
                    <div className="h-1 w-16 bg-[#6b8e6e] mb-6"></div>
                    <p className="text-[#49695c]">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#344c3d]">First Name</label>
                        <Input 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required
                          className="h-14 rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#344c3d]">Last Name</label>
                        <Input 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          required
                          className="h-14 rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#344c3d]">Email Address</label>
                        <Input 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="h-14 rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#344c3d]">Phone Number</label>
                        <Input 
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          required
                          className="h-14 rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#344c3d]">Subject</label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="h-14 rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#344c3d]">Message</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        required
                        className="min-h-[200px] rounded-lg border-[#aee0ae]/50 focus:border-[#6b8e6e] focus:ring-[#6b8e6e]/20 bg-white resize-none" 
                      />
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy"
                          name="policyAgreement"
                          type="checkbox"
                          checked={formData.policyAgreement}
                          onChange={handleCheckbox}
                          required
                          className="w-4 h-4 border-[#aee0ae]/50 rounded focus:ring-[#6b8e6e]"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="privacy" className="text-[#49695c]">
                          I agree to the <a href="#" className="text-[#6b8e6e] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#6b8e6e] hover:underline">Terms of Service</a>
                        </label>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-[#344c3d] hover:bg-[#49695c] text-white h-14 rounded-lg text-base font-medium transition-all duration-300 mt-4">
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                  
                  <div className="mt-10 pt-8 border-t border-[#aee0ae]/30 text-center">
                    <p className="text-[#49695c]">
                      Prefer to email us directly? <a href="mailto:contact@sagemedia.com" className="text-[#6b8e6e] font-medium hover:underline">contact@sagemedia.com</a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 rounded-3xl overflow-hidden shadow-lg h-[400px] relative"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126766.39636892211!2d38.6440633!3d9.0119816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1652364518040!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
            className="absolute inset-0"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#344c3d] to-transparent h-24"></div>
          <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold text-[#344c3d]">Sage Media Headquarters</h3>
            <p className="text-[#49695c] text-sm">123 Fashion Street, Addis Ababa, Ethiopia</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}