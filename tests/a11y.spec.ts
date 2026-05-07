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
  await expect(page.getByRole('main').getByRole('link', { name: /^How this works/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Facts/i })).toHaveCount(0);
});

test('questions page groups topics by category and keeps quiet trust metadata at bottom', async ({ page }) => {
  await page.goto('/questions/');
  await expect(page.getByText(/50 questions shown/i)).toBeVisible();
  await expect(page.getByLabel('Search topics')).toBeVisible();
  await expect(page.getByLabel('Category')).toBeVisible();
  await expect(page.getByText(/Critical questions about Alberta separation/i)).toBeVisible();
  await expect(page.getByText(/public review logs, and redebate history/i)).toHaveCount(0);
  await expect(page.getByLabel('Dossier state')).toHaveCount(0);
  await expect(page.getByLabel('Time sensitivity')).toHaveCount(0);
  await expect(page.getByLabel('Provenance check')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Legal process and referendum/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Economy, taxes, and finance/i })).toBeVisible();
  const categoryBackground = await page.locator('.question-category-heading').first().evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(categoryBackground).not.toBe('rgba(0, 0, 0, 0)');
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/source-backed questions maintained/i);
  await expect(page.getByLabel('Questions trust metadata')).not.toContainText(/full dossier/i);
  await expect(page.getByLabel('Questions trust metadata')).toContainText(/Last evidence check =/i);
  await expect(page.getByLabel('Questions trust metadata').getByRole('link', { name: /Review trail/i })).toBeVisible();

  await page.getByLabel('Search topics').fill('CPP');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Public services, health, and benefits/i })).toBeVisible();
  await expect(page.getByText(/Active filters/i)).toBeVisible();
  await expect(page.getByText(/Search: CPP/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Clear filters/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Would Albertans keep CPP benefits, or move to a new pension system?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Show short answer for .*CPP/i }).click();
  const cppArticle = page.getByRole('article').filter({ hasText: /Would Albertans keep CPP benefits/i });
  await expect(cppArticle.getByText(/Short answer:/i)).toBeVisible();
  await expect(page.getByRole('article').getByRole('link', { name: /Review trail/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Hide short answer for .*CPP/i })).toBeVisible();
  await page.getByRole('button', { name: /Clear filters/i }).click();
  await expect(page.getByText(/50 questions shown/i)).toBeVisible();

  await page.getByLabel('Search topics').fill('legally need');
  await expect(page.getByText(/1 question shown/i)).toBeVisible();
  await page.getByRole('button', { name: /Show short answer for .*Alberta to become independent/i }).click();
  const expandedArticle = page.getByRole('article').filter({ hasText: /What would legally need to happen/i });
  await expect(expandedArticle.getByText(/Short answer:/i)).toBeVisible();
  await expect(expandedArticle.getByText(/State:/i)).toHaveCount(0);
  await expect(expandedArticle.getByText(/Internal check:/i)).toHaveCount(0);
  await expect(expandedArticle.getByText(/12 sources/i)).toHaveCount(1);
  await expect(expandedArticle.getByText(/8 claims/i)).toHaveCount(1);
  await expect(expandedArticle.getByRole('navigation', { name: /Dossier tabs/i })).toHaveCount(0);
  await expect(expandedArticle.getByRole('link', { name: 'Overview', exact: true })).toHaveCount(0);
  await expect(expandedArticle.getByRole('link', { name: 'Pro', exact: true })).toHaveCount(0);
  await expect(expandedArticle.getByRole('link', { name: 'Anti', exact: true })).toHaveCount(0);
  await expect(expandedArticle.getByRole('link', { name: /Open dossier:/i })).toBeVisible();
});

test('global shell keeps header typography consistent and mobile content inside viewport', async ({ page }) => {
  await page.goto('/');
  const questionsLink = page.getByRole('navigation', { name: /Primary navigation/i }).getByRole('link', { name: 'Questions' });
  const githubLink = page.getByRole('banner').getByRole('link', { name: 'GitHub' });
  const [questionsFontSize, githubFontSize, githubTextTransform] = await Promise.all([
    questionsLink.evaluate((element) => getComputedStyle(element).fontSize),
    githubLink.evaluate((element) => getComputedStyle(element).fontSize),
    githubLink.evaluate((element) => getComputedStyle(element).textTransform)
  ]);
  expect(githubFontSize).toBe(questionsFontSize);
  expect(githubTextTransform).toBe('uppercase');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const mobileHeaderHeight = await page.locator('.site-header').evaluate((element) => element.getBoundingClientRect().height);
  expect(mobileHeaderHeight).toBeLessThanOrEqual(78);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /How this works/i })).toHaveCount(0);

  for (const route of ['/questions/legal-process/pro/', '/questions/legal-process/sources/', '/sources/']) {
    await page.goto(route);
    await expect(page.locator('body')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test('question overview keeps the shared dossier navigation and no duplicate deep-dive panel', async ({ page }) => {
  await page.goto('/questions/legal-process/');
  await expect(page.getByRole('region', { name: /Dossier overview/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Short answer/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What each side gets right/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What survives both arguments/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /If you only read one page/i })).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: /Optional deeper reports/i })).toHaveCount(0);
  const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
  await expect(dossierNav.getByRole('link', { name: 'Overview', exact: true })).toBeVisible();
  await expect(dossierNav.getByRole('link', { name: 'Pro', exact: true })).toBeVisible();
  await expect(dossierNav.getByRole('link', { name: 'Anti', exact: true })).toBeVisible();
  await expect(dossierNav.getByRole('link', { name: 'Neutral', exact: true })).toHaveCount(0);
});

test('question dossier tabs preserve topic context on dossier, reports, claims, and sources', async ({ page }) => {
  for (const route of [
    '/questions/equalization/',
    '/questions/equalization/pro/',
    '/questions/equalization/anti/',
    '/questions/equalization/claims/',
    '/questions/equalization/sources/'
  ]) {
    await page.goto(route);
    const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
    for (const label of ['Overview', 'Pro', 'Anti', 'Claims', 'Sources']) {
      await expect(dossierNav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(dossierNav.getByRole('link', { name: 'Neutral', exact: true })).toHaveCount(0);
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

test('active dossier tab is visibly stronger than inactive tabs', async ({ page }) => {
  await page.goto('/questions/legal-process/pro/');
  const dossierNav = page.getByRole('navigation', { name: /Dossier navigation/i });
  const activeTab = dossierNav.getByRole('link', { name: 'Pro', exact: true });
  const inactiveTab = dossierNav.getByRole('link', { name: 'Anti', exact: true });
  await expect(activeTab).toHaveAttribute('aria-current', 'page');
  const [activeBackground, inactiveBackground, activeColor, inactiveColor] = await Promise.all([
    activeTab.evaluate((element) => getComputedStyle(element).backgroundColor),
    inactiveTab.evaluate((element) => getComputedStyle(element).backgroundColor),
    activeTab.evaluate((element) => getComputedStyle(element).color),
    inactiveTab.evaluate((element) => getComputedStyle(element).color)
  ]);
  expect(activeBackground).not.toBe(inactiveBackground);
  expect(activeColor).not.toBe(inactiveColor);
});

test('claims pages are readable ledgers without dummy expansion controls or unexplained risk labels', async ({ page }) => {
  await page.goto('/questions/legal-process/claims/');
  await expect(page.getByText(/Key claims used in this dossier/i)).toBeVisible();
  await expect(page.getByText(/Claims and evidence/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /^\+$/ })).toHaveCount(0);
  await expect(page.getByText(/Risk:/i)).toHaveCount(0);
  await expect(page.locator('.claim-row').first()).toBeVisible();
  await expect(page.locator('.claim-sources').first().getByRole('link').first()).toBeVisible();
});

test('report pages omit jump navigation and keep dossier header/nav position stable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/questions/legal-process/pro/');
  await expect(page.getByText(/Jump to section/i)).toHaveCount(0);
  await expect(page.getByRole('group', { name: /Report section jumps/i })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Bottom line/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i })).toBeVisible();

  const routes = ['/questions/legal-process/', '/questions/legal-process/pro/', '/questions/legal-process/anti/'];
  const navTops: number[] = [];
  const titleSizes: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: /What would legally need to happen/i })).toBeVisible();
    navTops.push(await page.getByRole('navigation', { name: /Dossier navigation/i }).evaluate((element) => element.getBoundingClientRect().top));
    titleSizes.push(await page.locator('.dossier-hero h1').evaluate((element) => getComputedStyle(element).fontSize));
  }

  expect(new Set(titleSizes).size).toBe(1);
  expect(Math.max(...navTops) - Math.min(...navTops)).toBeLessThanOrEqual(1);
});

test('full dossier report pages show pro and anti structure, with neutral merged into overview', async ({ page }) => {
  for (const slug of ['legal-process', 'cpp-pensions', 'employment-insurance-federal-benefits', 'bank-deposits-financial-stability', 'currency-banking', 'equalization']) {
    await page.goto(`/questions/${slug}/`);
    await expect(page.getByRole('heading', { name: /What each side gets right/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /What survives both arguments/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Neutral', exact: true })).toHaveCount(0);

    await page.goto(`/questions/${slug}/neutral/`);
    await expect(page.getByRole('heading', { name: /Neutral now lives in the overview/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Read the merged overview/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Neutral', exact: true })).toHaveCount(0);
  }

  await page.goto('/questions/legal-process/neutral/');
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Pro', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Anti', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Dossier navigation/i }).getByRole('link', { name: 'Claims', exact: true })).toBeVisible();

  await page.goto('/questions/legal-process/pro/');
  await expect(page.getByText(/strongest pro-independence legal case is narrow/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Main weakness/i })).toBeVisible();
  await expect(page.locator('.evidence-chip summary').first()).toContainText(/\d+ sources/i);
  await page.locator('.evidence-chip summary').first().click();
  await expect(page.locator('.evidence-chip[open]').first().getByRole('link', { name: /\[\d+\]/ }).first()).toBeVisible();

  await page.goto('/questions/legal-process/anti/');
  await expect(page.getByText(/strongest anti-independence case is not that Alberta is forbidden/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Main weakness/i })).toBeVisible();
});

test('public review trail shows compact metadata without header cards', async ({ page }) => {
  await page.goto('/audit/');
  await expect(page.getByRole('heading', { name: /Review trail/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Review coverage/i })).toBeVisible();
  await expect(page.getByText(/What this trail covers/i)).toBeVisible();
  await expect(page.getByText(/current source map and claims-and-evidence file/i)).toBeVisible();
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
  await expect(page.getByText(/last evidence check/i).first()).toBeVisible();
  await expect(page.getByLabel('Sort sources')).toBeVisible();
  await expect(page.getByText(/source records shown/i)).toBeVisible();
  await expect(page.getByLabel('Source type')).toBeVisible();
  await expect(page.getByLabel('Sort sources')).toBeVisible();
  await page.getByRole('button', { name: /Expand source details for/i }).first().click();
  await expect(page.getByText(/Why this source matters/i)).toBeVisible();
  await expect(page.getByText(/Used by topics/i)).toBeVisible();
  await expect(page.getByText(/Referenced claims/i)).toBeVisible();
  const topicLink = page.locator('.source-link-trail').first().getByRole('link').first();
  await expect(topicLink).toBeVisible();
  const [topicFontFamily, topicFontSize] = await topicLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.fontFamily, style.fontSize];
  });
  expect(topicFontFamily).not.toContain('SFMono');
  expect(parseFloat(topicFontSize)).toBeLessThan(24);
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
  await expect(page.getByRole('main').getByRole('link', { name: 'Review trail', exact: true })).toHaveCount(0);

  await page.goto('/changelog/');
  await expect(page.getByText(/Change history/i)).toBeVisible();
  await expect(page.getByText('Files changed', { exact: true })).toBeVisible();

  await page.goto('/method/');
  await expect(page.getByRole('heading', { name: /How this works/i })).toBeVisible();
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
  await expect(page.getByText(/Dossier shape/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /The overview is the neutral synthesis/i })).toHaveCount(0);
  await expect(page.getByText(/Main balanced answer/i)).toHaveCount(0);
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
