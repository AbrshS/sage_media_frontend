import Header from '@/components/Header';
import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OverviewTab from '@/components/profile/OverviewTab';
import PortfolioTab from '@/components/profile/PortfolioTab';
import AnalysisTab from '@/components/profile/AnalysisTab';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import SocialMediaBadges from '../components/SocialMediaBadges';
import ForgotPassword from '@/components/auth/ForgotPassword';
import { Loader2 } from 'lucide-react';


// Inside your ModelProfilePage component
const ModelProfilePage = () => {
  const { id } = useParams(); // Get the model ID from URL params
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  
  // Add these interfaces at the top of the file
  interface UserProfile {
    _id: string;
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    title?: string;
    bio?: string;
    isPro?: boolean;
    isVerified?: boolean;
    phoneNumber?: string; // Add this line
    createdAt?: string;  // Add this if needed
    location?: {
      city?: string;
      country?: string;
    };
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      tiktok?: string;
    };
  }
  
  interface Analytics {
    profileViews: number;
    followers: number;
    competitions: {
      total: number;
      details: Array<any>;
    };
    votes: {
      total: number;
      byCompetition: Array<any>;
    };
    recentActivities?: Array<{  // Add this block
      type: string;
      icon: string;
      text: string;
      timestamp: string;
      image: string;
    }>;
  }
  
  interface Activity {
    type: string;
    icon: string;
    text: string;
    timestamp: string;
    image: string;
  }
  
  // Update the state declarations
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [uploadLoading] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // Add this missing state
  const [isOwnProfile, setIsOwnProfile] = useState(!id); // If no ID, it's the user's own profile
  
  // Add reset password state variables here
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [] = useState('');
  const [] = useState(false);
  
  // Add this function to handle password reset
  
  // Function to handle profile image change (only for own profile)
  
  // Add a new useEffect to fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Starting user profile fetch...');
        setUserLoading(true);
        
        if (id) {
          // Fetching another model's profile
          console.log('Fetching model profile with ID:', id);
          const response = await fetch(`http://localhost:3000/api/applications/approved/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Model profile response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch model profile: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Model profile data received:', data);
          
          if (data.success) {
            setUserProfile(data.data);
            setIsOwnProfile(false);
          } else {
            console.error('API returned error for model profile:', data.message || 'Unknown error');
            toast.error('Failed to load model profile');
            navigate('/models'); // Redirect to models page if profile not found
          }
        } else {
          // Fetching own profile - use existing code
          // Try to get token from various possible localStorage keys
          const possibleTokenKeys = ['token', 'authToken', 'modelToken', 'user', 'modelUser'];
          let token = null;
          
          for (const key of possibleTokenKeys) {
            const value = localStorage.getItem(key);
            if (value) {
              console.log(`Found value in localStorage key: ${key}`);
              // If the key is 'user' or 'modelUser', it might be a JSON object with token inside
              if (key === 'user' || key === 'modelUser') {
                try {
                  const parsed = JSON.parse(value);
                  if (parsed.token) {
                    token = parsed.token;
                    console.log('Extracted token from JSON object');
                    break;
                  }
                } catch (e) {
                  // Not JSON or doesn't have token property, use as is
                  token = value;
                  break;
                }
              } else {
                token = value;
                break;
              }
            }
          }
          
          // If token exists but doesn't have Bearer prefix, add it
          if (token && !token.startsWith('Bearer ')) {
            console.log('Token does not have Bearer prefix, adding it');
            token = `Bearer ${token}`;
          }
          
          if (!token) {
            console.log('No valid authentication token found in any storage');
            toast.error('Authentication required. Please log in again.');
            navigate('/login');
            return;
          }
          
          console.log('Using token for profile fetch:', token.substring(0, 15) + '...');
          
          // Fetch user profile from the API
          const response = await fetch('http://localhost:3000/api/public/me', {
            method: 'GET',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('User profile response status:', response.status);
          
          if (!response.ok) {
            if (response.status === 401) {
              console.log('Authentication token expired or invalid for user profile');
              const responseText = await response.text();
              console.log('User profile response text:', responseText);
            }
            throw new Error(`Failed to fetch user profile: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('User profile data received:', data);
          
          if (data.success) {
            // Map the API response to our userProfile state
            // When setting the user profile data
            setUserProfile({
              _id: data.data._id || data.data.id, // Add this line to handle both _id and id
              id: data.data.id,
              fullName: data.data.fullName,
              email: data.data.email,
              profileImage: data.data.profileImage,
              bio: data.data.bio,
              location: data.data.location || { city: undefined, country: undefined },
              phoneNumber: data.data.phoneNumber,
              socialMedia: data.data.socialMedia || {},
              isVerified: data.data.isVerified,
              createdAt: data.data.createdAt
            });
            setIsOwnProfile(true);
          } else {
            console.error('API returned error for user profile:', data.message || 'Unknown error');
            toast.error('Failed to load your profile');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
        
        // Only redirect to models page if viewing a public profile
        if (id) {
          navigate('/models');
        }
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [id, navigate]); // Add id and navigate as dependencies

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Starting analytics fetch...');
        
        // Try to get token from various possible localStorage keys
        const possibleTokenKeys = ['token', 'authToken', 'modelToken', 'user', 'modelUser'];
        let token = null;
        
        for (const key of possibleTokenKeys) {
          const value = localStorage.getItem(key);
          if (value && value.includes('.') && value.length > 50) {
            console.log(`Using token from localStorage key: ${key}`);
            // If the key is 'user' or 'modelUser', it might be a JSON object with token inside
            if (key === 'user' || key === 'modelUser') {
              try {
                const parsed = JSON.parse(value);
                if (parsed.token) {
                  token = parsed.token;
                  console.log('Extracted token from JSON object');
                  break;
                }
              } catch (e) {
                // Not JSON or doesn't have token property, use as is
                token = value;
                break;
              }
            } else {
              token = value;
              break;
            }
          }
        }
        
        // If token exists but doesn't have Bearer prefix, add it
        if (token && !token.startsWith('Bearer ')) {
          console.log('Token does not have Bearer prefix, adding it');
          token = `Bearer ${token}`;
        }
        
        if (!token) {
          console.log('No valid authentication token found in any storage');
          setLoading(false);
          return;
        }
        
        console.log('Using token:', token.substring(0, 15) + '...');
        
        // Modified fetch request to handle CORS properly
        const response = await fetch('http://localhost:3000/api/analytics/profile', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          // Remove credentials: 'include' as it's causing CORS issues
          // with wildcard Access-Control-Allow-Origin
          credentials: 'same-origin'
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication token expired or invalid');
            const responseText = await response.text();
            console.log('Response text:', responseText);
          }
          throw new Error(`Failed to fetch analytics: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Analytics data received:', data);
        if (data.success) {
          setAnalytics(data.data);
        } else {
          console.error('API returned error:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Set mock analytics data when API fails
        setAnalytics({
          profileViews: 245,
          followers: 128,
          competitions: {
            total: 1,
            details: [
              {
                competitionId: "mock123",
                competitionTitle: "Sample Model Competition",
                votes: 350,
                lastVoteDate: new Date().toISOString(),
                portraitPhoto: ""
              }
            ]
          },
          votes: {
            total: 350,
            byCompetition: [
              {
                competition: "Sample Model Competition",
                votes: 350,
                lastVoteDate: new Date().toISOString(),
                portraitPhoto: ""
              }
            ]
          },
          recentActivities: [
            {
              type: "vote",
              icon: "Heart",
              text: "Received 350 votes in \"Sample Model Competition\"",
              timestamp: new Date().toISOString(),
              image: ""
            },
            {
              type: "competition",
              icon: "Award",
              text: "Joined \"Sample Model Competition\" competition",
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              image: ""
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  // Add a new useEffect for fetching activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('Starting activities fetch...');
        
        // Try to get token from various possible localStorage keys
        const possibleTokenKeys = ['token', 'authToken', 'modelToken', 'user', 'modelUser'];
        let token = null;
        
        for (const key of possibleTokenKeys) {
          const value = localStorage.getItem(key);
          if (value && value.includes('.') && value.length > 50) {
            console.log(`Using token from localStorage key: ${key}`);
            // If the key is 'user' or 'modelUser', it might be a JSON object with token inside
            if (key === 'user' || key === 'modelUser') {
              try {
                const parsed = JSON.parse(value);
                if (parsed.token) {
                  token = parsed.token;
                  console.log('Extracted token from JSON object');
                  break;
                }
              } catch (e) {
                // Not JSON or doesn't have token property, use as is
                token = value;
                break;
              }
            } else {
              token = value;
              break;
            }
          }
        }
        
        // If token exists but doesn't have Bearer prefix, add it
        if (token && !token.startsWith('Bearer ')) {
          console.log('Token does not have Bearer prefix, adding it');
          token = `Bearer ${token}`;
        }
        
        if (!token) {
          console.log('No valid authentication token found in any storage');
          setActivitiesLoading(false);
          return;
        }
        
        console.log('Using token for activities:', token.substring(0, 15) + '...');
        
        // Fetch activities from the new endpoint
        const response = await fetch('http://localhost:3000/api/analytics/activities', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        });
        
        console.log('Activities response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Authentication token expired or invalid for activities');
            const responseText = await response.text();
            console.log('Activities response text:', responseText);
          }
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        if (data.success) {
          setActivities(data.data);
        } else {
          console.error('API returned error for activities:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Set mock activities data when API fails
        setActivities([
          {
            type: "vote",
            icon: "Heart",
            text: "Received 350 votes in \"Sample Model Competition\"",
            timestamp: new Date().toISOString(),
            image: ""
          },
          {
            type: "competition",
            icon: "Award",
            text: "Joined \"Sample Model Competition\" competition",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            image: ""
          },
          {
            type: "follow",
            icon: "User",
            text: "Gained 5 new followers",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            image: ""
          }
        ]);
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  // Update the renderTabContent function to pass userProfile to OverviewTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          profile={userProfile} 
          analytics={analytics} 
          activities={activities}
          loading={loading || activitiesLoading || userLoading}
          isModelProfile={true}
        />;
      case 'portfolio':
        return <PortfolioTab 
          userId={userProfile?.id || ''} 
          isOwnProfile={isOwnProfile}
          loading={userLoading} 
        />;
      case 'analysis':
        return <AnalysisTab profile={userProfile} />;
      default:
        return <OverviewTab 
          profile={userProfile}
          analytics={analytics}
          activities={activities}
          loading={loading || activitiesLoading} isModelProfile={false}        />;
    }
  };

  function handleTabChange(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen font-['Poppins',sans-serif]">
      {/* Header component would go here */}
  
      
      {/* Profile Section - Redesigned for better responsiveness */}
      <div className="relative pt-16 pb-8"> 
        {/* Background gradient - Updated for brand consistency */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#344c3d]/10 via-[#344c3d]/15 to-[#344c3d]/20 h-48 md:h-72"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          {/* Profile Header Section */}
          <div className="flex flex-col md:flex-row pt-8 md:pt-16 pb-6">
            {/* Profile Image with loading state */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl mt-4 md:mt-8 relative group">
                {userLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-10 h-10 text-[#344c3d] animate-spin" />
                  </div>
                ) : (
                  <img 
                    src={(() => {
                      if (!userProfile?.profileImage) {
                        return "/images/default-profile.jpg";
                      }
                      return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/profiles/${userProfile.profileImage}`;
                    })()}
                    alt={userProfile?.fullName || "Profile"} 
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => setIsImageDialogOpen(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-profile.jpg";
                    }}
                  />
                )}
                
                {/* Verification badge - Improved visibility */}
                {userProfile?.isVerified && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg z-10">
                    <svg 
                      className="w-5 h-5 text-[#344c3d]" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      aria-label="Verified Profile"
                    >
                      <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info Section - Enhanced with best practices */}
            <div className="w-full md:w-2/3 lg:w-3/4 mt-6 md:mt-0 md:pl-6">
              {userLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                          {userProfile?.fullName}
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                          {userProfile?.title || "Model"}
                          {userProfile?.isVerified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              Verified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isOwnProfile && (
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600 hover:text-gray-900"
                          onClick={() => navigate('/edit-profile')}
                          aria-label="Edit Profile"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600 hover:text-gray-900"
                          onClick={() => setIsResetPasswordOpen(true)}
                          aria-label="Reset Password"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5">
                      <h3 className="text-gray-900 font-medium mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {userProfile?.bio || "No bio available"}
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 flex items-center gap-2 text-gray-500 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Member since {userProfile?.createdAt 
                        ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })
                        : ""}
                    </div>
                  </div>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2.5 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900 truncate">{userProfile?.email}</p>
                        </div>
                      </div>
                    </div>
                
                    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-50 p-2.5 rounded-lg">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900 truncate">{userProfile?.phoneNumber || "Not available"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5">
                      <h3 className="text-gray-900 font-medium mb-4">Connect</h3>
                      {userProfile?.socialMedia && Object.keys(userProfile.socialMedia).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <SocialMediaBadges socialMedia={userProfile.socialMedia} />
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-gray-500 text-sm">No social media links yet</p>
                          {isOwnProfile && (
                            <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                              + Add social links
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs - Improved for mobile scrolling with active indicator animation */}
          <div className="border-b border-gray-200 mt-8 overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-6 md:space-x-10 min-w-max px-2">
              <button 
                className={`py-3 px-1 font-medium text-sm md:text-base relative transition-colors duration-200 ${
                  activeTab === 'overview' 
                    ? 'text-[#344c3d]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('overview')}
                aria-label="Overview Tab"
              >
                Overview
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#344c3d] transform transition-transform duration-300"></span>
                )}
              </button>
              <button 
                className={`py-3 px-1 font-medium text-sm md:text-base relative transition-colors duration-200 ${
                  activeTab === 'portfolio' 
                    ? 'text-[#344c3d]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('portfolio')}
                aria-label="Portfolio Tab"
              >
                Portfolio
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">54</span>
                {activeTab === 'portfolio' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#344c3d] transform transition-transform duration-300"></span>
                )}
              </button>
              <button 
                className={`py-3 px-1 font-medium text-sm md:text-base relative transition-colors duration-200 ${
                  activeTab === 'analysis' 
                    ? 'text-[#344c3d]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('analysis')}
                aria-label="Analysis Tab"
              >
                Analysis
                {activeTab === 'analysis' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#344c3d] transform transition-transform duration-300"></span>
                )}
              </button>
              <button 
                className={`py-3 px-1 font-medium text-sm md:text-base relative transition-colors duration-200 ${
                  activeTab === 'about' 
                    ? 'text-[#344c3d]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabChange('about')}
                aria-label="About Tab"
              >
                About
                {activeTab === 'about' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#344c3d] transform transition-transform duration-300"></span>
                )}
              </button>
            </nav>
          </div>
          
          {/* Tab Content - Container with improved padding */}
          <div className="py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Image Dialog - Improved with transition */}
      <Transition appear show={isImageDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsImageDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
          
          <div className="fixed inset-0 flex items-center justify-center p-2 md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto w-full max-w-3xl rounded-xl bg-white p-1 md:p-2 shadow-2xl">
                <div className="relative">
                  <img 
                    src={(() => {
                      if (!userProfile?.profileImage) {
                        return "/images/default-profile.jpg";
                      }
                      return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/profiles/${userProfile.profileImage}`;
                    })()}
                    alt={userProfile?.fullName || "Profile"} 
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-profile.jpg";
                    }}
                  />
                  <button 
                    onClick={() => setIsImageDialogOpen(false)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-[#344c3d] p-2 rounded-full transition-colors duration-200"
                    aria-label="Close dialog"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      
      {/* Reset Password Dialog - Enhanced with transition */}
      <Transition appear show={isResetPasswordOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsResetPasswordOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium text-[#344c3d] mb-4">
                  Reset Password
                </Dialog.Title>
                
                <ForgotPassword onClose={() => setIsResetPasswordOpen(false)} apiUrl={''} />
                
                <button
                  onClick={() => setIsResetPasswordOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  aria-label="Close dialog"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ModelProfilePage;
