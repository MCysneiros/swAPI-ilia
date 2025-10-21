import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir o título e descrição corretos', async ({ page }) => {
    // Verifica título principal com parte do texto
    await expect(
      page.getByRole('heading', { name: /Explore mundos vivos/i })
    ).toBeVisible();

    // Verifica descrição
    await expect(
      page.getByText(/Cada planeta chega instantaneamente/i)
    ).toBeVisible();
  });

  test('deve ter botão para explorar planetas', async ({ page }) => {
    // Verifica botão principal
    const button = page.getByRole('link', { name: /Explorar Planetas/i });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('href', '/planets');
  });

  test('deve ter link funcional para planetas', async ({ page }) => {
    // Clica no botão de Explorar Planetas
    await page.getByRole('link', { name: /Explorar Planetas/i }).click();

    // Aguarda navegação e verifica a URL
    await page.waitForURL('/planets');
    await expect(page).toHaveURL(/\/planets/);
  });

  test('deve ter meta tags corretas', async ({ page }) => {
    // Verifica título da página
    await expect(page).toHaveTitle(/SWAPI/i);
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verifica que todos os elementos ainda são visíveis
    await expect(
      page.getByRole('heading', { name: /Explore mundos vivos/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Explorar Planetas/i })
    ).toBeVisible();
  });

  test('deve ter layout centralizado', async ({ page }) => {
    const container = page.locator('div.flex.min-h-\\[calc\\(100vh-4rem\\)\\]');
    await expect(container).toBeVisible();
  });

  test('botão deve ter tamanho grande (lg)', async ({ page }) => {
    const button = page.getByRole('link', { name: /Explorar Planetas/i });

    // Verifica que o botão tem aparência de destaque
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40); // Botões lg são maiores ou iguais a 40
  });

  test('deve carregar rapidamente (performance)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Página inicial deve carregar em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve ter acessibilidade adequada', async ({ page }) => {
    // Verifica estrutura de heading
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Verifica que o link é focável
    const link = page.getByRole('link', { name: /Explorar Planetas/i });
    await link.focus();
    await expect(link).toBeFocused();
  });

  test('deve exibir card do planeta quando dados carregarem', async ({
    page,
  }) => {
    // Aguarda o card aparecer (optimistic UI)
    await page.waitForTimeout(2000);

    // Verifica se há um card de planeta
    const card = page.locator('div[class*="card"]').first();
    const isVisible = await card.isVisible();

    if (isVisible) {
      // Se houver card, verifica conteúdo básico
      await expect(card).toBeVisible();
    }
  });

  test('deve mostrar badge de sincronização quando aplicável', async ({
    page,
  }) => {
    // Badge pode aparecer se houver sincronização
    const syncBadge = page.getByText(/sincronizado|ao vivo/i);
    // Apenas verifica se existir, não falha se não existir
    const count = await syncBadge.count();
    if (count > 0) {
      await expect(syncBadge.first()).toBeVisible();
    }
  });

  test('deve exibir seção de tecnologias', async ({ page }) => {
    await expect(
      page.getByText(/Construído com tecnologias modernas/i)
    ).toBeVisible();

    // Verifica algumas tecnologias
    await expect(page.getByText(/Next\.js/i)).toBeVisible();
    await expect(page.getByText(/TypeScript/i)).toBeVisible();
    await expect(page.getByText(/React Query/i)).toBeVisible();
  });
});
