'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CommunityRating {
  avg: number;
  count: number;
  loading: boolean;
}

export function useCommunityRating(targetId: string, targetType: 'restaurant' | 'recipe' | 'menu_item'): CommunityRating {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;

    const fetchRating = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('target_id', '==', targetId),
          where('target_type', '==', targetType)
        );
        const snapshot = await getDocs(q);
        if (snapshot.size > 0) {
          const total = snapshot.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), 0);
          setAvg(total / snapshot.size);
          setCount(snapshot.size);
        }
      } catch (error) {
        console.error('Error fetching community rating:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [targetId, targetType]);

  return { avg, count, loading };
}
