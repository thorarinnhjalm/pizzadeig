'use client';

import { Link as LinkIcon, Printer, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Props {
  url: string;
  title: string;
  locale: 'is' | 'en';
}

export function ShareButtons({ url, title, locale }: Props) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert(locale === 'is' ? 'Hlekkur afritaður!' : 'Link copied!');
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 items-center">
      <span className="text-sm font-bold text-muted-foreground mr-1 md:mr-2 uppercase tracking-wider hidden sm:inline">
        {locale === 'is' ? 'Deila:' : 'Share:'}
      </span>
      
      {canShare && (
        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm cursor-pointer" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
        </Button>
      )}

      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors shadow-sm cursor-pointer" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')}>
        <MessageCircle className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-sm font-bold text-xs cursor-pointer" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}>
        FB
      </Button>

      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm cursor-pointer" onClick={copyLink}>
        <LinkIcon className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors shadow-sm cursor-pointer hidden md:flex" onClick={() => window.print()}>
        <Printer className="w-4 h-4" />
      </Button>
    </div>
  );
}
