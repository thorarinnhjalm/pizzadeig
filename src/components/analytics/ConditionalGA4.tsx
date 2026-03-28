'use client';

import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

export function ConditionalGA4({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  // Don't track admin pages
  if (pathname?.includes('/admin')) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
