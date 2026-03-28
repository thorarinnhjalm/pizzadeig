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
import { UserGallery } from '@/components/recipes/UserGallery';
import { ShareButtons } from '@/components/recipes/ShareButtons';
import { GuidedBakeButton } from '@/components/recipes/GuidedBakeButton';
import { Clock, Timer, Users, BarChart3, Pizza } from 'lucide-react';
import { mockRecipes } from '@/lib/mockData';
import { Link } from '@/i18n/routing';

async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const q = query(collection(db, 'recipes'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Recipe;
  } catch {
    console.warn('Firebase offline fallback active');
  }
  return mockRecipes.find(r => r.slug === slug) || null;
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
    openGraph: { images: recipe.image_urls?.[0] ? [recipe.image_urls[0]] : [] },
    alternates: { canonical: `https://pizzadeig.is/${locale}/uppskriftir/${slug}` },
  };
}

function getDifficultyLabel(d: string, isIs: boolean) {
  if (d === 'audvelt') return isIs ? 'Auðvelt' : 'Easy';
  if (d === 'midlungs') return isIs ? 'Miðlungs' : 'Medium';
  return isIs ? 'Erfitt' : 'Advanced';
}

function formatTime(minutes: number) {
  if (minutes >= 1440) return `${Math.round(minutes / 60)} Hours`;
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} Hours`;
  }
  return `${minutes} Mins`;
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const isIs = locale === 'is';
  const title = isIs ? recipe.title_is : recipe.title_en;
  const description = isIs ? recipe.description_is : recipe.description_en;
  const jsonLd = recipeJsonLd(recipe, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex-1 w-full">
        
        {/* ===== FULL-BLEED HERO (Stitch: Masterclass hero) ===== */}
        <section className="relative w-full h-[70vh] min-h-[500px] flex items-end">
          {recipe.image_urls?.[0] ? (
            <>
              <Image src={recipe.image_urls[0]} alt={title || ''} fill priority className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-(--color-bg-tertiary)" />
          )}
          
          <div className="relative z-10 container mx-auto px-4 pb-12">
            <span className="inline-block px-4 py-1.5 rounded-md bg-(--color-brand) text-white text-[10px] font-bold uppercase tracking-widest mb-4 shadow-md">
              {isIs ? 'Meistara Uppskrift' : 'Masterclass Series'}
            </span>
            <h1 className="text-5xl md:text-7xl font-display italic text-white leading-[1.05] tracking-tight mb-4 drop-shadow-lg max-w-3xl">
              {title}
            </h1>
            <p className="text-lg text-white/80 italic max-w-2xl leading-relaxed drop-shadow-md">
              {description}
            </p>
          </div>
        </section>

        {/* ===== STATS BAR (Stitch: 4 icons in row) ===== */}
        <section className="bg-background border-b border-(--color-border)">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-(--color-border)">
              <div className="flex flex-col items-center py-6 gap-2">
                <Clock className="w-6 h-6 text-(--color-brand)" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isIs ? 'Undirbúningur' : 'Prep Time'}
                </span>
                <span className="text-lg font-bold text-(--color-text-primary)">
                  {formatTime(recipe.prep_time_min)}
                </span>
              </div>
              <div className="flex flex-col items-center py-6 gap-2">
                <Timer className="w-6 h-6 text-(--color-brand)" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isIs ? 'Hvíld' : 'Rest Time'}
                </span>
                <span className="text-lg font-bold text-(--color-text-primary)">
                  {formatTime(recipe.rest_time_min || 0)}
                </span>
              </div>
              <div className="flex flex-col items-center py-6 gap-2">
                <Users className="w-6 h-6 text-(--color-brand)" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isIs ? 'Skammtar' : 'Servings'}
                </span>
                <span className="text-lg font-bold text-(--color-text-primary)">
                  {recipe.servings} {isIs ? 'Pizzur' : 'Pizzas'}
                </span>
              </div>
              <div className="flex flex-col items-center py-6 gap-2">
                <BarChart3 className="w-6 h-6 text-(--color-brand)" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isIs ? 'Erfiðleiki' : 'Difficulty'}
                </span>
                <span className="text-lg font-bold text-(--color-text-primary)">
                  {getDifficultyLabel(recipe.difficulty, isIs)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BREADCRUMBS + ACTIONS ===== */}
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <nav className="text-sm text-(--color-text-secondary) font-medium flex items-center gap-2">
            <Link href="/" className="hover:text-(--color-brand) transition-colors">{isIs ? 'Forsíða' : 'Home'}</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/uppskriftir" className="hover:text-(--color-brand) transition-colors">{isIs ? 'Uppskriftir' : 'Recipes'}</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-(--color-text-primary) font-bold">{title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <ShareButtons url={`https://pizzadeig.is/${locale}/uppskriftir/${slug}`} title={title || ''} locale={locale as 'is'|'en'} />
            <GuidedBakeButton recipe={recipe} locale={locale as 'is' | 'en'} />
          </div>
        </div>

        {/* ===== 2-COLUMN CONTENT (Stitch: ingredients left, steps right) ===== */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Ingredients — stone card (left) */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-(--color-bg-secondary) rounded-2xl p-8 border border-(--color-border)">
                <h2 className="text-2xl font-bold text-(--color-text-primary) mb-6">
                  {isIs ? 'Hráefni' : 'Ingredients'}
                </h2>
                <IngredientList recipe={recipe} locale={locale as 'is' | 'en'} />
              </div>
            </div>

            {/* Steps — right */}
            <div className="lg:col-span-3 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-(--color-text-primary) mb-6">
                  {isIs ? 'Leiðbeiningar' : 'Instructions'}
                </h2>
                <StepByStep recipe={recipe} locale={locale as 'is' | 'en'} />
              </div>

              {/* Pro Tips */}
              {(recipe.tips_is || recipe.tips_en) && (
                <div className="bg-(--color-bg-secondary) border-l-4 border-ring p-6 rounded-r-2xl">
                  <h4 className="text-lg font-bold text-(--color-text-primary) mb-2 flex items-center">
                    <Pizza className="w-5 h-5 text-ring mr-2" />
                    {isIs ? 'Sérfræðiráð' : 'Pro Tips'}
                  </h4>
                  <p className="text-(--color-text-secondary)">
                    {isIs ? recipe.tips_is : recipe.tips_en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== USER GALLERY ===== */}
        <section className="container mx-auto px-4 py-12">
          <UserGallery recipeId={recipe.id} locale={locale as 'is'|'en'} />
        </section>

        {/* ===== REVIEWS ===== */}
        <section className="bg-(--color-bg-secondary) py-16 border-t border-(--color-border)">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-(--color-text-primary) mb-10 text-center">
              {isIs ? 'Hvað finnst samfélaginu?' : 'Community Reviews'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-2">
                <ReviewForm targetId={recipe.id} targetType="recipe" locale={locale as 'is' | 'en'} />
              </div>
              <div className="md:col-span-3">
                <ReviewList targetId={recipe.id} targetType="recipe" locale={locale as 'is' | 'en'} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
