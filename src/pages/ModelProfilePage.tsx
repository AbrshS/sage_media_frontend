import Header from '@/components/Header';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Add useParams
import OverviewTab from '@/components/profile/OverviewTab';
import PortfolioTab from '@/components/profile/PortfolioTab';
import AnalysisTab from '@/components/profile/AnalysisTab';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

// Import the SocialMediaBadges component
import SocialMediaBadges from '../components/SocialMediaBadges';
import ForgotPassword from '@/components/auth/ForgotPassword';


// Inside your ModelProfilePage component
const ModelProfilePage = () => {
  const { id } = useParams(); // Get the model ID from URL params
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // Add this missing state
  const [isOwnProfile, setIsOwnProfile] = useState(!id); // If no ID, it's the user's own profile
  
  // Add reset password state variables here
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  // Add this function to handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    setResetLoading(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      // Call the API to reset password
      const response = await fetch('http://localhost:3000/api/public/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Password updated successfully');
        setIsResetPasswordOpen(false);
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };
  
  // Function to handle profile image change (only for own profile)
  const handleProfileImageChange = async (e) => {
    if (!isOwnProfile) return; // Only allow for own profile
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/public/upload-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        // Update user profile with new image
        setUserProfile(prev => ({
          ...prev,
          profileImage: data.data.filename
        }));
        
        toast.success('Profile image updated');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };
  
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
            setUserProfile({
              _id: data.data.id,
              fullName: data.data.fullName,
              email: data.data.email,
              profileImage: data.data.profileImage,
              bio: data.data.bio,
              location: data.data.location || {},
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
        />;
      // In the renderTabContent function, update the PortfolioTab case:
      case 'portfolio':
      return <PortfolioTab 
        userId={userProfile?._id || ''} 
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
          loading={loading || activitiesLoading} 
        />;
    }
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins',sans-serif]">
      {/* Header/Navigation */}
      <Header transparent={true} />

      {/* Profile Section */}
      <div className="relative pt-16"> {/* Added top padding here */}
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-[#344c3d]/20 to-[#344c3d]/30 h-48 md:h-64"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row pt-8 md:pt-16 pb-4">
            {/* Profile Image */}
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white shadow-lg mt-8 md:mt-16 relative group">
                <img 
                  src={(() => {
                    if (!userProfile?.profileImage) {
                      return "/images/default-profile.jpg";
                    }
                    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/profiles/${userProfile.profileImage}`;
                  })()}
                  alt={userProfile?.fullName || "Profile"} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsImageDialogOpen(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-profile.jpg";
                  }}
                />
                {/* Verification badge - adjust z-index to ensure visibility */}
                {userProfile?.isVerified && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10">
                    <svg 
                      className="w-5 h-5 text-[#495fda]" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                    </svg>
                  </div>
                )}
                {/* Existing upload controls remain unchanged */}
                {isOwnProfile && !uploadLoading ? (
                  <>
                    <button 
                      onClick={() => navigate('/edit-profile')} 
                      className="bg-[#344c3d] text-white px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setIsResetPasswordOpen(true)} 
                      className="border border-gray-300 px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Forgot Password
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-gray-900 text-white px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base">Apply</button>
                    <button className="border border-gray-300 px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base">Get in touch</button>
                  </>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="w-full md:w-3/4 mt-6 md:mt-0 md:pl-4 md:-ml-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:mt-52">
                <h1 className="text-2xl md:text-3xl font-bold">{userProfile?.fullName || "Loading..."}</h1>
                {userProfile?.isPro && (
                  <span className="mt-2 md:mt-0 md:ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    PRO
                    <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-2 md:mt-1">{userProfile?.title || "Model"}</p>
              <p className="text-gray-700 mt-2 max-w-2xl">{userProfile?.bio || "No bio available"}</p> {/* Modified to show full bio */}
              <p className="text-gray-700 mt-2">{userProfile?.location?.city}{userProfile?.location?.country ? `, ${userProfile.location.country}` : ""}</p>
              
              {/* Stats Section - Moved inside profile info for mobile */}
              <div className="flex justify-center md:justify-end mt-4 md:mt-0 space-x-8 md:space-x-12">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Competitions</p>
                  <p className="text-3xl md:text-4xl font-bold">{analytics?.competitions?.total || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Votes</p>
                  <p className="text-3xl md:text-4xl font-bold">{analytics?.votes?.total || 0}</p>
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start mt-6 space-x-3">
                {isOwnProfile ? (
                  <>
                    <button 
                      onClick={() => navigate('/edit-profile')} 
                      className="bg-[#344c3d] text-white px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setIsResetPasswordOpen(true)} 
                      className="border border-gray-300 px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Forgot Password
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-gray-900 text-white px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base">Apply</button>
                    <button className="border border-gray-300 px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base">Get in touch</button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Social Media Badges */}
          <div className="absolute right-4 md:right-8 top-2 md:top-6">
            <SocialMediaBadges socialMedia={userProfile?.socialMedia} />
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mt-8 overflow-x-auto">
            <nav className="flex space-x-4 md:space-x-8 min-w-max px-2">
              <button 
                className={`py-3 md:py-4 px-1 font-medium text-sm md:text-base relative ${
                  activeTab === 'overview' ? 'text-black border-b-2 border-black' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`py-4 px-1 font-medium ${activeTab === 'portfolio' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
                <span className="ml-1 text-xs text-gray-500">54</span>
              </button>
              <button 
                className={`py-4 px-1 font-medium ${activeTab === 'analysis' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('analysis')}
              >
                Analysis
              </button>
              <button 
                className={`py-4 px-1 font-medium ${activeTab === 'about' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
      
      {/* Image Dialog - Make it more mobile friendly */}
      <Dialog
        open={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-2 md:p-4">
          <Dialog.Panel className="mx-auto w-full max-w-3xl rounded-xl bg-white p-1 md:p-2 shadow-xl">
            <div className="relative">
              <img 
                src={(() => {
                  if (!userProfile?.profileImage) {
                    return "/images/default-profile.jpg";
                  }
                  // Use the same path structure as in leaderboard
                  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/profiles/${userProfile.profileImage}`;
                })()}
                alt={userProfile?.fullName || "Profile"} 
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-profile.jpg";
                }}
              />
              <button 
                onClick={() => setIsImageDialogOpen(false)}
                className="absolute top-1 md:top-2 right-1 md:right-2 bg-white/80 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog
        open={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Forgot Password
              </Dialog.Title>
              <button 
                onClick={() => setIsResetPasswordOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Use the ForgotPassword component */}
            <div className="bg-white rounded-lg">
              <ForgotPassword />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ModelProfilePage;
