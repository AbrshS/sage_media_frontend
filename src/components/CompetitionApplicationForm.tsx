"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Link, Instagram, 
  Facebook, Twitter, Upload, X, AlertCircle, Globe, Briefcase 
} from "lucide-react"
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

interface FormData {
  fullName: string
  age: string
  gender: string
  phoneNumber: string
  alternatePhoneNumber: string
  email: string
  address: {
    city: string
    country: string
  }
  experience: string
  portfolio: string
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
  }
  portraitPhoto: File | null
}

export default function CompetitionApplicationForm({
  isOpen,
  onClose,
  competitionId,
}: CompetitionApplicationFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    email: "",
    address: {
      city: "",
      country: ""
    },
    experience: "",
    portfolio: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: ""
    },
    portraitPhoto: null
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
  const [userIP, setUserIP] = useState<string>('');
  const totalSteps = 4;

  const navigate = useNavigate();

  // Add the IP and application check effect
  useEffect(() => {
    const checkApplication = async () => {
      try {
        // Get user's IP
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const userIP = ipResponse.data.ip;
        setUserIP(userIP);

        // Check if user has already applied
        const response = await axios.get(
          `${API_BASE_URL}/api/applications/check/${competitionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('modelToken')}`,
              'IP-Address': userIP
            }
          }
        );
        
        if (response.data.hasApplied) {
          setHasAlreadyApplied(true);
          toast.error('You have already applied for this competition');
          onClose();
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    checkApplication();
  }, [competitionId, onClose]);

  // Load user data when form opens
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFormErrors(prev => ({
          ...prev,
          portraitPhoto: 'File size should be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({ ...prev, portraitPhoto: file }));
      setFormErrors(prev => ({ ...prev, portraitPhoto: '' }));
    }
  };

  // Form validation
  // Update the validateStep function
  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    switch(step) {
      case 1: // Personal Information
        if (!formData.fullName.trim()) errors.fullName = "Full name is required";
        if (!formData.age) errors.age = "Age is required";
        if (!formData.gender) errors.gender = "Gender is required";
        if (!formData.email) errors.email = "Email is required";
        break;
      
      case 2: // Contact Information
        if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
        if (!formData.address.city) errors.city = "City is required";
        if (!formData.address.country) errors.country = "Country is required";
        break;
      
      case 3: // Professional Information
        if (!formData.experience) errors.experience = "Experience is required";
        // Portfolio and social media are now optional
        break;
      
      case 4: // Photo Upload
        if (!formData.portraitPhoto) errors.portraitPhoto = "Portrait photo is required";
        break;
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Update the portfolio input label to indicate optional
  <>
    // Update the portfolio input label to indicate optional
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Portfolio Link <span className="text-gray-400 text-sm">(optional)</span>
    </label>
    // Update social media labels to indicate optional
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Instagram <span className="text-gray-400 text-sm">(optional)</span>
    </label><label className="block text-sm font-medium text-gray-700 mb-1">
      Facebook <span className="text-gray-400 text-sm">(optional)</span>
    </label><label className="block text-sm font-medium text-gray-700 mb-1">
      Twitter <span className="text-gray-400 text-sm">(optional)</span>
    </label></>
  
  // Update the handleSubmit function to ensure proper API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
  
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    // Add basic fields
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('alternatePhoneNumber', formData.alternatePhoneNumber || '');
    formDataToSend.append('email', formData.email);
    formDataToSend.append('experience', formData.experience);
    
    // Format address fields with square brackets notation
    formDataToSend.append('address[city]', formData.address.city);
    formDataToSend.append('address[country]', formData.address.country);
  
    // Add optional fields
    if (formData.portfolio) {
      formDataToSend.append('portfolio', formData.portfolio);
    }
  
    // Add social media if provided
    if (formData.socialMedia.instagram) {
      formDataToSend.append('socialMedia[instagram]', formData.socialMedia.instagram);
    }
    if (formData.socialMedia.facebook) {
      formDataToSend.append('socialMedia[facebook]', formData.socialMedia.facebook);
    }
    if (formData.socialMedia.twitter) {
      formDataToSend.append('socialMedia[twitter]', formData.socialMedia.twitter);
    }
  
    // Add photo if exists
    if (formData.portraitPhoto) {
      formDataToSend.append('portraitPhoto', formData.portraitPhoto);
    }
  
    // Add competition ID
    formDataToSend.append('competition', competitionId);
  
    try {
      // Update in your handleSubmit function, after creating formDataToSend
      formDataToSend.append('ipAddress', userIP);
      
      // Update the axios post call
      const response = await axios.post(
        `${API_BASE_URL}/api/applications`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('modelToken')}`,
            'Content-Type': 'multipart/form-data',
            'IP-Address': userIP
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Application submitted successfully!');
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && !hasAlreadyApplied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
          >
            {/* Form Header */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Competition Application</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > index + 1 
                        ? 'bg-green-500 text-white' 
                        : currentStep === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                      <div className={`w-full h-1 ${
                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.age ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your age"
                        />
                      </div>
                      {formErrors.age && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.gender && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {formErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="alternatePhoneNumber"
                          value={formData.alternatePhoneNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter alternate phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your city"
                        />
                      </div>
                      {formErrors.city && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.country ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your country"
                        />
                      </div>
                      {formErrors.country && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.experience ? 'border-red-500' : 'border-gray-300'
                          }`}
                          rows={4}
                          placeholder="Describe your modeling experience"
                        />
                      </div>
                      {formErrors.experience && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.experience}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio Link
                      </label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.portfolio ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your portfolio URL"
                        />
                      </div>
                      {formErrors.portfolio && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.portfolio}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="socialMedia.instagram"
                            value={formData.socialMedia.instagram}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Instagram handle"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook
                        </label>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="socialMedia.facebook"
                            value={formData.socialMedia.facebook}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Facebook profile"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter
                        </label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="socialMedia.twitter"
                            value={formData.socialMedia.twitter}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Twitter handle"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Photo Upload */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Upload</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portrait Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {formData.portraitPhoto ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(formData.portraitPhoto)}
                              alt="Portrait preview"
                              className="mx-auto h-48 w-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, portraitPhoto: null }))}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove photo
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  name="portraitPhoto"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                      {formErrors.portraitPhoto && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.portraitPhoto}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep(currentStep)) {
                          setCurrentStep(prev => prev + 1);
                        }
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}