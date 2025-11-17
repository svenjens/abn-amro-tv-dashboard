#!/bin/bash

# Fix all vue-router and vue-i18n imports for Nuxt auto-imports

echo "🔧 Fixing imports in .vue files..."

# Remove vue-router imports (Nuxt auto-imports useRouter, useRoute, navigateTo)
find components pages -name "*.vue" -type f -exec sed -i '' "/^import.*from 'vue-router'/d" {} \;

# Remove vue-i18n imports (Nuxt auto-imports useI18n)  
find components pages -name "*.vue" -type f -exec sed -i '' "/^import.*from 'vue-i18n'/d" {} \;

# Remove @/i18n/helpers imports
find components pages -name "*.vue" -type f -exec sed -i '' "/^import.*from '@\/i18n\/helpers'/d" {} \;

echo "✅ Import fixes complete!"

