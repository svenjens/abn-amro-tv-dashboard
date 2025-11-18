/**
 * Streaming service utility functions
 */

/**
 * Adjust color brightness by a percentage
 * @param hex - Hex color code (with or without #)
 * @param percent - Percentage to adjust (-100 to 100)
 * @returns Adjusted hex color code
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

/**
 * Predefined gradient map for streaming services
 * These are hand-crafted for optimal visual appearance
 */
const SERVICE_GRADIENTS: Record<string, string> = {
  netflix: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
  prime: 'linear-gradient(135deg, #00A8E1 0%, #0779ff 100%)',
  disney: 'linear-gradient(135deg, #113CCF 0%, #0A2A8F 100%)',
  hbo: 'linear-gradient(135deg, #002BE7 0%, #001BA0 100%)',
  hulu: 'linear-gradient(135deg, #1CE783 0%, #16B864 100%)',
  apple: 'linear-gradient(135deg, #1d1d1f 0%, #000000 100%)',
  paramount: 'linear-gradient(135deg, #0064FF 0%, #0050CC 100%)',
  peacock: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
  skyshowtime: 'linear-gradient(135deg, #5433FF 0%, #3D20CC 100%)',
  videoland: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
}

/**
 * Get gradient background CSS for a streaming service
 * Uses predefined gradients for known services, generates dynamic gradient for others
 * @param serviceId - Internal service ID (e.g., 'netflix', 'prime')
 * @param themeColor - Optional theme color for dynamic gradient generation
 * @returns CSS gradient string
 */
export function getServiceGradient(serviceId: string, themeColor?: string): string {
  // Use predefined gradient if available
  if (SERVICE_GRADIENTS[serviceId]) {
    return SERVICE_GRADIENTS[serviceId]
  }

  // Generate dynamic gradient if theme color is provided
  if (themeColor) {
    const darkerShade = adjustColorBrightness(themeColor, -20)
    return `linear-gradient(135deg, ${themeColor} 0%, ${darkerShade} 100%)`
  }

  // Fallback to simple semi-transparent gradient
  return 'linear-gradient(135deg, #666 0%, #444 100%)'
}
