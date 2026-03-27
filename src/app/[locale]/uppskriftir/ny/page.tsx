import { RecipeForm } from '@/components/recipes/RecipeForm';
import { Flame } from 'lucide-react';

export default async function NewRecipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="flex-1 w-full bg-(--bg-cream) py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--pizza-red)/10 text-(--pizza-red) mb-4">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-(--text-dark) mb-4 tracking-tight">Ný Uppskrift</h1>
          <p className="text-lg text-(--text-medium)">Deildu þinni frábæru pizzu uppskrift með samfélaginu. Hjálpumst að við að búa til betri pizzur!</p>
        </div>
        
        <RecipeForm locale={locale as 'is' | 'en'} />
      </div>
    </main>
  );
}
