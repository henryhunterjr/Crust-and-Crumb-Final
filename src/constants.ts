
import { GlossaryItem, LearningPath } from './types';
import glossaryData from './data/glossary.json';
import slugAliases from './data/slugAliases.json';

// Export glossary data from JSON (canonical entries plus source-backed cluster terms)
// Keep unfinished inventory additions in the source file, not the public glossary.
export const GLOSSARY_DATA: GlossaryItem[] = (glossaryData as GlossaryItem[])
  .filter(item => item.definitionStatus !== 'editorial-draft');

// Old or alternate slugs (from Recipe Pantry markers and older links) mapped to a current term id.
// Never delete an entry here: removing one breaks every link that still uses it.
export const SLUG_ALIASES: Record<string, string> = slugAliases as Record<string, string>;

// Resolve a slug that isn't a current id or alias label (e.g. a Pantry marker or URL-encoded slug).
export function resolveSlugAlias(rawSlug: string): string | undefined {
  let slug = rawSlug;
  try { slug = decodeURIComponent(rawSlug); } catch { /* keep raw */ }
  slug = slug.trim().toLowerCase().normalize('NFC');
  const target = SLUG_ALIASES[slug];
  return target && GLOSSARY_DATA.some(item => item.id === target) ? target : undefined;
}

// Affiliate product links configuration
export const AFFILIATE_LINKS = {
  // Proofing/Fermentation
  brodTaylorProofer: { name: 'Brød & Taylor Folding Proofer & Slow Cooker', url: 'https://collabs.shop/vutgu8' },
  sourhouseGoldie: { name: 'Sourhouse Goldie (code HBK26)', url: 'https://sourhouse.co/products/goldie-by-sourhouse-cooling-puck-white?ref=BAKINGGREATBREAD' },
  // Scoring
  wireMonkeyLame: { name: 'Wire Monkey Lame', url: 'https://wiremonkey.com/henryhunter' },
  // Baking/Dutch Oven
  bakingShellBoule: { name: 'Brød & Taylor Baking Shell (Boule)', url: 'https://collabs.shop/jveyfn' },
  bakingShellBatard: { name: 'Brød & Taylor Baking Shell (Batard) & Steel', url: 'https://collabs.shop/noauwh' },
  breadSteel: { name: 'Brød & Taylor Bread Steel', url: 'https://collabs.shop/soze7p' },
  // Bench work
  benchKnife: { name: 'Brød & Taylor Bench Knife', url: 'https://collabs.shop/8vcnxu' },
  // Proofing containers
  proofingContainer: { name: 'Brød & Taylor Proofing Container 6L', url: 'https://collabs.shop/6iguo3' },
  // Scale
  nutriMill: { name: 'NutriMill Grain Mills', url: 'https://nutrimill.com/Academy26' },
  bakingScale: { name: 'Brød & Taylor High-Capacity Baking Scale', url: 'https://collabs.shop/hvryn6' },
};

// External resource URLs
export const EXTERNAL_URLS = {
  starterGuide: 'https://sourdough-starter-master-kxo6qxb.gamma.site/',
  bookPage: 'https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest',
  facebookGroup: 'https://www.facebook.com/groups/1082865755403754',
  blog: 'https://bakinggreatbread.blog',
};

// Special path ID for Baking Tools (opens modal instead of filtering)
export const BAKING_TOOLS_PATH_ID = 'baking-tools';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'beginner-basics',
    title: 'Beginner Basics',
    description: 'Start here! The fundamental building blocks of all great bread.',
    termIds: ['gluten', 'kneading', 'fermentation', 'proofing', 'oven-spring', 'scoring', 'crumb', 'windowpane-test', 'hydration']
  },
  {
    id: 'sourdough-mastery',
    title: 'Sourdough Mastery',
    description: 'The "Sourdough for the Rest of Us" Companion Path.',
    termIds: [
      'sourdough-starter',
      'fermentolyse',
      'stretch-and-fold',
      'coil-fold',
      'bulk-fermentation',
      'cold-proof',
      'scoring',
      'bakers-percentage'
    ]
  },
  {
    id: 'bread-types',
    title: 'Bread Types',
    description: 'Explore different bread styles from around the world.',
    termIds: ['baguette', 'boule', 'batard', 'ciabatta', 'focaccia', 'brioche', 'challah', 'bagel']
  },
  {
    id: 'fresh-milled-grains',
    title: 'Fresh-Milled & Ancient Grains',
    description: 'From wheat berry to loaf: milling, sifting, and baking with whole and ancient grains.',
    termIds: ['fresh-milled-flour', 'home-milling', 'wheat-berry', 'bran', 'extraction-rate', 'bolting', 'bran-soaker', 'hard-white-wheat', 'einkorn', 'spelt-flour', 'khorasan-wheat', 'rye-flour']
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'What went wrong with that loaf, and how to fix it next time.',
    termIds: ['dense-crumb', 'gummy-crumb', 'underfermented', 'fools-crumb', 'overproofed', 'underproofed', 'pancaking', 'blowout', 'flying-crust', 'tunneling', 'pale-crust', 'banneton-sticking']
  },
  {
    id: 'tools-equipment',
    title: 'Tools & Equipment',
    description: 'Essential tools for your bread baking journey.',
    termIds: ['banneton', 'lame', 'dutch-oven', 'bench-scraper', 'digital-scale', 'probe-thermometer', 'baking-steel']
  }
];
