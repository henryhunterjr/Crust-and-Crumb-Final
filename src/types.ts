
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
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: string; // Allow any category string from JSON
  difficulty: string; // Allow any difficulty string from JSON
  sources?: string[];
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

// Cross-linking types for YouTube, Academy, and Recipe Pantry
export interface YouTubeVideo {
  title: string;
  url: string;
  description?: string;
}

export interface AcademyCourse {
  title: string;
  url: string;
  description?: string;
}

export interface PantryRecipe {
  title: string;
  url: string;
}

export interface GlossaryTermLinks {
  termId: string;
  termName: string;
  youtubeVideos?: YouTubeVideo[];
  academyCourses?: AcademyCourse[];
  pantryRecipes?: PantryRecipe[];
}

// Analytics tracking for cross-link clicks
export interface CrossLinkClick {
  id: string;
  term_id: string;
  term_name: string;
  link_type: 'youtube' | 'academy' | 'pantry';
  destination_url: string;
  timestamp: string;
  session_id?: string;
}
