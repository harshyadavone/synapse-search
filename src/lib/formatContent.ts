import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
// TODO: Import other language components

// Types for configuration options
interface FormatOptions {
  enableMarkdown?: boolean;
  enableSyntaxHighlighting?: boolean;
  customClasses?: Record<string, string>;
}

interface SanitizeOptions extends DOMPurify.Config {
  customTags?: string[];
}

/**
 * Advanced content formatter with various options
 * @param content The raw content to format
 * @param options Formatting options
 * @returns Formatted HTML string
 */
export const formatContent = (
  content: string,
  options: FormatOptions = {}
): string => {
  const {
    enableMarkdown = true,
    enableSyntaxHighlighting = true,
    customClasses = {},
  } = options;

  let formattedContent = content;

  try {
    if (enableMarkdown) {
      // Configure marked options
      marked.setOptions({
        gfm: true,
        breaks: true,
        // highlight: enableSyntaxHighlighting ? highlightCode : undefined,
      });

      formattedContent = marked(formattedContent) as string;
    }

    // Process all links (both Markdown-generated and original HTML)
    formattedContent = formattedContent.replace(
      /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>(.*?)<\/a>/gi,
      (match, url, attributes, text) => {
        return createLinkSnippet(text, url);
      }
    );

    // Apply custom classes
    Object.entries(customClasses).forEach(([selector, className]) => {
      const regex = new RegExp(`<${selector}`, "g");
      formattedContent = formattedContent.replace(
        regex,
        `<${selector} class="${className}"`
      );
    });

    return formattedContent;
  } catch (error) {
    console.error("Error formatting content:", error);
    return content; // Return original content on error
  }
};

const createLinkSnippet = (text: string, url: string): string => {
  try {
    const siteName = new URL(url).hostname.replace("www.", "");
    return `<a href="${url}" class="site-link" target="_blank" rel="noopener noreferrer">
      ${text}
    </a>`;
  } catch (error) {
    console.error("Error creating link snippet:", error);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`; // Fallback to simple link
  }
};

/**
 * Syntax highlighting function for code blocks
 * @param code The code to highlight
 * @param language The programming language
 * @returns Highlighted HTML
 */
const highlightCode = (code: string, language?: string): string => {
  language = language || "plaintext";
  const grammar = Prism.languages[language] || Prism.languages.plaintext;
  const highlightedCode = Prism.highlight(code, grammar, language);
  return `
    <pre class="language-${language}">
      <div class="code-header">${language}</div>
      <code class="language-${language}">${highlightedCode}</code>
    </pre>
  `;
};

/**
 * Sanitize HTML content
 * @param html The HTML to sanitize
 * @param options Sanitization options
 * @returns Sanitized HTML string
 */
export const sanitizeContent = (
  html: string,
  options: SanitizeOptions = {}
): string => {
  const defaultOptions: SanitizeOptions = {
    ADD_ATTR: ["target", "rel"],
    ADD_TAGS: ["iframe"],
    FORBID_TAGS: ["style", "script"],
    FORBID_ATTR: ["onerror", "onload", "onclick"],
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    return DOMPurify.sanitize(html, mergedOptions) as string;
  } catch (error) {
    console.error("Error sanitizing content:", error);
    return ""; // Return empty string on error for safety
  }
};

/**
 * Combine formatting and sanitization
 * @param content Raw content
 * @param formatOptions Formatting options
 * @param sanitizeOptions Sanitization options
 * @returns Formatted and sanitized HTML string
 */
export const processContent = (
  content: string,
  formatOptions?: FormatOptions,
  sanitizeOptions?: SanitizeOptions
): string => {
  const formatted = formatContent(content, formatOptions);
  return sanitizeContent(formatted, sanitizeOptions);
};
