'use client';

import { useEffect, useRef, useState } from 'react';

const SERVING_BASE = 'https://serving.birtingur.app';
const FALLBACK_CREATIVE = 'cre_fallback_transparent';

interface BirtingurAd {
  creativeId: string;
  imageUrl: string;
  clickUrl: string;
  width: number;
  height: number;
  impressionPixel: string;
  ttl: number;
}

interface Props {
  slotId: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
}

/**
 * Hybrid/Headless integration með Birtingur Serving API.
 * Sækir auglýsingu beint úr REST API svo við stjórnum fallback útliti
 * og forðumst layout-shift sem widget.js myndi annars valda.
 */
export function BirtingurAdSlot({ slotId, width, height, className = '', fallbackText }: Props) {
  const [ad, setAd] = useState<BirtingurAd | null>(null);
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
        const data = (await res.json()) as BirtingurAd;
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
  useEffect(() => {
    if (!ad || ad.creativeId === FALLBACK_CREATIVE) return;
    if (impressionFired.current === ad.creativeId) return;
    impressionFired.current = ad.creativeId;
    const img = new Image();
    img.src = `${SERVING_BASE}${ad.impressionPixel}`;
  }, [ad]);

  if (loading) {
    return (
      <div
        style={{ width, height }}
        className={`bg-gray-100 animate-pulse rounded-lg border border-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          Safna Auglýsingu
        </span>
      </div>
    );
  }

  if (!ad || ad.creativeId === FALLBACK_CREATIVE) {
    return (
      <div
        style={{ width, height }}
        className={`bg-[#F8FAFC] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm font-medium rounded-xl ${className}`}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 bg-(--color-bg-secondary) px-2 py-0.5 rounded shadow-sm border border-gray-100">
          Laust Auglýsingapláss
        </span>
        {fallbackText || `${width}×${height}`}
      </div>
    );
  }

  return (
    <a
      href={`${SERVING_BASE}${ad.clickUrl}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{ width, height }}
      className={`relative block overflow-hidden rounded-xl border border-(--color-border) shadow-sm hover:shadow-lg transition-all bg-(--color-bg-secondary) ad-slot ${className}`}
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
