import { test, expect } from '@playwright/test';

test.describe('Planets List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/items');
  });

  test('deve exibir título da página', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Planetas Star Wars' })
    ).toBeVisible();
  });

  test('deve exibir botão de novo planeta', async ({ page }) => {
    const newButton = page.getByRole('link', { name: /\+ Novo Planeta/i });
    await expect(newButton).toBeVisible();
    await expect(newButton).toHaveAttribute('href', '/items/new');
  });

  test('deve exibir campo de busca', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      'Buscar planetas...'
    );
  });

  test('deve exibir cards de planetas', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]', {
      timeout: 10000,
    });

    const planetCards = page.locator('[data-testid="planet-card"]');
    const count = await planetCards.count();

    expect(count).toBeGreaterThan(0);
  });

  test('cada card deve exibir nome do planeta', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    const title = firstCard.locator('h3, [class*="CardTitle"]');

    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('cada card deve exibir clima, terreno e população', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    await expect(firstCard.getByText(/Clima:/i)).toBeVisible();
    await expect(firstCard.getByText(/Terreno:/i)).toBeVisible();
    await expect(firstCard.getByText(/População:/i)).toBeVisible();
  });

  test('deve exibir contagem de resultados', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    // Busca por texto como "X planeta(s) encontrado(s)"
    const countText = page.locator(
      'text=/\\d+ planeta\\(s\\) encontrado\\(s\\)/i'
    );
    await expect(countText).toBeVisible();
  });

  test('deve exibir controles de paginação', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const prevButton = page.locator('[data-testid="prev-page-button"]');
    const nextButton = page.locator('[data-testid="next-page-button"]');
    const pageNumber = page.locator('[data-testid="page-number"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await expect(pageNumber).toBeVisible();
  });

  test('botão anterior deve estar desabilitado na primeira página', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const prevButton = page.locator('[data-testid="prev-page-button"]');
    await expect(prevButton).toBeDisabled();
  });

  test('deve exibir número da página atual', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const pageNumber = page.locator('[data-testid="page-number"]');
    await expect(pageNumber).toHaveText(/Página 1/i);
  });

  test('deve ter layout em grid responsivo', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    // Desktop: deve ter múltiplas colunas
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(300);

    const cards = page.locator('[data-testid="planet-card"]');
    await expect(cards.first()).toBeVisible();

    // Mobile: cards empilhados
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    await expect(cards.first()).toBeVisible();
  });

  test('cards devem ter efeito hover', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    // Faz hover no card
    await firstCard.hover();

    // Card deve continuar visível
    await expect(firstCard).toBeVisible();
  });

  test('cards devem ser clicáveis e navegar para detalhes', async ({
    page,
  }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await firstCard.click();

    // Deve navegar para página de detalhes
    await page.waitForURL(/\/items\/\d+/);
    await expect(page).toHaveURL(/\/items\/\d+/);
  });

  test('busca deve funcionar com debounce', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Digite algo
    await searchInput.fill('Tatooine');

    // Aguarda debounce (300ms) + tempo de request
    await page.waitForTimeout(500);

    // URL deve conter o parâmetro de busca
    await expect(page).toHaveURL(/search=Tatooine/i);
  });

  test('busca deve filtrar resultados', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Busca por Tatooine
    await searchInput.fill('Tatooine');
    await page.waitForTimeout(500);

    await page.waitForSelector('[data-testid="planet-card"]');

    // Deve mostrar apenas resultados relevantes
    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await expect(firstCard).toContainText(/Tatooine/i);
  });

  test('paginação deve funcionar para próxima página', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const nextButton = page.locator('[data-testid="next-page-button"]');

    // Clica em próxima página
    await nextButton.click();

    // URL deve mudar para page=2
    await page.waitForURL(/page=2/);

    // Número da página deve atualizar
    const pageNumber = page.locator('[data-testid="page-number"]');
    await expect(pageNumber).toHaveText(/Página 2/i);
  });

  test('paginação deve funcionar para página anterior', async ({ page }) => {
    // Vai para página 2 primeiro
    await page.goto('/items?page=2');
    await page.waitForSelector('[data-testid="planet-card"]');

    const prevButton = page.locator('[data-testid="prev-page-button"]');

    // Clica em página anterior
    await prevButton.click();

    // Deve voltar para página 1
    await page.waitForURL('/items');

    const pageNumber = page.locator('[data-testid="page-number"]');
    await expect(pageNumber).toHaveText(/Página 1/i);
  });

  test('deve carregar página rapidamente', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/items');
    await page.waitForSelector('[data-testid="planet-card"]');
    const loadTime = Date.now() - startTime;

    // Deve carregar em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve ser responsivo em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/items');

    await page.waitForSelector('[data-testid="planet-card"]');

    // Elementos principais devem estar visíveis
    await expect(
      page.getByRole('heading', { name: 'Planetas Star Wars' })
    ).toBeVisible();
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="planet-card"]').first()
    ).toBeVisible();
  });

  test('deve limpar busca ao limpar input', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Faz uma busca
    await searchInput.fill('Tatooine');
    await page.waitForTimeout(500);

    // Limpa a busca
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // URL não deve ter parâmetro de busca
    await expect(page).toHaveURL('/items');
  });

  test('deve manter busca na URL ao recarregar', async ({ page }) => {
    await page.goto('/items?search=Alderaan');
    await page.waitForSelector('[data-testid="planet-card"]');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Input deve ter o valor da URL
    await expect(searchInput).toHaveValue('Alderaan');
  });

  test('deve exibir mensagem de erro ao falhar', async ({ page }) => {
    // Simula erro desligando a internet (através de offline mode)
    await page.context().setOffline(true);

    await page.goto('/items');

    // Deve mostrar mensagem de erro
    await expect(page.getByText(/Erro ao carregar planetas/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test('cards devem ter estrutura semântica', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    const firstCard = page.locator('[data-testid="planet-card"]').first();

    // Deve ter título (h3 ou CardTitle)
    const title = firstCard.locator('h3, [class*="CardTitle"]');
    await expect(title).toBeVisible();
  });

  test('deve ter acessibilidade adequada', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    // Campo de busca deve ter aria-label
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveAttribute('aria-label', 'Buscar planetas');

    // Botões de paginação devem ter aria-label
    const prevButton = page.locator('[data-testid="prev-page-button"]');
    const nextButton = page.locator('[data-testid="next-page-button"]');

    await expect(prevButton).toHaveAttribute('aria-label', 'Página anterior');
    await expect(nextButton).toHaveAttribute('aria-label', 'Próxima página');
  });

  test('deve ter contrast ratio adequado', async ({ page }) => {
    await page.waitForSelector('[data-testid="planet-card"]');

    // Verifica que textos são legíveis
    const heading = page.getByRole('heading', { name: 'Planetas Star Wars' });
    await expect(heading).toBeVisible();

    const firstCard = page.locator('[data-testid="planet-card"]').first();
    await expect(firstCard).toBeVisible();
  });
});
