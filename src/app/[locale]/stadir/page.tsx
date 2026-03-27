'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Restaurant } from '@/types/restaurant';
import { Search, MapPin, Star, ChefHat, Clock, DollarSign } from 'lucide-react';
import { mockRestaurants } from '@/lib/mockData';
import { Link } from '@/i18n/routing';
import { CommunityRatingBadge } from '@/components/community/CommunityRatingBadge';
import Image from 'next/image';

export default function RestaurantsPage() {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const restaurants: Restaurant[] = mockRestaurants;

  // Get unique cities for filter tabs
  const cities = useMemo(() => {
    const citySet = new Set(restaurants.map(r => r.city));
    return Array.from(citySet).sort();
  }, [restaurants]);

  const filtered = useMemo(() => {
    let results = restaurants;
    if (selectedCity) {
      results = results.filter(r => r.city === selectedCity);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.city || '').toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return results;
  }, [restaurants, selectedCity, searchQuery]);

  const priceLabel = (level: number) => '€'.repeat(level);

  return (
    <main className="flex-1 w-full bg-(--color-bg-light) min-h-screen">
      {/* Hero */}
      <div className="bg-linear-to-b from-(--color-bg-secondary) to-(--color-bg-light) border-b border-(--color-border) pt-16 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-(--color-text-primary) mb-3">
            {isIs ? '🍕 Pizzustaðir á Íslandi' : '🍕 Pizza Places in Iceland'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) italic max-w-2xl mb-8">
            {isIs
              ? 'Handvaldar pizzeríur á Íslandi, metnar af samfélaginu. Finndu þinn næsta uppáhalds stað.'
              : "Curated pizzerias across Iceland, rated by the community. Find your next favorite spot."}
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white border border-(--color-border) rounded-full px-5 py-3 max-w-xl shadow-sm">
            <Search className="w-5 h-5 text-(--color-text-secondary)" />
            <input
              type="text"
              placeholder={isIs ? "Leitaðu að stað eða borg..." : "Search by name or city..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-(--color-text-primary) outline-none placeholder:text-gray-400"
            />
          </div>

          {/* City filter tabs */}
          <div className="flex gap-2 mt-5 flex-wrap">
            <button
              onClick={() => setSelectedCity(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                !selectedCity
                  ? 'bg-(--color-brand) text-white border-(--color-brand)'
                  : 'bg-white text-(--color-text-secondary) border-(--color-border) hover:bg-(--color-bg-secondary)'
              }`}
            >
              {isIs ? 'Allir staðir' : 'All'}
            </button>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCity === city
                    ? 'bg-(--color-brand) text-white border-(--color-brand)'
                    : 'bg-white text-(--color-text-secondary) border-(--color-border) hover:bg-(--color-bg-secondary)'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant grid */}
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <p className="text-sm text-(--color-text-secondary) mb-6 font-medium">
          {filtered.length} {isIs ? 'staðir fundust' : 'places found'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(restaurant => (
            <Link
              href={`/stadir/${restaurant.slug || restaurant.id}`}
              key={restaurant.id}
              className="block bg-white rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              {restaurant.image_urls?.[0] && (
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={restaurant.image_urls[0]}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {restaurant.is_verified && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> {isIs ? 'Staðfest' : 'Verified'}
                    </span>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display text-xl font-bold text-(--color-text-primary) group-hover:text-(--color-brand) transition-colors">
                    {restaurant.name}
                  </h3>
                  {(restaurant.rating_google ?? 0) > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-sm font-bold shrink-0 ml-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {restaurant.rating_google?.toFixed(1)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-(--color-text-secondary) flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {restaurant.city} · {priceLabel(restaurant.price_level || 2)}
                </p>

                {/* Community Rating */}
                <div className="mb-3">
                  <CommunityRatingBadge
                    targetId={restaurant.slug || restaurant.id}
                    targetType="restaurant"
                    locale={locale}
                    size="sm"
                  />
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {restaurant.features?.slice(0, 3).map(f => (
                    <span key={f} className="px-2.5 py-0.5 bg-(--color-bg-secondary) text-(--color-text-secondary) text-xs rounded-full border border-(--color-border-light)">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Opening hours */}
                {restaurant.opening_hours && (
                  <div className="pt-3 border-t border-(--color-border-light) flex items-center gap-1.5 text-xs text-(--color-text-secondary)">
                    <Clock className="w-3.5 h-3.5" />
                    {isIs ? 'Opið í dag: ' : 'Open today: '}
                    {(() => {
                      const days = ['sun', 'mán', 'þri', 'mið', 'fim', 'fös', 'lau'];
                      const today = days[new Date().getDay()];
                      const hours = restaurant.opening_hours as Record<string, string>;
                      return hours[today] || (isIs ? 'Lokað' : 'Closed');
                    })()}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-xl text-(--color-text-secondary) font-medium">
              {isIs ? 'Engir staðir fundust.' : 'No places found.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCity(null); }}
              className="mt-4 text-(--color-brand) font-semibold hover:underline"
            >
              {isIs ? 'Hreinsa leit' : 'Clear search'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

