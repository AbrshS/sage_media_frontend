import React, { useState } from 'react';

interface OverviewTabProps {
  profile: any;
  analytics: any;
  activities: any;
  loading: boolean;
  isModelProfile: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  profile, 
  analytics, 
  activities, 
  loading,
  isModelProfile 
}) => {
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;

  // Map API activities to the format expected by the component
  const processedActivities = activities ? activities.map((activity: any) => {
    // Map activity type to icon
    let icon = 'Default';
    if (activity.type === 'login') icon = 'User';
    if (activity.type === 'vote') icon = 'Heart';
    if (activity.type === 'competition') icon = 'Award';
    
    return {
      type: activity.type,
      icon: icon,
      text: activity.description || `Activity: ${activity.type}`,
      timestamp: activity.createdAt,
      image: activity.metadata?.image || '',
      metadata: activity.metadata
    };
  }) : [];
  
  // Use processed activities if available, otherwise fall back to analytics.recentActivities
  const allActivities = processedActivities.length > 0 
    ? processedActivities 
    : (analytics?.recentActivities || []);
    
  // Calculate pagination
  const totalPages = Math.ceil(allActivities.length / activitiesPerPage);
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const recentActivities = allActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  
  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Use mock data when analytics API fails
  const mockAnalytics = {
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
  };

  // Use actual data if available, otherwise use mock data
  const data = analytics || mockAnalytics;

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Overview</h3>
          
          {/* Stats section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Profile Views</p>
              <p className="text-2xl font-bold">{data?.profileViews || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Followers</p>
              <p className="text-2xl font-bold">{data?.followers || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Total Votes</p>
              <p className="text-2xl font-bold">{data?.votes?.total || 0}</p>
            </div>
          </div>
          
          {/* Competition Section - Added this section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Competitions</h3>
            {data?.competitions?.details && data.competitions.details.length > 0 ? (
              <div className="space-y-4">
                {data.competitions.details.map((competition: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      {competition.portraitPhoto ? (
                        <img 
                          src={`http://localhost:3000/${competition.portraitPhoto}`} 
                          alt={competition.competitionTitle}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/48x48/gray/white?text=C";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM12 16c-1.65 0-3-1.35-3-3V5h6v8c0 1.65-1.35 3-3 3zm7-8c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{competition.competitionTitle}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {competition.votes} votes
                        </div>
                        <p className="text-xs text-gray-500">Last vote: {formatDate(competition.lastVoteDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No competitions joined yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <div className="text-sm text-gray-500">
              {allActivities.length > 0 && (
                <span>Showing {indexOfFirstActivity + 1}-{Math.min(indexOfLastActivity, allActivities.length)} of {allActivities.length}</span>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${
                  activity.icon === 'Heart' ? 'bg-red-100 text-red-600' : 
                  activity.icon === 'Award' ? 'bg-yellow-100 text-yellow-600' : 
                  activity.icon === 'User' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.icon === 'Heart' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : activity.icon === 'Award' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" />
                      <path d="M16 15h-8c-3.31 0-6 2.69-6 6v1h20v-1c0-3.31-2.69-6-6-6z" />
                    </svg>
                  ) : activity.icon === 'User' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.text}</p>
                      <p className="text-gray-500 text-sm">{formatDate(activity.timestamp)}</p>
                      {activity.metadata?.email && (
                        <p className="text-gray-500 text-xs">{activity.metadata.email}</p>
                      )}
                    </div>
                    {activity.image && (
                      <div className="ml-2 flex-shrink-0">
                        <img 
                          src={activity.image ? `http://localhost:3000/${activity.image}` : "/default-activity.jpg"} 
                          alt="Activity"
                          className="w-12 h-12 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/48x48/gray/white?text=A";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!recentActivities || recentActivities.length === 0) && (
              <p className="text-gray-500 italic">No recent activities.</p>
            )}
          </div>
          
          {/* Pagination controls */}
          {allActivities.length > activitiesPerPage && (
            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Previous
              </button>
              
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Next
              </button>
            </div>
          )}
          
          <div className="mt-6">
            <button className="text-blue-600 font-medium text-sm flex items-center">
              View all activities
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;