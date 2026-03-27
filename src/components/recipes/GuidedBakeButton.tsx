'use client';

import { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuidedBake } from './GuidedBake';
import { Recipe } from '@/types/recipe';

interface Props {
  recipe: Recipe;
  locale: 'is' | 'en';
}

export function GuidedBakeButton({ recipe, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const steps = locale === 'is' ? recipe.steps_is : recipe.steps_en;

  if (!steps || steps.length === 0) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="btn-primary h-14 px-8 text-lg gap-3 shadow-lg shadow-(--color-brand)/20 hover:shadow-(--color-brand)/40 transition-all hover:-translate-y-0.5"
      >
        <ChefHat className="w-6 h-6" />
        {locale === 'is' ? 'Byrja bakstur 🔥' : 'Start baking 🔥'}
      </Button>

      {isOpen && (
        <GuidedBake recipe={recipe} locale={locale} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
