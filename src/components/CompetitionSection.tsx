"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Calendar, Clock, Award, ArrowRight, Sparkles, TrendingUp, Users, Globe } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import AuthModal from "./AuthModal"
import { useNavigate } from "react-router-dom"

// Keep existing interfaces and constants
interface Competition {
  _id: string
  title: string
  description: string
  competitionImage: string
  startDate: string
  endDate: string
  applicationFee: number
  status: 'upcoming' | 'active' | 'completed'
  daysUntilStart: number
  daysUntilEnd: number
}

interface ApiResponse {
  success: boolean
  data: Competition[]
  totalCompetitions: number
  currentPage: number
  totalPages: number
  error?: string
}

// Keep sample data and API constants
const sampleCompetitions = [
  {
    _id: "1",
    title: "Summer Fashion Show 2024",
    description: "Join us for the most prestigious fashion event of the summer season. Showcase your talent and style.",
    image: "/placeholder.svg?height=240&width=360",
  },
  {
    _id: "2",
    title: "Model of the Year 2024",
    description: "Annual competition to discover the next top model. Open for all aspiring models.",
    image: "/placeholder.svg?height=240&width=360",
  },
  {
    _id: "3",
    title: "Photogenic Contest",
    description: "Show your best angles and win amazing prizes in our photogenic competition.",
    image: "/placeholder.svg?height=240&width=360",
  },
]

const API_BASE_URL = "http://localhost:3000";
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

// Enhanced error alert with luxury styling
const ErrorAlert = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-5 text-red-500 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-r-lg shadow-lg"
  >
    <AlertCircle className="h-5 w-5" />
    <p className="text-sm font-medium">{message}</p>
  </motion.div>
)

// Keep ApplicationForm component with its existing functionality
const ApplicationForm = ({
  isOpen,
  onClose,
  competitionId,
}: {
  isOpen: boolean
  onClose: () => void
  competitionId: string
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    address: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    email: "",
    portraitPhoto: null as File | null,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Name validation - improved to check for proper name format
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Name must be at least 3 characters"
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Name should contain only letters, spaces, hyphens and apostrophes"
    }

    // Age validation - improved to ensure it's a valid number
    const age = parseInt(formData.age)
    if (!formData.age) {
      errors.age = "Age is required"
    } else if (isNaN(age) || age < 16 || age > 45) {
      errors.age = "Age must be between 16 and 45"
    }

    // Email validation - improved regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation - improved to handle international formats
    const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required"
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number"
    }

    // Alternate phone validation - only if provided
    if (formData.alternatePhoneNumber && !phoneRegex.test(formData.alternatePhoneNumber)) {
      errors.alternatePhoneNumber = "Please enter a valid phone number"
    }

    // Address validation - improved to check minimum length
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    } else if (formData.address.trim().length < 5) {
      errors.address = "Please enter a complete address"
    }

    // Photo validation - improved to check file type and size
    if (!formData.portraitPhoto) {
      errors.portraitPhoto = "Portrait photo is required"
    } else {
      const file = formData.portraitPhoto
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        errors.portraitPhoto = "Please upload a JPEG or PNG image"
      } else if (file.size > maxSize) {
        errors.portraitPhoto = "Image must be less than 5MB"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      setFormData((prev) => ({
        ...prev,
        [name]: fileInput.files?.[0] || null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Add this to get user data from localStorage
  // Fix 1: Update the userData state declaration
  const [, setUserData] = useState<{fullName?: string, email?: string} | null>(null);
  
  // Fix 2: Update the isAuthenticated state usage
  const [] = useState(false);
  
  // Fix 3: Add setMode to AuthModal props
  const [] = useState<'login' | 'signup'>('login');
  
  // Load user data when form opens
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserData(user); // Now properly typed
        
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('modelToken');
    if (!token) {
      setError('You must be logged in to apply');
      setLoading(false);
      return;
    }
    
    const formDataToSend = new FormData();
    // Ensure competitionId is properly added to FormData
    formDataToSend.append('competition', competitionId); // Changed from 'competitionId' to 'competition'
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
      }
    } catch (error: any) {
      console.error('Application error:', error);
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null

  // Inside the ApplicationForm component's return statement
  return (
    <div className="w-screen fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#f5f5f0] border border-[#34c3d]/20 rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#344c3d] text-2xl font-bold">Apply for Competition</h2>
          <button 
            onClick={onClose} 
            className="text-[#344c3d]/70 hover:text-[#344c3d] transition-colors p-2 hover:bg-[#344c3d]/10 rounded-full"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="flex flex-col items-center gap-2 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
            
            {(error.includes('logged in') || error.includes('session') || error.includes('sign in')) && (
              <button
                onClick={() => navigate('/model/auth', { 
                  state: { 
                    returnTo: window.location.pathname,
                    competitionId 
                  } 
                })}
                className="mt-2 bg-[#344c3d] text-white px-4 py-2 rounded-full text-sm hover:bg-[#344c3d]/90 transition-colors"
              >
                Sign in now
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-[#344c3d] font-semibold">Personal Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-[#344c3d] text-sm">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  formErrors.fullName ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="age" className="block text-[#344c3d] text-sm">
                  Age *
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  min="16"
                  max="45"
                  placeholder="Age"
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                    formErrors.age ? 'border-red-500' : 'border-[#344c3d]/20'
                  }`}
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                {formErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-[#344c3d] text-sm">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  formErrors.address ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-[#344c3d] font-semibold">Contact Information</h3>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#344c3d] text-sm">
                Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  formErrors.email ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-[#344c3d] text-sm">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  formErrors.phoneNumber ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="alternatePhoneNumber" className="block text-[#344c3d] text-sm">
                Alternate Phone Number
              </label>
              <input
                id="alternatePhoneNumber"
                type="tel"
                name="alternatePhoneNumber"
                placeholder="Enter your alternate phone number"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  formErrors.alternatePhoneNumber ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                value={formData.alternatePhoneNumber}
                onChange={handleChange}
              />
              {formErrors.alternatePhoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.alternatePhoneNumber}</p>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h3 className="text-[#344c3d] font-semibold">Photos</h3>
            
            <div className="space-y-2">
              <label htmlFor="portraitPhoto" className="block text-[#344c3d] text-sm">
                Portrait Photo *
              </label>
              <div className={`w-full px-4 py-3 bg-white border rounded-lg focus-within:ring-2 focus-within:ring-[#344c3d]/50 focus-within:border-[#344c3d] transition-all duration-200 ${
                formErrors.portraitPhoto ? 'border-red-500' : 'border-[#344c3d]/20'
              }`}>
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
};

interface Props {
  initialCompetition?: string | null;
}

export default function CompetitionSection({ }: Props) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const competitionsRef = useRef<HTMLDivElement>(null);
  
  // Add these for authentication handling
  const navigate = useNavigate();
  
  // Since useModelAuth is causing issues, let's use localStorage directly
  const [, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode] = useState<'login' | 'signup'>('login');
  
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('modelToken');
    if (token) {
setIsAuthenticated(() => true);
    }
  }, []);

  const fetchCompetitions = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/competitions?page=${page}&limit=6`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch competitions');
      }
      
      if (result.success && Array.isArray(result.data)) {
        const formattedCompetitions = result.data.map(competition => ({
          ...competition,
          image: competition.competitionImage 
            ? `${API_BASE_URL}/${competition.competitionImage.replace(/\\/g, "/")}` 
            : "/placeholder.svg?height=240&width=360"
        }));
        
        setCompetitions(formattedCompetitions);
        setHasMore(result.currentPage < result.totalPages);
      } else {
        throw new Error("Invalid data structure received from API");
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      if (import.meta.env.DEV || retryCount >= RETRY_COUNT) {
        console.log('Using sample competition data');
        // Convert sample data to match Competition interface
        const formattedSampleData: Competition[] = sampleCompetitions.map(comp => ({
          _id: comp._id,
          title: comp.title,
          description: comp.description,
          competitionImage: comp.image,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          applicationFee: 0,
          status: 'upcoming',
          daysUntilStart: 0,
          daysUntilEnd: 30
        }));
        setCompetitions(formattedSampleData);
        setHasMore(false);
      } else {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => fetchCompetitions(retryCount + 1), delay);
        setError('Failed to load competitions. Retrying...');
      }
    } finally {
      setLoading(false);
    }
  }, [page]);
  
  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  // Add auth state check effect
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('modelToken');
      const user = localStorage.getItem('user');
      if (token && user) {
        setIsAuthenticated(true);
      } else {
setIsAuthenticated(() => false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleApply = (competitionId: string) => {
    const token = localStorage.getItem('modelToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setSelectedCompetition(competitionId);
      setFormOpen(true);
    } else {
      setIsAuthenticated(false);
      toast.error('Please sign in to apply for competitions');
      navigate('/login', { 
        state: { 
          returnTo: '/competitions',
          competitionId 
        } 
      });
    }
  };

  // Update handleAuthSuccess
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    // Check if we have a pending competition application
    if (selectedCompetition) {
      setFormOpen(true);
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedCompetition(null);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // New function to determine status color
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'active':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          text: 'text-white',
          icon: <TrendingUp className="w-3 h-3 mr-1" />
        };
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          text: 'text-white',
          icon: <Calendar className="w-3 h-3 mr-1" />
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
    }
  };

  return (
    <div className="w-full py-24 sm:py-32 bg-gradient-to-b from-[#f8f5f0] to-[#f0ebe0] -mt-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#344c3d]/10 to-transparent pointer-events-none"></div>
      <motion.div 
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-[#344c3d]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border border-[#344c3d]/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-4 max-w-[1920px] relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-4 px-4 py-1.5 bg-[#344c3d]/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[#344c3d] mr-2" />
            <span className="text-[#344c3d] font-medium text-sm">Exclusive Opportunities</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#344c3d] mb-6 font-['Clash_Display'] tracking-tight"
          >
            Fashion Competitions
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#344c3d] to-transparent mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[#344c3d]/80 mx-auto text-lg leading-relaxed"
          >
            Showcase your talent on the global stage. Our prestigious competitions connect you with 
            industry leaders, offering unparalleled exposure and career-defining opportunities.
          </motion.p>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Enhanced Competition Cards */}
        <div 
          ref={competitionsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8"
        >
          {loading ? (
            // Enhanced Loading Skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div 
                key={`skeleton-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#344c3d]/10 animate-pulse shadow-xl"
              >
                <div className="h-80 bg-[#344c3d]/5"></div>
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-[#344c3d]/5 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-[#344c3d]/5 rounded-lg w-full"></div>
                  <div className="h-4 bg-[#344c3d]/5 rounded-lg w-5/6"></div>
                  <div className="h-12 bg-[#344c3d]/5 rounded-lg w-full mt-6"></div>
                </div>
              </motion.div>
            ))
          ) : competitions.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-3xl shadow-xl max-w-lg mx-auto"
              >
                <Award className="w-16 h-16 text-[#344c3d]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#344c3d] mb-3">No Competitions Available</h3>
                <p className="text-[#344c3d]/60">
                  We're preparing something extraordinary. Check back soon for exclusive modeling opportunities.
                </p>
              </motion.div>
            </div>
          ) : (
            // Enhanced Competition Cards with luxury styling
            competitions.map((competition, index) => (
              <motion.div
                key={competition._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden border border-[#344c3d]/10 transition-all duration-500 shadow-xl hover:shadow-2xl hover:translate-y-[-8px] h-full flex flex-col">
                  {/* Enhanced Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <img 
                      src={`${API_BASE_URL}/${competition.competitionImage}`}
                      alt={competition.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=240&width=360";
                      }}
                    />
                    
                    {/* Enhanced Status Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className={`${getStatusStyles(competition.status).bg} ${getStatusStyles(competition.status).text} px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg`}>
                        {getStatusStyles(competition.status).icon}
                        <span>{competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}</span>
                      </div>
                    </div>
                    
                    {/* Social-media style engagement indicators */}
                    <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-white">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 500) + 50}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 5} countries</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Content Container */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-[#344c3d] to-[#5d8a6f]"></div>
                      <h3 className="text-2xl font-bold text-[#344c3d] font-['Clash_Display'] line-clamp-2">
                        {competition.title}
                      </h3>
                    </div>
                    
                    <p className="text-[#344c3d]/70 mb-6 text-base leading-relaxed line-clamp-3 flex-grow">
                      {competition.description}
                    </p>
                    
                    {/* Enhanced Stats Section */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#f8f5f0] rounded-xl p-3 flex flex-col items-center">
                        <span className="text-[#344c3d]/60 text-xs uppercase tracking-wider mb-1">Starts</span>
                        <span className="text-[#344c3d] font-medium">
                          {new Date(competition.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="bg-[#f8f5f0] rounded-xl p-3 flex flex-col items-center">
                        <span className="text-[#344c3d]/60 text-xs uppercase tracking-wider mb-1">Remaining</span>
                        <span className="text-[#344c3d] font-medium">{competition.daysUntilEnd} days</span>
                      </div>
                    </div>

                    {/* Enhanced Apply Button */}
                    <button
                      onClick={() => handleApply(competition._id)}
                      disabled={competition.status === 'completed'}
                      className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center gap-2
                        ${competition.status === 'completed' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#344c3d] to-[#5d8a6f] text-white hover:shadow-lg hover:shadow-[#344c3d]/20'
                        }`}
                    >
                      {competition.status === 'completed' ? (
                        'Competition Ended'
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Enhanced "Load More" button with luxury styling */}
        {!loading && competitions.length > 0 && hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-[#344c3d]/20 text-[#344c3d] rounded-full hover:bg-[#344c3d]/5 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <span>Discover More Competitions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
       
      </div>
      
      {/* Application Form Modal */}
      {formOpen && selectedCompetition && (
        <ApplicationForm
          isOpen={formOpen}
          onClose={closeForm}
          competitionId={selectedCompetition}
        />
      )}
      
      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal 
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          mode={authMode}

          onSuccess={handleAuthSuccess} setMode={function (): void {
            throw new Error("Function not implemented.")
          } }        />
      )}
    </div>
  );
}