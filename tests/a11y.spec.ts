import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/facts/', '/questions/', '/sources/', '/method/', '/agents/', '/audit/', '/ops/', '/repo/', '/changelog/', '/disclaimer/'];

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
  await expect(page.getByRole('heading', { name: /Find an answer fast/i })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: /Search civic questions/i })).toBeVisible();
  await expect(page.getByText(/topics indexed/i)).toBeVisible();
  await expect(page.getByText(/sources tracked/i)).toBeVisible();
  await expect(page.getByText(/latest internal provenance check/i)).toBeVisible();
  await expect(page.getByText(/reviewed page records/i)).toBeVisible();
  await expect(page.getByText(/audited page records/i)).toHaveCount(0);
});

test('questions search, filters, maturity legend, and disclosure rows work', async ({ page }) => {
  await page.goto('/questions/');
  await expect(page.getByText(/23 questions shown/i)).toBeVisible();
  await expect(page.getByText(/Maturity legend/i)).toBeVisible();
  await expect(page.getByText(/Internal provenance check =/i)).toBeVisible();
  await expect(page.getByText(/public review trail/i)).toBeVisible();
  await expect(page.getByText(/audits/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /All 23 questions/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: /Open dossier:/i }).first()).toBeVisible();
  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await expect(page.getByText(/Active filters/i)).toBeVisible();
  await expect(page.getByText(/Search: CPP/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Clear filters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'What would happen to CPP and pensions?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Expand summary for .*CPP/i }).click();
  await expect(page.getByText(/Short answer/i)).toBeVisible();
  await expect(page.getByRole('article').getByRole('link', { name: /Public review trail/i })).toBeVisible();
  await page.getByRole('button', { name: /Clear filters/i }).click();
  await expect(page.getByText(/23 questions shown/i)).toBeVisible();
});

test('source library search, filters, and source trails work', async ({ page }) => {
  await page.goto('/sources/');
  await expect(page.getByText(/16 source records shown/i)).toBeVisible();
  await expect(page.getByText(/Internal provenance checks are/i)).toBeVisible();
  await page.getByLabel('Search sources').fill('Elections Alberta');
  await expect(page.getByRole('button', { name: /Clear source filters/i })).toBeVisible();
  await expect(page.getByText(/source records shown/i)).toBeVisible();
  await page.getByLabel('Source type').selectOption('official');
  await expect(page.getByLabel('Source type')).toHaveValue('official');
  await page.getByRole('button', { name: /Expand source details for/i }).first().click();
  await expect(page.getByText(/Used by topics/i)).toBeVisible();
  await expect(page.getByText(/Referenced claims/i)).toBeVisible();
});

test('public trust surfaces explain repo, review log, and changelog clearly', async ({ page }) => {
  await page.goto('/repo/');
  await expect(page.getByText(/Public repository evidence/i)).toBeVisible();
  await expect(page.getByText('Source map', { exact: true })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: /Review log/i })).toBeVisible();

  await page.goto('/changelog/');
  await expect(page.getByText(/Change history/i)).toBeVisible();
  await expect(page.getByLabel('Change entries').getByText(/source library ux/i)).toBeVisible();
  await expect(page.getByText('Files changed', { exact: true })).toBeVisible();

  await page.goto('/ops/');
  await expect(page.getByText(/internal provenance check/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Inspect page-level review manifest/i })).toBeVisible();
  await expect(page.getByText(/unaudited/i)).toHaveCount(0);
});
