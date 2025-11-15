/**
 * Vue Router configuration with i18n support
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getCurrentLocale, setCurrentLocale } from '@/i18n/helpers'
import { logger } from '@/utils'

const routes: RouteRecordRaw[] = [
  {
    path: '/:locale(en|nl)?',
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: 'Home - TV Show Dashboard',
        },
      },
      {
        path: 'show/:id',
        name: 'show-detail',
        component: () => import('@/views/ShowDetail.vue'),
        meta: {
          title: 'Show Details - TV Show Dashboard',
        },
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/Search.vue'),
        meta: {
          title: 'Search - TV Show Dashboard',
        },
      },
      {
        path: 'genre/:genre',
        name: 'genre-overview',
        component: () => import('@/views/GenreOverview.vue'),
        meta: {
          title: 'Genre - TV Show Dashboard',
        },
      },
      {
        path: 'watchlist',
        name: 'watchlist',
        component: () => import('@/views/Watchlist.vue'),
        meta: {
          title: 'My Watchlist - TV Show Dashboard',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      return `/${getCurrentLocale()}`
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to, _from, next) => {
  // Get locale from route or use default
  const locale = to.params.locale as string | undefined

  // If no locale in route, redirect to default locale
  if (!locale && to.name !== 'not-found') {
    const defaultLocale = getCurrentLocale()
    const pathWithoutLeadingSlash = to.path.startsWith('/') ? to.path.slice(1) : to.path
    const newPath = pathWithoutLeadingSlash
      ? `/${defaultLocale}/${pathWithoutLeadingSlash}`
      : `/${defaultLocale}`
    return next({ path: newPath, query: to.query })
  }

  // Set i18n locale from route
  if (locale && (locale === 'en' || locale === 'nl')) {
    setCurrentLocale(locale)
    document.documentElement.setAttribute('lang', locale)
    localStorage.setItem('locale', locale)
  }

  // Update document title
  const title = to.meta.title
  if (title && typeof title === 'string') {
    document.title = title
  }

  // Add hreflang tags for SEO
  updateHreflangTags(to.path)

  next()
})

/**
 * Update hreflang tags for multilingual SEO
 */
function updateHreflangTags(path: string) {
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"]').forEach((link) => link.remove())

  // Get base path without locale
  const basePath = path.replace(/^\/(en|nl)/, '')

  // Add hreflang tags for each locale
  const locales = ['en', 'nl']
  locales.forEach((locale) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = locale
    link.href = `${window.location.origin}/${locale}${basePath}`
    document.head.appendChild(link)
  })

  // Add x-default
  const defaultLink = document.createElement('link')
  defaultLink.rel = 'alternate'
  defaultLink.hreflang = 'x-default'
  defaultLink.href = `${window.location.origin}/en${basePath}`
  document.head.appendChild(defaultLink)
}

// Error handling
router.onError((error) => {
  logger.error('[Router Error]', error)
})

export default router
