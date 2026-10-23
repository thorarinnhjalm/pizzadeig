'use client';

import { resetCookieConsent } from '@/lib/cookieConsent';

// Opens the cookie banner again so the visitor can change their choice
export function CookieSettingsButton({ locale }: { locale: 'is' | 'en' }) {
  return (
    <button
      type="button"
      onClick={resetCookieConsent}
      className="underline underline-offset-2 font-semibold text-(--color-brand) hover:text-(--color-brand-light)"
    >
      {locale === 'is' ? 'Breyta vali á vefkökum' : 'Change cookie choice'}
    </button>
  );
}
