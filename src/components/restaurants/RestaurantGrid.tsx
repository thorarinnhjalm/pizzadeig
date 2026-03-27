import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { Pizza } from 'lucide-react';

interface Props {
  restaurants: Restaurant[];
  locale: 'is' | 'en';
}

export function RestaurantGrid({ restaurants, locale }: Props) {
  if (restaurants.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center text-(--color-text-secondary) bg-(--color-bg-secondary) rounded-2xl border border-dashed border-(--color-border)">
        <Pizza className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-xl font-medium">{locale === 'is' ? 'Engir staðir fundust.' : 'No restaurants found.'}</p>
        <p className="text-sm mt-2 max-w-xs">{locale === 'is' ? 'Eingöngu sýndir staðir sem eru staðfestir á bókunarvefum.' : 'Only verified reservation spots are shown.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      {restaurants.map(r => (
        <RestaurantCard key={r.id} restaurant={r} locale={locale} />
      ))}
    </div>
  );
}
