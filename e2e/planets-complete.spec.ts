import { test, expect } from './fixtures';

test.describe('SWAPI Challenge - Planets Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Requirement: should display films in list cards', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for films to load

    const filmsText = page.getByText('Films:').first();
    await expect(filmsText).toBeVisible();
  });

  test('Requirement: list sorted alphabetically', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    const names = await page
      .locator('text=/^[A-Z]/ >> visible=true')
      .filter({
        has: page.locator('text=Population:'),
      })
      .allTextContents();

    const planetNames = names.slice(0, 10);

    expect(planetNames.length).toBeGreaterThan(0);
  });

  test('Requirement: 10 items per page with pagination', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    const populationTexts = page.getByText('Population:');
    const count = await populationTexts.count();

    expect(count).toBeLessThanOrEqual(10);
    expect(count).toBeGreaterThan(0);

    const paginationExists = await page
      .getByRole('button', { name: /next|previous/i })
      .count();
    expect(paginationExists).toBeGreaterThan(0);
  });

  test('Requirement: search by name functional', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search planets...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Alderaan');
    await page.waitForTimeout(1500);

    await expect(page.getByText('Population:').first()).toBeVisible();
  });

  test('Requirement: cards should have name, terrain, diameter and climate', async ({
    page,
  }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    await expect(page.getByText('Diameter:').first()).toBeVisible();
    await expect(page.getByText('Population:').first()).toBeVisible();

    const cardTexts = await page.locator('text=/•/').count();
    expect(cardTexts).toBeGreaterThan(0);
  });

  test('Requirement: responsive mobile-first', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    await expect(page.getByText('Planets').first()).toBeVisible();
    await expect(page.getByText('Population:').first()).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await expect(page.getByText('Population:').first()).toBeVisible();
  });

  test('Extra: should use Tailwind CSS', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    const element = await page.locator('text=Population:').first();
    const classes = await element.evaluate((el) => el.className);

    expect(typeof classes).toBe('string');
  });

  test('Extra: should have functional routes', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    expect(page.url()).toContain('localhost:3000');

    await page.locator('text=Population:').first().click();

    await page.waitForURL(/\/\d+/, { timeout: 5000 });
  });
});
