// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("./de-codeJWT", () => {
  return {
    decodeJwt: vi.fn((token: string) => {
      if (!token) throw new Error("no token");
      return { userId: "123", username: "johndoe", scope: "ROLE_USER ROLE_ADMIN" };
    }),
    getUserRolesFromToken: vi.fn(() => ["ROLE_USER", "ROLE_ADMIN"]),
    hasRole: vi.fn((_: string, role: string) => ["ROLE_USER", "ROLE_ADMIN"].includes(role)),
    isAdmin: vi.fn(() => true),
    isUser: vi.fn(() => true),
  };
});

import {
  getUserIdFromToken,
  getUsernameFromToken,
  getUserRoles,
  hasUserRole,
  isCurrentUserAdmin,
  isCurrentUser,
  isAuthenticated,
} from "./auth";

const DUMMY_JWT = "aaa.bbb.ccc";

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns nulls/empties when no token present", () => {
    expect(getUserIdFromToken()).toBeNull();
    expect(getUsernameFromToken()).toBeNull();
    expect(getUserRoles()).toEqual([]);
    expect(hasUserRole("ROLE_USER")).toBe(false);
    expect(isCurrentUserAdmin()).toBe(false);
    expect(isCurrentUser()).toBe(false);
    expect(isAuthenticated()).toBe(false);
  });

  it("reads values from token when present", () => {
    localStorage.setItem("token", DUMMY_JWT);

    expect(getUserIdFromToken()).toBe("123");
    expect(getUsernameFromToken()).toBe("johndoe");
    expect(getUserRoles()).toEqual(["ROLE_USER", "ROLE_ADMIN"]);
    expect(hasUserRole("ROLE_USER")).toBe(true);
    expect(hasUserRole("ROLE_ADMIN")).toBe(true);
    expect(isCurrentUserAdmin()).toBe(true);
    expect(isCurrentUser()).toBe(true);
    expect(isAuthenticated()).toBe(true);
  });
});


