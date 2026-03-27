import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { mockRecipes } from '@/lib/mockData';
import { RecipeType } from '@/types/recipe';
import { Clock, BarChart3 } from 'lucide-react';

const validTypes: Record<string, { label_is: string; label_en: string; description_is: string; description_en: string; emoji: string }> = {
  deig: {
    label_is: 'Deig',
    label_en: 'Dough',
    description_is: 'Allt um pizzudeig — frá klassísku napólísku deigjunum til súrdeigs og alls þar á milli.',
    description_en: 'Everything about pizza dough — from classic Neapolitan to sourdough and everything in between.',
    emoji: '🫓',
  },
  sosur: {
    label_is: 'Sósur',
    label_en: 'Sauces',
    description_is: 'Pizzusósur sem breyta öllu. San Marzano tómatssósa, hvítlauksolía, pesto og fleira.',
    description_en: 'Pizza sauces that change everything. San Marzano tomato sauce, garlic oil, pesto, and more.',
    emoji: '🍅',
  },
  ostur: {
    label_is: 'Ostur',
    label_en: 'Cheese',
    description_is: 'Besti pizzuosturinn — frá mozzarella di bufala til pecorino romano og gorgonzola.',
    description_en: 'The best pizza cheese — from mozzarella di bufala to pecorino romano and gorgonzola.',
    emoji: '🧀',
  },
};

// Map URL slugs to RecipeType values
const slugToType: Record<string, RecipeType> = {
  deig: 'deig',
  sosur: 'sosa', // URL slug is "sosur" but type is "sosa"
  ostur: 'ostur',
};

function getDifficultyLabel(d: string, isIs: boolean) {
  if (d === 'audvelt') return isIs ? 'Auðvelt' : 'Easy';
  if (d === 'midlungs') return isIs ? 'Miðlungs' : 'Medium';
  return isIs ? 'Erfitt' : 'Advanced';
}

function getFermentTime(recipe: any): string {
  const total = recipe.rest_time_min || 0;
  if (total >= 60) return `${Math.round(total / 60)}h`;
  if (total > 0) return `${total}m`;
  const cook = recipe.prep_time_min + recipe.cook_time_min;
  return `${cook} mín`;
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; type: string }> }) {
  const { locale, type: slug } = await params;
  const isIs = locale === 'is';

  const categoryMeta = validTypes[slug];
  if (!categoryMeta) notFound();

  const recipeType = slugToType[slug];
  const recipes = mockRecipes.filter(r => r.type === recipeType && r.published);

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <span className="text-5xl mb-4 block">{categoryMeta.emoji}</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? categoryMeta.label_is : categoryMeta.label_en}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs ? categoryMeta.description_is : categoryMeta.description_en}
          </p>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-(--color-text-secondary)">
              {isIs ? 'Engar uppskriftir fundust í þessum flokki ennþá.' : 'No recipes found in this category yet.'}
            </p>
            <Link href="/uppskriftir" className="mt-6 inline-flex items-center gap-2 text-(--color-brand) font-bold hover:underline">
              {isIs ? 'Sjá allar uppskriftir' : 'See all recipes'} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => {
              const title = isIs ? recipe.title_is : recipe.title_en;
              const desc = isIs ? recipe.description_is : recipe.description_en;

              return (
                <Link
                  href={`/uppskriftir/${recipe.slug}`}
                  key={recipe.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-(--color-border) shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-56 relative overflow-hidden bg-(--color-bg-tertiary)">
                    {recipe.image_urls?.[0] && (
                      <Image
                        src={recipe.image_urls[0]}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-(--color-text-primary) mb-2 group-hover:text-(--color-brand) transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-6 line-clamp-2 flex-1">
                      {desc}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-(--color-border-light)">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {getFermentTime(recipe)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {getDifficultyLabel(recipe.difficulty, isIs)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
