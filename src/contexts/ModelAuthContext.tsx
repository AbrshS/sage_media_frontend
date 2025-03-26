import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface ModelUser {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  location?: {
    city: string;
    country: string;
  };
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    facebook?: string;
  };
  bio?: string;
  createdAt: string;
}

interface ModelAuthContextType {
  modelUser: ModelUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
}

const ModelAuthContext = createContext<ModelAuthContextType | undefined>(undefined);

export const ModelAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modelUser, setModelUser] = useState<ModelUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('modelToken');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const { data } = await axios.get('http://localhost:5000/api/public/me', config);
        
        if (data.success) {
          setModelUser(data.data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('modelToken');
        }
      } catch (err) {
        localStorage.removeItem('modelToken');
        console.error('Authentication error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('http://localhost:5000/api/public/login', {
        email,
        password
      });
      
      if (data.success) {
        localStorage.setItem('modelToken', data.token);
        setModelUser(data.data);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('http://localhost:5000/api/public/register', userData);
      
      if (data.success) {
        localStorage.setItem('modelToken', data.token);
        setModelUser(data.data);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('modelToken');
    setModelUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('modelToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const { data } = await axios.put('http://localhost:5000/api/public/profile', profileData, config);
      
      if (data.success) {
        setModelUser(data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Profile update failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModelAuthContext.Provider
      value={{
        modelUser,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </ModelAuthContext.Provider>
  );
};

export const useModelAuth = () => {
  const context = useContext(ModelAuthContext);
  if (context === undefined) {
    throw new Error('useModelAuth must be used within a ModelAuthProvider');
  }
  return context;
};