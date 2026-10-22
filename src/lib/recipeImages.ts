import { Recipe } from '@/types/recipe';
import { allRecipes } from '@/lib/recipeData';

const codeImagesBySlug = new Map(allRecipes.filter(r => r.slug).map(r => [r.slug, r.image_urls]));

// Recipes that exist in code (recipeData.ts) are mirrored in Firestore by the admin seed, so a
// Firestore copy can carry stale images. For those, the image always comes from the code;
// recipes submitted by users (only in Firestore) keep their own images.
export function withCodeImages<T extends Pick<Recipe, 'slug' | 'image_urls'>>(recipe: T): T {
  const images = recipe.slug ? codeImagesBySlug.get(recipe.slug) : undefined;
  return images ? { ...recipe, image_urls: images } : recipe;
}
