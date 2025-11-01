// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  canAccessRoute,
  getAccessibleRoutes,
  getPublicRoutes,
  getProtectedRoutes,
  getAdminRoutes,
  ROUTE_CONFIGS,
} from "./routeConfig";

describe("routeConfig helpers", () => {
  it("public routes are accessible without roles", () => {
    expect(canAccessRoute("AUTH_LOGIN", [])).toBe(true);
    expect(canAccessRoute("PROMOTION", [])).toBe(true);
  });

  it("protected routes require ROLE_USER", () => {
    expect(canAccessRoute("DASHBOARD", [])).toBe(false);
    expect(canAccessRoute("DASHBOARD", ["ROLE_USER"]))
      .toBe(true);
  });

  it("admin routes require ROLE_ADMIN", () => {
    expect(canAccessRoute("ADMIN_DASHBOARD", ["ROLE_USER"]))
      .toBe(false);
    expect(canAccessRoute("ADMIN_DASHBOARD", ["ROLE_ADMIN"]))
      .toBe(true);
  });

  it("getAccessibleRoutes respects roles", () => {
    const guest = getAccessibleRoutes([]);
    const user = getAccessibleRoutes(["ROLE_USER"]);
    const admin = getAccessibleRoutes(["ROLE_ADMIN"]);

    // Guests can access all public routes
    expect(guest.every(r => r.access === "public")).toBe(true);

    // Users can access public + protected
    expect(user.some(r => r.access === "protected")).toBe(true);

    // Admins can access public + admin (+ protected due to helper logic based on requiredRoles)
    expect(admin.some(r => r.access === "admin")).toBe(true);
  });

  it("category helpers return subsets", () => {
    expect(getPublicRoutes().every(r => r.access === "public")).toBe(true);
    expect(getProtectedRoutes().every(r => r.access === "protected")).toBe(true);
    expect(getAdminRoutes().every(r => r.access === "admin")).toBe(true);
    expect(Object.values(ROUTE_CONFIGS).length).toBeGreaterThan(0);
  });
});


