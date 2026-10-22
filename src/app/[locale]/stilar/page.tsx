import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';
import { PIZZA_STYLES } from '@/lib/pizzaStyles';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { allRecipes } from '@/lib/recipeData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/stilar'),
    title: isIs
      ? 'Pizzustílar: Napólí, New York, Detroit og Róm | Pizzadeig.is'
      : 'Pizza Styles: Naples, New York, Detroit, Rome | Pizzadeig.is',
    description: isIs
      ? 'Fjórir helstu pizzustílar heimsins útskýrðir: napólítönsk, New York, Detroit og rómversk. Bökunarhiti, bökunartími, vökvahlutfall og einkenni hvers stíls.'
      : 'The four main pizza styles explained: Neapolitan, New York, Detroit and Roman. Baking temperature, bake time, hydration and the characteristics of each style.',
  };
}

export default async function StilarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-8 text-center">
        <h1 className="font-display italic text-5xl md:text-7xl font-bold text-primary mb-4">
          {isIs ? 'Pizzustílar heimsins' : 'Pizza Styles of the World'}
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto leading-relaxed mb-6">
          {isIs
            ? 'Frá brennheitum viðarofnum Napólí til stálbakkanna í Detroit. Hér eru fjórir þekktustu pizzustílar heims útskýrðir: hitinn, tíminn, deigið og það sem gerir hvern og einn sérstakan.'
            : 'From blazing wood-fired ovens in Naples to rectangular pan pizzas in Detroit. The four best-known pizza styles explained: the heat, the time, the dough and what makes each one special.'}
        </p>
        <div className="w-16 h-1 bg-ring mx-auto rounded-full" />
      </section>

      {/* Style Cards — alternating layout */}
      <section className="pb-24">
        <div className="container mx-auto px-4 space-y-20">
          {PIZZA_STYLES.map((style, i) => {
            const name = isIs ? style.name_is : style.name_en;
            const description = isIs ? style.description_is : style.description_en;
            const chars = isIs ? style.characteristics_is : style.characteristics_en;
            const isReversed = i % 2 === 1;
            const recipe = style.recipe_slug ? allRecipes.find(r => r.slug === style.recipe_slug) : undefined;

            return (
              <div key={style.id} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg">
                    {style.image_url ? (
                      <Image
                        src={style.image_url}
                        alt={(isIs ? style.image_alt_is : style.image_alt_en) || name}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                        style={style.image_position ? { objectPosition: style.image_position } : undefined}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-8xl">{style.emoji}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  {/* Origin badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-sm text-(--color-text-secondary) mb-4">
                    {style.emoji} {isIs ? `Uppruni: ${style.origin_is}` : `Origin: ${style.origin_en}`}
                  </span>

                  <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
                    {name}
                  </h2>
                  <p className="text-lg text-(--color-text-secondary) leading-relaxed mb-8">
                    {description}
                  </p>

                  {/* Stats: Temperature, Time, Hydration */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        {isIs ? 'Hiti' : 'Temp'}
                      </p>
                      <p className="text-xl font-bold text-foreground">{style.temp}</p>
                    </div>
                    <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        {isIs ? 'Tími' : 'Time'}
                      </p>
                      <p className="text-xl font-bold text-foreground">{isIs ? style.bakeTime : style.bakeTime_en}</p>
                    </div>
                    <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        {isIs ? 'Vatn' : 'Hydration'}
                      </p>
                      <p className="text-xl font-bold text-foreground">{style.hydration}</p>
                    </div>
                  </div>

                  {/* Characteristics */}
                  <ul className="space-y-3">
                    {chars.map((c, j) => (
                      <li key={j} className="flex items-start gap-3 text-(--color-text-secondary)">
                        <span className="mt-1.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="text-green-600 text-xs">✓</span>
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>

                  {recipe && (
                    <Link
                      href={`/uppskriftir/${recipe.slug}`}
                      className="inline-flex items-center gap-2 mt-8 font-semibold text-primary hover:underline"
                    >
                      {isIs ? `Uppskrift: ${recipe.title_is}` : `Recipe: ${recipe.title_en}`} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
