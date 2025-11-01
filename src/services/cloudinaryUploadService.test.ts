// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { getOptimizedPdfUrl } from "./cloudinaryUploadService";

describe("cloudinaryUploadService", () => {
  describe("getOptimizedPdfUrl", () => {
    it("generates correct Cloudinary URL", () => {
      const publicId = "sample123";
      const url = getOptimizedPdfUrl(publicId);
      expect(url).toContain("res.cloudinary.com");
      expect(url).toContain(publicId);
      expect(url).toContain("raw/upload");
    });

    it("uses default cloudName when not provided", () => {
      const url = getOptimizedPdfUrl("test-id");
      expect(url).toContain("dxt8ylemj");
    });

    it("uses custom cloudName when provided", () => {
      const customCloudName = "custom-cloud";
      const url = getOptimizedPdfUrl("test-id", customCloudName);
      expect(url).toContain(customCloudName);
    });
  });
});

