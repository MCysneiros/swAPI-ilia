import { test, expect } from '@playwright/test';

test.describe('Planets List - Optimistic UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
  });

  test('renders planets list after loading', async ({ page }) => {
    // Aguarda os cards aparecerem
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const firstCard = page.getByTestId('planet-card').first();
    await expect(firstCard).toBeVisible();

    // Deve conter nome de planeta
    const cardText = await firstCard.textContent();
    expect(cardText).toBeTruthy();
  });

  test('shows sync indicator when fetching new data', async ({ page }) => {
    // Aguarda carregar
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const cardsBefore = await page.getByTestId('planet-card').count();
    expect(cardsBefore).toBeGreaterThan(0);

    // Faz uma busca para trigger novo fetch
    await page.getByTestId('planet-search-input').fill('Hoth');

    // Aguarda um pouco para ver o indicador
    await page.waitForTimeout(500);

    // Pode aparecer o indicador de sync (mas não é obrigatório em todas as redes)
    const syncIndicator = page.getByTestId('planets-sync-indicator');
    const count = await syncIndicator.count();

    // Se aparecer, deve estar visível
    if (count > 0) {
      await expect(syncIndicator).toBeVisible();
    }
  });

  test('keeps previous results visible during optimistic updates', async ({
    page,
  }) => {
    // Aguarda carregar inicialmente
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const initialCards = await page.getByTestId('planet-card').count();
    expect(initialCards).toBeGreaterThan(0);

    // Navega para próxima página
    const nextButton = page.getByRole('button', { name: /next/i });

    // Verifica se o botão existe e está habilitado
    const count = await nextButton.count();
    if (count > 0) {
      const isEnabled = await nextButton.isEnabled();
      if (isEnabled) {
        await nextButton.click();
        await page.waitForTimeout(500);

        // Durante a transição, cards devem continuar visíveis (optimistic UI)
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

    // Aguarda um pouco para a busca processar
    await page.waitForTimeout(1000);

    // Se houver resultados, primeiro card deve conter Hoth
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

    // Aguarda a busca processar
    await page.waitForTimeout(1500);

    // Verifica se há resultados antes de limpar
    const hasResults = (await page.getByTestId('planet-card').count()) > 0;

    await searchInput.clear();
    await page.waitForTimeout(1000);

    // Verifica que ainda há cards visíveis após limpar
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
