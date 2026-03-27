import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, BarChart3, Search, UtensilsCrossed } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';
import { db } from '@/lib/firebase';
import { collection, query, limit, orderBy, getDocs } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { mockRecipes } from '@/lib/mockData';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

async function getPopularRecipes(): Promise<Recipe[]> {
  return mockRecipes.slice(0, 3);
}

function getDifficultyLabel(d: string, isIs: boolean) {
  if (d === 'audvelt') return isIs ? 'Auðvelt' : 'Easy';
  if (d === 'midlungs') return isIs ? 'Miðlungs' : 'Medium';
  return isIs ? 'Erfitt' : 'Advanced';
}

function getFermentTime(recipe: Recipe): string {
  const total = (recipe.rest_time_min || 0);
  if (total >= 60) return `${Math.round(total / 60)}h ferment`;
  if (total > 0) return `${total}m ferment`;
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
      {/* ===== HERO SECTION (Stitch: split layout) ===== */}
      <section className="bg-(--color-bg-secondary) py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text content */}
            <div className="flex-1 max-w-xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-(--color-brand)/10 text-(--color-brand) text-xs font-bold uppercase tracking-widest mb-6">
                {isIs ? 'Artisan Pizzería Leiðbeiningar' : 'Artisan Pizzeria Guide'}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-(--color-text-primary) leading-[1.05] tracking-tight mb-6">
                {isIs ? 'Listin að baka' : 'The art of baking'}
                <br />
                <em className="text-(--color-brand) font-normal italic">
                  {isIs ? 'hina fullkomnu' : 'the perfect'}
                </em>
                <br />
                {isIs ? 'pizzu.' : 'pizza.'}
              </h1>
              <p className="text-lg text-(--color-text-secondary) mb-8 leading-relaxed max-w-md">
                {isIs 
                  ? 'Uppgötvaðu leyndarmál langrar gerjunar, hágæða hráefna og fullkominnar bökunar — heima í þínu eigin eldhúsi.'
                  : 'Discover the secrets of long-fermented dough, high-quality ingredients, and the perfect bake in your own kitchen.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/uppskriftir" className="inline-flex items-center justify-center h-12 px-8 bg-(--color-brand) text-white font-semibold rounded-full shadow-md hover:bg-destructive hover:-translate-y-0.5 transition-all duration-200">
                  {isIs ? 'Skoða Uppskriftir' : 'Browse Recipes'}
                </Link>
                <Link href="/stilar" className="inline-flex items-center justify-center h-12 px-8 bg-(--color-bg-warm) text-(--color-text-primary) font-semibold rounded-full hover:bg-(--color-bg-tertiary) transition-all duration-200">
                  {isIs ? 'Læra Tæknina' : 'Learn Techniques'}
                </Link>
              </div>
            </div>

            {/* Right: Pizza image with floating card */}
            <div className="flex-1 relative max-w-lg w-full">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
                <Image 
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200" 
                  alt="Neapolitan pizza" 
                  fill 
                  priority
                  className="object-cover" 
                />
              </div>
              {/* Floating dough card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-3 border border-(--color-border-light)">
                <div className="w-20 h-20 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=400" 
                    alt="Dough ball" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium italic text-(--color-text-secondary) mt-2 px-0.5">
                  {isIs ? '00 Mjöl & Ást' : '00 Flour & Love'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH SECTION: "Hvað er til í skápnum?" ===== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-(--color-text-primary) mb-3">
            {isIs ? 'Hvað er til í skápnum?' : "What's in the cupboard?"}
          </h2>
          <p className="text-(--color-text-secondary) mb-8 italic">
            {isIs ? 'Segðu okkur hvað þú átt, við segjum þér hvað á að baka.' : "Tell us what you have, we'll tell you what to bake."}
          </p>
          <div className="max-w-2xl mx-auto bg-(--color-bg-secondary) rounded-full flex items-center p-2 shadow-sm border border-(--color-border)">
            <Search className="w-5 h-5 text-muted-foreground ml-4 shrink-0" />
            <input 
              type="text" 
              placeholder={isIs ? 'Sláðu inn hráefni (t.d. ger, hveiti, tómatar...)' : 'Enter ingredients (e.g. yeast, flour, tomatoes...)'}
              className="flex-1 bg-transparent px-4 py-3 text-(--color-text-primary) placeholder:text-muted-foreground focus:outline-none font-body"
            />
            <Link href="/hvad-a-eg" className="inline-flex items-center gap-2 h-10 px-6 bg-ring text-white font-semibold rounded-full hover:bg-(--color-gold-light) transition-colors shrink-0">
              <UtensilsCrossed className="w-4 h-4" />
              {isIs ? 'Finna uppskrift' : 'Find recipe'}
            </Link>
          </div>
          <div className="flex gap-2 justify-center mt-5 flex-wrap">
            {['Tómatar', 'Basil', 'Mozzarella', 'Ólífuolía'].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full border border-(--color-border) text-sm text-(--color-text-secondary) hover:bg-(--color-bg-secondary) cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR RECIPES (Stitch: 3-col cards) ===== */}
      <section className="py-20 bg-(--color-bg-secondary)">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-(--color-text-primary) mb-2">{t('popular_title')}</h2>
              <p className="text-(--color-text-secondary)">{t('popular_subtitle')}</p>
            </div>
            <Link href="/uppskriftir" className="mt-4 md:mt-0 inline-flex items-center text-(--color-brand) font-semibold hover:underline group transition-colors">
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
                <Link href={`/${locale}/uppskriftir/${recipe.slug}`} key={recipe.id} className="group rounded-2xl overflow-hidden bg-background shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
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
                    <span className="absolute top-4 right-4 bg-(--color-brand) text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
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
                        ({recipe.rating_count || 0} reviews)
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-(--color-text-primary) mb-2 group-hover:text-(--color-brand) transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-6 line-clamp-2 flex-1">
                      {desc}
                    </p>
                    {/* Footer: ferment time + difficulty */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-(--color-border-light)">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {getFermentTime(recipe)}
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

      {/* ===== AD SLOT ===== */}
      <div className="w-full bg-background py-8 border-y border-(--color-border-light)">
        <div className="container mx-auto flex justify-center">
          <AdSlot placement="home_hero" format="1018x360" className="w-full max-w-[1018px] h-[360px]" fallbackText="Möguleiki á Púls Stórum Borða 1018x360" />
        </div>
      </div>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-20 bg-(--color-bg-secondary)">
        <div className="container mx-auto px-4">
          <NewsletterForm locale={locale as 'is' | 'en'} />
        </div>
      </section>
    </main>
  );
}
