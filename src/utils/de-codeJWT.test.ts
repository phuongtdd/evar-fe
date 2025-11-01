// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  decodeJwt,
  isTokenExpired,
  getTokenExpiration,
  getUsernameFromToken,
  getUserIdFromToken,
  getUserRolesFromToken,
  hasRole,
  isAdmin,
  isUser,
} from "./de-codeJWT";

function base64UrlEncode(obj: any): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function makeJwt(payload: any): string {
  const header = { alg: "none", typ: "JWT" };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;
}

describe("de-codeJWT utils", () => {
  it("decodes username and userId", () => {
    const token = makeJwt({ userId: "u1", username: "alice" });
    const decoded = decodeJwt(token);
    expect(decoded.userId).toBe("u1");
    expect(getUsernameFromToken(token)).toBe("alice");
    expect(getUserIdFromToken(token)).toBe("u1");
  });

  it("extracts roles from scope", () => {
    const token = makeJwt({ scope: "ROLE_USER ROLE_ADMIN OTHER" });
    expect(getUserRolesFromToken(token)).toEqual(["ROLE_USER", "ROLE_ADMIN"]);
    expect(hasRole(token, "ROLE_USER")).toBe(true);
    expect(isAdmin(token)).toBe(true);
    expect(isUser(token)).toBe(true);
  });

  it("handles expiration correctly", () => {
    const past = Math.floor(Date.now() / 1000) - 10;
    const future = Math.floor(Date.now() / 1000) + 3600;
    const expiredToken = makeJwt({ exp: past });
    const validToken = makeJwt({ exp: future });
    expect(isTokenExpired(expiredToken)).toBe(true);
    expect(isTokenExpired(validToken)).toBe(false);
    expect(getTokenExpiration(validToken)).toBeInstanceOf(Date);
  });

  it("throws on invalid format", () => {
    expect(() => decodeJwt("invalid" as any)).toThrow();
  });
});


