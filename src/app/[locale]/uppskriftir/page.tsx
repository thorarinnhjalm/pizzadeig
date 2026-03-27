'use client';

import { useLocale } from 'next-intl';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Loader2, PlusCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

const CATEGORIES = [
  { key: '', label_is: 'Allt', label_en: 'All' },
  { key: 'deig', label_is: 'Deig', label_en: 'Dough' },
  { key: 'sosur', label_is: 'Sósur', label_en: 'Sauces' },
  { key: 'ostur', label_is: 'Ostur', label_en: 'Cheese' },
  { key: 'alegg', label_is: 'Álegg', label_en: 'Toppings' },
  { key: 'pizzur', label_is: 'Pizzur', label_en: 'Pizzas' },
];

export default function RecipesPage() {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';
  const { recipes, loading } = useRecipes();
  const [selected, setSelected] = useState('');

  const filtered = selected
    ? recipes.filter(r => r.category === selected)
    : recipes;

  return (
    <main className="flex-1 w-full bg-background min-h-screen">
      {/* Hero header */}
      <section className="pt-16 pb-8 text-center">
        <h1 className="font-display italic text-5xl md:text-7xl font-bold text-(--color-brand) mb-4">
          Uppskriftasafn
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-xl mx-auto leading-relaxed">
          {isIs
            ? 'Uppgötvaðu leyndarmálið á bak við fullkomna ítölsku pizzu. Frá hinu fullkomna súrdeigi yfir í bragðgóðar sósur.'
            : 'Discover the secrets behind perfect Italian pizza. From sourdough to flavorful sauces.'}
        </p>
        <Link
          href="/uppskriftir/ny"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-(--color-brand) text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          {isIs ? 'Deila uppskrift' : 'Share a recipe'}
        </Link>
      </section>

      {/* Filter pills */}
      <section className="pb-10">
        <div className="flex justify-center gap-3 flex-wrap px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selected === cat.key
                  ? 'bg-(--color-brand) text-white shadow-md'
                  : 'bg-(--color-bg-secondary) text-(--color-text-secondary) border border-(--color-border) hover:border-(--color-brand) hover:text-(--color-brand)'
              }`}
            >
              {isIs ? cat.label_is : cat.label_en}
            </button>
          ))}
        </div>
      </section>

      {/* Recipe grid */}
      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-(--color-brand)" />
            <p className="text-muted-foreground animate-pulse">
              {isIs ? 'Sæki uppskriftir...' : 'Loading recipes...'}
            </p>
          </div>
        ) : (
          <RecipeGrid recipes={filtered} locale={locale} />
        )}
      </section>
    </main>
  );
}
