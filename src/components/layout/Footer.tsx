import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BirtingurAdSlot, BIRTINGUR_SLOTS } from '../ads/BirtingurAdSlot';

export function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="w-full mt-auto bg-secondary border-t border-border text-muted-foreground">
      <div className="pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-(--color-border-light) pb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="font-display text-2xl font-bold text-primary">Pizzadeig.is</span>
              </Link>
              <p className="text-muted-foreground mb-6">{t('slogan')}</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary transition-colors text-foreground">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--color-brand) transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--color-brand) transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.34 2.88 2.88 0 012.31-4.53 2.66 2.66 0 011.61.53V9.5a5.79 5.79 0 00-2-.36 5.86 5.86 0 00-1.8 11.53 5.84 5.84 0 005.13-2.92 5.91 5.91 0 00.91-3.23V7.22a8.55 8.55 0 004.28 1.15V5.1a5.61 5.61 0 01-2.02.66z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 font-display text-foreground">{t('links_title_1')}</h4>
              <ul className="space-y-3">
                <li><Link href="/flokkar/deig" className="hover:text-amber-500 transition-colors">Deig</Link></li>
                <li><Link href="/flokkar/sosur" className="hover:text-amber-500 transition-colors">Sósur</Link></li>
                <li><Link href="/flokkar/ostur" className="hover:text-amber-500 transition-colors">Ostur</Link></li>
                <li><Link href="/topplisti" className="hover:text-amber-500 transition-colors">Topplisti</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 font-display text-foreground">{t('links_title_2')}</h4>
              <ul className="space-y-3">
                <li><Link href="/um-okkur" className="hover:text-amber-500 transition-colors">{t('about')}</Link></li>
                <li><Link href="/skilmalar" className="hover:text-amber-500 transition-colors">{t('terms')}</Link></li>
                <li><Link href="/personuvernd" className="hover:text-amber-500 transition-colors">{t('privacy')}</Link></li>
                <li><Link href="/tengilidir" className="hover:text-amber-500 transition-colors">{t('contact')}</Link></li>
                <li><Link href="/auglysingar" className="hover:text-amber-500 transition-colors">Auglýsa á Pizzadeig.is</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Pizzadeig.is — Allt um pizzu</p>
          </div>
        </div>
      </div>
      
      {/* 320x100 Birtingur Mobile Sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-wood border-t border-amber-600/50 p-2 flex justify-center pb-safe">
         <BirtingurAdSlot
           slotId={BIRTINGUR_SLOTS.mobile_320x100}
           width={320}
           height={100}
           fallbackText="Púls Mobile 320x100"
         />
      </div>
    </footer>
  );
}
