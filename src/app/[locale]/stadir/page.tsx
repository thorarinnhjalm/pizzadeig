'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Restaurant } from '@/types/restaurant';
import { Map } from '@/components/restaurants/Map';
import { Loader2, Search, MapPin, Star } from 'lucide-react';
import { mockRestaurants } from '@/lib/mockData';
import { Link } from '@/i18n/routing';

export default function RestaurantsPage() {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const q = query(collection(db, 'restaurants'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant)));
      } catch {
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = searchQuery
    ? restaurants.filter(r =>
        (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.city || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  return (
    <main className="flex-1 w-full bg-[var(--color-bg-primary)] min-h-screen">
      {/* Search bar */}
      <section className="border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-5 py-3">
            <Search className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder={isIs ? "Leita að 'Napólí' eða 'Reykjavík'..." : "Search 'Neapolitan' or 'Reykjavik'..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
          </div>
          <button className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--color-brand-dark)] transition-colors shadow-sm">
            {isIs ? 'Leita' : 'Discover'}
          </button>
        </div>
      </section>

      {/* Split: Map + Cards */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
        {/* Left: Map */}
        <div className="w-full lg:w-[55%] h-[400px] lg:h-auto lg:min-h-[600px] relative">
          <Map restaurants={filtered} />
        </div>

        {/* Right: Title + Cards */}
        <div className="w-full lg:w-[45%] lg:overflow-y-auto lg:max-h-[calc(100vh-140px)] p-6 lg:p-8">
          <h1 className="font-display text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Authentic Crusts
          </h1>
          <p className="text-[var(--color-text-secondary)] italic mb-6">
            {isIs
              ? 'Handvaldar pizzeríur á Íslandi, metnar af samfélaginu.'
              : "Curation of Iceland's finest pizzerias, rated by the community."}
          </p>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand)]" />
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map(restaurant => (
                <Link
                  key={restaurant.id}
                  href={`/stadir/${restaurant.slug || restaurant.id}`}
                  className="block bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Restaurant image */}
                  {restaurant.image_urls?.[0] && (
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={restaurant.image_urls[0]}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {restaurant.tags?.includes('featured') && (
                        <span className="absolute top-3 right-3 bg-[var(--color-brand)] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                          {isIs ? 'Ritstjórnarval' : "Editor's Pick"}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-[var(--color-text-tertiary)] flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {restaurant.city?.toUpperCase()} · {Array(restaurant.price_level || 2).fill('$').join('')}
                        </p>
                      </div>
                      {restaurant.rating_avg > 0 && (
                        <div className="bg-[var(--color-brand)] text-white px-3 py-1.5 rounded-xl text-center">
                          <span className="text-lg font-bold">{restaurant.rating_avg.toFixed(1)}</span>
                          <p className="text-[8px] uppercase tracking-wider">Pizzadeig</p>
                        </div>
                      )}
                    </div>

                    {/* Triple ratings */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[var(--color-border-light)]">
                      <div className="text-center">
                        <div className="flex justify-center gap-0.5 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className={`text-xs ${i <= (restaurant.rating_avg || 0) ? 'text-[var(--color-gold)]' : 'text-gray-300'}`}>🍕</span>
                          ))}
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">Pizzadeig.is</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center gap-0.5 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3 h-3 ${i <= (restaurant.rating_google || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">Google</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center gap-0.5 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className={`w-2.5 h-2.5 rounded-full inline-block ${i <= (restaurant.rating_tripadvisor || 4) ? 'bg-green-500' : 'bg-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">TripAdvisor</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
