// The visitor's choice about analytics cookies, kept in localStorage.
// 'unset' = no choice yet (show the banner), 'unknown' = server render (show nothing).
export type CookieConsent = 'granted' | 'denied' | 'unset' | 'unknown';

const STORAGE_KEY = 'pd-cookie-consent';
const CHANGE_EVENT = 'pd-cookie-consent-change';

// Fallback when localStorage cannot be written, so a click still holds for this page view
let memoryChoice: 'granted' | 'denied' | null = null;
// Set when the banner is reopened from the privacy page, so it can take focus
let focusRequested = false;

export function getCookieConsent(): CookieConsent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : (memoryChoice ?? 'unset');
  } catch {
    return memoryChoice ?? 'unset';
  }
}

export function getServerCookieConsent(): CookieConsent {
  return 'unknown';
}

export function subscribeCookieConsent(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Removes the GA cookies (_ga, _ga_<id>) from this host and the parent domain
export function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const host = window.location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

export function setCookieConsent(value: 'granted' | 'denied') {
  memoryChoice = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: memoryChoice keeps it for this page view
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Forget the choice so the banner asks again (button on the privacy page). */
export function resetCookieConsent() {
  memoryChoice = null;
  focusRequested = true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing stored
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** True once after resetCookieConsent(); the banner uses it to move focus to itself. */
export function takeFocusRequest(): boolean {
  const requested = focusRequested;
  focusRequested = false;
  return requested;
}
