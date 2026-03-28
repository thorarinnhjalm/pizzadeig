'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { X, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { UserProfile } from '@/types/user';

interface EditProfileModalProps {
  uid: string;
  initialUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  locale: 'is' | 'en';
}

export function EditProfileModal({ uid, initialUser, isOpen, onClose, locale }: EditProfileModalProps) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bioIs, setBioIs] = useState('');
  const [bioEn, setBioEn] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // 1. Try to load from existing Firestore profile
      const storedName = initialUser?.display_name || '';
      const storedAvatar = initialUser?.avatar_url || '';
      
      // 2. Fallback to Google Auth data if missing in Firestore
      const fallbackName = authUser?.displayName || '';
      const fallbackAvatar = authUser?.photoURL || '';

      setDisplayName(storedName || fallbackName);
      setAvatarUrl(storedAvatar || fallbackAvatar);
      setBioIs(initialUser?.bio_is || '');
      setBioEn(initialUser?.bio_en || '');
      setError('');
    }
  }, [isOpen, initialUser, authUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!displayName.trim()) {
        throw new Error(locale === 'is' ? 'Nafn má ekki vera tómt.' : 'Display name cannot be empty.');
      }

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        uid,
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim() || null,
        bio_is: bioIs.trim() || null,
        bio_en: bioEn.trim() || null,
        email: authUser?.email || initialUser?.email || '',
      }, { merge: true });

      router.refresh(); // Refresh Server Components to show updated data
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : (locale === 'is' ? 'Villa við vistun á prófíl' : 'Failed to save profile.');
      console.error(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {locale === 'is' ? 'Breyta prófíl' : 'Edit Profile'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                {locale === 'is' ? 'Nafn / Notendanafn' : 'Display Name'} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted border-2 border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all"
                placeholder={locale === 'is' ? 'Nafnið þitt' : 'Your name'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                {locale === 'is' ? 'Mynd (Slóð á mynd / URL)' : 'Avatar URL'}
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted border-2 border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all"
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {locale === 'is' 
                  ? 'Ef skilinn eftir tómur og þú notaðir Google innskráningu, gætum við sótt myndina þaðan.'
                  : 'Leave empty to use Google Avatar if authenticated via Google.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                {locale === 'is' ? 'Um mig (Íslenska)' : 'Bio (Icelandic)'}
              </label>
              <textarea
                value={bioIs}
                onChange={(e) => setBioIs(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-muted border-2 border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all resize-none"
                placeholder={locale === 'is' ? 'Hver ert þú?' : 'Who are you? (Icelandic view)'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                {locale === 'is' ? 'Um mig (Enska)' : 'Bio (English)'}
              </label>
              <textarea
                value={bioEn}
                onChange={(e) => setBioEn(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-muted border-2 border-transparent focus:border-primary focus:bg-background rounded-xl outline-none transition-all resize-none"
                placeholder="Who are you? (English view)"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-muted-foreground hover:bg-muted font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {locale === 'is' ? 'Hætta við' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? (locale === 'is' ? 'Vistar...' : 'Saving...') : (locale === 'is' ? 'Vista breytingar' : 'Save changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
