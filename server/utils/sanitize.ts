/**
 * Server-side HTML sanitization utility
 * Sanitizes HTML content during SSR for better performance and security
 * Using regex-based approach to avoid jsdom issues in serverless environments
 */

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

const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

/**
 * Sanitize URL to prevent XSS attacks via href attributes
 * Handles encoded forms like j&#97;vascript:
 */
function sanitizeUrl(url: string): string {
  if (!url) return ''
  
  // Decode HTML entities (handles j&#97;vascript: and similar)
  let decoded = url
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
  
  // Strip whitespace and control characters that could be used for obfuscation
  decoded = decoded.trim().replace(/[\x00-\x1f\x7f-\x9f]/g, '')
  
  // Check if it's a relative URL (safe)
  if (decoded.startsWith('/') || decoded.startsWith('./') || decoded.startsWith('../')) {
    return decoded
  }
  
  // Check if it has a protocol
  if (decoded.includes(':')) {
    // Extract and lowercase the protocol
    const protocol = decoded.split(':')[0].toLowerCase() + ':'
    
    // Reject dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']
    if (dangerousProtocols.some(dangerous => protocol === dangerous)) {
      return '' // Return empty string for dangerous URLs
    }
    
    // Only allow safe protocols
    if (!SAFE_URL_PROTOCOLS.includes(protocol)) {
      return ''
    }
  }
  
  return decoded
}

/**
 * Simple regex-based HTML sanitizer for serverless environments
 * Removes all HTML tags except those in the allowlist
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html) return ''

  const allowedTags = options.allowedTags || DEFAULT_ALLOWED_TAGS
  
  // Remove script and style tags completely (including content)
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove all tags except allowed ones
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    const lowerTag = tag.toLowerCase()
    if (allowedTags.includes(lowerTag)) {
      // For allowed tags, remove potentially dangerous attributes
      if (lowerTag === 'a') {
        // Extract, sanitize, and validate href
        const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i)
        const rawHref = hrefMatch ? hrefMatch[1] : ''
        const sanitizedHref = sanitizeUrl(rawHref)
        
        // Only create link if href is safe, otherwise strip the tag
        if (!sanitizedHref) {
          return match.startsWith('</') ? '' : ''
        }
        
        return match.startsWith('</') ? '</a>' : `<a href="${sanitizedHref}" rel="noopener noreferrer">`
      }
      // For other allowed tags, strip all attributes
      return match.startsWith('</') ? `</${lowerTag}>` : `<${lowerTag}>`
    }
    // Remove non-allowed tags
    return ''
  })
  
  return sanitized.trim()
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



