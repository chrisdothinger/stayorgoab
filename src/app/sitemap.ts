import type { MetadataRoute } from 'next';
import { loadRepositoryContent } from '@/lib/content';
import { hasMergedNeutralOverview } from '@/lib/dossier-contract';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

function sitemapUrl(pathname: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly') {
  return {
    url: absoluteUrl(pathname),
    lastModified: new Date('2026-05-08'),
    changeFrequency,
    priority
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const content = loadRepositoryContent();
  const staticRoutes: MetadataRoute.Sitemap = [
    sitemapUrl('/', 1, 'weekly'),
    sitemapUrl('/questions/', 0.95, 'weekly'),
    sitemapUrl('/sources/', 0.8, 'weekly'),
    sitemapUrl('/method/', 0.7, 'monthly'),
    sitemapUrl('/audit/', 0.5, 'weekly'),
    sitemapUrl('/agents/', 0.45, 'monthly'),
    sitemapUrl('/glossary/', 0.45, 'monthly'),
    sitemapUrl('/disclaimer/', 0.25, 'yearly')
  ];

  const topicRoutes: MetadataRoute.Sitemap = content.topics.flatMap((topic) => {
    const files = content.topicFiles[topic.slug];
    const basePriority = topic.state === 'full_dossier' ? 0.9 : 0.55;
    const routes: MetadataRoute.Sitemap = [sitemapUrl(`/questions/${topic.slug}/`, basePriority, 'weekly')];
    if (files.reports.pro) routes.push(sitemapUrl(`/questions/${topic.slug}/pro/`, 0.78, 'monthly'));
    if (files.reports.anti) routes.push(sitemapUrl(`/questions/${topic.slug}/anti/`, 0.78, 'monthly'));
    if (!hasMergedNeutralOverview(topic.slug) && files.reports.neutral) routes.push(sitemapUrl(`/questions/${topic.slug}/neutral/`, 0.5, 'monthly'));
    routes.push(sitemapUrl(`/questions/${topic.slug}/sources/`, 0.6, 'weekly'));
    routes.push(sitemapUrl(`/questions/${topic.slug}/claims/`, 0.55, 'weekly'));
    return routes;
  });

  const sourceRoutes: MetadataRoute.Sitemap = content.sources.map((source) => sitemapUrl(`/sources/${source.slug ?? source.id}/`, 0.35, 'monthly'));

  return [...staticRoutes, ...topicRoutes, ...sourceRoutes].map((entry) => ({
    ...entry,
    url: entry.url.replace(`${SITE_URL}//`, `${SITE_URL}/`)
  }));
}
