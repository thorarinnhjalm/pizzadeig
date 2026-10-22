import { Recipe } from '@/types/recipe';
import { allRecipes } from '@/lib/recipeData';

const codeRecipesById = new Map(allRecipes.map(r => [r.id, r]));

// Recipes that exist in code (recipeData.ts) are mirrored in Firestore by the admin seed under the
// same document id, so a Firestore copy can carry stale images. For those, the image always comes
// from the code. Matching needs both the document id and the slug, so a user recipe that happens to
// share a title/slug with a code recipe keeps its own images.
export function withCodeImages<T extends Pick<Recipe, 'id' | 'slug' | 'image_urls'>>(recipe: T): T {
  const code = codeRecipesById.get(recipe.id);
  if (!code || code.slug !== recipe.slug || !code.image_urls?.length) return recipe;
  return { ...recipe, image_urls: [...code.image_urls] };
}
