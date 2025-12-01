
import { GlossaryItem, LearningPath } from './types';
import glossaryData from './data/glossary.json';

// Export glossary data from JSON (132 terms)
export const GLOSSARY_DATA: GlossaryItem[] = glossaryData as GlossaryItem[];

// Affiliate product links configuration
export const AFFILIATE_LINKS = {
  // Proofing/Fermentation
  brodTaylorProofer: { name: 'Brød & Taylor Folding Proofer', url: 'https://collabs.shop/38ff48' },
  sourhouseGoldie: { name: 'Sourhouse Goldie', url: 'https://bit.ly/3Wd9rJy' },
  // Scoring
  wireMonkeyLame: { name: 'Wire Monkey Lame', url: 'https://wiremonkey.com/?ref=BAKINGGREATBREAD' },
  // Baking/Dutch Oven
  bakingShellBoule: { name: 'Brød & Taylor Baking Shell (Boule)', url: 'https://collabs.shop/yfjaxt' },
  bakingShellBatard: { name: 'Brød & Taylor Baking Shell (Batard)', url: 'https://collabs.shop/8su3wv' },
  breadSteel: { name: 'Brød & Taylor Bread Steel', url: 'https://collabs.shop/soze7p' },
  // Bench work
  benchKnife: { name: 'Brød & Taylor Bench Knife', url: 'https://collabs.shop/i4ifmu' },
  // Proofing containers
  proofingContainer: { name: 'Brød & Taylor Proofing Container 6L', url: 'https://collabs.shop/6iguo3' },
  // Scale
  bakingScale: { name: 'Brød & Taylor High-Capacity Baking Scale', url: 'https://collabs.shop/bsdfl2' },
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
    id: 'tools-equipment',
    title: 'Tools & Equipment',
    description: 'Essential tools for your bread baking journey.',
    termIds: ['banneton', 'lame', 'dutch-oven', 'bench-scraper', 'digital-scale', 'probe-thermometer', 'baking-steel']
  }
];
