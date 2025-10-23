export interface AdminStats {
  total: number;
  active: number;
  pending: number;
}

export interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  stats: AdminStats;
  onNavigate: () => void;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendText?: string;
}

export interface RecentActivity {
  action: string;
  subject: string;
  time: string;
  type: 'exam' | 'subject' | 'quiz' | 'user';
}

export interface DashboardStats {
  totalSubjects: number;
  activeSubjects: number;
  pendingSubjects: number;
  totalExams: number;
  activeExams: number;
  pendingExams: number;
  totalUsers: number;
  completedQuizzes: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}
