/**
 * Structured logging utility for development and production
 * In production, only errors and warnings are logged
 * In development, all logs are shown
 *
 * Features:
 * - Structured logging with metadata
 * - Consistent timestamp formatting
 * - Context information (component, module, action)
 * - Error object serialization
 * - Environment-aware log levels
 */

const isDevelopment = import.meta.dev
const isServer = import.meta.server

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  module?: string
  component?: string
  action?: string
  userId?: string
  [key: string]: unknown
}

interface LogEntry {
  level: string
  timestamp: string
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

/**
 * Format timestamp consistently
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Serialize error objects, including non-Error throwables
 */
function serializeError(error: unknown): LogEntry['error'] | undefined {
  if (!error) return undefined

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    }
  }

  // Handle non-Error throwables (strings, objects, etc.)
  return {
    name: 'NonError',
    message: String(error),
  }
}

/**
 * Format log entry for output with safe JSON serialization
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [`[${entry.level}]`, entry.timestamp, entry.message]

  if (entry.context && Object.keys(entry.context).length > 0) {
    try {
      parts.push(JSON.stringify(entry.context))
    } catch {
      parts.push('[unserializable-context]')
    }
  }

  if (entry.error) {
    try {
      parts.push(JSON.stringify(entry.error))
    } catch {
      parts.push('[unserializable-error]')
    }
  }

  return parts.join(' ')
}

/**
 * Check if log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  if (isDevelopment) {
    return true // Log everything in development
  }
  // In production, only log warnings and errors
  return level >= LogLevel.WARN
}

export const logger = {
  /**
   * Debug logs - only shown in development
   * Use for detailed debugging information
   *
   * @example
   * logger.debug('User action', { action: 'click', button: 'submit' })
   */
  debug: (message: string, context?: LogContext) => {
    if (!shouldLog(LogLevel.DEBUG)) return

    const entry: LogEntry = {
      level: 'DEBUG',
      timestamp: getTimestamp(),
      message,
      context,
    }

    if (isServer) {
      console.log(formatLogEntry(entry))
    } else {
      console.log(`[DEBUG] ${message}`, context || '')
    }
  },

  /**
   * Info logs - only shown in development
   * Use for general informational messages
   *
   * @example
   * logger.info('API request successful', { endpoint: '/api/shows', duration: 250 })
   */
  info: (message: string, context?: LogContext) => {
    if (!shouldLog(LogLevel.INFO)) return

    const entry: LogEntry = {
      level: 'INFO',
      timestamp: getTimestamp(),
      message,
      context,
    }

    if (isServer) {
      console.info(formatLogEntry(entry))
    } else {
      console.info(`[INFO] ${message}`, context || '')
    }
  },

  /**
   * Warning logs - shown in both development and production
   * Use for potentially problematic situations
   *
   * @example
   * logger.warn('Rate limit approaching', { remaining: 5, limit: 100 })
   */
  warn: (message: string, context?: LogContext | unknown) => {
    if (!shouldLog(LogLevel.WARN)) return

    // Ensure context is LogContext or undefined
    const logContext =
      context && typeof context === 'object' && !Array.isArray(context)
        ? (context as LogContext)
        : undefined

    const entry: LogEntry = {
      level: 'WARN',
      timestamp: getTimestamp(),
      message,
      context: logContext,
    }

    if (isServer) {
      console.warn(formatLogEntry(entry))
    } else {
      console.warn(`[WARN] ${message}`, logContext || '')
    }
  },

  /**
   * Error logs - shown in both development and production
   * Use for error conditions that need attention
   *
   * @example
   * logger.error('API request failed', { endpoint: '/api/shows' }, error)
   * logger.error('API request failed', error) // Also supported
   */
  error: (message: string, context?: LogContext | unknown, error?: unknown) => {
    if (!shouldLog(LogLevel.ERROR)) return

    // Handle flexible signatures:
    // - (message, error) → treat second param as error
    // - (message, context, error) → normal flow
    let logContext: LogContext | undefined
    let actualError: unknown

    if (context instanceof Error && error === undefined) {
      // Called as logger.error('message', error)
      logContext = undefined
      actualError = context
    } else {
      // Called as logger.error('message', context, error) or logger.error('message', context)
      logContext =
        context &&
        typeof context === 'object' &&
        !Array.isArray(context) &&
        !(context instanceof Error)
          ? (context as LogContext)
          : undefined
      actualError = error
    }

    const entry: LogEntry = {
      level: 'ERROR',
      timestamp: getTimestamp(),
      message,
      context: logContext,
      error: serializeError(actualError),
    }

    if (isServer) {
      console.error(formatLogEntry(entry))
    } else {
      console.error(`[ERROR] ${message}`, logContext || '', actualError || '')
    }
  },
}
