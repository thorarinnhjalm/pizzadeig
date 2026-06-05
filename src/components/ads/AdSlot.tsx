'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ad } from '@/types/ad';
import { mockAds } from '@/lib/mockData';

interface Props {
  placement: string;
  format: '1018x360' | '1080x240' | '300x250' | '310x400' | '320x50' | '468x60' | '980x120' | '320x100' | 'sponsored_card';
  className?: string;
  fallbackText?: string;
}

interface ExtendedAd extends Ad {
  birtingurImpressionUrl?: string;
}

const SERVING_BASE_URL = process.env.NEXT_PUBLIC_BIRTINGUR_SERVING_URL || 'http://localhost:3002';

export function AdSlot({ placement, format, className = '', fallbackText }: Props) {
  const [ad, setAd] = useState<ExtendedAd | null>(null);
  const [loading, setLoading] = useState(true);
  const impressionRecorded = useRef(false);

  useEffect(() => {
    async function fetchAd() {
      try {
        if (format === '980x120' || format === '320x100') {
          const slotId = format === '980x120' ? 'slot_d9e8f575bb5fcd828401fd5a' : 'slot_2ef83ffdcd8057d793f6c9c6';
          const response = await fetch(`${SERVING_BASE_URL}/v1/ad?slot=${slotId}&consent=none`);
          if (response.ok) {
            const data = await response.json();
            setAd({
              id: data.creativeId,
              name: 'Birtingur Ad',
              client: 'Birtingur.app',
              format: format as any,
              image_url: data.imageUrl,
              target_url: data.clickUrl,
              status: 'active',
              placements: [placement],
              start_date: null as any,
              end_date: null as any,
              birtingurImpressionUrl: data.impressionPixel.startsWith('http')
                ? data.impressionPixel
                : `${SERVING_BASE_URL}${data.impressionPixel}`
            });
          } else {
            setAd(null);
          }
          return;
        }

        const q = query(
          collection(db, 'ads'),
          where('status', '==', 'active'),
          where('placements', 'array-contains', placement),
          where('format', '==', format),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setAd({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Ad);
        } else {
          // Fallback trigger
          const fallback = mockAds.find(m => m.placements.includes(placement) && m.creatives?.[format as keyof typeof m.creatives]);
          if (fallback) setAd(fallback);
        }
      } catch (error) {
        console.error('Error fetching ad slot:', error);
        // Provide gorgeous UX mock datasets instead of crashing or showing grey boxes if DB is offline.
        const fallback = mockAds.find(m => m.placements.includes(placement) && m.creatives?.[format as keyof typeof m.creatives]);
        if (fallback) setAd(fallback);
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [placement, format]);

  useEffect(() => {
    if (ad && !impressionRecorded.current) {
      impressionRecorded.current = true;
      if (ad.birtingurImpressionUrl) {
        fetch(ad.birtingurImpressionUrl, { mode: 'no-cors' }).catch(console.error);
      } else {
        // Record Impression via API Proxy to avoid exposing direct unauthenticated firestore writes unnecessarily if possible
        fetch('/api/ads/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ad_id: ad.id, type: 'impression', placement })
        }).catch(console.error);
      }
    }
  }, [ad, placement]);

  const handleClick = () => {
    if (!ad) return;

    if (ad.birtingurImpressionUrl) {
      if (ad.target_url) {
        window.open(ad.target_url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    fetch('/api/ads/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad_id: ad.id, type: 'click', placement })
    }).catch(console.error);
    
    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-100 animate-pulse rounded-lg border border-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Safna Auglýsingu</span>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className={`bg-[#F8FAFC] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm font-medium rounded-xl ${className}`}>
         <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 bg-(--color-bg-secondary) px-2 py-0.5 rounded shadow-sm border border-gray-100">Laust Auglýsingapláss</span>
         {fallbackText || placement}
      </div>
    );
  }

  const imageSrc = ad.creatives?.[format as keyof typeof ad.creatives] || ad.image_url;
  if (!imageSrc) return null; // Don't show if missing creative

  return (
    <div 
      onClick={handleClick}
      className={`relative cursor-pointer group overflow-hidden rounded-xl border border-(--color-border) shadow-sm hover:shadow-lg transition-all bg-(--color-bg-secondary) ad-slot ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc} 
        alt={ad.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
      />
    </div>
  );
}
