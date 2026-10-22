import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';
import { IngredientMatcher } from '@/components/recipes/IngredientMatcher';
import { Pizza } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/hvad-a-eg'),
    title: isIs
      ? 'Hvað á ég? — Finndu pizzuuppskrift út frá hráefnunum | Pizzadeig.is'
      : 'What Do I Have? — Find a Pizza Recipe by Your Ingredients | Pizzadeig.is',
    description: isIs
      ? 'Veldu hráefnin sem þú átt heima og finndu pizzuuppskriftir sem passa við þau.'
      : 'Select the ingredients you have at home and find pizza recipes that match them.',
  };
}

export default async function HvadAEgPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="flex-1 bg-background min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary to-(--color-brand-dark) mb-6 shadow-lg shadow-primary/20">
              <Pizza className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              {locale === 'is' ? 'Hvað á ég?' : 'What do I have?'}
            </h1>
            <p className="text-xl text-(--color-text-secondary) font-body max-w-2xl mx-auto">
              {locale === 'is'
                ? 'Veldu hráefnin sem þú átt heima og við finnum uppskriftir sem passa!'
                : 'Select the ingredients you have at home and we\'ll find matching recipes!'}
            </p>
          </div>
          <IngredientMatcher locale={locale as 'is' | 'en'} />
        </div>
      </section>
    </main>
  );
}
