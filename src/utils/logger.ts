/**
 * Logger utility for development and production
 * In production, only errors and warnings are logged
 * In development, all logs are shown
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  /**
   * Debug logs - only shown in development
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Info logs - only shown in development
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  /**
   * Warning logs - shown in both development and production
   */
  warn: (...args: unknown[]) => {
    console.warn(...args)
  },

  /**
   * Error logs - shown in both development and production
   */
  error: (...args: unknown[]) => {
    console.error(...args)
  },
}
