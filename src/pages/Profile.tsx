import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import OverviewTab from '../components/profile/OverviewTab';
import { UserProfile, AnalyticsData } from '../components/profile/types';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics ] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('modelToken');
        
        const headers = token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        };

        // If we have an ID, fetch the public profile
        if (id) {
          const response = await axios.get(
            `http://localhost:3000/api/applications/approved/${id}`,
            { headers }
          );

          if (response.data.success) {
            const modelData = response.data.data;
            setProfile({
              id: modelData._id,
              fullName: modelData.fullName,
              profileImage: modelData.portraitPhoto,
              bio: modelData.bio || '',
              location: modelData.location || {},
              isVerified: modelData.isVerified,
              // Remove votes and competition as they're not in UserProfile type
              email: modelData.email || '', // Add required fields from UserProfile
              socialMedia: modelData.socialMedia || {},
              createdAt: modelData.createdAt
            });
          }
        } else {
          // If no ID, try to fetch the logged-in user's profile
          if (!token) {
            navigate('/login');
            return;
          }
          
          const response = await axios.get(
            'http://localhost:3000/api/public/me',
            { headers }
          );

          if (response.data.success) {
            setProfile(response.data.data);
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  console.log('Current state - loading:', loading, 'profile:', !!profile, 'analytics:', !!analytics);

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!profile) {
    console.log('Rendering profile not found state');
    return (
      <div className="text-center text-white/60 py-8">
        Profile not found
      </div>
    );
  }

  // Provide default analytics if not available
  const defaultAnalytics = {
    profileViews: 0,
    followers: 0,
    competitions: { total: 0, details: [] },
    votes: { total: 0, byCompetition: [] },
    recentActivities: []
  };

  console.log('Rendering profile with analytics:', analytics ? 'real data' : 'default data');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">
          {id ? `${profile.fullName}'s Profile` : 'My Profile'}
        </h1>
        <OverviewTab 
          profile={profile}
          analytics={analytics || defaultAnalytics} activities={undefined} loading={false} isModelProfile={false}        />
      </div>
    </div>
  );
};

export default Profile;