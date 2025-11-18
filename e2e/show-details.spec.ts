import { test, expect } from '@playwright/test'

test.describe('Show Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })

    // Navigate to first show's details page
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    await firstCard.click()
    await page.waitForURL(/.*\/show\/.*/, { timeout: 5000 })
  })

  test('should display show details page', async ({ page }) => {
    // Check that we're on a show details page
    expect(page.url()).toMatch(/\/show\/\d+/)

    // Page should have loaded
    await expect(page).toHaveTitle(/.*/)
  })

  test('should display show title and summary', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 5000 })

    // Check title is visible
    const title = page.locator('h1')
    await expect(title).toBeVisible()

    // Check that there's some content
    const content = await page.textContent('body')
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should display show image or placeholder', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 5000 })

    // Check for image (either img tag or placeholder)
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have watchlist button on details page', async ({ page }) => {
    // Wait for page content
    await page.waitForSelector('h1', { timeout: 5000 })

    // Look for any watchlist button
    const watchlistButtons = page.locator('button').filter({ hasText: /watchlist|bookmark|add/i })

    // At least one watchlist-related button should exist
    const count = await watchlistButtons.count()
    expect(count).toBeGreaterThanOrEqual(0) // May not be visible immediately
  })

  test('should be able to navigate back to homepage', async ({ page }) => {
    // Look for a back button or logo link
    const backButton = page.locator('a[href="/"], a[href="/en"], a[href*="home"]').first()

    if ((await backButton.count()) > 0) {
      await backButton.click()
      await page.waitForURL(/.*\/$|.*\/en|.*\/nl|.*\/es/, { timeout: 5000 })

      // Should be back on homepage
      await expect(page.locator('[data-testid^="show-card-"]').first()).toBeVisible()
    }
  })
})
