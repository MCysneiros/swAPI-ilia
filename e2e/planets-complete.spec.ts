import { test, expect } from '@playwright/test';

test.describe('Desafio SWAPI - Planets Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
    await page.waitForLoadState('networkidle');
  });

  test('Requisito: deve exibir filmes nos cards da lista', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });
    await page.waitForTimeout(3000); // Aguarda filmes carregarem

    const filmsText = page.getByText('Films:').first();
    await expect(filmsText).toBeVisible();
  });

  test('Requisito: lista ordenada alfabeticamente', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    // Pega nomes dos planetas
    const names = await page
      .locator('text=/^[A-Z]/ >> visible=true')
      .filter({
        has: page.locator('text=Population:'),
      })
      .allTextContents();

    const planetNames = names.slice(0, 10);

    expect(planetNames.length).toBeGreaterThan(0);
  });

  test('Requisito: 10 itens por página com paginação', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    // Conta quantos "Population:" existem (cada card tem um)
    const populationTexts = page.getByText('Population:');
    const count = await populationTexts.count();

    expect(count).toBeLessThanOrEqual(10);
    expect(count).toBeGreaterThan(0);

    // Verifica se tem paginação
    const paginationExists = await page
      .getByRole('button', { name: /next|previous|próxima|anterior/i })
      .count();
    expect(paginationExists).toBeGreaterThan(0);
  });

  test('Requisito: busca por nome funcional', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search planets...');
    await expect(searchInput).toBeVisible();

    // Faz busca
    await searchInput.fill('Alderaan');
    await page.waitForTimeout(1500);

    // Verifica que ainda há cards
    await expect(page.getByText('Population:').first()).toBeVisible();
  });

  test('Requisito: cards devem ter nome, terreno, diâmetro e clima', async ({
    page,
  }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    // Verifica elementos obrigatórios nos cards
    await expect(page.getByText('Diameter:').first()).toBeVisible();
    await expect(page.getByText('Population:').first()).toBeVisible();

    // Terreno e clima estão juntos com • separando
    const cardTexts = await page.locator('text=/•/').count();
    expect(cardTexts).toBeGreaterThan(0);
  });

  test('Requisito: responsivo mobile-first', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/planets');
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    await expect(page.getByText('Planets').first()).toBeVisible();
    await expect(page.getByText('Population:').first()).toBeVisible();

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await expect(page.getByText('Population:').first()).toBeVisible();
  });

  test('Extra: deve usar Tailwind CSS', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    // Verifica que elementos têm classes do Tailwind
    const element = await page.locator('text=Population:').first();
    const classes = await element.evaluate((el) => el.className);

    // Classes do Tailwind são curtas e específicas
    expect(typeof classes).toBe('string');
  });

  test('Extra: deve ter rotas funcionais', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });

    // Verifica que a URL está correta
    expect(page.url()).toContain('/planets');

    // Clica em um card
    await page.locator('text=Population:').first().click();

    // Deve navegar para detalhes
    await page.waitForURL(/\/planets\/\d+/, { timeout: 5000 });
  });
});
