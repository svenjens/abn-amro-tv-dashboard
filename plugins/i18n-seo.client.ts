/**
 * Client-side plugin to enhance i18n SEO
 * Ensures proper hreflang tags and x-default are set
 */

export default defineNuxtPlugin(() => {
  const { locales } = useI18n()
  const route = useRoute()
  const switchLocalePath = useSwitchLocalePath()

  // Watch for route changes to update hreflang tags
  watch(
    () => route.fullPath,
    () => {
      if (!import.meta.client) return

      const baseUrl = 'https://bingelist.app'
      const links: { rel: string; hreflang: string; href: string }[] = []

      // Generate hreflang links for each locale
      locales.value.forEach((loc: any) => {
        const localeCode = loc.code
        const isoCode = loc.iso.toLowerCase() // Convert to lowercase per Google guidelines
        const localePath = switchLocalePath(localeCode)

        if (localePath) {
          links.push({
            rel: 'alternate',
            hreflang: isoCode,
            href: `${baseUrl}${localePath}`,
          })
        }
      })

      // Add x-default pointing to default locale (English)
      const defaultPath = switchLocalePath('en')
      if (defaultPath) {
        links.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${baseUrl}${defaultPath}`,
        })
      }

      // Update head with hreflang links
      useHead({
        link: links,
      })
    },
    { immediate: true }
  )
})
