#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 *
 * Analyzes the Vite build output and generates a JSON report with:
 * - Total bundle size
 * - Individual chunk sizes
 * - Asset sizes (CSS, images, fonts)
 * - Gzip sizes
 * - Chunk count and file count
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, extname } from 'path'
import { gzipSync } from 'zlib'

const DIST_DIR = join(process.cwd(), 'dist')
const ASSETS_DIR = join(DIST_DIR, 'assets')

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file size and gzipped size
 */
function getFileSizes(filePath) {
  const content = readFileSync(filePath)
  const size = statSync(filePath).size
  const gzipSize = gzipSync(content).length

  return {
    size,
    gzipSize,
    sizeFormatted: formatBytes(size),
    gzipSizeFormatted: formatBytes(gzipSize),
  }
}

/**
 * Analyze all files in a directory
 */
function analyzeDirectory(dirPath, filePattern = null) {
  const files = readdirSync(dirPath)
  const results = []

  for (const file of files) {
    const filePath = join(dirPath, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      continue // Skip directories
    }

    if (filePattern && !filePattern.test(file)) {
      continue // Skip files that don't match pattern
    }

    const ext = extname(file)
    const sizes = getFileSizes(filePath)

    results.push({
      name: file,
      type: ext.slice(1), // Remove leading dot
      ...sizes,
    })
  }

  return results
}

/**
 * Calculate total sizes
 */
function calculateTotals(files) {
  return files.reduce(
    (acc, file) => ({
      size: acc.size + file.size,
      gzipSize: acc.gzipSize + file.gzipSize,
    }),
    { size: 0, gzipSize: 0 }
  )
}

/**
 * Main analysis function
 */
function analyzeBuild() {
  console.log('📦 Analyzing bundle...\n')

  // Analyze JavaScript chunks
  const jsFiles = analyzeDirectory(ASSETS_DIR, /\.js$/)
  const jsTotals = calculateTotals(jsFiles)

  // Analyze CSS files
  const cssFiles = analyzeDirectory(ASSETS_DIR, /\.css$/)
  const cssTotals = calculateTotals(cssFiles)

  // Analyze all assets
  const allAssets = analyzeDirectory(ASSETS_DIR)
  const allTotals = calculateTotals(allAssets)

  // Find main chunks (largest files)
  const mainChunks = jsFiles.sort((a, b) => b.gzipSize - a.gzipSize).slice(0, 5)

  // Find vendor chunks
  const vendorChunks = jsFiles.filter((f) => f.name.includes('vendor'))

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totals: {
      all: {
        ...allTotals,
        sizeFormatted: formatBytes(allTotals.size),
        gzipSizeFormatted: formatBytes(allTotals.gzipSize),
        count: allAssets.length,
      },
      javascript: {
        ...jsTotals,
        sizeFormatted: formatBytes(jsTotals.size),
        gzipSizeFormatted: formatBytes(jsTotals.gzipSize),
        count: jsFiles.length,
      },
      css: {
        ...cssTotals,
        sizeFormatted: formatBytes(cssTotals.size),
        gzipSizeFormatted: formatBytes(cssTotals.gzipSize),
        count: cssFiles.length,
      },
    },
    mainChunks: mainChunks.map((chunk) => ({
      name: chunk.name,
      size: chunk.sizeFormatted,
      gzip: chunk.gzipSizeFormatted,
    })),
    vendorChunks: vendorChunks.map((chunk) => ({
      name: chunk.name,
      size: chunk.sizeFormatted,
      gzip: chunk.gzipSizeFormatted,
    })),
    files: {
      javascript: jsFiles,
      css: cssFiles,
    },
  }

  // Print summary to console
  console.log('📊 Bundle Analysis Summary')
  console.log('='.repeat(50))
  console.log(`\n📦 Total Assets: ${report.totals.all.count} files`)
  console.log(`   Size: ${report.totals.all.sizeFormatted}`)
  console.log(`   Gzip: ${report.totals.all.gzipSizeFormatted}`)
  console.log(`\n📜 JavaScript: ${report.totals.javascript.count} files`)
  console.log(`   Size: ${report.totals.javascript.sizeFormatted}`)
  console.log(`   Gzip: ${report.totals.javascript.gzipSizeFormatted}`)
  console.log(`\n🎨 CSS: ${report.totals.css.count} files`)
  console.log(`   Size: ${report.totals.css.sizeFormatted}`)
  console.log(`   Gzip: ${report.totals.css.gzipSizeFormatted}`)

  console.log(`\n🏆 Top 5 Chunks (by gzip size):`)
  mainChunks.forEach((chunk, i) => {
    console.log(`   ${i + 1}. ${chunk.name}`)
    console.log(`      ${chunk.sizeFormatted} → ${chunk.gzipSizeFormatted} (gzip)`)
  })

  // Save report to file
  const reportPath = join(process.cwd(), 'bundle-report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n✅ Report saved to: bundle-report.json\n`)

  return report
}

// Run analysis
try {
  analyzeBuild()
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message)
  process.exit(1)
}
