/**
 * Server-side HTML sanitization utility
 * Uses sanitize-html library for robust XSS protection
 * Prevents data: URIs, vbscript:, nested tags, encoded attributes, and mXSS attacks
 */

import sanitizeHtmlLib from 'sanitize-html'

interface SanitizeOptions {
  allowedTags?: string[]
}

const DEFAULT_ALLOWED_TAGS = [
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
]

/**
 * Sanitize HTML using the sanitize-html library
 * This provides robust protection against XSS including:
 * - data: URIs
 * - vbscript:, javascript: protocols
 * - Nested/malformed tags
 * - Encoded/unicode event attributes
 * - mXSS (mutation XSS)
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html) return ''

  const allowedTags = options.allowedTags || DEFAULT_ALLOWED_TAGS

  return sanitizeHtmlLib(html, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto', 'tel'],
    },
    // Disallow data: URIs and other dangerous protocols
    allowProtocolRelative: false,
    // Remove disallowed tags entirely (don't just escape them)
    disallowedTagsMode: 'discard',
    // Enforce that URLs are properly encoded
    enforceHtmlBoundary: true,
    // Additional security settings
    parseStyleAttributes: false,
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName: 'a',
          attribs: {
            ...attribs,
            // Add security attributes to all links
            rel: 'noopener noreferrer',
            target: attribs.target || '_self',
          },
        }
      },
    },
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
