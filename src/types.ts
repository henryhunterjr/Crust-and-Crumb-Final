
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
