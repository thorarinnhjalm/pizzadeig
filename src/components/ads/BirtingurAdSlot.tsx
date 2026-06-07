'use client';

import { useEffect, useRef, useState } from 'react';

const SERVING_BASE = 'https://serving.birtingur.app';

interface BirtingurAd {
  creativeId: string;
  imageUrl: string;
  clickUrl: string;
  width: number;
  height: number;
  impressionPixel: string;
  ttl: number;
}

interface BirtingurEmpty {
  empty: true;
  // Birtingur API v1.1+: empty svar getur innihaldið pageview pixel
  // sem á að firea til að telja heimsóknir á síður með uncached slots.
  impressionPixel?: string;
}

type BirtingurResponse = BirtingurAd | BirtingurEmpty;

function isAd(r: BirtingurResponse | null): r is BirtingurAd {
  return !!r && !('empty' in r);
}

interface Props {
  slotId: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Opinber Birtingur React component (`mcp__birtingur__get_react_component`)
 * með minniháttar tilfærslum (template-literal className syntax).
 *
 * Eiginleikar:
 * - Sækir auglýsingu úr Serving REST API
 * - IAB Viewability tracking (50% sýnilegt í 1 sek áður en talið er birting)
 * - Sjálfvirk endurnýjun byggt á TTL — eingöngu þegar plássið er sýnilegt
 * - Heldur alltaf width×height plássinu (engin layout shift, fellur aldrei saman)
 * - Renderar house ads (cre_fallback_birtingur), felur gagnsætt fallback
 */
export function BirtingurAdSlot({ slotId, width, height, className = '' }: Props) {
  const [ad, setAd] = useState<BirtingurResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const impressionFired = useRef<string | null>(null);
  const pageviewFired = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fetchAdRef = useRef<(() => Promise<void>) | null>(null);

  // Fylgjast með hvort plássið sé sýnilegt í viewport (fyrir TTL refresh)
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window) || !containerRef.current) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sækja auglýsingu úr API
  useEffect(() => {
    let cancelled = false;
    const fetchAd = async () => {
      try {
        setError(null);
        const res = await fetch(
          `${SERVING_BASE}/v1/ad?slot=${encodeURIComponent(slotId)}&consent=none`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          let errMsg = `Birtingur fetch villa: ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson && typeof errJson === 'object' && 'error' in errJson) {
              errMsg = `${errMsg} - ${errJson.error}`;
            }
          } catch {}
          throw new Error(errMsg);
        }
        const data = (await res.json()) as BirtingurResponse;
        if (!cancelled) setAd(data);
      } catch (err) {
        console.error('Birtingur fetch villa:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Óþekkt villa');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAdRef.current = fetchAd;
    fetchAd();
    return () => {
      cancelled = true;
    };
  }, [slotId]);

  // Sjálfvirk endurnýjun byggt á TTL — eingöngu þegar plássið er sýnilegt
  useEffect(() => {
    if (!isAd(ad) || !isVisible) return;
    const timer = setTimeout(() => {
      if (fetchAdRef.current) fetchAdRef.current();
    }, ad.ttl * 1000);
    return () => clearTimeout(timer);
  }, [ad, isVisible]);

  // Áhorfsmæling (IAB standard: 50% sýnilegt í 1s)
  useEffect(() => {
    if (!isAd(ad)) return;
    if (impressionFired.current === ad.creativeId) return;
    const targetUrl = ad.impressionPixel.startsWith('http')
      ? ad.impressionPixel
      : `${SERVING_BASE}${ad.impressionPixel}`;
    const fireImpression = () => {
      impressionFired.current = ad.creativeId;
      const img = new Image();
      img.src = targetUrl;
    };
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      let timer: ReturnType<typeof setTimeout>;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timer = setTimeout(() => {
                fireImpression();
                observer.disconnect();
              }, 1000);
            } else {
              clearTimeout(timer);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(containerRef.current);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      fireImpression();
    }
  }, [ad]);

  // Pageview-talning fyrir empty svör (uncached slots).
  // Án þessa eru heimsóknir á síður með uncached slots ósýnilegar í stats Birtingur.
  useEffect(() => {
    if (!ad || pageviewFired.current) return;
    if ('empty' in ad && ad.impressionPixel) {
      pageviewFired.current = true;
      const img = new Image();
      img.src = ad.impressionPixel.startsWith('http')
        ? ad.impressionPixel
        : `${SERVING_BASE}${ad.impressionPixel}`;
    }
  }, [ad]);

  if (loading) {
    return (
      <div
        style={{ width, height }}
        className={`bg-gray-100 animate-pulse rounded-lg ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Villa, óþekkt slot, eða gagnsætt fallback — höldum plássinu með ósýnilegum pixel
  if (error || !isAd(ad) || ad.creativeId === 'cre_fallback_transparent') {
    if (error) {
      console.warn('Birtingur load error, rendering transparent fallback:', error);
    }
    return (
      <div
        ref={containerRef}
        style={{ width, height }}
        aria-hidden="true"
        className={className}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt=""
          width={1}
          height={1}
          style={{ width: 1, height: 1, opacity: 0 }}
        />
      </div>
    );
  }

  const clickUrl = ad.clickUrl.startsWith('http')
    ? ad.clickUrl
    : `${SERVING_BASE}${ad.clickUrl}`;

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={`relative overflow-hidden rounded-xl ad-slot ${className}`}
    >
      <a
        href={clickUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt="Auglýsing frá Birtingur"
          width={ad.width}
          height={ad.height}
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
}

