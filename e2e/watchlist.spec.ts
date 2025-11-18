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

    // Wait for button to be visible after hover
    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`).first()
    await expect(watchlistButton).toBeVisible({ timeout: 5000 })

    // Click and wait a bit for state update
    await watchlistButton.click()
    await page.waitForTimeout(1000)

    // Check that watchlist count increased - it should appear in header
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).toBeVisible({ timeout: 10000 })
    await expect(watchlistCount).toContainText('1')
  })

  test('should navigate to watchlist page', async ({ page }) => {
    // First add a show to watchlist
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    await firstCard.hover()
    await page.locator(`[data-testid="watchlist-button-${id}"]`).first().click()

    // Wait for watchlist count to appear
    await page.waitForSelector('[data-testid="watchlist-count"]', { timeout: 10000 })

    // Click watchlist link and wait for URL change
    const initialUrl = page.url()
    await page.locator('[data-testid="watchlist-link"]').click()
    await page.waitForURL((url) => url.href !== initialUrl, { timeout: 10000 })

    // Verify we're on watchlist page
    expect(page.url()).toContain('/watchlist')

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

    await firstCard.hover()
    const watchlistButton = page.locator(`[data-testid="watchlist-button-${id}"]`).first()
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

  test('should persist watchlist in localStorage', async ({ page }) => {
    // Add a show to watchlist
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    const showId = await firstCard.getAttribute('data-testid')
    const id = showId?.replace('show-card-', '')

    await firstCard.hover()
    await page.locator(`[data-testid="watchlist-button-${id}"]`).first().click()

    // Wait for watchlist count to appear
    const watchlistCount = page.locator('[data-testid="watchlist-count"]')
    await expect(watchlistCount).toBeVisible({ timeout: 5000 })
    await expect(watchlistCount).toContainText('1')

    // Reload the page
    await page.reload()
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 15000 })

    // Watchlist count should still be visible after reload
    await expect(watchlistCount).toBeVisible({ timeout: 10000 })
    await expect(watchlistCount).toContainText('1')
  })
})
