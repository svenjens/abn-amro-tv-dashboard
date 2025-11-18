// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  // Nitro configuration
  nitro: {
    prerender: {
      failOnError: false, // Don't fail build on prerender errors
      crawlLinks: false, // Don't automatically discover links
      routes: [
        '/en/legal/privacy',
        '/en/legal/disclaimer',
        '/nl/legal/privacy',
        '/nl/legal/disclaimer',
        '/es/legal/privacy',
        '/es/legal/disclaimer',
      ], // Only prerender these specific routes with locale prefixes
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
    '/en': { swr: 3600 },
    '/nl': { swr: 3600 },
    '/es': { swr: 3600 },
    // Search - client-side only (requires query parameter from user)
    '/*/search': { ssr: false },
    // Watchlist - client-side only (localStorage)
    '/*/watchlist': { ssr: false },
    // Static pages - prerender at build time
    '/*/roadmap': { prerender: true },
    '/*/legal/accessibility': { prerender: true },
    '/*/legal/disclaimer': { prerender: true },
    '/*/legal/privacy': { prerender: true },
    '/*/legal/terms': { prerender: true },
    // Genre pages - SSR with SWR cache
    '/*/genre/**': { swr: 3600 },
    // Show pages - SSR with 1 week cache (shows don't change often)
    '/*/show/**': { ssr: true, swr: 604800 }, // 7 days
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
    domains: ['static.tvmaze.com', 'image.tmdb.org'],
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
      // Set to unsafe-none to allow external images from TVMaze and TMDB
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'connect-src': [
          "'self'",
          'https://*.vercel-insights.com',
          'https://vitals.vercel-insights.com',
          'https://*.google.com', // Google Funding Choices (fundingchoicesmessages.google.com)
          'https://*.google-analytics.com', // Google Analytics
          'https://*.googletagmanager.com', // Google Tag Manager
          'https://vercel.live', // Vercel Live feedback (preview only)
        ],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'https://*.google-analytics.com', // Google Analytics
          'https://*.googletagmanager.com', // Google Tag Manager
        ],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          // Note: 'strict-dynamic' disables host-based allowlisting
          // Removed for compatibility with Vercel Live (preview deployments)
          'https://*.google-analytics.com', // Google Analytics
          'https://*.googletagmanager.com', // Google Tag Manager
          'https://*.googlesyndication.com', // Google AdSense
          'https://*.vercel-insights.com',
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
      tokensPerInterval: 500, // Increased from 150 to allow crawlers (AdSense, Googlebot, etc.)
      interval: 300000, // 5 minutes
      headers: true,
      // Note: This applies to ALL requests including static assets
      // Crawlers load many assets quickly, so we need a higher limit
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
    strategy: 'prefix', // All locales get a prefix (/en, /nl, /es)
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Redirect on root access
      alwaysRedirect: false, // Don't redirect if user explicitly chose a locale
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
        // OpenGraph
        { property: 'og:site_name', content: 'BingeList' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://bingelist.app/og-image.png' },
        { property: 'og:url', content: 'https://bingelist.app' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://bingelist.app/og-image.png' },
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
