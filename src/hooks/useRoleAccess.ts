import { useMemo } from 'react';
import { 
  isAuthenticated, 
  isCurrentUserAdmin, 
  isCurrentUser, 
  hasUserRole,
  getUserRoles 
} from '../utils/auth';
import { 
  getAccessibleRoutes, 
  canAccessRoute, 
  ROUTE_CONFIGS 
} from '../routes/routeConfig';

/**
 * Custom hook for role-based access control
 * Provides utilities for checking user permissions and route access
 */
export const useRoleAccess = () => {
  const userRoles = useMemo(() => getUserRoles(), []);
  const isAuth = useMemo(() => isAuthenticated(), []);
  const isAdmin = useMemo(() => isCurrentUserAdmin(), []);
  const isUser = useMemo(() => isCurrentUser(), []);

  // Get all accessible routes for current user
  const accessibleRoutes = useMemo(() => 
    getAccessibleRoutes(userRoles), 
    [userRoles]
  );

  // Check if user can access a specific route
  const canAccess = (routeKey: string): boolean => {
    return canAccessRoute(routeKey, userRoles);
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return hasUserRole(role);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasUserRole(role));
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => hasUserRole(role));
  };

  // Get routes by access level
  const getRoutesByAccess = (access: 'public' | 'protected' | 'admin') => {
    return accessibleRoutes.filter(route => route.access === access);
  };

  // Navigation helpers
  const getDefaultRoute = (): string => {
    if (isAdmin) return '/admin';
    if (isUser) return '/dashboard';
    return '/auth/login';
  };

  const getFallbackRoute = (): string => {
    if (isAdmin) return '/admin';
    if (isUser) return '/dashboard';
    return '/auth/login';
  };

  return {
    // User state
    isAuthenticated: isAuth,
    isAdmin,
    isUser,
    userRoles,
    
    // Route access
    accessibleRoutes,
    canAccess,
    getRoutesByAccess,
    
    // Role checking
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Navigation
    getDefaultRoute,
    getFallbackRoute,
    
    // Route configs
    routeConfigs: ROUTE_CONFIGS
  };
};
