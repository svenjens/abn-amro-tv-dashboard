import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '@/server/utils/sanitize'

describe('sanitizeHtml', () => {
  describe('Basic HTML sanitization', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello <strong>world</strong></p>')
    })

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script><p>World</p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello</p><p>World</p>')
    })

    it('should remove style tags', () => {
      const input = '<p>Hello</p><style>body{display:none}</style><p>World</p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello</p><p>World</p>')
    })

    it('should remove non-allowed tags', () => {
      const input = '<p>Hello</p><div>World</div>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello</p>World')
    })

    it('should strip attributes from non-link tags', () => {
      const input = '<p class="danger" onclick="alert()">Hello</p>'
      const result = sanitizeHtml(input)
      expect(result).toBe('<p>Hello</p>')
    })
  })

  describe('URL sanitization - dangerous protocols', () => {
    it('should block javascript: protocol', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('<a')
    })

    it('should block encoded javascript: protocol (&#97;)', () => {
      const input = '<a href="j&#97;vascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('<a')
    })

    it('should block hex-encoded javascript: protocol', () => {
      const input = '<a href="j&#x61;vascript:alert(\'XSS\')">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('<a')
    })

    it('should block data: URLs', () => {
      const input = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('data:')
      expect(result).not.toContain('<a')
    })

    it('should block vbscript: protocol', () => {
      const input = '<a href="vbscript:msgbox">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('vbscript:')
      expect(result).not.toContain('<a')
    })

    it('should block file: protocol', () => {
      const input = '<a href="file:///etc/passwd">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('file:')
      expect(result).not.toContain('<a')
    })

    it('should block blob: URLs', () => {
      const input = '<a href="blob:https://example.com/123">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('blob:')
      expect(result).not.toContain('<a')
    })

    it('should handle obfuscated javascript with whitespace', () => {
      const input = '<a href=" j a v a s c r i p t : alert()">Click</a>'
      const result = sanitizeHtml(input)
      // After removing whitespace, it should be detected and blocked
      expect(result).not.toContain('<a')
    })
  })

  describe('URL sanitization - safe protocols', () => {
    it('should allow http:// URLs', () => {
      const input = '<a href="http://example.com">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="http://example.com"')
      expect(result).toContain('rel="noopener noreferrer"')
    })

    it('should allow https:// URLs', () => {
      const input = '<a href="https://example.com">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="https://example.com"')
    })

    it('should allow mailto: URLs', () => {
      const input = '<a href="mailto:test@example.com">Email</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="mailto:test@example.com"')
    })

    it('should allow tel: URLs', () => {
      const input = '<a href="tel:+1234567890">Call</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="tel:+1234567890"')
    })

    it('should allow relative URLs', () => {
      const input = '<a href="/page">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="/page"')
    })

    it('should allow relative URLs with ./', () => {
      const input = '<a href="./page">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="./page"')
    })

    it('should allow relative URLs with ../', () => {
      const input = '<a href="../page">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<a href="../page"')
    })
  })

  describe('Complex XSS vectors', () => {
    it('should handle multiple encoded characters', () => {
      const input =
        '<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert()">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('<a')
    })

    it('should handle mixed case protocols', () => {
      const input = '<a href="JaVaScRiPt:alert()">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('JaVaScRiPt')
      expect(result).not.toContain('<a')
    })

    it('should handle control characters in URLs', () => {
      const input = '<a href="java\x00script:alert()">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
    })

    it('should preserve link text when removing dangerous href', () => {
      const input = '<a href="javascript:alert()">Safe Text</a>'
      const result = sanitizeHtml(input)
      expect(result).toContain('Safe Text')
      expect(result).not.toContain('<a')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty href', () => {
      const input = '<a href="">Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<a')
    })

    it('should handle missing href', () => {
      const input = '<a>Click</a>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<a')
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
      const input = 'Plain text without tags'
      const result = sanitizeHtml(input)
      expect(result).toBe('Plain text without tags')
    })
  })
})
