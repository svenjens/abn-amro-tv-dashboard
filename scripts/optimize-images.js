/**
 * Image Optimization Script
 *
 * Optimizes PNG images and replaces originals with optimized versions
 * Usage: node scripts/optimize-images.js
 *
 * Features:
 * - Converts PNG to optimized WebP
 * - Compresses images while maintaining quality
 * - Replaces original images with optimized versions
 * - Creates backups in public/originals/
 */

import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

// Image optimization configurations - single config per image
const IMAGE_CONFIGS = {
  'logo-main.png': { width: 512, quality: 90 },
  'logo-full.png': { width: 1536, quality: 90 },
  'hero-background.png': { width: 1920, quality: 80 },
  'og-image.png': { width: 1200, quality: 85 },
  'favicon.png': { width: 512, quality: 90 },
  'icon-192.png': { width: 192, quality: 90 },
  'icon-512.png': { width: 512, quality: 90 },
  'apple-touch-icon.png': { width: 180, quality: 90 },
  'loading-animation.png': { width: 128, quality: 85 },
  'empty-state-illustration.png': { width: 512, quality: 85 },
}

/**
 * Optimize a single image - replaces original with optimized version
 */
async function optimizeImage(inputPath, backupPath, config) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // Backup original
  await fs.copyFile(inputPath, backupPath)

  // Resize if needed
  let pipeline = image
  if (config.width && metadata.width > config.width) {
    pipeline = pipeline.resize(config.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // Generate WebP version (next to the PNG)
  const webpPath = inputPath.replace(/\.png$/, '.webp')
  await pipeline.clone().webp({ quality: config.quality, effort: 6 }).toFile(webpPath)

  const webpStats = await fs.stat(webpPath)

  // Generate optimized PNG to temp file, then move to original location
  const tempPath = inputPath + '.tmp'
  await pipeline
    .clone()
    .png({ quality: config.quality, compressionLevel: 9, effort: 10 })
    .toFile(tempPath)

  // Replace original with optimized version
  await fs.rename(tempPath, inputPath)

  const pngStats = await fs.stat(inputPath)
  const backupStats = await fs.stat(backupPath)

  return {
    webp: { path: webpPath, size: webpStats.size },
    png: { path: inputPath, size: pngStats.size },
    originalSize: backupStats.size,
  }
}

/**
 * Process a single image - optimize and replace original
 */
async function processImage(filename, config, backupDir) {
  const inputPath = path.join(PUBLIC_DIR, filename)

  try {
    await fs.access(inputPath)
  } catch {
    console.log(`   ⚠️  ${filename} not found, skipping...`)
    return { processed: 0, skipped: 1 }
  }

  const backupPath = path.join(backupDir, filename)

  console.log(`\n📸 Processing: ${filename}`)

  try {
    const result = await optimizeImage(inputPath, backupPath, config)

    const originalSizeKB = (result.originalSize / 1024).toFixed(2)
    const webpSizeKB = (result.webp.size / 1024).toFixed(2)
    const pngSizeKB = (result.png.size / 1024).toFixed(2)
    const pngSavings = ((1 - result.png.size / result.originalSize) * 100).toFixed(1)
    const webpSavings = ((1 - result.webp.size / result.originalSize) * 100).toFixed(1)

    console.log(`   📦 Original: ${originalSizeKB}KB`)
    console.log(`   ✅ Optimized PNG: ${pngSizeKB}KB (${pngSavings}% smaller) → replaced original`)
    console.log(`   ✅ WebP: ${webpSizeKB}KB (${webpSavings}% smaller)`)

    return { processed: 1, skipped: 0, savings: { png: pngSavings, webp: webpSavings } }
  } catch (error) {
    console.error(`   ❌ Failed to optimize ${filename}:`, error.message)
    return { processed: 0, skipped: 1 }
  }
}

/**
 * Generate image usage guide
 */
function generateUsageGuide(stats) {
  return `# Optimized Images Usage Guide

Generated: ${new Date().toISOString()}

## Overview

All images have been optimized for web performance:
- **WebP format**: Modern, highly compressed format (supported by all modern browsers)
- **Optimized PNG**: Fallback for older browsers
- **Multiple sizes**: Responsive images for different screen sizes

Total images processed: ${stats.totalProcessed}
Total WebP generated: ${stats.totalProcessed}
Total optimized PNGs: ${stats.totalProcessed}
Average space savings: ${stats.averageSavings.toFixed(1)}%

## Usage in HTML

### Favicon (Multiple sizes)
\`\`\`html
<link rel="icon" type="image/png" sizes="16x16" href="/optimized/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/optimized/favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/optimized/favicon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/optimized/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/optimized/favicon-192.png">
\`\`\`

### Logo with WebP support
\`\`\`html
<picture>
  <source srcset="/optimized/logo-main.webp" type="image/webp">
  <img src="/optimized/logo-main.png" alt="Logo">
</picture>
\`\`\`

### Responsive Hero Background
\`\`\`html
<picture>
  <source 
    media="(min-width: 1280px)" 
    srcset="/optimized/hero-background.webp" 
    type="image/webp"
  >
  <source 
    media="(min-width: 768px)" 
    srcset="/optimized/hero-background-1280.webp" 
    type="image/webp"
  >
  <source 
    srcset="/optimized/hero-background-768.webp" 
    type="image/webp"
  >
  <img src="/optimized/hero-background.png" alt="">
</picture>
\`\`\`

### Empty State Illustration
\`\`\`html
<picture>
  <source srcset="/optimized/empty-state-illustration.webp" type="image/webp">
  <img 
    src="/optimized/empty-state-illustration.png" 
    alt="No results"
    class="mx-auto h-48 w-48"
  >
</picture>
\`\`\`

## Usage in Vue

### Composable for WebP detection
\`\`\`typescript
// src/composables/useOptimizedImage.ts
import { computed } from 'vue'

export function useOptimizedImage(imagePath: string) {
  const webpPath = computed(() => imagePath.replace(/\\.png$/, '.webp'))
  const pngPath = computed(() => imagePath)
  
  return {
    webpPath,
    pngPath
  }
}
\`\`\`

### Component usage
\`\`\`vue
<script setup lang="ts">
import { useOptimizedImage } from '@/composables/useOptimizedImage'

const { webpPath, pngPath } = useOptimizedImage('/optimized/logo-main.png')
</script>

<template>
  <picture>
    <source :srcset="webpPath" type="image/webp">
    <img :src="pngPath" alt="Logo">
  </picture>
</template>
\`\`\`

## Performance Benefits

- **WebP compression**: 25-35% smaller than PNG on average
- **Responsive images**: Serve appropriate size per device
- **Faster load times**: Reduced bandwidth and faster rendering
- **Better UX**: Quicker page loads, especially on mobile

## Browser Support

- **WebP**: Chrome, Firefox, Safari 14+, Edge (95%+ global support)
- **PNG fallback**: All browsers

## File Locations

All optimized images are in: \`public/optimized/\`

Original images remain in: \`public/\`
`
}

/**
 * Main optimization process
 */
async function optimizeAllImages() {
  console.log('🎨 Image Optimization Tool (In-Place Replacement)')
  console.log('═'.repeat(60))
  console.log('\n📁 Processing images from:', PUBLIC_DIR)
  console.log('💾 Backups will be saved to: public/originals/\n')

  // Create backup directory
  const backupDir = path.join(PUBLIC_DIR, 'originals')
  await fs.mkdir(backupDir, { recursive: true })

  let totalProcessed = 0
  let totalSkipped = 0
  const startTime = Date.now()

  // Process all images
  for (const [filename, config] of Object.entries(IMAGE_CONFIGS)) {
    const result = await processImage(filename, config, backupDir)
    totalProcessed += result.processed
    totalSkipped += result.skipped
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('✨ Image Optimization Complete!')
  console.log('═'.repeat(60))
  console.log(`\n📊 Results:`)
  console.log(`   • Images processed: ${totalProcessed}`)
  console.log(`   • Images skipped: ${totalSkipped}`)
  console.log(`   • Total files: ${totalProcessed * 2} (PNG + WebP)`)
  console.log(`   • Duration: ${duration}s`)
  console.log(`\n💾 Storage:`)
  console.log(`   • Originals backed up to: public/originals/`)
  console.log(`   • Optimized PNGs replaced originals`)
  console.log(`   • WebP versions created alongside PNGs`)
  console.log(`\n🚀 Images are now optimized and ready to use with NuxtImg!\n`)
}

// Run the script
optimizeAllImages().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
