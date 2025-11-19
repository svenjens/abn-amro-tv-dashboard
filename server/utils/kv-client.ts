/**
 * KV Client Wrapper
 * Supports custom BL_ prefix for BingeList KV configuration
 * Falls back to Nitro storage if KV is not configured
 */

import { logger } from '~/utils/logger'

let kvClient: any = null
let kvAvailable = false

// Initialize KV client with BL_ prefix support
async function initKV() {
  if (kvClient !== null) {
    return
  }

  const kvUrl = process.env.BL_KV_REST_API_URL
  const kvToken = process.env.BL_KV_REST_API_TOKEN

  if (kvUrl && kvToken) {
    try {
      // Dynamically import @vercel/kv to avoid requiring it
      // @ts-expect-error - @vercel/kv is optional and loaded dynamically
      const { createClient } = await import('@vercel/kv')
      kvClient = createClient({
        url: kvUrl,
        token: kvToken,
      })
      kvAvailable = true
      logger.info('Vercel KV initialized with BL_ prefix', {
        module: 'kv-client',
        url: kvUrl.substring(0, 30) + '...',
      })
    } catch (error) {
      logger.warn('Failed to initialize Vercel KV, using fallback storage', {
        module: 'kv-client',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  } else {
    logger.debug('Vercel KV not configured, using Nitro storage fallback', {
      module: 'kv-client',
      hasUrl: !!kvUrl,
      hasToken: !!kvToken,
    })
  }
}

/**
 * Get a value from KV or fallback storage
 */
export async function kvGet<T>(key: string): Promise<T | null> {
  // Ensure KV is initialized
  await initKV()

  // Try KV first if available
  if (kvAvailable && kvClient) {
    try {
      // @ts-expect-error - kvClient type is not strictly typed
      const value = await kvClient.get<T>(key)
      if (value !== null) {
        logger.debug('KV cache hit', { module: 'kv-client', key })
        return value
      }
    } catch (error) {
      logger.warn('KV get failed, trying fallback', {
        module: 'kv-client',
        key,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Fallback to Nitro storage
  try {
    const storage = useStorage('cache')
    const value = await storage.getItem<T>(key)
    if (value !== null) {
      logger.debug('Nitro storage cache hit', { module: 'kv-client', key })
    }
    return value
  } catch (error) {
    logger.error('Failed to get from both KV and Nitro storage', {
      module: 'kv-client',
      key,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Set a value in KV or fallback storage
 */
export async function kvSet<T>(
  key: string,
  value: T,
  options?: { ex?: number; px?: number; exat?: number; pxat?: number }
): Promise<void> {
  // Ensure KV is initialized
  await initKV()

  // Try KV first if available
  if (kvAvailable && kvClient) {
    try {
      await kvClient.set(key, value, options)
      logger.debug('Cached in KV', {
        module: 'kv-client',
        key,
        ttl: options?.ex || options?.px || 'no-expiry',
      })
      return
    } catch (error) {
      logger.warn('KV set failed, trying fallback', {
        module: 'kv-client',
        key,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Fallback to Nitro storage
  try {
    const storage = useStorage('cache')
    await storage.setItem(key, value as any, {
      ttl: options?.ex,
    })
    logger.debug('Cached in Nitro storage', { module: 'kv-client', key })
  } catch (error) {
    logger.error('Failed to set in both KV and Nitro storage', {
      module: 'kv-client',
      key,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Delete a value from KV or fallback storage
 */
export async function kvDel(key: string): Promise<void> {
  // Ensure KV is initialized
  await initKV()

  // Try KV first if available
  if (kvAvailable && kvClient) {
    try {
      await kvClient.del(key)
      logger.debug('Deleted from KV', { module: 'kv-client', key })
    } catch (error) {
      logger.warn('KV delete failed', {
        module: 'kv-client',
        key,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Also delete from Nitro storage
  try {
    const storage = useStorage('cache')
    await storage.removeItem(key)
    logger.debug('Deleted from Nitro storage', { module: 'kv-client', key })
  } catch (error) {
    logger.error('Failed to delete from storage', {
      module: 'kv-client',
      key,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Check if KV is available
 */
export function isKVAvailable(): boolean {
  return kvAvailable
}
