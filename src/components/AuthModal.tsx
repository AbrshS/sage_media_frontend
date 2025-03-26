import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock, User, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthModal({ isOpen, onClose, onSuccess, mode, setMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setGeneralError(null);
    }
  }, [isOpen, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }
    
    // Email validation for both modes
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError(null);
    
    try {
      const endpoint = mode === 'signup' ? '/api/public/register' : '/api/public/login';
      const dataToSend = mode === 'signup' 
        ? { fullName: formData.fullName, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, dataToSend);
      
      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(mode === 'signup' ? 'Registration successful!' : 'Login successful!');
        
        // Call onSuccess to notify parent component
        onSuccess();
      } else {
        setGeneralError('Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setGeneralError(
        error.response?.data?.message || 
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#f5f5f0] border border-[#344c3d]/20 rounded-xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#344c3d] text-2xl font-bold">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#344c3d]/70 hover:text-[#344c3d] transition-colors p-2 hover:bg-[#344c3d]/10 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {generalError && (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg mb-6">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-[#344c3d] text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#344c3d]/50" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                    errors.fullName ? 'border-red-500' : 'border-[#344c3d]/20'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-[#344c3d] text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#344c3d]/50" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-[#344c3d] text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#344c3d]/50" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-[#344c3d]/20'
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-[#344c3d] text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#344c3d]/50" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:border-[#344c3d] text-[#344c3d] transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#344c3d]/20'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#344c3d] text-white rounded-lg hover:bg-[#344c3d]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#344c3d]/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {mode === 'login' ? 'Logging in...' : 'Signing up...'}
              </span>
            ) : (
              <span>{mode === 'login' ? 'Log In' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#344c3d]/70 text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-1 text-[#344c3d] font-medium hover:underline focus:outline-none"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}