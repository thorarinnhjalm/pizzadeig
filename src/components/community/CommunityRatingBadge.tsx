'use client';

import { useCommunityRating } from '@/hooks/useCommunityRating';
import { Pizza } from 'lucide-react';

interface Props {
  targetId: string;
  targetType: 'restaurant' | 'recipe' | 'menu_item';
  locale: 'is' | 'en';
  size?: 'sm' | 'md';
}

export function CommunityRatingBadge({ targetId, targetType, locale, size = 'md' }: Props) {
  const { avg, count, loading } = useCommunityRating(targetId, targetType);
  const isIs = locale === 'is';

  if (loading || count === 0) return null;

  const isSm = size === 'sm';

  return (
    <div className={`flex items-center gap-1.5 ${isSm ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-0.5">
        <Pizza className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-(--color-brand) fill-(--color-brand)`} />
        <span className={`font-bold text-(--color-text-primary) ${isSm ? '' : 'text-base'}`}>
          {avg.toFixed(1)}
        </span>
      </div>
      <span className="text-(--color-text-secondary)">
        ({count} {isIs ? (count === 1 ? 'umsögn' : 'umsagnir') : (count === 1 ? 'review' : 'reviews')})
      </span>
    </div>
  );
}
