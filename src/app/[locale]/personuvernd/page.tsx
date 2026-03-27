import { Shield } from 'lucide-react';

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
            {isIs ? 'Síðast uppfært: 27. mars 2026' : 'Last updated: March 27, 2026'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12 prose prose-lg text-(--color-text-secondary)">
        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '1. Hvaða gögn söfnum við?' : '1. What data do we collect?'}
        </h2>
        <p>
          {isIs
            ? 'Við söfnum eftirfarandi upplýsingum þegar þú notar Pizzadeig.is: nafn, netfang, prófílmynd (ef þú notast við Google innskráningu), sem og umsagnir og uppskriftir sem þú sendir inn.'
            : 'We collect the following information when you use Pizzadeig.is: name, email, profile picture (via Google sign-in), as well as reviews and recipes you submit.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '2. Hvernig notum við gögnin?' : '2. How do we use the data?'}
        </h2>
        <p>
          {isIs
            ? 'Gögnin eru notuð til: að veita þér aðgang að síðunni, sýna notendaprófíla, senda fréttabréf (ef þú skráðir þig) og bæta notendaupplifunina.'
            : 'Data is used to: provide you with access to the site, display user profiles, send newsletters (if subscribed), and improve the user experience.'}
        </p>

        <h2 className="text-xl font-bold text-(--color-text-primary)">
          {isIs ? '3. Þjónustuaðilar' : '3. Service providers'}
        </h2>
        <p>
          {isIs
            ? 'Við notum Firebase (Google) fyrir auðkenningu og gagnagrunn, Vercel til hýsingar og Resend fyrir tölvupóst. Þessir aðilar hafa aðgang að nauðsynlegum gögnum til að veita þjónustuna.'
            : 'We use Firebase (Google) for authentication and database, Vercel for hosting, and Resend for email. These providers have access to necessary data to deliver their services.'}
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
            ? 'Við notum nauðsynleg vefkökur til innskráningar og til að muna tungumálaval þitt. Engar auglýsingavefkökur eru notaðar.'
            : 'We use essential cookies for authentication and to remember your language preference. No advertising cookies are used.'}
        </p>
      </div>
    </main>
  );
}
