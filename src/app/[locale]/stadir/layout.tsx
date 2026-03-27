import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Pizzustaðir á Íslandi — Bestu pizzeríurnar | Pizzadeig.is'
      : 'Pizza Places in Iceland — Best Pizzerias | Pizzadeig.is',
    description: isIs
      ? 'Finndu bestu pizzustaðina á Íslandi. Umsagnir, matseðlar og einkunnir frá samfélaginu. Reykjavík, Akureyri og víðar.'
      : 'Find the best pizza places in Iceland. Reviews, menus, and community ratings. Reykjavik, Akureyri, and more.',
    openGraph: {
      title: isIs ? 'Pizzustaðir á Íslandi | Pizzadeig.is' : 'Pizza Places in Iceland | Pizzadeig.is',
      description: isIs
        ? 'Handvaldar pizzeríur á Íslandi metnar af samfélaginu.'
        : 'Curated pizzerias across Iceland rated by the community.',
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
