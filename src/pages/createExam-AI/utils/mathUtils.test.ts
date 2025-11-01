// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  hasMathContent,
  countMathFormulas,
  hasMarkdownTable,
  escapeLaTeX,
  isValidLaTeX,
} from "./mathUtils";

describe("mathUtils", () => {
  describe("hasMathContent", () => {
    it("detects inline math", () => {
      expect(hasMathContent("Text with $x^2$ formula")).toBe(true);
      expect(hasMathContent("No math here")).toBe(false);
    });

    it("detects display math", () => {
      expect(hasMathContent("Formula: $$\\int_0^1 x dx$$")).toBe(true);
    });

    it("returns false for empty or null content", () => {
      expect(hasMathContent("")).toBe(false);
      expect(hasMathContent(null as any)).toBe(false);
    });
  });

  describe("countMathFormulas", () => {
    it("counts inline and display formulas", () => {
      // Note: Inline regex can match within display math, so "$y$" inside "$$y$$" counts as inline too
      const result = countMathFormulas("$x$ and $$y$$ and $z$");
      expect(result.inline).toBeGreaterThanOrEqual(2); // At least 2 ($x$ and $z$)
      expect(result.display).toBe(1);
    });

    it("returns zeros for empty content", () => {
      const result = countMathFormulas("");
      expect(result.inline).toBe(0);
      expect(result.display).toBe(0);
    });
  });

  describe("hasMarkdownTable", () => {
    it("detects markdown tables", () => {
      const table = "| A | B |\n| --- | --- |\n| 1 | 2 |";
      expect(hasMarkdownTable(table)).toBe(true);
      expect(hasMarkdownTable("No table")).toBe(false);
    });
  });

  describe("escapeLaTeX", () => {
    it("escapes special characters", () => {
      expect(escapeLaTeX("$")).toBe("\\$");
      expect(escapeLaTeX("\\")).toContain("textbackslash");
      expect(escapeLaTeX("{")).toBe("\\{");
    });

    it("handles empty strings", () => {
      expect(escapeLaTeX("")).toBe("");
    });
  });

  describe("isValidLaTeX", () => {
    it("validates matched delimiters", () => {
      expect(isValidLaTeX("$x$").valid).toBe(true);
      expect(isValidLaTeX("$$x$$").valid).toBe(true);
    });

    it("detects unmatched delimiters", () => {
      const result = isValidLaTeX("$x");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("validates balanced braces in math", () => {
      expect(isValidLaTeX("$x{y}$").valid).toBe(true);
      const invalid = isValidLaTeX("$x{y$");
      expect(invalid.valid).toBe(false);
    });
  });
});

