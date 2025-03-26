import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const analyticsService = {
  async getUserAnalytics(userId: string) {
    const response = await axios.get(`${API_URL}/api/users/analytics/user/${userId}`);
    return response.data;
  },

  async recordProfileView(userId: string) {
    const response = await axios.post(`${API_URL}/api/users/analytics/user/${userId}/view`);
    return response.data;
  },

  async updateDemographics(userId: string, data: { age: any[], location: any[] }) {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/api/users/analytics/user/${userId}/demographics`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async recordEngagement(userId: string, type: 'like' | 'comment' | 'share') {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/users/analytics/user/${userId}/engagement`,
      { type },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
};