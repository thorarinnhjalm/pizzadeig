import React from 'react';
import { Mail, TrendingUp, Users, Target } from 'lucide-react';

export default function AuglysingarPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:py-24 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-6">
          Auglýstu hjá okkur
        </h1>
        <p className="text-lg text-(--color-text-secondary) max-w-2xl mx-auto leading-relaxed">
          Pizzadeig.is er einn stærsti vettvangur á Íslandi fyrir áhugafólk um pizzabakstur. 
          Náðu til markhóps sem er virkur, áhugasamur og elskar að elda!
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-(--color-bg-secondary) p-8 rounded-3xl border border-(--color-border) flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mb-5">
            <Users className="w-7 h-7 text-(--color-brand)" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-(--color-text-primary)">Réttur markhópur</h3>
          <p className="text-(--color-text-secondary) text-sm leading-relaxed">
            Náðu beint til fólks sem hefur ástríðu yfir matargerð, bakstri og gæðavörum.
          </p>
        </div>

        <div className="bg-(--color-bg-secondary) p-8 rounded-3xl border border-(--color-border) flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mb-5">
            <TrendingUp className="w-7 h-7 text-(--color-brand)" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-(--color-text-primary)">Vaxandi samfélag</h3>
          <p className="text-(--color-text-secondary) text-sm leading-relaxed">
            Við erum ört stækkandi vefur þar sem þúsundir Íslendinga leita að uppskriftum í hverjum mánuði.
          </p>
        </div>

        <div className="bg-(--color-bg-secondary) p-8 rounded-3xl border border-(--color-border) flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mb-5">
            <Target className="w-7 h-7 text-(--color-brand)" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-(--color-text-primary)">Markviss birting</h3>
          <p className="text-(--color-text-secondary) text-sm leading-relaxed">
            Auglýsingar birtast á áberandi stöðum án þess að trufla upplifun notandans, fallegar og hnitmiðaðar.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-(--color-bg-secondary) rounded-3xl p-8 md:p-12 border border-(--color-border) text-center relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-(--color-text-primary)">Hafðu samband</h2>
          <p className="text-(--color-text-secondary) mb-8 max-w-xl mx-auto">
            Viltu vita meira um verð, staðsetningar eða aðra samstarfsmöguleika? Sendu okkur línu og við svörum fljótt og vel.
          </p>
          <a
            href="mailto:hallo@pizzadeig.is"
            className="inline-flex items-center justify-center space-x-3 bg-(--color-brand) text-white px-8 py-4 rounded-full font-bold hover:bg-(--color-brand)/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Mail className="w-5 h-5" />
            <span>Senda póst á hallo@pizzadeig.is</span>
          </a>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-(--color-brand)/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-(--color-brand)/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </main>
  );
}
