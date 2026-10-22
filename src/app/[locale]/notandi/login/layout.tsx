import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';

// The page is a client component, so its metadata lives in this layout.
// `robots: noindex` is inherited from notandi/layout.tsx.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/notandi/login'),
    title: isIs ? 'Innskráning | Pizzadeig.is' : 'Sign In | Pizzadeig.is',
    description: isIs
      ? 'Skráðu þig inn eða stofnaðu aðgang á Pizzadeig.is til að vista uppskriftir, gefa einkunnir og deila þinni eigin pizzu.'
      : 'Sign in or create an account on Pizzadeig.is to save recipes, leave ratings and share your own pizza.',
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
