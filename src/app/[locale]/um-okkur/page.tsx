import type { Metadata } from 'next';
import { Pizza, Users, Heart, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Um Pizzadeig.is — Íslands pizzusamfélag'
      : 'About Pizzadeig.is — Iceland\'s Pizza Community',
    description: isIs
      ? 'Pizzadeig.is er íslenskt pizzusamfélag byggt af pizzuáhugafólki. Uppskriftir, veitingastaðir, deigreiknivél og fleira.'
      : 'Pizzadeig.is is an Icelandic pizza community built by pizza enthusiasts. Recipes, restaurants, dough calculator, and more.',
    openGraph: {
      title: isIs ? 'Um Pizzadeig.is' : 'About Pizzadeig.is',
      url: `https://www.pizzadeig.is/${locale}/um-okkur`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}

export default async function UmOkkurPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Pizza className="w-8 h-8 text-(--color-brand)" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Um Pizzadeig.is' : 'About Pizzadeig.is'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto italic">
            {isIs
              ? 'Íslands eina sérhæfða pizzusamfélagið — af pizzuáhugafólki, fyrir pizzuáhugafólk.'
              : "Iceland's only dedicated pizza community — by pizza lovers, for pizza lovers."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12 space-y-12">
        {/* Story */}
        <section className="prose prose-lg max-w-none text-(--color-text-secondary)">
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary)">
            {isIs ? 'Sagan okkar' : 'Our Story'}
          </h2>
          <p>
            {isIs
              ? 'Pizzadeig.is fæddist úr einlægri ástríðu fyrir bökun. Við sáum tækifæri til að búa til einn sameiginlegan vettvang fyrir alla sem elska pizzu á Íslandi — hvort sem þú ert byrjandi sem er að hnoða sitt fyrsta deig, eða rafsæll sérfræðingur sem leitar yfir 72 klst gerjunaruppskrift.'
              : 'Pizzadeig.is was born from a genuine passion for baking. We saw the opportunity to create a single, shared platform for everyone who loves pizza in Iceland — whether you\'re a beginner kneading your first dough, or a seasoned artisan seeking a 72-hour fermentation recipe.'}
          </p>
          <p>
            {isIs
              ? 'Við höfum safnað saman bestu uppskriftunum, yfirlit yfir pizzustaði landsins, og byggt tæki eins og deigreiknivélina til þess að ekkert standi í vegi þess að þú bakir draumapizzuna þína.'
              : 'We\'ve curated the best recipes, mapped out the country\'s pizza spots, and built tools like the dough calculator — so nothing stands in the way of you baking your dream pizza.'}
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary) mb-8">
            {isIs ? 'Gildi okkar' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-(--color-border) rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-(--color-text-primary) mb-2">
                {isIs ? 'Opin þekking' : 'Open Knowledge'}
              </h3>
              <p className="text-sm text-(--color-text-secondary)">
                {isIs ? 'Allar uppskriftir og leiðbeiningar eru gjaldfrjálsar og opnar öllum.' : 'All recipes and guides are free and open to everyone.'}
              </p>
            </div>
            <div className="bg-white border border-(--color-border) rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-(--color-text-primary) mb-2">
                {isIs ? 'Ástríða' : 'Passion'}
              </h3>
              <p className="text-sm text-(--color-text-secondary)">
                {isIs ? 'Byggt af fólki sem elskar pizza — ekki sem aukaverkefni, heldur sem lífsgildi.' : 'Built by people who love pizza — not as a side project, but as a way of life.'}
              </p>
            </div>
            <div className="bg-white border border-(--color-border) rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-(--color-text-primary) mb-2">
                {isIs ? 'Samfélag' : 'Community'}
              </h3>
              <p className="text-sm text-(--color-text-secondary)">
                {isIs ? 'Við trúum á kraften sem liggur í sameiginlegri þekkingu og stuðningi.' : 'We believe in the power of shared knowledge and mutual support.'}
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-(--color-bg-secondary) p-8 rounded-3xl border border-(--color-border) text-center">
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary) mb-3">
            {isIs ? 'Viltu ná í okkur?' : 'Want to reach us?'}
          </h2>
          <p className="text-(--color-text-secondary) mb-6">
            {isIs
              ? 'Sendu okkur línu á netfangið okkar eða hafðu samband í gegnum samfélagsmiðla.'
              : 'Drop us a line via email or reach out on social media.'}
          </p>
          <a
            href="mailto:thorarinnhjalmarsson@gmail.com?subject=Hæ Pizzadeig.is!"
            className="inline-flex items-center gap-2 bg-(--color-brand) text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-destructive transition-colors"
          >
            {isIs ? 'Senda tölvupóst' : 'Send Email'}
          </a>
        </section>
      </div>
    </main>
  );
}
