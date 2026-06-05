import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, BarChart3 } from 'lucide-react';
import { BirtingurAdSlot, BIRTINGUR_SLOTS } from '@/components/ads/BirtingurAdSlot';
import { Recipe } from '@/types/recipe';
import { mockRecipes } from '@/lib/mockData';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { PriceWatchWidget } from '@/components/home/PriceWatchWidget';

async function getPopularRecipes(): Promise<Recipe[]> {
  return mockRecipes.slice(0, 3);
}

function getDifficultyLabel(d: string, isIs: boolean) {
  if (d === 'audvelt') return isIs ? 'Auðvelt' : 'Easy';
  if (d === 'midlungs') return isIs ? 'Miðlungs' : 'Medium';
  return isIs ? 'Erfitt' : 'Advanced';
}

function getFermentTime(recipe: Recipe, isIs: boolean): string {
  const total = (recipe.rest_time_min || 0);
  if (total >= 60) {
    const h = Math.round(total / 60);
    return `${h} ${isIs ? 'klst. gerjun' : 'h ferment'}`;
  }
  if (total > 0) return `${total} ${isIs ? 'mín. gerjun' : 'm ferment'}`;
  const cook = recipe.prep_time_min + recipe.cook_time_min;
  return `${cook} mín`;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Index');
  const popularRecipes = await getPopularRecipes();
  const isIs = locale === 'is';
  
  return (
    <main className="flex-1 flex flex-col w-full">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Pizzadeig.is',
            url: 'https://www.pizzadeig.is',
            description: isIs
              ? 'Allt um pizzadeig og pizza uppskriftir. Uppskriftir, deigreiknivél og pizzustaðir á Íslandi.'
              : 'Everything about pizza dough and recipes. Recipes, dough calculator, and pizza restaurants in Iceland.',
            inLanguage: isIs ? 'is' : 'en',
            publisher: {
              '@type': 'Organization',
              name: 'Pizzadeig.is',
              url: 'https://www.pizzadeig.is',
            },
          }),
        }}
      />
      {/* ===== HERO SECTION (Stitch: split layout) ===== */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text content */}
            <div className="flex-1 max-w-xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                {isIs ? 'Artisan Pizzería Leiðbeiningar' : 'Artisan Pizzeria Guide'}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
                {isIs ? 'Fullkomnaðu þitt' : 'Perfect your'}
                <br />
                <em className="text-primary font-normal italic">
                  {isIs ? 'pizzadeig' : 'pizza dough'}
                </em>
                <br />
                {isIs ? 'og uppskriftir.' : 'and recipes.'}
              </h1>
              <p className="text-lg text-(--color-text-secondary) mb-8 leading-relaxed max-w-md">
                {isIs 
                  ? 'Uppgötvaðu leyndarmál langrar gerjunar, hágæða hráefna og fullkominnar bökunar — heima í þínu eigin eldhúsi.'
                  : 'Discover the secrets of long-fermented dough, high-quality ingredients, and the perfect bake in your own kitchen.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/uppskriftir" className="inline-flex items-center justify-center h-12 px-8 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-destructive hover:-translate-y-0.5 transition-all duration-200">
                  {isIs ? 'Skoða Uppskriftir' : 'Browse Recipes'}
                </Link>
                <Link href="/stilar" className="inline-flex items-center justify-center h-12 px-8 bg-(--color-bg-warm) text-foreground font-semibold rounded-full hover:bg-muted transition-all duration-200">
                  {isIs ? 'Læra Tæknina' : 'Learn Techniques'}
                </Link>
              </div>
            </div>

            {/* Right: Pizza image with floating card */}
            <div className="flex-1 relative max-w-lg w-full">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
                <Image 
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200" 
                  alt={isIs ? "Fullkomin napólítönsk pizza bökuð úr heimagerðu pizzadeigi" : "Perfect Neapolitan pizza baked from homemade pizza dough"} 
                  fill 
                  priority
                  className="object-cover" 
                />
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* ===== PRICE WATCH ===== */}
      <PriceWatchWidget />

      {/* ===== POPULAR RECIPES (Stitch: 3-col cards) ===== */}
      <section className="py-20 bg-(--color-bg-secondary)">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('popular_title')}</h2>
              <p className="text-(--color-text-secondary)">{t('popular_subtitle')}</p>
            </div>
            <Link href="/uppskriftir" className="mt-4 md:mt-0 inline-flex items-center text-primary font-semibold hover:underline group transition-colors">
              {isIs ? 'Sjá allar uppskriftir' : 'See all recipes'} <ChevronRight className="h-5 w-5 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRecipes.map((recipe) => {
              const title = isIs ? recipe.title_is : recipe.title_en;
              const desc = isIs ? recipe.description_is : recipe.description_en;
              const catLabel = recipe.category?.toUpperCase() || 'PIZZA';
              const pizzaRating = Math.round(recipe.rating_avg || 0);
              
              return (
                <Link href={`/uppskriftir/${recipe.slug}`} key={recipe.id} className="group rounded-2xl overflow-hidden bg-background shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  <div className="h-56 relative overflow-hidden">
                    {recipe.image_urls?.[0] ? (
                      <Image 
                        src={recipe.image_urls[0]} 
                        alt={title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-(--color-bg-tertiary)" />
                    )}
                    {/* Category badge */}
                    <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                      {catLabel}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Pizza ratings */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-ring">
                        {'🍕'.repeat(pizzaRating)}{'🤍'.repeat(Math.max(0, 5 - pizzaRating))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({recipe.rating_count || 0} {isIs ? 'umsagnir' : 'reviews'})
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-6 line-clamp-2 flex-1">
                      {desc}
                    </p>
                    {/* Footer: ferment time + difficulty */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-(--color-border-light)">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {getFermentTime(recipe, isIs)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {getDifficultyLabel(recipe.difficulty, isIs)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BIRTINGUR BILLBOARD (980x120) ===== */}
      <div className="w-full bg-background py-6 hidden md:block">
        <div className="container mx-auto flex justify-center">
          <BirtingurAdSlot
            slotId={BIRTINGUR_SLOTS.billboard_980x120}
            width={980}
            height={120}
          />
        </div>
      </div>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <NewsletterForm locale={locale as 'is' | 'en'} />
        </div>
      </section>
    </main>
  );
}
