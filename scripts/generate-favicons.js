/**
 * Generate only favicons (light and dark mode)
 * Usage: node scripts/generate-favicons.js
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

const BRAND_STYLE = {
  primary: '#dc2626',
  primaryDark: '#b91c1c',
  accent: '#f59e0b',
}

const FAVICON_PROMPTS = [
  {
    name: 'favicon-light',
    prompt: `Create a simple, bold favicon icon for BingeList for LIGHT MODE. 
    A clean TV screen or play button icon with minimal details. 
    Use white and gold (${BRAND_STYLE.accent}) on vibrant red (${BRAND_STYLE.primary}) gradient background. 
    Must be recognizable at tiny sizes (16x16px to 512x512px). 
    Bold shapes, high contrast, simple and iconic. Centered composition. Optimized for light backgrounds.`,
    size: '1024x1024',
    quality: 'medium',
  },
  {
    name: 'favicon-dark',
    prompt: `Create a simple, bold favicon icon for BingeList for DARK MODE. 
    A clean TV screen or play button icon with minimal details. 
    Use white and gold (${BRAND_STYLE.accent}) on deep red (${BRAND_STYLE.primaryDark}) gradient background with subtle glow. 
    Must be recognizable at tiny sizes (16x16px to 512x512px). 
    Bold shapes, high contrast, simple and iconic with a subtle luminous quality. 
    Centered composition. Optimized for dark backgrounds with enhanced visibility.`,
    size: '1024x1024',
    quality: 'medium',
  },
]

async function generateFavicon(config) {
  console.log(`\n🎨 Generating: ${config.name}...`)
  
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: config.prompt,
      size: config.size,
      quality: config.quality,
      n: 1,
    })

    const imageData = response.data[0]
    
    let buffer
    
    if (imageData.b64_json) {
      buffer = Buffer.from(imageData.b64_json, 'base64')
    } else if (imageData.url) {
      const imageResponse = await fetch(imageData.url)
      const arrayBuffer = await imageResponse.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      throw new Error('No image data returned')
    }
    
    const filename = `${config.name}.png`
    const filepath = path.join(ASSETS_DIR, filename)
    
    await fs.writeFile(filepath, buffer)
    
    console.log(`   ✅ Saved: ${filename} (${(buffer.length / 1024).toFixed(2)} KB)`)
    
    return { 
      name: config.name, 
      filename, 
      path: `public/${filename}`, // Use relative path
      size: buffer.length 
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    throw error
  }
}

async function main() {
  console.log('🎨 Generating Adaptive Favicons for BingeList')
  console.log('='.repeat(50))
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not set')
    process.exit(1)
  }
  
  const results = []
  
  for (let i = 0; i < FAVICON_PROMPTS.length; i++) {
    console.log(`\n[${i + 1}/${FAVICON_PROMPTS.length}]`)
    const result = await generateFavicon(FAVICON_PROMPTS[i])
    results.push(result)
    
    if (i < FAVICON_PROMPTS.length - 1) {
      console.log('   ⏳ Waiting 2s...')
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Favicons Generated!')
  console.log('='.repeat(50))
  
  results.forEach((r) => {
    console.log(`   ✅ ${r.filename.padEnd(25)} ${(r.size / 1024).toFixed(2)} KB`)
  })
  
  console.log(`\n📂 Saved to: ${ASSETS_DIR}`)
  console.log('\n🎉 Done!\n')
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

