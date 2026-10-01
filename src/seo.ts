// Shared SEO and social sharing settings for the glossary
export const SITE_URL = 'https://crust-and-crumb-tawny.vercel.app';
export const SITE_NAME = 'Crust & Crumb Glossary';
export const PUBLISHER_NAME = 'Baking Great Bread at Home';
export const AUTHOR_NAME = 'Henry Hunter';

export const OG_IMAGE = {
  url: '/og/crust-and-crumb-glossary.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Crust & Crumb Interactive Bread Baking Glossary. Clear definitions, real examples, better bread.',
};

export const SAME_AS = [
  'https://www.youtube.com/@henryhunterjr',
  'https://www.facebook.com/henryhunterjr',
  'https://www.instagram.com/bakinggreatbreadathome/',
  'https://www.bakinggreatbread.blog',
  'https://www.skool.com/crust-crumb-academy-7621',
];

export const SITE_KEYWORDS = [
  'bread baking glossary',
  'sourdough glossary',
  'bread baking terms',
  'sourdough terms explained',
  'baking dictionary',
  "baker's percentage",
  'hydration',
  'fermentation',
  'fresh milled flour',
  'bread troubleshooting',
  'Henry Hunter',
  'Crust and Crumb Academy',
  'Baking Great Bread at Home',
];

/** Serialize JSON-LD safely for a script tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Trim text to a clean meta description length without cutting mid-word. */
export function clip(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
