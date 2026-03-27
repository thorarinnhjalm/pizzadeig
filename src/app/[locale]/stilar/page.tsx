import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

const styles = [
  {
    id: 'napoli',
    emoji: '🇮🇹',
    title_is: 'Napólísk Pizza',
    title_en: 'Neapolitan Pizza',
    desc_is: 'Upprunaleg pizza frá Napólí. Mjúkur, loftugur botn, einföld hráefni og bökuð í 500°C steinofni á 60-90 sekúndum. Súrdeig eða IDY, 65% vatn, San Marzano tómatar og fior di latte.',
    desc_en: 'The original pizza from Naples. Soft, airy crust, simple ingredients, baked at 500°C in a stone oven for 60-90 seconds. Sourdough or IDY, 65% hydration, San Marzano tomatoes, and fior di latte.',
    hydration: '60-65%',
    ferment: '24-72 klst',
    temp: '450-500°C',
    flour: 'Caputo Tipo 00',
  },
  {
    id: 'ny-style',
    emoji: '🗽',
    title_is: 'New York Style',
    title_en: 'New York Style',
    desc_is: 'Stór, þunn og sveigjanleg pizza sem hægt er að brjóta saman. Hærra olíuinnihald, lægra vatnhlutfall og bökuð í venjulegum ofni á 250-300°C.',
    desc_en: 'Large, thin, and foldable slices. Higher oil content, lower hydration, baked in a standard oven at 250-300°C.',
    hydration: '58-62%',
    ferment: '24-48 klst',
    temp: '250-300°C',
    flour: 'Bread Flour (12-14% prótein)',
  },
  {
    id: 'al-taglio',
    emoji: '✂️',
    title_is: 'Al Taglio (Rómversk)',
    title_en: 'Al Taglio (Roman)',
    desc_is: 'Rómversk pizza sem er skorin af bakka og seld á þyngd. Létt, loftug og stökk. Mjög hátt vatnhlutfall (80%+) og löng gerjun.',
    desc_en: 'Roman-style pizza cut from a tray and sold by weight. Light, airy, and crispy. Very high hydration (80%+) with long fermentation.',
    hydration: '80-85%',
    ferment: '48-72 klst',
    temp: '280-320°C',
    flour: 'Tipo 0 / Tipo 1',
  },
  {
    id: 'detroit',
    emoji: '🏭',
    title_is: 'Detroit Style',
    title_en: 'Detroit Style',
    desc_is: 'Ferhyrnd pizza bökuð í djúpri stálpönnu. Wisconsin brick cheese rennur niður hlið pönnunnar og myndar karamellulagt ostaskorpu. Sósan fer OFAN Á ostinn.',
    desc_en: 'Rectangular pizza baked in a deep steel pan. Wisconsin brick cheese flows down the sides creating caramelized cheese crust. Sauce goes ON TOP of the cheese.',
    hydration: '65-70%',
    ferment: '24-48 klst',
    temp: '250°C',
    flour: 'Bread Flour',
  },
  {
    id: 'sicilian',
    emoji: '🏝️',
    title_is: 'Sísílísk (Sfincione)',
    title_en: 'Sicilian (Sfincione)',
    desc_is: 'Þykk og mjúk ferhyrnd pizza frá Sikiley. Svipuð focaccia með tómötum, lauk, caciocavallo osti og brauðmylsnu.',
    desc_en: 'Thick and soft rectangular pizza from Sicily. Resembles focaccia with tomatoes, onion, caciocavallo cheese, and breadcrumbs.',
    hydration: '70-75%',
    ferment: '12-24 klst',
    temp: '220-250°C',
    flour: 'Semolina + Tipo 00 blanda',
  },
  {
    id: 'pinsa',
    emoji: '🫓',
    title_is: 'Pinsa Romana',
    title_en: 'Pinsa Romana',
    desc_is: 'Nútímaleg túlkun á rómverskri pizzu. Blanda af hveiti, hrísgrjónamjöl og sojamjöli. Léttari á meltingu og stökk.',
    desc_en: 'Modern take on Roman pizza. A blend of wheat, rice, and soy flours. Lighter on digestion and ultra-crispy.',
    hydration: '75-80%',
    ferment: '48-72 klst',
    temp: '280-300°C',
    flour: 'Pinsa mjölblanda',
  },
];

export default async function StilarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-(--color-brand)/10 text-(--color-brand) text-xs font-bold uppercase tracking-widest mb-6">
            {isIs ? 'Pizzustílar Heimsins' : 'Pizza Styles of the World'}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Kynntu þér stílana' : 'Master the Styles'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs
              ? 'Frá Napólí til New York, Detroit til Rómar — hvert form hefur sína sögu, sína tækni og sitt eigið eðli.'
              : 'From Naples to New York, Detroit to Rome — every form has its story, its technique, and its own character.'}
          </p>
        </div>
      </div>

      {/* Styles Grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styles.map((style) => (
            <div
              key={style.id}
              className="bg-white border border-(--color-border) rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{style.emoji}</span>
                <h2 className="text-2xl font-display font-bold text-(--color-text-primary)">
                  {isIs ? style.title_is : style.title_en}
                </h2>
              </div>
              <p className="text-(--color-text-secondary) leading-relaxed mb-6">
                {isIs ? style.desc_is : style.desc_en}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
                    {isIs ? 'Vatn' : 'Hydration'}
                  </p>
                  <p className="text-lg font-bold text-(--color-brand)">{style.hydration}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
                    {isIs ? 'Gerjun' : 'Ferment'}
                  </p>
                  <p className="text-lg font-bold text-indigo-600">{style.ferment}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
                    {isIs ? 'Hiti ofns' : 'Oven Temp'}
                  </p>
                  <p className="text-lg font-bold text-orange-600">{style.temp}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
                    {isIs ? 'Mjöl' : 'Flour'}
                  </p>
                  <p className="text-sm font-bold text-(--color-text-primary)">{style.flour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/deigreiknivel"
            className="inline-flex items-center gap-2 bg-(--color-brand) text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:bg-destructive hover:-translate-y-0.5 transition-all"
          >
            {isIs ? 'Prófa deigreiknivélina' : 'Try the Dough Calculator'}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
