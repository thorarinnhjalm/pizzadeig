'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  targetId: string;
  targetType: 'recipe' | 'review';
  initialCount: number;
  locale: 'is' | 'en';
}

export function LikeButton({ targetId, targetType, initialCount, locale }: Props) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const checkLike = async () => {
      const likeId = `${user.uid}_${targetType}_${targetId}`;
      const docRef = doc(db, 'likes', likeId);
      const docSnap = await getDoc(docRef);
      setLiked(docSnap.exists());
      setLoading(false);
    };
    
    checkLike();
  }, [user, targetId, targetType]);

  const toggleLike = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    const likeId = `${user.uid}_${targetType}_${targetId}`;
    const likeRef = doc(db, 'likes', likeId);
    
    try {
      if (liked) {
        await deleteDoc(likeRef);
        setLiked(false);
        setCount(prev => Math.max(0, prev - 1));
      } else {
        await setDoc(likeRef, {
          user_uid: user.uid,
          target_type: targetType,
          target_id: targetId,
          created_at: serverTimestamp()
        });
        setLiked(true);
        setCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleLike} 
      disabled={loading || !user}
      className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${liked ? 'text-rose-500 scale-105' : 'text-gray-400 hover:text-gray-600'} ${!user && 'opacity-50 cursor-not-allowed'}`}
      title={!user ? (locale === 'is' ? 'Skráðu þig inn til að líka' : 'Log in to like') : ''}
    >
      <Heart className={`w-4 h-4 ${liked ? 'fill-current text-rose-500' : ''}`} />
      <span>{count > 0 ? count : (locale === 'is' ? 'Líkar þetta' : 'Like')}</span>
    </button>
  );
}
