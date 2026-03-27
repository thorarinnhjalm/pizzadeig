'use client';

import { Share2, Link as LinkIcon, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  url: string;
  title: string;
  locale: 'is' | 'en';
}

export function ShareButtons({ url, title, locale }: Props) {
  const shareData = {
    title,
    url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert(locale === 'is' ? 'Hlekkur afritaður!' : 'Link copied!');
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-bold text-[var(--color-text-secondary)] mr-2 uppercase tracking-wider">{locale === 'is' ? 'Deila:' : 'Share:'}</span>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-sm font-bold text-xs" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}>
        FB
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors shadow-sm font-bold text-xs" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')}>
        X
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-colors shadow-sm" onClick={copyLink}>
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors shadow-sm" onClick={() => window.print()}>
        <Printer className="w-4 h-4" />
      </Button>
    </div>
  );
}
