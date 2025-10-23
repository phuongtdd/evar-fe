import { RouteAccess } from './ProtectedRoute';

// Define route configuration interface
export interface RouteConfig {
  path: string;
  access: RouteAccess;
  requiredRoles?: string[];
  fallbackPath?: string;
  description?: string;
}

// Route configurations for different access levels
export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  // Public routes - no authentication required
  AUTH_LOGIN: {
    path: '/auth/login',
    access: 'public',
    description: 'User login page'
  },
  AUTH_REGISTER: {
    path: '/auth/register',
    access: 'public',
    description: 'User registration page'
  },
  PROMOTION: {
    path: '/promotion',
    access: 'public',
    description: 'Promotion page'
  },

  // Protected routes - require authentication (ROLE_USER)
  DASHBOARD: {
    path: '/dashboard',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'User dashboard'
  },
  ROOM: {
    path: '/room',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Study room'
  },
  STUDY_ROOM: {
    path: '/study-room',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Study room UI'
  },
  QUIZ_DASHBOARD: {
    path: '/quiz',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Quiz dashboard'
  },
  CREATE_QUIZ_MANUAL: {
    path: '/quiz/create/create-manual',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Create quiz manually'
  },
  CREATE_QUIZ_AI: {
    path: '/quiz/create/create-AI',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Create quiz with AI'
  },
  TAKE_QUIZ_PRACTICE: {
    path: '/quiz/takeQuiz/practice',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Take practice quiz'
  },
  TAKE_QUIZ_EXAM: {
    path: '/quiz/takeQuiz/exam',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Take exam'
  },
  CHAT: {
    path: '/chat',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'Real-time chat'
  },
  ACCOUNT: {
    path: '/account',
    access: 'protected',
    requiredRoles: ['ROLE_USER'],
    description: 'User profile'
  },

  // Admin routes - require ROLE_ADMIN
  ADMIN_DASHBOARD: {
    path: '/admin',
    access: 'admin',
    requiredRoles: ['ROLE_ADMIN'],
    description: 'Admin dashboard'
  },
  ADMIN_MANAGE_SUBJECT: {
    path: '/admin/manage-subject',
    access: 'admin',
    requiredRoles: ['ROLE_ADMIN'],
    description: 'Manage subjects'
  },
  ADMIN_MANAGE_EXAM: {
    path: '/admin/manage-exam',
    access: 'admin',
    requiredRoles: ['ROLE_ADMIN'],
    description: 'Manage exams'
  },
  ADMIN_CREATE_EXAM: {
    path: '/admin/create-exam',
    access: 'admin',
    requiredRoles: ['ROLE_ADMIN'],
    description: 'Create exam'
  }
};

// Helper functions for route access
export const getRouteConfig = (routeKey: string): RouteConfig | undefined => {
  return ROUTE_CONFIGS[routeKey];
};

export const getRoutesByAccess = (access: RouteAccess): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(config => config.access === access);
};

export const getPublicRoutes = (): RouteConfig[] => {
  return getRoutesByAccess('public');
};

export const getProtectedRoutes = (): RouteConfig[] => {
  return getRoutesByAccess('protected');
};

export const getAdminRoutes = (): RouteConfig[] => {
  return getRoutesByAccess('admin');
};

// Role-based route access helpers
export const canAccessRoute = (routeKey: string, userRoles: string[]): boolean => {
  const config = getRouteConfig(routeKey);
  if (!config) return false;

  // Public routes are always accessible
  if (config.access === 'public') return true;

  // For protected and admin routes, check if user has required roles
  if (config.requiredRoles && config.requiredRoles.length > 0) {
    return config.requiredRoles.some(role => userRoles.includes(role));
  }

  return true;
};

export const getAccessibleRoutes = (userRoles: string[]): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(config => 
    canAccessRoute(Object.keys(ROUTE_CONFIGS).find(key => ROUTE_CONFIGS[key] === config) || '', userRoles)
  );
};
