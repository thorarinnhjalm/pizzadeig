'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-wood opacity-40 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 text-center max-w-lg bg-(--color-bg-secondary) p-12 rounded-3xl border border-(--color-border) shadow-2xl">
        <h1 className="font-display font-bold text-6xl text-(--color-brand) mb-6">Úbbs!</h1>
        <h2 className="font-chalk text-3xl text-ring mb-6">Deigið féll</h2>
        <p className="font-body text-(--color-text-secondary) mb-8 text-lg">
          Eitthvað fór úrskeiðis við baksturinn á þessari síðu. Við erum strax byrjuð að hnoða nýtt deig.
        </p>
        <div className="flex gap-4 justify-center">
           <button onClick={() => reset()} className="btn-secondary">Reyna aftur</button>
           <Link href="/" className="btn-primary">Fara heim</Link>
        </div>
      </div>
    </div>
  );
}
