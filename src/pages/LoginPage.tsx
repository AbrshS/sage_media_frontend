import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import ForgotPassword from '../components/auth/ForgotPassword';

// API URL - verify this is correct
const API_URL = 'http://localhost:3000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Using the correct API endpoint
      const response = await axios.post(`${API_URL}/public/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Extract token and user data
        const { token, user } = response.data;
        
        // Store the token in localStorage with proper format
        localStorage.setItem('modelToken', token);
        localStorage.setItem('modelToken', response.data.token);
  localStorage.setItem('userId', response.data.userId);
        // Set default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Store user data if needed
        if (user) {
          localStorage.setItem('modelUser', JSON.stringify(user));
        }
        
        toast.success('Login successful!');
        
        // Redirect to profile page
        navigate('/profile');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
        toast.error(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = err.response.status;
        let errorMessage = 'An error occurred during login. Please try again.';
        
        if (statusCode === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (statusCode === 404) {
          errorMessage = 'Login service not available. Please try again later.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your internet connection.');
        toast.error('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
        toast.error('An error occurred. Please try again.');
      }
      
      // Only use mock login in development if server is completely unreachable
      if (process.env.NODE_ENV === 'development' && !err.response && err.request) {
        console.log('Server unreachable, using mock login for development');
        const mockToken = 'model-token-123';
        localStorage.setItem('modelToken', mockToken);
        
        // Set default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // Store mock user data
        const mockUser = { id: '123', fullName: 'Test User', email };
        localStorage.setItem('modelUser', JSON.stringify(mockUser));
        
        toast.success('Development login successful!');
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Send the Google token to your backend
      const response = await axios.post(`${API_URL}/auth/google-login`, {
        credential: credentialResponse.credential
      });
      
      console.log('Google login response:', response.data);
      
      if (response.data.success) {
        // Store the token in localStorage with proper format
        const token = response.data.token;
        localStorage.setItem('modelToken', token);
        
        // Set default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success('Google login successful!');
        
        // Redirect to profile page
        navigate('/profile');
      } else {
        setError(response.data.message || 'Google login failed. Please try again.');
        toast.error(response.data.message || 'Google login failed. Please try again.');
      }
    } catch (err: any) {
      // Rest of the function remains the same
      console.error('Google login error:', err);
      const errorMessage = err.response?.data?.message || 
                          'An error occurred during Google login. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // For development/testing - use mock login if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock login for development');
        const mockToken = 'model-token-123';
        localStorage.setItem('modelToken', mockToken);
        
        // Set default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // Store mock user data
        const mockUser = { id: '123', fullName: 'Test User', email };
        localStorage.setItem('modelUser', JSON.stringify(mockUser));
        
        toast.success('Development login successful!');
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = 'Google login failed. Please try again or use email login.';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  // Add this useEffect to set the authorization header when component mounts
  useEffect(() => {
    const token = localStorage.getItem('modelToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  
  return (
    <>
      <div className="bg-white min-h-screen">
        <Header />
        <div className="pt-24 pb-12 flex flex-col justify-center items-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#344c3d]">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Sign in to continue to Sage Media</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:ring-[#344c3d] focus:border-[#344c3d] text-gray-900 placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:ring-[#344c3d] focus:border-[#344c3d] text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#344c3d] focus:ring-[#344c3d] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#344c3d] hover:text-[#344c3d]/80"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#344c3d] hover:bg-[#344c3d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#344c3d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Sign in
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      shape="pill"
                      text="signin_with"
                      locale="en"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#344c3d] hover:text-[#344c3d]/80">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {showForgotPassword && (
        <ForgotPassword 
          API_URL={API_URL} 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}
    </>
  );
}