/**
 * Advanced Cache Utility
 *
 * Features:
 * - In-memory caching for fast access
 * - LocalStorage persistence for cross-session caching
 * - Configurable TTL (Time To Live)
 * - Size limits with LRU eviction
 * - Cache statistics
 * - Namespace support
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  maxSize: number
  hitRate: number
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  persistent?: boolean // Store in localStorage
  maxSize?: number // Maximum cache entries
  namespace?: string // Cache namespace
}

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
const DEFAULT_MAX_SIZE = 100
const DEFAULT_NAMESPACE = 'tv-show-cache'

export class Cache<T = unknown> {
  private memory: Map<string, CacheEntry<T>>
  private stats: { hits: number; misses: number }
  private maxSize: number
  private namespace: string
  private persistent: boolean

  constructor(options: CacheOptions = {}) {
    this.memory = new Map()
    this.stats = { hits: 0, misses: 0 }
    this.maxSize = options.maxSize || DEFAULT_MAX_SIZE
    this.namespace = options.namespace || DEFAULT_NAMESPACE
    this.persistent = options.persistent ?? true

    // Load from localStorage if persistent
    if (this.persistent) {
      this.loadFromStorage()
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const fullKey = this.getFullKey(key)

    // Try memory cache first
    let entry: CacheEntry<T> | undefined | null = this.memory.get(fullKey)

    // If not in memory but persistent, try localStorage
    if (!entry && this.persistent) {
      const storageEntry = this.getFromStorage(fullKey)
      if (storageEntry) {
        entry = storageEntry
        this.memory.set(fullKey, storageEntry)
      }
    }

    if (!entry) {
      this.stats.misses++
      return null
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key)
      this.stats.misses++
      return null
    }

    // Update hits
    entry.hits++
    this.stats.hits++

    return entry.data
  }

  /**
   * Set value in cache
   */
  set(key: string, data: T, options?: Pick<CacheOptions, 'ttl' | 'persistent'>): void {
    const fullKey = this.getFullKey(key)
    const ttl = options?.ttl ?? DEFAULT_TTL
    const persistent = options?.persistent ?? this.persistent

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    }

    // Check size limit and evict if necessary (LRU)
    if (this.memory.size >= this.maxSize) {
      this.evictLRU()
    }

    this.memory.set(fullKey, entry)

    // Save to localStorage if persistent
    if (persistent) {
      this.saveToStorage(fullKey, entry)
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    const fullKey = this.getFullKey(key)

    // Delete from memory
    const deleted = this.memory.delete(fullKey)

    // Delete from localStorage
    if (this.persistent) {
      try {
        localStorage.removeItem(fullKey)
      } catch (error) {
        console.warn('[Cache] Failed to delete from localStorage:', error)
      }
    }

    return deleted
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memory.clear()
    this.stats = { hits: 0, misses: 0 }

    if (this.persistent) {
      this.clearStorage()
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.memory.size,
      maxSize: this.maxSize,
      hitRate: parseFloat(hitRate.toFixed(2)),
    }
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    const prefix = `${this.namespace}:`
    return Array.from(this.memory.keys()).map((key) => key.replace(prefix, ''))
  }

  /**
   * Remove expired entries
   */
  prune(): number {
    let pruned = 0

    for (const [key, entry] of this.memory.entries()) {
      if (this.isExpired(entry)) {
        const shortKey = key.replace(`${this.namespace}:`, '')
        this.delete(shortKey)
        pruned++
      }
    }

    return pruned
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSize(): number {
    let size = 0

    for (const entry of this.memory.values()) {
      // Rough estimation of object size
      size += JSON.stringify(entry.data).length
    }

    return size
  }

  /**
   * Export cache data
   */
  export(): Record<string, CacheEntry<T>> {
    const exported: Record<string, CacheEntry<T>> = {}

    for (const [key, entry] of this.memory.entries()) {
      const shortKey = key.replace(`${this.namespace}:`, '')
      exported[shortKey] = entry
    }

    return exported
  }

  /**
   * Import cache data
   */
  import(data: Record<string, CacheEntry<T>>): void {
    for (const [key, entry] of Object.entries(data)) {
      if (!this.isExpired(entry)) {
        const fullKey = this.getFullKey(key)
        this.memory.set(fullKey, entry)

        if (this.persistent) {
          this.saveToStorage(fullKey, entry)
        }
      }
    }
  }

  // Private methods

  private getFullKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private evictLRU(): void {
    let lruKey: string | null = null
    let lruHits = Infinity

    for (const [key, entry] of this.memory.entries()) {
      if (entry.hits < lruHits) {
        lruHits = entry.hits
        lruKey = key
      }
    }

    if (lruKey) {
      const shortKey = lruKey.replace(`${this.namespace}:`, '')
      this.delete(shortKey)
    }
  }

  private loadFromStorage(): void {
    try {
      const keys = Object.keys(localStorage)
      const prefix = `${this.namespace}:`

      for (const key of keys) {
        if (key.startsWith(prefix)) {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const entry = JSON.parse(item) as CacheEntry<T>
              if (!this.isExpired(entry)) {
                this.memory.set(key, entry)
              } else {
                localStorage.removeItem(key)
              }
            } catch {
              // Invalid JSON, remove it
              localStorage.removeItem(key)
            }
          }
        }
      }
    } catch (error) {
      console.warn('[Cache] Failed to load from localStorage:', error)
    }
  }

  private getFromStorage(fullKey: string): CacheEntry<T> | null {
    try {
      const item = localStorage.getItem(fullKey)
      if (item) {
        return JSON.parse(item) as CacheEntry<T>
      }
    } catch (error) {
      console.warn('[Cache] Failed to get from localStorage:', error)
    }
    return null
  }

  private saveToStorage(fullKey: string, entry: CacheEntry<T>): void {
    try {
      localStorage.setItem(fullKey, JSON.stringify(entry))
    } catch (error) {
      // QuotaExceededError - storage is full
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('[Cache] localStorage quota exceeded, clearing old entries')
        this.clearOldestFromStorage()
        // Try again
        try {
          localStorage.setItem(fullKey, JSON.stringify(entry))
        } catch {
          console.error('[Cache] Still unable to save to localStorage')
        }
      } else {
        console.warn('[Cache] Failed to save to localStorage:', error)
      }
    }
  }

  private clearStorage(): void {
    try {
      const keys = Object.keys(localStorage)
      const prefix = `${this.namespace}:`

      for (const key of keys) {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.warn('[Cache] Failed to clear localStorage:', error)
    }
  }

  private clearOldestFromStorage(): void {
    try {
      const keys = Object.keys(localStorage)
      const prefix = `${this.namespace}:`
      const entries: Array<{ key: string; timestamp: number }> = []

      for (const key of keys) {
        if (key.startsWith(prefix)) {
          const item = localStorage.getItem(key)
          if (item) {
            const entry = JSON.parse(item) as CacheEntry<T>
            entries.push({ key, timestamp: entry.timestamp })
          }
        }
      }

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp)

      // Remove oldest 25%
      const toRemove = Math.ceil(entries.length * 0.25)
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        const entry = entries[i]
        if (entry) {
          localStorage.removeItem(entry.key)
        }
      }
    } catch (error) {
      console.warn('[Cache] Failed to clear oldest from localStorage:', error)
    }
  }
}

// Export singleton instances for different cache types
export const apiCache = new Cache({
  namespace: 'tv-show-api',
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  persistent: true,
})

export const searchCache = new Cache({
  namespace: 'tv-show-search',
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 50,
  persistent: true,
})

export const showCache = new Cache({
  namespace: 'tv-show-details',
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 100,
  persistent: true,
})
