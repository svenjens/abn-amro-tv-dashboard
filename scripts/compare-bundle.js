#!/usr/bin/env node

/**
 * Bundle Size Comparison
 * 
 * Compares two bundle reports and generates a diff with:
 * - Size changes (increases/decreases)
 * - New/removed files
 * - Percentage changes
 * - Visual indicators (emojis for increases/decreases)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
  return size + ' ' + sizes[i]
}

/**
 * Calculate percentage change
 */
function calculateChange(oldValue, newValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Format change with emoji indicator
 */
function formatChange(oldValue, newValue, formatAsByte = true) {
  const diff = newValue - oldValue
  const change = calculateChange(oldValue, newValue)
  
  let emoji = '🟰'
  if (diff > 0) emoji = '📈'
  if (diff < 0) emoji = '📉'
  if (Math.abs(change) < 0.1) emoji = '✅'
  
  const diffFormatted = formatAsByte ? formatBytes(Math.abs(diff)) : Math.abs(diff)
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : '±'
  const changeFormatted = change.toFixed(2)
  
  return `${emoji} ${sign}${diffFormatted} (${changeFormatted}%)`
}

/**
 * Load bundle report
 */
function loadReport(filePath) {
  if (!existsSync(filePath)) {
    return null
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message)
    return null
  }
}

/**
 * Compare two bundle reports
 */
function compareReports(baseReport, headReport) {
  if (!baseReport || !headReport) {
    return null
  }
  
  const comparison = {
    totals: {},
    chunks: {
      changed: [],
      added: [],
      removed: [],
    },
  }
  
  // Compare totals
  const categories = ['all', 'javascript', 'css']
  for (const category of categories) {
    const base = baseReport.totals[category]
    const head = headReport.totals[category]
    
    comparison.totals[category] = {
      size: {
        base: base.size,
        head: head.size,
        diff: head.size - base.size,
        change: formatChange(base.size, head.size),
      },
      gzipSize: {
        base: base.gzipSize,
        head: head.gzipSize,
        diff: head.gzipSize - base.gzipSize,
        change: formatChange(base.gzipSize, head.gzipSize),
      },
      count: {
        base: base.count,
        head: head.count,
        diff: head.count - base.count,
        change: formatChange(base.count, head.count, false),
      },
    }
  }
  
  // Compare JavaScript files
  const baseJsFiles = new Map(baseReport.files.javascript.map(f => [f.name, f]))
  const headJsFiles = new Map(headReport.files.javascript.map(f => [f.name, f]))
  
  // Find changed files
  for (const [name, headFile] of headJsFiles) {
    const baseFile = baseJsFiles.get(name)
    
    if (!baseFile) {
      // New file
      comparison.chunks.added.push({
        name,
        size: headFile.sizeFormatted,
        gzip: headFile.gzipSizeFormatted,
      })
    } else {
      // Changed file
      const sizeDiff = headFile.gzipSize - baseFile.gzipSize
      const sizeChange = calculateChange(baseFile.gzipSize, headFile.gzipSize)
      
      if (Math.abs(sizeChange) > 0.1) {
        comparison.chunks.changed.push({
          name,
          baseSize: baseFile.gzipSizeFormatted,
          headSize: headFile.gzipSizeFormatted,
          diff: formatBytes(Math.abs(sizeDiff)),
          change: formatChange(baseFile.gzipSize, headFile.gzipSize),
          increased: sizeDiff > 0,
        })
      }
    }
  }
  
  // Find removed files
  for (const [name, baseFile] of baseJsFiles) {
    if (!headJsFiles.has(name)) {
      comparison.chunks.removed.push({
        name,
        size: baseFile.sizeFormatted,
        gzip: baseFile.gzipSizeFormatted,
      })
    }
  }
  
  // Sort changed chunks by impact (largest changes first)
  comparison.chunks.changed.sort((a, b) => {
    const aDiff = Math.abs(parseFloat(a.diff))
    const bDiff = Math.abs(parseFloat(b.diff))
    return bDiff - aDiff
  })
  
  return comparison
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(comparison) {
  if (!comparison) {
    return '⚠️ Unable to compare bundle sizes (missing base or head report)'
  }
  
  const lines = []
  
  lines.push('## 📦 Bundle Size Report\n')
  
  // Overall totals
  const all = comparison.totals.all
  lines.push('### Total Bundle Size\n')
  lines.push('| Metric | Base | Head | Change |')
  lines.push('|--------|------|------|--------|')
  lines.push(`| Size | ${formatBytes(all.size.base)} | ${formatBytes(all.size.head)} | ${all.size.change} |`)
  lines.push(`| Gzip | ${formatBytes(all.gzipSize.base)} | ${formatBytes(all.gzipSize.head)} | ${all.gzipSize.change} |`)
  lines.push(`| Files | ${all.count.base} | ${all.count.head} | ${all.count.change} |\n`)
  
  // JavaScript totals
  const js = comparison.totals.javascript
  lines.push('### JavaScript\n')
  lines.push('| Metric | Base | Head | Change |')
  lines.push('|--------|------|------|--------|')
  lines.push(`| Size | ${formatBytes(js.size.base)} | ${formatBytes(js.size.head)} | ${js.size.change} |`)
  lines.push(`| Gzip | ${formatBytes(js.gzipSize.base)} | ${formatBytes(js.gzipSize.head)} | ${js.gzipSize.change} |`)
  lines.push(`| Files | ${js.count.base} | ${js.count.head} | ${js.count.change} |\n`)
  
  // CSS totals
  const css = comparison.totals.css
  lines.push('### CSS\n')
  lines.push('| Metric | Base | Head | Change |')
  lines.push('|--------|------|------|--------|')
  lines.push(`| Size | ${formatBytes(css.size.base)} | ${formatBytes(css.size.head)} | ${css.size.change} |`)
  lines.push(`| Gzip | ${formatBytes(css.gzipSize.base)} | ${formatBytes(css.gzipSize.head)} | ${css.gzipSize.change} |`)
  lines.push(`| Files | ${css.count.base} | ${css.count.head} | ${css.count.change} |\n`)
  
  // Changed chunks
  if (comparison.chunks.changed.length > 0) {
    lines.push('### 📝 Changed Chunks\n')
    lines.push('| File | Base (gzip) | Head (gzip) | Change |')
    lines.push('|------|-------------|-------------|--------|')
    for (const chunk of comparison.chunks.changed.slice(0, 10)) {
      lines.push(`| \`${chunk.name}\` | ${chunk.baseSize} | ${chunk.headSize} | ${chunk.change} |`)
    }
    if (comparison.chunks.changed.length > 10) {
      lines.push(`\n_...and ${comparison.chunks.changed.length - 10} more changed files_`)
    }
    lines.push('')
  }
  
  // Added chunks
  if (comparison.chunks.added.length > 0) {
    lines.push('### ✨ New Chunks\n')
    for (const chunk of comparison.chunks.added) {
      lines.push(`- \`${chunk.name}\` - ${chunk.gzip} (gzip)`)
    }
    lines.push('')
  }
  
  // Removed chunks
  if (comparison.chunks.removed.length > 0) {
    lines.push('### 🗑️ Removed Chunks\n')
    for (const chunk of comparison.chunks.removed) {
      lines.push(`- \`${chunk.name}\` - ${chunk.gzip} (gzip)`)
    }
    lines.push('')
  }
  
  // Summary
  const totalGzipDiff = all.gzipSize.diff
  let summary = ''
  if (totalGzipDiff > 1024) {
    summary = '⚠️ **Warning:** Bundle size increased significantly'
  } else if (totalGzipDiff < -1024) {
    summary = '🎉 **Great:** Bundle size decreased!'
  } else {
    summary = '✅ Bundle size change is minimal'
  }
  lines.push(`\n${summary}`)
  
  return lines.join('\n')
}

// Main execution
const baseReportPath = process.argv[2] || join(process.cwd(), 'base-bundle-report.json')
const headReportPath = process.argv[3] || join(process.cwd(), 'bundle-report.json')

console.log('📊 Comparing bundle reports...\n')
console.log(`Base: ${baseReportPath}`)
console.log(`Head: ${headReportPath}\n`)

const baseReport = loadReport(baseReportPath)
const headReport = loadReport(headReportPath)

if (!headReport) {
  console.error('❌ Head report not found. Run npm run build first.')
  process.exit(1)
}

const comparison = compareReports(baseReport, headReport)
const markdown = generateMarkdownReport(comparison)

console.log(markdown)

// Save to file
import { writeFileSync } from 'fs'
const outputPath = join(process.cwd(), 'bundle-comparison.md')
writeFileSync(outputPath, markdown)
console.log(`\n✅ Comparison saved to: bundle-comparison.md\n`)

