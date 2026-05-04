import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/facts/', '/questions/', '/sources/', '/method/', '/agents/', '/audit/', '/ops/', '/disclaimer/'];

for (const route of routes) {
  test(`${route} has no obvious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('body')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('questions search, category filters, and disclosure rows work', async ({ page }) => {
  await page.goto('/questions/');
  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByRole('link', { name: /CPP and pensions/i })).toBeVisible();
  await page.getByRole('button', { name: /Expand CPP/i }).click();
  await expect(page.getByText(/Short answer/i)).toBeVisible();
});
