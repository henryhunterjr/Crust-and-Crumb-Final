import type { MetadataRoute } from 'next';
import { GLOSSARY_DATA } from '@/src/constants';
import { SITE_URL } from '@/src/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...GLOSSARY_DATA.map((term) => ({
      url: `${SITE_URL}/term/${term.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
