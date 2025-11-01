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
 * Wraps raw LaTeX expressions (without delimiters) in $...$ delimiters
 * This fixes AI OCR responses that return LaTeX like \dfrac{x+1}{x-2} without $ delimiters
 * 
 * @param content - Content that may contain raw LaTeX expressions
 * @returns Content with raw LaTeX wrapped in $ delimiters
 */
const wrapRawLaTeX = (content: string): string => {
  if (!content) return '';
  
  // Skip if already wrapped
  if (content.includes('$')) {
    return content;
  }

  // Process the whole content (answers are typically single strings)
  let processed = content;
  
  // Pattern to match: variable assignment followed by LaTeX or math expression
  // Examples: "y = \dfrac{x+1}{x-2}", "y = -x-3", "y = x^3 + x^2 + 3x - 2018"
  
  // Find all LaTeX command matches and wrap them with their context
  const matches: Array<{ start: number; end: number }> = [];
  
  // Pattern 1: Match backslash LaTeX commands with optional variable assignment
  // Example: "y = \dfrac{x+1}{x-2}"
  const latexCommandPattern = /([a-zA-Z]\s*=\s*)?\\(?:dfrac|frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln|exp|vec|overline|underline|hat|bar|dot|ddot|partial|nabla|Delta|alpha|beta|gamma|delta|epsilon|pi|theta|lambda|mu|sigma|phi|omega|Gamma|Delta|Theta|Lambda|Pi|Sigma|Phi|Omega|in|notin|subset|supset|cup|cap|emptyset|exists|forall|rightarrow|leftarrow|leftrightarrow|leq|geq|neq|approx|equiv|propto|pm|mp|times|div|cdot|ast|circ|oplus|ominus|otimes|bigcup|bigcap|bigvee|bigwedge|coprod|bigoplus|bigotimes|begin|end|matrix|pmatrix|bmatrix|vmatrix|cases|align|equation|label|ref|textbf|textit|text|mathrm|mathit|mathbf|mathsf|mathtt|mathcal|mathbb|[a-zA-Z@]+)(?:\s*\{[^}]*\})*/g;
  
  let m;
  latexCommandPattern.lastIndex = 0;
  while ((m = latexCommandPattern.exec(processed)) !== null) {
    let start = m.index;
    let end = m.index + m[0].length;
    
    // Look backward for variable assignment
    const beforeText = processed.substring(Math.max(0, start - 10), start);
    const varMatch = beforeText.match(/([a-zA-Z]\s*=\s*)$/);
    if (varMatch) {
      start -= varMatch[1].length;
    }
    
    // Look forward to find the end of the expression
    // Include all braces and continue until a natural break point
    while (end < processed.length) {
      const char = processed[end];
      if (char === '{') {
        // Include balanced braces
        let braceCount = 1;
        end++;
        while (braceCount > 0 && end < processed.length) {
          if (processed[end] === '{' && processed[end - 1] !== '\\') braceCount++;
          if (processed[end] === '}' && processed[end - 1] !== '\\') braceCount--;
          end++;
        }
      } else if (char === ' ') {
        // Check if there's more math after the space
        const remaining = processed.substring(end + 1).trim();
        if (/^[\+\-\*\/\=]/.test(remaining) || /^[a-zA-Z0-9\(\\]/.test(remaining)) {
          end++; // Include the space and continue
        } else {
          break; // Stop if not continuing math
        }
      } else if (/[\n\r\.\,\;\!\?]/.test(char)) {
        break; // Stop at punctuation or newline
      } else if (/[\+\-\*\/\=\(\)\[\]\^\_a-zA-Z0-9]/.test(char) || char === '\\') {
        end++; // Continue with math characters or LaTeX commands
      } else {
        break; // Stop at other characters
      }
    }
    
    matches.push({ start, end });
  }
  
  // Pattern 2: Match expressions with superscript/subscript (like x^2, y = x^3 + x^2)
  const supSubPattern = /([a-zA-Z]\s*=\s*)?[a-zA-Z0-9]+\s*[\^\_](\{[^}]+\}|[a-zA-Z0-9]+)(?:\s*[\+\-\*\/]\s*[a-zA-Z0-9\(\)\{\}\^\_\+\-\*\/]+)*/g;
  
  supSubPattern.lastIndex = 0;
  while ((m = supSubPattern.exec(processed)) !== null) {
    // Check if this overlaps with an existing match
    const overlaps = matches.some(existing => m.index < existing.end && m.index + m[0].length > existing.start);
    if (!overlaps) {
      matches.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  
  // Pattern 3: Match simple math expressions with variable assignment
  // Example: "y = -x-3" (expressions with operators but no LaTeX commands or superscripts)
  const simpleMathPattern = /\b([a-zA-Z]\s*=\s*[\+\-\*\/]?[a-zA-Z0-9]+(?:\s*[\+\-\*\/]\s*[\+\-\*\/]?[a-zA-Z0-9]+)+)\b/g;
  
  simpleMathPattern.lastIndex = 0;
  while ((m = simpleMathPattern.exec(processed)) !== null) {
    // Check if this overlaps with an existing match
    const overlaps = matches.some(existing => m.index < existing.end && m.index + m[0].length > existing.start);
    if (!overlaps) {
      matches.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  
  // Sort matches by start position (descending) and wrap them
  matches.sort((a, b) => b.start - a.start);
  
  for (const match of matches) {
    const expr = processed.substring(match.start, match.end).trim();
    if (expr && !expr.includes('$')) {
      processed = processed.substring(0, match.start) + `$${expr}$` + processed.substring(match.end);
    }
  }
  
  return processed;
};

/**
 * Sanitize và convert Markdown + Math content sang HTML an toàn
 * 
 * Flow:
 * 1. Convert \\n thành actual newlines
 * 2. Wrap raw LaTeX expressions (from AI OCR) in $ delimiters
 * 3. Parse Markdown to HTML (bao gồm tables)
 * 4. Sanitize HTML với DOMPurify
 * 5. Giữ nguyên LaTeX delimiters ($...$, $$...$$) cho MathJax
 * 
 * @param content - Raw content từ backend (có thể chứa \\n, Markdown, LaTeX)
 * @returns Safe HTML string ready to render
 */
export const sanitizeMathContent = (content: string): string => {
  if (!content) return '';

  try {
    // Step 1: Convert escaped newlines to actual newlines
    // Backend trả về "text\\n\\ntable" → "text\n\ntable" (giữ dòng để Markdown table hoạt động)
    let processed = content
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '    '); // giữ tab như 4 spaces để canh cột tốt hơn

    // Step 2: Wrap raw LaTeX expressions in $ delimiters (fixes AI OCR responses)
    processed = wrapRawLaTeX(processed);

    // Step 3: Parse Markdown to HTML
    // "| A | B ||---|---|| 1 | 2 |" → "<table>...</table>"
const html = marked.parse(processed, { async: false }) as string;

    // Step 4: Sanitize HTML but preserve MathJax syntax
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
  
  // Simple check for Markdown table pattern: header line then separator line
  // Matches:
  // | A | B |\n| --- | --- |
  const tableRegex = /\|.*\|[\r\n]+\|[-:|\s]+\|/s;
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