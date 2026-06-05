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
}

type BirtingurResponse = BirtingurAd | BirtingurEmpty;

function isAd(r: BirtingurResponse | null): r is BirtingurAd {
  return !!r && !('empty' in r);
}

function absolutize(path: string): string {
  return path.startsWith('http') ? path : `${SERVING_BASE}${path}`;
}

interface Props {
  slotId: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Hybrid/Headless integration með Birtingur Serving API.
 * Sækir auglýsingu beint úr REST API svo við höldum stjórn á fallback
 * og forðumst layout-shift sem widget.js myndi annars valda.
 *
 * Birtir bæði alvöru herferðir og Birtingur house ads (cre_fallback_birtingur),
 * og fellur saman alveg ef slot er ekki til ({empty: true}).
 */
export function BirtingurAdSlot({ slotId, width, height, className = '' }: Props) {
  const [ad, setAd] = useState<BirtingurResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const impressionFired = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAd() {
      try {
        const res = await fetch(
          `${SERVING_BASE}/v1/ad?slot=${encodeURIComponent(slotId)}&consent=none`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Birtingur ${res.status}`);
        const data = (await res.json()) as BirtingurResponse;
        if (!cancelled) setAd(data);
      } catch (err) {
        console.error('Birtingur fetch villa:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAd();
    return () => {
      cancelled = true;
    };
  }, [slotId]);

  // Birtingatalning: hlaða impressionPixel ósýnilega einu sinni per creative.
  // Þetta nær líka pageview-talningu fyrir house ads, svo Birtingur veit
  // um trafficið okkar þótt engin keypt herferð sé í gangi.
  useEffect(() => {
    if (!isAd(ad)) return;
    if (impressionFired.current === ad.creativeId) return;
    impressionFired.current = ad.creativeId;
    const img = new Image();
    img.src = absolutize(ad.impressionPixel);
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

  // Slot finnst ekki — fellum það alveg saman (Birtingur leiðbeining).
  if (!isAd(ad)) {
    return null;
  }

  return (
    <a
      href={absolutize(ad.clickUrl)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{ width, height }}
      className={`relative block overflow-hidden rounded-xl ad-slot ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.imageUrl}
        alt="Auglýsing"
        width={ad.width}
        height={ad.height}
        className="w-full h-full object-cover"
      />
    </a>
  );
}

/** Þekkt pláss frá Birtingur — sjá `list_my_slots` MCP tólið. */
export const BIRTINGUR_SLOTS = {
  billboard_980x120: 'slot_d9e8f575bb5fcd828401fd5a',
  mobile_320x100: 'slot_2ef83ffdcd8057d793f6c9c6',
} as const;
