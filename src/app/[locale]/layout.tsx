import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Playfair_Display, Caveat, Work_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InstallPrompt } from '@/components/layout/InstallPrompt';
import '../globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-display' });
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-chalk' });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });
  
  return {
    title: `${t('title')} | Pizzadeig.is`,
    description: t('description'),
    metadataBase: new URL('https://pizzadeig.is'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'is': '/is',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      siteName: 'Pizzadeig.is',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: 'Pizzadeig.is - Absolute Pizza Perfection',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as 'is' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${caveat.variable} ${workSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FDF9F2" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[var(--color-bg-primary)]">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
          <InstallPrompt locale={locale as 'is' | 'en'} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

