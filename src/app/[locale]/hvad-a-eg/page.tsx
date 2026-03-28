import { IngredientMatcher } from '@/components/recipes/IngredientMatcher';
import { Pizza } from 'lucide-react';

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
