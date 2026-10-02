import type { MetadataRoute } from 'next';
import { GLOSSARY_DATA } from '@/src/constants';
import { SITE_URL } from '@/src/seo';
import TERM_DATES from '@/src/data/term-dates.json';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...['editorial-standards', 'methodology', 'sources', 'updates'].map(slug => ({ url: `${SITE_URL}/${slug}`, lastModified: '2026-10-02', priority: 0.5 })),
    ...GLOSSARY_DATA.map((term) => ({
      url: `${SITE_URL}/term/${term.id}`,
      ...((TERM_DATES as Record<string, { modified: string }>)[term.id]?.modified ? { lastModified: (TERM_DATES as Record<string, { modified: string }>)[term.id].modified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
