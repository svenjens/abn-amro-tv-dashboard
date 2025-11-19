import { test, expect } from '@playwright/test'
import { waitForHydration, navigateSPA } from './helpers'

test.describe('Homepage - Browse Shows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    await waitForHydration(page)
    // Wait for shows to load
    await page.waitForSelector('[data-testid^="show-card-"]', { timeout: 10000 })
  })

  test('should display the homepage with hero section', async ({ page }) => {
    // Check hero section title
    await expect(page.locator('h1')).toContainText(/bingelist/i)

    // Check subtitle is visible (look in header/hero section specifically)
    const heroSection = page.locator('header').first()
    await expect(heroSection.locator('p')).toContainText(/discover|ontdek|descubre/i)

    // Check search bar is visible
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible()

    // Check watchlist link is visible
    await expect(page.locator('[data-testid="watchlist-link"]')).toBeVisible()
  })

  test('should display show cards on the homepage', async ({ page }) => {
    // Check that show cards are rendered
    const showCards = page.locator('[data-testid^="show-card-"]')
    await expect(showCards.first()).toBeVisible()

    // Check that at least 10 shows are displayed
    const count = await showCards.count()
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('should display show card with image and details', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="show-card-"]').first()

    // Card should be visible
    await expect(firstCard).toBeVisible()

    // Check for image (either loaded or placeholder)
    const cardImage = firstCard.locator('[data-testid^="show-card-image-"]')
    await expect(cardImage).toBeVisible()

    // Card should have clickable behavior
    await expect(firstCard).toHaveAttribute('class', /cursor-pointer/)
  })

  test('should navigate to show details when clicking on a card', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="show-card-"]').first()

    // Use SPA navigation helper
    await navigateSPA(page, /.*\/en\/show\/.*/, async () => {
      await firstCard.click()
    })

    // Check that we're on a show details page (URL contains /en/show/ and a slug)
    expect(page.url()).toMatch(/\/en\/show\/[\w-]+-\d+/)
  })

  test('should display shows grouped by genre', async ({ page }) => {
    // Check for genre sections
    const genreSections = page
      .locator('h2, h3')
      .filter({ hasText: /drama|comedy|action|thriller/i })
    const count = await genreSections.count()

    // At least one genre section should be visible
    expect(count).toBeGreaterThanOrEqual(1)
  })
})
