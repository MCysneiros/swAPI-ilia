import { test, expect } from '@playwright/test';

test.describe('Planets - List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]');
  });

  test('displays hero information and planet cards', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Planets/i, level: 1 })
    ).toBeVisible();

    const cards = page.getByTestId('planet-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards.first()).toContainText(/Population:/i);
  });

  test('filters planets using the search input', async ({ page }) => {
    const searchInput = page.getByTestId('planet-search-input');
    await searchInput.fill('Tatooine');
    await expect(page).toHaveURL(/search=Tatooine/);

    const firstCard = page.getByTestId('planet-card').first();
    await expect(firstCard).toContainText(/Tatooine/i, { timeout: 5000 });
  });

  test('supports pagination navigation', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: /next/i }).first();

    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);

      const prevButton = page
        .getByRole('button', { name: /previous/i })
        .first();
      await expect(prevButton).toBeEnabled();
    }
  });

  test('navigates to the detail page when a card is clicked', async ({
    page,
  }) => {
    await page.getByTestId('planet-card').first().click();
    await expect(page).toHaveURL(/\/planets\/\d+/);
  });
});

test.describe('Planets - Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets/1');
    await page.waitForSelector('h1');
  });

  test('renders key sections for a planet', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Informações Básicas/i)).toBeVisible();
    await expect(page.getByText(/Características/i)).toBeVisible();
  });

  test('shows residents and films when available', async ({ page }) => {
    const residents = page.getByRole('heading', { name: /Nativos/i });
    if ((await residents.count()) > 0) {
      await expect(residents.first()).toBeVisible();
    }

    const films = page.getByRole('heading', { name: /Filmes/i });
    if ((await films.count()) > 0) {
      await expect(films.first()).toBeVisible();
    }
  });

  test('allows navigating back to the list', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Back to Planets/i });
    await expect(backLink).toHaveAttribute('href', '/planets');

    await backLink.click();
    await expect(page).toHaveURL('/planets');
  });
});
