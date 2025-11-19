import { test, expect } from '@playwright/test'
import { waitForHydration, navigateSPA } from './helpers'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    await waitForHydration(page)
    await page.waitForSelector('[data-testid="search-bar"]', { timeout: 5000 })
  })

  test('should display search bar on homepage', async ({ page }) => {
    const searchBar = page.locator('[data-testid="search-bar"]')
    await expect(searchBar).toBeVisible()
    await expect(searchBar).toBeEnabled()
  })

  test('should navigate to search page when entering a query', async ({ page }) => {
    // Use the input ID directly
    const searchInput = page.locator('#tv-show-search')

    // Click the input - this triggers navigation to /search page
    await navigateSPA(page, /.*\/en\/search/, async () => {
      await searchInput.click()
    })

    // Now we're on the search page - type in the input
    await searchInput.fill('Game of Thrones')

    // Wait for URL to update with query parameter
    await page.waitForURL(/.*\/en\/search\?q=.*/, { timeout: 5000 })

    // Verify URL contains /en/search and the query
    expect(page.url()).toContain('/en/search')
    expect(page.url()).toContain('Game')
  })

  test('should display search results', async ({ page }) => {
    // Use the input ID directly
    const searchInput = page.locator('#tv-show-search')

    // Click the input - this triggers navigation to /search page
    await navigateSPA(page, /.*\/en\/search/, async () => {
      await searchInput.click()
    })

    // Now we're on the search page - type in the input
    await searchInput.fill('Friends')

    // Wait for show cards to appear (search is auto-triggered by typing)
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 15000 })

    // Check that results are displayed
    const showCards = page.locator('[data-testid^="show-card-"]')
    const count = await showCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should clear search input', async ({ page }) => {
    // Use the input ID directly
    const searchInput = page.locator('#tv-show-search')

    // Type something
    await searchInput.fill('Breaking Bad')

    // Clear it
    await searchInput.clear()

    // Verify it's empty
    await expect(searchInput).toHaveValue('')
  })
})
