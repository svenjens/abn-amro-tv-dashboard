# Scripts

## Brand Asset Generator

Generate professional logo, icons, and other brand assets using OpenAI's gpt-image-1 (latest image model).

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

