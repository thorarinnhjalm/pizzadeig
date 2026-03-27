import { useTranslations } from 'next-intl';
import { Construction } from 'lucide-react';

export default function UnderConstructionPage() {
  const t = useTranslations('Index');
  
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="bg-(--color-bg-secondary) p-8 rounded-3xl max-w-lg w-full border border-(--color-border) shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-(--color-brand)" />
        </div>
        <h1 className="text-3xl font-display font-bold text-(--color-text-primary) mb-3">
          Í vinnslu
        </h1>
        <p className="text-(--color-text-secondary) leading-relaxed">
          Þessi síða er ennþá í ofninum! Við erum að dunda okkur við að hnoða saman frábæru efni hingað. 
          Kíktu aftur við bráðum!
        </p>
      </div>
    </main>
  );
}
