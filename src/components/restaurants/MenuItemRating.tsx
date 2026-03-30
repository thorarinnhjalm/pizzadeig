'use client';

import { useState } from 'react';
import { useCommunityRating } from '@/hooks/useCommunityRating';
import { Pizza, ChevronDown, ChevronUp } from 'lucide-react';
import { ReviewForm } from '@/components/community/ReviewForm';
import { ReviewList } from '@/components/community/ReviewList';
import { MenuItem } from '@/types/restaurant';

export function MenuItemRating({ item, locale }: { item: MenuItem, locale: 'is' | 'en' }) {
  const { avg, count } = useCommunityRating(item.id, 'menu_item');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 w-full">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-3 py-1.5 rounded-full border border-border"
      >
        <Pizza className={`w-4 h-4 ${avg > 0 || item.rating_avg ? 'text-primary fill-primary' : ''}`} />
        <span className="font-bold text-foreground">{avg > 0 ? avg.toFixed(1) : (item.rating_avg ? item.rating_avg.toFixed(1) : (locale === 'is' ? '0 Umsagnir' : '0 Reviews'))}</span>
        {(count > 0 || (item.rating_count && item.rating_count > 0)) && (
          <span className="text-xs opacity-75">({count || item.rating_count})</span>
        )}
        <span className="ml-1 text-xs border-l border-border pl-2 border-dashed">{locale === 'is' ? (expanded ? 'Loka' : 'Gefa umsögn / Rate') : (expanded ? 'Close' : 'Rate / Review')}</span>
        {expanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
      </button>

      {expanded && (
        <div className="mt-4 p-4 md:p-6 bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-inner">
          <h4 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
            <Pizza className="w-5 h-5 text-primary" />
            {locale === 'is' ? `Umsagnir um ${item.name_is}` : `Reviews for ${item.name_en || item.name_is}`}
          </h4>
          <ReviewForm targetId={item.id} targetType="menu_item" locale={locale} />
          <div className="mt-8">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
              {locale === 'is' ? 'Allar umsagnir' : 'All reviews'}
            </h5>
            <ReviewList targetId={item.id} targetType="menu_item" locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
}
