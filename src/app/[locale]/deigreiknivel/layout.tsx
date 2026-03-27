import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Deigreiknivél — Reiknaðu pizzadeigið þitt | Pizzadeig.is'
      : 'Dough Calculator — Calculate Your Pizza Dough | Pizzadeig.is',
    description: isIs
      ? 'Reiknaðu nákvæmlega hversu mikið mjöl, vatn, salt og ger þú þarft í pizzadeigið. Stilltu vatnshlutfall, fjölda bolta og gerjunartíma.'
      : 'Calculate exactly how much flour, water, salt, and yeast you need for your pizza dough. Adjust hydration, number of balls, and fermentation time.',
    openGraph: {
      title: isIs ? 'Pizzadeig reiknivél | Pizzadeig.is' : 'Pizza Dough Calculator | Pizzadeig.is',
      description: isIs
        ? 'Nákvæm deigreiknivél fyrir pizzu. Sláðu inn upplýsingar og fáðu fullkomna uppskrift.'
        : 'Precise pizza dough calculator. Enter your details and get a perfect recipe.',
      url: `https://www.pizzadeig.is/${locale}/deigreiknivel`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}

export default function DeigreiknvelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
