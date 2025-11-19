import { test, expect } from '@playwright/test'
import { waitForHydration, navigateSPA } from './helpers'

test.describe('Show Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    await waitForHydration(page)
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })

    // Navigate to first show's details page using SPA helper
    const firstCard = page.locator('[data-testid^="show-card-"]').first()
    await navigateSPA(page, /.*\/en\/show\/.*/, async () => {
      await firstCard.click()
    })
  })

  test('should display show details page', async ({ page }) => {
    // Check that we're on a show details page (URL contains /en/show/ and a slug)
    expect(page.url()).toMatch(/\/en\/show\/[\w-]+-\d+/)

    // Page should have loaded with a title
    await expect(page).toHaveTitle(/.*/)
  })

  test('should display show title and summary', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 })

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
    await page.waitForSelector('h1', { timeout: 10000 })

    // Check for image (either img tag or placeholder)
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have watchlist button on details page', async ({ page }) => {
    // Wait for page content
    await page.waitForSelector('h1', { timeout: 10000 })

    // Look for watchlist button with data-testid
    const watchlistButton = page.locator('[data-testid^="watchlist-button-"]')

    // Watchlist button should exist
    await expect(watchlistButton.first()).toBeVisible({ timeout: 10000 })
  })

  test('should be able to navigate back to homepage', async ({ page }) => {
    // Use browser back button
    await page.goBack()

    // Wait for homepage to load
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })

    // Should be back on homepage
    await expect(page.locator('[data-testid^="show-card-"]').first()).toBeVisible()
  })
})
