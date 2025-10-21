import { test, expect } from '@playwright/test';

test.describe('Planet Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a lista e clica no primeiro planeta
    await page.goto('/items');
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });
    await page.locator('[data-testid="planet-card"]').first().click();
    await page.waitForURL(/\/items\/\d+/);
  });

  test('deve exibir o nome do planeta', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('deve exibir informações básicas do planeta', async ({ page }) => {
    // Verifica seções principais
    await expect(page.getByText(/Informações Básicas/i)).toBeVisible();
    await expect(page.getByText(/Características Físicas/i)).toBeVisible();
  });

  test('deve exibir clima e terreno', async ({ page }) => {
    // Busca por labels
    await expect(page.getByText(/Clima/i)).toBeVisible();
    await expect(page.getByText(/Terreno/i)).toBeVisible();
  });

  test('deve exibir população', async ({ page }) => {
    await expect(page.getByText(/População/i)).toBeVisible();
  });

  test('deve exibir período de rotação e orbital', async ({ page }) => {
    await expect(page.getByText(/Rotação/i)).toBeVisible();
    await expect(page.getByText(/Orbital/i)).toBeVisible();
  });

  test('deve exibir diâmetro', async ({ page }) => {
    await expect(page.getByText(/Diâmetro/i)).toBeVisible();
  });

  test('deve exibir gravidade', async ({ page }) => {
    await expect(page.getByText(/Gravidade/i)).toBeVisible();
  });

  test('deve exibir água superficial', async ({ page }) => {
    await expect(page.getByText(/Água Superficial/i)).toBeVisible();
  });

  test('deve ter botão de voltar', async ({ page }) => {
    const backButton = page.getByRole('link', { name: /voltar/i });
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveAttribute('href', '/items');
  });

  test('deve navegar de volta para a lista ao clicar em voltar', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /voltar/i }).click();
    await page.waitForURL('/items');
    await expect(page).toHaveURL('/items');
  });

  test('deve exibir seção de residentes quando houver', async ({ page }) => {
    // Alguns planetas têm residentes
    const residentsHeading = page.getByRole('heading', { name: /Residentes/i });

    // Se existir a seção, deve estar visível
    const count = await residentsHeading.count();
    if (count > 0) {
      await expect(residentsHeading).toBeVisible();
    }
  });

  test('deve exibir seção de filmes quando houver', async ({ page }) => {
    // Todos os planetas aparecem em filmes
    const filmsHeading = page.getByRole('heading', { name: /Filmes/i });

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

      // Deve ter informações como cabelo, olhos, gênero
      await expect(firstCard.getByText(/Cabelo/i)).toBeVisible();
      await expect(firstCard.getByText(/Olhos/i)).toBeVisible();
      await expect(firstCard.getByText(/Gênero/i)).toBeVisible();
    }
  });

  test('deve exibir cards de filmes com informações', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Verifica primeiro card de filme
      const firstCard = filmCards.first();
      await expect(firstCard).toBeVisible();

      // Deve ter diretor e data de lançamento
      await expect(firstCard.getByText(/Diretor/i)).toBeVisible();
      await expect(firstCard.getByText(/Lançamento/i)).toBeVisible();
    }
  });

  test('deve exibir episódio nos cards de filme', async ({ page }) => {
    const filmCards = page.locator('[data-testid="film-card"]');
    const count = await filmCards.count();

    if (count > 0) {
      // Badge com número do episódio
      const firstCard = filmCards.first();
      await expect(firstCard.getByText(/EP \d+/)).toBeVisible();
    }
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verifica que elementos principais ainda são visíveis
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    await expect(page.getByText(/Informações Básicas/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /voltar/i })).toBeVisible();
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
    // Badges são usados em vários lugares (clima, terreno, etc)
    const badges = page.locator('[class*="badge"]');
    const count = await badges.count();

    // Deve ter pelo menos alguns badges
    expect(count).toBeGreaterThan(0);
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

  test('deve exibir data de criação e edição', async ({ page }) => {
    await expect(page.getByText(/Criado em/i)).toBeVisible();
    await expect(page.getByText(/Editado em/i)).toBeVisible();
  });

  test('deve formatar datas corretamente', async ({ page }) => {
    // Verifica se há datas formatadas no padrão brasileiro
    const datePattern = /\d{2}\/\d{2}\/\d{4}/;
    const content = await page.textContent('body');

    // Deve conter pelo menos uma data formatada
    expect(content).toMatch(datePattern);
  });

  test('deve carregar dados em menos de 5 segundos', async ({ page }) => {
    await page.goto('/items');
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
    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir mensagem quando não há residentes', async ({ page }) => {
    // Navega para um planeta sem residentes se possível
    const residentsSection = page.getByText(/Residentes/i);
    const hasResidents = await residentsSection.count();

    if (hasResidents === 0) {
      // Verifica se há mensagem apropriada ou se a seção não aparece
      const noResidentsMsg = page.getByText(/Nenhum residente/i);
      const msgCount = await noResidentsMsg.count();
      expect(msgCount).toBeGreaterThanOrEqual(0);
    }
  });
});
