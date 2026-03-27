'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

interface SearchHit {
  objectID: string;
  title_is?: string;
  title_en?: string;
  slug: string;
  image_urls?: string[];
  category?: string;
  rating_avg?: number;
}

interface Props {
  locale: 'is' | 'en';
}

export function SearchBar({ locale }: Props) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (query.length < 2) {
      setHits([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=recipes`);
        const data = await res.json();
        setHits(data.hits || []);
        setIsOpen(true);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="relative hidden md:flex items-center w-64" ref={dropdownRef}>
      {loading ? (
        <Loader2 className="w-4 h-4 absolute left-3 text-(--color-brand) animate-spin" />
      ) : (
        <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
      )}
      <Input
        type="search"
        placeholder={locale === 'is' ? 'Leita að uppskriftum...' : 'Search recipes...'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => hits.length > 0 && setIsOpen(true)}
        className="pl-9 bg-(--color-bg-tertiary) border-(--color-border-light) text-sm rounded-full focus-visible:ring-(--color-brand) h-10 w-full font-body placeholder:text-muted-foreground text-(--color-text-primary)"
      />

      {isOpen && hits.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-background border border-(--color-border-light) rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {hits.map((hit) => {
            const title = locale === 'is' ? hit.title_is : hit.title_en;
            return (
              <Link
                key={hit.objectID}
                href={`/${locale}/uppskriftir/${hit.slug}`}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="flex items-center gap-3 p-3 hover:bg-(--color-bg-tertiary) transition-colors border-b border-(--color-border-light) last:border-0"
              >
                {hit.image_urls?.[0] ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                    <Image src={hit.image_urls[0]} alt={title || ''} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-(--color-bg-tertiary) shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-(--color-text-primary) truncate">{title}</p>
                  <p className="text-[10px] uppercase text-muted-foreground tracking-wide">{hit.category}</p>
                </div>
                {hit.rating_avg && (
                  <span className="ml-auto text-xs font-bold text-ring">🍕 {hit.rating_avg.toFixed(1)}</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
