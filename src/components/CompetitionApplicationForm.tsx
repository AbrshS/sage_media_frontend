"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

// Constants
const API_BASE_URL = "http://localhost:3000";

interface CompetitionApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  competitionId: string
}

export default function CompetitionApplicationForm({
  isOpen,
  onClose,
  competitionId,
}: CompetitionApplicationFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    address: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    email: "",
    portraitPhoto: null as File | null,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation
  const navigate = useNavigate();

  // Load user data when form opens
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          email: user.email || prev.email
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Name should contain only letters, spaces, hyphens and apostrophes";
    }

    // Age validation
    const age = parseInt(formData.age);
    if (!formData.age) {
      errors.age = "Age is required";
    } else if (isNaN(age) || age < 16 || age > 45) {
      errors.age = "Age must be between 16 and 45";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    // Alternate phone validation - only if provided
    if (formData.alternatePhoneNumber && !phoneRegex.test(formData.alternatePhoneNumber)) {
      errors.alternatePhoneNumber = "Please enter a valid phone number";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Please enter a complete address";
    }

    // Photo validation
    if (!formData.portraitPhoto) {
      errors.portraitPhoto = "Portrait photo is required";
    } else {
      const file = formData.portraitPhoto;
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        errors.portraitPhoto = "Please upload a JPEG or PNG image";
      } else if (file.size > maxSize) {
        errors.portraitPhoto = "Image must be less than 5MB";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files?.[0] || null,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('modelToken');
    if (!token) {
      setError('You must be logged in to apply');
      setLoading(false);
      toast.error('Authentication required');
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('competition', competitionId);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('email', formData.email);
    
    if (formData.alternatePhoneNumber) {
      formDataToSend.append('alternatePhoneNumber', formData.alternatePhoneNumber);
    }
    
    if (formData.portraitPhoto) {
      formDataToSend.append('portraitPhoto', formData.portraitPhoto);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/applications`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        toast.success('Application submitted successfully!');
        onClose();
      } else {
        setError(response.data?.message || 'Failed to submit application');
        toast.error(response.data?.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Application error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-screen fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#f5f5f0] border border-[#344c3d]/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#344c3d] text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold font-['Clash_Display']">Competition Application</h2>
          <p className="text-white/80 mt-1">Please complete all required fields</p>
        </div>
        
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-[#344c3d] font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#344c3d] font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all"
                placeholder="your.email@example.com"
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            
            {/* Age and Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-[#344c3d] font-medium mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="45"
                  className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all"
                  placeholder="Your age"
                  required
                />
                {formErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-[#344c3d] font-medium mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all"
                  placeholder="+1 (234) 567-8900"
                  required
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                )}
              </div>
            </div>
            
            {/* Alternate Phone Number */}
            <div>
              <label htmlFor="alternatePhoneNumber" className="block text-[#344c3d] font-medium mb-2">
                Alternate Phone Number <span className="text-[#344c3d]/60 text-sm font-normal">(Optional)</span>
              </label>
              <input
                id="alternatePhoneNumber"
                type="tel"
                name="alternatePhoneNumber"
                value={formData.alternatePhoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all"
                placeholder="+1 (234) 567-8900"
              />
              {formErrors.alternatePhoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.alternatePhoneNumber}</p>
              )}
            </div>
            
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-[#344c3d] font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#344c3d]/20 focus:border-[#344c3d] focus:ring-1 focus:ring-[#344c3d] outline-none transition-all resize-none"
                placeholder="Enter your full address"
                required
              ></textarea>
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>
            
            {/* Portrait Photo */}
            <div>
              <label htmlFor="portraitPhoto" className="block text-[#344c3d] font-medium mb-2">
                Portrait Photo <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="portraitPhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  name="portraitPhoto"
                  className="w-full text-[#344c3d] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#344c3d]/10 file:text-[#344c3d] hover:file:bg-[#344c3d]/20"
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.portraitPhoto && (
                <p className="text-red-500 text-xs mt-1">{formErrors.portraitPhoto}</p>
              )}
              <p className="text-[#344c3d]/60 text-xs mt-1">
                Upload a clear portrait photo. Max size: 5MB. Formats: JPEG, PNG
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#344c3d]/20 text-[#344c3d] rounded-lg hover:bg-[#344c3d]/10 active:bg-[#344c3d]/20 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#344c3d] text-white rounded-lg hover:bg-[#344c3d]/90 active:bg-[#344c3d]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}