import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useModelAuth } from '@/contexts/ModelAuthContext';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Create a Loading component if you don't have one
const Loading = ({ size = "md", color = "currentColor" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClass} border-2 border-${color}/30 border-t-${color} rounded-full`}
    />
  );
};

export default function ModelAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register, loading, error, isAuthenticated } = useModelAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a return URL in the location state
  const returnTo = location.state?.returnTo || '/model/dashboard';
  const competitionId = location.state?.competitionId;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (competitionId) {
        navigate('/competitions', { state: { openApplication: competitionId } });
      } else {
        navigate(returnTo);
      }
    }
  }, [isAuthenticated, navigate, returnTo, competitionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate login
    if (activeTab === 'login') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
        valid = false;
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      }
    } 
    // Validate registration
    else {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
        valid = false;
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        valid = false;
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
      } else {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        toast.success('Registration successful!');
      }
      
      // Navigation will be handled by the useEffect
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error(error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-20 px-4 mt-4 rounded-3xl">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#344c3d] font-['Clash_Display']">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
            </h1>
            <p className="text-[#4a6d57] mt-2">
              {activeTab === 'login' 
                ? 'Sign in to access your model profile' 
                : 'Create an account to showcase your talent'}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>

                <div className="text-right">
                  <a href="#" className="text-sm text-[#344c3d] hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full bg-[#344c3d] hover:bg-[#344c3d]/90" disabled={loading}>
                  {loading ? <Loading size="sm" color="white" /> : 'Sign In'}
                </Button>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.fullName && <p className="text-red-500 text-sm">{formErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="regEmail"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regPassword">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="regPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300 text-[#344c3d] focus:ring-[#344c3d]"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="/terms" className="text-[#344c3d] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-[#344c3d] hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#344c3d] hover:bg-[#344c3d]/90" disabled={loading}>
                  {loading ? <Loading size="sm" color="white" /> : 'Create Account'}
                </Button>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[#344c3d] hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#344c3d] hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you'll join our community of African models and gain access to exclusive competitions and opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}