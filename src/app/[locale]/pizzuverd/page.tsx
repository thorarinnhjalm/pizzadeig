import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { SITE_URL, localeAlternates, safeJsonLd } from '@/lib/seo';
import {
  CAPITAL_AREA_CITIES,
  computePriceStats,
  type GroupStats,
  type PizzaPick,
  type PriceStats,
  type RankedMargherita,
  type StatsRestaurant,
} from '@/lib/priceStats';

// Every number on this page is computed from the menu data at render time (see src/lib/priceStats.ts);
// nothing is typed in by hand. The data lives in code, so there is no Firestore read here.
const stats = computePriceStats(mockRestaurants, mockMenuItems);

const MONTHS_IS = ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// '2026-10-22' -> '22. október 2026' / 'October 22, 2026'
function formatDate(iso: string, isIs: boolean) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const day = Number(m[3]);
  const month = Number(m[2]) - 1;
  return isIs ? `${day}. ${MONTHS_IS[month]} ${m[1]}` : `${MONTHS_EN[month]} ${day}, ${m[1]}`;
}

// '2026-10-22' -> '22.10.2026' (table) / '2026-10-22' (en)
function formatShortDate(iso: string, isIs: boolean) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m || !isIs) return iso;
  return `${Number(m[3])}.${Number(m[2])}.${m[1]}`;
}

function groupThousands(n: number, sep: string) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

// 3090 -> '3.090' (is) / '3,090' (en)
const num = (n: number | null, isIs: boolean) => (n === null ? '–' : groupThousands(n, isIs ? '.' : ','));
// 3090 -> '3.090 kr.' (is) / '3,090 ISK' (en)
const kr = (n: number | null, isIs: boolean) => (n === null ? '–' : isIs ? `${num(n, true)} kr.` : `${num(n, false)} ISK`);

// menu_source_label is stored in Icelandic; these are the English wordings (same as the restaurant page)
const SOURCE_LABEL_EN: Record<string, string> = {
  'vef staðarins': "the restaurant's website",
  'pöntunarsíðu staðarins': "the restaurant's order page",
  'matseðli staðarins (PDF)': "the restaurant's menu (PDF)",
  'upplýsingar skráðar af Pizzadeig.is': 'recorded by Pizzadeig.is',
};
const sourceLabel = (label: string | undefined, isIs: boolean) => (label ? (isIs ? label : SOURCE_LABEL_EN[label] || label) : '');

// Size labels are stored in Icelandic; the English page translates the leading size word and keeps the rest
const SIZE_WORD_EN: Record<string, string> = { 'lítil': 'Small', 'miðstærð': 'Medium', 'mið': 'Medium', 'mið.': 'Medium', 'stór': 'Large' };
const SIZE_LABEL_RE = /^(lítil|miðstærð|mið\.?|stór)(?=$|[\s(])(.*)$/i;
// 'MIÐ (12")' -> 'Mið 12"' so it reads well on its own and inside parentheses; 'Miðstærð 12"' stays as it is
const tidySize = (label: string) => {
  const noParens = label.replace(/\(([^)]*)\)/g, '$1').replace(/\s+/g, ' ').trim();
  return noParens === noParens.toUpperCase() && /[A-ZÞÆÐÖÁÉÍÓÚÝ]{2,}/.test(noParens)
    ? noParens.charAt(0) + noParens.slice(1).toLowerCase()
    : noParens;
};
const sizeText = (label: string, isIs: boolean) => {
  const tidy = tidySize(label);
  if (isIs) return tidy;
  const m = SIZE_LABEL_RE.exec(tidy);
  return m ? `${SIZE_WORD_EN[m[1].toLowerCase()]}${m[2]}` : tidy;
};

const joinList = (items: string[], isIs: boolean) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${isIs ? 'og' : 'and'} ${items[items.length - 1]}`;

// "Pizzafjörður (12")" -> used in running text
const withSize = (name: string, pick: PizzaPick, isIs: boolean) =>
  pick.sizeLabel ? `${name} (${sizeText(pick.sizeLabel, isIs)})` : name;

// Short note when a price does not come from the restaurant's own menu
function sourceNote(r: StatsRestaurant, isIs: boolean): string {
  if (r.menu_price_basis === 'owner_supplied') {
    return isIs
      ? `matseðillinn var skráður af Pizzadeig.is ${r.menu_verified_at ? formatDate(r.menu_verified_at, true) : ''}`.trim()
      : `the menu was recorded by Pizzadeig.is ${r.menu_verified_at ? `on ${formatDate(r.menu_verified_at, false)}` : ''}`.trim();
  }
  if (r.menu_price_basis === 'delivery_platform') return isIs ? 'verð af Wolt, geta verið hærri en á staðnum' : 'Wolt prices, may be higher than in-house';
  if (r.menu_price_basis === 'mixed') return isIs ? 'hluti verðanna af Wolt, getur verið hærri en á staðnum' : 'some prices from Wolt, may be higher than in-house';
  return '';
}

// "X kr. hærra / lægra á höfuðborgarsvæðinu" from the capital-vs-rest difference
function diffPhrase(capital: number | null, rest: number | null, isIs: boolean): string {
  if (capital === null || rest === null) return '';
  const d = capital - rest;
  if (d === 0) return isIs ? 'jafnt á báðum svæðum' : 'the same in both areas';
  const amount = kr(Math.abs(d), isIs);
  if (isIs) return `${amount} ${d > 0 ? 'hærra' : 'lægra'} á höfuðborgarsvæðinu`;
  return `${amount} ${d > 0 ? 'higher' : 'lower'} in the capital area`;
}

interface Faq { q: string; a: string }

// All prose that quotes numbers is built here, once, from the computed stats (used by the page, the meta description and the FAQ JSON-LD)
function buildCopy(s: PriceStats, isIs: boolean) {
  const date = s.dataDate ? formatDate(s.dataDate, isIs) : '';
  const k = (n: number | null) => kr(n, isIs);
  const cheapM = s.cheapestMargherita;
  const priceM = s.priciestMargherita;
  const top3 = s.margheritaRanked.slice(0, 3);

  const lead = isIs
    ? `Margherita kostar að miðgildi ${k(s.margheritaMedian)} á ${s.margheritaPlaces} af ${s.placesCounted} pizzustöðum sem hafa matseðil á netinu; dæmigerð pizza (miðgildi allra ${s.pizzasCounted} pizza) kostar ${k(s.pizzaMedian)}. Verð sótt ${date}.`
    : `A Margherita costs a median of ${k(s.margheritaMedian)} at ${s.margheritaPlaces} of the ${s.placesCounted} pizza places with an online menu; a typical pizza (the median of all ${s.pizzasCounted} pizzas) costs ${k(s.pizzaMedian)}. Prices collected on ${date}.`;

  const description = isIs
    ? `Margherita kostar að miðgildi ${k(s.margheritaMedian)} á Íslandi, dæmigerð pizza ${k(s.pizzaMedian)}. Verð af matseðlum ${s.placesCounted} staða, sótt ${date}, með heimild fyrir hvern stað.`
    : `A Margherita costs a median of ${k(s.margheritaMedian)} in Iceland, a typical pizza ${k(s.pizzaMedian)}. Prices from ${s.placesCounted} places, collected ${date}, with sources.`;

  const platformNames = s.platformPlaces.map((r) => r.name);
  const mixedNames = s.mixedPlaces.map((r) => r.name);
  const woltParts: string[] = [];
  if (platformNames.length > 0) {
    woltParts.push(
      isIs
        ? `Verð ${platformNames.length} staða koma alfarið af Wolt (${joinList(platformNames, true)})`
        : `The prices of ${platformNames.length} places come entirely from Wolt (${joinList(platformNames, false)})`,
    );
  }
  if (mixedNames.length > 0) {
    woltParts.push(
      isIs
        ? `og verð ${mixedNames.length === 1 ? 'eins staðar' : `${mixedNames.length} staða`} að hluta (${joinList(mixedNames, true)})`
        : `and those of ${mixedNames.length} ${mixedNames.length === 1 ? 'place' : 'places'} in part (${joinList(mixedNames, false)})`,
    );
  }

  const cheapestLine = (m: RankedMargherita) => {
    const note = sourceNote(m.restaurant, isIs);
    return `${withSize(`${m.restaurant.name}, ${m.restaurant.city}`, m.pick, isIs)}: ${k(m.pick.price)}${note ? ` (${note})` : ''}`;
  };

  const faq: Faq[] = isIs
    ? [
        {
          q: 'Hvað kostar pizza á Íslandi?',
          a: `Miðgildi pizzuverðs á Íslandi er ${k(s.pizzaMedian)}. Það byggir á ${s.pizzasCounted} pizzum á matseðlum ${s.placesCounted} staða, sóttum ${date}, miðað við venjulega stærð eða miðstærð hvers matseðils. Ódýrasta pizzan á þessum matseðlum kostar ${k(s.cheapestPizza?.pick.price ?? null)} (${s.cheapestPizza?.pick.name_is}, ${s.cheapestPizza?.restaurant.name}) og sú dýrasta ${k(s.priciestPizza?.pick.price ?? null)} (${s.priciestPizza?.pick.name_is}, ${s.priciestPizza?.restaurant.name}). Stærðir eru misjafnar á milli staða.`,
        },
        {
          q: 'Hvað kostar Margherita á Íslandi?',
          a: `Margherita kostar að miðgildi ${k(s.margheritaMedian)} á Íslandi, miðað við ${s.margheritaPlaces} staði sem bjóða Margheritu (sótt ${date}). Hún kostar ${k(cheapM?.pick.price ?? null)} á ódýrasta staðnum (${cheapM?.restaurant.name}) og ${k(priceM?.pick.price ?? null)} á þeim dýrasta (${priceM?.restaurant.name}). Verðið er fyrir venjulega stærð eða miðstærð; bjóði staður fleiri en eina Margheritu er sú ódýrasta talin.`,
        },
        {
          q: 'Hvar er ódýrasta Margherita á Íslandi?',
          a: `Ódýrasta Margheritan á matseðlunum sem Pizzadeig.is hefur skráð: ${top3.length > 0 ? cheapestLine(top3[0]) : ''}.${top3.length > 1 ? ` Næst koma ${joinList(top3.slice(1).map(cheapestLine), true)}.` : ''} Verð sótt ${date}; stærðir eru misjafnar, svo sama verð jafngildir ekki sömu pizzu.`,
        },
        {
          q: 'Er dýrara að kaupa pizzu á höfuðborgarsvæðinu en úti á landi?',
          a: `Það fer eftir því hvað er mælt. Miðgildi Margheritu er ${k(s.capital.margheritaMedian)} á höfuðborgarsvæðinu (${s.capital.margheritaPlaces} staðir) og ${k(s.rest.margheritaMedian)} á landsbyggðinni (${s.rest.margheritaPlaces} staðir), eða ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, true)}. Miðgildi allra pizza er ${k(s.capital.pizzaMedian)} á höfuðborgarsvæðinu (${s.capital.pizzas} pizzur á ${s.capital.places} stöðum) og ${k(s.rest.pizzaMedian)} á landsbyggðinni (${s.rest.pizzas} pizzur á ${s.rest.places} stöðum), eða ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, true)}. Samanburðurinn byggir á takmörkuðum fjölda staða í hvorum hópi, svo einstakir matseðlar geta breytt niðurstöðunni.`,
        },
        {
          q: 'Eru verð á Wolt hærri en á staðnum?',
          a: `Þau geta verið það. Pizzadeig.is notar verð af Wolt aðeins þar sem enginn eigin matseðill staðarins fannst á netinu, og verð af Wolt geta verið hærri en á staðnum. ${woltParts.join(' ')}${woltParts.length > 0 ? '. ' : ''}Gögnin innihalda ekki samanburð við verð á staðnum, svo ekki er hægt að segja hversu miklu munar.`,
        },
      ]
    : [
        {
          q: 'How much does a pizza cost in Iceland?',
          a: `The median pizza price in Iceland is ${k(s.pizzaMedian)}. It is based on ${s.pizzasCounted} pizzas on the menus of ${s.placesCounted} places, collected ${date}, using the standard or middle size of each menu. The cheapest pizza on these menus costs ${k(s.cheapestPizza?.pick.price ?? null)} (${s.cheapestPizza?.pick.name_en}, ${s.cheapestPizza?.restaurant.name}) and the most expensive ${k(s.priciestPizza?.pick.price ?? null)} (${s.priciestPizza?.pick.name_en}, ${s.priciestPizza?.restaurant.name}). Sizes differ between places.`,
        },
        {
          q: 'How much does a Margherita cost in Iceland?',
          a: `A Margherita costs a median of ${k(s.margheritaMedian)} in Iceland, based on ${s.margheritaPlaces} places that offer one (collected ${date}). It costs ${k(cheapM?.pick.price ?? null)} at the cheapest place (${cheapM?.restaurant.name}) and ${k(priceM?.pick.price ?? null)} at the most expensive (${priceM?.restaurant.name}). The price is for the standard or middle size; if a place offers more than one Margherita, the cheapest is counted.`,
        },
        {
          q: 'Where is the cheapest Margherita in Iceland?',
          a: `The cheapest Margherita on the menus Pizzadeig.is has recorded: ${top3.length > 0 ? cheapestLine(top3[0]) : ''}.${top3.length > 1 ? ` Next come ${joinList(top3.slice(1).map(cheapestLine), false)}.` : ''} Prices collected ${date}; sizes differ, so the same price does not mean the same pizza.`,
        },
        {
          q: 'Is pizza more expensive in the capital area than in the rest of Iceland?',
          a: `It depends on what is measured. The median Margherita is ${k(s.capital.margheritaMedian)} in the capital area (${s.capital.margheritaPlaces} places) and ${k(s.rest.margheritaMedian)} in the rest of the country (${s.rest.margheritaPlaces} places), that is ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, false)}. The median of all pizzas is ${k(s.capital.pizzaMedian)} in the capital area (${s.capital.pizzas} pizzas at ${s.capital.places} places) and ${k(s.rest.pizzaMedian)} in the rest of the country (${s.rest.pizzas} pizzas at ${s.rest.places} places), that is ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, false)}. The comparison rests on a limited number of places in each group, so individual menus can change the result.`,
        },
        {
          q: 'Are Wolt prices higher than prices at the restaurant?',
          a: `They can be. Pizzadeig.is uses Wolt prices only where no menu of the restaurant's own was found online, and Wolt prices can be higher than in-house prices. ${woltParts.join(' ')}${woltParts.length > 0 ? '. ' : ''}The data contains no comparison with in-house prices, so it cannot show by how much they differ.`,
        },
      ];

  // A sentence that ends in "3.890 kr." must not get a second full stop
  const tidy = (t: string) => t.replace(/kr\.\.(?!\.)/g, 'kr.');
  return { date, lead: tidy(lead), description: tidy(description), faq: faq.map((f) => ({ q: f.q, a: tidy(f.a) })) };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isIs = locale === 'is';
  const { description } = buildCopy(stats, isIs);
  const title = isIs
    ? 'Pizzuverð á Íslandi: hvað kostar pizza? | Pizzadeig.is'
    : 'Pizza prices in Iceland: what does a pizza cost? | Pizzadeig.is';
  return {
    alternates: localeAlternates(locale, '/pizzuverd'),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/pizzuverd`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
      images: [{ url: `${SITE_URL}/images/dough-frontpage.jpg`, alt: isIs ? 'Pizzuverð á Íslandi' : 'Pizza prices in Iceland' }],
    },
  };
}

function KeyFigure({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-secondary border border-border rounded-xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className="font-display text-3xl font-bold text-primary">{value}</p>
      {detail ? <p className="text-sm text-(--color-text-secondary) mt-1">{detail}</p> : null}
    </div>
  );
}

function RegionCard({ title, subtitle, g, isIs }: { title: string; subtitle: string; g: GroupStats; isIs: boolean }) {
  return (
    <div className="bg-secondary border border-border rounded-xl p-5">
      <h3 className="font-display text-xl font-bold text-(--color-text-primary)">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-(--color-text-secondary)">{isIs ? 'Margherita, miðgildi' : 'Margherita, median'}</dt>
          <dd className="font-display text-2xl font-bold text-primary">
            {kr(g.margheritaMedian, isIs)}
            <span className="text-sm font-sans font-normal text-muted-foreground ml-2">
              {isIs ? `${g.margheritaPlaces} staðir` : `${g.margheritaPlaces} places`}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-(--color-text-secondary)">{isIs ? 'Allar pizzur, miðgildi' : 'All pizzas, median'}</dt>
          <dd className="font-display text-2xl font-bold text-primary">
            {kr(g.pizzaMedian, isIs)}
            <span className="text-sm font-sans font-normal text-muted-foreground ml-2">
              {isIs ? `${g.pizzas} pizzur á ${g.places} stöðum` : `${g.pizzas} pizzas at ${g.places} places`}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function PickCell({ pick, isIs, showSize }: { pick: PizzaPick; isIs: boolean; showSize?: boolean }) {
  return (
    <>
      <span className="font-semibold text-(--color-text-primary)">{num(pick.price, isIs)}</span>
      {showSize && pick.sizeLabel ? (
        <span className="block text-xs text-muted-foreground">{sizeText(pick.sizeLabel, isIs)}</span>
      ) : null}
      {!showSize ? (
        <span className="block text-xs text-muted-foreground max-w-44 truncate" title={isIs ? pick.name_is : pick.name_en}>
          {isIs ? pick.name_is : pick.name_en}
        </span>
      ) : null}
    </>
  );
}

export default async function PizzuverdPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';
  const s = stats;
  const { date, lead, description, faq } = buildCopy(s, isIs);
  const k = (n: number | null) => kr(n, isIs);
  const th = 'px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap';
  const thNum = `${th} text-right`;
  const pageUrl = `${SITE_URL}/${locale}/pizzuverd`;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: isIs ? 'Pizzuverð á Íslandi' : 'Pizza prices in Iceland',
    description,
    url: pageUrl,
    inLanguage: locale,
    ...(s.dataDate ? { dateModified: s.dataDate } : {}),
    creator: { '@type': 'Organization', name: 'Pizzadeig.is', url: SITE_URL },
    spatialCoverage: { '@type': 'Place', name: isIs ? 'Ísland' : 'Iceland' },
    variableMeasured: isIs ? 'Verð á pizzum í ISK' : 'Pizza prices in ISK',
    keywords: isIs ? ['pizzuverð', 'verð á pizzu', 'Margherita', 'Ísland'] : ['pizza prices', 'price of pizza', 'Margherita', 'Iceland'],
  };

  const platformCount = s.platformPlaces.length + s.mixedPlaces.length;

  return (
    <main className="flex-1 bg-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(datasetLd) }} />

      {/* Header: answer first */}
      <header className="bg-linear-to-b from-(--color-bg-secondary) to-(--color-bg-light) border-b border-(--color-border) pt-12 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-(--color-text-primary) mb-4">
            {isIs ? 'Pizzuverð á Íslandi' : 'Pizza prices in Iceland'}
          </h1>
          <p className="text-lg md:text-xl text-(--color-text-primary) max-w-3xl leading-relaxed">{lead}</p>
          <p className="text-sm text-(--color-text-secondary) mt-4">
            {isIs ? 'Heimild og dagsetning fyrir hvern stað eru í ' : 'The source and date for each place are in the '}
            <a href="#stadir" className="underline underline-offset-2 hover:text-primary">{isIs ? 'töflunni' : 'table'}</a>
            {'. '}
            <a href="#um-gognin" className="underline underline-offset-2 hover:text-primary">{isIs ? 'Um gögnin' : 'About the data'}</a>
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">
        {/* Key figures */}
        <section aria-labelledby="lykiltolur">
          <h2 id="lykiltolur" className="font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-6">
            {isIs ? 'Lykiltölur' : 'Key figures'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KeyFigure
              label={isIs ? 'Margherita, miðgildi' : 'Margherita, median'}
              value={k(s.margheritaMedian)}
              detail={isIs ? `${s.margheritaPlaces} staðir bjóða Margheritu` : `${s.margheritaPlaces} places offer a Margherita`}
            />
            {s.cheapestMargherita ? (
              <KeyFigure
                label={isIs ? 'Ódýrasta Margherita' : 'Cheapest Margherita'}
                value={k(s.cheapestMargherita.pick.price)}
                detail={withSize(`${s.cheapestMargherita.restaurant.name}, ${s.cheapestMargherita.restaurant.city}`, s.cheapestMargherita.pick, isIs)}
              />
            ) : null}
            {s.priciestMargherita ? (
              <KeyFigure
                label={isIs ? 'Dýrasta Margherita' : 'Most expensive Margherita'}
                value={k(s.priciestMargherita.pick.price)}
                detail={withSize(`${s.priciestMargherita.restaurant.name}, ${s.priciestMargherita.restaurant.city}`, s.priciestMargherita.pick, isIs)}
              />
            ) : null}
            <KeyFigure
              label={isIs ? 'Allar pizzur, miðgildi' : 'All pizzas, median'}
              value={k(s.pizzaMedian)}
              detail={isIs ? 'Venjuleg stærð eða miðstærð' : 'Standard or middle size'}
            />
            <KeyFigure
              label={isIs ? 'Staðir í gögnunum' : 'Places counted'}
              value={String(s.placesCounted)}
              detail={isIs ? `af ${mockRestaurants.length} stöðum á Pizzadeig.is` : `of ${mockRestaurants.length} places on Pizzadeig.is`}
            />
            <KeyFigure
              label={isIs ? 'Pizzur taldar' : 'Pizzas counted'}
              value={String(s.pizzasCounted)}
              detail={isIs ? 'Barna- og eftirréttapizzur ekki taldar' : "Kids' and dessert pizzas not counted"}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {isIs ? 'Verð sótt ' : 'Prices collected '}
            {s.dataDate ? <time dateTime={s.dataDate}>{date}</time> : null}
            {isIs ? '. Miðgildi er verðið í miðjunni þegar öll verð eru raðað frá lægsta til hæsta.' : '. The median is the price in the middle when all prices are sorted from lowest to highest.'}
          </p>
        </section>

        {/* Capital area vs rest */}
        <section aria-labelledby="svaedi">
          <h2 id="svaedi" className="font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-6">
            {isIs ? 'Höfuðborgarsvæðið og landsbyggðin' : 'Capital area and the rest of Iceland'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RegionCard
              title={isIs ? 'Höfuðborgarsvæðið' : 'Capital area'}
              subtitle={CAPITAL_AREA_CITIES.join(', ')}
              g={s.capital}
              isIs={isIs}
            />
            <RegionCard
              title={isIs ? 'Landsbyggðin' : 'Rest of Iceland'}
              subtitle={isIs ? 'Allir aðrir bæir, þar á meðal Reykjanesbær og Selfoss' : 'All other towns, including Reykjanesbær and Selfoss'}
              g={s.rest}
              isIs={isIs}
            />
          </div>
          <p className="text-sm text-(--color-text-secondary) mt-4 max-w-3xl">
            {isIs
              ? `Miðgildi Margheritu er ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, true)}; miðgildi allra pizza er ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, true)}. Gögnin ná aðeins til takmarkaðs fjölda staða í hvorum hópi.`
              : `The median Margherita is ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, false)}; the median of all pizzas is ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, false)}. The data covers only a limited number of places in each group.`}
          </p>
        </section>

        {/* Table */}
        <section aria-labelledby="stadir">
          <h2 id="stadir" className="font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-2">
            {isIs ? 'Verð eftir stöðum' : 'Prices by place'}
          </h2>
          <p className="text-sm text-(--color-text-secondary) mb-4 max-w-3xl">
            {isIs
              ? 'Verð í krónum fyrir venjulega stærð eða miðstærð hvers matseðils. Raðað eftir bæ og nafni.'
              : 'Prices in Icelandic krónur (ISK) for the standard or middle size of each menu. Sorted by town and name.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-(--color-bg-light)">
            <table className="w-full min-w-5xl text-sm">
              <caption className="sr-only">{isIs ? 'Pizzuverð eftir veitingastöðum' : 'Pizza prices by restaurant'}</caption>
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th scope="col" className={th}>{isIs ? 'Staður' : 'Place'}</th>
                  <th scope="col" className={th}>{isIs ? 'Bær' : 'Town'}</th>
                  <th scope="col" className={thNum}>Margherita</th>
                  <th scope="col" className={thNum}>{isIs ? 'Ódýrasta' : 'Cheapest'}</th>
                  <th scope="col" className={thNum}>{isIs ? 'Miðgildi' : 'Median'}</th>
                  <th scope="col" className={thNum}>{isIs ? 'Dýrasta' : 'Most expensive'}</th>
                  <th scope="col" className={thNum}>{isIs ? 'Fjöldi pizza' : 'Pizzas'}</th>
                  <th scope="col" className={th}>{isIs ? 'Heimild' : 'Source'}</th>
                  <th scope="col" className={th}>{isIs ? 'Dagsetning' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-light)">
                {s.rows.map((row) => {
                  const r = row.restaurant;
                  const label = sourceLabel(r.menu_source_label, isIs);
                  const note = r.menu_price_basis === 'delivery_platform' || r.menu_price_basis === 'mixed' ? sourceNote(r, isIs) : '';
                  return (
                    <tr key={r.id} className="align-top">
                      <th scope="row" className="px-3 py-3 text-left font-semibold whitespace-nowrap">
                        <Link href={`/stadir/${r.slug}`} className="text-(--color-text-primary) hover:text-primary underline-offset-2 hover:underline">
                          {r.name}
                        </Link>
                      </th>
                      <td className="px-3 py-3 text-(--color-text-secondary) whitespace-nowrap">{r.city}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        {row.margherita ? <PickCell pick={row.margherita} isIs={isIs} showSize /> : <span className="text-muted-foreground">–</span>}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap"><PickCell pick={row.cheapest} isIs={isIs} /></td>
                      <td className="px-3 py-3 text-right whitespace-nowrap font-semibold text-(--color-text-primary)">{num(row.median, isIs)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap"><PickCell pick={row.priciest} isIs={isIs} /></td>
                      <td className="px-3 py-3 text-right text-(--color-text-secondary)">{row.pizzaCount}</td>
                      <td className="px-3 py-3 text-(--color-text-secondary)">
                        {r.menu_source_url ? (
                          <a href={r.menu_source_url} target="_blank" rel="nofollow noopener" className="underline underline-offset-2 hover:text-primary">
                            {label}
                          </a>
                        ) : (
                          label
                        )}
                        {note ? <span className="block text-xs text-muted-foreground max-w-48">{note}</span> : null}
                      </td>
                      <td className="px-3 py-3 text-(--color-text-secondary) whitespace-nowrap">
                        {r.menu_verified_at ? <time dateTime={r.menu_verified_at}>{formatShortDate(r.menu_verified_at, isIs)}</time> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-(--color-text-secondary) mt-4">
            {isIs ? 'Enginn matseðill á netinu: ' : 'No menu online: '}
            {s.withoutMenu.length > 0
              ? s.withoutMenu.map((r, i) => (
                  <span key={r.id}>
                    {i > 0 ? ', ' : ''}
                    <Link href={`/stadir/${r.slug}`} className="underline underline-offset-2 hover:text-primary">{r.name}</Link>
                    {` (${r.city})`}
                  </span>
                ))
              : isIs ? 'enginn' : 'none'}
            .
          </p>
        </section>

        {/* FAQ */}
        <section aria-labelledby="spurningar">
          <h2 id="spurningar" className="font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-6">
            {isIs ? 'Algengar spurningar' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faq.map((f) => (
              <div key={f.q} className="bg-secondary border border-border rounded-xl p-5">
                <h3 className="font-bold text-lg text-(--color-text-primary) mb-2">{f.q}</h3>
                <p className="text-(--color-text-secondary) leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About the data */}
        <section aria-labelledby="um-gognin-titill" id="um-gognin" className="scroll-mt-24">
          <h2 id="um-gognin-titill" className="font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-6">
            {isIs ? 'Um gögnin' : 'About the data'}
          </h2>
          <ul className="space-y-3 max-w-3xl text-(--color-text-secondary) leading-relaxed list-disc pl-5">
            <li>
              {isIs
                ? 'Matseðlar eru sóttir fyrst af vef staðarins, pöntunarsíðu hans eða PDF-matseðli. Þar sem enginn eigin matseðill fannst á netinu var notað Wolt. Verð eru nákvæmlega eins og heimildin sýndi, aldrei áætluð.'
                : "Menus are taken first from the restaurant's own website, order page or PDF menu. Where no menu of its own was found online, Wolt was used. Prices are exactly as the source showed them, never estimated."}
            </li>
            <li>
              {isIs ? 'Verð sótt ' : 'Prices collected '}
              {s.dataDate ? <time dateTime={s.dataDate}>{date}</time> : null}
              {isIs
                ? ' (nýjasta dagsetning matseðils í gögnunum). Hver staður er með sína dagsetningu og slóð á heimild í töflunni.'
                : ' (the latest menu date in the data). Each place has its own date and a link to its source in the table.'}
            </li>
            {s.ownerSupplied.length > 0 ? (
              <li>
                {isIs
                  ? `Matseðlar ${s.ownerSupplied.length} staða voru skráðir af Pizzadeig.is: `
                  : `The menus of ${s.ownerSupplied.length} places were recorded by Pizzadeig.is: `}
                {s.ownerSupplied
                  .map((o) => `${o.restaurant.name} (${formatDate(o.date, isIs)})`)
                  .join('; ')}
                {'.'}
              </li>
            ) : null}
            <li>
              {isIs
                ? 'Stærðir eru misjafnar á milli staða og sumir matseðlar sýna enga stærð. Hér er alltaf notað verð venjulegrar stærðar eða miðstærðar matseðilsins; stærðin er sýnd þar sem matseðillinn gefur hana upp. Verð stærri stærða eru ekki talin með.'
                : 'Sizes differ between places and some menus show no size. The price used is always that of the standard or middle size of the menu; the size is shown where the menu gives it. Prices of larger sizes are not counted.'}
            </li>
            <li>
              {isIs
                ? `Verð af Wolt geta verið hærri en á staðnum. Verð ${platformCount} staða koma af Wolt, að hluta eða öllu leyti; þeir eru merktir í töflunni.`
                : `Wolt prices can be higher than in-house prices. The prices of ${platformCount} places come from Wolt, wholly or in part; they are marked in the table.`}
            </li>
            <li>
              {isIs
                ? 'Aðeins pizzur í flokknum „Pizzur“ eru taldar; barnapizzur og eftirréttapizzur ekki. Margherita er pizza sem heitir Margherita eða Margarita; bjóði staður fleiri en eina er sú ódýrasta talin. Miðgildi allra pizza vegur hverja pizzu jafnt, þannig að staðir með stóran matseðil vega þyngra.'
                : 'Only pizzas in the “Pizzur” category are counted; kids\' pizzas and dessert pizzas are not. A Margherita is a pizza named Margherita or Margarita; if a place has more than one, the cheapest is counted. The median of all pizzas weighs each pizza equally, so places with a large menu weigh more.'}
            </li>
            <li>
              {isIs
                ? `Höfuðborgarsvæðið er ${CAPITAL_AREA_CITIES.join(', ')}; allir aðrir bæir teljast landsbyggðin. Keðjur með mörg útibú eru ein færsla hver og teljast í bænum þar sem aðalheimilisfang þeirra er.`
                : `The capital area is ${CAPITAL_AREA_CITIES.join(', ')}; all other towns count as the rest of Iceland. Chains with several branches are one entry each and count in the town of their main address.`}
            </li>
            <li>
              {isIs ? 'Verð breytast. Matseðil og heimild hvers staðar má sjá á ' : 'Prices change. The menu and source of each place can be seen on the '}
              <Link href="/stadir" className="underline underline-offset-2 hover:text-primary">
                {isIs ? 'síðum veitingastaðanna' : 'restaurant pages'}
              </Link>
              {'.'}
            </li>
            <li>
              {isIs ? 'Tilvísun: Pizzadeig.is, „Pizzuverð á Íslandi“' : 'Citation: Pizzadeig.is, “Pizza prices in Iceland”'}
              {s.dataDate ? (isIs ? `, gögn frá ${date}, ` : `, data from ${date}, `) : ', '}
              <a href={pageUrl} className="underline underline-offset-2 hover:text-primary">{pageUrl}</a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
