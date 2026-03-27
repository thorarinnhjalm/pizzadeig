'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, UserCheck } from 'lucide-react';

interface Props {
  targetUid: string;
  locale: 'is' | 'en';
}

export function FollowButton({ targetUid, locale }: Props) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.uid === targetUid) {
      setLoading(false);
      return;
    }
    
    const checkFollow = async () => {
      const followId = `${user.uid}_${targetUid}`;
      const docRef = doc(db, 'follows', followId);
      const docSnap = await getDoc(docRef);
      setFollowing(docSnap.exists());
      setLoading(false);
    };
    
    checkFollow();
  }, [user, targetUid]);

  const toggleFollow = async () => {
    if (!user || loading || user.uid === targetUid) return;
    
    setLoading(true);
    const followId = `${user.uid}_${targetUid}`;
    const followRef = doc(db, 'follows', followId);
    
    try {
      if (following) {
        await deleteDoc(followRef);
        setFollowing(false);
      } else {
        await setDoc(followRef, {
          follower_uid: user.uid,
          following_uid: targetUid,
          created_at: serverTimestamp()
        });
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.uid === targetUid) return null;

  return (
    <Button 
      onClick={toggleFollow} 
      disabled={loading}
      variant={following ? "outline" : "default"}
      className={`px-10 h-14 text-lg rounded-xl transition-all duration-300 font-bold ${
        following 
        ? "border-(--color-brand) text-(--color-brand) hover:bg-(--color-brand)/5" 
        : "bg-(--color-brand) hover:bg-[#b02e0b] shadow-[0_4px_14px_0_rgba(212,56,13,0.39)] hover:shadow-[0_6px_20px_rgba(212,56,13,0.23)] hover:-translate-y-1 text-white"
      }`}
    >
      {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 
        following ? <UserCheck className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />
      }
      {following 
        ? (locale === 'is' ? 'Ert að fylgja' : 'Following') 
        : (locale === 'is' ? 'Fylgja Notanda' : 'Follow User')
      }
    </Button>
  );
}
