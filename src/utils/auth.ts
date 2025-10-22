import { decodeJwt } from './de-codeJWT';

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
