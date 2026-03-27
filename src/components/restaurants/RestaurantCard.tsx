import Image from 'next/image';
import { Pizza, MapPin } from 'lucide-react';
import { Restaurant } from '@/types/restaurant';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/routing';

interface Props {
  restaurant: Restaurant;
  locale: 'is' | 'en';
}

export function RestaurantCard({ restaurant, locale }: Props) {
  const name = restaurant.name;
  const description = locale === 'is' ? restaurant.description_is : restaurant.description_en;
  const priceIndicator = Array(restaurant.price_level).fill('$').join('');

  return (
    <Link href={`/stadir/${restaurant.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-[var(--color-border)] border-b-[3px] border-b-[var(--color-gold)] hover:border-b-[var(--color-brand)] transition-all duration-300 group-hover:-translate-y-1 flex flex-col bg-[var(--color-bg-secondary)]">
        <div className="relative h-48 w-full bg-[var(--color-bg-primary)] overflow-hidden">
          {restaurant.image_urls?.[0] ? (
            <Image 
              src={restaurant.image_urls[0]} 
              alt={name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.1] brightness-95"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--color-bg-tertiary)] flex items-center justify-center">
              <span className="text-[var(--color-text-tertiary)] font-medium text-4xl opacity-50">{name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-[var(--color-bg-primary)]/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-[var(--color-text-primary)] flex items-center shadow-sm">
            <Pizza className="w-3 h-3 text-[var(--color-gold)] mr-1 fill-current" />
            {restaurant.rating_avg > 0 ? restaurant.rating_avg.toFixed(1) : (locale === 'is' ? 'Nýr' : 'New')}
          </div>
          {restaurant.is_verified && (
            <div className="absolute top-3 left-3 bg-[var(--color-green)] text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
              {locale === 'is' ? 'Staðfest' : 'Verified'}
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-1 pr-4">{name}</h3>
            <span className="price-tag">{priceIndicator}</span>
          </div>
          <p className="text-[var(--color-text-secondary)] font-body text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center text-xs text-[var(--color-text-tertiary)] font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[var(--color-brand)]" /> 
              <span className="truncate">{restaurant.address}, {restaurant.city}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
