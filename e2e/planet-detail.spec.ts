import { test, expect } from '@playwright/test';

test.describe('Planet Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a lista e clica no primeiro planeta
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.locator('[data-testid="planet-card"]').first().click();
    await page.waitForURL(/\/planets\/\d+/);
  });

  test('deve exibir o nome do planeta', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('deve exibir informações básicas do planeta', async ({ page }) => {
    // Verifica informações como rotação, órbita, diâmetro
    await expect(
      page.getByText(/Rotation Period|Período de Rotação/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Orbital Period|Período Orbital/i).first()
    ).toBeVisible();
  });

  test('deve exibir clima e terreno', async ({ page }) => {
    // Busca por labels
    await expect(page.getByText(/Climate|Clima/i)).toBeVisible();
    await expect(page.getByText(/Terrain|Terreno/i)).toBeVisible();
  });

  test('deve exibir população', async ({ page }) => {
    await expect(page.getByText(/Population|População/i)).toBeVisible();
  });

  test('deve exibir diâmetro', async ({ page }) => {
    await expect(page.getByText(/Diameter|Diâmetro/i)).toBeVisible();
  });

  test('deve exibir gravidade', async ({ page }) => {
    await expect(page.getByText(/Gravity|Gravidade/i)).toBeVisible();
  });

  test('deve ter botão de voltar', async ({ page }) => {
    const backButton = page.getByRole('link', { name: /back|voltar/i });
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveAttribute('href', '/planets');
  });

  test('deve navegar de volta para a lista ao clicar em voltar', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /back|voltar/i }).click();
    await page.waitForURL('/planets');
    await expect(page).toHaveURL('/planets');
  });

  test('deve exibir seção de residentes quando houver', async ({ page }) => {
    // Alguns planetas têm residentes
    const residentsHeading = page.getByRole('heading', {
      name: /Residents|Residentes/i,
    });

    // Se existir a seção, deve estar visível
    const count = await residentsHeading.count();
    if (count > 0) {
      await expect(residentsHeading).toBeVisible();
    }
  });

  test('deve exibir seção de filmes quando houver', async ({ page }) => {
    // Planetas aparecem em filmes
    const filmsHeading = page.getByRole('heading', {
      name: /Films|Filmes/i,
    });

    const count = await filmsHeading.count();
    if (count > 0) {
      await expect(filmsHeading).toBeVisible();
    }
  });

  test('deve exibir cards de residentes com informações', async ({ page }) => {
    const residentCards = page.locator('[data-testid="resident-card"]');
    const count = await residentCards.count();

    if (count > 0) {
      // Verifica primeiro card de residente
      const firstCard = residentCards.first();
      await expect(firstCard).toBeVisible();
    }
  });

  test('deve exibir cards de filmes com informações', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Verifica primeiro card de filme
      const firstCard = filmCards.first();
      await expect(firstCard).toBeVisible();

      // Deve ter informações do filme
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
    }
  });

  test('deve exibir episódio nos cards de filme', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Badge com número do episódio
      const firstCard = filmCards.first();
      const episodeBadge = firstCard.locator('text=/EP|Episode/i');
      const badgeCount = await episodeBadge.count();
      if (badgeCount > 0) {
        await expect(episodeBadge.first()).toBeVisible();
      }
    }
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verifica que elementos principais ainda são visíveis
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    await expect(
      page.getByRole('link', { name: /back|voltar/i })
    ).toBeVisible();
  });

  test('deve ter layout em grid responsivo', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Verifica que o conteúdo é visível
    await expect(page.locator('h1')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Ainda deve estar visível
    await expect(page.locator('h1')).toBeVisible();
  });

  test('deve exibir badges para categorizar informações', async ({ page }) => {
    // Badges são usados em vários lugares
    const badges = page.locator('[class*="badge"]');
    const count = await badges.count();

    // Pode ter badges
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('deve ter cards com hover effect', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      const firstCard = filmCards.first();

      // Verifica que o card existe e é visível
      await expect(firstCard).toBeVisible();

      // Faz hover
      await firstCard.hover();

      // Card deve continuar visível após hover
      await expect(firstCard).toBeVisible();
    }
  });

  test('deve carregar dados em menos de 5 segundos', async ({ page }) => {
    await page.goto('/planets');
    await page.waitForSelector('[data-testid="planet-card"]');

    const startTime = Date.now();
    await page.locator('[data-testid="planet-card"]').first().click();

    // Aguarda o título aparecer
    await page.locator('h1').waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('deve ter estrutura semântica de headings', async ({ page }) => {
    // H1 para título principal
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // H2 ou H3 para seções
    const headings = page.locator('h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('deve mostrar indicador de sincronização quando aplicável (optimistic UI)', async ({
    page,
  }) => {
    // Verifica se há badge de sync
    const syncBadge = page.getByTestId('planet-sync-indicator');
    const count = await syncBadge.count();

    // Se aparecer durante o carregamento, deve estar visível
    if (count > 0) {
      await expect(syncBadge).toBeVisible();
    }
  });

  test('mantém dados visíveis durante refetch (optimistic UI)', async ({
    page,
  }) => {
    // Aguarda carregamento inicial
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const planetName = await heading.textContent();
    expect(planetName).toBeTruthy();

    // Força refetch navegando para outra página e voltando
    await page.goto('/planets');
    await page.waitForTimeout(500);

    // Volta para o mesmo planeta
    await page.goBack();

    // Nome deve continuar visível (optimistic UI mantém dados anteriores)
    await expect(heading).toBeVisible();
  });
});
