'use client';

import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (id: string | undefined) => void;
  locale: 'is' | 'en';
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory, locale }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 items-center">
      <Button 
        variant={!selectedCategory ? 'default' : 'outline'}
        onClick={() => onSelectCategory(undefined)}
        className={!selectedCategory ? 'bg-[var(--color-brand)] hover:bg-[#b02e0b]' : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)]'}
      >
        {locale === 'is' ? 'Allt' : 'All'}
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedCategory === cat.slug ? 'default' : 'outline'}
          onClick={() => onSelectCategory(selectedCategory === cat.slug ? undefined : cat.slug)}
          className={`gap-2 ${selectedCategory === cat.slug ? 'bg-[var(--color-brand)] hover:bg-[#b02e0b]' : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)]'}`}
        >
          <span>{cat.icon}</span>
          <span>{locale === 'is' ? cat.name_is : cat.name_en}</span>
        </Button>
      ))}
    </div>
  );
}
