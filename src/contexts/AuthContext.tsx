import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('modelToken') || localStorage.getItem('userToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          localStorage.removeItem('modelToken');
          localStorage.removeItem('userToken');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('modelToken');
        localStorage.removeItem('userToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem(user.role === 'model' ? 'modelToken' : 'userToken', token);
        setUser(user);
        toast.success('Login successful!');
        return true;
      } else {
        setError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);

      if (response.data.success) {
        toast.success('Registration successful! Please verify your email.');
        return true;
      } else {
        setError(response.data.message || 'Registration failed');
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('modelToken');
    localStorage.removeItem('userToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};