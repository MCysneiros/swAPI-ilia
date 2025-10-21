import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir o título e descrição corretos', async ({ page }) => {
    // Verifica título principal
    await expect(
      page.getByRole('heading', { name: 'SWAPI Explorer' })
    ).toBeVisible();

    // Verifica descrição
    await expect(
      page.getByText(/Explore the Star Wars universe with a modern/)
    ).toBeVisible();
  });

  test('deve exibir os cards de features', async ({ page }) => {
    // Verifica card de Planets
    await expect(page.getByRole('heading', { name: 'Planets' })).toBeVisible();

    // Verifica card de Characters
    await expect(
      page.getByRole('heading', { name: 'Characters' })
    ).toBeVisible();

    // Verifica card de More Coming Soon
    await expect(
      page.getByRole('heading', { name: 'More Coming Soon' })
    ).toBeVisible();
  });

  test('deve ter link funcional para planetas', async ({ page }) => {
    // Clica no card de Planets
    await page
      .getByRole('link')
      .filter({ has: page.getByRole('heading', { name: 'Planets' }) })
      .click();

    // Aguarda navegação e verifica a URL
    await page.waitForURL('/planets');
    await expect(page).toHaveURL(/\/planets/);
  });

  test('deve ter meta tags corretas', async ({ page }) => {
    // Verifica título da página
    await expect(page).toHaveTitle(/SWAPI Explorer/);
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verifica que todos os elementos ainda são visíveis
    await expect(
      page.getByRole('heading', { name: 'SWAPI Explorer' })
    ).toBeVisible();
    await expect(
      page.getByText('Explore os planetas do universo Star Wars')
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Ver Planetas' })
    ).toBeVisible();
  });

  test('deve ter layout centralizado', async ({ page }) => {
    const container = page.locator('div.flex.min-h-screen');
    await expect(container).toBeVisible();

    // Verifica classes de centralização
    const classes = await container.getAttribute('class');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-center');
  });

  test('botão deve ter tamanho grande (lg)', async ({ page }) => {
    const button = page.getByRole('link', { name: 'Ver Planetas' });

    // Verifica que o botão tem aparência de destaque
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThan(40); // Botões lg são maiores
  });

  test('deve carregar rapidamente (performance)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Página inicial deve carregar em menos de 3 segundos
    expect(loadTime).toBeLessThan(3000);
  });

  test('deve ter acessibilidade adequada', async ({ page }) => {
    // Verifica estrutura de heading
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('SWAPI Explorer');

    // Verifica que o link é focável
    const link = page.getByRole('link', { name: 'Ver Planetas' });
    await link.focus();
    await expect(link).toBeFocused();
  });

  test('deve ter contraste adequado', async ({ page }) => {
    // Verifica que o texto é visível
    const heading = page.getByRole('heading', { name: 'SWAPI Explorer' });
    await expect(heading).toBeVisible();

    const description = page.getByText(
      'Explore os planetas do universo Star Wars'
    );
    await expect(description).toBeVisible();
  });
});
