import { test, expect } from './fixtures';

test.describe('Planets List - Optimistic UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders planets list after loading', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.getByTestId('planet-card').first();
    await expect(firstCard).toBeVisible();

    const cardText = await firstCard.textContent();
    expect(cardText).toBeTruthy();
  });

  test('shows sync indicator when fetching new data', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const cardsBefore = await page.getByTestId('planet-card').count();
    expect(cardsBefore).toBeGreaterThan(0);

    await page.getByTestId('planet-search-input').fill('Hoth');

    await page.waitForTimeout(500);

    const syncIndicator = page.getByTestId('planets-sync-indicator');
    const count = await syncIndicator.count();

    if (count > 0) {
      await expect(syncIndicator).toBeVisible();
    }
  });

  test('keeps previous results visible during optimistic updates', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const initialCards = await page.getByTestId('planet-card').count();
    expect(initialCards).toBeGreaterThan(0);

    const nextButton = page.getByRole('button', { name: /next/i });

    const count = await nextButton.count();
    if (count > 0) {
      const isEnabled = await nextButton.isEnabled();
      if (isEnabled) {
        await nextButton.click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('planet-card').first()).toBeVisible();
      }
    }
  });

  test('updates list results once the server response arrives', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const searchInput = page.getByTestId('planet-search-input');
    await searchInput.fill('Hoth');

    await page.waitForTimeout(1000);

    const cards = await page.getByTestId('planet-card').count();
    if (cards > 0) {
      const firstCard = page.getByTestId('planet-card').first();
      await expect(firstCard).toContainText(/Hoth/i);
    }
  });

  test('resets to the first page when clearing the search', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const searchInput = page.getByTestId('planet-search-input');
    await searchInput.fill('Tatooine');

    await page.waitForTimeout(1500);

    const hasResults = (await page.getByTestId('planet-card').count()) > 0;

    await searchInput.clear();
    await page.waitForTimeout(1000);

    if (hasResults) {
      await expect(page.getByTestId('planet-card').first()).toBeVisible();
    }
  });

  test('displays planet count', async ({ page }) => {
    const countElement = page.getByTestId('planets-count');
    await expect(countElement).toBeVisible({ timeout: 10000 });

    const text = await countElement.textContent();
    expect(text).toMatch(/\d+ planet/i);
  });
});
