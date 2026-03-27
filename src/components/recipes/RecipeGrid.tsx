import { Recipe } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  locale: 'is' | 'en';
}

export function RecipeGrid({ recipes, locale }: RecipeGridProps) {
  if (!recipes?.length) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground">
        <p>{locale === 'is' ? 'Engar uppskriftir fundust.' : 'No recipes found.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} locale={locale} />
      ))}
    </div>
  );
}
