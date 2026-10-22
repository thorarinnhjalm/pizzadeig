import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';

// The page is a client component, so its metadata lives in this layout.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/samfelag'),
    title: isIs
      ? 'Pizzasamfélagið — Deildu, lærðu og baktu með öðrum | Pizzadeig.is'
      : 'Pizza Community — Share, Learn & Bake Together | Pizzadeig.is',
    description: isIs
      ? 'Samfélag pizzabakara á Íslandi. Sjáðu hvað er að gerast, kynnstu pizzumeisturunum og deildu þinni eigin uppskrift.'
      : 'The community of pizza bakers in Iceland. See what is happening, meet the pizza masters and share your own recipe.',
  };
}

export default function SamfelagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
