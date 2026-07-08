'use client';

import { useState, useCallback } from 'react';
import { ReviewForm } from '@/components/community/ReviewForm';
import { ReviewList } from '@/components/community/ReviewList';
import { CommunityRatingBadge } from '@/components/community/CommunityRatingBadge';
import { MenuItemRating } from '@/components/restaurants/MenuItemRating';
import { MenuItem } from '@/types/restaurant';
import { UtensilsCrossed, Pizza } from 'lucide-react';

interface Props {
  restaurantId: string;
  menuItems: MenuItem[];
  locale: 'is' | 'en';
}

export function RestaurantInteractive({ restaurantId, menuItems, locale }: Props) {
  const isIs = locale === 'is';
  const [reviewKey, setReviewKey] = useState(0);

  const handleReviewSubmitted = useCallback(() => {
    // Increment key to force ReviewList to re-fetch
    setReviewKey(k => k + 1);
  }, []);

  // Group menu items by category
  const grouped = menuItems.reduce((acc, item) => {
    const cat = item.category || (isIs ? 'Annað' : 'Other');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-10 mt-10 border-t border-(--color-border-light) pt-10">
      {/* Community rating summary */}
      <section className="flex items-center gap-3 bg-(--color-bg-secondary) p-5 rounded-2xl border border-(--color-border)">
        <div className="w-12 h-12 bg-(--color-brand)/10 rounded-xl flex items-center justify-center">
          <Pizza className="w-6 h-6 text-(--color-brand)" />
        </div>
        <div>
          <h3 className="font-bold text-(--color-text-primary) text-sm">
            {isIs ? 'Einkunn samfélagsins' : 'Community Rating'}
          </h3>
          <CommunityRatingBadge
            key={reviewKey}
            targetId={restaurantId}
            targetType="restaurant"
            locale={locale}
          />
        </div>
      </section>
      {/* Menu section */}
      {menuItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary) mb-6 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6" />
            {isIs ? 'Matseðill' : 'Menu'}
          </h2>

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-(--color-text-secondary) mb-4 pb-2 border-b border-(--color-border-light)">
                {category}
              </h3>
              <div className="space-y-3">
                {items.sort((a, b) => a.sort_order - b.sort_order).map(item => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl bg-(--color-bg-secondary)/50 hover:bg-(--color-bg-secondary) transition-colors border border-transparent hover:border-(--color-border-light)"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-(--color-text-primary)">
                          {isIs ? item.name_is : item.name_en}
                        </span>
                      </div>
                      {(isIs ? item.description_is : item.description_en) && (
                        <p className="text-sm text-(--color-text-secondary) mb-2">
                          {isIs ? item.description_is : item.description_en}
                        </p>
                      )}
                      <MenuItemRating item={item} locale={locale} />
                    </div>
                    <div className="text-right shrink-0">
                      {item.price_large ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-bold text-(--color-text-primary) text-sm">
                            {item.size_small_label || '12"'} {item.price.toLocaleString('is-IS')} kr.
                          </span>
                          <span className="font-bold text-(--color-text-primary) text-sm">
                            {item.size_large_label || '16"'} {item.price_large.toLocaleString('is-IS')} kr.
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-(--color-text-primary)">
                          {item.price.toLocaleString('is-IS')} kr.
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Restaurant reviews section */}
      <section>
        <h2 className="text-2xl font-display font-bold text-(--color-text-primary) mb-6">
          {isIs ? '📝 Umsagnir um staðinn' : '📝 Reviews'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ReviewForm
              targetId={restaurantId}
              targetType="restaurant"
              locale={locale}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
          <div>
            <ReviewList
              key={reviewKey}
              targetId={restaurantId}
              targetType="restaurant"
              locale={locale}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
