#!/usr/bin/env node

/**
 * Generate sitemap.xml for BingeList
 * 
 * Generates a sitemap with:
 * - Static pages (home, search, watchlist)
 * - Dynamic genre pages
 * - Note: Individual show pages are not included due to their large number (1000+)
 *   and dynamic nature. Google can discover them through internal links.
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://bingelist.app'
const OUTPUT_PATH = resolve(process.cwd(), 'public/sitemap.xml')

// Supported locales
const LOCALES = ['en', 'nl']

// Static routes
const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/search', changefreq: 'daily', priority: '0.9' },
  { path: '/watchlist', changefreq: 'weekly', priority: '0.8' },
  { path: '/roadmap', changefreq: 'monthly', priority: '0.7' },
]

// Genre routes (from TVMaze API common genres)
const GENRES = [
  'drama',
  'comedy',
  'action',
  'thriller',
  'horror',
  'crime',
  'romance',
  'science-fiction',
  'fantasy',
  'mystery',
  'adventure',
  'supernatural',
  'family',
  'anime',
  'music',
  'western',
  'war',
  'history',
  'sports',
  'legal',
  'medical',
  'nature',
  'travel',
  'food',
]

/**
 * Generate sitemap XML
 */
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0]
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n'

  // Add static routes for each locale
  LOCALES.forEach((locale) => {
    STATIC_ROUTES.forEach((route) => {
      const path = `/${locale}${route.path === '/' ? '' : route.path}`
      
      xml += '  <url>\n'
      xml += `    <loc>${SITE_URL}${path}</loc>\n`
      xml += `    <lastmod>${currentDate}</lastmod>\n`
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`
      xml += `    <priority>${route.priority}</priority>\n`
      
      // Add alternate language links
      LOCALES.forEach((altLocale) => {
        const altPath = `/${altLocale}${route.path === '/' ? '' : route.path}`
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${SITE_URL}${altPath}"/>\n`
      })
      
      xml += '  </url>\n\n'
    })
  })

  // Add genre routes for each locale
  LOCALES.forEach((locale) => {
    GENRES.forEach((genre) => {
      const path = `/${locale}/genre/${genre}`
      
      xml += '  <url>\n'
      xml += `    <loc>${SITE_URL}${path}</loc>\n`
      xml += `    <lastmod>${currentDate}</lastmod>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.7</priority>\n`
      
      // Add alternate language links
      LOCALES.forEach((altLocale) => {
        const altPath = `/${altLocale}/genre/${genre}`
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${SITE_URL}${altPath}"/>\n`
      })
      
      xml += '  </url>\n\n'
    })
  })

  xml += '</urlset>'

  return xml
}

/**
 * Main execution
 */
function main() {
  console.log('🗺️  Generating sitemap.xml...')
  console.log(`📍 Site URL: ${SITE_URL}`)
  console.log(`📁 Output: ${OUTPUT_PATH}`)
  
  const sitemap = generateSitemap()
  
  writeFileSync(OUTPUT_PATH, sitemap, 'utf-8')
  
  const urlCount = (sitemap.match(/<url>/g) || []).length
  console.log(`✅ Generated sitemap with ${urlCount} URLs`)
  console.log(`   - ${LOCALES.length} locales`)
  console.log(`   - ${STATIC_ROUTES.length} static routes per locale`)
  console.log(`   - ${GENRES.length} genre routes per locale`)
  console.log(`   Total: ${LOCALES.length * (STATIC_ROUTES.length + GENRES.length)} URLs`)
}

main()

