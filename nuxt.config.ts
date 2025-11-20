// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  // Performance optimizations
  experimental: {
    payloadExtraction: true, // Extract payload to separate files
    renderJsonPayloads: true, // Render JSON payloads for better performance
    componentIslands: true, // Enable component islands for partial hydration
  },

  // Vite optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            'vue-vendor': ['vue', 'vue-router', '@vue/runtime-core'],
            'nuxt-vendor': ['#app'],
          },
        },
      },
      // Minify HTML and remove comments in production
      minify: 'esbuild',
    },
    esbuild: {
      // Keep console.log statements in production (for easter eggs)
      drop: [], // Don't drop any console statements
      // Remove comments in production builds
      legalComments: 'none',
    },
  },

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
    // Minify HTML output in production
    minify: true,
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
  // In production: use Vercel's image optimization for caching & stability
  // In development: use 'none' to avoid IPX errors with external images
  image: {
    provider: process.env.NODE_ENV === 'production' ? 'ipx' : 'none',
    domains: ['static.tvmaze.com', 'image.tmdb.org'],
  },

  // Icon configuration - bundle icons locally for better performance
  icon: {
    serverBundle: {
      collections: ['heroicons'], // Bundle heroicons for SSR
    },
    clientBundle: {
      icons: [
        'heroicons:chevron-left',
        'heroicons:light-bulb',
        'heroicons:code-bracket',
        'heroicons:link',
      ],
      scan: true, // Automatically scan and bundle icons used in the app
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
          'https://*.adtrafficquality.google', // Google Ad Traffic Quality
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
        'script-src-attr': ["'unsafe-inline'"], // Allow inline event handlers for Vue components
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
        'worker-src': ["'self'", 'blob:'], // Allow Web Workers from same origin and blob URLs
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
    '@vite-pwa/nuxt',
  ],

  // Runtime config for env variables
  runtimeConfig: {
    // Private keys (server-only)
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    // Public keys (client-accessible)
    public: {
      tmdbApiKey: process.env.VITE_TMDB_API_KEY || '',
      googleAdsenseId: process.env.VITE_GOOGLE_ADSENSE_ID || '',
      amazonAssociateTag: process.env.NUXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '',
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
        // Favicon - red color works in both light and dark mode
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        // Apple touch icon
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Resource hints for performance
        { rel: 'preconnect', href: 'https://api.themoviedb.org' },
        { rel: 'preconnect', href: 'https://image.tmdb.org' },
        { rel: 'dns-prefetch', href: 'https://api.tvmaze.com' },
        { rel: 'dns-prefetch', href: 'https://pagead2.googlesyndication.com' },
      ],
    },
  },

  // PWA configuration
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'BingeList - TV Show Discovery',
      short_name: 'BingeList',
      description:
        'Your ultimate platform to discover, track, and binge-watch thousands of TV shows',
      theme_color: '#dc2626',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/en',
      lang: 'en',
      dir: 'ltr',
      categories: ['entertainment', 'lifestyle'],
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any',
        },
      ],
      screenshots: [
        {
          src: '/og-image.png',
          sizes: '1200x630',
          type: 'image/png',
          form_factor: 'wide',
        },
      ],
    },
    workbox: {
      navigateFallback: '/en',
      navigateFallbackDenylist: [
        /^\/api/,
        /^\/_nuxt/,
        /^\/sw.js/,
        /^\/manifest.webmanifest/,
        /^\/manifest/,
        /^\/en$/, // Don't precache /en (it's the fallback, handled by runtime)
        /^\/nl$/, // Don't precache locale roots
        /^\/es$/, // Don't precache locale roots
      ],
      globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,webp,woff2}'],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
      globIgnores: [
        '**/originals/**',
        '**/node_modules/**',
        '**/*.map',
        '**/favicon-*.png', // Ignore symlinks (use icon-*.png instead)
      ],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      // Don't precache root URL - it redirects to /en
      dontCacheBustURLsMatching: /\.\w{8}\./,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/bingelist\.app\/$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'root-redirect',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
          },
        },
        {
          urlPattern: /^https:\/\/api\.tvmaze\.com\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'tvmaze-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/static\.tvmaze\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'tvmaze-images-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'tmdb-images-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      // Periodicaly check for updates every hour
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false, // Disable PWA in development to avoid conflicts
      type: 'module',
    },
  },
})
