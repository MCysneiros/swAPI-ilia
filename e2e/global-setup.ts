import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  await page.goto(baseURL);

  await page.waitForTimeout(1000);

  await browser.close();
}

export default globalSetup;
