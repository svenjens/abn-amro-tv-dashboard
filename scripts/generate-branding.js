/**
 * Brand Asset Generator using OpenAI gpt-image-1
 *
 * Generates logo and brand assets for the TV Show Dashboard
 * Usage: OPENAI_API_KEY=your-key node scripts/generate-branding.js
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import OpenAI from 'openai'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ASSETS_DIR = path.join(__dirname, '..', 'public')

// Brand colors from Tailwind config
const BRAND_STYLE = {
  primary: '#2563eb', // primary-600 (blue)
  primaryLight: '#3b82f6', // primary-500
  primaryDark: '#1d4ed8', // primary-700
  accent: '#f59e0b', // amber-500 (for ratings/highlights)
  style: 'modern, entertainment-focused, clean, cinematic',
}

const ASSET_PROMPTS = [
  {
    name: 'logo-main',
    prompt: `Create a modern, elegant logo icon for a TV show discovery platform. 
    The design should feature a stylized TV screen or play button combined with film reel elements. 
    Use a vibrant blue gradient (${BRAND_STYLE.primary} to ${BRAND_STYLE.primaryLight}). 
    Cinema and entertainment aesthetic with clean lines. 
    Icon only, no text. Centered composition. Professional but fun.`,
    size: '1024x1024',
    quality: 'high',
  },
  {
    name: 'logo-full',
    prompt: `Create a full horizontal logo with icon and "TV Show Dashboard" text. 
    Include a modern TV/play icon on the left with clean sans-serif text on the right. 
    Use gradient blue colors (${BRAND_STYLE.primary} to ${BRAND_STYLE.primaryLight}). 
    Entertainment and media aesthetic. Wide format suitable for app headers. 
    Professional yet approachable design for a TV show discovery app.`,
    size: '1536x1024',
    quality: 'high',
  },
  {
    name: 'hero-background',
    prompt: `Create an abstract, cinematic background illustration for a TV show platform. 
    Show flowing geometric shapes suggesting TV screens, film strips, and entertainment elements. 
    Use deep blue gradients (${BRAND_STYLE.primary}) with subtle purple and amber accents. 
    Modern, clean aesthetic with depth and subtle motion blur. 
    Wide horizontal format suitable for hero section background. Atmospheric and professional.`,
    size: '1536x1024',
    quality: 'high',
  },
  {
    name: 'og-image',
    prompt: `Create a social media share image for a TV show discovery platform. 
    Show multiple stylized TV screens arranged in a modern grid with gradient overlays. 
    Include abstract representations of different genres (action, drama, comedy) through colors and shapes. 
    Use blue gradient (${BRAND_STYLE.primary}) as the dominant color with entertainment vibe. 
    Text space in center. Professional social media design. 1200x630 composition.`,
    size: '1024x1024',
    quality: 'high',
  },
  {
    name: 'favicon',
    prompt: `Create a simple, bold favicon icon for a TV show platform. 
    A clean TV screen or play button icon with minimal details. 
    Use solid ${BRAND_STYLE.primary} blue color. 
    Must be recognizable at tiny sizes (16x16px to 512x512px). 
    Bold shapes, high contrast, simple and iconic. Centered composition.`,
    size: '1024x1024',
    quality: 'medium',
  },
  {
    name: 'icon-192',
    prompt: `Create a PWA app icon for a TV show discovery platform (192x192). 
    Modern TV/play icon with subtle entertainment elements. 
    Use ${BRAND_STYLE.primary} blue with a slight gradient. 
    Clean, recognizable design suitable for mobile home screens. 
    Rounded square format with padding. Professional and polished.`,
    size: '1024x1024',
    quality: 'medium',
  },
  {
    name: 'icon-512',
    prompt: `Create a high-resolution PWA app icon for a TV show platform (512x512). 
    Detailed TV screen or film reel icon with entertainment aesthetic. 
    Blue gradient (${BRAND_STYLE.primary} to ${BRAND_STYLE.primaryLight}) with depth. 
    Polished, professional design with subtle shadows and highlights. 
    Rounded square format. Suitable for app stores and high-res displays.`,
    size: '1024x1024',
    quality: 'high',
  },
  {
    name: 'apple-touch-icon',
    prompt: `Create an Apple touch icon for a TV show discovery app. 
    Clean TV/entertainment icon with rounded square format. 
    Use ${BRAND_STYLE.primary} blue gradient with iOS-style depth and lighting. 
    Professional, polished design suitable for iOS home screen. 
    High quality with subtle gradients and depth. 180x180 format.`,
    size: '1024x1024',
    quality: 'high',
  },
  {
    name: 'loading-animation',
    prompt: `Create a simple loading spinner icon for a TV show app. 
    Circular design with TV or film reel elements that suggest motion. 
    Use ${BRAND_STYLE.primary} blue color. 
    Clean, minimal design suitable for loading states. 
    Centered, simple shapes that work well when animated.`,
    size: '1024x1024',
    quality: 'medium',
  },
  {
    name: 'empty-state-illustration',
    prompt: `Create a friendly empty state illustration for when no TV shows are found. 
    Show a simple TV screen or popcorn bowl with a subtle "nothing here yet" aesthetic. 
    Use soft ${BRAND_STYLE.primary} blue with light gray accents. 
    Friendly, approachable, minimal illustration style. 
    Centered composition suitable for empty search results or loading states.`,
    size: '1024x1024',
    quality: 'medium',
  },
]

/**
 * Generate a single image using gpt-image-1
 */
async function generateImage(config) {
  console.log(`\n🎨 Generating: ${config.name}...`)
  console.log(`   Size: ${config.size} | Quality: ${config.quality}`)
  console.log(`   Prompt: ${config.prompt.substring(0, 100)}...`)

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: config.prompt,
      size: config.size,
      quality: config.quality,
      background: 'transparent',
      n: 1,
    })

    const imageData = response.data[0]

    if (!imageData) {
      throw new Error('No image data returned from API')
    }

    let buffer

    // gpt-image-1 returns base64, DALL-E returns URL
    if (imageData.b64_json) {
      // Base64 response
      buffer = Buffer.from(imageData.b64_json, 'base64')
      console.log(`   📦 Received base64 data`)
    } else if (imageData.url) {
      // URL response
      console.log(`   🌐 Downloading from URL...`)
      const imageResponse = await fetch(imageData.url)

      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`)
      }

      const arrayBuffer = await imageResponse.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      throw new Error('No image URL or base64 data returned from API')
    }

    const filename = `${config.name}.png`
    const filepath = path.join(ASSETS_DIR, filename)

    await fs.writeFile(filepath, buffer)

    console.log(`   ✅ Saved: ${filename} (${(buffer.length / 1024).toFixed(2)} KB)`)

    if (imageData.revised_prompt) {
      console.log(`   📝 Revised: ${imageData.revised_prompt.substring(0, 80)}...`)
    }

    return {
      name: config.name,
      filename,
      path: filepath,
      size: buffer.length,
    }
  } catch (error) {
    console.error(`   ❌ Error generating ${config.name}:`, error.message)
    if (error.response) {
      console.error(`   Response: ${JSON.stringify(error.response.data)}`)
    }
    throw error
  }
}

/**
 * Generate all brand assets
 */
async function generateAllAssets() {
  console.log('🚀 TV Show Dashboard - Brand Asset Generation')
  console.log('='.repeat(60))
  console.log(`\n📁 Output directory: ${ASSETS_DIR}`)
  console.log(`🎨 Brand color: ${BRAND_STYLE.primary}`)
  console.log(`📊 Total assets to generate: ${ASSET_PROMPTS.length}\n`)

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set')
    console.error('   Please set it with: export OPENAI_API_KEY=your-api-key')
    console.error('   Or run: OPENAI_API_KEY=your-key node scripts/generate-branding.js')
    process.exit(1)
  }

  // Create public directory if it doesn't exist
  await fs.mkdir(ASSETS_DIR, { recursive: true })

  // Generate each asset
  const results = []
  const failed = []

  for (let i = 0; i < ASSET_PROMPTS.length; i++) {
    const config = ASSET_PROMPTS[i]
    console.log(`\n[${i + 1}/${ASSET_PROMPTS.length}]`)

    try {
      const result = await generateImage(config)
      results.push(result)

      // Rate limiting - wait 2 seconds between requests
      if (i < ASSET_PROMPTS.length - 1) {
        console.log('   ⏳ Waiting 2s before next request...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    } catch {
      console.error(`   ⚠️  Failed to generate ${config.name}, continuing...`)
      failed.push(config.name)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✨ Brand Asset Generation Complete!')
  console.log('='.repeat(60))

  if (results.length > 0) {
    console.log(`\n📊 Successfully generated ${results.length}/${ASSET_PROMPTS.length} assets:\n`)

    results.forEach((result) => {
      console.log(`   ✅ ${result.filename.padEnd(30)} ${(result.size / 1024).toFixed(2)} KB`)
    })

    const totalSize = results.reduce((sum, r) => sum + r.size, 0)
    console.log(`\n💾 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
  }

  if (failed.length > 0) {
    console.log(`\n⚠️  Failed to generate ${failed.length} asset(s):`)
    failed.forEach((name) => console.log(`   ❌ ${name}`))
  }

  console.log(`\n📂 Assets saved to: ${ASSETS_DIR}`)

  // Create a metadata file
  const metadata = {
    generated_at: new Date().toISOString(),
    model: 'gpt-image-1',
    brand_colors: BRAND_STYLE,
    total_assets: ASSET_PROMPTS.length,
    successful: results.length,
    failed: failed.length,
    assets: results.map((r) => ({
      name: r.name,
      filename: r.filename,
      size_kb: (r.size / 1024).toFixed(2),
      path: r.path,
    })),
  }

  await fs.writeFile(
    path.join(ASSETS_DIR, 'branding-metadata.json'),
    JSON.stringify(metadata, null, 2)
  )

  console.log('\n✅ Metadata saved to public/branding-metadata.json')

  // Generate usage instructions
  const instructions = `
# TV Show Dashboard - Brand Assets

Generated: ${new Date().toISOString()}
Model: gpt-image-1

## Assets Generated

${results.map((r) => `- **${r.filename}** - ${(r.size / 1024).toFixed(2)} KB`).join('\n')}

## Usage

### Favicon
\`\`\`html
<link rel="icon" type="image/png" href="/favicon.png">
\`\`\`

### Apple Touch Icon
\`\`\`html
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
\`\`\`

### Open Graph Image
\`\`\`html
<meta property="og:image" content="/og-image.png">
\`\`\`

### PWA Icons
Add to manifest.json:
\`\`\`json
{
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
\`\`\`

## Brand Colors

- Primary: ${BRAND_STYLE.primary}
- Primary Light: ${BRAND_STYLE.primaryLight}
- Primary Dark: ${BRAND_STYLE.primaryDark}
- Accent: ${BRAND_STYLE.accent}
`

  await fs.writeFile(path.join(ASSETS_DIR, 'BRANDING.md'), instructions)

  console.log('📝 Usage instructions saved to public/BRANDING.md')
  console.log('\n🎉 Done! Your TV Show Dashboard now has professional branding!\n')
}

// Run the script
generateAllAssets().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
