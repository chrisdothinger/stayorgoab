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

test('homepage guides users with search and public trust signals', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Start with current facts/i })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: /Search civic questions/i })).toBeVisible();
  await expect(page.getByText(/topics indexed/i)).toBeVisible();
  await expect(page.getByText(/sources tracked/i)).toBeVisible();
  await expect(page.getByText(/latest public audit/i)).toBeVisible();
});

test('questions search, filters, maturity legend, and disclosure rows work', async ({ page }) => {
  await page.goto('/questions/');
  await expect(page.getByText(/23 questions shown/i)).toBeVisible();
  await expect(page.getByText(/Maturity legend/i)).toBeVisible();
  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Clear filters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /CPP and pensions/i })).toBeVisible();
  await page.getByRole('button', { name: /Expand summary for .*CPP/i }).click();
  await expect(page.getByText(/Short answer/i)).toBeVisible();
  await expect(page.getByText(/Last audited: /i)).toBeVisible();
  await page.getByRole('button', { name: /Clear filters/i }).click();
  await expect(page.getByText(/23 questions shown/i)).toBeVisible();
});
