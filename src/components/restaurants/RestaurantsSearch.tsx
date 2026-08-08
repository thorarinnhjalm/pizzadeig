'use client';

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Restaurant } from '@/types/restaurant';
import { Search, MapPin, Star, ChefHat, Filter, ListFilter, X, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { CommunityRatingBadge } from '@/components/community/CommunityRatingBadge';
import Image from 'next/image';

interface Props {
  restaurants: Restaurant[];
}

export function RestaurantsSearchContent({ restaurants }: Props) {
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State readings
  const paramQ = searchParams.get('q') || '';
  const paramCity = searchParams.get('city') || '';
  const paramSort = searchParams.get('sort') || 'alpha_asc';
  const paramTagsStr = searchParams.get('tags');
  const paramTags = useMemo(() => paramTagsStr ? paramTagsStr.split(',') : [], [paramTagsStr]);

  // Local state for debounced text input
  const [localQ, setLocalQ] = useState(paramQ);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  useEffect(() => {
    setLocalQ(paramQ);
  }, [paramQ]);

  // Update URL helper
  const updateQueryString = useCallback((name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQ !== paramQ) {
        updateQueryString('q', localQ || null);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localQ, paramQ, updateQueryString]);

  // Handle Tags
  const toggleTag = (tag: string) => {
    let newTags = [...paramTags];
    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      newTags.push(tag);
    }
    updateQueryString('tags', newTags.length > 0 ? newTags.join(',') : null);
  };

  // Extract unique filters
  const cities = useMemo(() => {
    return Array.from(new Set(restaurants.map(r => r.city))).filter(Boolean).sort();
  }, [restaurants]);

  const tags = useMemo(() => {
    const allTags = restaurants.flatMap(r => r.tags || []);
    return Array.from(new Set(allTags)).filter(Boolean).sort();
  }, [restaurants]);

  const priceLabel = (level: number) => '€'.repeat(level);

  // Filtering & Sorting Logic
  const filteredAndSorted = useMemo(() => {
    let results = restaurants;

    // 1. Text Search
    if (paramQ) {
      const q = paramQ.toLowerCase();
      results = results.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.city || '').toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (r.description_is || '').toLowerCase().includes(q) ||
        (r.description_en || '').toLowerCase().includes(q)
      );
    }

    // 2. City Filter
    if (paramCity) {
      results = results.filter(r => r.city === paramCity);
    }

    // 3. Tags Filter
    if (paramTags.length > 0) {
      results = results.filter(r => paramTags.every(tag => (r.tags || []).includes(tag)));
    }

    // 4. Sorting
    results = [...results].sort((a, b) => {
      if (paramSort === 'alpha_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (paramSort === 'alpha_desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });

    return results;
  }, [restaurants, paramQ, paramCity, paramTags, paramSort]);

  // Clear filters
  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
    setLocalQ('');
  };

  const activeFilterCount = (paramCity ? 1 : 0) + paramTags.length + (paramQ ? 1 : 0);

  return (
    <div className="flex-1 w-full bg-(--color-bg-light) min-h-screen">
      {/* Search Header / Banner */}
      <div className="bg-linear-to-b from-(--color-bg-secondary) to-(--color-bg-light) border-b border-(--color-border) pt-12 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-(--color-text-primary) mb-3">
            {isIs ? '🍕 Pizzustaðir á Íslandi' : '🍕 Pizza Places in Iceland'}
          </h1>
          <p className="text-lg text-(--color-text-secondary) italic max-w-2xl lg:mb-8 mb-6">
            {isIs
              ? 'Handvaldar pizzeríur á Íslandi, metnar af samfélaginu. Finndu þinn næsta uppáhalds stað.'
              : "Curated pizzerias across Iceland, rated by the community. Find your next favorite spot."}
          </p>

          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="flex items-center gap-3 bg-white border border-(--color-border) rounded-2xl px-5 py-3.5 w-full max-w-2xl shadow-sm focus-within:ring-2 focus-within:ring-(--color-brand)/20 transition-all">
              <Search className="w-5 h-5 text-(--color-text-secondary)" />
              <input
                type="text"
                placeholder={isIs ? "Leitaðu að nafni, borg, taggi..." : "Search by name, city, tag..."}
                value={localQ}
                onChange={e => setLocalQ(e.target.value)}
                className="flex-1 bg-transparent text-(--color-text-primary) text-lg outline-none placeholder:text-gray-400"
              />
              {localQ && (
                <button onClick={() => setLocalQ('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden flex items-center gap-2 bg-white border border-(--color-border) px-5 py-3.5 rounded-2xl text-(--color-text-primary) font-semibold shadow-sm w-full justifying-center"
            >
              <Filter className="w-5 h-5" />
              {isIs ? 'Síur' : 'Filters'}
              {activeFilterCount > 0 && (
                <span className="bg-(--color-brand) text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className={`md:w-72 shrink-0 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-24 space-y-8 bg-white md:bg-transparent rounded-2xl p-6 md:p-0 border border-(--color-border) md:border-none shadow-xl md:shadow-none relative z-20">
              
              {/* Close Mobile */}
              <button 
                className="absolute top-4 right-4 md:hidden text-gray-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-(--color-brand)" />
                  {isIs ? 'Síur' : 'Filters'}
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-(--color-text-secondary) hover:text-(--color-brand) underline">
                    {isIs ? 'Hreinsa allt' : 'Clear all'}
                  </button>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-(--color-text-secondary)">
                  {isIs ? 'Raða eftir' : 'Sort by'}
                </h3>
                <div className="relative">
                  <select 
                    value={paramSort}
                    onChange={(e) => updateQueryString('sort', e.target.value)}
                    className="w-full appearance-none bg-white border border-(--color-border) rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-(--color-brand)/50 cursor-pointer"
                  >
                    <option value="alpha_asc">{isIs ? 'Stafrófsröð (A-Ö)' : 'Alphabetical (A-Z)'}</option>
                    <option value="alpha_desc">{isIs ? 'Stafrófsröð (Ö-A)' : 'Alphabetical (Z-A)'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-(--color-text-secondary)">
                  {isIs ? 'Staðsetning' : 'Location'}
                </h3>
                <div className="relative">
                  <select 
                    value={paramCity}
                    onChange={(e) => updateQueryString('city', e.target.value)}
                    className="w-full appearance-none bg-white border border-(--color-border) rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-(--color-brand)/50 cursor-pointer"
                  >
                    <option value="">{isIs ? 'Allt Ísland' : 'All of Iceland'}</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-(--color-text-secondary)">
                  {isIs ? 'Einkenni' : 'Features / Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => {
                    const isActive = paramTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                          isActive 
                            ? 'bg-(--color-brand) text-white border-(--color-brand) shadow-sm' 
                            : 'bg-white text-(--color-text-primary) border-(--color-border) hover:border-(--color-brand)/40'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-1 w-full">
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-(--color-text-secondary) font-medium">
                <span className="text-(--color-text-primary) font-bold">{filteredAndSorted.length}</span> {isIs ? 'staðir fundust' : 'places found'}
              </p>
            </div>

            {filteredAndSorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSorted.map(restaurant => (
                  <Link
                    href={`/stadir/${restaurant.slug || restaurant.id}`}
                    key={restaurant.id}
                    className="flex flex-col bg-white rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-xl hover:shadow-(--color-brand)/5 hover:-translate-y-1 transition-all duration-300 group h-full"
                  >
                    {/* Image */}
                    {restaurant.image_urls?.[0] ? (
                      <div className="h-48 relative overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={restaurant.image_urls[0]}
                          alt={restaurant.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {restaurant.is_verified && (
                          <div className="absolute top-3 left-3 bg-[#4ade80] text-gray-900 border border-white/20 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1.5 shadow-md">
                            <ChefHat className="w-3.5 h-3.5" /> {isIs ? 'Staðfest' : 'Verified'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 relative overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-300" />
                        {restaurant.is_verified && (
                          <div className="absolute top-3 left-3 bg-[#4ade80] text-gray-900 border border-white/20 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1.5 shadow-md">
                            <ChefHat className="w-3.5 h-3.5" /> {isIs ? 'Staðfest' : 'Verified'}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl font-bold text-(--color-text-primary) group-hover:text-(--color-brand) transition-colors line-clamp-2">
                          {restaurant.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-(--color-text-secondary) flex items-center gap-1.5 mb-4 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-(--color-brand)" />
                        <span className="truncate">{restaurant.city}</span> 
                        <span className="text-gray-300">•</span> 
                        <span className="tracking-widest opacity-80">{priceLabel(restaurant.price_level || 2)}</span>
                      </p>

                      <div className="mb-4">
                        <CommunityRatingBadge
                          targetId={restaurant.slug || restaurant.id}
                          targetType="restaurant"
                          locale={locale}
                          size="sm"
                        />
                      </div>

                      {/* Spacer to push tags down */}
                      <div className="flex-1" />

                      {/* Tags */}
                      {restaurant.tags && restaurant.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4">
                          {restaurant.tags.slice(0, 3).map(f => (
                            <span key={f} className="px-2.5 py-1 bg-(--color-bg-light) text-(--color-text-secondary) text-[11px] font-medium uppercase tracking-wider rounded-lg border border-(--color-border)">
                              {f}
                            </span>
                          ))}
                          {restaurant.tags.length > 3 && (
                            <span className="px-2 py-1 text-(--color-text-secondary) text-[11px] font-medium pl-1">
                              +{restaurant.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                <span className="text-6xl block mb-6">🔍</span>
                <h3 className="text-2xl font-bold text-(--color-text-primary) mb-2">
                  {isIs ? 'Engir staðir fundust.' : 'No places found.'}
                </h3>
                <p className="text-(--color-text-secondary) mb-6 max-w-sm text-center">
                  {isIs 
                    ? 'Við fundum engan veitingastað sem smellpassar við þessa leit. Prófaðu að breyta síunum.' 
                    : 'We couldn\'t find a place matching these filters. Try adjusting your search.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-(--color-brand) text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-full hover:bg-(--color-brand-dark) transition-colors"
                >
                  <X className="w-4 h-4" />
                  {isIs ? 'Hreinsa leit' : 'Clear search'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function RestaurantsSearch(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-(--color-bg-light) animate-pulse" />}>
      <RestaurantsSearchContent {...props} />
    </Suspense>
  );
}
