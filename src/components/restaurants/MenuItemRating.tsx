'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RatingPizzas } from '@/components/community/RatingPizzas';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Loader2, Pizza } from 'lucide-react';

interface Props {
  itemId: string;
  locale: 'is' | 'en';
}

export function MenuItemRating({ itemId, locale }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communityAvg, setCommunityAvg] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [fetchingRating, setFetchingRating] = useState(true);
  const isIs = locale === 'is';

  // Fetch existing community rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('target_id', '==', itemId),
          where('target_type', '==', 'menu_item')
        );
        const snapshot = await getDocs(q);
        if (snapshot.size > 0) {
          const total = snapshot.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), 0);
          setCommunityAvg(total / snapshot.size);
          setCommunityCount(snapshot.size);

          // Check if current user already rated
          if (user) {
            const userReview = snapshot.docs.find(doc => doc.data().author_uid === user.uid);
            if (userReview) {
              setRating(userReview.data().rating);
              setSubmitted(true);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching menu item rating:', err);
      } finally {
        setFetchingRating(false);
      }
    };

    fetchRating();
  }, [itemId, user]);

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
      // Update community stats optimistically
      const newTotal = communityAvg * communityCount + newRating;
      const newCount = communityCount + 1;
      setCommunityAvg(newTotal / newCount);
      setCommunityCount(newCount);
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show existing community rating
  const ratingDisplay = communityCount > 0 && (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Pizza className="w-3 h-3 text-primary" />
      <span className="font-bold text-foreground">{communityAvg.toFixed(1)}</span>
      <span>({communityCount})</span>
    </div>
  );

  if (fetchingRating) {
    return <div className="h-5" />;
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span>🍕</span> {isIs ? `${rating}/5 — Takk!` : `${rating}/5 — Thanks!`}
        </div>
        {ratingDisplay}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        {ratingDisplay}
        <div className="text-[10px] text-muted-foreground italic">
          {isIs ? 'Skráðu þig inn til að gefa einkunn' : 'Log in to rate'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <RatingPizzas rating={rating} onChange={handleRate} size={16} />
      )}
      {ratingDisplay}
    </div>
  );
}
