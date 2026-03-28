'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { RatingPizzas } from './RatingPizzas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Props {
  targetId: string;
  targetType: 'recipe' | 'restaurant' | 'menu_item';
  locale: 'is' | 'en';
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ targetId, targetType, locale, onReviewSubmitted }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const reviewData = {
        target_id: targetId,
        target_type: targetType,
        author_uid: user.uid,
        author_name: user.displayName || 'Unknown',
        author_avatar: user.photoURL || '',
        rating,
        comment_is: locale === 'is' ? comment : '',
        comment_en: locale === 'en' ? comment : '',
        likes_count: 0,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      setRating(0);
      setComment('');
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(locale === 'is' ? 'Villa kom upp við að senda umsögn. Reyndu aftur.' : 'Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl text-center border border-border">{locale === 'is' ? 'Skráðu þig inn til að gefa umsögn.' : 'Log in to write a review.'}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="font-bold text-xl text-foreground font-display">{locale === 'is' ? 'Skildu eftir umsögn' : 'Leave a Review'}</h3>
      <div>
        <Label className="mb-2 block text-muted-foreground">{locale === 'is' ? 'Einkunn' : 'Rating'}</Label>
        <RatingPizzas rating={rating} onChange={setRating} size={32} />
      </div>
      <div>
        <Label htmlFor="comment" className="text-muted-foreground">{locale === 'is' ? 'Umsögn (valkvætt)' : 'Comment (optional)'}</Label>
        <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder={locale === 'is' ? 'Hvað fannst þér?' : 'What did you think?'} className="mt-1.5 focus-visible:ring-primary" />
      </div>
      <Button type="submit" disabled={loading || rating === 0} className="w-full sm:w-auto btn-primary px-8">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {locale === 'is' ? 'Senda Umsögn' : 'Submit Review'}
      </Button>
      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-500/10 p-3 rounded-lg border border-green-500/20">{locale === 'is' ? 'Umsögn þín hefur verið send! 🎉' : 'Your review has been submitted! 🎉'}</p>}
    </form>
  );
}
