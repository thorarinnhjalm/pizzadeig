import { Scale } from 'lucide-react';

export default async function SkilmalarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 bg-(--color-brand)/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-(--color-brand)" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Skilmálar' : 'Terms of Service'}
          </h1>
          <p className="text-sm text-(--color-text-secondary)">
            {isIs ? 'Síðast uppfært: 27. mars 2026' : 'Last updated: March 27, 2026'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12 prose prose-lg text-(--color-text-secondary)">
        <h2 className="text-xl font-bold text-(--color-text-primary)">{isIs ? '1. Almennir skilmálar' : '1. General Terms'}</h2>
        <p>
          {isIs
            ? 'Með því að nota Pizzadeig.is samþykkir þú þessa skilmála. Þjónustan er veitt eins og hún er (\"as is\") og við ábyrgðumst ekki að hún sé alltaf aðgengileg eða villulaus.'
            : 'By using Pizzadeig.is you agree to these terms. The service is provided "as is" and we do not guarantee that it will always be available or error-free.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">{isIs ? '2. Notendaréttur' : '2. User Rights'}</h2>
        <p>
          {isIs
            ? 'Þú mátt nota efnið á síðunni til persónulegra nota. Endurutgáfa eða fjöldadreifing á efni síðunnar er óheimil án skriflegs leyfis.'
            : 'You may use the content on this site for personal use. Republishing or mass distribution of site content is prohibited without written permission.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">{isIs ? '3. Notendaefni' : '3. User Content'}</h2>
        <p>
          {isIs
            ? 'Allt efni sem þú sendir inn (umsagnir, myndir, uppskriftir) verður áfram þín eign en þú veitir okkur leyfi til að birta og dreifa efninu á síðunni.'
            : 'All content you submit (reviews, images, recipes) remains your property, but you grant us a license to display and distribute the content on the site.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">{isIs ? '4. Takmarkanir á ábyrgð' : '4. Limitation of Liability'}</h2>
        <p>
          {isIs
            ? 'Uppskriftir og ráðleggingar á Pizzadeig.is eru veittar til fróðleiks og afþreyingar. Við berum ekki ábyrgð á bakstursárangri, ofnæmisviðbrögðum eða öðrum afleiðingum af notkun efnisins.'
            : 'Recipes and advice on Pizzadeig.is are provided for educational and entertainment purposes. We are not liable for baking outcomes, allergic reactions, or other consequences of using the content.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">{isIs ? '5. Breytingar' : '5. Changes'}</h2>
        <p>
          {isIs
            ? 'Við áskildum okkur rétt til að breyta þessum skilmálum hvenær sem er. Uppfærðir skilmálar taka gildi um leið og þeir eru birtir.'
            : 'We reserve the right to modify these terms at any time. Updated terms take effect immediately upon publication.'}
        </p>
      </div>
    </main>
  );
}
