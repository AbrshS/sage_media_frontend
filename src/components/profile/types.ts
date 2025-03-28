export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: {
    country: string;
    city: string;
  };
  phoneNumber?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
  isVerified: boolean;
  createdAt: string;
}

export interface CompetitionDetail {
  id: string;
  name: string;
  date: string;
  placement?: number;
}

export interface VoteDetail {
  competitionId: string;
  competitionName: string;
  votes: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
  link?: string;
}

export interface AnalyticsData {
  profileViews: number;
  followers: number;
  competitions: {
    total: number;
    details: CompetitionDetail[];
  };
  votes: {
    total: number;
    byCompetition: VoteDetail[];
  };
  recentActivities: Activity[];
}