import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';
import { ChefHat, Heart, Users } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/um-okkur'),
    title: isIs
      ? 'Um Pizzadeig.is — uppskriftir, pizzustaðir og pizzuverð'
      : 'About Pizzadeig.is — recipes, pizza places and pizza prices',
    description: isIs
      ? 'Pizzadeig.is er íslenskur vefur um pizzu: uppskriftir að deigi, sósum og áleggi, deigreiknivél og pizzustaðir landsins með dagsettum matseðlum og verði.'
      : 'Pizzadeig.is is an Icelandic pizza site: recipes for dough, sauces and toppings, a dough calculator and the pizza places of Iceland with dated menus and prices.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIslandic = locale === 'is';
  
  return (
    <main className="flex-1 bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-8 tracking-tight">
          {isIslandic ? 'Um Okkur' : 'About Us'}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-20 max-w-3xl mx-auto font-medium">
          {isIslandic 
            ? 'Pizzadeig.is er íslenskur vefur um pizzu. Markmiðið er að hjálpa öllum að baka góða pizzu heima og að finna góða pizzu þegar farið er út.'
            : 'Pizzadeig.is is an Icelandic pizza site. The aim is to help everyone bake a good pizza at home and find a good pizza when eating out.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Uppskriftir' : 'Recipes'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Uppskriftir að deigi, sósum, ostum og áleggi, með nákvæmu magni, tímum og skrefum, og deigreiknivél sem reiknar deigið fyrir þig.' : 'Recipes for dough, sauces, cheese and toppings with exact amounts, times and steps, plus a dough calculator that works out the dough for you.'}</p>
           </div>
           
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-500/5 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Pizzustaðir og verð' : 'Pizza places and prices'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Pizzustaðir um allt land með matseðli, verði og heimild fyrir hvern matseðil, og yfirlit yfir pizzuverð á Íslandi.' : 'Pizza places all over Iceland with menus, prices and a source for each menu, plus an overview of pizza prices in Iceland.'}</p>
           </div>
           
           <div className="bg-secondary p-10 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-ring/5 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-ring" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{isIslandic ? 'Á íslensku og ensku' : 'In Icelandic and English'}</h3>
              <p className="text-muted-foreground leading-relaxed">{isIslandic ? 'Allt efni vefsins er bæði á íslensku og ensku, fyrir heimafólk og ferðamenn.' : 'Everything on the site is in both Icelandic and English, for locals and visitors alike.'}</p>
           </div>
        </div>
      </div>
    </main>
  );
}
