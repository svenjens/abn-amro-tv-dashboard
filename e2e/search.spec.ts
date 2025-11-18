import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="search-bar"]', { timeout: 5000 })
  })

  test('should display search bar on homepage', async ({ page }) => {
    const searchBar = page.locator('[data-testid="search-bar"]')
    await expect(searchBar).toBeVisible()
    await expect(searchBar).toBeEnabled()
  })

  test('should navigate to search page when entering a query', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-bar"] input')

    // Type search query
    await searchInput.fill('Game of Thrones')
    await searchInput.press('Enter')

    // Wait for navigation to search page
    await page.waitForURL(/.*\/search\?q=/, { timeout: 5000 })

    // Verify URL contains the query
    expect(page.url()).toContain('q=Game')
  })

  test('should display search results', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-bar"] input')

    // Search for a popular show
    await searchInput.fill('Friends')
    await searchInput.press('Enter')

    // Wait for search results page
    await page.waitForURL(/.*\/search\?q=/, { timeout: 5000 })

    // Wait for show cards to appear
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })

    // Check that results are displayed
    const showCards = page.locator('[data-testid^="show-card-"]')
    const count = await showCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should clear search input', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-bar"] input')

    // Type something
    await searchInput.fill('Breaking Bad')

    // Clear it
    await searchInput.clear()

    // Verify it's empty
    await expect(searchInput).toHaveValue('')
  })
})
