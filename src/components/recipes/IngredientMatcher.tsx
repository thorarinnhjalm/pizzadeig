'use client';

import { useState, useMemo } from 'react';
import { Search, X, Pizza } from 'lucide-react';
import { mockRecipes } from '@/lib/mockData';
import { Recipe } from '@/types/recipe';
import Link from 'next/link';
import Image from 'next/image';

const COMMON_INGREDIENTS_IS = [
  'Mjöl', 'Vatn', 'Salt', 'Ger', 'Ólífuolía', 'Tómatar', 'Mozzarella', 'Basil',
  'Hvítlaukur', 'Pepperoni', 'Sveppir', 'Laukur', 'Paprika', 'Skinku', 'Ananas',
  'Parmesan', 'Rjómi', 'Ricotta', 'Oregano', 'Chili',
];

const COMMON_INGREDIENTS_EN = [
  'Flour', 'Water', 'Salt', 'Yeast', 'Olive oil', 'Tomatoes', 'Mozzarella', 'Basil',
  'Garlic', 'Pepperoni', 'Mushrooms', 'Onion', 'Bell pepper', 'Ham', 'Pineapple',
  'Parmesan', 'Cream', 'Ricotta', 'Oregano', 'Chili',
];

interface Props {
  locale: 'is' | 'en';
}

export function IngredientMatcher({ locale }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState('');
  const commonIngredients = locale === 'is' ? COMMON_INGREDIENTS_IS : COMMON_INGREDIENTS_EN;

  const toggleIngredient = (ing: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(ing)) next.delete(ing); else next.add(ing);
      return next;
    });
  };

  const addCustom = () => {
    if (customInput.trim()) {
      setSelected(prev => new Set([...prev, customInput.trim()]));
      setCustomInput('');
    }
  };

  const matchedRecipes = useMemo(() => {
    if (selected.size === 0) return [];

    const selectedArr = Array.from(selected).map(s => s.toLowerCase());

    return mockRecipes
      .map(recipe => {
        const ingredients = locale === 'is' ? recipe.ingredients_is : recipe.ingredients_en;
        const ingredientNames = ingredients.map(i => i.name.toLowerCase());
        const matches = selectedArr.filter(s => ingredientNames.some(n => n.includes(s)));
        const score = matches.length / ingredientNames.length;
        return { recipe, score, matchCount: matches.length };
      })
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [selected, locale]);

  return (
    <div className="space-y-12">
      {/* Ingredient selector */}
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 shadow-md">
        <h2 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-6">
          {locale === 'is' ? 'Veldu hráefni sem þú átt:' : 'Select ingredients you have:'}
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {commonIngredients.map(ing => (
            <button
              key={ing}
              onClick={() => toggleIngredient(ing)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selected.has(ing)
                  ? 'bg-[var(--color-brand)] text-white shadow-md'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-warm)] border border-[var(--color-border-light)]'
              }`}
            >
              {ing}
              {selected.has(ing) && <X className="w-3 h-3 ml-1.5 inline" />}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder={locale === 'is' ? 'Bættu við öðru hráefni...' : 'Add another ingredient...'}
            className="flex-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand)]"
          />
          <button onClick={addCustom} className="btn-primary px-6 rounded-xl">+</button>
        </div>

        {selected.size > 0 && (
          <p className="text-sm text-[var(--color-text-tertiary)] mt-4">
            {selected.size} {locale === 'is' ? 'hráefni valin' : 'ingredients selected'}
            <button onClick={() => setSelected(new Set())} className="ml-3 text-[var(--color-brand)] font-bold hover:underline">
              {locale === 'is' ? 'Hreinsa allt' : 'Clear all'}
            </button>
          </p>
        )}
      </div>

      {/* Results */}
      {selected.size > 0 && (
        <div>
          <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-6">
            {matchedRecipes.length > 0
              ? `${matchedRecipes.length} ${locale === 'is' ? 'uppskriftir fundust' : 'recipes found'}`
              : (locale === 'is' ? 'Engar uppskriftir fundust 😢' : 'No recipes found 😢')
            }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedRecipes.map(({ recipe, score, matchCount }) => {
              const title = locale === 'is' ? recipe.title_is : recipe.title_en;
              return (
                <Link
                  key={recipe.id}
                  href={`/${locale}/uppskriftir/${recipe.slug}`}
                  className="group bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex"
                >
                  <div className="w-32 h-32 relative shrink-0 bg-[var(--color-bg-tertiary)]">
                    {recipe.image_urls?.[0] && (
                      <Image src={recipe.image_urls[0]} alt={title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="p-4 flex-1 min-w-0">
                    <h4 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] truncate">{title}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                      {locale === 'is' ? recipe.description_is : recipe.description_en}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-2 py-0.5 rounded">
                        {matchCount} {locale === 'is' ? 'hráefni passa' : 'ingredients match'}
                      </span>
                      <span className="text-xs text-[var(--color-gold)] font-bold">
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
