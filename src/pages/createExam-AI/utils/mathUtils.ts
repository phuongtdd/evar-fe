import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Utility functions for handling mathematical content with Markdown support
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown (tables, strikethrough, etc.)
  breaks: true, // Convert \n to <br>
});

// Configure DOMPurify allowed tags and attributes
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // Text formatting
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
    
    // Headers
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    
    // Lists
    'ul', 'ol', 'li',
    
    // Tables (for Markdown tables)
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    
    // Other
    'blockquote', 'hr', 'a', 'img',
    
    // For MathJax
    'div', 'span',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'src', 'alt',
    'class', 'id', 'style',
    'align', 'colspan', 'rowspan', // For tables
    'target', 'rel', // For links
  ],
  ALLOW_DATA_ATTR: false,
  KEEP_CONTENT: true,
};

// ===================================================================
// MAIN FUNCTIONS
// ===================================================================

/**
 * Sanitize và convert Markdown + Math content sang HTML an toàn
 * 
 * Flow:
 * 1. Convert \\n thành actual newlines
 * 2. Parse Markdown to HTML (bao gồm tables)
 * 3. Sanitize HTML với DOMPurify
 * 4. Giữ nguyên LaTeX delimiters ($...$, $$...$$) cho MathJax
 * 
 * @param content - Raw content từ backend (có thể chứa \\n, Markdown, LaTeX)
 * @returns Safe HTML string ready to render
 */
export const sanitizeMathContent = (content: string): string => {
  if (!content) return '';

  try {
    // Step 1: Convert escaped newlines to actual newlines
    // Backend trả về "text\\n\\ntable" → "texttable"
    let processed = content.replace(/\\n/g, '');

    // Step 2: Parse Markdown to HTML
    // "| A | B ||---|---|| 1 | 2 |" → "<table>...</table>"
const html = marked.parse(processed, { async: false }) as string;

    // Step 3: Sanitize HTML but preserve MathJax syntax
    const clean = DOMPurify.sanitize(html, DOMPURIFY_CONFIG);

    return clean;
  } catch (error) {
    console.error('❌ Error in sanitizeMathContent:', error);
    
    // Fallback: basic sanitization without Markdown parsing
    return DOMPurify.sanitize(content, DOMPURIFY_CONFIG);
  }
};

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
 * Extract plain text from content (removing LaTeX and HTML)
 * Useful for search, preview, character count
 */
export const extractPlainText = (content: string): string => {
  if (!content) return '';
  
  try {
    // Remove math formulas
    let text = content
      .replace(/\$\$[^$]+\$\$/g, ' [công thức] ')
      .replace(/\$[^$]+\$/g, ' [công thức] ');
    
    // Convert to HTML first
    const html = marked.parse(text, { async: false }) as string;
    
    // Extract text from HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    return (temp.textContent || temp.innerText || '').trim();
  } catch (error) {
    console.error('❌ Error in extractPlainText:', error);
    return content.replace(/\$\$[^$]+\$\$/g, '').replace(/\$[^$]+\$/g, '');
  }
};

// ===================================================================
// ADDITIONAL UTILITIES
// ===================================================================

/**
 * Count math formulas in content
 */
export const countMathFormulas = (content: string): { inline: number; display: number } => {
  if (!content) return { inline: 0, display: 0 };
  
  const inlineMatches = content.match(/\$[^$]+\$/g) || [];
  const displayMatches = content.match(/\$\$[^$]+\$\$/g) || [];
  
  return {
    inline: inlineMatches.length,
    display: displayMatches.length,
  };
};

/**
 * Check if content contains Markdown tables
 */
export const hasMarkdownTable = (content: string): boolean => {
  if (!content) return false;
  
  // Simple check for Markdown table pattern: | col1 | col2 |
  const tableRegex = /\|.+\|[\r]+\|[-:\s|]+\|/;
  return tableRegex.test(content);
};

/**
 * Escape LaTeX special characters for display (not for rendering)
 */
export const escapeLaTeX = (text: string): string => {
  if (!text) return '';
  
  const escapeMap: Record<string, string> = {
    '\\': '\\textbackslash{}',
    '{': '\\{',
    '}': '\\}',
    '$': '\\$',
    '&': '\\&',
    '%': '\\%',
    '#': '\\#',
    '_': '\\_',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
  };
  
  return text.replace(/[\\{}$&%#_~^]/g, (char) => escapeMap[char] || char);
};

/**
 * Validate LaTeX syntax (basic check)
 */
export const isValidLaTeX = (content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check matching $ delimiters
  const singleDollarCount = (content.match(/(?<!\$)\$(?!\$)/g) || []).length;
  if (singleDollarCount % 2 !== 0) {
    errors.push('Số lượng $ không khớp (phải là số chẵn)');
  }
  
  // Check matching $$ delimiters
  const doubleDollarCount = (content.match(/\$\$/g) || []).length;
  if (doubleDollarCount % 2 !== 0) {
    errors.push('Số lượng $$ không khớp (phải là số chẵn)');
  }
  
  // Check matching braces
  let braceDepth = 0;
  let inMath = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    // Track if we're inside math mode
    if (char === '$') {
      if (nextChar === '$') {
        inMath = !inMath;
        i++; // Skip next $
      } else {
        inMath = !inMath;
      }
    }
    
    // Only check braces inside math mode
    if (inMath) {
      if (char === '{' && content[i - 1] !== '\\') braceDepth++;
      if (char === '}' && content[i - 1] !== '\\') braceDepth--;
      
      if (braceDepth < 0) {
        errors.push('Dấu ngoặc nhọn } thừa');
        break;
      }
    }
  }
  
  if (braceDepth > 0) {
    errors.push('Thiếu dấu ngoặc nhọn } đóng');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Preview text for display in lists/cards
 */
export const generatePreview = (content: string, maxLength: number = 150): string => {
  const plainText = extractPlainText(content);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * Convert content to safe HTML for email/export
 */
export const toSafeHTML = (content: string): string => {
  const sanitized = sanitizeMathContent(content);
  
  // Wrap in container with basic styling
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
      ${sanitized}
    </div>
  `;
};

// ===================================================================
// DEBUG UTILITIES (Remove in production)
// ===================================================================

/**
 * Debug: Log processing steps
 */
export const debugSanitize = (content: string): void => {
  console.group('🔍 Debug sanitizeMathContent');
  
  console.log('📥 Original:', content);
  
  const afterNewlines = content.replace(/\\n/g, '');
  console.log('📝 After newlines:', afterNewlines);
  
  const html = marked.parse(afterNewlines, { async: false }) as string;
  console.log('🔄 After Markdown:', html);
  
  const clean = DOMPurify.sanitize(html, DOMPURIFY_CONFIG);
  console.log('✅ After sanitize:', clean);
  
  console.groupEnd();
};

// ===================================================================
// EXPORTS
// ===================================================================

export default {
  sanitizeMathContent,
  hasMathContent,
  extractPlainText,
  countMathFormulas,
  hasMarkdownTable,
  escapeLaTeX,
  isValidLaTeX,
  generatePreview,
  toSafeHTML,
  debugSanitize,
};