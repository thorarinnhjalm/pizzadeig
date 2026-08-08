import { RecipeForm } from '@/components/recipes/RecipeForm';
import { localeAlternates } from '@/lib/seo';
import { Flame } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'is' ? 'Ný uppskrift | Pizzadeig.is' : 'New Recipe | Pizzadeig.is',
    // Form page: keep out of the index and stop it inheriting the list page's canonical
    robots: { index: false, follow: true },
    alternates: localeAlternates(locale, '/uppskriftir/ny'),
  };
}

export default async function NewRecipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="flex-1 w-full bg-(--color-bg-light) py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--color-brand)/10 text-(--color-brand) mb-4">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-(--color-text-primary) mb-4 tracking-tight">Ný Uppskrift</h1>
          <p className="text-lg text-(--color-text-secondary)">Deildu þinni frábæru pizzu uppskrift með samfélaginu. Hjálpumst að við að búa til betri pizzur!</p>
        </div>
        
        <RecipeForm locale={locale as 'is' | 'en'} />
      </div>
    </main>
  );
}
