import DOMPurify from 'dompurify';

/**
 * Sanitize HTML to prevent XSS attacks.
 * Use this before rendering any user-generated HTML content.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'pre', 'code',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}
