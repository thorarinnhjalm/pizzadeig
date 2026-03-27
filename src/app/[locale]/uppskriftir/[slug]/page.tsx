import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { recipeJsonLd } from '@/lib/seo';
import { IngredientList } from '@/components/recipes/IngredientList';
import { StepByStep } from '@/components/recipes/StepByStep';
import { ReviewList } from '@/components/community/ReviewList';
import { ReviewForm } from '@/components/community/ReviewForm';
import { Clock, Flame, Users, ChefHat, Star } from 'lucide-react';

import { mockRecipes } from '@/lib/mockData';

async function getRecipe(slug: string): Promise<Recipe | null> {
  // Use mockData temporarily to prevent Next.js build hangs
  const recipe = mockRecipes.find(r => r.slug === slug);
  return recipe || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return {};
  
  const title = locale === 'is' ? recipe.seo_title_is || recipe.title_is : recipe.seo_title_en || recipe.title_en;
  const description = locale === 'is' ? recipe.seo_description_is || recipe.description_is : recipe.seo_description_en || recipe.description_en;

  return {
    title: `${title} | Pizzadeig.is`,
    description,
    openGraph: {
      images: recipe.image_urls?.[0] ? [recipe.image_urls[0]] : [],
    },
    alternates: {
      canonical: `https://pizzadeig.is/${locale}/uppskriftir/${slug}`,
    }
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const title = locale === 'is' ? recipe.title_is : recipe.title_en;
  const description = locale === 'is' ? recipe.description_is : recipe.description_en;
  const totalTime = recipe.prep_time_min + recipe.cook_time_min + recipe.rest_time_min;
  const jsonLd = recipeJsonLd(recipe, locale);

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h} klst ${m} mín` : `${h} klst`;
    }
    return `${minutes} mín`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 w-full bg-[var(--bg-cream)]">
        {/* Hero Section */}
        <section className="w-full relative h-[40vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] flex items-end pb-12">
          {recipe.image_urls?.[0] ? (
            <>
              <Image 
                src={recipe.image_urls[0]} 
                alt={title || 'Recipe Image'}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[var(--text-dark)]" />
          )}
          
          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="w-full max-w-4xl backdrop-blur-md bg-black/30 p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--pizza-gold)] text-black text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                {recipe.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md leading-tight">
                {title}
              </h1>
              <p className="text-xl text-gray-200 mb-6 drop-shadow-sm max-w-2xl leading-relaxed">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                  <Clock className="w-5 h-5 text-[var(--pizza-gold)]" />
                  <span className="font-semibold">{formatTime(totalTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                  <Flame className="w-5 h-5 text-[var(--pizza-red)]" />
                  <span className="font-semibold capitalize">{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{recipe.servings} {locale === 'is' ? 'skammtar' : 'servings'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {recipe.author_avatar ? (
                  <Image src={recipe.author_avatar} alt={recipe.author_name} width={40} height={40} className="rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--pizza-red)] flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <ChefHat className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">{locale === 'is' ? 'Höfundur' : 'Author'}</p>
                  <p className="font-bold text-white text-sm">{recipe.author_name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content (Left, 2 cols wide on LG) */}
            <div className="lg:col-span-2 space-y-12">
              <IngredientList recipe={recipe} locale={locale as 'is' | 'en'} />
              
              {/* AdSlot: recipes_in_content */}
              <div className="w-full h-[60px] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded-lg shadow-inner my-8">
                AdSlot: recipes_in_content (468x60)
              </div>
              
              <StepByStep recipe={recipe} locale={locale as 'is' | 'en'} />
              
              {/* Ráð og tips */}
              {(recipe.tips_is || recipe.tips_en) && (
                <div className="bg-yellow-50 border-l-4 border-[var(--pizza-gold)] p-6 rounded-r-xl">
                  <h4 className="text-lg font-bold text-[var(--text-dark)] mb-2 flex items-center">
                    <Star className="w-5 h-5 text-[var(--pizza-gold)] mr-2" />
                    {locale === 'is' ? 'Sérfræðiráð' : 'Pro Tips'}
                  </h4>
                  <p className="text-[var(--text-medium)]">
                    {locale === 'is' ? recipe.tips_is : recipe.tips_en}
                  </p>
                </div>
              )}
            </div>
            
            {/* Sidebar (Right, 1 col wide on LG) */}
            <div className="lg:col-span-1 space-y-8">
              {/* AdSlot: recipes_sidebar */}
              <div className="w-full aspect-[6/5] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded-lg shadow-inner sticky top-24">
                AdSlot: recipes_sidebar (300x250)
              </div>
            </div>
            
          </div>
        </div>

        {/* Reviews Section */}
        <section className="bg-white py-16 border-t border-[var(--border)] overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-dark)] mb-10 text-center relative inline-block left-1/2 -translate-x-1/2">
              {locale === 'is' ? 'Hvað finnst samfélaginu?' : 'Community Feedback'}
              <span className="absolute -bottom-3 left-1/4 right-1/4 h-1.5 bg-[var(--pizza-red)] rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start mt-8">
              <div className="md:col-span-2 sticky top-24">
                <ReviewForm targetId={recipe.id} targetType="recipe" locale={locale as 'is' | 'en'} />
              </div>
              <div className="md:col-span-3">
                <ReviewList targetId={recipe.id} targetType="recipe" locale={locale as 'is' | 'en'} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Placeholder AdSlot: global_footer */}
        <div className="w-full bg-[var(--bg-white)] py-8 border-t border-[var(--border)]">
          <div className="container mx-auto flex justify-center">
            <div className="w-[728px] h-[90px] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-sm font-medium rounded-lg shadow-inner">
              AdSlot: global_footer (728x90)
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
