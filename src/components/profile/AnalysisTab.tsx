import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line, Doughnut } from 'react-chartjs-2';

interface AnalysisTabProps {
  profile: any;
  loading?: boolean;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ profile, loading = false }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (profile?._id) {
      fetchAnalytics();
    }
  }, [profile]);

  const fetchAnalytics = async () => {
    try {
      const result = await analyticsService.getUserAnalytics(profile._id);
      setAnalytics(result.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#344c3d]"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-6">
        <div className="text-center text-gray-500">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-[#344c3d]">{analytics.views.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Engagement Rate</h3>
          <p className="text-3xl font-bold text-[#344c3d]">{analytics.engagement.rate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <p className="text-3xl font-bold text-[#344c3d]">{analytics.followers.total}</p>
        </div>
      </div>

      {/* Monthly Views Chart */}
      {analytics.views.monthly.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Monthly Profile Views</h3>
          <div className="h-64">
            <Line
              data={{
                labels: analytics.views.monthly.map((m: any) => m.month),
                datasets: [{
                  label: 'Views',
                  data: analytics.views.monthly.map((m: any) => m.count),
                  borderColor: '#344c3d',
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      )}

      {/* Demographics */}
      {analytics.demographics.age.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: analytics.demographics.age.map((a: any) => a.range),
                datasets: [{
                  data: analytics.demographics.age.map((a: any) => a.percentage),
                  backgroundColor: [
                    '#344c3d',
                    '#4a7561',
                    '#609e85',
                    '#76c7a9',
                    '#8cf0cd'
                  ]
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTab;