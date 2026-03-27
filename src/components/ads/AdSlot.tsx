'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, increment, updateDoc, doc } from 'firebase/firestore';

interface AdSlotProps {
  placement: string;
  format: string;
  className?: string;
  fallbackText?: string;
}

export function AdSlot({ placement, format, className = '', fallbackText }: AdSlotProps) {
  const [ad, setAd] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [impressionLogged, setImpressionLogged] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAd = async () => {
      try {
        const q = query(
          collection(db, 'ads'),
          where('status', '==', 'active'),
          where('placements', 'array-contains', placement)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          // Get a random active ad for this placement
          const docs = snapshot.docs;
          const randomDoc = docs[Math.floor(Math.random() * docs.length)];
          const adData = { id: randomDoc.id, ...randomDoc.data() };
          
          if (isMounted) {
            setAd(adData);
            setLoading(false);
            
            // Log Impression once
            if (!impressionLogged) {
              setImpressionLogged(true);
              try {
                const adRef = doc(db, 'ads', adData.id);
                await updateDoc(adRef, { impressions: increment(1) });
              } catch (err) {
                console.warn('Could not log impression', err);
              }
            }
          }
        } else {
          if (isMounted) setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch ad:', err);
        if (isMounted) setLoading(false);
      }
    };
    
    fetchAd();
    
    return () => { isMounted = false; };
  }, [placement, impressionLogged]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!ad) return;
    
    // Log Click
    try {
      const adRef = doc(db, 'ads', ad.id);
      await updateDoc(adRef, { clicks: increment(1) });
    } catch (err) {
      console.warn('Could not log ad click', err);
    }
    
    // Navigate safely (if it's an external URL)
    window.open(ad.target_url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 text-muted-foreground border-dashed border-2 rounded-xl animate-pulse ${className}`}>
        <span className="text-xs font-semibold text-center px-4">Sæki auglýsingu...</span>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 text-gray-400 border-dashed border-2 border-gray-200 rounded-xl ${className}`}>
        <span className="text-sm font-semibold text-center px-4 mb-2">
          {fallbackText || 'Auglýsa hér?'}
        </span>
        <a href="/hafa-samband" className="text-xs text-(--color-brand) hover:underline">Hafðu samband</a>
      </div>
    );
  }

  return (
    <a 
      href={ad.target_url} 
      onClick={handleClick}
      className={`block relative overflow-hidden rounded-xl bg-gray-100 group shadow-sm hover:shadow-lg transition-all cursor-pointer ${className}`}
      aria-label={`Sponsor: ${ad.client}`}
    >
      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-widest z-10 shadow-sm pointer-events-none">
        Auglýsing
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={ad.image_url} 
        alt={`Auglýsing frá ${ad.client}`} 
        className={`w-full h-full object-cover origin-center transition-transform duration-700 group-hover:scale-105`}
      />
    </a>
  );
}
