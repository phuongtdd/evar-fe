/**
 * Utility functions for handling mathematical content
 */

/**
 * Check if content contains LaTeX math expressions
 */
export const hasMathContent = (content: string): boolean => {
  if (!content) return false;
  
  // Check for inline math: $...$
  const inlineMathRegex = /\$[^$]+\$/;
  
  // Check for display math: $$...$$
  const displayMathRegex = /\$\$[^$]+\$\$/;
  
  return inlineMathRegex.test(content) || displayMathRegex.test(content);
};

/**
 * Sanitize content to prevent XSS while preserving math
 */
export const sanitizeMathContent = (content: string): string => {
  if (!content) return '';
  
  // Basic sanitization - remove script tags but keep math
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
};

/**
 * Extract plain text from content (removing LaTeX)
 */
export const extractPlainText = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/\$\$[^$]+\$\$/g, '[equation]')
    .replace(/\$[^$]+\$/g, '[equation]');
};
