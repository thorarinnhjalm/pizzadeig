'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface Props {
  locale: 'is' | 'en';
}

export function NewsletterForm({ locale }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setEmail('');
    } catch (_err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-(--color-bg-secondary) border border-(--color-border-light) p-8 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-ring opacity-5 rounded-full translate-x-10 -translate-y-10" />
      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
         <div className="flex-1 text-center md:text-left">
            <h3 className="font-display font-bold text-3xl text-(--color-text-primary) mb-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
               <Mail className="w-8 h-8 text-(--color-brand)" />
               {locale === 'is' ? 'Pizzupósturinn' : 'The Pizza Post'}
            </h3>
            <p className="text-(--color-text-secondary) font-body text-lg">
               {locale === 'is' 
               ? 'Skráðu þig á póstlista og fáðu heitustu uppskriftirnar beint í innhólfið.'
               : 'Join our newsletter to get the hottest recipes straight to your inbox.'}
            </p>
         </div>
         <form onSubmit={subscribe} className="flex-1 w-full max-w-md flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder={locale === 'is' ? 'Þitt netfang' : 'Your email address'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-(--color-bg-tertiary) text-(--color-text-primary) h-12 text-lg border-(--color-border-gold) w-full"
              disabled={status === 'loading' || status === 'success'}
              required
            />
            <Button type="submit" disabled={status === 'loading' || status === 'success'} className="btn-primary h-12 px-8 w-full sm:w-auto hover:bg-[#b02e0b] shadow-md border-x-transparent border-t-transparent border-b-4 border-[#912509]">
               {status === 'loading' ? '...' : status === 'success' ? '✅' : (locale === 'is' ? 'Skrá mig' : 'Subscribe')}
            </Button>
         </form>
      </div>
    </div>
  );
}
