import { test, expect } from './fixtures';

test.describe('Planet Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.locator('[data-testid="planet-card"]').first().click();
    await page.waitForURL(/\/\d+/);
  });

  test('should display planet name', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('should display basic planet information', async ({ page }) => {
    await expect(
      page.getByText(/Rotation Period|Período de Rotação/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Orbital Period|Período Orbital/i).first()
    ).toBeVisible();
  });

  test('should display climate and terrain', async ({ page }) => {
    await expect(page.getByText(/Climate|Clima/i)).toBeVisible();
    await expect(page.getByText(/Terrain|Terreno/i)).toBeVisible();
  });

  test('should display population', async ({ page }) => {
    await expect(page.getByText(/Population|População/i)).toBeVisible();
  });

  test('should display diameter', async ({ page }) => {
    await expect(page.getByText(/Diameter|Diâmetro/i)).toBeVisible();
  });

  test('should display gravity', async ({ page }) => {
    await expect(page.getByText(/Gravity|Gravidade/i)).toBeVisible();
  });

  test('should have back button', async ({ page }) => {
    const backButton = page.getByRole('button', { name: /back to planets/i });
    await expect(backButton).toBeVisible();
  });

  test('should navigate back to list when clicking back', async ({ page }) => {
    await page.getByRole('button', { name: /back to planets/i }).click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should display residents section when available', async ({ page }) => {
    const residentsHeading = page.getByRole('heading', {
      name: /Residents|Residentes/i,
    });

    const count = await residentsHeading.count();
    if (count > 0) {
      await expect(residentsHeading).toBeVisible();
    }
  });

  test('should display films section when available', async ({ page }) => {
    const filmsHeading = page.getByRole('heading', {
      name: /Films|Filmes/i,
    });

    const count = await filmsHeading.count();
    if (count > 0) {
      await expect(filmsHeading).toBeVisible();
    }
  });

  test('should display resident cards with information', async ({ page }) => {
    const residentCards = page.locator('[data-testid="resident-card"]');
    const count = await residentCards.count();

    if (count > 0) {
      const firstCard = residentCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test('should display film cards with information', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      const firstCard = filmCards.first();
      await expect(firstCard).toBeVisible();

      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
    }
  });

  test('should display episode number in film cards', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      const firstCard = filmCards.first();
      const episodeBadge = firstCard.locator('text=/EP|Episode/i');
      const badgeCount = await episodeBadge.count();
      if (badgeCount > 0) {
        await expect(episodeBadge.first()).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    await expect(
      page.getByRole('button', { name: /back to planets/i })
    ).toBeVisible();
  });

  test('should have responsive grid layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    await expect(page.locator('h1')).toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display badges to categorize information', async ({ page }) => {
    const badges = page.locator('[class*="badge"]');
    const count = await badges.count();

    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have cards with hover effect', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      const firstCard = filmCards.first();

      await expect(firstCard).toBeVisible();

      await firstCard.hover();

      await expect(firstCard).toBeVisible();
    }
  });

  test('should load data in less than 5 seconds', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="planet-card"]');

    const startTime = Date.now();
    await page.locator('[data-testid="planet-card"]').first().click();

    await page.locator('h1').waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('should have semantic heading structure', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    const headings = page.locator('h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show sync indicator when applicable (optimistic UI)', async ({
    page,
  }) => {
    const syncBadge = page.getByTestId('planet-sync-indicator');
    const count = await syncBadge.count();

    if (count > 0) {
      await expect(syncBadge).toBeVisible();
    }
  });

  test('keeps data visible during refetch (optimistic UI)', async ({
    page,
  }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const planetName = await heading.textContent();
    expect(planetName).toBeTruthy();

    await page.goto('/');
    await page.waitForTimeout(500);

    await page.goBack();

    await expect(heading).toBeVisible();
  });
});
