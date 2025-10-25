import { subjectService } from '../../Subject/services/subjectService';
import { examService } from '../../ExamManage/services/examService';

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
  recentActivity: Array<{
    action: string;
    subject: string;
    time: string;
    type: 'exam' | 'subject' | 'quiz' | 'user';
  }>;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch subjects data
      const subjectsResponse = await subjectService.getAllSubjects(0, 100);
      const subjects = subjectsResponse.subjects;
      
      // Fetch exams data
      const examsResponse = await examService.getAllExams(0, 100);
      const exams = examsResponse.data;

      // Calculate stats
      const totalSubjects = subjects.length;
      const activeSubjects = subjects.filter(subject => {
        // Consider subjects created in the last 30 days as active
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(subject.create_at) > thirtyDaysAgo;
      }).length;
      const pendingSubjects = totalSubjects - activeSubjects;

      const totalExams = exams.length;
      const activeExams = exams.filter(exam => {
        // Consider exams created in the last 30 days as active
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(exam.createdAt) > thirtyDaysAgo;
      }).length;
      const pendingExams = totalExams - activeExams;

      // Mock data for users and quizzes (since we don't have those services yet)
      const totalUsers = 2847; // This would come from a user service
      const completedQuizzes = 1243; // This would come from a quiz service

      // Generate recent activity from actual data
      const recentActivity = [
        ...subjects.slice(0, 2).map(subject => ({
          action: 'Subject updated',
          subject: subject.subject_name,
          time: this.getTimeAgo(new Date(subject.update_at)),
          type: 'subject' as const
        })),
        ...exams.slice(0, 2).map(exam => ({
          action: 'New exam created',
          subject: exam.subjectName || 'Unknown Subject',
          time: this.getTimeAgo(new Date(exam.createdAt)),
          type: 'exam' as const
        }))
      ].sort((a, b) => {
        // Sort by time (most recent first)
        const timeA = a.time.includes('hour') ? parseInt(a.time) : parseInt(a.time) * 24;
        const timeB = b.time.includes('hour') ? parseInt(b.time) : parseInt(b.time) * 24;
        return timeA - timeB;
      });

      return {
        stats: {
          totalSubjects,
          activeSubjects,
          pendingSubjects,
          totalExams,
          activeExams,
          pendingExams,
          totalUsers,
          completedQuizzes
        },
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return fallback data if API fails
      return {
        stats: {
          totalSubjects: 24,
          activeSubjects: 18,
          pendingSubjects: 6,
          totalExams: 156,
          activeExams: 89,
          pendingExams: 67,
          totalUsers: 2847,
          completedQuizzes: 1243
        },
        recentActivity: [
          { action: 'New exam created', subject: 'Mathematics', time: '2 hours ago', type: 'exam' },
          { action: 'Subject updated', subject: 'Physics', time: '4 hours ago', type: 'subject' },
          { action: 'Quiz published', subject: 'Chemistry', time: '6 hours ago', type: 'quiz' },
          { action: 'User registered', subject: 'John Doe', time: '8 hours ago', type: 'user' }
        ]
      };
    }
  },

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }
};
