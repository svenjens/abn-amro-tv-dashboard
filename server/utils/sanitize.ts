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

/**
 * Simple regex-based HTML sanitizer for serverless environments
 * Removes all HTML tags except those in the allowlist
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html) return ''

  const allowedTags = options.allowedTags || DEFAULT_ALLOWED_TAGS
  
  // Create regex pattern for allowed tags
  const allowedPattern = allowedTags.join('|')
  
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
        // Keep only href for links, add rel="noopener noreferrer" for safety
        const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i)
        const href = hrefMatch ? hrefMatch[1] : ''
        return match.startsWith('</') ? '</a>' : `<a href="${href}" rel="noopener noreferrer">`
      }
      // For other allowed tags, strip all attributes
      return match.startsWith('</') ? `</${lowerTag}>` : `<${lowerTag}>`
    }
    // Remove non-allowed tags
    return ''
  })
  
  // Remove any remaining HTML entities that could be dangerous
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
  
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



