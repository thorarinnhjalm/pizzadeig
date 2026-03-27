'use client';

import { BADGES } from '@/lib/badges';

interface Props {
  unlockedBadgeIds: string[];
  locale: 'is' | 'en';
}

export function BadgeDisplay({ unlockedBadgeIds, locale }: Props) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8">
      <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
        🏆 {locale === 'is' ? 'Merki' : 'Badges'}
        <span className="text-sm font-body text-[var(--color-text-tertiary)]">
          {unlockedBadgeIds.length}/{BADGES.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const name = locale === 'is' ? badge.name_is : badge.name_en;
          const desc = locale === 'is' ? badge.description_is : badge.description_en;

          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-[var(--color-bg-warm)] border-[var(--color-gold)] shadow-md'
                  : 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-light)] opacity-40 grayscale'
              }`}
              title={desc}
            >
              <span className="text-4xl mb-2 select-none">{badge.icon}</span>
              <p className="text-xs font-bold text-[var(--color-text-primary)]">{name}</p>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1 line-clamp-2">{desc}</p>
              {isUnlocked && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-gold)] rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
