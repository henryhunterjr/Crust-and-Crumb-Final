import { GlossaryTermLinks } from '../types';

/**
 * Glossary Cross-Linking Data
 *
 * This file contains links to YouTube videos, Academy courses, and Recipe Pantry
 * recipes for each glossary term to provide deeper learning opportunities.
 */

export const GLOSSARY_TERM_LINKS: GlossaryTermLinks[] = [
  // === PRE-FERMENTS ===
  {
    termId: 'poolish',
    termName: 'Poolish',
    youtubeVideos: [
      {
        title: 'Poolish: The Art of Controlled Fermentation',
        url: 'https://www.youtube.com/watch?v=iBXM70XSs9c',
        description: 'Learn the fundamentals of poolish and how it develops flavor'
      },
      {
        title: 'HOW TO MAKE A "Poolish" For FOCACCIA BREAD',
        url: 'https://www.youtube.com/watch?v=5BJg4LVpvu8',
        description: 'Practical application of poolish in focaccia'
      }
    ],
    academyCourses: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4541eaf1',
        description: 'Deep dive into all pre-ferment types'
      }
    ],
    pantryRecipes: [
      {
        title: 'Sourdough Baguettes',
        url: 'https://pantry.bakinggreatbread.com/recipes/sourdough-baguettes'
      }
    ]
  },
  {
    termId: 'pate-fermentee',
    termName: 'Pâte Fermentée',
    youtubeVideos: [
      {
        title: 'Pâte Fermentée: The Original Pre-Ferment',
        url: 'https://www.youtube.com/watch?v=EGP27E99z1Q',
        description: 'Understanding the oldest pre-ferment technique'
      }
    ],
    academyCourses: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4541eaf1',
        description: 'Deep dive into all pre-ferment types'
      }
    ]
  },
  {
    termId: 'pre-ferment',
    termName: 'Pre-ferment',
    youtubeVideos: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.youtube.com/watch?v=TO2FWFxYGEY',
        description: 'Overview of all pre-ferment types and when to use each'
      }
    ],
    academyCourses: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4541eaf1',
        description: 'Deep dive into all pre-ferment types'
      }
    ]
  },
  {
    termId: 'biga',
    termName: 'Biga',
    youtubeVideos: [
      {
        title: 'Biga: Strength, Structure, and Control',
        url: 'https://www.youtube.com/watch?v=S7Vsh77cYMM',
        description: 'Learn how biga creates structure in Italian breads'
      }
    ],
    academyCourses: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4541eaf1',
        description: 'Deep dive into all pre-ferment types'
      }
    ]
  },
  {
    termId: 'sponge',
    termName: 'Sponge',
    academyCourses: [
      {
        title: 'Pre-Ferments: The Architecture of Flavor',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4541eaf1',
        description: 'Deep dive into all pre-ferment types'
      }
    ]
  },

  // === SOURDOUGH & STARTERS ===
  {
    termId: 'levain',
    termName: 'Levain',
    youtubeVideos: [
      {
        title: 'Levain is different from everything else',
        url: 'https://www.youtube.com/watch?v=FFejafGeL1I',
        description: 'Understanding what makes levain unique'
      }
    ],
    academyCourses: [
      {
        title: 'Sourdough Starter 101',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/5e132945',
        description: 'Complete guide to starters and levains'
      }
    ],
    pantryRecipes: [
      {
        title: 'Sourdough Baguettes',
        url: 'https://pantry.bakinggreatbread.com/recipes/sourdough-baguettes'
      }
    ]
  },
  {
    termId: 'sourdough-starter',
    termName: 'Sourdough Starter',
    youtubeVideos: [
      {
        title: 'Sourdough Starter 101: The Logic Behind the Jar',
        url: 'https://www.youtube.com/watch?v=R-afifYhJTg',
        description: 'Understanding starter science and maintenance'
      },
      {
        title: 'Caring for Your Sourdough Starter',
        url: 'https://www.youtube.com/watch?v=q-4pNeSTXCw',
        description: 'Daily maintenance and troubleshooting'
      }
    ],
    academyCourses: [
      {
        title: 'Sourdough Starter 101',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/5e132945',
        description: 'Complete guide to creating and maintaining starters'
      }
    ]
  },
  {
    termId: 'starter-maintenance',
    termName: 'Starter Maintenance',
    academyCourses: [
      {
        title: 'Sourdough Starter 101',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/5e132945',
        description: 'Complete guide to maintaining your starter'
      }
    ]
  },
  {
    termId: 'float-test',
    termName: 'Float Test',
    academyCourses: [
      {
        title: 'Sourdough Starter 101',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/5e132945',
        description: 'Learn about testing starter readiness'
      }
    ]
  },
  {
    termId: 'starter-flavor',
    termName: 'Starter Flavor',
    youtubeVideos: [
      {
        title: 'How to Control Flavor in Your Sourdough Starter',
        url: 'https://www.youtube.com/watch?v=gub1kAZVJ_Y',
        description: 'Techniques for controlling sour and mild flavors'
      }
    ],
    academyCourses: [
      {
        title: 'The Secret to Controlling Flavor in Sourdough',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/87ee00ae',
        description: 'Master the science of flavor control'
      }
    ]
  },
  {
    termId: 'flavor-control',
    termName: 'Flavor Control',
    academyCourses: [
      {
        title: 'The Secret to Controlling Flavor in Sourdough',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/87ee00ae',
        description: 'Master the science of flavor control'
      }
    ]
  },
  {
    termId: 'yeast-water',
    termName: 'Yeast Water',
    youtubeVideos: [
      {
        title: 'How to make a Green apple sourdough starter',
        url: 'https://www.youtube.com/watch?v=HM0DRqYn4hY',
        description: 'Create wild yeast starters from fruit'
      }
    ]
  },
  {
    termId: 'sourdough',
    termName: 'Sourdough',
    academyCourses: [
      {
        title: 'Sourdough for the Rest of Us Audio Overview',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/90180da8',
        description: 'Audio introduction to sourdough basics'
      }
    ]
  },

  // === MIXING & DEVELOPMENT TECHNIQUES ===
  {
    termId: 'autolyse',
    termName: 'Autolyse',
    youtubeVideos: [
      {
        title: 'The Autolyse. Artisan bakers do this. You should too.',
        url: 'https://www.youtube.com/watch?v=0JpxYq4Y8SM',
        description: 'Why autolyse improves your bread'
      }
    ],
    pantryRecipes: [
      {
        title: 'Browse Recipes Using Autolyse',
        url: 'https://pantry.bakinggreatbread.com/recipes'
      }
    ]
  },
  {
    termId: 'fermentolyse',
    termName: 'Fermentolyse',
    academyCourses: [
      {
        title: 'The Two Techniques That Changed My Bread',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4e8d30e0',
        description: 'Deep dive into fermentolyse and its benefits'
      }
    ],
    pantryRecipes: [
      {
        title: 'Browse Fermentolyse Recipes',
        url: 'https://pantry.bakinggreatbread.com/recipes'
      }
    ]
  },
  {
    termId: 'rubaud-method',
    termName: 'Rubaud Method',
    academyCourses: [
      {
        title: 'The Two Techniques That Changed My Bread',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/4e8d30e0',
        description: 'Learn the Rubaud mixing technique'
      }
    ]
  },
  {
    termId: 'stretch-and-fold',
    termName: 'Stretch and Fold',
    youtubeVideos: [
      {
        title: 'Kneading Techniques. The stretch and fold, and the coil fold.',
        url: 'https://www.youtube.com/watch?v=HZ9hvC0Zud8',
        description: 'Master both folding techniques'
      }
    ]
  },
  {
    termId: 'slap-and-fold',
    termName: 'Slap and Fold',
    youtubeVideos: [
      {
        title: 'The slap and fold kneading technique',
        url: 'https://www.youtube.com/watch?v=zaDS8JDvcdE',
        description: 'High-hydration dough development technique'
      }
    ]
  },
  {
    termId: 'coil-fold',
    termName: 'Coil Fold',
    youtubeVideos: [
      {
        title: 'The Coil Fold',
        url: 'https://www.youtube.com/watch?v=cQad8tu8KjY',
        description: 'Gentle strength building technique'
      },
      {
        title: 'First coil fold',
        url: 'https://www.youtube.com/watch?v=U6xpd2x4u1E',
        description: 'When to do your first fold'
      },
      {
        title: 'Coil Folds for Beginners',
        url: 'https://www.youtube.com/watch?v=fizNZ31RG0Q',
        description: 'Step-by-step beginner guide'
      }
    ],
    academyCourses: [
      {
        title: 'The Coil Fold: Strength Without Deflating',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom/9abb8a54',
        description: 'Master the coil fold technique'
      }
    ]
  },

  // === SHAPING ===
  {
    termId: 'shaping',
    termName: 'Shaping',
    youtubeVideos: [
      {
        title: 'Watch me work Bread shaping and bread scoring',
        url: 'https://www.youtube.com/watch?v=xyjhFP4v_VY',
        description: 'Real-time shaping demonstration'
      },
      {
        title: 'Bread Shaping and Decorating Masterclass',
        url: 'https://www.youtube.com/watch?v=477dCPv-Ji0',
        description: 'Advanced shaping and decoration'
      }
    ],
    pantryRecipes: [
      {
        title: 'Browse Shaped Bread Recipes',
        url: 'https://pantry.bakinggreatbread.com/recipes'
      }
    ]
  },
  {
    termId: 'braiding',
    termName: 'Braiding',
    youtubeVideos: [
      {
        title: 'How to Shape and braid a Nutella and Walnut bread',
        url: 'https://www.youtube.com/watch?v=EaMv-BPcUeU',
        description: 'Learn braiding techniques'
      }
    ]
  },
  {
    termId: 'shaping-buns',
    termName: 'Shaping Buns',
    youtubeVideos: [
      {
        title: 'Shaping Buns and Bowls!',
        url: 'https://www.youtube.com/watch?v=xiFty28aSHc',
        description: 'Perfect round shapes every time'
      }
    ]
  },

  // === SCORING ===
  {
    termId: 'scoring',
    termName: 'Scoring',
    youtubeVideos: [
      {
        title: 'Sourdough Scoring Fundamentals',
        url: 'https://www.youtube.com/watch?v=WqlSP1Xl-ck',
        description: 'Essential scoring techniques'
      }
    ],
    academyCourses: [
      {
        title: 'Advanced Scoring Techniques (Level 5)',
        url: 'https://www.skool.com/crust-crumb-academy-7621/classroom',
        description: 'Advanced patterns and techniques'
      }
    ]
  },
  {
    termId: 'ear',
    termName: 'Ear',
    youtubeVideos: [
      {
        title: 'How to Get the Perfect Sourdough Ear Every Time',
        url: 'https://www.youtube.com/watch?v=SPizZQ5iAwA',
        description: 'Techniques for achieving the perfect ear'
      }
    ]
  },
  {
    termId: 'decorative-scoring',
    termName: 'Decorative Scoring',
    youtubeVideos: [
      {
        title: 'Decorative Bread Scoring: Turn Your Loaves into Art',
        url: 'https://www.youtube.com/watch?v=biu5pvD0lj8',
        description: 'Artistic scoring patterns'
      }
    ]
  },

  // === BAKING & SCIENCE ===
  {
    termId: 'steam',
    termName: 'Steam',
    youtubeVideos: [
      {
        title: 'The Power of Steam: Elevating Your Bread',
        url: 'https://www.youtube.com/watch?v=cXARBVs0Dsc',
        description: 'How steam creates crust and oven spring'
      }
    ]
  },
  {
    termId: 'oven-spring',
    termName: 'Oven Spring',
    youtubeVideos: [
      {
        title: 'The Power of Steam: Elevating Your Bread',
        url: 'https://www.youtube.com/watch?v=cXARBVs0Dsc',
        description: 'Maximize your oven spring with proper steam'
      }
    ]
  },
  {
    termId: 'gluten',
    termName: 'Gluten',
    youtubeVideos: [
      {
        title: 'This is gluten! Gluten development.',
        url: 'https://www.youtube.com/watch?v=PpYVuuRsx5k',
        description: 'Visual guide to gluten development'
      }
    ]
  },
  {
    termId: 'windowpane-test',
    termName: 'Windowpane Test',
    youtubeVideos: [
      {
        title: 'This is gluten! Gluten development.',
        url: 'https://www.youtube.com/watch?v=PpYVuuRsx5k',
        description: 'See the windowpane test in action'
      }
    ]
  },
  {
    termId: 'bakers-percentage',
    termName: "Baker's Percentage",
    youtubeVideos: [
      {
        title: "Mastering the Baker's Percentage!",
        url: 'https://www.youtube.com/watch?v=1tRn-PlXk-g',
        description: 'Essential math for scaling recipes'
      }
    ]
  },
  {
    termId: 'hydration',
    termName: 'Hydration',
    youtubeVideos: [
      {
        title: "Mastering the Baker's Percentage!",
        url: 'https://www.youtube.com/watch?v=1tRn-PlXk-g',
        description: 'Understanding hydration percentages'
      }
    ]
  },
  {
    termId: 'bulk-fermentation',
    termName: 'Bulk Fermentation',
    youtubeVideos: [
      {
        title: "Henry's Foolproof Sourdough Recipe",
        url: 'https://www.youtube.com/watch?v=ubJWmOAN684',
        description: 'See bulk fermentation in a complete recipe'
      }
    ],
    pantryRecipes: [
      {
        title: 'Browse Sourdough Recipes',
        url: 'https://pantry.bakinggreatbread.com/recipes'
      }
    ]
  }
];

/**
 * Helper function to get links for a specific term
 */
export function getTermLinks(termId: string): GlossaryTermLinks | undefined {
  return GLOSSARY_TERM_LINKS.find(link => link.termId === termId);
}

/**
 * Helper function to check if a term has any learning links
 */
export function hasTermLinks(termId: string): boolean {
  const links = getTermLinks(termId);
  if (!links) return false;

  return Boolean(
    (links.youtubeVideos && links.youtubeVideos.length > 0) ||
    (links.academyCourses && links.academyCourses.length > 0) ||
    (links.pantryRecipes && links.pantryRecipes.length > 0)
  );
}
