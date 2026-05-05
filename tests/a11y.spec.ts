import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/questions/', '/sources/', '/method/', '/agents/', '/audit/', '/repo/', '/changelog/', '/disclaimer/'];

for (const route of routes) {
  test(`${route} has no obvious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('body')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('homepage is a compact landing page for main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Stay or go/i })).toBeVisible();
  await expect(page.getByText(/source-first, autonomous, non-partisan knowledge base/i)).toBeVisible();
  const landingNav = page.getByRole('navigation', { name: /Main site sections/i });
  await expect(landingNav.getByRole('link', { name: /^Questions/i })).toBeVisible();
  await expect(landingNav.getByRole('link', { name: /^Sources/i })).toBeVisible();
  await expect(landingNav.getByRole('link', { name: /^Method \/ Ops/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Facts/i })).toHaveCount(0);
});

test('questions page groups topics by category and keeps quiet trust metadata at bottom', async ({ page }) => {
  await page.goto('/questions/');
  await expect(page.getByText(/50 questions shown/i)).toBeVisible();
  await expect(page.getByLabel('Search topics')).toBeVisible();
  await expect(page.getByLabel('Category')).toBeVisible();
  await expect(page.getByLabel('Dossier state')).toHaveCount(0);
  await expect(page.getByLabel('Time sensitivity')).toHaveCount(0);
  await expect(page.getByLabel('Provenance check')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Legal process/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Economy and fiscal policy/i })).toBeVisible();
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/full dossier/i);
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/Internal provenance check =/i);
  await expect(page.getByLabel('Questions trust metadata').getByRole('link', { name: /Public review trail/i })).toBeVisible();

  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /CPP, pensions, and benefits/i })).toBeVisible();
  await expect(page.getByText(/Active filters/i)).toBeVisible();
  await expect(page.getByText(/Search: CPP/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Clear filters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'What would happen to CPP and pensions?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Expand summary for .*CPP/i }).click();
  await expect(page.getByText(/Short answer/i)).toBeVisible();
  await expect(page.getByRole('article').getByRole('link', { name: /Public review trail/i })).toHaveCount(0);
  await page.getByRole('button', { name: /Clear filters/i }).click();
  await expect(page.getByText(/50 questions shown/i)).toBeVisible();
});

test('question dossier tabs preserve topic context on dossier, reports, claims, and sources', async ({ page }) => {
  for (const route of [
    '/questions/equalization/',
    '/questions/equalization/neutral/',
    '/questions/equalization/pro/',
    '/questions/equalization/anti/',
    '/questions/equalization/claims/',
    '/questions/equalization/sources/'
  ]) {
    await page.goto(route);
    const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
    for (const label of ['Dossier', 'Neutral', 'Pro', 'Anti', 'Claims', 'Sources']) {
      await expect(dossierNav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(dossierNav.getByRole('link', { name: /Pro steelman/i })).toHaveCount(0);
    await expect(dossierNav.getByRole('link', { name: /Anti steelman/i })).toHaveCount(0);
    await expect(dossierNav.getByRole('link', { name: /Neutral mediator/i })).toHaveCount(0);
    await expect(dossierNav).toHaveClass(/dossier-nav/);
  }

  await page.goto('/questions/legal-process/neutral/');
  const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
  await dossierNav.getByRole('link', { name: 'Dossier', exact: true }).click();
  await expect(page).toHaveURL(/\/questions\/legal-process\/?$/);
});

test('report section navigation is collapsible on mobile and does not overlay content while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/questions/legal-process/neutral/');
  const sectionNav = page.getByRole('group', { name: /Report section jumps/i });
  await expect(sectionNav).toBeVisible();
  await expect(sectionNav).toHaveJSProperty('open', false);
  await page.evaluate(() => window.scrollTo(0, 1200));
  const navBox = await sectionNav.boundingBox();
  const headingBox = await page.getByRole('heading', { name: /What current sources support/i }).boundingBox();
  expect(navBox && headingBox ? navBox.y + navBox.height <= headingBox.y || navBox.y >= headingBox.y + headingBox.height : true).toBeTruthy();
});

test('full dossier report pages show steelman and neutral mediator structure', async ({ page }) => {
  await page.goto('/questions/legal-process/neutral/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Neutral synthesis/i);
  await expect(page.getByText(/written after the pro and anti reports/i)).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Pro', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Anti', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Claims', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Weak points/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What would change this assessment/i })).toBeVisible();

  await page.goto('/questions/legal-process/pro/');
  await expect(page.getByText(/strongest fair pro-independence argument/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Counterarguments/i })).toBeVisible();

  await page.goto('/questions/legal-process/anti/');
  await expect(page.getByText(/strongest fair anti-independence/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Counterarguments/i })).toBeVisible();
});

test('shared page trust layer remains on supporting public trust surfaces', async ({ page }) => {
  const routesWithTrustLayer = ['/audit/'];

  for (const route of routesWithTrustLayer) {
    await page.goto(route);
    const trustLayer = page.getByRole('region', { name: /Page trust/i });
    await expect(trustLayer).toBeVisible();
    await expect(trustLayer.getByText('Source status', { exact: true })).toBeVisible();
    await expect(trustLayer.getByText('Review trail', { exact: true })).toBeVisible();
    await expect(trustLayer.getByRole('link', { name: /Inspect sources|Source library/i })).toBeVisible();
    await expect(trustLayer.getByRole('link', { name: /Open review log|Review log/i })).toBeVisible();
    await expect(trustLayer.getByText(/audit pending/i)).toHaveCount(0);
    await expect(trustLayer.getByText(/audit pending/i)).toHaveCount(0);
  }
});

test('source library search starts quickly without header card clutter', async ({ page }) => {
  await page.goto('/sources/');
  await expect(page.getByText(/source records shown/i)).toBeVisible();
  await expect(page.getByRole('region', { name: /Page trust/i })).toHaveCount(0);
  await expect(page.getByLabel('Source summary')).toHaveCount(0);
  await expect(page.getByLabel('Search sources')).toBeVisible();
  await expect(page.getByText(/Internal provenance checks are/i)).toBeVisible();
  await expect(page.getByLabel('Sort sources')).toBeVisible();
  await expect(page.getByText(/source records shown/i)).toBeVisible();
  await expect(page.getByLabel('Source type')).toBeVisible();
  await expect(page.getByLabel('Sort sources')).toBeVisible();
  await page.getByRole('button', { name: /Expand source details for/i }).first().click();
  await expect(page.getByText(/Why this source matters/i)).toBeVisible();
  await expect(page.getByText(/Used by topics/i)).toBeVisible();
  await expect(page.getByText(/Referenced claims/i)).toBeVisible();
});

test('source library supports query filters and polished source detail pages', async ({ page }) => {
  await page.goto('/sources/?q=Elections%20Alberta&type=official&sort=publisher');
  await expect(page.getByLabel('Search sources')).toHaveValue('Elections Alberta');
  await expect(page.getByLabel('Source type')).toHaveValue('official');
  await expect(page.getByLabel('Sort sources')).toHaveValue('publisher');
  await expect(page.getByText(/Active source filters/i)).toBeVisible();
  await expect(page.getByText(/Search: Elections Alberta/i)).toBeVisible();
  await expect(page.getByText(/Type: official/i)).toBeVisible();

  await page.goto('/sources/elections-ab-current-petitions/');
  await expect(page.getByRole('heading', { name: /Current Citizen Initiative Petitions/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Page trust/i })).toBeVisible();
  await expect(page.getByText(/Why this source matters/i)).toBeVisible();
  await expect(page.getByText(/Used by topics/i)).toBeVisible();
  await expect(page.getByText(/Referenced claims/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to source library/i })).toBeVisible();
  await expect(page.getByText(/audit pending/i)).toHaveCount(0);
});

test('public trust surfaces explain repo, review log, and changelog clearly', async ({ page }) => {
  await page.goto('/repo/');
  await expect(page.getByText(/Public repository evidence/i)).toBeVisible();
  await expect(page.getByLabel('Repository ledger').getByText('Source records', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Repository evidence summary')).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: 'Review log', exact: true })).toHaveCount(0);

  await page.goto('/changelog/');
  await expect(page.getByText(/Change history/i)).toBeVisible();
  await expect(page.getByText('Files changed', { exact: true })).toBeVisible();

  await page.goto('/method/');
  await expect(page.getByRole('heading', { name: /Method \/ Ops/i })).toBeVisible();
  await expect(page.getByText(/internal provenance check/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /Automated workflows/i })).toBeVisible();
  await expect(page.getByText(/official-status-daily-audit/i)).toBeVisible();
  await expect(page.getByText(/dossier-factory-buildout/i)).toBeVisible();
  await expect(page.getByText(/citation-claim-integrity-audit/i)).toBeVisible();
  await expect(page.getByText(/pending \/ not yet recorded/i).first()).toBeVisible();
  await expect(page.getByText(/Hermes/i)).toHaveCount(0);
  await expect(page.getByText(/unaudited/i)).toHaveCount(0);
});
