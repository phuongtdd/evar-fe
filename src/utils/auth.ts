import { 
  decodeJwt, 
  getUserRolesFromToken, 
  hasRole, 
  isAdmin, 
  isUser 
} from './de-codeJWT';

/**
 * Get user ID from JWT token stored in localStorage
 * @returns userId or null if not found or invalid
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = decodeJwt(token);
    return payload.userId || payload.sub || payload.id || null;
  } catch (error) {
    console.error('Error decoding token for userId:', error);
    return null;
  }
};

/**
 * Get username from JWT token stored in localStorage
 * @returns username or null if not found or invalid
 */
export const getUsernameFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = decodeJwt(token);
    return payload.username || payload.sub || payload.name || null;
  } catch (error) {
    console.error('Error decoding token for username:', error);
    return null;
  }
};

/**
 * Get user roles from JWT token stored in localStorage
 * @returns Array of roles or empty array if not found
 */
export const getUserRoles = (): string[] => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    return getUserRolesFromToken(token);
  } catch (error) {
    console.error('Error decoding token for roles:', error);
    return [];
  }
};

/**
 * Check if current user has a specific role
 * @param role - The role to check for (e.g., 'ROLE_USER', 'ROLE_ADMIN')
 * @returns True if user has the role, false otherwise
 */
export const hasUserRole = (role: string): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    return hasRole(token, role);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Check if current user is admin
 * @returns True if user is admin, false otherwise
 */
export const isCurrentUserAdmin = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    return isAdmin(token);
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
};

/**
 * Check if current user is regular user
 * @returns True if user is regular user, false otherwise
 */
export const isCurrentUser = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    return isUser(token);
  } catch (error) {
    console.error('Error checking if user is regular user:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 * @returns True if user has valid token, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};
