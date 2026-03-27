import { Construction, Calculator } from 'lucide-react';

export default function DeigreiknivelPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="bg-(--color-bg-secondary) p-8 rounded-3xl max-w-lg w-full border border-(--color-border) shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mb-6">
          <Calculator className="w-8 h-8 text-(--color-brand)" />
        </div>
        <h1 className="text-3xl font-display font-bold text-(--color-text-primary) mb-3">
          Deigreiknivél (Í vinnslu)
        </h1>
        <p className="text-(--color-text-secondary) leading-relaxed">
          Þessi síða er ennþá í ofninum! Hér munum við fljótlega setja inn alvöru deigreiknivél sem hjálpar þér að finna nákvæm hlutföll fyrir fullkomna pizzudeigið.
        </p>
      </div>
    </main>
  );
}
