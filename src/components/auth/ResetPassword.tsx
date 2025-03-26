import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ResetPasswordProps {
  API_URL: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ API_URL }) => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwords.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`${API_URL}/public/resetpassword/${token}`, {
        password: passwords.password
      });

      if (response.data.success) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={passwords.password}
              onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 rounded-lg bg-[#1A1A1A] text-white border border-[#344c3d] focus:outline-none focus:border-[#FFD700]"
              required
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-white mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full p-2 rounded-lg bg-[#1A1A1A] text-white border border-[#344c3d] focus:outline-none focus:border-[#FFD700]"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFD700] text-[#1A1A1A] py-2 rounded-lg hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;