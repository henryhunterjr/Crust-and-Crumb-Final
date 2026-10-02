
import { GlossaryItem, LearningPath } from './types';
import glossaryData from './data/public-glossary.json';
import slugAliases from './data/slugAliases.json';
import illustrations from './data/illustrations.json';

// Export glossary data from JSON (canonical entries plus source-backed cluster terms)
// Keep unfinished inventory additions in the source file, not the public glossary.
// Public copies also drop draft sources and internal editorial planning fields.
const normalizeWords = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const RELATION_ORDER: Record<string, number> = { 'canonical-article': 0, 'mentioned-in': 1, 'related-video': 2, 'related-recipe': 3, 'supporting-asset': 4 };

function publicSources(item: GlossaryItem): GlossaryItem['sourceRelations'] {
  if (!item.sourceRelations) return item.sourceRelations;
  const names = [item.term, ...(item.aliases || [])].map(normalizeWords).filter(Boolean);
  return item.sourceRelations
    .filter(source => !/draft|private|pending|unpublished/i.test(source.status || ''))
    .filter(source => !/[?&]p=\d+/.test(source.url || ''))
    .map(source => {
      // Only call an article the main read when it is actually about this term
      if (source.relation === 'canonical-article') {
        const title = normalizeWords(source.title || '');
        const isAbout = names.some(name => title.includes(name));
        return isAbout ? source : { ...source, relation: 'mentioned-in' as const };
      }
      return source;
    })
    .sort((a, b) => (RELATION_ORDER[a.relation] ?? 9) - (RELATION_ORDER[b.relation] ?? 9));
}

export const GLOSSARY_DATA: GlossaryItem[] = (glossaryData as GlossaryItem[])
  .filter(item => item.definitionStatus !== 'editorial-draft')
  .map(({ clusterPlan: _plan, ...item }) => ({
    ...item,
    sourceRelations: publicSources(item as GlossaryItem),
    illustration: (illustrations as Record<string, GlossaryItem['illustration']>)[item.id],
  }));

// Visitor-facing labels for source relationships
export const SOURCE_LABELS: Record<string, string> = {
  'canonical-article': 'Full article',
  'mentioned-in': 'Also covered in',
  'related-video': 'Video',
  'related-recipe': 'Recipe',
  'supporting-asset': 'Resource',
};

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
  breadSteel: { name: 'Brød & Taylor Bread Steel Max', url: 'https://collabs.shop/zd4dhw' },
  // Bench work
  benchKnife: { name: 'Brød & Taylor Bench Knife', url: 'https://collabs.shop/8vcnxu' },
  // Proofing containers
  proofingContainer: { name: 'Brød & Taylor Proofing Container 6L', url: 'https://collabs.shop/6iguo3' },
  // Scale
  nutriMill: { name: 'NutriMill Grain Mills', url: 'https://nutrimill.com/Academy26' },
  bakingScale: { name: 'Brød & Taylor High-Capacity Baking Scale', url: 'https://collabs.shop/hvryn6' },
};


// Partner features. Grand Teton grain photos sit on the matching grain terms; NutriMill sits on the milling terms.
export const GRAND_TETON_URL = 'https://www.ancientgrains.com/?utm_source=crust-and-crumb-glossary&utm_medium=referral&utm_campaign=grain-terms';
export const NUTRIMILL_URL = 'https://nutrimill.com/Academy26';
export const NUTRIMILL_CODE = 'ACADEMY26';

export interface GrainPhoto { src: string; alt: string; product: string }
export const GRAIN_PHOTOS: Record<string, GrainPhoto> = {
  'soft-white-wheat': { src: '/partners/grand-teton-soft-white.webp', alt: 'Grand Teton organic soft white wheat berries', product: 'Organic Soft White Wheat Berries' },
  'soft-wheat': { src: '/partners/grand-teton-soft-white.webp', alt: 'Grand Teton organic soft white wheat berries', product: 'Organic Soft White Wheat Berries' },
  'hard-white-wheat': { src: '/partners/grand-teton-hard-white.webp', alt: 'Grand Teton organic hard white wheat berries', product: 'Organic Hard White Wheat Berries' },
  'hard-red-spring-wheat': { src: '/partners/grand-teton-hard-red.webp', alt: 'Grand Teton organic Yecora Rojo hard red wheat berries', product: 'Organic Hard Red Wheat Berries (Yecora Rojo)' },
  'hard-red-winter-wheat': { src: '/partners/grand-teton-hard-red.webp', alt: 'Grand Teton organic hard red wheat berries', product: 'Organic Hard Red Wheat Berries' },
  'hard-wheat': { src: '/partners/grand-teton-hard-red.webp', alt: 'Grand Teton organic hard red wheat berries', product: 'Organic Hard Red Wheat Berries' },
  'durum-wheat': { src: '/partners/grand-teton-durum.webp', alt: 'Grand Teton organic durum wheat berries', product: 'Organic Durum Wheat Berries' },
  'rye-flour': { src: '/partners/grand-teton-rye.webp', alt: 'Grand Teton organic rye berries', product: 'Organic Rye Berries' },
  'khorasan-wheat': { src: '/partners/grand-teton-khorasan.webp', alt: 'Grand Teton organic khorasan berries', product: 'Organic Khorasan Berries' },
  'spelt-flour': { src: '/partners/grand-teton-spelt.webp', alt: 'Grand Teton organic spelt berries', product: 'Organic Spelt Berries' },
  'emmer': { src: '/partners/grand-teton-emmer.webp', alt: 'Grand Teton organic emmer berries', product: 'Organic Emmer Berries' },
  'farro': { src: '/partners/grand-teton-emmer.webp', alt: 'Grand Teton organic emmer berries, the usual farro', product: 'Organic Emmer Berries' },
  'einkorn': { src: '/partners/grand-teton-einkorn.webp', alt: 'Grand Teton organic einkorn berries', product: 'Organic Einkorn Berries' },
  'ancient-grain': { src: '/partners/grand-teton-khorasan.webp', alt: 'Grand Teton organic khorasan berries', product: 'Organic Ancient Grain Berries' },
  'heritage-grain': { src: '/partners/grand-teton-emmer.webp', alt: 'Grand Teton organic emmer berries', product: 'Organic Heritage and Ancient Grains' },
  'wheat-berry': { src: '/partners/grand-teton-hard-white.webp', alt: 'Grand Teton organic hard white wheat berries', product: 'Organic Wheat Berries' },
};
export const MILLING_TERM_IDS = ['home-milling', 'fresh-milled-flour', 'grain-mill', 'impact-mill', 'stone-mill', 'milling-temperature', 'particle-size', 'whole-wheat-flour', 'bran', 'extraction-rate', 'bolting', 'sifter', 'bolted-flour', 'high-extraction-flour', 'flour-freshness'];


// Featured Baker's Tool: keep this separate from the regular grouped links so it can receive flagship treatment.
export const FEATURED_TOOL = {
  eyebrow: 'Featured Tool',
  name: 'Starter & Levain Studio',
  headline: 'Know your starter. Build your levain.',
  blurb: 'Build the exact levain you need, feed your starter by ratio, plan multi-stage builds, scale your dough, and keep a peak journal that helps you learn your starter’s own rhythm.',
  cta: 'Open Starter & Levain Studio',
  url: 'https://bakinggreatbread.com/starter-levain-studio',
  image: '/brand/starter-levain-studio.webp',
  imageAlt: 'Starter & Levain Studio from Crust & Crumb Academy, with starter jar, bread, and planning tools',
} as const;

// Baker's Tools drawer: Henry's tools and resources, grouped the way a baker reaches for them.
export interface ToolLink { name: string; blurb: string; url: string }
export interface ToolGroup { id: string; title: string; blurb: string; links: ToolLink[] }
export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'calculators', title: 'Calculators and converters', blurb: 'Numbers you need mid-bake.',
    links: [
      { name: 'Sourdough to Yeast Converter', blurb: 'Swap starter for commercial yeast, or the other way around.', url: 'https://skoo.ly/sourdough-converter' },
      { name: 'Fermentation Compass', blurb: 'Dial in your bulk time from dough temperature and starter amount.', url: 'https://skoo.ly/fermentation-compass' },
      { name: 'Salt Converter', blurb: 'Kosher, table, sea: get the same saltiness by weight.', url: 'https://bakinggreatbread.com/salt-converter' },
      { name: 'Price Your Loaf', blurb: 'Free calculator for what a loaf costs you and what to charge.', url: 'https://skoo.ly/price-your-loaf' },
    ],
  },
  {
    id: 'milling', title: 'Fresh milling', blurb: 'From whole berries to the oven.',
    links: [
      { name: 'The Mill', blurb: 'Grain guides, milling how-tos, and what to bake with each wheat.', url: 'https://skoo.ly/the-mill' },
      { name: 'Fresh-Milled Recipes', blurb: 'Recipes written for flour you ground this morning.', url: 'https://skoo.ly/fresh-mill-recipes' },
      { name: 'NutriMill, $20 off with ACADEMY26', blurb: 'The mill I use. Academy bakers save on it.', url: 'https://nutrimill.com/Academy26' },
    ],
  },
  {
    id: 'recipes', title: 'Recipes and guides', blurb: 'Something to bake this week.',
    links: [
      { name: 'Recipe Pantry', blurb: 'Every recipe, with the glossary linked right in the steps.', url: 'https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=tools-drawer' },
      { name: 'Recipe Pantry Pro', blurb: 'The pro version: scaling, baker\'s math, and your own recipe box.', url: 'https://skoo.ly/pantry-pro-landing' },
      { name: 'Holiday Bake', blurb: 'The seasonal bake-along, start to finish.', url: 'https://skoo.ly/holiday-bake' },
      { name: 'Holiday Shoppers Guide', blurb: 'Gifts for the baker on your list, tested by me.', url: 'https://skoo.ly/holiday-guide' },
    ],
  },
  {
    id: 'business', title: 'Selling your bread', blurb: 'When the kitchen becomes a business.',
    links: [
      { name: 'Storefront Builder', blurb: 'Give your bakery a place online, without code.', url: 'https://skoo.ly/get-your-storefront' },
      { name: 'From Oven to Market', blurb: 'The course for turning a home bakery into income.', url: 'https://www.skool.com/from-oven-to-market' },
    ],
  },
  {
    id: 'learn', title: 'Learn and connect', blurb: 'The rest of the kitchen.',
    links: [
      { name: 'The Bread Authority', blurb: 'The hub that ties the blog, videos, and this glossary together.', url: 'https://skoo.ly/bread-authority' },
      { name: 'Crust & Crumb Academy', blurb: 'Post a bake and get real eyes on it, from me or the community.', url: 'https://www.skool.com/crust-crumb-academy-7621' },
      { name: 'Baking Great Bread at Home', blurb: 'The website and the blog behind all of this.', url: 'https://skoo.ly/my-website' },
    ],
  },
];


// Contextual tools: only surface a tool when it helps the baker act on the definition they are reading.
export interface RelatedToolLink { name: string; blurb: string; url: string; cta: string }

export const RELATED_TOOL_LIBRARY = {
  bakersPercentage: {
    name: "Baker's Percentage Calculator",
    blurb: "Put the percentages to work. Enter your flour and hydration and turn the formula into practical dough weights.",
    url: '/?tool=calculator',
    cta: 'Open calculator',
  },
  starterStudio: {
    name: 'Starter & Levain Studio',
    blurb: 'Build a levain, feed your starter by ratio, plan multiple stages, scale a dough, and learn your own peak timing.',
    url: FEATURED_TOOL.url,
    cta: 'Open Starter & Levain Studio',
  },
  fermentationCompass: {
    name: 'Fermentation Compass',
    blurb: 'Use dough temperature and starter amount to plan a practical bulk-fermentation window.',
    url: 'https://skoo.ly/fermentation-compass',
    cta: 'Open Fermentation Compass',
  },
  yeastConverter: {
    name: 'Sourdough to Yeast Converter',
    blurb: 'Convert a bread formula between sourdough starter and commercial yeast without doing the math by hand.',
    url: 'https://skoo.ly/sourdough-converter',
    cta: 'Open converter',
  },
  mill: {
    name: 'The Mill',
    blurb: 'Match grains, milling choices, and fresh-milled recipes to the flour you are working with.',
    url: 'https://skoo.ly/the-mill',
    cta: 'Open The Mill',
  },
  starterGuide: {
    name: 'Sourdough Starter Guide',
    blurb: 'Use the starter guide for maintenance, recovery, feeding, and common starter problems.',
    url: 'https://skoo.ly/starter-guide',
    cta: 'Open Starter Guide',
  },
} satisfies Record<string, RelatedToolLink>;

export const RELATED_TOOLS_BY_TERM: Record<string, RelatedToolLink[]> = {
  'bakers-percentage': [RELATED_TOOL_LIBRARY.bakersPercentage],
  hydration: [RELATED_TOOL_LIBRARY.bakersPercentage],

  'sourdough-starter': [RELATED_TOOL_LIBRARY.starterStudio, RELATED_TOOL_LIBRARY.starterGuide],
  levain: [RELATED_TOOL_LIBRARY.starterStudio],
  feeding: [RELATED_TOOL_LIBRARY.starterStudio, RELATED_TOOL_LIBRARY.starterGuide],
  'feeding-ratio': [RELATED_TOOL_LIBRARY.starterStudio],
  peak: [RELATED_TOOL_LIBRARY.starterStudio],
  'stiff-starter': [RELATED_TOOL_LIBRARY.starterStudio],
  'young-levain': [RELATED_TOOL_LIBRARY.starterStudio],
  hooch: [RELATED_TOOL_LIBRARY.starterGuide],
  'overripe-starter': [RELATED_TOOL_LIBRARY.starterGuide],
  'float-test': [RELATED_TOOL_LIBRARY.starterGuide],

  fermentation: [RELATED_TOOL_LIBRARY.fermentationCompass],
  'bulk-fermentation': [RELATED_TOOL_LIBRARY.fermentationCompass],
  'bulk-rise-target': [RELATED_TOOL_LIBRARY.fermentationCompass],
  'desired-dough-temperature': [RELATED_TOOL_LIBRARY.fermentationCompass],

  yeast: [RELATED_TOOL_LIBRARY.yeastConverter],
  'active-dry-yeast': [RELATED_TOOL_LIBRARY.yeastConverter],
  'instant-yeast': [RELATED_TOOL_LIBRARY.yeastConverter],

  'grain-mill': [RELATED_TOOL_LIBRARY.mill],
  'home-milling': [RELATED_TOOL_LIBRARY.mill],
  'fresh-milled-flour': [RELATED_TOOL_LIBRARY.mill],
  'wheat-berry': [RELATED_TOOL_LIBRARY.mill],
  'ancient-grain': [RELATED_TOOL_LIBRARY.mill],
  'stone-mill': [RELATED_TOOL_LIBRARY.mill],
  'impact-mill': [RELATED_TOOL_LIBRARY.mill],
  'particle-size': [RELATED_TOOL_LIBRARY.mill],
  bran: [RELATED_TOOL_LIBRARY.mill],
  bolting: [RELATED_TOOL_LIBRARY.mill],
  sifter: [RELATED_TOOL_LIBRARY.mill],
};

// External resource URLs
export const EXTERNAL_URLS = {
  starterGuide: 'https://sourdough-starter-master-kxo6qxb.gamma.site/',
  bookPage: 'https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest',
  facebookGroup: 'https://www.facebook.com/groups/1082865755403754',
  blog: 'https://bakinggreatbread.blog',
};

// Special path ID for Baking Tools (opens modal instead of filtering)

// "Diagnose a problem": a symptom a baker sees, mapped to the terms that explain it and fix it.
export interface Symptom { id: string; label: string; termIds: string[] }
export const SYMPTOMS: Symptom[] = [
  { id: 'flat-loaf', label: 'My loaf spread flat', termIds: ['pancaking', 'overproofed', 'surface-tension', 'shaping', 'gluten', 'hydration', 'underfermented', 'flour-strength'] },
  { id: 'dense-heavy', label: 'Dense and heavy', termIds: ['dense-crumb', 'underfermented', 'underproofed', 'bulk-rise-target', 'sourdough-starter', 'peak', 'kneading', 'windowpane-test'] },
  { id: 'gummy-inside', label: 'Gummy or wet inside', termIds: ['gummy-crumb', 'underfermented', 'probe-thermometer', 'cooling-rack', 'hydration', 'starch-attack', 'sprout-damage'] },
  { id: 'big-holes', label: 'Big holes, dense around them', termIds: ['fools-crumb', 'underfermented', 'degassing', 'shaping', 'tunneling'] },
  { id: 'no-rise', label: 'No oven spring', termIds: ['oven-spring', 'overproofed', 'oven-steam', 'baking-steel', 'dutch-oven', 'scoring', 'surface-tension', 'pale-crust'] },
  { id: 'pale-crust', label: "Crust didn't brown", termIds: ['pale-crust', 'maillard-reaction', 'caramelization', 'oven-steam', 'diastatic-malt', 'oven-thermometer', 'overproofed'] },
  { id: 'burst-side', label: 'Burst on the side', termIds: ['blowout', 'scoring', 'underproofed', 'ear', 'oven-steam'] },
  { id: 'flying-crust', label: 'Crust lifted off the crumb', termIds: ['flying-crust', 'shaping', 'degassing', 'oven-steam'] },
  { id: 'soupy-dough', label: 'Dough turned to soup', termIds: ['hydration', 'overmixing', 'protease', 'sprout-damage', 'flour-strength', 'bassinage', 'slap-and-fold', 'desired-dough-temperature'] },
  { id: 'sticky-dough', label: 'Sticky, hard to shape', termIds: ['hydration', 'bench-rest', 'pre-shape', 'bench-scraper', 'surface-tension', 'stitching', 'fresh-milled-flour'] },
  { id: 'stuck-basket', label: 'Stuck to the basket', termIds: ['banneton-sticking', 'banneton', 'banneton-liner', 'rice-flour', 'overproofed'] },
  { id: 'starter-trouble', label: "Starter won't rise", termIds: ['sourdough-starter', 'feeding', 'feeding-ratio', 'hooch', 'peak', 'float-test', 'desired-dough-temperature', 'proofing-box'] },
  { id: 'sour-or-flat-taste', label: 'Too sour, or no flavor', termIds: ['acetic-acid', 'lactic-acid', 'retarding', 'feeding-ratio', 'overripe-starter', 'young-levain', 'salt'] },
  { id: 'stale-fast', label: 'Stales fast', termIds: ['retrogradation', 'tangzhong', 'hydration', 'enriched-dough', 'cooling-rack'] },
];

export const BAKING_TOOLS_PATH_ID = 'baking-tools';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'beginner-basics',
    title: 'Beginner Basics',
    description: 'Start here! The fundamental building blocks of all great bread.',
    termIds: ['hydration', 'gluten', 'kneading', 'windowpane-test', 'fermentation', 'proofing', 'scoring', 'oven-spring', 'crumb']
  },
  {
    id: 'sourdough-mastery',
    title: 'Sourdough Mastery',
    description: 'The "Sourdough for the Rest of Us" Companion Path.',
    termIds: [
      'sourdough-starter',
      'bakers-percentage',
      'fermentolyse',
      'stretch-and-fold',
      'coil-fold',
      'bulk-fermentation',
      'cold-proof',
      'scoring'
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
    termIds: ['wheat-berry', 'hard-white-wheat', 'home-milling', 'fresh-milled-flour', 'bran', 'extraction-rate', 'bolting', 'bran-soaker', 'rye-flour', 'spelt-flour', 'einkorn', 'khorasan-wheat']
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'What went wrong with that loaf, and how to fix it next time.',
    termIds: ['underfermented', 'dense-crumb', 'gummy-crumb', 'fools-crumb', 'tunneling', 'flying-crust', 'underproofed', 'overproofed', 'pancaking', 'banneton-sticking', 'blowout', 'pale-crust']
  },
  {
    id: 'tools-equipment',
    title: 'Tools & Equipment',
    description: 'Essential tools for your bread baking journey.',
    termIds: ['digital-scale', 'bench-scraper', 'banneton', 'lame', 'dutch-oven', 'baking-steel', 'probe-thermometer']
  }
];
