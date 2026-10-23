import type { Metadata } from 'next';
import { localeAlternates } from '@/lib/seo';
import { Shield } from 'lucide-react';
import { CookieSettingsButton } from '@/components/analytics/CookieSettingsButton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    alternates: localeAlternates(locale, '/personuvernd'),
    title: isIs
      ? 'Persónuverndarstefna | Pizzadeig.is'
      : 'Privacy Policy | Pizzadeig.is',
    description: isIs
      ? 'Hvaða gögnum Pizzadeig.is safnar, hvernig þau eru notuð, hverjir eru þjónustuaðilar og hver réttindi þín eru. Persónuverndarstefna vefsins.'
      : 'What data Pizzadeig.is collects, how it is used, which service providers are involved and what your rights are. The privacy policy of the site.',
  };
}

export default async function PersonuverndPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      <div className="bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Persónuverndarstefna' : 'Privacy Policy'}
          </h1>
          <p className="text-sm text-(--color-text-secondary)">
            {isIs ? 'Síðast uppfært: 23. október 2026' : 'Last updated: October 23, 2026'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12 prose prose-lg text-(--color-text-secondary)">
        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '1. Hvaða gögn söfnum við?' : '1. What data do we collect?'}
        </h2>
        <p>
          {isIs
            ? 'Ef þú skráir þig inn með Google geymum við nafn, netfang og prófílmynd, ásamt umsögnum og uppskriftum sem þú sendir inn. Ef þú samþykkir vefkökur safnar Google Analytics upplýsingum um notkun vefsins (sjá 5. lið).'
            : 'If you sign in with Google we store your name, email and profile picture, along with reviews and recipes you submit. If you accept cookies, Google Analytics collects information about how the site is used (see section 5).'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '2. Hvernig notum við gögnin?' : '2. How do we use the data?'}
        </h2>
        <p>
          {isIs
            ? 'Gögnin eru notuð til að veita þér aðgang að síðunni, sýna notendaprófíla og, ef þú samþykkir vefkökur, til að sjá hvernig vefurinn er notaður svo hægt sé að bæta hann. Vefurinn sendir ekki út fréttabréf.'
            : 'Data is used to give you access to the site, show user profiles and, if you accept cookies, to see how the site is used so it can be improved. The site does not send newsletters.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '3. Þjónustuaðilar' : '3. Service providers'}
        </h2>
        <p>
          {isIs
            ? 'Við notum Firebase (Google) fyrir auðkenningu og gagnagrunn, Vercel til hýsingar og Google Analytics til vefmælinga (aðeins ef þú samþykkir). Auglýsingar á vefnum eru birtar í gegnum Birting án persónusniðinnar miðunar. Netföng sem skráð voru á póstlista vefsins áður eru geymd hjá Resend; þú getur beðið um að þeim sé eytt (sjá 4. lið).'
            : 'We use Firebase (Google) for authentication and database, Vercel for hosting and Google Analytics for site statistics (only if you accept). Ads on the site are served through Birtingur without personalised targeting. Email addresses that were signed up to the site\'s mailing list earlier are stored with Resend; you can ask for them to be deleted (see section 4).'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '4. Réttur þinn' : '4. Your rights'}
        </h2>
        <p>
          {isIs
            ? 'Þú getur hvenær sem er óskað eftir að fá upplýsingar um þau gögn sem við höfum um þig, eða beðið um að þeim sé eytt. Hafðu samband á thorarinnhjalmarsson@gmail.com.'
            : 'You may at any time request information about the data we hold about you, or request its deletion. Contact thorarinnhjalmarsson@gmail.com.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '5. Fótspor (Cookies)' : '5. Cookies'}
        </h2>
        <p>
          {isIs
            ? 'Vefurinn notar nauðsynlegar vefkökur til innskráningar og til að muna tungumálaval þitt. Google Analytics setur vefkökur (_ga) aðeins ef þú samþykkir þær í borðanum sem birtist við fyrstu heimsókn. Ef þú hafnar eru engar mælingarvefkökur settar. Val þitt er geymt í vafranum þínum.'
            : 'The site uses essential cookies for sign-in and to remember your language. Google Analytics sets cookies (_ga) only if you accept them in the banner shown on your first visit. If you decline, no analytics cookies are set. Your choice is stored in your browser.'}
        </p>
        <p>
          <CookieSettingsButton locale={isIs ? 'is' : 'en'} />
        </p>
      </div>
    </main>
  );
}
