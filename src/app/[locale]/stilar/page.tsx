import { PIZZA_STYLES } from '@/lib/pizzaStyles';
import Image from 'next/image';

export default async function StilarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-8 text-center">
        <h1 className="font-display italic text-5xl md:text-7xl font-bold text-primary mb-4">
          {isIs ? 'Pizzustílar Heimsins' : 'Pizza Styles of the World'}
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto leading-relaxed mb-6">
          {isIs
            ? 'Frá steikjandi hita í Napolí til djúpsteyptra panna í Detroit. Kannaðu fjölbreytileika pítunnar og lærðu leyndarmálin á bak við hvern stíl.'
            : 'From blazing heat in Naples to deep-dish pans in Detroit. Explore the diversity of pizza and learn the secrets behind each style.'}
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

            return (
              <div key={style.id} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                    {style.image_url ? (
                      <Image src={style.image_url} alt={name} fill className="object-cover" />
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
                    {style.emoji} {isIs ? 'Uppruninn' : 'Origin'}
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
                      <p className="text-xl font-bold text-foreground">{style.bakeTime}</p>
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
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
