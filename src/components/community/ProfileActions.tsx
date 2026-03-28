'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FollowButton } from './FollowButton';
import { EditProfileModal } from './EditProfileModal';
import { Settings } from 'lucide-react';

import { UserProfile } from '@/types/user';

interface ProfileActionsProps {
  targetUid: string;
  locale: 'is' | 'en';
  initialUser: UserProfile | null;
}

export function ProfileActions({ targetUid, locale, initialUser }: ProfileActionsProps) {
  const { user: authUser, loading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // If loading auth state, we can't be sure, just show nothing or FollowButton skeleton
  if (loading) {
    return <div className="h-10 w-32 bg-muted rounded-full animate-pulse"></div>;
  }

  const isOwner = authUser?.uid === targetUid;

  if (isOwner) {
    return (
      <>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-background text-foreground border border-border hover:bg-muted px-6 py-2.5 rounded-full font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          {locale === 'is' ? 'Breyta prófíl' : 'Edit Profile'}
        </button>
        
        <EditProfileModal
          uid={targetUid}
          initialUser={initialUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          locale={locale}
        />
      </>
    );
  }

  // If not owner, they can follow
  return <FollowButton targetUid={targetUid} locale={locale} />;
}
