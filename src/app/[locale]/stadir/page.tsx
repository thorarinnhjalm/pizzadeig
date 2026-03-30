import { Metadata } from 'next';
import { mockRestaurants } from '@/lib/mockData';
import RestaurantsSearch from '@/components/restaurants/RestaurantsSearch';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const isIs = resolvedParams.locale === 'is';
  
  return {
    title: isIs ? 'Pizzustaðir á Íslandi | Pizzadeig' : 'Pizza Places in Iceland | Pizzadeig',
    description: isIs 
      ? 'Skoðaðu alla helstu pizzustaði Íslands, lærðu um matseðla og farðu eftir einkunnum samfélagsins.' 
      : 'Explore the top pizza places in Iceland, check out their menus and follow community ratings.',
  };
}

export default function RestaurantsPage() {
  // Pass down the mock data to the highly interactive client component
  // which is correctly bounded with Suspense
  return <RestaurantsSearch restaurants={mockRestaurants} />;
}
