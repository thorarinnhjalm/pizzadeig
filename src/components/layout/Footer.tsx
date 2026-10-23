import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BirtingurAdSlot } from '../ads/BirtingurAdSlot';
import { BIRTINGUR_SLOTS } from '../ads/birtingurSlots';

export function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="w-full mt-auto bg-secondary border-t border-border text-muted-foreground">
      {/* 728x90 Birtingur Leaderboard ofan við footer (desktop) */}
      <div className="w-full py-8 border-b border-border/50 hidden md:flex justify-center">
        <BirtingurAdSlot
          slotId={BIRTINGUR_SLOTS.above_footer_728x90}
          width={728}
          height={90}
        />
      </div>

      <div className="pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-(--color-border-light) pb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="font-display text-2xl font-bold text-primary">Pizzadeig.is</span>
              </Link>
              <p className="text-muted-foreground">{t('slogan')}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 font-display text-foreground">{t('links_title_1')}</h4>
              <ul className="space-y-3">
                <li><Link href="/flokkar/deig" className="hover:text-amber-500 transition-colors">Deig</Link></li>
                <li><Link href="/flokkar/sosur" className="hover:text-amber-500 transition-colors">Sósur</Link></li>
                <li><Link href="/flokkar/ostur" className="hover:text-amber-500 transition-colors">Ostur</Link></li>
                <li><Link href="/topplisti" className="hover:text-amber-500 transition-colors">Topplisti</Link></li>
                <li><Link href="/pizzuverd" className="hover:text-amber-500 transition-colors">{t('pizza_prices')}</Link></li>
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
         />
      </div>
    </footer>
  );
}
