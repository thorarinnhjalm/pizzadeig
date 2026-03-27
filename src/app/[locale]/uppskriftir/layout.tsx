import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Pizza uppskriftir — Pizzadeig, sósur og álegg | Pizzadeig.is'
      : 'Pizza Recipes — Dough, Sauces & Toppings | Pizzadeig.is',
    description: isIs
      ? 'Safn af bestu pizzadeig uppskriftum. Napólítönskt súrdeig, pizzusósur, ostar og álegg. Finndu þína fullkomnu pizza uppskrift.'
      : 'Collection of the best pizza dough recipes. Neapolitan sourdough, pizza sauces, cheeses, and toppings. Find your perfect pizza recipe.',
    openGraph: {
      title: isIs ? 'Pizza uppskriftir | Pizzadeig.is' : 'Pizza Recipes | Pizzadeig.is',
      description: isIs
        ? 'Uppskriftir að pizzadeigi, sósum og öllu sem þarf til að baka fullkomna pizzu heima.'
        : 'Recipes for pizza dough, sauces, and everything needed to bake perfect pizza at home.',
      url: `https://www.pizzadeig.is/${locale}/uppskriftir`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}

export default function UppskriftirLayout({ children }: { children: React.ReactNode }) {
  return children;
}
