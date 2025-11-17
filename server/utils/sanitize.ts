/**
 * Server-side HTML sanitization utility
 * Sanitizes HTML content during SSR for better performance and security
 */

import DOMPurify from 'isomorphic-dompurify'

interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: string[]
  addAttributes?: string[]
}

const DEFAULT_OPTIONS: SanitizeOptions = {
  allowedTags: [
    'p',
    'b',
    'i',
    'em',
    'strong',
    'a',
    'br',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ],
  allowedAttributes: ['href', 'target', 'rel'],
  addAttributes: ['target', 'rel'],
}

/**
 * Sanitize HTML content server-side
 * This is called during SSR to clean HTML before it reaches the client
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html) return ''

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: mergedOptions.allowedTags,
    ALLOWED_ATTR: mergedOptions.allowedAttributes,
    ADD_ATTR: mergedOptions.addAttributes,
  })
}

/**
 * Sanitize show summary (TVMaze API often includes HTML)
 */
export function sanitizeShowSummary(summary: string | null): string {
  if (!summary) return ''
  return sanitizeHtml(summary)
}

/**
 * Sanitize episode summary
 */
export function sanitizeEpisodeSummary(summary: string | null): string {
  if (!summary) return ''
  return sanitizeHtml(summary)
}

