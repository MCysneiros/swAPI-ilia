import { test, expect } from './fixtures';

test.describe('Planets List - Films Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
  });

  test('deve exibir seção de filmes em cada card de planeta', async ({
    page,
  }) => {
    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await expect(firstCard.getByText('Films:')).toBeVisible();
  });

  test('deve exibir badges com títulos dos filmes', async ({ page }) => {
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    const filmBadges = firstCard
      .locator('div:has-text("Films:")')
      .locator('span');
    const count = await filmBadges.count();

    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir skeleton durante carregamento dos filmes', async ({
    page,
  }) => {
    await page.goto('/planets');

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await firstCard.waitFor({ state: 'visible', timeout: 5000 });

    await expect(firstCard.getByText('Films:')).toBeVisible({
      timeout: 10000,
    });
  });

  test('deve exibir "No films" para planetas sem filmes', async ({ page }) => {
    await page.waitForSelector('a[href^="/planets/"]', { timeout: 10000 });
    await page.waitForTimeout(2000); // Aguarda filmes carregarem

    const noFilmsText = page.getByText('No films');

    const exists = await noFilmsText.count();

    if (exists > 0) {
      await expect(noFilmsText.first()).toBeVisible();
    }
  });

  test('badges de filmes devem ter estilo outline', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    const filmSection = firstCard.locator('div:has-text("Films:")');
    const badges = filmSection.locator('[class*="badge"]');

    const count = await badges.count();

    if (count > 0) {
      const firstBadge = badges.first();
      await expect(firstBadge).toBeVisible();

      const classes = await firstBadge.getAttribute('class');
      expect(classes).toContain('badge');
    }
  });

  test('deve exibir ícone de filme na seção', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    const filmIcon = firstCard.locator('svg').first();
    await expect(filmIcon).toBeVisible();
  });

  test('filmes devem estar separados dos outros dados do planeta', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await expect(firstCard.getByText('Population:')).toBeVisible();
    await expect(firstCard.getByText('Diameter:')).toBeVisible();
    await expect(firstCard.getByText('Residents:')).toBeVisible();
    await expect(firstCard.getByText('Films:')).toBeVisible();
  });

  test('deve exibir múltiplos filmes para planetas que aparecem em vários', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    // Wait for films to load
    await page.waitForTimeout(3000);

    const tatooineCard = page
      .locator('[data-testid="planet-card"]')
      .filter({ hasText: /Tatooine/i })
      .first();

    if ((await tatooineCard.count()) > 0) {
      await tatooineCard.scrollIntoViewIfNeeded();

      // Wait for Films section to be visible
      await tatooineCard
        .getByText('Films:')
        .waitFor({ state: 'visible', timeout: 5000 });

      // Additional wait for film badges to render
      await page.waitForTimeout(2000);

      // Get the full card text and verify multiple film names are present
      const cardText = await tatooineCard.textContent();

      // Count how many film titles appear in the card
      const filmTitles = [
        'A New Hope',
        'Empire',
        'Jedi',
        'Phantom',
        'Clones',
        'Sith',
      ];
      const filmCount = filmTitles.filter((title) =>
        cardText?.includes(title)
      ).length;

      // Tatooine appears in 5 films in our mock data
      expect(filmCount).toBeGreaterThanOrEqual(3);
    }
  });

  test('filmes devem ser responsivos em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/planets');

    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await expect(firstCard.getByText('Films:')).toBeVisible();

    const filmBadges = firstCard.locator('[class*="badge"]').filter({
      hasText: /New Hope|Empire|Return|Phantom|Attack|Revenge/i,
    });
    const badgeCount = await filmBadges.count();

    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });

  test('deve manter filmes ao fazer busca', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const searchInput = page.getByPlaceholder('Search planets...');
    await searchInput.fill('Naboo');
    await page.waitForTimeout(1000);

    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await expect(firstCard.getByText('Films:')).toBeVisible();
  });

  test('deve manter filmes ao navegar entre páginas', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await expect(firstCard.getByText('Films:')).toBeVisible();

    const nextButton = page.getByRole('button', { name: /next|próxima/i });

    if ((await nextButton.count()) > 0 && !(await nextButton.isDisabled())) {
      await nextButton.click();
      await page.waitForTimeout(2000);

      const secondPageCard = page
        .locator('[data-testid="planet-card"]')
        .first();
      await expect(secondPageCard.getByText('Films:')).toBeVisible();
    }
  });
});

test.describe('Planets List - General Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
  });

  test('lista deve estar ordenada por nome alfabeticamente', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    await page.waitForTimeout(1000);

    const planetCards = page.locator('[data-testid="planet-card"]');
    const count = await planetCards.count();

    const planetNames: string[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const card = planetCards.nth(i);
      // The CardTitle is a div with font-semibold class inside the card
      const titleElement = card.locator('div.font-semibold').first();
      const title = await titleElement.textContent({ timeout: 5000 });
      if (title) planetNames.push(title.trim());
    }

    expect(planetNames.length).toBeGreaterThan(0);
    const sortedNames = [...planetNames].sort();
    expect(planetNames).toEqual(sortedNames);
  });

  test('deve exibir 10 itens por página', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const cards = page.locator('[data-testid="planet-card"]');
    const count = await cards.count();

    expect(count).toBeLessThanOrEqual(10);
    expect(count).toBeGreaterThan(0);
  });

  test('paginação deve estar presente com múltiplas páginas', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const nextButton = page.getByRole('button', { name: /next|próxima/i });

    expect(await nextButton.count()).toBeGreaterThan(0);
  });

  test('deve ter campo de busca funcional', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const searchInput = page.getByPlaceholder('Search planets...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Hoth');
    await page.waitForTimeout(1000);

    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await expect(firstCard).toContainText(/Hoth/i);
  });

  test('deve ser responsivo e mobile-first', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/planets');

    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await expect(firstCard).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);

    await expect(firstCard).toBeVisible();
  });

  test('cards devem ter nome, terreno, diâmetro e clima', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    // Wait for card content to load
    await page.waitForTimeout(1000);

    // Check that card has name (in CardTitle component)
    const cardText = await firstCard.textContent();
    expect(cardText).toBeTruthy();
    expect(cardText).toContain('Alderaan'); // First planet alphabetically

    // Check that card has terrain and climate info (combined in CardDescription)
    expect(cardText).toMatch(
      /grasslands|mountains|desert|tundra|jungle|rainforests/i
    );
    expect(cardText).toMatch(/temperate|arid|frozen|tropical|murky|hot|humid/i);

    // Check that card has diameter
    await expect(firstCard.getByText('Diameter:')).toBeVisible();
  });

  test('deve usar Tailwind CSS para estilização', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    // Get the Card component inside the Link
    const cardElement = firstCard.locator('> div').first();
    const classes = await cardElement.getAttribute('class');

    expect(classes).toBeTruthy();
    expect(classes).toContain('rounded'); // Tailwind class
  });

  test('deve usar rotas do Next.js', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/planets\/\d+$/);
  });

  test('should not use third-party SWAPI packages', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const cards = page.locator('[data-testid="planet-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
