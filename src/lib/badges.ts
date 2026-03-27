export interface Badge {
  id: string;
  name_is: string;
  name_en: string;
  description_is: string;
  description_en: string;
  icon: string;
  criteria: string;
}

export const BADGES: Badge[] = [
  {
    id: 'first_pizza',
    name_is: 'Fyrsta pizzan',
    name_en: 'First Pizza',
    description_is: 'Skoðaðu fyrstu uppskriftina þína',
    description_en: 'Viewed your first recipe',
    icon: '🍕',
    criteria: 'recipes_viewed >= 1',
  },
  {
    id: 'reviewer',
    name_is: 'Umsagnarmeistari',
    name_en: 'Review Master',
    description_is: 'Skrifaðu 5 umsagnir',
    description_en: 'Write 5 reviews',
    icon: '📝',
    criteria: 'reviews_count >= 5',
  },
  {
    id: 'author',
    name_is: 'Uppskriftahöfundur',
    name_en: 'Recipe Author',
    description_is: 'Sendu inn uppskrift',
    description_en: 'Submit a recipe',
    icon: '🧑‍🍳',
    criteria: 'recipes_submitted >= 1',
  },
  {
    id: 'dough_master',
    name_is: 'Deigdrottning',
    name_en: 'Dough Master',
    description_is: 'Notaðu deigreiknivélina',
    description_en: 'Use the dough calculator',
    icon: '🔥',
    criteria: 'dough_calculator_used >= 1',
  },
  {
    id: 'photographer',
    name_is: 'Ljósmyndari',
    name_en: 'Photographer',
    description_is: 'Hladdu upp mynd af pizzunni þinni',
    description_en: 'Upload a photo of your pizza',
    icon: '📸',
    criteria: 'gallery_uploads >= 1',
  },
  {
    id: 'explorer',
    name_is: 'Staðakönnuður',
    name_en: 'Explorer',
    description_is: 'Skoðaðu 10 pizzustaði',
    description_en: 'Visit 10 restaurant pages',
    icon: '🗺️',
    criteria: 'restaurants_viewed >= 10',
  },
  {
    id: 'social',
    name_is: 'Deilirinn',
    name_en: 'Sharer',
    description_is: 'Deildu uppskrift á samfélagsmiðlum',
    description_en: 'Share a recipe on social media',
    icon: '🔗',
    criteria: 'shares >= 1',
  },
  {
    id: 'legend',
    name_is: 'Goðsögn',
    name_en: 'Legend',
    description_is: 'Opnaðu öll önnur merki',
    description_en: 'Unlock all other badges',
    icon: '👑',
    criteria: 'all_badges_unlocked',
  },
];

export interface UserStats {
  recipes_viewed: number;
  reviews_count: number;
  recipes_submitted: number;
  dough_calculator_used: number;
  gallery_uploads: number;
  restaurants_viewed: number;
  shares: number;
}

export function getUnlockedBadges(stats: UserStats): string[] {
  const unlocked: string[] = [];

  if (stats.recipes_viewed >= 1) unlocked.push('first_pizza');
  if (stats.reviews_count >= 5) unlocked.push('reviewer');
  if (stats.recipes_submitted >= 1) unlocked.push('author');
  if (stats.dough_calculator_used >= 1) unlocked.push('dough_master');
  if (stats.gallery_uploads >= 1) unlocked.push('photographer');
  if (stats.restaurants_viewed >= 10) unlocked.push('explorer');
  if (stats.shares >= 1) unlocked.push('social');

  // Legend = all others unlocked
  const otherBadges = BADGES.filter(b => b.id !== 'legend');
  if (otherBadges.every(b => unlocked.includes(b.id))) {
    unlocked.push('legend');
  }

  return unlocked;
}
