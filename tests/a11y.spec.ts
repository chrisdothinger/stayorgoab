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
  const questionPortal = page.getByRole('link', { name: /Choose the question before choosing a side/i });
  await expect(questionPortal).toBeVisible();
  await expect(questionPortal).toHaveAttribute('href', '/questions/');
  await expect(questionPortal).toContainText(/Questions/i);
  await expect(questionPortal).toContainText(/Choose the question before choosing a side/i);
  await expect(questionPortal).toContainText(/Browse source-backed questions/i);
  await expect(questionPortal).not.toContainText(/001/i);
  await expect(questionPortal).not.toContainText(/Browse 50 source-backed questions/i);
  await expect(questionPortal).toContainText(/Browse the questions/i);
  await expect(page.locator('.landing-link')).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: /^Sources/i })).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: /^Method \/ Ops/i })).toHaveCount(0);
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
  await expect(page.getByRole('heading', { name: /Legal process and referendum/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Economy, taxes, and finance/i })).toBeVisible();
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/full dossier/i);
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/Internal provenance check =/i);
  await expect(page.getByLabel('Questions trust metadata').getByRole('link', { name: /Public review trail/i })).toBeVisible();

  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Public services, health, and benefits/i })).toBeVisible();
  await expect(page.getByText(/Active filters/i)).toBeVisible();
  await expect(page.getByText(/Search: CPP/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Clear filters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Would Albertans keep CPP benefits, or move to a new pension system?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Expand summary for .*CPP/i }).click();
  await expect(page.getByText(/Short answer/i)).toBeVisible();
  await expect(page.getByRole('article').getByRole('link', { name: /Public review trail/i })).toHaveCount(0);
  await page.getByRole('button', { name: /Clear filters/i }).click();
  await expect(page.getByText(/50 questions shown/i)).toBeVisible();
});

test('question overview is the primary reader path with optional deep-dive reports after the answer', async ({ page }) => {
  await page.goto('/questions/legal-process/');
  await expect(page.getByRole('region', { name: /Dossier overview/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Short answer/i })).toBeVisible();
  const deepDive = page.getByRole('complementary', { name: /Optional deeper reports/i });
  await expect(deepDive).toBeVisible();
  await expect(deepDive.getByText(/The overview is the main answer/i)).toBeVisible();
  await expect(deepDive.getByRole('link', { name: /Neutral synthesis/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i })).toHaveCount(0);
});

test('question dossier tabs preserve topic context on dossier, reports, claims, and sources', async ({ page }) => {
  for (const route of [
    '/questions/equalization/neutral/',
    '/questions/equalization/pro/',
    '/questions/equalization/anti/',
    '/questions/equalization/claims/',
    '/questions/equalization/sources/'
  ]) {
    await page.goto(route);
    const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
    for (const label of ['Overview', 'Neutral', 'Pro', 'Anti', 'Claims', 'Sources']) {
      await expect(dossierNav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(dossierNav.getByRole('link', { name: /Pro steelman/i })).toHaveCount(0);
    await expect(dossierNav.getByRole('link', { name: /Anti steelman/i })).toHaveCount(0);
    await expect(dossierNav.getByRole('link', { name: /Neutral mediator/i })).toHaveCount(0);
    await expect(dossierNav).toHaveClass(/dossier-nav/);
  }

  await page.goto('/questions/legal-process/neutral/');
  const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
  await dossierNav.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page).toHaveURL(/\/questions\/legal-process\/?$/);
});

test('report section navigation is collapsible on mobile and does not overlay content while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/questions/legal-process/neutral/');
  const sectionNav = page.getByRole('group', { name: /Report section jumps/i });
  await expect(sectionNav).toBeVisible();
  await expect(sectionNav).toHaveJSProperty('open', false);
  await sectionNav.getByText(/Jump to section/i).click();
  await expect(sectionNav.getByRole('link', { name: 'Bottom line', exact: true })).toBeVisible();
  await expect(sectionNav.getByRole('link', { name: 'What each side gets right', exact: true })).toBeVisible();
  await expect(sectionNav.getByRole('link', { name: /Reader checklist/i })).toHaveCount(0);
  await sectionNav.getByText(/Jump to section/i).click();
  await page.evaluate(() => window.scrollTo(0, 1200));
  const navBox = await sectionNav.boundingBox();
  const headingBox = await page.getByRole('heading', { name: /What each side gets right/i }).boundingBox();
  expect(navBox && headingBox ? navBox.y + navBox.height <= headingBox.y || navBox.y >= headingBox.y + headingBox.height : true).toBeTruthy();
});

test('full dossier report pages show steelman and neutral mediator structure', async ({ page }) => {
  await page.goto('/questions/legal-process/neutral/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Neutral synthesis/i);
  await expect(page.getByText(/written after the pro and anti reports/i)).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Pro', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Anti', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Claims', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What each side gets right/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What would change the answer/i })).toBeVisible();

  await page.goto('/questions/legal-process/pro/');
  await expect(page.getByText(/strongest fair pro-independence argument/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Main weakness/i })).toBeVisible();
  await expect(page.getByText(/Evidence: 3 sources/i).first()).toBeVisible();
  await page.getByText(/Evidence: 3 sources/i).first().click();
  await expect(page.locator('.evidence-chip[open]').first().getByRole('link', { name: /\[\d+\]/ }).first()).toBeVisible();

  await page.goto('/questions/legal-process/anti/');
  await expect(page.getByText(/strongest fair anti-independence/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Main weakness/i })).toBeVisible();
});

test('public review trail shows compact metadata without header cards', async ({ page }) => {
  await page.goto('/audit/');
  await expect(page.getByRole('heading', { name: /Public review trail/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Review metadata/i })).toBeVisible();
  await expect(page.getByText(/What this trail covers/i)).toBeVisible();
  await expect(page.getByText(/current source map and claim ledger/i)).toBeVisible();
  await expect(page.getByText('Pages tracked', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Inspect sources/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Page trust/i })).toHaveCount(0);
  await expect(page.locator('.metric-card')).toHaveCount(0);
});

test('source library search starts quickly without header card clutter', async ({ page }) => {
  await page.goto('/sources/');
  await expect(page.getByText(/source records shown/i)).toBeVisible();
  await expect(page.getByRole('region', { name: /Page trust/i })).toHaveCount(0);
  await expect(page.getByLabel('Source summary')).toHaveCount(0);
  await expect(page.getByLabel('Search sources')).toBeVisible();
  await expect(page.getByLabel('Source library metadata')).toHaveCount(0);
  await expect(page.getByText('Records', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Linked claims', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Stance', { exact: true })).toHaveCount(0);
  await expect(page.getByText('All stances', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Internal provenance checks are/i)).toHaveCount(0);
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

  await page.goto('/sources/?stance=neutral');
  await expect(page.getByLabel('Search sources')).toBeVisible();
  await expect(page).not.toHaveURL(/stance=/);
  await expect(page.getByText('Stance', { exact: true })).toHaveCount(0);

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
  await expect(page.getByText(/does not tell readers how to vote/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /How dossiers are built/i })).toBeVisible();
  await expect(page.getByText(/An orchestrator agent sets the work plan/i)).toBeVisible();
  await expect(page.getByText(/Specialist agents work in defined lanes/i)).toBeVisible();
  await expect(page.getByText(/source collection, pro-side arguments, anti-side arguments/i)).toBeVisible();
  await expect(page.getByText(/The orchestrator checks before publication/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open the StayOrGoAB GitHub repository/i })).toBeVisible();
  await expect(page.getByText(/source-first, non-partisan/i)).toBeVisible();
  await expect(page.getByText(/autonomous operating model/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Latest recorded runs/i })).toBeVisible();
  await expect(page.getByText(/Recorded:/i)).toBeVisible();
  await expect(page.getByText(/Description:/i)).toBeVisible();
  await expect(page.getByText(/V3 public dossier shape/i)).toHaveCount(0);
  await expect(page.getByText(/Lean dossier contract/i)).toHaveCount(0);
  await expect(page.getByText(/Evidence chips/i)).toHaveCount(0);
  await expect(page.getByText(/Dossier architecture/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Automated workflows/i })).toHaveCount(0);
  await expect(page.getByText(/official-status-daily-audit/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Operating files/i })).toHaveCount(0);
  await expect(page.getByText(/Runbooks/i)).toHaveCount(0);
  const methodMain = page.getByRole('main');
  await expect(methodMain.getByText('Topics', { exact: true })).toHaveCount(0);
  await expect(methodMain.getByText('Sources', { exact: true })).toHaveCount(0);
  await expect(methodMain.getByText('Review records', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Hermes/i)).toHaveCount(0);
  await expect(page.getByText(/Armin/i)).toHaveCount(0);
  await expect(page.getByText(/unaudited/i)).toHaveCount(0);
});
