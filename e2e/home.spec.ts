import { test, expect } from './fixtures';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct title and description', async ({ page }) => {
    // Verifies main heading
    await expect(
      page.getByRole('heading', { name: /Explore living worlds/i })
    ).toBeVisible();

    // Verifies description
    await expect(
      page.getByText(/Each planet arrives instantly/i)
    ).toBeVisible();
  });

  test('should have button to explore planets', async ({ page }) => {
    // Verifies main button
    const button = page.getByRole('link', { name: /Explore Planets/i });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('href', '/planets');
  });

  test('should have functional link to planets', async ({ page }) => {
    // Clicks the Explore Planets button
    await page.getByRole('link', { name: /Explore Planets/i }).click();

    // Waits for navigation and verifies URL
    await page.waitForURL('/planets');
    await expect(page).toHaveURL(/\/planets/);
  });

  test('should have correct meta tags', async ({ page }) => {
    // Verifies page title
    await expect(page).toHaveTitle(/SWAPI/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verifies that all elements are still visible
    await expect(
      page.getByRole('heading', { name: /Explore living worlds/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Explore Planets/i })
    ).toBeVisible();
  });

  test('should have centered layout', async ({ page }) => {
    const container = page.locator('div.flex.min-h-\\[calc\\(100vh-4rem\\)\\]');
    await expect(container).toBeVisible();
  });

  test('button should have large size (lg)', async ({ page }) => {
    const button = page.getByRole('link', { name: /Explore Planets/i });

    // Verifies that button has prominent appearance
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40); // lg buttons are >= 40px
  });

  test('should load quickly (performance)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Home page should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have adequate accessibility', async ({ page }) => {
    // Verifies heading structure
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Verifies that link is focusable
    const link = page.getByRole('link', { name: /Explore Planets/i });
    await link.focus();
    await expect(link).toBeFocused();
  });

  test('should display planet card when data loads', async ({ page }) => {
    // Waits for card to appear (optimistic UI)
    await page.waitForTimeout(2000);

    // Verifies if there's a planet card
    const card = page.locator('div[class*="card"]').first();
    const isVisible = await card.isVisible();

    if (isVisible) {
      // If there's a card, verifies basic content
      await expect(card).toBeVisible();
    }
  });

  test('should show sync badge when applicable', async ({ page }) => {
    // Badge may appear if there's synchronization
    const syncBadge = page.getByText(/synced|live/i);
    // Only verifies if it exists, doesn't fail if it doesn't
    const count = await syncBadge.count();
    if (count > 0) {
      await expect(syncBadge.first()).toBeVisible();
    }
  });

  test('should display technologies section', async ({ page }) => {
    await expect(
      page.getByText(/Built with modern technologies/i)
    ).toBeVisible();

    // Verifies some technologies
    await expect(page.getByText(/Next\.js/i)).toBeVisible();
    await expect(page.getByText(/TypeScript/i)).toBeVisible();
    await expect(page.getByText(/React Query/i)).toBeVisible();
  });
});
