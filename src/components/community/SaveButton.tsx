'use client';

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookbook } from '@/hooks/useCookbook';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  recipeId: string;
  locale: 'is' | 'en';
}

export function SaveButton({ recipeId, locale }: Props) {
  const { user, loginWithGoogle } = useAuth();
  const { isSaved, loading, toggleSave } = useCookbook(recipeId);

  const handleClick = () => {
    if (!user) {
      if (confirm(locale === 'is' ? 'Þú þarft að skrá þig inn til að vista uppskriftir. Viltu skrá þig inn núna?' : 'You need to log in to save recipes. Log in now?')) {
        loginWithGoogle();
      }
      return;
    }
    toggleSave();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full shadow-sm transition-colors text-xs font-bold ${
        isSaved 
          ? 'bg-(--color-brand) text-white border-(--color-brand) hover:bg-(--color-brand)/90' 
          : 'bg-card text-muted-foreground border-border/50 hover:border-(--color-brand) hover:text-(--color-brand)'
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      <Bookmark className={`w-4 h-4 mr-1.5 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved 
        ? (locale === 'is' ? 'Vistað' : 'Saved') 
        : (locale === 'is' ? 'Vista í Mína bók' : 'Save')}
    </Button>
  );
}
