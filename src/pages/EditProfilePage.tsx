import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Instagram, Twitter, Facebook, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TikTokIcon from '../components/profile/TikTokIcon';
import { UserProfile } from '../components/profile/types';

// API URL
const API_URL = 'http://localhost:3000/api';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    phoneNumber: '',
    location: {
      country: '',
      city: ''
    },
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      tiktok: ''
    }
  });
  
  // Image preview states
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get the token from localStorage
        const token = localStorage.getItem('modelToken');
        
        if (!token) {
          toast.error('Please login to edit your profile');
          navigate('/login');
          return;
        }
    
        // Set up headers with authorization token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
    
        // Fetch current user's profile
        const response = await axios.get(`${API_URL}/public/me`, config);
        
        if (response.data.success && response.data.data) {
          const userData = response.data.data;
          
          // Set profile data
          setProfile({
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email,
            profileImage: userData.profileImage || '',
            coverImage: userData.coverImage || '',
            bio: userData.bio || "",
            location: userData.location || { country: '', city: '' },
            phoneNumber: userData.phoneNumber || "",
            socialMedia: userData.socialMedia || { instagram: '', twitter: '', facebook: '', tiktok: '' },
            isVerified: userData.isVerified || false,
            createdAt: userData.createdAt
          });
          
          // Set form data
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            bio: userData.bio || '',
            phoneNumber: userData.phoneNumber || '',
            location: userData.location || { country: '', city: '' },
            socialMedia: userData.socialMedia || { instagram: '', twitter: '', facebook: '', tiktok: '' }
          });
          
          // Set image previews
          if (userData.profileImage) {
            setProfileImagePreview(userData.profileImage);
          }
          
          if (userData.coverImage) {
            setCoverImagePreview(userData.coverImage);
          }
        } else {
          throw new Error('User profile data not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('modelToken');
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // In the handleSubmit function, update the API endpoint and data structure
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const token = localStorage.getItem('modelToken');
      if (!token) {
        toast.error('Please login to update your profile');
        navigate('/login');
        return;
      }
  
      // Create FormData object
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('fullName', formData.fullName);
      submitFormData.append('email', formData.email);
      submitFormData.append('bio', formData.bio);
      submitFormData.append('phoneNumber', formData.phoneNumber);
      
      // Add location
      submitFormData.append('location[country]', formData.location.country);
      submitFormData.append('location[city]', formData.location.city);
      
      // Add social media
      submitFormData.append('socialMedia[instagram]', formData.socialMedia.instagram);
      submitFormData.append('socialMedia[twitter]', formData.socialMedia.twitter);
      submitFormData.append('socialMedia[facebook]', formData.socialMedia.facebook);
      submitFormData.append('socialMedia[tiktok]', formData.socialMedia.tiktok);
      
      // Add images if changed
      if (profileImageFile) {
        submitFormData.append('profileImage', profileImageFile);
      }
      
      if (coverImageFile) {
        submitFormData.append('coverImage', coverImageFile);
      }
  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
  
      const response = await axios.put(`${API_URL}/public/profile`, submitFormData, config);
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c5241]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white text-[#2c5241]"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#2c5241] font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-[#2c5241]">Edit Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>
      
      {/* Cover Image */}
      <div className="relative h-48 bg-[#f0f2f0] overflow-hidden">
        {coverImagePreview ? (
          <img 
            src={coverImagePreview} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#2c5241]/20 to-[#2c5241]/30"></div>
        )}
        
        <button 
          onClick={() => coverImageRef.current?.click()}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-[#f0f2f0] transition-colors"
        >
          <Camera size={20} className="text-[#2c5241]" />
        </button>
        
        <input 
          type="file" 
          ref={coverImageRef}
          onChange={handleCoverImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {/* Profile Image */}
      <div className="container mx-auto px-4 relative">
        <div className="relative -mt-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-[#f0f2f0] mx-auto">
          {profileImagePreview ? (
            <img 
              src={profileImagePreview} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={64} className="text-[#2c5241]/40" />
            </div>
          )}
          
          <button 
            onClick={() => profileImageRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-[#f0f2f0] transition-colors"
          >
            <Camera size={16} className="text-[#2c5241]" />
          </button>
          
          <input 
            type="file" 
            ref={profileImageRef}
            onChange={handleProfileImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
      
      {/* Form */}
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#2c5241]/10">
              <div className="p-4 bg-[#2c5241]/5">
                <h3 className="font-semibold text-[#2c5241]">Basic Information</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                    required
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Email
                  </label>
                  <div className="flex items-center">
                    <Mail size={18} className="text-[#2c5241]/60 mr-2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                      required
                    />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone size={18} className="text-[#2c5241]/60 mr-2" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                    />
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#2c5241]/10">
              <div className="p-4 bg-[#2c5241]/5">
                <h3 className="font-semibold text-[#2c5241]">Location</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Country */}
                <div>
                  <label htmlFor="location.country" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Country
                  </label>
                  <div className="flex items-center">
                    <MapPin size={18} className="text-[#2c5241]/60 mr-2" />
                    <input
                      type="text"
                      id="location.country"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                      placeholder="Your country"
                    />
                  </div>
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-[#2c5241] mb-1">
                    City
                  </label>
                  <div className="flex items-center">
                    <MapPin size={18} className="text-[#2c5241]/60 mr-2" />
                    <input
                      type="text"
                      id="location.city"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#2c5241]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                      placeholder="Your city"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#2c5241]/10">
              <div className="p-4 bg-[#2c5241]/5">
                <h3 className="font-semibold text-[#2c5241]">Social Media</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Instagram */}
                <div>
                  <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Instagram
                  </label>
                  <div className="flex items-center">
                    <Instagram size={18} className="text-[#2c5241]/60 mr-2" />
                    <div className="flex items-center w-full border border-[#2c5241]/20 rounded-lg overflow-hidden">
                      <span className="bg-[#f0f2f0] text-[#2c5241]/60 px-3 py-2 text-sm">instagram.com/</span>
                      <input
                        type="text"
                        id="socialMedia.instagram"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Twitter */}
                <div>
                  <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Twitter
                  </label>
                  <div className="flex items-center">
                    <Twitter size={18} className="text-[#2c5241]/60 mr-2" />
                    <div className="flex items-center w-full border border-[#2c5241]/20 rounded-lg overflow-hidden">
                      <span className="bg-[#f0f2f0] text-[#2c5241]/60 px-3 py-2 text-sm">twitter.com/</span>
                      <input
                        type="text"
                        id="socialMedia.twitter"
                        name="socialMedia.twitter"
                        value={formData.socialMedia.twitter}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Facebook */}
                <div>
                  <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-[#2c5241] mb-1">
                    Facebook
                  </label>
                  <div className="flex items-center">
                    <Facebook size={18} className="text-[#2c5241]/60 mr-2" />
                    <div className="flex items-center w-full border border-[#2c5241]/20 rounded-lg overflow-hidden">
                      <span className="bg-[#f0f2f0] text-[#2c5241]/60 px-3 py-2 text-sm">facebook.com/</span>
                      <input
                        type="text"
                        id="socialMedia.facebook"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
                
                {/* TikTok */}
                <div>
                  <label htmlFor="socialMedia.tiktok" className="block text-sm font-medium text-[#2c5241] mb-1">
                    TikTok
                  </label>
                  <div className="flex items-center">
                    <div className="mr-2">
                      <TikTokIcon size={18} className="text-[#2c5241]/60" />
                    </div>
                    <div className="flex items-center w-full border border-[#2c5241]/20 rounded-lg overflow-hidden">
                      <span className="bg-[#f0f2f0] text-[#2c5241]/60 px-3 py-2 text-sm">tiktok.com/@</span>
                      <input
                        type="text"
                        id="socialMedia.tiktok"
                        name="socialMedia.tiktok"
                        value={formData.socialMedia.tiktok}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#2c5241] text-white rounded-full font-medium hover:bg-[#1e3a2b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2c5241]/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}