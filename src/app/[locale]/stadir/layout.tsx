import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Pizzustaðir á Íslandi — Bestu pizzeríurnar | Pizzadeig.is'
      : 'Pizza Places in Iceland — Best Pizzerias | Pizzadeig.is',
    description: isIs
      ? 'Pizzustaðir á Íslandi með matseðlum, verði og heimild fyrir hvern matseðil. Reykjavík, Akureyri og víðar.'
      : 'Pizza places in Iceland with menus, prices and a source for each menu. Reykjavík, Akureyri and more.',
    openGraph: {
      title: isIs ? 'Pizzustaðir á Íslandi | Pizzadeig.is' : 'Pizza Places in Iceland | Pizzadeig.is',
      description: isIs
        ? 'Pizzustaðir um allt land, með matseðlum og heimildum.'
        : 'Pizza places across Iceland, with menus and sources.',
      url: `https://www.pizzadeig.is/${locale}/stadir`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
    },
  };
}

export default function StadirLayout({ children }: { children: React.ReactNode }) {
  return children;
}
