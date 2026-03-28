'use client';

import { Link as LinkIcon, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  url: string;
  title: string;
  locale: 'is' | 'en';
}

export function ShareButtons({ url, title, locale }: Props) {


  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert(locale === 'is' ? 'Hlekkur afritaður!' : 'Link copied!');
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-bold text-muted-foreground mr-2 uppercase tracking-wider">{locale === 'is' ? 'Deila:' : 'Share:'}</span>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-sm font-bold text-xs cursor-pointer" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}>
        FB
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors shadow-sm font-bold text-xs cursor-pointer" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')}>
        X
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm cursor-pointer" onClick={copyLink}>
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border/50 bg-card text-muted-foreground hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors shadow-sm cursor-pointer" onClick={() => window.print()}>
        <Printer className="w-4 h-4" />
      </Button>
    </div>
  );
}
