import { describe, it, expect } from 'vitest'
import { getServiceGradient } from '@/utils/streaming'

describe('streaming utils', () => {
  describe('getServiceGradient', () => {
    it('should return gradient with theme color for known services', () => {
      const gradient = getServiceGradient('netflix', '#E50914')
      expect(gradient).toContain('#E50914')
      expect(gradient).toContain('linear-gradient')
    })

    it('should return default gradient for unknown services with theme color', () => {
      const gradient = getServiceGradient('unknown-service', '#FF0000')
      expect(gradient).toContain('#FF0000')
      expect(gradient).toContain('linear-gradient')
    })

    it('should return default gray gradient for services without theme color', () => {
      const gradient = getServiceGradient('unknown-service', undefined)
      expect(gradient).toContain('#666')
      expect(gradient).toContain('linear-gradient')
    })

    it('should create proper gradient format', () => {
      const gradient = getServiceGradient('netflix', '#E50914')
      expect(gradient).toMatch(
        /linear-gradient\(135deg,\s*#[A-F0-9]{6}\s*0%,\s*#[A-F0-9]{6}\s*100%\)/
      )
    })
  })
})
