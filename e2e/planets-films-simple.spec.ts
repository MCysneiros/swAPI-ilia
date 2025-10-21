import { test, expect } from '@playwright/test';

test.describe('Planets List - Films in Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planets');
    // Aguarda a lista renderizar
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve exibir filmes nos cards da lista de planetas', async ({ page }) => {
    // Aguarda os cards carregarem
    await page.waitForSelector('text=Diameter:', { timeout: 10000 });
    
    // Aguarda os filmes carregarem
    await page.waitForTimeout(3000);
    
    // Verifica se existe a seção de Films
    const filmsSection = page.getByText('Films:').first();
    await expect(filmsSection).toBeVisible();
  });

  test('deve exibir badges com títulos dos filmes', async ({ page }) => {
    await page.waitForSelector('text=Diameter:', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Verifica se há badges de filmes
    const badges = page.locator('[class*="badge"]').filter({ hasText: /Episode|New Hope|Empire|Return|Phantom|Attack|Revenge/i });
    const count = await badges.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('lista deve estar ordenada alfabeticamente', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });
    
    // Pega todos os títulos dos cards
    const titles = await page.locator('h3[class*="CardTitle"]').allTextContents();
    
    // Verifica se está ordenado
    const sorted = [...titles].sort();
    expect(titles).toEqual(sorted);
  });

  test('deve exibir até 10 itens por página', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });
    
    const cards = page.locator('[class*="CardTitle"]');
    const count = await cards.count();
    
    expect(count).toBeLessThanOrEqual(10);
    expect(count).toBeGreaterThan(0);
  });

  test('deve ter campo de busca funcional', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search planets...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Tatooine');
    await page.waitForTimeout(1000);
    
    // Verifica se há resultados
    const cards = page.locator('h3[class*="CardTitle"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('deve exibir informações básicas nos cards', async ({ page }) => {
    await page.waitForSelector('text=Population:', { timeout: 10000 });
    
    // Verifica elementos comuns nos cards
    await expect(page.getByText('Population:').first()).toBeVisible();
    await expect(page.getByText('Diameter:').first()).toBeVisible();
    await expect(page.getByText('Residents:').first()).toBeVisible();
  });
});
