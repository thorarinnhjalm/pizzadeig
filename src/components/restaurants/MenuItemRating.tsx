'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RatingPizzas } from '@/components/community/RatingPizzas';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface Props {
  itemId: string;
  itemName: string;
  locale: 'is' | 'en';
}

export function MenuItemRating({ itemId, itemName, locale }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isIs = locale === 'is';

  const handleRate = async (newRating: number) => {
    if (!user) return;
    setRating(newRating);
    setLoading(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        target_id: itemId,
        target_type: 'menu_item',
        author_uid: user.uid,
        author_name: user.displayName || 'Unknown',
        author_avatar: user.photoURL || '',
        rating: newRating,
        comment_is: '',
        comment_en: '',
        likes_count: 0,
        created_at: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
        <span>🍕</span> {isIs ? `${rating}/5 — Takk!` : `${rating}/5 — Thanks!`}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-[10px] text-(--color-text-secondary) italic">
        {isIs ? 'Skráðu þig inn til að gefa einkunn' : 'Log in to rate'}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-(--color-brand)" />
      ) : (
        <RatingPizzas rating={rating} onChange={handleRate} size={16} />
      )}
    </div>
  );
}
