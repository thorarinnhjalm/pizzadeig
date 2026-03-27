'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review } from '@/types/review';
import { RatingPizzas } from './RatingPizzas';
import { UserAvatar } from './UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { is, enUS } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { LikeButton } from './LikeButton';

interface Props {
  targetId: string;
  targetType: 'recipe' | 'restaurant' | 'menu_item';
  locale: 'is' | 'en';
}

export function ReviewList({ targetId, targetType, locale }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        where('target_id', '==', targetId),
        where('target_type', '==', targetType),
        orderBy('created_at', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [targetId, targetType]);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-(--color-brand)" /></div>;
  }

  if (reviews.length === 0) {
    return <p className="text-(--color-text-secondary) italic py-6 bg-(--color-bg-secondary) rounded-xl text-center border border-dashed border-(--color-border-light)">{locale === 'is' ? 'Engar umsagnir ennþá. Vertu fyrstur!' : 'No reviews yet. Be the first!'}</p>;
  }

  return (
    <div className="space-y-6 mt-4">
      <h3 className="font-bold text-2xl text-(--color-text-primary) capitalize">{locale === 'is' ? 'Umsagnir' : 'Reviews'}</h3>
      <div className="space-y-4">
        {reviews.map((review) => {
          const date = review.created_at?.toDate ? review.created_at.toDate() : new Date();
          const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: locale === 'is' ? is : enUS });
          const comment = locale === 'is' ? review.comment_is : review.comment_en;

          return (
            <div key={review.id} className="bg-(--color-bg-secondary) p-5 rounded-2xl border border-(--color-border) shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar url={review.author_avatar} name={review.author_name} />
                  <div>
                    <p className="font-bold text-(--color-text-primary) text-sm">{review.author_name}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                  </div>
                </div>
                <RatingPizzas rating={review.rating} readonly size={16} />
              </div>
              {comment && <p className="text-(--color-text-secondary) text-sm mt-3 mb-4 leading-relaxed">{comment}</p>}
              <div className="flex items-center mt-2 pt-3 border-t border-(--color-border-light)">
                <LikeButton targetId={review.id} targetType="review" initialCount={review.likes_count || 0} locale={locale} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
