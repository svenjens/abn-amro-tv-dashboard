import { test, expect } from '@playwright/test'
import { waitForHydration, navigateSPA } from './helpers'

test.describe('Watchlist Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    await waitForHydration(page)
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })
  })

  test('should add show to watchlist', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="show-card-"]').first()

    // Get the show ID from the card
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    // Button should be visible (no hover needed in tests thanks to data-e2e-visible)
    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`).first()
    await expect(watchlistButton).toBeVisible({ timeout: 5000 })

    // Click and wait for watchlist count to appear (deterministic wait)
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await watchlistButton.click()

    // Wait for watchlist count to appear and show correct value
    await expect(watchlistCount).toBeVisible({ timeout: 5000 })
    await expect(watchlistCount).toContainText('1', { timeout: 5000 })
  })

  test('should navigate to watchlist page', async ({ page }) => {
    // First add a show to watchlist
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`).first()
    await watchlistButton.click()

    // Wait for watchlist count to appear (deterministic wait)
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).toBeVisible({ timeout: 5000 })

    // Navigate to watchlist page using SPA helper
    await navigateSPA(page, /.*\/en\/watchlist/, async () => {
      await page.locator('[data-testid="watchlist-link"]').click()
    })

    // Verify we're on watchlist page
    expect(page.url()).toContain('/en/watchlist')

    // Check that the show is displayed
    const showCards = page.locator('[data-testid^="show-card-"]')
    await expect(showCards.first()).toBeVisible({ timeout: 10000 })
    const count = await showCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should remove show from watchlist', async ({ page }) => {
    // Add show first
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`).first()

    // Add to watchlist and wait for count to appear
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await watchlistButton.click()
    await expect(watchlistCount).toBeVisible({ timeout: 5000 })

    // Remove from watchlist and wait for count to disappear
    await watchlistButton.click()
    await expect(watchlistCount).not.toBeVisible({ timeout: 5000 })
  })
})
