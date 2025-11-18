import { test, expect } from '@playwright/test'

test.describe('Watchlist Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })
  })

  test('should add show to watchlist', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="show-card-"]').first()

    // Get the show ID from the card
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    // Hover over the card to reveal watchlist button
    await firstCard.hover()

    // Find and click the watchlist button
    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`)
    await expect(watchlistButton).toBeVisible()
    await watchlistButton.click()

    // Check that watchlist count increased
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).toBeVisible()
    await expect(watchlistCount).toContainText('1')
  })

  test('should navigate to watchlist page', async ({ page }) => {
    // First add a show to watchlist
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    await firstCard.hover()
    await page.locator(`[data-testid="watchlist-button-${id}"]`).click()

    // Click watchlist link
    await page.locator('[data-testid="watchlist-link"]').click()

    // Wait for navigation
    await page.waitForURL(/.*\/watchlist/, { timeout: 5000 })

    // Verify we're on watchlist page
    expect(page.url()).toMatch(/\/watchlist/)

    // Check that the show is displayed
    const showCards = page.locator('[data-testid^="show-card-"]')
    const count = await showCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should remove show from watchlist', async ({ page }) => {
    // Add show first
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    await firstCard.hover()
    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`)
    await watchlistButton.click()

    // Wait a bit for state update
    await page.waitForTimeout(500)

    // Remove it
    await firstCard.hover()
    await watchlistButton.click()

    // Watchlist count should not be visible (empty)
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).not.toBeVisible()
  })

  test('should persist watchlist in localStorage', async ({ page, context }) => {
    // Add a show to watchlist
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    await firstCard.hover()
    await page.locator(`[data-testid="watchlist-button-${id}"]`).click()

    // Wait for state update
    await page.waitForTimeout(500)

    // Reload the page
    await page.reload()
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })

    // Watchlist count should still be visible
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).toBeVisible()
    await expect(watchlistCount).toContainText('1')
  })
})
