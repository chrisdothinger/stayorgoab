import type { Metadata } from 'next';
import { hasMergedNeutralOverview } from './dossier-contract';
import type { SourceRecord, TopicMeta } from './types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stayorgoab.ca').replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const DEFAULT_OG_IMAGE_ALT = 'StayOrGoAB source-backed Alberta referendum, independence, and separation answers';

export const CORE_KEYWORDS = [
  'Alberta referendum',
  'Alberta independence',
  'Alberta separation',
  'Alberta separatism',
  'Alberta sovereignty',
  'Alberta secession',
  'Alberta referendum questions',
  'Alberta independence sources',
  'Alberta separation evidence',
  'Canada secession law'
];

export function absoluteUrl(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export function routeCanonical(pathname = '/') {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return absoluteUrl(path);
}

function unique(values: Array<string | undefined | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())).map((value) => value.trim()))];
}

export function pageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  type = 'website',
  index = true
}: {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  type?: 'website' | 'article';
  index?: boolean;
}): Metadata {
  const canonical = routeCanonical(pathname);
  return {
    title,
    description,
    keywords: unique([...keywords, ...CORE_KEYWORDS]),
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'StayOrGoAB',
      locale: 'en_CA',
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: DEFAULT_OG_IMAGE_ALT
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export function topicKeywords(topic: TopicMeta) {
  return unique([
    topic.title,
    topic.plain_question,
    topic.category,
    ...topic.keywords,
    'Alberta referendum',
    'Alberta independence',
    'Alberta separation'
  ]);
}

export function topicMetadata(topic: TopicMeta | undefined, section: 'overview' | 'pro' | 'anti' | 'neutral' | 'claims' | 'sources'): Metadata {
  if (!topic) {
    return pageMetadata({
      title: 'StayOrGoAB question',
      description: 'A source-backed StayOrGoAB question about Alberta independence and separation.',
      pathname: '/questions/'
    });
  }

  const sectionLabels = {
    overview: 'overview',
    pro: 'pro-independence brief',
    anti: 'anti-independence brief',
    neutral: 'neutral synthesis',
    claims: 'claims and evidence',
    sources: 'source map'
  } as const;
  const sectionPath = section === 'overview' ? '' : `${section}/`;
  const pathname = `/questions/${topic.slug}/${sectionPath}`;
  const baseDescription = topic.summary;
  const descriptionBySection = {
    overview: `${baseDescription} Source-backed overview for readers searching Alberta referendum, independence, or separation questions.`,
    pro: `The strongest fair pro-independence argument for ${topic.plain_question} with source-backed evidence and caveats.`,
    anti: `The strongest fair anti-independence or pro-federation argument for ${topic.plain_question} with source-backed evidence and caveats.`,
    neutral: `Neutral synthesis status for ${topic.plain_question} in the StayOrGoAB Alberta independence research library.`,
    claims: `Claim ledger and evidence links for ${topic.plain_question} in the StayOrGoAB Alberta independence research library.`,
    sources: `Source map for ${topic.plain_question} with official, court, academic, media, and institutional records.`
  } as const;

  return pageMetadata({
    title: `${topic.title} — ${sectionLabels[section]}`,
    description: descriptionBySection[section],
    pathname,
    keywords: topicKeywords(topic),
    type: 'article',
    index: section !== 'neutral' || !hasMergedNeutralOverview(topic.slug)
  });
}

export function sourceMetadata(source: SourceRecord | undefined): Metadata {
  if (!source) {
    return pageMetadata({
      title: 'StayOrGoAB source record',
      description: 'A source record used by StayOrGoAB Alberta referendum, independence, and separation dossiers.',
      pathname: '/sources/'
    });
  }
  const slug = source.slug ?? source.id;
  return pageMetadata({
    title: `${source.title} — source record`,
    description: `${source.summary} Source record for Alberta referendum, independence, and separation research.`,
    pathname: `/sources/${slug}/`,
    keywords: [source.title, source.publisher, source.source_type, ...(source.related_topic_slugs ?? [])],
    type: 'article'
  });
}
