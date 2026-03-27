'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  locale: 'is' | 'en';
}

export function InstallPrompt({ locale }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-[var(--color-bg-secondary)] border border-[var(--color-border-gold)] rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] flex items-center justify-center shrink-0">
        <span className="text-2xl">🍕</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--color-text-primary)]">
          {locale === 'is' ? 'Settu Pizzadeig á heimaskjá!' : 'Add Pizzadeig to home screen!'}
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          {locale === 'is' ? 'Fáðu uppskriftir offline' : 'Get recipes offline'}
        </p>
      </div>
      <Button onClick={handleInstall} className="btn-primary px-3 py-2 h-auto text-xs shrink-0">
        <Download className="w-4 h-4" />
      </Button>
      <button onClick={() => setShowBanner(false)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
