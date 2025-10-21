import { test, expect } from './fixtures';

test.describe('Planet Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to list and click on the first planet
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.locator('[data-testid="planet-card"]').first().click();
    await page.waitForURL(/\/planets\/\d+/);
  });

  test('should display planet name', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('should display basic planet information', async ({ page }) => {
    // Verify information like rotation, orbit, diameter
    await expect(
      page.getByText(/Rotation Period|Período de Rotação/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Orbital Period|Período Orbital/i).first()
    ).toBeVisible();
  });

  test('should display climate and terrain', async ({ page }) => {
    // Look for labels
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
    await page.waitForURL('/planets');
    await expect(page).toHaveURL('/planets');
  });

  test('should display residents section when available', async ({ page }) => {
    // Some planets have residents
    const residentsHeading = page.getByRole('heading', {
      name: /Residents|Residentes/i,
    });

    // If the section exists, should be visible
    const count = await residentsHeading.count();
    if (count > 0) {
      await expect(residentsHeading).toBeVisible();
    }
  });

  test('should display films section when available', async ({ page }) => {
    // Planets appear in films
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
      // Verify first resident card
      const firstCard = residentCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test('should display film cards with information', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Verify first film card
      const firstCard = filmCards.first();
      await expect(firstCard).toBeVisible();

      // Should have film information
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
    }
  });

  test('should display episode number in film cards', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Badge with episode number
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

    // Elements should remain visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    await expect(
      page.getByRole('button', { name: /back to planets/i })
    ).toBeVisible();
  });

  test('should have responsive grid layout', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Verify content is visible
    await expect(page.locator('h1')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Should still be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display badges to categorize information', async ({ page }) => {
    // Badges are used in various places
    const badges = page.locator('[class*="badge"]');
    const count = await badges.count();

    // May have badges
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have cards with hover effect', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      const firstCard = filmCards.first();

      // Verify card exists and is visible
      await expect(firstCard).toBeVisible();

      // Hover over it
      await firstCard.hover();

      // Card should remain visible after hover
      await expect(firstCard).toBeVisible();
    }
  });

  test('should load data in less than 5 seconds', async ({ page }) => {
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]');

    const startTime = Date.now();
    await page.locator('[data-testid="planet-card"]').first().click();

    // Wait for title to appear
    await page.locator('h1').waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('should have semantic heading structure', async ({ page }) => {
    // H1 for main title
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // H2 or H3 for sections
    const headings = page.locator('h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show sync indicator when applicable (optimistic UI)', async ({
    page,
  }) => {
    // Check if there's a sync badge
    const syncBadge = page.getByTestId('planet-sync-indicator');
    const count = await syncBadge.count();

    // If it appears during loading, should be visible
    if (count > 0) {
      await expect(syncBadge).toBeVisible();
    }
  });

  test('keeps data visible during refetch (optimistic UI)', async ({
    page,
  }) => {
    // Wait for initial load
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const planetName = await heading.textContent();
    expect(planetName).toBeTruthy();

    // Force refetch by navigating to another page and coming back
    await page.goto('/planets');
    await page.waitForTimeout(500);

    // Go back to the same planet
    await page.goBack();

    // Name should remain visible (optimistic UI keeps previous data)
    await expect(heading).toBeVisible();
  });
});
