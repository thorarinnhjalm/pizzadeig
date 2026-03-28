import { DoughCalculator } from '@/components/dough/DoughCalculator';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'is' ? "Deigstýring — Reiknaðu pizzadeigið þitt | Pizzadeig.is" : "Dough Planner — Calculate your pizza dough | Pizzadeig.is",
    description: locale === 'is' ? "Skipuleggðu pizzukvöldið. Reiknaðu hráefnin og láttu okkur minna þig á hvenær á að blanda, hefa og baka." : "Plan your pizza night. Calculate ingredients and let us remind you when to mix, proof, and bake.",
  };
}

export default async function DoughPlannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="flex-1 bg-wood min-h-screen pb-24 border-t border-(--color-border-light)">
      {/* Hero */}
      <section className="bg-brick border-b-4 border-ring py-16 md:py-24 relative fire-glow shadow-xl">
         <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
         <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="font-chalk text-6xl md:text-8xl text-(--color-text-chalk) mb-6 drop-shadow-md">
              {locale === 'is' ? 'Deigstýringin' : 'The Dough Planner'}
            </h1>
            <p className="font-body text-xl md:text-2xl text-(--color-text-secondary) max-w-2xl mx-auto drop-shadow">
              {locale === 'is' 
                ? 'Skipuleggðu pizzukvöldið — segðu okkur hvenær þú ætlar að borða og við reiknum út allt sem þú þarft og hvenær.'
                : 'Plan your pizza night — tell us when you eat and we calculate everything you need and when.'}
            </p>
         </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm font-chalk text-[16px] text-(--color-text-secondary) flex items-center gap-3 mb-12">
          <Link href="/" className="hover:text-(--color-brand) transition-colors">{locale === 'is' ? 'Forsíða' : 'Home'}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-ring">{locale === 'is' ? 'Deigstýring' : 'Dough Planner'}</span>
        </nav>

        <div className="max-w-5xl mx-auto">
          <DoughCalculator locale={locale as 'is' | 'en'} />
        </div>
      </div>
    </main>
  );
}
