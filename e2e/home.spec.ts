import { test, expect } from './fixtures';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display planets list title and description', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: /Planets/i, level: 1 })
    ).toBeVisible();

    await expect(
      page.getByText(/Explore planets from the Star Wars universe/i)
    ).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByTestId('planet-search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search planets/i);
  });

  test('should display planets count', async ({ page }) => {
    const planetsCount = page.getByTestId('planets-count');
    await expect(planetsCount).toBeVisible();
    await expect(planetsCount).toContainText(/planets available/i);
  });

  test('should have correct meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/SWAPI/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole('heading', { name: /Planets/i, level: 1 })
    ).toBeVisible();
    await expect(page.getByTestId('planet-search-input')).toBeVisible();
  });

  test('should have centered layout', async ({ page }) => {
    const container = page.locator('div.space-y-6');
    await expect(container).toBeVisible();
  });

  test('should display planet cards', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const cards = page.locator('[data-testid="planet-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should load quickly (performance)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('should have adequate accessibility', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    const searchInput = page.getByTestId('planet-search-input');
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('should show sync indicator when syncing', async ({ page }) => {
    const syncIndicator = page.getByTestId('planets-sync-indicator');
    const count = await syncIndicator.count();
    if (count > 0) {
      await expect(syncIndicator).toBeVisible();
    }
  });

  test('should allow navigation to planet details', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await firstCard.click();

    await page.waitForURL(/\/\d+/);
    await expect(page).toHaveURL(/\/\d+/);
  });
});
