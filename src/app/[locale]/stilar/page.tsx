import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ChevronRight, Flame, Droplets, Clock, Wheat, ThermometerSun, Pizza } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  return {
    title: isIs
      ? 'Pizzustílar heimsins — Napólítönsk, New York, Detroit og fleiri | Pizzadeig.is'
      : 'Pizza Styles of the World — Neapolitan, New York, Detroit & More | Pizzadeig.is',
    description: isIs
      ? 'Kynntu þér alla helstu pizzustíla: napólítönsk, New York, al taglio, Detroit, sísílísk og pinsa. Vatnshlutfall, gerjun, hiti og ráð frá meistara.'
      : 'Learn all major pizza styles: Neapolitan, New York, al taglio, Detroit, Sicilian, and pinsa. Hydration, fermentation, temperature, and pro tips.',
    openGraph: {
      title: isIs ? 'Pizzustílar heimsins | Pizzadeig.is' : 'Pizza Styles of the World | Pizzadeig.is',
      url: `https://www.pizzadeig.is/${locale}/stilar`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'article',
    },
  };
}

const styles = [
  {
    id: 'napoli',
    emoji: '🇮🇹',
    title_is: 'Napólítönsk pizza',
    title_en: 'Neapolitan Pizza',
    subtitle_is: 'Upprunalega — frá hjarta Napólí',
    subtitle_en: 'The original — from the heart of Naples',
    desc_is: 'Napólítönsk pizza er grunnurinn að öllu. Deigið er einfalt — vatn, mjöl, salt og ger — en fullkomnað með löngri gerjun sem gefur því djúpt bragð og létta áferð. Botninn er mjúkur, loftugur og aðeins kolbrúnn (\"leopard spots\") frá 500°C steinofni. Klassísku variantarnir eru Margherita (San Marzano tómatsósa, mozzarella di bufala, basil, ólífuolía) og Marinara (tómatar, hvítlaukur, óreganó). Samkvæmt reglum AVPN (Associazione Verace Pizza Napoletana) má pizzan ekki vera stærri en 35 cm og á að baka á innan við 90 sekúndum.',
    desc_en: 'Neapolitan pizza is the foundation of it all. The dough is simple — water, flour, salt, and yeast — but perfected through long fermentation that gives it deep flavor and light texture. The crust is soft, airy, and lightly charred ("leopard spots") from a 500°C stone oven. The classic variants are Margherita (San Marzano tomato sauce, mozzarella di bufala, basil, olive oil) and Marinara (tomatoes, garlic, oregano). According to AVPN rules, the pizza must not exceed 35 cm and should bake in under 90 seconds.',
    hydration: '60–65%',
    ferment_is: '24–72 klst',
    ferment_en: '24–72 hrs',
    temp: '450–500°C',
    flour: 'Caputo Tipo 00',
    color: 'from-red-500/10 to-orange-500/5',
    accent: 'text-red-600',
    tips_is: 'Notaðu alltaf ferska mozzarella og heilaðu henni vel áður en þú setur á pizzuna. Forðastu of mikið álegg — einfaldleikinn er lykillinn.',
    tips_en: 'Always use fresh mozzarella and drain it well before placing on the pizza. Avoid overloading with toppings — simplicity is key.',
  },
  {
    id: 'ny-style',
    emoji: '🗽',
    title_is: 'New York-stíll',
    title_en: 'New York Style',
    subtitle_is: 'Stóra sneiðin — sveigjanleg og bragðmikil',
    subtitle_en: 'The big slice — foldable and flavorful',
    desc_is: 'New York-pizza er stór (45–50 cm), þunn og sveigjanleg — seld í risastórum sneiðum sem eru brotnar saman til að borða á gangi. Deigið inniheldur olíu og sykur sem gefur skorpunni gyllt og aðeins stökkt ytra lag á meðan innihaldið er mjúkt. Bökuð í venjulegum ofni á 250–300°C í 10–15 mínútur. Low-moisture mozzarella er notuð í stað ferskrar til að forðast of mikinn vökva. New York-stíll á rætur sínar í ítölskum innflytjendum sem aðlöguðu napólítönskar hefðir að bandarísku hráefni og ofnum.',
    desc_en: 'New York pizza is large (45–50 cm), thin, and foldable — sold in oversized slices meant to be folded and eaten on the go. The dough contains oil and sugar which gives the crust a golden, slightly crispy outer layer while keeping the inside soft. Baked in a standard oven at 250–300°C for 10–15 minutes. Low-moisture mozzarella is used instead of fresh to avoid excess liquid. NY-style traces its roots to Italian immigrants who adapted Neapolitan traditions to American ingredients and ovens.',
    hydration: '58–62%',
    ferment_is: '24–48 klst',
    ferment_en: '24–48 hrs',
    temp: '250–300°C',
    flour: 'Bread Flour (12–14% prótein)',
    color: 'from-blue-500/10 to-indigo-500/5',
    accent: 'text-blue-600',
    tips_is: 'Notaðu háprótein brauðmjöl til að fá seigt, teygjanlegt deig. Teygðu deigið í höndunum en ekki með kefli — kefli þrýstir loftinu út.',
    tips_en: 'Use high-protein bread flour for chewy, stretchy dough. Hand-stretch instead of using a rolling pin — it preserves the air bubbles.',
  },
  {
    id: 'al-taglio',
    emoji: '✂️',
    title_is: 'Al Taglio (rómversk)',
    title_en: 'Al Taglio (Roman)',
    subtitle_is: 'Skorin af bakka — létt eins og ský',
    subtitle_en: 'Cut from the tray — light as a cloud',
    desc_is: 'Pizza al taglio (\"pizza skorin\") er rómversk hefð þar sem pizzan er bökuð á stórum bökkum og skorin með skærum. Deigið er með mjög hátt vatnshlutfall (80%+) sem skapar ótrúlega létta og loftuga áferð — nánast eins og skýjabotn. Gerjunin tekur 48–72 klukkustundir í kæli sem gefur dýpt í bragði. Áleggssamsetningarnar eru oft óhefðbundnar og skapandi — frá kartöflum og rósmaríni til mortadella og pistasjukremi. Gabriele Bonci í Róm er helsti frumkvöðullinn.',
    desc_en: 'Pizza al taglio ("pizza by the cut") is a Roman tradition where pizza is baked on large trays and cut with scissors. The dough has very high hydration (80%+) creating an incredibly light and airy texture — almost cloud-like. Fermentation takes 48–72 hours in the fridge, giving depth of flavor. Topping combinations are often unconventional and creative — from potatoes and rosemary to mortadella and pistachio cream. Gabriele Bonci in Rome is the pioneering figure.',
    hydration: '80–85%',
    ferment_is: '48–72 klst',
    ferment_en: '48–72 hrs',
    temp: '280–320°C',
    flour: 'Tipo 0 / Tipo 1',
    color: 'from-emerald-500/10 to-green-500/5',
    accent: 'text-emerald-600',
    tips_is: 'Þetta deig er mjög blautt og erfitt í meðhöndlun. Notaðu „stretch and fold" tækni í stað þess að hnoða. Bleyjðu hendurnar vel í olíu.',
    tips_en: 'This dough is very wet and tricky to handle. Use stretch and fold technique instead of kneading. Keep your hands well oiled.',
  },
  {
    id: 'detroit',
    emoji: '🏭',
    title_is: 'Detroit-stíll',
    title_en: 'Detroit Style',
    subtitle_is: 'Ferhyrnd og flotleg — ostaskorpan er drottningin',
    subtitle_en: 'Rectangular and bold — the cheese crust is queen',
    desc_is: 'Detroit-pizza er ferhyrnd og bökuð í djúpri stálpönnu (upprunalega bílhlutapönnur frá verksmiðjum Detroit). Sérstæðasta einkenni hennar er Wisconsin brick cheese sem er lagt alla leið út að brúnum pönnunnar — þar sem það rennur niður og karamelliserast í ótrúlega stökka og ríka ostaskorpu. Sósan fer ofan á ostinn í „racing stripes" mynstri. Botninn er létt og loftugur af löngri gerjun en ytra lagið er stökkt og smjörkenndt frá pönnubökun.',
    desc_en: 'Detroit pizza is rectangular and baked in a deep steel pan (originally repurposed auto parts trays from Detroit factories). Its most distinctive feature is Wisconsin brick cheese laid all the way to the pan edges — where it flows down and caramelizes into an incredibly crispy, rich cheese crust. Sauce goes on top of the cheese in "racing stripes" pattern. The interior is light and airy from long fermentation while the outer layer is crispy and buttery from pan baking.',
    hydration: '65–70%',
    ferment_is: '24–48 klst',
    ferment_en: '24–48 hrs',
    temp: '250°C',
    flour: 'Bread Flour',
    color: 'from-amber-500/10 to-yellow-500/5',
    accent: 'text-amber-600',
    tips_is: 'Smyrðu pönnuna ríkulega með smjöri. Leggðu ostinn alla leið út í hornin — það er þar sem töfrar gerast. Sosan fer ALLTAF ofan á.',
    tips_en: 'Generously butter the pan. Push the cheese all the way to the corners — that\'s where the magic happens. Sauce ALWAYS goes on top.',
  },
  {
    id: 'sicilian',
    emoji: '🏝️',
    title_is: 'Sísílísk pizza (Sfincione)',
    title_en: 'Sicilian Pizza (Sfincione)',
    subtitle_is: 'Þykk, mjúk og ríkuleg — pizza með sál',
    subtitle_en: 'Thick, soft, and rich — pizza with soul',
    desc_is: 'Sfincione er sísílísk hátíðarpizza sem á rætur sínar í Palermo. Hún er þykk og mjúk — svipar til focaccia en er ríkari. Hefðbundin sfincione heldur tómatsósu, lauk, caciocavallo osti, andsjóvíum og brauðmylsnu sem myndar stökkt ytra lag. Brauðmylsnan var upprunalega notuð til að gera pizzuna ódýrari en endaði sem einkennandi áferðarþáttur. Deigið er olíuríkt og gerjað í 12–24 klukkustundir. Bökkuð í stórum ferhyrndum bökkum.',
    desc_en: 'Sfincione is a Sicilian celebration pizza rooted in Palermo. It\'s thick and soft — similar to focaccia but richer. Traditional sfincione features tomato sauce, onion, caciocavallo cheese, anchovies, and breadcrumbs that form a crispy outer layer. The breadcrumbs were originally used to make the pizza cheaper but became a defining textural element. The dough is oil-rich and fermented for 12–24 hours. Baked in large rectangular trays.',
    hydration: '70–75%',
    ferment_is: '12–24 klst',
    ferment_en: '12–24 hrs',
    temp: '220–250°C',
    flour: 'Semolina + Tipo 00 blanda',
    color: 'from-orange-500/10 to-red-500/5',
    accent: 'text-orange-600',
    tips_is: 'Steiktu laukinn vel — hann á að vera mjúkur og karamelliseraður. Brauðmylsnan á að vera gullbrún og stökk.',
    tips_en: 'Cook the onions well — they should be soft and caramelized. The breadcrumbs should be golden and crispy.',
  },
  {
    id: 'pinsa',
    emoji: '🫓',
    title_is: 'Pinsa Romana',
    title_en: 'Pinsa Romana',
    subtitle_is: 'Forn rómversk hefð í nútímalegum búningi',
    subtitle_en: 'Ancient Roman tradition in modern dress',
    desc_is: 'Pinsa er nútímaleg túlkun á forn-rómverskum brauðhefðum. Hún nýtir blöndu af hveiti, hrísgrjónamjöli og sojamjöli sem skapar einstaka áferð — mjög létt á meltingu og aðeins stökkari en hefðbundin pizza. Sporöskjulaga form gefur henni sérstætt útlit. Deigið á sér langa gerjun (48–72 klst) og hátt vatnshlutfall sem skapar loftbólur og léttleika. Pinsa varð vinsæl um allan heim á 2010-áratugnum sem hollur valkostur við hefðbundna pizzu.',
    desc_en: 'Pinsa is a modern interpretation of ancient Roman bread traditions. It uses a blend of wheat, rice, and soy flours creating a unique texture — very light on digestion and slightly crispier than traditional pizza. Its oval shape gives it a distinctive look. The dough has long fermentation (48–72 hrs) and high hydration creating air pockets and lightness. Pinsa gained worldwide popularity in the 2010s as a healthier alternative to traditional pizza.',
    hydration: '75–80%',
    ferment_is: '48–72 klst',
    ferment_en: '48–72 hrs',
    temp: '280–300°C',
    flour: 'Pinsa-mjölblanda',
    color: 'from-violet-500/10 to-purple-500/5',
    accent: 'text-violet-600',
    tips_is: 'Pinsa á ekki að vera fullkomlega kringlótt — sporöskjulaga formið er einkenni hennar. Forðastu of mikið álegg til að varðveita léttleikann.',
    tips_en: 'Pinsa shouldn\'t be perfectly round — the oval shape is its signature. Avoid overloading toppings to preserve the lightness.',
  },
];

export default async function StilarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  return (
    <main className="flex-1 w-full bg-background min-h-screen pb-20">
      {/* Hero */}
      <div className="relative bg-(--color-bg-secondary) border-b border-(--color-border-light) pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-[200px] rotate-12 select-none">🍕</div>
          <div className="absolute bottom-0 right-10 text-[150px] -rotate-6 select-none">🔥</div>
        </div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-(--color-brand)/10 text-(--color-brand) text-xs font-bold uppercase tracking-widest mb-6">
            <Pizza className="w-3.5 h-3.5" />
            {isIs ? 'Pizzustílar heimsins' : 'Pizza Styles of the World'}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display italic font-bold text-(--color-text-primary) mb-5 tracking-tight">
            {isIs ? 'Kynntu þér stílana' : 'Master the Styles'}
          </h1>
          <p className="text-lg md:text-xl text-(--color-text-secondary) max-w-2xl mx-auto leading-relaxed">
            {isIs
              ? 'Frá Napólí til New York, Detroit til Rómar — hvert form hefur sína sögu, sína tækni og eigin karakter. Hér finnurðu allt sem þú þarft til að ná tökum á þeim öllum.'
              : 'From Naples to New York, Detroit to Rome — every form has its story, its technique, and its own character. Here you\'ll find everything you need to master them all.'}
          </p>
        </div>
      </div>

      {/* Styles — Full-width cards */}
      <div className="container mx-auto px-4 max-w-5xl mt-14 space-y-10">
        {styles.map((style, idx) => (
          <article
            key={style.id}
            className="bg-white border border-(--color-border) rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Header strip with gradient */}
            <div className={`bg-linear-to-r ${style.color} px-8 py-6 border-b border-(--color-border-light)`}>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{style.emoji}</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-(--color-text-primary)">
                    {isIs ? style.title_is : style.title_en}
                  </h2>
                  <p className={`text-sm font-semibold ${style.accent} mt-0.5`}>
                    {isIs ? style.subtitle_is : style.subtitle_en}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Description */}
              <p className="text-(--color-text-secondary) leading-relaxed text-base mb-8">
                {isIs ? style.desc_is : style.desc_en}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {isIs ? 'Vatnshlutfall' : 'Hydration'}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-(--color-brand)">{style.hydration}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {isIs ? 'Gerjun' : 'Ferment'}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-indigo-600">{isIs ? style.ferment_is : style.ferment_en}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <ThermometerSun className="w-3.5 h-3.5 text-orange-500" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {isIs ? 'Hiti ofns' : 'Oven Temp'}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-orange-600">{style.temp}</p>
                </div>
                <div className="bg-(--color-bg-secondary) rounded-xl px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Wheat className="w-3.5 h-3.5 text-amber-600" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {isIs ? 'Mjöl' : 'Flour'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-(--color-text-primary) leading-tight">{style.flour}</p>
                </div>
              </div>

              {/* Pro tip */}
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 flex gap-3">
                <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                    {isIs ? 'Ráð frá meistara' : 'Pro Tip'}
                  </p>
                  <p className="text-sm text-amber-900/80 leading-relaxed">
                    {isIs ? style.tips_is : style.tips_en}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* CTA */}
        <div className="text-center pt-8 pb-4">
          <p className="text-(--color-text-secondary) mb-6 text-lg">
            {isIs ? 'Tilbúin/n að prófa? Reiknaðu þitt fullkomna deig.' : 'Ready to try? Calculate your perfect dough.'}
          </p>
          <Link
            href="/deigreiknivel"
            className="inline-flex items-center gap-2 bg-(--color-brand) text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {isIs ? 'Opna deigreiknivélina' : 'Open the Dough Calculator'}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
