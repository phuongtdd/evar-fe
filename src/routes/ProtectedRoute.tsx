import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { 
  isAuthenticated, 
  isCurrentUserAdmin, 
  isCurrentUser, 
  hasUserRole 
} from '../utils/auth';

// Define route access types
export type RouteAccess = 'public' | 'protected' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  access: RouteAccess;
  requiredRoles?: string[]; // Optional specific roles required
  fallbackPath?: string; // Where to redirect if access denied
}

/**
 * ProtectedRoute component that handles role-based access control
 * 
 * @param children - The component to render if access is granted
 * @param access - The type of access required ('public', 'protected', 'admin')
 * @param requiredRoles - Optional array of specific roles required
 * @param fallbackPath - Path to redirect to if access is denied
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  access,
  requiredRoles = [],
  fallbackPath
}) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isAdmin = isCurrentUserAdmin();
  const isUser = isCurrentUser();

  // Handle public routes - no authentication required
  if (access === 'public') {
    return <>{children}</>;
  }

  // Handle protected routes - require authentication
  if (access === 'protected') {
    if (!isAuth) {
      // Redirect to login with return URL
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Check specific roles if provided
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasUserRole(role));
      if (!hasRequiredRole) {
        // Redirect to unauthorized page or dashboard
        return <Navigate to={fallbackPath || "/dashboard"} replace />;
      }
    }

    return <>{children}</>;
  }

  // Handle admin routes - require admin role
  if (access === 'admin') {
    if (!isAuth) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
      // Redirect to dashboard if not admin
      return <Navigate to={fallbackPath || "/dashboard"} replace />;
    }

    return <>{children}</>;
  }

  // Default fallback - should not reach here
  return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
