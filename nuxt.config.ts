// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { enabled: true },
  
  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  
  // Robots configuration
  robots: {
    disallow: []
  },
  
  // Sitemap configuration
  sitemap: {
    hostname: 'https://bingelist.app',
    gzip: true,
    routes: []
  },
  
  // Image optimization configuration
  image: {
    formats: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  
  // Runtime config for env variables
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.VITE_TMDB_API_KEY || '',
      googleAdsenseId: process.env.VITE_GOOGLE_ADSENSE_ID || '',
      amazonAssociateTag: process.env.VITE_AMAZON_ASSOCIATE_TAG || '',
      googleAdsId: process.env.VITE_GOOGLE_ADS_ID || ''
    }
  },
  
  // i18n configuration (migrate from src/i18n/)
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'nl', iso: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },
  
  // Auto-imports (migrate composables)
  imports: {
    dirs: ['composables/**', 'stores/**', 'utils/**']
  },
  
  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css',
    exposeConfig: false
  },
  
  // PostCSS configuration (instead of postcss.config.js)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  // App configuration
  app: {
    head: {
      title: 'BingeList - Your Ultimate TV Show Discovery Platform',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover your next favorite TV show with BingeList' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
