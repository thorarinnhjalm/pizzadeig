'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import {
  getCookieConsent,
  getServerCookieConsent,
  setCookieConsent,
  subscribeCookieConsent,
} from '@/lib/cookieConsent';

/**
 * Google Analytics runs only after the visitor accepts analytics cookies.
 * Until a choice is stored, a small banner asks; "Hafna" keeps GA off.
 */
export function ConditionalGA4({ gaId, locale }: { gaId: string; locale: 'is' | 'en' }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeCookieConsent, getCookieConsent, getServerCookieConsent);
  const isIs = locale === 'is';

  // Don't track admin pages
  if (pathname?.includes('/admin')) {
    return null;
  }

  if (consent === 'granted') {
    return <GoogleAnalytics gaId={gaId} />;
  }

  if (consent !== 'unset') {
    // 'denied', or the server render before the stored choice is known
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isIs ? 'Vefkökur' : 'Cookies'}
      className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:w-96 z-60 bg-(--color-bg-primary) border border-(--color-border) rounded-2xl p-4 shadow-2xl"
    >
      <p className="text-sm text-(--color-text-primary) leading-relaxed">
        {isIs
          ? 'Við viljum nota Google Analytics til að sjá hvernig vefurinn er notaður. Það setur vefkökur, en aðeins ef þú samþykkir. '
          : 'We would like to use Google Analytics to see how the site is used. It sets cookies, but only if you accept. '}
        <a href={`/${locale}/personuvernd`} className="underline underline-offset-2 hover:text-(--color-brand)">
          {isIs ? 'Nánar' : 'More'}
        </a>
      </p>
      <div className="flex gap-3 mt-3">
        <button
          type="button"
          onClick={() => setCookieConsent('denied', gaId)}
          className="flex-1 rounded-xl border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text-primary) hover:bg-(--color-bg-secondary)"
        >
          {isIs ? 'Hafna' : 'Decline'}
        </button>
        <button
          type="button"
          onClick={() => setCookieConsent('granted', gaId)}
          className="flex-1 rounded-xl bg-(--color-brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--color-brand-light)"
        >
          {isIs ? 'Samþykkja' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
