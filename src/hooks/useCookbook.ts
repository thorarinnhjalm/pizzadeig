'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useCookbook(recipeId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !recipeId) {
      setIsSaved(false);
      setLoading(false);
      return;
    }

    const checkSave = async () => {
      setLoading(true);
      try {
        const saveRef = doc(db, 'saves', `${user.uid}_${recipeId}`);
        const snap = await getDoc(saveRef);
        setIsSaved(snap.exists());
      } catch (e) {
        console.error('Error checking cookbook save:', e);
      } finally {
        setLoading(false);
      }
    };
    checkSave();
  }, [user, recipeId]);

  const toggleSave = async () => {
    if (!user || !recipeId) return;
    const saveRef = doc(db, 'saves', `${user.uid}_${recipeId}`);
    try {
      if (isSaved) {
        await deleteDoc(saveRef);
        setIsSaved(false);
      } else {
        await setDoc(saveRef, {
          user_uid: user.uid,
          target_type: 'recipe',
          target_id: recipeId,
          created_at: serverTimestamp()
        });
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error toggling cookbook save:', e);
    }
  };

  return { isSaved, loading, toggleSave };
}
