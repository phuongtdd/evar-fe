// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { evarTutorUtils } from "./evarTutorService";

describe("evarTutorUtils", () => {
  describe("formatFileSize", () => {
    it("formats bytes correctly", () => {
      expect(evarTutorUtils.formatFileSize(0)).toBe("0 Bytes");
      expect(evarTutorUtils.formatFileSize(1024)).toContain("KB");
      expect(evarTutorUtils.formatFileSize(1024 * 1024)).toContain("MB");
      expect(evarTutorUtils.formatFileSize(1024 * 1024 * 1024)).toContain("GB");
    });

    it("handles decimal values", () => {
      const result = evarTutorUtils.formatFileSize(1536);
      expect(result).toMatch(/^\d+\.\d+ KB$/);
    });
  });

  describe("validatePdfFile", () => {
    it("validates valid PDF files", () => {
      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const result = evarTutorUtils.validatePdfFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects non-PDF files", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const result = evarTutorUtils.validatePdfFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("PDF");
    });

    it("rejects files larger than 10MB", () => {
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], "large.pdf", {
        type: "application/pdf",
      });
      const result = evarTutorUtils.validatePdfFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("lớn");
    });

    it("rejects null/undefined files", () => {
      const result1 = evarTutorUtils.validatePdfFile(null as any);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBeDefined();

      const result2 = evarTutorUtils.validatePdfFile(undefined as any);
      expect(result2.isValid).toBe(false);
    });

    it("accepts files with uppercase .PDF extension", () => {
      const file = new File(["content"], "test.PDF", { type: "application/pdf" });
      const result = evarTutorUtils.validatePdfFile(file);
      expect(result.isValid).toBe(true);
    });
  });
});

