# SEO + GEO Revision — Pizzadeig.is
_Data window: 2026-05-07 → 2026-08-06 (GSC, Web search) · Generated: 2026-08-08_

> Byggt á alvöru GSC-gögnum (vistuð í `seo/gsc/2026-05-07_2026-08-06/`) auk
> live-athugana á vefnum og kóðanum. Atriði merkt „✅ staðfest live" voru sannreynd
> með HTTP-köllum. Athugið: Queries.csv sýnir 27 smelli / 2.913 impressions en
> Devices.csv 81 / 5.280 — Google felur langhalann í queries-skýrslunni; heildartölur
> hér miðast við Devices/Countries.

## 1. Current state

### Architecture & rendering

Next.js 16 (App Router) á Vercel, React 19, `next-intl` með `is` (default) og `en`.
Nær allt server-renderað (`force-dynamic`) — góður grunnur fyrir SEO og GEO. Veika
blettinn: **`/uppskriftir` er `'use client'`** og sækir uppskriftir client-side úr
Firestore — server-HTML-ið inniheldur **engan hlekk á neina uppskrift** (✅ staðfest
live). Uppskrifta-detail-síður eru aftur á móti server-renderaðar með `Recipe` JSON-LD
— og GSC staðfestir að það virkar: **Recipe rich results fá 139 impressions með 2,88%
CTR** (þrefalt vefjar-meðaltal) og Recipe gallery 86 impressions á meðalstöðu 5,6.

### GSC headline

| Mæling | Gildi |
|---|---|
| Smellir (3 mán.) | **81** (60 mobile / 21 desktop) |
| Impressions | **5.280** |
| CTR vefjar | **1,53%** |
| Ísland | 60 smellir / 3.977 impressions (75% af öllu) |
| Meðalstaða | mobile **8,5** · desktop **27,5** |
| Trend | Impressions ~tvöfaldast (≈25/dag í maí → ≈60/dag í júlí) — **smellir standa í stað** |

Vefurinn er sem sagt að *sjást* æ oftar en ekki að *fá smellinn*. Þrír stakir
impression-toppar (2. jún: 196, 1. júl: 412, 2. ágú: 413, allir á stöðu >30) eru
erlendar „pizza near me"-hviður og rusl-queries — ekki oflesa í þá.

### Það sem lekur — nú mælt

1. **Canonical-villan** (✅ staðfest live): root layout
   ([layout.tsx:31](../src/app/%5Blocale%5D/layout.tsx#L31)) lætur allar síður án
   eigin `alternates` benda canonical á forsíðuna. GSC sýnir afleiðinguna: stærsta
   síða vefsins á impressions, `/is/stadir` (1.017 impr), situr á **stöðu 33,7**.
2. **www/non-www klofningur — mældur í Pages.csv.** Sama efni safnar impressions á
   báðum hostum: `sannkallad-napoli-deig` birtist á **þremur** host/locale-samsetningum
   (219 + 39 + 16 impr), `reykjavik-pizzeria` á non-www (286 impr), `daddis-pizza` á
   báðum (107 + 32 impr). Google er að skipta signal-inu. Live: non-www → 307 → www.
3. **Veitingastaðasíður án metadata = stærsta mælda tækifærið.**
   `/en/stadir/napoli-pizza-rvk`: **629 impressions, staða 13,9, CTR 0,16%** (ætti að
   vera ~1,5–3%). Queryið „napoli pizza" eitt: **537 impressions, staða 10,6, CTR
   0,37%**. Sama mynstur á flatey (28 impr, staða 9,3, 0%), castello (27 impr, staða
   8,5, 0%), íslenska flatbakan, bakabaka, olifa. Þessar síður erfa forsíðutitil —
   snippetið segir ekkert um staðinn, svo enginn smellir.
4. **`/budin` er dautt en lifir í Google** (✅ staðfest live: 404): 44 impressions,
   2 smellir, staða 10,3 — þarf 301 á `/is/vorur`.
5. **Deigreiknivélin ósýnileg:** 42 impressions, staða **36,9**, 0 smellir — engin
   indexanleg efnisgrein á síðunni. „pizzadeig kalkulator" (staða 6!) sýnir að
   eftirspurnin er til.
6. **„pizzadeig uppskrift" á stöðu 31,7** (24 impr) — verðmætasta efnisqueryið er á
   síðu 3–4 á meðan „pizzadeig" (366 impr) og „pizza deig" (195 impr) eru á stöðu
   6–10. Uppskriftahubburinn (client-renderaður, canonical á forsíðu) ber ekki queryið.
7. **Desktop-vandinn:** staða 27,5 á desktop vs 8,5 á mobile og CTR 0,94% vs 2%.
   Skýrist að hluta af erlendu „near me"-rusli sem lendir á desktop, en mynstrið er
   samt: efnisleit (mobile, Ísland) gengur vel, allt annað ekki.

### Það sem virkar

- Recipe rich results & gallery skila hæsta CTR vefsins — JSON-LD fjárfestingin borgar sig.
- „pizzafjörður" (5,7% CTR, staða 6,6), „pizzustaðir" (4,7%, staða 8,8), „pizza
  ísafjörður" (8,3%) — staðbundnar íslenskar leitir smella þegar síðan á annað borð raðast.
- EN-uppskriftin `sannkallad-napoli-deig` á stöðu 5,8 með 219 impressions — alþjóðleg
  eftirspurn eftir napólí-efni er raunveruleg (en CTR 1,8% er undir væntingum fyrir stöðu 6).

## 2. Keyword landscape

Klasar úr mældum queries (+ vefleitar-sannreyningu á íslenskri leitarhegðun):

| Klasi | Intent | Mæld dæmi (impr · staða) | Markmiðssíða | Staða |
|---|---|---|---|---|
| Pizzadeig generic | Info | pizzadeig (366 · 10,0), pizza deig (195 · 6,0), besta pizzadeig í heimi (2 · 19) | Forsíða + `/uppskriftir` | Striking distance — CTR & title-vinna |
| Uppskrift long-tail | Info | pizzadeig uppskrift (24 · 31,7), pizza deig uppskrift (3 · 22), frosið pizzadeig (1 smellur) | `/uppskriftir` (SSR + pillar) | Síða 3–4 → þarf relevansvinnu |
| Napoli / veitingastaðir | Nav/Comm | napoli pizza (537 · 10,6), + öll staðanöfnin | `/stadir/[slug]` | Metadata-lausar síður leka mest |
| Pizzustaðalisti | Comm | pizzustaðir (43 · 8,8), pizza staðir (15 · 9,4), pizzastaðir í reykjavík | `/stadir` | Á stöðu 33,7 sem síða — canonical + titill |
| Súrdeig | Info | súrdeigs pizzadeig uppskrift (3 · 21,3), pizza surdeig (1 · 11) | Vantar pillar | Staðfest gat |
| Mjöl & tæki | Comm | pizzaskeri (43 · 61,5), pizzaspaði (14 · 52,7), pizzadeig tipo 00 (3 · 19,3), pizzahnífur, pizza ofn | `/vorur` | Raðast á síðu 5–6 = efni vantar |
| Reiknivél | Tool | pizzadeig kalkulator (2 · 6) | `/deigreiknivel` | Tólið raðast, síðan ekki (36,9) |
| Hvít pizza / sósur | Info | bechamel-klasinn (~15 queries), white pizza sauce, hvit pizzasaus | `/uppskriftir/hvita-pizzan`, `hvit-sosa` | hvita-pizzan EN: staða 7,1, 0% CTR — snippet-fix |
| Norska/skandinavíska | Info | pizzadeig oppskrift (6 · 24,8), langtidsheving, 24 timer, kalkulator; NO 110 impr, SE 64 impr, 0 smellir | — | Watchlist (lénið = norska orðið) |
| Delivery „near me" | Trans | ~150 queries, allt staða 20–40, 0 smellir | — | Rangt intent — ekki eltast við |

## 3. Opportunities

**Striking distance (mælt, forgangsraðað eftir impressions í húfi):**
1. „napoli pizza" + staðasíðurnar — 629+537 impr á stöðu 10–14 með nær engum CTR →
   metadata + restaurantJsonLd á `/stadir/[slug]`.
2. „pizzadeig"/„pizza deig" — 561 impr á stöðu 6–10, CTR 2–2,5% (vænt 6–10% á stöðu 6)
   → betri forsíðutitill/lýsing (ad copy, ekki bara nafn).
3. `/en/uppskriftir/sannkallad-napoli-deig` — 219 impr á stöðu 5,8, CTR 1,8% → titill
   sem selur („48-hour fermented Neapolitan dough" o.s.frv.).
4. `hvita-pizzan` EN — 59 impr á stöðu 7,1, **0%** CTR → titill/lýsing.
5. „pizzustaðir" — 43 impr á stöðu 8,8 → `/stadir` titill + canonical-lagfæring.

**CTR-vinna:** liðir 2–4 að ofan eru hrein snippet-vinna, engin röðunarvinna.

**Efnisgöt (mæld eftirspurn, engin síða):** súrdeigspillar (staða 21 án þess að
reyna), tipo 00/mjölefni (staða 19,3), reiknivélartexti, lyftiduftsdeig (staða 34,7),
24-tíma/kaldhefun (staða 11 á „pizzadeig 24 timer").

**Cannibalization / cleanup:** www-klofningurinn (mældur á 5+ slóðum), `/budin` 404,
EN/IS-síður án hreins hreflang.

## 4. Architecture recommendations

### SEO
1. `buildMetadata(path, locale)` hjálparfall í `seo.ts` (canonical á **www** +
   hreflang-par + x-default) og fjarlægja canonical-erfðirnar úr root layout.
2. Samræma host á `https://www.pizzadeig.is` í sitemap, robots, seo.ts og OG.
3. `generateMetadata` á `/stadir/[slug]` („{nafn} — matseðill, verð og einkunnir |
   Pizzadeig.is") og `/flokkar/[type]`, `/stilar`, `/vorur`, `/hvad-a-eg`.
4. 301: `/budin` → `/is/vorur` (next.config redirect).
5. Server-rendera `/uppskriftir` (fylgja `/stadir`-mynstrinu: server sækir → props).
6. Sitemap: vantar slóðir + Firestore-uppskriftir + alvöru `lastModified`.

### GEO
1. Rendera `restaurantJsonLd` á `/stadir/[slug]` (tilbúið, ónotað) — matseðilsverð í
   ISK er einmitt það sem AI-svör um „napoli pizza menu"-queries vilja.
2. Answer-first texti + `FAQPage` á `/deigreiknivel` („Fyrir 30 cm pizzu þarf ~250 g
   deigkúlu…") — mæld eftirspurn („kalkulator" staða 6).
3. Súrdeigs- og mjöl/tækjaefni með tölum (gr, °C, klst, ISK-verð) — quotable.
4. Fjarlægja fabricated data úr Recipe JSON-LD (rating 5/1 fallback, „250 calories")
   — rich results eru þegar að virka; ekki hætta þeim.
5. Laga brotnu fallback-myndina (`OG-BG.jpeg` er 404) og skipta Unsplash-OG út fyrir
   eigin mynd.
6. Kostnaðargrein úr Krónu-verðgögnum („verðvaktin" fær þegar impressions á stöðu 10).

## 5. Measurement

Fylgjast með í GSC eftir 4–6 vikur (bera saman við `seo/gsc/2026-05-07_2026-08-06/`):

| Breyting | Mælikvarði sem á að hreyfast |
|---|---|
| Canonical + host-samræming | `/is/stadir` staða (33,7 → <15); impressions hætta að dreifast á non-www |
| Staðasíðu-metadata + JSON-LD | „napoli pizza" CTR (0,37% → >1,5%); napoli-rvk síðu-CTR (0,16% → >1%) |
| Forsíðutitill | „pizza deig" CTR (2,05% → >5% á stöðu 6) |
| EN-uppskriftatitlar | sannkallad-napoli-deig EN CTR (1,8% → >4%); hvita-pizzan EN (0% → >2%) |
| Reiknivélartexti | `/is/deigreiknivel` staða (36,9 → <20) |
| SSR á `/uppskriftir` | „pizzadeig uppskrift" staða (31,7 → <15) |
| `/budin` redirect | 404-impressions hverfa úr Pages |
| GEO (mánaðarlegt handpróf) | Er pizzadeig.is í heimildum hjá ChatGPT/Perplexity/Claude fyrir „besta pizzadeigsuppskriftin?" og „napoli pizza reykjavík matseðill?" |
