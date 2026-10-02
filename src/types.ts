
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum Category {
  INGREDIENT = 'Ingredient',
  TOOL = 'Tool',
  TECHNIQUE = 'Technique',
  PROCESS = 'Process',
  BREAD_TYPE = 'Bread',
  PIZZA = 'Pizza',
  SCHEDULE = 'Schedule',
  SCIENTIFIC = 'Scientific/Technical',
  TROUBLESHOOTING = 'Troubleshooting',
  GRAIN = 'Grain & Milling',
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: string; // Allow any category string from JSON
  difficulty: string; // Allow any difficulty string from JSON
  sources?: string[];
  keywords?: string[];
  whyItMatters?: string;
  practicalExample?: string;
  sensoryCues?: string;
  nuance?: string;
  contentCheckedOn?: string;
  entryRole?: 'major' | 'supporting';
  nextResource?: { label: string; url: string };
  references?: { title: string; publisher: string; author?: string; url: string; supports: string }[];
  links?: {
    label: string;
    url: string;
  }[];
  // Enhanced features
  pronunciation?: string;
  shortDefinition?: string;
  henrysTips?: string[];
  commonMistakes?: string[];
  relatedTermIds?: string[];
  relatedRecipes?: { name: string; url?: string }[];
  troubleshooting?: { problem: string; solution: string }[];
  widgets?: ('calculator' | 'timer' | 'converter')[];
  alternateQuestions?: string[];
  history?: string;
  difficultyExplanation?: string;
  affiliateTools?: { name: string; url: string }[];
  mediaPlaceholder?: ('image' | 'video')[];
  // Resource Fields
  youtubeQuery?: string;
  bookRef?: string | boolean; // Can be string like "Sourdough for the Rest of Us" or boolean
  bookChapter?: string;
  // Starter-related flag
  starterRelated?: boolean;
  /** Alternate labels from the supplied cluster plan that resolve to this canonical entry. */
  aliases?: string[];
  /** Editorial state of the definition; missing means legacy content. */
  definitionStatus?: 'verified' | 'editorial-draft';
  /** Exact plan metadata retained separately from the editorial definition. */
  clusterPlan?: GlossaryClusterPlan;
  /** Source-backed relationships derived from the supplied inventories. */
  sourceRelations?: GlossarySourceRelation[];
  /** Line illustration shown on the card and term page. */
  illustration?: { src: string; alt: string; caption: string };
}

export interface GlossaryClusterPlan {
  termType: string;
  postsWithTermInTitle: number;
  postsMentioningTerm: number;
  draftsWithTermInTitle: number;
  bestExistingPost: string;
  bestPostUrl: string;
  bestPostWordCount: number;
  supportingVideoExists: boolean;
  recommendedAction: string;
}

export type GlossaryRelationType =
  | 'canonical-article'
  | 'mentioned-in'
  | 'related-video'
  | 'related-recipe'
  | 'supporting-asset';

export interface GlossarySourceRelation {
  sourceSystem: 'BakingGreatBread.blog' | 'YouTube' | 'Recipe Pantry' | 'From Oven to Market';
  relation: GlossaryRelationType;
  title: string;
  url?: string;
  status?: string;
  sourceRecordId?: string;
  evidence: 'direct' | 'derived';
  wordCount?: number | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  termIds: string[];
}
