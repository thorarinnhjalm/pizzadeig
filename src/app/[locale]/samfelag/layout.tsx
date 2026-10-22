import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';

// The page is a client component, so its metadata lives in this layout.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/samfelag'),
    title: isIs ? 'Pizzusamfélagið | Pizzadeig.is' : 'Pizza Community | Pizzadeig.is',
    description: isIs
      ? 'Deildu þinni eigin pizzuuppskrift með öðrum íslenskum pizzubökurum. Notaðu deigreiknivélina, topplistann og uppskriftaleit út frá hráefnunum sem þú átt.'
      : 'Share your own pizza recipe with other Icelandic pizza bakers. Use the dough calculator, the top list and a recipe finder based on the ingredients you have.',
  };
}

export default function SamfelagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
