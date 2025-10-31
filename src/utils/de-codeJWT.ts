function decodeJwt(token: string): any {
  // Check if token format is valid (three parts separated by dots)
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid JWT token format. Expected 3 parts separated by dots."
    );
  }

  try {
    // Decode payload (second part) - base64url to base64 conversion
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const decoded = atob(paddedBase64);
    const payload = JSON.parse(decodeURIComponent(escape(decoded)));
    return payload;
  } catch (error: any) {
    throw new Error("Failed to decode JWT token: " + error.message);
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns True if the token is expired, false otherwise
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp !== undefined && payload.exp < currentTime;
  } catch {
    return true;
  }
}

function getTokenExpiration(token: string): Date | null {
  try {
    const payload = decodeJwt(token);
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
}

function getUsernameFromToken(token: string): string | null {
  try {
    const payload = decodeJwt(token);

    if (payload.sub) return payload.sub;
    if (payload.username) return payload.username;
    if (payload.name) return payload.name;
    if (payload.user) return payload.user;
    if (payload.email) return payload.email;

    return null;
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = decodeJwt(token);
    return payload.userId || payload.sub || payload.id || null;
  } catch {
    return null;
  }
}

/**
 * Get user roles from JWT token scope
 * @param token - The JWT token to extract roles from
 * @returns Array of roles or empty array if not found
 */
function getUserRolesFromToken(token: string): string[] {
  try {
    const payload = decodeJwt(token);
    if (payload.scope && typeof payload.scope === 'string') {
      return payload.scope.split(' ').filter((role: string) => role.startsWith('ROLE_'));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Check if user has a specific role
 * @param token - The JWT token to check
 * @param role - The role to check for (e.g., 'ROLE_USER', 'ROLE_ADMIN')
 * @returns True if user has the role, false otherwise
 */
function hasRole(token: string, role: string): boolean {
  const userRoles = getUserRolesFromToken(token);
  return userRoles.includes(role);
}

/**
 * Check if user is admin
 * @param token - The JWT token to check
 * @returns True if user is admin, false otherwise
 */
function isAdmin(token: string): boolean {
  return hasRole(token, 'ROLE_ADMIN');
}

/**
 * Check if user is regular user
 * @param token - The JWT token to check
 * @returns True if user is regular user, false otherwise
 */
function isUser(token: string): boolean {
  return hasRole(token, 'ROLE_USER');
}

export { 
  decodeJwt, 
  isTokenExpired, 
  getTokenExpiration, 
  getUsernameFromToken, 
  getUserIdFromToken,
  getUserRolesFromToken,
  hasRole,
  isAdmin,
  isUser
};
