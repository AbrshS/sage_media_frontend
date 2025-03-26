export interface UserProfile {
  id?: string;
  fullName: string;
  profileImage?: string;
  portraitPhoto?: string;  // Add this field
  bio?: string;
  location?: {
    city?: string;
    country?: string;
  };
  isVerified?: boolean;
  votes?: number;
  competition?: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  phone?: string;
  joinDate?: string;
  skills?: string[];
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  isPro?: boolean;
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