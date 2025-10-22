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

export { decodeJwt, isTokenExpired, getTokenExpiration, getUsernameFromToken };
