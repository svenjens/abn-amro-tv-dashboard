/**
 * Main application entry point
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { getCurrentLocale } from './i18n/helpers'
import { logger, registerServiceWorker, initInstallPrompt } from './utils'
import { initDarkModeEarly } from './composables'
import './style.css'

// Initialize dark mode before app mounts (prevents flash of wrong theme)
initDarkModeEarly()

const app = createApp(App)

// Install Pinia store
app.use(createPinia())

// Install Vue Router
app.use(router)

// Install Vue I18n
app.use(i18n)

// Install Motion plugin for animations
app.use(MotionPlugin)

// Set initial locale on document
document.documentElement.setAttribute('lang', getCurrentLocale())

// Mount app
app.mount('#app')

// Initialize PWA features
registerServiceWorker()
initInstallPrompt()

// Initialize Vercel Speed Insights (Web Vitals monitoring)
injectSpeedInsights()

// Log app initialization
logger.debug('[App] TV Show Dashboard initialized')
