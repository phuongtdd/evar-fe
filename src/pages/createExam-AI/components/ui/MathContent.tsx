import React, { useEffect, useRef } from 'react';
import { sanitizeMathContent } from '../../utils/mathUtils';

interface MathContentProps {
  content: string;
  className?: string;
}

/**
 * Component để render nội dung có chứa công thức toán học LaTeX
 * Sử dụng MathJax để render các công thức trong $...$ và $$...$$
 */
const MathContent: React.FC<MathContentProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sanitizedContent = sanitizeMathContent(content);

  useEffect(() => {
    // Load MathJax nếu chưa có
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      
      // Config MathJax
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$']],
          displayMath: [['$$', '$$']],
          processEscapes: true,
          processEnvironments: true,
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        },
        startup: {
          pageReady: () => {
            return window.MathJax.startup.defaultPageReady().then(() => {
              if (containerRef.current) {
                window.MathJax.typesetPromise([containerRef.current]);
              }
            });
          },
        },
      };

      document.head.appendChild(script);

      script.onload = () => {
        if (containerRef.current && window.MathJax) {
          window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
            console.error('MathJax typesetting failed:', err);
          });
        }
      };
    } else {
      // MathJax đã load, chỉ cần typeset lại
      if (containerRef.current && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          console.error('MathJax typesetting failed:', err);
        });
      }
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default MathContent;

// Extend Window interface for TypeScript
declare global {
  interface Window {
    MathJax: any;
  }
}
