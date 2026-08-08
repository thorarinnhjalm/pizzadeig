import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { mockRecipes } from '@/lib/mockData';
import { localeAlternates } from '@/lib/seo';
import { Trophy, Star, Clock, ChefHat } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/topplisti'),
    title: isIs
      ? 'Topplisti — Hæst metnu pizza uppskriftirnar | Pizzadeig.is'
      : 'Top List — Highest Rated Pizza Recipes | Pizzadeig.is',
    description: isIs
      ? 'Topplisti yfir hæst metnu pizzu uppskriftirnar á Íslandi. Samfélagið kýs bestu deigin, sósurnar og pizzurnar.'
      : 'Top list of highest rated pizza recipes in Iceland. The community votes on the best dough, sauces, and pizzas.',
    openGraph: {
      title: isIs ? 'Topplisti uppskrifta | Pizzadeig.is' : 'Top Rated Recipes | Pizzadeig.is',
      url: `https://www.pizzadeig.is/${locale}/topplisti`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}

export default async function TopplistiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  // Sort by rating then by likes
  const ranked = [...mockRecipes]
    .filter(r => r.published)
    .sort((a, b) => {
      if (b.rating_avg !== a.rating_avg) return b.rating_avg - a.rating_avg;
      return b.likes_count - a.likes_count;
    })
    .slice(0, 15);

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="w-16 h-16 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Topplisti Uppskrifta' : 'Top Rated Recipes'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs
              ? 'Vinsælustu og hæst metnu uppskriftirnar samkvæmt samfélaginu.'
              : 'The most popular and highest rated recipes according to the community.'}
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 space-y-4">
        {ranked.map((recipe, idx) => {
          const title = isIs ? recipe.title_is : recipe.title_en;
          const rank = idx + 1;
          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

          return (
            <Link
              key={recipe.id}
              href={`/uppskriftir/${recipe.slug}`}
              className={`flex items-center gap-5 p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white ${
                rank <= 3
                  ? 'border-amber-200 shadow-md'
                  : 'border-(--color-border) shadow-sm'
              }`}
            >
              {/* Rank */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl font-display font-extrabold">
                {medal || <span className="text-(--color-text-secondary)">{rank}</span>}
              </div>

              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-(--color-bg-tertiary)">
                {recipe.image_urls?.[0] && (
                  <Image src={recipe.image_urls[0]} alt={title} fill className="object-cover" />
                )}
              </div>

              {/* Title + Meta */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-(--color-text-primary) truncate text-lg">
                  {title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    {recipe.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.prep_time_min + recipe.cook_time_min + recipe.rest_time_min} mín
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="text-center shrink-0">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="text-xl font-extrabold text-(--color-text-primary)">
                    {recipe.rating_avg.toFixed(1)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  ({recipe.rating_count})
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
