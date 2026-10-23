import { Metadata } from 'next';
import { mockRestaurants } from '@/lib/mockData';
import { localeAlternates } from '@/lib/seo';
import RestaurantsSearch from '@/components/restaurants/RestaurantsSearch';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const isIs = resolvedParams.locale === 'is';
  
  return {
    alternates: localeAlternates(resolvedParams.locale, '/stadir'),
    title: isIs ? 'Pizzustaðir á Íslandi | Pizzadeig' : 'Pizza Places in Iceland | Pizzadeig',
    description: isIs 
      ? 'Pizzustaðir á Íslandi með matseðlum, verði og heimild fyrir hvern matseðil. Reykjavík, Akureyri og víðar.' 
      : 'Pizza places in Iceland with menus, prices and a source for each menu. Reykjavík, Akureyri and more.',
  };
}

export default function RestaurantsPage() {
  // Pass down the mock data to the highly interactive client component
  // which is correctly bounded with Suspense
  return <RestaurantsSearch restaurants={mockRestaurants} />;
}
