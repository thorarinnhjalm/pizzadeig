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

// Icelandic counts take the singular after numbers ending in 1 (except 11): '31 staður', '36 staðir'
const isOne = (n: number) => n % 10 === 1 && n % 100 !== 11;
const isN = (n: number, one: string, many: string) => `${n} ${isOne(n) ? one : many}`;
const enN = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const joinList = (items: string[], isIs: boolean) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${isIs ? 'og' : 'and'} ${items[items.length - 1]}`;

// "Pizzafjörður (12")" -> used in running text
const withSize = (name: string, pick: PizzaPick, isIs: boolean) =>
  pick.sizeLabel ? `${name} (${sizeText(pick.sizeLabel, isIs)})` : name;

// Appends the source note (Wolt, recorded by Pizzadeig.is) to a short text
const withNote = (text: string, r: StatsRestaurant, isIs: boolean) => {
  const note = sourceNote(r, isIs);
  return note ? `${text} · ${note}` : text;
};

// Short note when a price does not come from the restaurant's own menu
function sourceNote(r: StatsRestaurant, isIs: boolean): string {
  if (r.menu_price_basis === 'owner_supplied') {
    return isIs
      ? `matseðillinn var skráður af Pizzadeig.is ${r.menu_verified_at ? formatDate(r.menu_verified_at, true) : ''}`.trim()
      : `the menu was recorded by Pizzadeig.is ${r.menu_verified_at ? `on ${formatDate(r.menu_verified_at, false)}` : ''}`.trim();
  }
  if (r.menu_price_basis === 'delivery_platform') return isIs ? 'verð af Wolt, sem geta verið hærri en á staðnum' : 'Wolt prices, may be higher than in-house';
  if (r.menu_price_basis === 'mixed') return isIs ? 'sum verðin eru af Wolt og geta verið hærri en á staðnum' : 'some prices from Wolt, may be higher than in-house';
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

// Opening of the capital-vs-rest answer, chosen from the signs of the two median differences
function regionVerdict(s: PriceStats, isIs: boolean): string {
  const { capital: c, rest: r } = s;
  if (c.margheritaMedian === null || r.margheritaMedian === null || c.pizzaMedian === null || r.pizzaMedian === null) {
    return isIs ? 'Gögnin duga ekki til að svara því.' : 'The data is not enough to say.';
  }
  const dm = Math.sign(c.margheritaMedian - r.margheritaMedian);
  const dp = Math.sign(c.pizzaMedian - r.pizzaMedian);
  if (dm > 0 && dp > 0) return isIs ? 'Í þessum gögnum er það dýrara, bæði miðað við Margheritu og allar pizzur.' : 'In this data it is, both for a Margherita and for all pizzas.';
  if (dm < 0 && dp < 0) return isIs ? 'Í þessum gögnum er það ódýrara, bæði miðað við Margheritu og allar pizzur.' : 'In this data it is cheaper, both for a Margherita and for all pizzas.';
  return isIs ? 'Það fer eftir því hvað er mælt.' : 'It depends on what is measured.';
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
    ? `Margherita kostar að miðgildi ${k(s.margheritaMedian)} á pizzustöðum Pizzadeig.is; hún er á matseðli á ${s.margheritaPlaces} af ${isN(s.placesCounted, 'pizzustað', 'pizzustöðum')} sem eru með verð í gögnunum. Dæmigerð pizza (miðgildi allra ${isN(s.pizzasCounted, 'pizzu', 'pizza')} á matseðlunum) kostar ${k(s.pizzaMedian)}. Allar tölur eru úr matseðlum sem voru skráðir ${date}.`
    : `A Margherita costs a median of ${k(s.margheritaMedian)} at the ${s.margheritaPlaces} of the ${enN(s.placesCounted, 'pizza place', 'pizza places')} on Pizzadeig.is that have a pizza by that name. A typical pizza (the median of all ${s.pizzasCounted} pizzas on the menus) costs ${k(s.pizzaMedian)}. All figures come from menus recorded on ${date}.`;

  const description = isIs
    ? `Margherita kostar að miðgildi ${k(s.margheritaMedian)} og dæmigerð pizza ${k(s.pizzaMedian)} á ${isN(s.placesCounted, 'pizzustað', 'pizzustöðum')} á Pizzadeig.is. Verð úr matseðlum skráðum ${date}, með heimild fyrir hvern stað.`
    : `A Margherita costs a median of ${k(s.margheritaMedian)} and a typical pizza ${k(s.pizzaMedian)} at ${enN(s.placesCounted, 'pizza place', 'pizza places')} listed on Pizzadeig.is. Prices from menus recorded ${date}, with a source for each place.`;

  const platformNames = s.platformPlaces.map((r) => r.name);
  const mixedNames = s.mixedPlaces.map((r) => r.name);
  const woltParts: string[] = [];
  if (platformNames.length > 0) {
    woltParts.push(
      isIs
        ? `Verð ${isN(platformNames.length, 'staðar kemur', 'staða koma')} alfarið af Wolt (${joinList(platformNames, true)})`
        : `The prices of ${enN(platformNames.length, 'place come', 'places come')} entirely from Wolt (${joinList(platformNames, false)})`,
    );
  }
  if (mixedNames.length > 0) {
    woltParts.push(
      isIs
        ? `og verð ${mixedNames.length === 1 ? 'eins staðar' : `${mixedNames.length} staða`} að hluta (${joinList(mixedNames, true)})`
        : `and those of ${mixedNames.length} ${mixedNames.length === 1 ? 'place' : 'places'} in part (${joinList(mixedNames, false)})`,
    );
  }

  // "Pizza name, Place" plus a source note when the price is not from the restaurant's own menu
  const pickRef = (m: RankedMargherita | null) => {
    if (!m) return '';
    const note = sourceNote(m.restaurant, isIs);
    return `${isIs ? m.pick.name_is : m.pick.name_en}, ${m.restaurant.name}${note ? `; ${note}` : ''}`;
  };
  const placeRef = (m: RankedMargherita | null) => {
    if (!m) return '';
    const note = sourceNote(m.restaurant, isIs);
    const size = m.pick.sizeLabel ? `, ${sizeText(m.pick.sizeLabel, isIs)}` : '';
    return `${m.restaurant.name}${size}${note ? `; ${note}` : ''}`;
  };
  const olderNames = joinList(s.olderMenus.map((r) => r.name), isIs);
  const olderSentence = s.olderMenus.length === 0
    ? ''
    : isIs
      ? ` Matseðlar með eldri dagsetningu eru ekki taldir með (${olderNames}).`
      : ` Menus with an earlier date are not counted (${olderNames}).`;

  const cheapestLine = (m: RankedMargherita) => {
    const note = sourceNote(m.restaurant, isIs);
    return `${withSize(`${m.restaurant.name}, ${m.restaurant.city}`, m.pick, isIs)}: ${k(m.pick.price)}${note ? ` (${note})` : ''}`;
  };

  const faq: Faq[] = isIs
    ? [
        {
          q: 'Hvað kostar pizza á Íslandi?',
          a: `Á matseðlum ${isN(s.placesCounted, 'pizzustaðar', 'pizzustaða')} sem Pizzadeig.is hefur skráð er miðgildi pizzuverðs ${k(s.pizzaMedian)}. Það er reiknað úr ${isN(s.pizzasCounted, 'pizzu', 'pizzum')} á matseðlum sem voru skráðir ${date}, og notað er grunnverð hvers matseðils (oftast 12" eða miðstærð). Ódýrasta pizzan á þessum matseðlum kostar ${k(s.cheapestPizza?.pick.price ?? null)} (${pickRef(s.cheapestPizza)}) og sú dýrasta ${k(s.priciestPizza?.pick.price ?? null)} (${pickRef(s.priciestPizza)}). Stærðir eru misjafnar á milli staða.`,
        },
        {
          q: 'Hvað kostar Margherita á Íslandi?',
          a: `Á þeim ${isN(s.margheritaPlaces, 'stað', 'stöðum')} á Pizzadeig.is sem ${isOne(s.margheritaPlaces) ? 'býður' : 'bjóða'} pizzu sem heitir Margherita (eða Margarita) kostar hún að miðgildi ${k(s.margheritaMedian)} (matseðlar skráðir ${date}). Ódýrasta Margheritan kostar ${k(cheapM?.pick.price ?? null)} (${placeRef(cheapM)}) og sú dýrasta ${k(priceM?.pick.price ?? null)} (${placeRef(priceM)}). Notað er grunnverð matseðilsins; bjóði staður fleiri en eina Margheritu er sú ódýrasta talin.`,
        },
        {
          q: 'Hvar er ódýrasta Margherita á Íslandi?',
          a: `Ódýrasta Margheritan á matseðlunum sem Pizzadeig.is hefur skráð: ${top3.length > 0 ? cheapestLine(top3[0]) : ''}.${top3.length > 1 ? ` Næst koma ${joinList(top3.slice(1).map(cheapestLine), true)}.` : ''} Matseðlar skráðir ${date}; stærðir eru misjafnar, svo sama verð jafngildir ekki sömu pizzu.${olderSentence}`,
        },
        {
          q: 'Er dýrara að kaupa pizzu á höfuðborgarsvæðinu en úti á landi?',
          a: `${regionVerdict(s, true)} Miðgildi Margheritu er ${k(s.capital.margheritaMedian)} á höfuðborgarsvæðinu (${isN(s.capital.margheritaPlaces, 'staður', 'staðir')}) og ${k(s.rest.margheritaMedian)} á landsbyggðinni (${isN(s.rest.margheritaPlaces, 'staður', 'staðir')}), eða ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, true)}. Miðgildi allra pizza er ${k(s.capital.pizzaMedian)} á höfuðborgarsvæðinu (${isN(s.capital.pizzas, 'pizza', 'pizzur')} á ${isN(s.capital.places, 'stað', 'stöðum')}) og ${k(s.rest.pizzaMedian)} á landsbyggðinni (${isN(s.rest.pizzas, 'pizza', 'pizzur')} á ${isN(s.rest.places, 'stað', 'stöðum')}), eða ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, true)}. Samanburðurinn byggir á takmörkuðum fjölda staða í hvorum hópi, svo einstakir matseðlar geta breytt niðurstöðunni.`,
        },
        {
          q: 'Eru verð á Wolt hærri en á staðnum?',
          a: `Þau geta verið það. Pizzadeig.is notar verð af Wolt aðeins þar sem enginn eigin matseðill staðarins fannst á netinu, og verð af Wolt geta verið hærri en á staðnum. ${woltParts.join(' ')}${woltParts.length > 0 ? '. ' : ''}Gögnin innihalda ekki samanburð við verð á staðnum, svo ekki er hægt að segja hversu miklu munar.`,
        },
      ]
    : [
        {
          q: 'How much does a pizza cost in Iceland?',
          a: `On the menus of the ${enN(s.placesCounted, 'pizza place', 'pizza places')} Pizzadeig.is has recorded, the median pizza price is ${k(s.pizzaMedian)}. It is computed from ${enN(s.pizzasCounted, 'pizza', 'pizzas')} on menus recorded ${date}, using each menu's base price (usually 12" or medium). The cheapest pizza on these menus costs ${k(s.cheapestPizza?.pick.price ?? null)} (${pickRef(s.cheapestPizza)}) and the most expensive ${k(s.priciestPizza?.pick.price ?? null)} (${pickRef(s.priciestPizza)}). Sizes differ between places.`,
        },
        {
          q: 'How much does a Margherita cost in Iceland?',
          a: `At the ${enN(s.margheritaPlaces, 'place', 'places')} on Pizzadeig.is that have a pizza named Margherita (or Margarita), it costs a median of ${k(s.margheritaMedian)} (menus recorded ${date}). The cheapest Margherita costs ${k(cheapM?.pick.price ?? null)} (${placeRef(cheapM)}) and the most expensive ${k(priceM?.pick.price ?? null)} (${placeRef(priceM)}). The menu's base price is used; if a place offers more than one Margherita, the cheapest is counted.`,
        },
        {
          q: 'Where is the cheapest Margherita in Iceland?',
          a: `The cheapest Margherita on the menus Pizzadeig.is has recorded: ${top3.length > 0 ? cheapestLine(top3[0]) : ''}.${top3.length > 1 ? ` Next come ${joinList(top3.slice(1).map(cheapestLine), false)}.` : ''} Menus recorded ${date}; sizes differ, so the same price does not mean the same pizza.${olderSentence}`,
        },
        {
          q: 'Is pizza more expensive in the capital area than in the rest of Iceland?',
          a: `${regionVerdict(s, false)} The median Margherita is ${k(s.capital.margheritaMedian)} in the capital area (${enN(s.capital.margheritaPlaces, 'place', 'places')}) and ${k(s.rest.margheritaMedian)} in the rest of the country (${enN(s.rest.margheritaPlaces, 'place', 'places')}), that is ${diffPhrase(s.capital.margheritaMedian, s.rest.margheritaMedian, false)}. The median of all pizzas is ${k(s.capital.pizzaMedian)} in the capital area (${enN(s.capital.pizzas, 'pizza', 'pizzas')} at ${enN(s.capital.places, 'place', 'places')}) and ${k(s.rest.pizzaMedian)} in the rest of the country (${enN(s.rest.pizzas, 'pizza', 'pizzas')} at ${enN(s.rest.places, 'place', 'places')}), that is ${diffPhrase(s.capital.pizzaMedian, s.rest.pizzaMedian, false)}. The comparison rests on a limited number of places in each group, so individual menus can change the result.`,
        },
        {
          q: 'Are Wolt prices higher than prices at the restaurant?',
          a: `They can be. Pizzadeig.is uses Wolt prices only where the restaurant had no menu of its own online, and Wolt prices can be higher than in-house prices. ${woltParts.join(' ')}${woltParts.length > 0 ? '. ' : ''}The data contains no comparison with in-house prices, so it cannot show by how much they differ.`,
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
              {isIs ? isN(g.margheritaPlaces, 'staður', 'staðir') : enN(g.margheritaPlaces, 'place', 'places')}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-(--color-text-secondary)">{isIs ? 'Allar pizzur, miðgildi' : 'All pizzas, median'}</dt>
          <dd className="font-display text-2xl font-bold text-primary">
            {kr(g.pizzaMedian, isIs)}
            <span className="text-sm font-sans font-normal text-muted-foreground ml-2">
              {isIs ? `${isN(g.pizzas, 'pizza', 'pizzur')} á ${isN(g.places, 'stað', 'stöðum')}` : `${enN(g.pizzas, 'pizza', 'pizzas')} at ${enN(g.places, 'place', 'places')}`}
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
    ...(s.dataDate ? { dateModified: s.dataDate, temporalCoverage: s.dataDate } : {}),
    isAccessibleForFree: true,
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
            {isIs ? '. Sjá líka ' : '. See also '}
            <a href="#um-gognin" className="underline underline-offset-2 hover:text-primary">{isIs ? 'Um gögnin' : 'About the data'}</a>
            {'.'}
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
              detail={isIs ? `${isN(s.margheritaPlaces, 'staður', 'staðir')} með pizzu sem heitir Margherita` : `${enN(s.margheritaPlaces, 'place', 'places')} with a pizza named Margherita`}
            />
            {s.cheapestMargherita ? (
              <KeyFigure
                label={isIs ? 'Ódýrasta Margherita' : 'Cheapest Margherita'}
                value={k(s.cheapestMargherita.pick.price)}
                detail={withNote(withSize(`${s.cheapestMargherita.restaurant.name}, ${s.cheapestMargherita.restaurant.city}`, s.cheapestMargherita.pick, isIs), s.cheapestMargherita.restaurant, isIs)}
              />
            ) : null}
            {s.priciestMargherita ? (
              <KeyFigure
                label={isIs ? 'Dýrasta Margherita' : 'Most expensive Margherita'}
                value={k(s.priciestMargherita.pick.price)}
                detail={withNote(withSize(`${s.priciestMargherita.restaurant.name}, ${s.priciestMargherita.restaurant.city}`, s.priciestMargherita.pick, isIs), s.priciestMargherita.restaurant, isIs)}
              />
            ) : null}
            <KeyFigure
              label={isIs ? 'Allar pizzur, miðgildi' : 'All pizzas, median'}
              value={k(s.pizzaMedian)}
              detail={isIs ? 'Grunnverð hvers matseðils' : "Each menu's base price"}
            />
            <KeyFigure
              label={isIs ? 'Staðir í gögnunum' : 'Places counted'}
              value={String(s.placesCounted)}
              detail={isIs ? `af ${isN(mockRestaurants.length, 'stað', 'stöðum')} á Pizzadeig.is` : `of ${enN(mockRestaurants.length, 'place', 'places')} on Pizzadeig.is`}
            />
            <KeyFigure
              label={isIs ? 'Pizzur taldar' : 'Pizzas counted'}
              value={String(s.pizzasCounted)}
              detail={isIs ? 'Barna- og eftirréttapizzur ekki taldar' : "Kids' and dessert pizzas not counted"}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {isIs ? 'Matseðlar skráðir ' : 'Menus recorded '}
            {s.dataDate ? <time dateTime={s.dataDate}>{date}</time> : null}
            {isIs ? '. Miðgildi er verðið í miðjunni þegar verðunum er raðað frá lægsta til hæsta.' : '. The median is the price in the middle when the prices are sorted from lowest to highest.'}
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
          <h2 id="stadir" className="scroll-mt-24 font-display text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-2">
            {isIs ? 'Verð eftir stöðum' : 'Prices by place'}
          </h2>
          <p className="text-sm text-(--color-text-secondary) mb-4 max-w-3xl">
            {isIs
              ? 'Verð í krónum, grunnverð hvers matseðils (oftast 12" eða miðstærð). Stærð Margheritu er sýnd þar sem matseðillinn gefur hana upp. Raðað eftir bæ og nafni.'
              : 'Prices in Icelandic krónur (ISK), the base price of each menu (usually 12" or medium). The Margherita size is shown where the menu gives it. Sorted by town and name.'}
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
            {isIs ? 'Engin verð í gögnunum: ' : 'No prices in the data: '}
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
          {s.olderMenus.length > 0 ? (
            <p className="text-sm text-(--color-text-secondary) mt-2">
              {isIs ? 'Eldri matseðlar, ekki taldir með í tölunum: ' : 'Older menus, not counted in the figures: '}
              {s.olderMenus.map((r, i) => (
                <span key={r.id}>
                  {i > 0 ? ', ' : ''}
                  <Link href={`/stadir/${r.slug}`} className="underline underline-offset-2 hover:text-primary">{r.name}</Link>
                  {r.menu_verified_at ? ` (${formatDate(r.menu_verified_at, isIs)})` : ''}
                </span>
              ))}
              .
            </p>
          ) : null}
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
              {isIs ? 'Allar tölur eru úr matseðlum sem voru skráðir ' : 'All figures come from menus recorded on '}
              {s.dataDate ? <time dateTime={s.dataDate}>{date}</time> : null}
              {isIs
                ? '. Matseðlar með eldri dagsetningu eru sýndir fyrir neðan töfluna en ekki taldir með, svo allar tölur eru frá sama tíma. Hver staður er með slóð á heimild í töflunni.'
                : '. Menus with an earlier date are listed below the table but not counted, so all figures are from the same time. Each place has a link to its source in the table.'}
            </li>
            {s.ownerSupplied.length > 0 ? (
              <li>
                {isIs
                  ? `${s.ownerSupplied.length === 1 ? 'Matseðill eins staðar var skráður' : `Matseðlar ${isN(s.ownerSupplied.length, 'staðar', 'staða')} voru skráðir`} af Pizzadeig.is: `
                  : `${s.ownerSupplied.length === 1 ? 'The menu of one place was recorded' : `The menus of ${s.ownerSupplied.length} places were recorded`} by Pizzadeig.is: `}
                {s.ownerSupplied
                  .map((o) => `${o.restaurant.name} (${formatDate(o.date, isIs)})`)
                  .join('; ')}
                {'.'}
              </li>
            ) : null}
            <li>
              {isIs
                ? 'Stærðir eru misjafnar á milli staða og sumir matseðlar sýna enga stærð. Notað er grunnverð matseðilsins, sem er oftast fyrir 12" pizzu eða miðstærð, en hjá sumum stöðum fyrir minni pizzu, til dæmis 10". Stærð Margheritu er sýnd í töflunni þar sem matseðillinn gefur hana upp. Verð stærri stærða eru ekki talin með.'
                : 'Sizes differ between places and some menus show no size. The menu\'s base price is used, usually for a 12" or medium pizza, but at some places for a smaller one, such as 10". The Margherita size is shown in the table where the menu gives it. Prices of larger sizes are not counted.'}
            </li>
            <li>
              {isIs
                ? `Verð af Wolt geta verið hærri en á staðnum. Verð ${isN(platformCount, 'staðar kemur', 'staða koma')} af Wolt, að hluta eða öllu leyti, og það er merkt í töflunni.`
                : `Wolt prices can be higher than in-house prices. The prices of ${enN(platformCount, 'place come', 'places come')} from Wolt, wholly or in part, and this is marked in the table.`}
            </li>
            <li>
              {isIs
                ? 'Aðeins pizzur í flokknum „Pizzur“ eru taldar, þar á meðal hálfmánar (calzone) sem matseðillinn telur til pizza; barnapizzur og eftirréttapizzur ekki. Margherita er pizza sem heitir Margherita eða Margarita, hvort sem hún er napólítönsk með ferskum mozzarella eða með sósu og rifnum osti; bjóði staður fleiri en eina er sú ódýrasta talin. Miðgildi allra pizza vegur hverja pizzu jafnt, þannig að staðir með stóran matseðil vega þyngra.'
                : 'Only pizzas in the “Pizzur” category are counted, including calzones the menu lists as pizzas; kids\' pizzas and dessert pizzas are not. A Margherita is a pizza named Margherita or Margarita, whether Neapolitan with fresh mozzarella or with sauce and grated cheese; if a place has more than one, the cheapest is counted. The median of all pizzas weighs each pizza equally, so places with a large menu weigh more.'}
            </li>
            <li>
              {isIs
                ? `Höfuðborgarsvæðið er ${CAPITAL_AREA_CITIES.join(', ')}; allir aðrir bæir teljast landsbyggðin. Keðja sem er ein síða á Pizzadeig.is (eins og Domino's) er ein færsla og telst í bænum þar sem aðalheimilisfang hennar er; staðir sem eru skráðir hver fyrir sig teljast hver fyrir sig.`
                : `The capital area is ${CAPITAL_AREA_CITIES.join(', ')}; all other towns count as the rest of Iceland. A chain that is one page on Pizzadeig.is (such as Domino's) is one entry and counts in the town of its main address; places listed separately count separately.`}
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
