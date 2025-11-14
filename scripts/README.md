# Scripts

## Scripts Overview

### 1. Brand Asset Generator

Generate professional logo, icons, and other brand assets using OpenAI's gpt-image-1 (latest image model).

```bash
npm run generate:branding
```

### 2. Image Optimizer

Optimize all brand assets for web performance with WebP conversion and responsive sizes.

```bash
npm run optimize:images
```

---

## Brand Asset Generator

### Prerequisites

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Set the API key as an environment variable

### Usage

```bash
# Option 1: Use .env file (already configured)
npm run generate:branding

# Option 2: Set environment variable
export OPENAI_API_KEY=your-api-key-here
npm run generate:branding

# Option 3: Inline
OPENAI_API_KEY=your-api-key npm run generate:branding
```

### What it Generates

The script will generate the following assets in the `public/` directory:

1. **logo-main.png** - Main logo icon (1024x1024)
2. **logo-full.png** - Full logo with text (1536x640)
3. **hero-background.png** - Hero section background (1792x1024)
4. **og-image.png** - Social media share image (1200x630)
5. **favicon.png** - Website favicon (512x512)
6. **icon-192.png** - PWA app icon 192x192
7. **icon-512.png** - PWA app icon 512x512
8. **apple-touch-icon.png** - Apple touch icon (180x180)
9. **loading-animation.png** - Loading spinner base
10. **empty-state-illustration.png** - Empty state illustration

### Cost Estimate

- gpt-image-1: Check OpenAI pricing (latest model)
- Estimated total cost for all assets: ~$0.50 - $1.00

### Rate Limiting

The script includes a 2-second delay between requests to respect OpenAI's rate limits.

### Customization

Edit `scripts/generate-branding.js` to:
- Change brand colors in `BRAND_STYLE`
- Modify prompts in `ASSET_PROMPTS`
- Add or remove assets
- Adjust image sizes and quality

### Output

After generation, you'll find:
- All PNG assets in `public/`
- `branding-metadata.json` with generation info
- `BRANDING.md` with usage instructions

---

## Image Optimizer

Optimize PNG images and generate WebP versions for better web performance.

### Features

- **WebP Conversion**: Generate modern WebP format (25-35% smaller)
- **Multiple Sizes**: Create responsive image variants
- **PNG Optimization**: Compress PNGs with max compression
- **Quality Control**: Maintain visual quality while reducing size
- **Automatic**: Processes all brand assets in one command

### Prerequisites

The `sharp` library is already installed as a dev dependency.

### Usage

```bash
npm run optimize:images
```

### What it Does

1. **Creates optimized directory**: `public/optimized/`
2. **Generates WebP versions**: Modern format for all browsers
3. **Creates multiple sizes**: Responsive variants (16px to 1920px)
4. **Optimizes PNGs**: Fallback for older browsers
5. **Generates usage guide**: `public/optimized/USAGE.md`

### Generated Variants

For each asset, multiple sizes are created:

- **favicon**: 16px, 32px, 48px, 96px, 192px, 512px
- **logo-main**: 64px, 128px, 256px, 512px
- **logo-full**: 512px, 768px, 1536px
- **hero-background**: 768px, 1280px, 1920px
- **empty-state**: 256px, 512px
- And more...

### Performance Benefits

- **25-35% size reduction** with WebP
- **Faster page loads** through smaller files
- **Responsive images** serve appropriate sizes
- **Better UX** especially on mobile/slow connections

### Browser Support

- WebP: Chrome, Firefox, Safari 14+, Edge (95%+ coverage)
- PNG fallback: All browsers

### Output Structure

```
public/optimized/
├── logo-main.webp
├── logo-main.png
├── logo-main-64.webp
├── logo-main-64.png
├── favicon-16.webp
├── favicon-16.png
├── ... (all variants)
└── USAGE.md
```

### Integration Example

```html
<!-- WebP with PNG fallback -->
<picture>
  <source srcset="/optimized/logo-main.webp" type="image/webp">
  <img src="/optimized/logo-main.png" alt="Logo">
</picture>

<!-- Responsive hero background -->
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
  <img src="/optimized/hero-background-768.png" alt="">
</picture>
```

See `public/optimized/USAGE.md` for complete usage examples.

