'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pizza } from 'lucide-react';

const messages = [
  {
    title: 'Deigið féll',
    subtitle: 'Úbbs!',
    description: 'Eitthvað fór úrskeiðis við baksturinn á þessari síðu. Við erum strax byrjuð að hnoða nýtt deig.',
    emoji: '💥',
  },
  {
    title: 'Pizzan brann',
    subtitle: 'Nei!',
    description: 'Þessi síða var of lengi í ofninum og brann í kol. Prófaðu aftur eða farðu heim.',
    emoji: '🔥',
  },
  {
    title: 'Tómatarnir kláruðust',
    subtitle: 'Ó nei!',
    description: 'Við fundum ekki hráefnin fyrir þessa síðu. Kannski er hún búin að seljast upp?',
    emoji: '🍅',
  },
  {
    title: 'Ofninn slokknaði',
    subtitle: 'Hmm!',
    description: 'Þessi síða er ekki tilbúin ennþá. Viðarofninn þarf aðeins meiri eld.',
    emoji: '🧯',
  },
  {
    title: 'Deigið hvarf',
    subtitle: 'Hvað?!',
    description: 'Einhver borðaði deigið áður en við gátum sett það í ofninn. Klassískt.',
    emoji: '👻',
  },
];

export default function NotFound() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * messages.length));
  }, []);

  const msg = messages[index];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="relative z-10 text-center max-w-lg bg-(--color-bg-secondary) p-12 rounded-3xl border border-(--color-border) shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Pizza className="w-28 h-28 text-(--color-brand) animate-pulse" />
            <span className="absolute -top-2 -right-2 text-4xl">{msg.emoji}</span>
          </div>
        </div>
        <p className="font-chalk text-2xl text-ring mb-2">{msg.subtitle}</p>
        <h1 className="font-display font-bold text-5xl text-(--color-text-primary) mb-6">{msg.title}</h1>
        <p className="font-body text-(--color-text-secondary) mb-8 text-lg leading-relaxed">
          {msg.description}
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 h-12 px-8 text-base rounded-xl">
          <Pizza className="w-5 h-5" />
          Aftur á forsíðu
        </Link>
      </div>
    </div>
  );
}
