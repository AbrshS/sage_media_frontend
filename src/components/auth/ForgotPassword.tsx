import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const API_URL = 'http://localhost:3000/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/public/forgotpassword`, { email });
      
      if (response.data.success) {
        setEmailSent(true);
        toast.success('Reset link has been sent to your email');
      } else {
        throw new Error(response.data.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-auto">

      <div className="pt-24 pb-12 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#344c3d]">
              {emailSent ? 'Check Your Email' : 'Forgot Password'}
            </h1>
            <p className="text-gray-600 mt-2">
              {emailSent 
                ? "We've sent you instructions to reset your password" 
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {emailSent ? (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <p className="text-gray-700 mb-6">
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#344c3d] text-white py-3 rounded-lg hover:bg-[#344c3d]/90 transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:ring-[#344c3d] focus:border-[#344c3d] text-gray-900"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#344c3d] text-white py-3 rounded-lg hover:bg-[#344c3d]/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#344c3d] hover:text-[#344c3d]/80 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;