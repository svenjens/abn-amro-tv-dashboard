import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '~/server/utils/sanitize'

describe('sanitizeHtml', () => {
  describe('Basic HTML sanitization', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).toContain('<em>')
      expect(result).toContain('bold')
      expect(result).toContain('italic')
    })

    it('should remove script tags', () => {
      const input = '<p>Safe text</p><script>alert("XSS")</script>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Safe text')
      expect(result).not.toContain('<script')
      expect(result).not.toContain('alert')
    })

    it('should remove style tags', () => {
      const input = '<p>Safe text</p><style>body { display: none; }</style>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Safe text')
      expect(result).not.toContain('<style')
      expect(result).not.toContain('display')
    })

    it('should remove non-allowed tags', () => {
      const input = '<p>Safe</p><iframe src="evil.com"></iframe>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Safe')
      expect(result).not.toContain('<iframe')
    })

    it('should strip attributes from non-link tags', () => {
      const input = '<p onclick="alert(\'XSS\')">Click me</p>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Click me')
      expect(result).not.toContain('onclick')
    })
  })

  describe('URL sanitization - dangerous protocols', () => {
    it('should block javascript: protocol', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      // sanitize-html removes dangerous href but keeps text content
      expect(result).toContain('Click')
    })

    it('should block encoded javascript: protocol (&#97;)', () => {
      const input = '<a href="j&#97;vascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })

    it('should block hex-encoded javascript: protocol', () => {
      const input = '<a href="j&#x61;vascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })

    it('should block data: URLs', () => {
      const input = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('data:')
      expect(result).toContain('Click')
    })

    it('should block vbscript: protocol', () => {
      const input = '<a href="vbscript:msgbox(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('vbscript:')
      expect(result).toContain('Click')
    })

    it('should block file: protocol', () => {
      const input = '<a href="file:///etc/passwd">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('file:')
      expect(result).toContain('Click')
    })

    it('should block blob: URLs', () => {
      const input = '<a href="blob:https://example.com/uuid">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('blob:')
      expect(result).toContain('Click')
    })

    it('should handle obfuscated javascript with whitespace', () => {
      const input = '<a href="   javascript:  alert(1)  ">Click</a>'
      const result = sanitizeHtml(input)
      // After removing whitespace, it should be detected and blocked
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })
  })

  describe('URL sanitization - safe protocols', () => {
    it('should allow http:// URLs', () => {
      const input = '<a href="http://example.com">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('href="http://example.com"')
      expect(result).toContain('noopener noreferrer')
    })

    it('should allow https:// URLs', () => {
      const input = '<a href="https://example.com">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('https://example.com')
      expect(result).toContain('rel=')
      expect(result).toContain('noopener')
      expect(result).toContain('noreferrer')
    })

    it('should allow mailto: URLs', () => {
      const input = '<a href="mailto:test@example.com">Email</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('mailto:test@example.com')
    })

    it('should allow tel: URLs', () => {
      const input = '<a href="tel:+1234567890">Call</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('tel:+1234567890')
    })

    it('should allow relative URLs', () => {
      const input = '<a href="/about">About</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('href="/about"')
    })

    it('should allow relative URLs with ./', () => {
      const input = '<a href="./page">Page</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('href="./page"')
    })

    it('should allow relative URLs with ../', () => {
      const input = '<a href="../parent">Parent</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('href="../parent"')
    })
  })

  describe('Complex XSS vectors', () => {
    it('should handle multiple encoded characters', () => {
      const input =
        '<a href="j&#97;v&#97;script&#58;alert(&#39;XSS&#39;)">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })

    it('should handle mixed case protocols', () => {
      const input = '<a href="JaVaScRiPt:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('JaVaScRiPt')
      expect(result).toContain('Click')
    })

    it('should handle control characters in URLs', () => {
      const input = '<a href="javascript&#00;:alert(1)">Click</a>'
      const result = sanitizeHtml(input)
      // sanitize-html converts null bytes to replacement chars, breaking the protocol
      // This makes it safe (won't execute), though the text remains
      expect(result).not.toContain('javascript:')
      expect(result).toContain('Click')
    })

    it('should preserve text content when removing dangerous href', () => {
      const input = '<a href="javascript:void(0)">Safe Text</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Safe Text')
      expect(result).not.toContain('javascript:')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty href', () => {
      const input = '<a href="">Click</a>'
      const result = sanitizeHtml(input)
      // Empty href is removed, but text is kept
      expect(result).toContain('Click')
    })

    it('should handle missing href', () => {
      const input = '<a>Click</a>'
      const result = sanitizeHtml(input)
      // Link without href is kept with text
      expect(result).toContain('Click')
    })

    it('should handle empty input', () => {
      const result = sanitizeHtml('')
      expect(result).toBe('')
    })

    it('should handle null summary', () => {
      const result = sanitizeHtml(null as any)
      expect(result).toBe('')
    })

    it('should preserve text content', () => {
      const input = 'Plain text without HTML'
      const result = sanitizeHtml(input)
      expect(result).toBe('Plain text without HTML')
    })
  })
})
