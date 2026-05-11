import { absoluteUrl } from './seo';

export type KeywordEntryPage = {
  slug: 'alberta-separation' | 'alberta-independence' | 'alberta-referendum' | 'alberta-secession';
  title: string;
  h1: string;
  kicker: string;
  description: string;
  intro: string;
  keywords: string[];
  primaryQuestionSlug: string;
  relatedQuestionSlugs: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const keywordEntryPages: KeywordEntryPage[] = [
  {
    slug: 'alberta-separation',
    title: 'Alberta Separation: Referendum, Legal Process, Economy, and Treaty Questions',
    h1: 'Alberta separation: start with the questions that actually matter.',
    kicker: 'Alberta separation guide',
    description: 'A source-backed guide to Alberta separation questions: referendum mechanics, legal process, treaty rights, pensions, debt, currency, borders, claims, and evidence.',
    intro: 'If you are searching Alberta separation, the useful first step is not picking a side. It is separating slogans from the legal process, referendum mechanics, economic tradeoffs, treaty obligations, and evidence behind the strongest claims.',
    keywords: ['Alberta separation', 'Alberta separation referendum', 'Alberta separation legal process', 'Alberta separation pros and cons'],
    primaryQuestionSlug: 'legal-process',
    relatedQuestionSlugs: ['referendum-mechanics', 'indigenous-rights-treaties', 'cpp-pensions', 'federal-debt-assets', 'borders-currency-citizenship'],
    faq: [
      {
        question: 'Can Alberta separate from Canada with a referendum alone?',
        answer: 'A clear vote could create democratic force and a duty to negotiate, but it would not by itself complete separation. Legal clarity, negotiations, treaty rights, constitutional implementation, and practical transition questions would still matter.'
      },
      {
        question: 'What should readers check before deciding whether Alberta separation is a good idea?',
        answer: 'Start with the legal process, referendum wording, Indigenous and treaty rights, pensions and benefits, debt and assets, currency and banking, borders, citizenship, and the reliability of public claims.'
      },
      {
        question: 'Is StayOrGoAB pro-separation or anti-separation?',
        answer: 'No. StayOrGoAB is built as a non-partisan source-backed research library. It presents overviews, pro arguments, anti arguments, claims, and source trails so readers can inspect the evidence.'
      }
    ]
  },
  {
    slug: 'alberta-independence',
    title: 'Alberta Independence: Source-Backed Questions and Evidence',
    h1: 'Alberta independence: evidence before slogans.',
    kicker: 'Alberta independence guide',
    description: 'Source-backed answers on Alberta independence, including referendum rules, legal process, economics, treaty rights, pensions, borders, currency, and public claims.',
    intro: 'Alberta independence raises legal, democratic, fiscal, treaty, and transition questions. This page points to the main StayOrGoAB research paths for readers who want the evidence before the rhetoric.',
    keywords: ['Alberta independence', 'Alberta independence referendum', 'Alberta independence legal process', 'Alberta independence evidence'],
    primaryQuestionSlug: 'legal-process',
    relatedQuestionSlugs: ['referendum-mechanics', 'indigenous-rights-treaties', 'cpp-pensions', 'currency-banking', 'borders-currency-citizenship'],
    faq: [
      {
        question: 'What is the first legal question for Alberta independence?',
        answer: 'The first legal question is what democratic signal would be clear enough to trigger serious negotiations, and what constitutional, treaty, and implementation steps would be required after that signal.'
      },
      {
        question: 'Where can I compare pro-independence and anti-independence arguments?',
        answer: 'StayOrGoAB topic pages include a balanced overview plus dedicated pro and anti briefs where the dossier is complete enough to support that comparison.'
      },
      {
        question: 'Does Alberta independence have one simple financial answer?',
        answer: 'No. Financial questions depend on assumptions about pensions, federal transfers, debt and asset division, trade, currency, taxation, services, and negotiations.'
      }
    ]
  },
  {
    slug: 'alberta-referendum',
    title: 'Alberta Referendum: Petition Rules, Ballot Questions, and Independence Process',
    h1: 'Alberta referendum questions need process clarity.',
    kicker: 'Alberta referendum guide',
    description: 'Source-backed Alberta referendum guide covering petition rules, ballot wording, legal effect, independence claims, negotiation questions, and evidence trails.',
    intro: 'A referendum can sound simple, but the details matter: who can trigger it, what the question says, what result counts as clear, and what happens legally and politically afterward.',
    keywords: ['Alberta referendum', 'Alberta referendum 2026', 'Alberta independence referendum', 'Alberta separation referendum'],
    primaryQuestionSlug: 'referendum-mechanics',
    relatedQuestionSlugs: ['petition-vs-referendum-vs-negotiations', 'referendum-ballot-2026', 'legal-process', 'indigenous-rights-treaties'],
    faq: [
      {
        question: 'Would an Alberta referendum automatically make Alberta independent?',
        answer: 'No. A referendum result could matter politically and democratically, but independence would still require legal and negotiated implementation.'
      },
      {
        question: 'Why does ballot wording matter?',
        answer: 'Ballot wording matters because courts, governments, voters, and negotiating parties would all look at whether the question and result were clear enough to carry democratic weight.'
      },
      {
        question: 'Where should readers start on referendum mechanics?',
        answer: 'Start with the StayOrGoAB referendum mechanics dossier, then compare it with the legal process and petition-versus-referendum pages.'
      }
    ]
  },
  {
    slug: 'alberta-secession',
    title: 'Alberta Secession: Canadian Law, Referendum Clarity, and Negotiation Questions',
    h1: 'Alberta secession is a legal process question, not just a political slogan.',
    kicker: 'Alberta secession guide',
    description: 'Source-backed guide to Alberta secession questions under Canadian law: referendum clarity, duty to negotiate, constitutional process, treaty rights, and evidence.',
    intro: 'Secession language usually skips the hard parts. The real questions are legal clarity, democratic legitimacy, constitutional amendment routes, Indigenous and treaty rights, economic transition, and negotiation constraints.',
    keywords: ['Alberta secession', 'Alberta secession law', 'Canada secession law', 'Alberta independence legal process'],
    primaryQuestionSlug: 'legal-process',
    relatedQuestionSlugs: ['referendum-mechanics', 'indigenous-rights-treaties', 'federal-debt-assets', 'borders-currency-citizenship'],
    faq: [
      {
        question: 'What does secession mean in the Alberta context?',
        answer: 'In this context, secession means Alberta attempting to leave Canada and become independent. The hard questions are legal, constitutional, democratic, treaty-related, and practical.'
      },
      {
        question: 'Is there a simple Canadian-law path for Alberta secession?',
        answer: 'No simple path is settled. A clear democratic signal could create pressure and a duty to negotiate, but implementation would still raise constitutional, treaty, and political questions.'
      },
      {
        question: 'Why does StayOrGoAB use both separation and secession terms?',
        answer: 'Readers use both terms. The site uses them to help people find source-backed explanations while keeping the legal and evidence distinctions clear.'
      }
    ]
  }
];

export function getKeywordEntryPage(slug: KeywordEntryPage['slug']) {
  return keywordEntryPages.find((page) => page.slug === slug);
}

export function keywordEntryPageJsonLd(page: KeywordEntryPage) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      headline: page.h1,
      description: page.description,
      url: absoluteUrl(`/${page.slug}/`),
      inLanguage: 'en-CA',
      isPartOf: {
        '@type': 'WebSite',
        name: 'StayOrGoAB',
        url: absoluteUrl('/')
      },
      about: page.keywords
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'StayOrGoAB',
          item: absoluteUrl('/')
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.kicker,
          item: absoluteUrl(`/${page.slug}/`)
        }
      ]
    }
  ];
}
