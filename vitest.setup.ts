import { vi } from 'vitest'

// Mock localStorage for SSR tests
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Mock window.matchMedia for dark mode tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
  root = null
  rootMargin = ''
  thresholds = []
}

// Mock color mode to prevent plugin errors
vi.mock('#app', async () => {
  const actual = await vi.importActual('#app')
  return {
    ...actual,
    useColorMode: () => ({
      preference: 'system',
      value: 'light',
      unknown: false,
      forced: false,
    }),
    defineNuxtRouteMiddleware: (fn: any) => fn,
  }
})

// Mock import.meta for tests
Object.defineProperty(import.meta, 'server', {
  value: false,
  writable: true,
  configurable: true,
})
