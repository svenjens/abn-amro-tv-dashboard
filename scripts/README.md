# 🛠️ Scripts Documentation

This directory contains utility scripts for the BingeList project.

## 📦 Bundle Analysis Scripts

### `analyze-bundle.js`

Analyzes the Vite build output and generates a comprehensive bundle size report.

**Usage:**

```bash
npm run build
npm run analyze:bundle
```

**Output:**

- Console output with bundle statistics
- `bundle-report.json` - Detailed JSON report with all metrics

**Features:**

- Total bundle size (raw + gzipped)
- JavaScript and CSS breakdown
- Individual chunk sizes
- Top 5 largest chunks
- File count statistics

**Example Output:**

```
📊 Bundle Analysis Summary
==================================================

📦 Total Assets: 27 files
   Size: 406.53 KB
   Gzip: 143.56 KB

📜 JavaScript: 22 files
   Size: 373.73 KB
   Gzip: 137.21 KB

🎨 CSS: 5 files
   Size: 32.8 KB
   Gzip: 6.35 KB
```

---

### `compare-bundle.js`

Compares two bundle reports and generates a diff with visual indicators.

**Usage:**

```bash
# Compare current build with base
npm run compare:bundle [base-report.json] [head-report.json]

# Default paths:
# - base: ./base-bundle-report.json
# - head: ./bundle-report.json
```

**Output:**

- Console output with comparison tables
- `bundle-comparison.md` - Markdown report for PR comments

**Features:**

- Size changes (increases/decreases)
- Percentage changes
- Visual indicators (📈 increase, 📉 decrease, ✅ minimal)
- New/removed files detection
- Top changed chunks

**Example Output:**

```markdown
## 📦 Bundle Size Report

### Total Bundle Size

| Metric | Base      | Head      | Change              |
| ------ | --------- | --------- | ------------------- |
| Size   | 406.53 KB | 410.25 KB | 📈 +3.72 KB (0.91%) |
| Gzip   | 143.56 KB | 145.12 KB | 📈 +1.56 KB (1.09%) |
| Files  | 27        | 28        | 📈 +1 (3.70%)       |
```

---

## 🎨 Image Generation Scripts

### `generate-branding.js`

Generates all branding assets using OpenAI's image generation API.

**Prerequisites:**

```bash
export OPENAI_API_KEY="your-api-key"
```

**Usage:**

```bash
npm run generate:branding
```

**Generated Assets:**

- Logo (main icon)
- Full logo with text
- Hero background
- OG image (social sharing)
- Favicon (multiple sizes)
- PWA icons (192x192, 512x512)
- Apple touch icon
- Loading animation
- Empty state illustration

**Configuration:**
Edit `BRAND_STYLE` in the script to customize:

- Primary colors
- Accent colors
- Design style

---

### `optimize-images.js`

Optimizes images using Sharp (converts to WebP, resizes, etc.).

**Usage:**

```bash
npm run optimize:images
```

**Features:**

- WebP conversion
- Multiple size variants (64px, 128px, 256px, original)
- Preserves original PNG files
- Outputs to `/public/optimized/`

---

## 🗺️ SEO Scripts

### `generate-sitemap.js`

Generates a dynamic sitemap with all shows and pages.

**Usage:**

```bash
npm run generate:sitemap
```

**Output:**

- `public/sitemap.xml` - Complete sitemap for search engines

**Features:**

- Dynamic show URLs with SEO-friendly slugs
- Static pages (home, search, watchlist, roadmap)
- Multi-language support
- Priority and update frequency metadata

**Configuration:**

- Base URL: `https://bingelist.app`
- Languages: `en`, `nl`
- Update frequency: weekly (shows), daily (static pages)

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

The bundle analysis scripts are integrated into the CI/CD pipeline:

1. **Build Job** - Generates `bundle-report.json` after building
2. **PR Comment Job** - Compares bundle sizes and posts results to PR

**Workflow:**

1. Build application
2. Run `analyze-bundle.js`
3. Upload bundle report as artifact
4. Download base branch bundle report
5. Run `compare-bundle.js`
6. Post enhanced comment to PR with:
   - Deployment preview URL
   - Test coverage
   - Bundle size comparison
   - Changed/added/removed chunks

**Example PR Comment:**

```markdown
## 🚀 Deployment Preview

✅ **Preview deployed successfully!**

🔗 **Preview URL:** https://preview-abc123.vercel.app

---

### 📊 Test Coverage

Current coverage: **78.5%**

## 📦 Bundle Size Report

### Total Bundle Size

| Metric | Base      | Head      | Change              |
| ------ | --------- | --------- | ------------------- |
| Size   | 406.53 KB | 410.25 KB | 📈 +3.72 KB (0.91%) |
| Gzip   | 143.56 KB | 145.12 KB | 📈 +1.56 KB (1.09%) |

### 📝 Changed Chunks

| File                   | Base (gzip) | Head (gzip) | Change              |
| ---------------------- | ----------- | ----------- | ------------------- |
| `ShowDetail-abc123.js` | 5.5 KB      | 6.2 KB      | 📈 +0.7 KB (12.73%) |

---

⚡ Build completed in workflow #123
```

---

## 📝 Notes

- All bundle reports are ignored by `.gitignore`
- Scripts use ES modules (`.js` files)
- Node.js 20+ required
- GitHub Actions automatically runs these on PRs

---

## 🔧 Troubleshooting

### Bundle analysis fails

**Issue:** `dist/` directory not found

**Solution:**

```bash
npm run build
npm run analyze:bundle
```

### Comparison shows no changes

**Issue:** Base report is missing or identical

**Solution:**

```bash
# Manually create base report from current build
cp bundle-report.json base-bundle-report.json

# Or wait for GitHub Actions to download base branch report
```

### OpenAI API errors

**Issue:** API key not set or invalid

**Solution:**

```bash
export OPENAI_API_KEY="your-actual-key"
npm run generate:branding
```

---

## 📚 Related Documentation

- [GitHub Actions Workflow](../.github/workflows/deploy.yml)
- [Bundle Size Best Practices](https://web.dev/bundle-size/)
- [Vite Build Options](https://vitejs.dev/guide/build.html)
