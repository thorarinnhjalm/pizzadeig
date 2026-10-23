'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import {
  deleteAnalyticsCookies,
  getCookieConsent,
  getServerCookieConsent,
  setCookieConsent,
  subscribeCookieConsent,
  takeFocusRequest,
} from '@/lib/cookieConsent';

/**
 * Google Analytics runs only after the visitor accepts analytics cookies.
 * Until a choice is stored, a small banner asks; "Hafna" keeps GA off.
 */
export function ConditionalGA4({ gaId, locale }: { gaId: string; locale: 'is' | 'en' }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeCookieConsent, getCookieConsent, getServerCookieConsent);
  const isAdmin = !!pathname?.includes('/admin');
  const firstButton = useRef<HTMLButtonElement>(null);
  const isIs = locale === 'is';

  // Unmounting <GoogleAnalytics> does not unload gtag, so a script that is already on the page is
  // switched off with Google's opt-out flag whenever tracking is not allowed (withdrawn choice,
  // another tab declining, admin pages) and switched back on after a new yes.
  useEffect(() => {
    if (consent === 'unknown') return;
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = consent !== 'granted' || isAdmin;
    if (consent === 'denied') deleteAnalyticsCookies();
  }, [consent, gaId, isAdmin]);

  // When the banner is reopened from the privacy page, move focus to it
  useEffect(() => {
    if (consent === 'unset' && takeFocusRequest()) firstButton.current?.focus();
  }, [consent]);

  if (isAdmin) {
    return null;
  }

  if (consent === 'granted') {
    return <GoogleAnalytics gaId={gaId} />;
  }

  if (consent !== 'unset') {
    // 'denied', or the server render before the stored choice is known
    return null;
  }

  const button =
    'flex-1 rounded-xl bg-(--color-text-primary) px-4 py-2 text-sm font-semibold text-(--color-bg-primary) hover:opacity-90';

  return (
    <section
      aria-label={isIs ? 'Vefkökur' : 'Cookies'}
      // On phones the sticky ad bar (Footer, ~117px) sits at the bottom, so the banner goes above it
      className="fixed left-4 right-4 bottom-[calc(124px+env(safe-area-inset-bottom))] md:bottom-4 md:right-auto md:left-6 md:w-96 z-60 bg-(--color-bg-primary) border border-(--color-border) rounded-2xl p-4 shadow-2xl"
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
        <button ref={firstButton} type="button" onClick={() => setCookieConsent('denied')} className={button}>
          {isIs ? 'Hafna' : 'Decline'}
        </button>
        <button type="button" onClick={() => setCookieConsent('granted')} className={button}>
          {isIs ? 'Samþykkja' : 'Accept'}
        </button>
      </div>
    </section>
  );
}
