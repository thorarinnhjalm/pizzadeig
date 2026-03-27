'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Restaurant } from '@/types/restaurant';
import { Search, MapPin, Star, ChefHat, Clock, DollarSign } from 'lucide-react';
import { mockRestaurants } from '@/lib/mockData';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/restaurants/Map').then(m => m.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--color-bg-secondary)] flex items-center justify-center rounded-2xl border border-[var(--color-border)]">
      <span className="text-4xl">🗺️</span>
    </div>
  ),
});

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
    <main className="flex-1 w-full bg-[var(--color-bg-light)] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-light)] border-b border-[var(--color-border)] pt-16 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-3">
            {isIs ? '🍕 Pizzustaðir á Íslandi' : '🍕 Pizza Places in Iceland'}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] italic max-w-2xl mb-8">
            {isIs
              ? 'Handvaldar pizzeríur á Íslandi, metnar af samfélaginu. Finndu þinn næsta uppáhalds stað.'
              : "Curated pizzerias across Iceland, rated by the community. Find your next favorite spot."}
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-full px-5 py-3 max-w-xl shadow-sm">
            <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder={isIs ? "Leitaðu að stað eða borg..." : "Search by name or city..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[var(--color-text-primary)] outline-none placeholder:text-gray-400"
            />
          </div>

          {/* City filter tabs */}
          <div className="flex gap-2 mt-5 flex-wrap">
            <button
              onClick={() => setSelectedCity(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                !selectedCity
                  ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
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
                    ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                    : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="w-full lg:w-[45%] h-[350px] lg:h-auto lg:min-h-[calc(100vh-300px)] lg:sticky lg:top-0">
          <Map restaurants={filtered} />
        </div>

        {/* Restaurant list */}
        <div className="w-full lg:w-[55%] p-6 lg:p-8">
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 font-medium">
            {filtered.length} {isIs ? 'staðir fundust' : 'places found'}
          </p>

          <div className="space-y-6">
            {filtered.map(restaurant => (
              <Link
                href={`/stadir/${restaurant.slug || restaurant.id}`}
                key={restaurant.id}
                className="block bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  {restaurant.image_urls?.[0] && (
                    <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden shrink-0">
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
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-display text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                          {restaurant.name}
                        </h3>
                        {(restaurant.rating_google ?? 0) > 0 && (
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-sm font-bold shrink-0 ml-2">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {restaurant.rating_google?.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {restaurant.city} · {priceLabel(restaurant.price_level || 2)}
                      </p>
                    </div>

                    {/* Features & tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {restaurant.features?.slice(0, 4).map(f => (
                        <span key={f} className="px-2.5 py-0.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs rounded-full border border-[var(--color-border-light)]">
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Opening hours preview */}
                    {restaurant.opening_hours && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border-light)] flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
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
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="text-xl text-[var(--color-text-secondary)] font-medium">
                  {isIs ? 'Engir staðir fundust.' : 'No places found.'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCity(null); }}
                  className="mt-4 text-[var(--color-brand)] font-semibold hover:underline"
                >
                  {isIs ? 'Hreinsa leit' : 'Clear search'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

