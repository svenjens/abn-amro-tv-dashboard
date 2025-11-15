# Optimized Images Usage Guide

Generated: 2025-11-15T14:56:19.023Z

## Overview

All images have been optimized for web performance:
- **WebP format**: Modern, highly compressed format (supported by all modern browsers)
- **Optimized PNG**: Fallback for older browsers
- **Multiple sizes**: Responsive images for different screen sizes

Total images processed: 24
Total WebP generated: 24
Total optimized PNGs: 24
Average space savings: 30.0%

## Usage in HTML

### Favicon (Multiple sizes)
```html
<link rel="icon" type="image/png" sizes="16x16" href="/optimized/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/optimized/favicon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/optimized/favicon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/optimized/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/optimized/favicon-192.png">
```

### Logo with WebP support
```html
<picture>
  <source srcset="/optimized/logo-main.webp" type="image/webp">
  <img src="/optimized/logo-main.png" alt="Logo">
</picture>
```

### Responsive Hero Background
```html
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
```

### Empty State Illustration
```html
<picture>
  <source srcset="/optimized/empty-state-illustration.webp" type="image/webp">
  <img 
    src="/optimized/empty-state-illustration.png" 
    alt="No results"
    class="mx-auto h-48 w-48"
  >
</picture>
```

## Usage in Vue

### Composable for WebP detection
```typescript
// src/composables/useOptimizedImage.ts
import { computed } from 'vue'

export function useOptimizedImage(imagePath: string) {
  const webpPath = computed(() => imagePath.replace(/\.png$/, '.webp'))
  const pngPath = computed(() => imagePath)
  
  return {
    webpPath,
    pngPath
  }
}
```

### Component usage
```vue
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
```

## Performance Benefits

- **WebP compression**: 25-35% smaller than PNG on average
- **Responsive images**: Serve appropriate size per device
- **Faster load times**: Reduced bandwidth and faster rendering
- **Better UX**: Quicker page loads, especially on mobile

## Browser Support

- **WebP**: Chrome, Firefox, Safari 14+, Edge (95%+ global support)
- **PNG fallback**: All browsers

## File Locations

All optimized images are in: `public/optimized/`

Original images remain in: `public/`
