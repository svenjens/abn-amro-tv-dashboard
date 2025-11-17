// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  // Nitro configuration
  nitro: {
    prerender: {
      failOnError: false, // Don't fail build on prerender errors
      crawlLinks: false, // Don't automatically discover links
      routes: ['/legal/privacy', '/legal/disclaimer'], // Only prerender these specific routes
      ignore: [
        '/show/**', // Never prerender show pages (need API data)
        '/genre/**', // Never prerender genre pages (need API data)
        '/search', // Never prerender search page (client-side only)
        '/api/**', // Never prerender API routes
      ],
    },
  },

  // Route rules for SSG and caching
  routeRules: {
    // Homepage - SSR with SWR cache (needs API data)
    '/': { swr: 3600 }, // Cache for 1 hour
    '/en': { swr: 3600 },
    '/nl': { swr: 3600 },
    '/es': { swr: 3600 },
    // Search - SSR with short cache (dynamic)
    '/search': { swr: 3600 },
    '/*/search': { swr: 3600 },
    // Watchlist - client-side only (localStorage)
    '/watchlist': { ssr: false },
    '/*/watchlist': { ssr: false },
    // Static pages - prerender at build time
    '/roadmap': { prerender: true },
    '/*/roadmap': { prerender: true },
    '/accessibility': { prerender: true },
    '/*/accessibility': { prerender: true },
    '/disclaimer': { prerender: true },
    '/*/disclaimer': { prerender: true },
    '/privacy': { prerender: true },
    '/*/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/*/terms': { prerender: true },
    // Genre pages - SSR with SWR cache
    '/genre/**': { swr: 3600 },
    '/*/genre/**': { swr: 3600 },
    // Show pages - SSR with 1 week cache (shows don't change often)
    '/show/**': { ssr: true, swr: 604800 }, // 7 days
    '/*/show/**': { ssr: true, swr: 604800 },
    // API routes - no caching
    '/api/**': { cache: false },
  },

  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // Robots configuration
  robots: {
    allow: '/',
    disallow: [],
    sitemap: 'https://bingelist.app/sitemap.xml',
    // Allow AI crawlers
    groups: [
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'ClaudeBot'],
        allow: '/',
      },
    ],
  },

  // Sitemap configuration
  site: {
    url: 'https://bingelist.app',
  },
  sitemap: {
    exclude: ['/api/**'],
    urls: async () => {
      // Generate dynamic genre URLs
      const genres = [
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

      const locales = ['en', 'nl', 'es']
      const genreUrls = []

      for (const locale of locales) {
        for (const genre of genres) {
          genreUrls.push({
            loc: `/${locale}/genre/${genre}`,
            changefreq: 'weekly' as const,
            priority: 0.7 as const,
          })
        }
      }

      return genreUrls
    },
  },

  // Image optimization configuration
  image: {
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // Scripts configuration for third-party services
  scripts: {
    registry: {
      googleAnalytics: {
        id: process.env.VITE_GOOGLE_ADS_ID || '',
      },
    },
  },

  // Security configuration
  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'https://*.tmdb.org',
          'https://*.googletagmanager.com',
          'https://*.google-analytics.com',
        ],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          'https://*.googletagmanager.com',
          'https://*.google-analytics.com',
          'https://pagead2.googlesyndication.com',
        ],
        'upgrade-insecure-requests': true,
      },
      xFrameOptions: 'SAMEORIGIN',
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
      },
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: true,
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/fontaine',
    'nuxt-security',
  ],

  // Runtime config for env variables
  runtimeConfig: {
    // Private keys (server-only)
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    // Public keys (client-accessible)
    public: {
      tmdbApiKey: process.env.VITE_TMDB_API_KEY || '',
      googleAdsenseId: process.env.VITE_GOOGLE_ADSENSE_ID || '',
      amazonAssociateTag: process.env.VITE_AMAZON_ASSOCIATE_TAG || '',
      googleAdsId: process.env.VITE_GOOGLE_ADS_ID || '',
    },
  },

  // i18n configuration (migrate from src/i18n/)
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'nl', iso: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
  },

  // Auto-imports (migrate composables)
  imports: {
    dirs: ['composables/**', 'stores/**', 'utils/**'],
  },

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css',
    exposeConfig: false,
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
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover your next favorite TV show with BingeList' },
      ],
      link: [
        // Default favicon (fallback)
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        // Light mode - use dark icon for visibility
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-dark.png',
          media: '(prefers-color-scheme: light)',
        },
        // Dark mode - use light icon for visibility
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-light.png',
          media: '(prefers-color-scheme: dark)',
        },
        // Apple touch icon
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
