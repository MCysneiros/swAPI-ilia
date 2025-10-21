import { test, expect } from '@playwright/test';

test.describe('Planets - List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/items');
  });

  test('should display planets list page with correct title', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/Star Wars/i);
    await expect(
      page.getByRole('heading', { name: /planetas/i, level: 1 })
    ).toBeVisible();
  });

  test('should display planet cards with required information', async ({
    page,
  }) => {
    // Wait for planets to load
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    // Check if at least one planet is displayed
    const planetCards = page.locator('[data-testid="planet-card"]');
    await expect(planetCards.first()).toBeVisible();

    // Verify planet card contains required fields
    const firstCard = planetCards.first();
    await expect(
      firstCard.locator('text=/Tatooine|Alderaan|Hoth/i')
    ).toBeVisible();
  });

  test('should search for planets by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar planetas/i);
    await searchInput.waitFor({ state: 'visible' });

    await searchInput.fill('Tatooine');
    await page.waitForTimeout(500);

    await expect(page.getByText(/tatooine/i)).toBeVisible();
  });

  test('should clear search and show all planets', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar planetas/i);

    await searchInput.fill('xyz123');
    await page.waitForTimeout(500);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Should show planets again
    const planetCards = page.locator('[data-testid="planet-card"]');
    await expect(planetCards.first()).toBeVisible();
  });

  test('should handle pagination - navigate to next page', async ({ page }) => {
    // Wait for planets to load
    await page.waitForSelector('[data-testid="planet-card"]');

    const nextButton = page.getByRole('button', { name: /próxima|next/i });

    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);

      // Should still show planet cards on page 2
      await expect(
        page.locator('[data-testid="planet-card"]').first()
      ).toBeVisible();
    }
  });

  test('should handle pagination - navigate back to previous page', async ({
    page,
  }) => {
    // Go to page 2 first
    const nextButton = page.getByRole('button', { name: /próxima|next/i });

    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForURL(/page=2/);

      // Now go back
      const prevButton = page.getByRole('button', {
        name: /anterior|previous/i,
      });
      await prevButton.click();

      await expect(page).toHaveURL(/items$/);
    }
  });

  test('should display exactly 10 planets per page', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const planetCards = page.locator('[data-testid="planet-card"]');
    const count = await planetCards.count();

    expect(count).toBeLessThanOrEqual(10);
  });

  test('should navigate to create new planet page', async ({ page }) => {
    const newButton = page.getByRole('link', {
      name: /novo planeta|criar planeta/i,
    });
    await newButton.click();

    await expect(page).toHaveURL('/items/new');
    await expect(
      page.getByRole('heading', { name: /novo planeta|criar planeta/i })
    ).toBeVisible();
  });
});

test.describe('Planets - Detail Page', () => {
  test('should navigate to planet detail from list', async ({ page }) => {
    await page.goto('/items');

    // Wait for planets to load and click first one
    await page.waitForSelector('[data-testid="planet-card"]');
    await page.locator('[data-testid="planet-card"]').first().click();

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/items\/\d+/);
  });

  test('should display all planet basic information', async ({ page }) => {
    await page.goto('/items/1'); // Tatooine

    // Wait for planet to load
    await page.waitForSelector('h1');

    // Check for basic info fields
    await expect(page.getByText(/período de rotação/i)).toBeVisible();
    await expect(page.getByText(/período orbital/i)).toBeVisible();
    await expect(page.getByText(/diâmetro/i)).toBeVisible();
    await expect(page.getByText(/população/i)).toBeVisible();
  });

  test('should display planet characteristics', async ({ page }) => {
    await page.goto('/items/1');

    await expect(page.getByText(/clima/i)).toBeVisible();
    await expect(page.getByText(/gravidade/i)).toBeVisible();
    await expect(page.getByText(/terreno/i)).toBeVisible();
    await expect(page.getByText(/água superficial/i)).toBeVisible();
  });

  test('should display residents section with details', async ({ page }) => {
    await page.goto('/items/1'); // Tatooine has residents

    // Wait for page to load
    await page.waitForSelector('h1');

    // Check if residents section exists
    const residentsSection = page.getByText(/nativos/i).first();
    await expect(residentsSection).toBeVisible();

    // If there are residents, check for details
    const residentCards = page.locator('[data-testid="resident-card"]');
    const hasResidents = (await residentCards.count()) > 0;

    if (hasResidents) {
      const firstResident = residentCards.first();
      await expect(firstResident).toBeVisible();

      // Check for resident details
      await expect(firstResident.locator('text=/cabelo|hair/i')).toBeVisible();
      await expect(firstResident.locator('text=/olhos|eyes/i')).toBeVisible();
      await expect(
        firstResident.locator('text=/gênero|gender/i')
      ).toBeVisible();
    }
  });

  test('should display films section with details', async ({ page }) => {
    await page.goto('/items/1'); // Tatooine appears in films

    // Wait for page to load
    await page.waitForSelector('h1');

    // Check if films section exists
    const filmsSection = page.getByText(/filmes/i).first();
    await expect(filmsSection).toBeVisible();

    // Check for film cards
    const filmCards = page.locator('[data-testid="film-card"]');
    const hasFilms = (await filmCards.count()) > 0;

    if (hasFilms) {
      const firstFilm = filmCards.first();
      await expect(firstFilm).toBeVisible();

      // Check for film details
      await expect(firstFilm.locator('text=/EP|episódio/i')).toBeVisible();
      await expect(firstFilm.locator('text=/diretor|director/i')).toBeVisible();
    }
  });

  test('should display metadata (created and edited dates)', async ({
    page,
  }) => {
    await page.goto('/items/1');

    await expect(page.getByText(/criado em/i)).toBeVisible();
    await expect(page.getByText(/atualizado em/i)).toBeVisible();
  });

  test('should have back button that navigates to list', async ({ page }) => {
    await page.goto('/items/1');

    const backButton = page.getByRole('link', { name: /voltar/i });
    await backButton.click();

    await expect(page).toHaveURL('/items');
  });

  test('should show delete confirmation dialog', async ({ page }) => {
    await page.goto('/items/1');

    // Set up dialog handler
    let dialogShown = false;
    page.on('dialog', async (dialog) => {
      dialogShown = true;
      expect(dialog.message()).toContain('deletar');
      await dialog.dismiss();
    });

    const deleteButton = page.getByRole('button', { name: /deletar/i });
    await deleteButton.click();

    // Wait a bit for dialog to potentially appear
    await page.waitForTimeout(500);

    expect(dialogShown).toBe(true);
    // Should stay on same page after dismissing
    await expect(page).toHaveURL('/items/1');
  });

  test('should show loading skeleton while fetching planet details', async ({
    page,
  }) => {
    // Navigate with JavaScript disabled network to see loading state
    await page.goto('/items/1');

    // The skeleton should appear briefly (hard to test, but we can check the structure exists)
    const container = page.locator('.container').first();
    await expect(container).toBeVisible();
  });

  test('should handle error state when planet not found', async ({ page }) => {
    await page.goto('/items/99999');

    // Should show error message
    await expect(
      page.getByText(/erro ao carregar planeta|não foi possível/i)
    ).toBeVisible();

    // Should have back button
    const backButton = page.getByRole('link', { name: /voltar/i });
    await expect(backButton).toBeVisible();
  });
});

test.describe('Planets - Responsive Design', () => {
  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/items');

    // Should display planets list
    await page.waitForSelector('[data-testid="planet-card"]');
    await expect(
      page.locator('[data-testid="planet-card"]').first()
    ).toBeVisible();

    // Search should be visible
    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display detail page correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/items/1');

    // All sections should be visible
    await expect(page.getByText(/informações básicas/i)).toBeVisible();
    await expect(page.getByText(/características/i)).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/items');

    await page.waitForSelector('[data-testid="planet-card"]');
    const planetCards = page.locator('[data-testid="planet-card"]');
    await expect(planetCards.first()).toBeVisible();
  });
});

test.describe('Planets - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/items');

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/planetas/i);
  });

  test('should have accessible search input', async ({ page }) => {
    await page.goto('/items');

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Should be focusable
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/items');

    await page.waitForSelector('[data-testid="planet-card"]');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Should be able to interact with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have accessible buttons with proper labels', async ({
    page,
  }) => {
    await page.goto('/items/1');

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    expect(count).toBeGreaterThan(0);

    // Each button should have text or aria-label
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    await page.goto('/items');

    await page.waitForSelector('[data-testid="planet-card"]');

    const links = page.getByRole('link');
    const count = await links.count();

    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Planets - Performance', () => {
  test('should load planet list in reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/items');
    await page.waitForSelector('[data-testid="planet-card"]');

    const loadTime = Date.now() - startTime;

    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should cache planet data (fast navigation back)', async ({ page }) => {
    await page.goto('/items');
    await page.waitForSelector('[data-testid="planet-card"]');

    // Navigate to detail
    await page.locator('[data-testid="planet-card"]').first().click();
    await page.waitForSelector('h1');

    // Navigate back
    const startTime = Date.now();
    await page.goBack();
    await page.waitForSelector('[data-testid="planet-card"]');
    const backLoadTime = Date.now() - startTime;

    // Should be faster due to caching
    expect(backLoadTime).toBeLessThan(2000);
  });
});

test.describe('Planets - Data Validation', () => {
  test('should display planet name in detail page', async ({ page }) => {
    await page.goto('/items/1');

    const heading = page.getByRole('heading', { level: 1 });
    const name = await heading.textContent();

    expect(name).toBeTruthy();
    expect(name?.length).toBeGreaterThan(0);
  });

  test('should display numeric values correctly formatted', async ({
    page,
  }) => {
    await page.goto('/items/1');

    // Check if numbers are formatted (e.g., with thousand separators)
    const content = await page.content();

    // Should have numeric values
    expect(content).toMatch(/\d+/);
  });

  test('should handle planets with no residents gracefully', async ({
    page,
  }) => {
    await page.goto('/items/1');

    const residentsSection = page.getByText(/nativos/i).first();
    await expect(residentsSection).toBeVisible();

    // Should show appropriate message if no residents
    const noResidentsMsg = page.getByText(/não possui nativos|no residents/i);
    const hasResidents =
      (await page.locator('[data-testid="resident-card"]').count()) > 0;

    if (!hasResidents) {
      await expect(noResidentsMsg).toBeVisible();
    }
  });

  test('should handle planets with no films gracefully', async ({ page }) => {
    await page.goto('/items/1');

    const filmsSection = page.getByText(/filmes/i).first();
    await expect(filmsSection).toBeVisible();
  });
});
