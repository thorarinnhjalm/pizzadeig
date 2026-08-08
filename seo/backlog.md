# SEO + GEO Backlog — Pizzadeig.is
_Generated: 2026-08-08 · GSC-gögn: 2026-05-07 → 2026-08-06 (vistuð í `seo/gsc/`) · ✅ = staðfest live/í kóða_

## Quick wins (high impact / low effort)

- [ ] **Laga canonical-erfðirnar úr root layout** — _why:_ ✅ allar síður án eigin `alternates` benda canonical á forsíðuna; GSC: `/is/stadir` (stærsta síðan, 1.017 impr) situr á stöðu 33,7 · _effort:_ S · _files:_ `src/app/[locale]/layout.tsx`, hjálparfall í `src/lib/seo.ts`
- [ ] **Samræma host á www alls staðar** — _why:_ ✅ non-www → 307 → www, en sitemap/robots/canonical nota non-www; GSC Pages sýnir sama efni safna impressions á báðum hostum (sannkallad-napoli-deig á 3 samsetningum: 219+39+16 impr; daddis-pizza 107+32) · _effort:_ S · _files:_ `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts`, layouts
- [ ] **generateMetadata á `/stadir/[slug]`** — _why:_ ✅ engin metadata; GSC: `/en/stadir/napoli-pizza-rvk` 629 impr á stöðu 13,9 með **CTR 0,16%**, queryið „napoli pizza" 537 impr · CTR 0,37%; flatey/castello/flatbakan öll 0% CTR á stöðu 8–13 · _effort:_ S · _files:_ `src/app/[locale]/stadir/[slug]/page.tsx`
- [ ] **Rendera `restaurantJsonLd` á `/stadir/[slug]`** — _why:_ fallið tilbúið en ónotað; „napoli pizza menu"-queries (10+ impr) vilja matseðil/verð — rich results virka nú þegar á uppskriftum (2,88% CTR vs 1,53% meðaltal) · _effort:_ S · _files:_ `src/app/[locale]/stadir/[slug]/page.tsx`
- [ ] **301 redirect `/budin` → `/is/vorur`** — _why:_ ✅ skilar 404 í dag en GSC: 44 impr, 2 smellir, staða 10,3 · _effort:_ S · _files:_ `next.config.ts`
- [ ] **Forsíðutitill sem selur** — _why:_ „pizza deig" 195 impr á stöðu 6,0 með CTR 2,05% (vænt 6–10%); „pizzadeig" 366 impr · 2,46% · _effort:_ S · _files:_ `src/app/[locale]/layout.tsx` / `page.tsx`, `messages/is.json`
- [ ] **EN-uppskriftatitlar (CTR-fix)** — _why:_ `sannkallad-napoli-deig` EN: 219 impr á stöðu 5,8, CTR 1,8%; `hvita-pizzan` EN: 59 impr á stöðu 7,1, **0% CTR** · _effort:_ S · _files:_ `seo_title_en`/`seo_description_en` í gögnum eða `src/lib/recipeData.ts`
- [ ] **Fjarlægja tilbúin gögn úr Recipe JSON-LD** — _why:_ rating 5/1-fallback og „250 calories" er fabricated markup — rich results skila nú hæsta CTR vefsins (2,88%), refsing myndi kosta það · _effort:_ S · _files:_ `src/lib/seo.ts:24-33`
- [ ] **Laga brotnu fallback-OG-myndina** — _why:_ ✅ `public/OG-BG.jpeg` er 404 en default í `recipeJsonLd`; Unsplash-mynd í layout-OG · _effort:_ S · _files:_ `public/`, `src/lib/seo.ts`, `src/app/[locale]/layout.tsx`
- [ ] **Sitemap-göt** — _why:_ ✅ `/vorur`, `/hvad-a-eg`, `/flokkar/[type]` vantar; `lastModified: new Date()` á öllu · _effort:_ S · _files:_ `src/app/sitemap.ts`
- [ ] **Titlar á metadata-lausu síðurnar** (`/stilar`, `/vorur`, `/hvad-a-eg`, `/flokkar/[type]`, `/um-okkur`, `/samfelag`) — _why:_ ✅ erfa forsíðutitil; `/en/stilar` 110 impr · 0% CTR; `/en/flokkar/deig` 121 impr á stöðu 10,4 · _effort:_ S · _files:_ viðkomandi síður
- [ ] **Answer-first texti + FAQPage á `/deigreiknivel`** — _why:_ síðan á stöðu 36,9 (42 impr, 0 smellir) þrátt fyrir að „pizzadeig kalkulator" raðist á stöðu 6 — engin indexanleg efnisgrein · _effort:_ S–M · _files:_ `src/app/[locale]/deigreiknivel/page.tsx`

## Strategic bets (high impact / higher effort)

- [ ] **Server-rendera `/uppskriftir`** — _why:_ ✅ núll uppskriftahlekkir í server-HTML; „pizzadeig uppskrift" (24 impr) á stöðu 31,7 á meðan generic-orðin eru á stöðu 6–10 — hubburinn ber ekki queryið · _effort:_ M · _files:_ `src/app/[locale]/uppskriftir/page.tsx`
- [ ] **Súrdeigspizza pillar-síða** — _why:_ „súrdeigs pizzadeig uppskrift" á stöðu 21,3 án markvissrar síðu; staðfest stór klasi í íslenskri leit (Vínbúðin, pizzaofnar.is raða) · _effort:_ M · _files:_ ný uppskrift + innri hlekkir
- [ ] **Mjöl- og tækjaefni á `/vorur`** — _why:_ „pizzaskeri" 43 impr á stöðu 61,5, „pizzaspaði" 14 · 52,7, „pizzadeig tipo 00" 3 · 19,3 — raðast illa því síðan er vörulisti án efnis · _effort:_ M · _files:_ `src/app/[locale]/vorur/page.tsx`, `src/lib/products.ts`
- [ ] **Skipta `/stilar` í `/stilar/[slug]`** — _why:_ ein síða um 4 stíla; `/en/stilar` 110 impr · 0% CTR · staða 23,6; napólí-klasinn (600+ impr samanlagt) á skilið eigin síðu · _effort:_ M · _files:_ `src/app/[locale]/stilar/`, `src/lib/pizzaStyles.ts`, sitemap
- [ ] **Kostnaðargrein úr Krónu-verðgögnum** — _why:_ „verðvaktin" fær þegar 2 impr á stöðu 10; dagsett ISK-verð er einstakt, tilvitnanlegt GEO-efni · _effort:_ M · _files:_ ný síða, `src/app/api/kronan/`
- [ ] **Firestore-uppskriftir í sitemap + hreflang-uppfærsla** — _why:_ ✅ sitemap les bara mock; hreflang aðeins á rót · _effort:_ M · _files:_ `src/app/sitemap.ts`, `src/lib/seo.ts`
- [ ] **Kaldhefunar/24-tíma efni** — _why:_ „pizzadeig 24 timer" staða 11, „pizzadeig með lyftidufti" staða 34,7, „48h"/„2hrs"-queries — tímatengd deigefni með mælda eftirspurn · _effort:_ M · _files:_ uppskriftir/tips

## Watchlist / later

- [ ] **Norræni langhalinn** — „pizzadeig" er líka norska orðið: NO 110 impr + SE 64 impr, 0 smellir („pizzadeig oppskrift" staða 24,8, „kalkulator", „langtidsheving"). Léttasta prófið: EN-reiknivélin nái „pizzadeig kalkulator"; no/sv locale er of stórt skref núna
- [ ] **Delivery/„near me"-ruslið** — ~150 erlend queries á stöðu 20–40 (þ.m.t. impression-topparnir 1. júl / 2. ágú) — rangt intent, ekki eltast við; ætti að fjara út þegar staðasíður fá skýrari metadata
- [ ] **Desktop-staðan 27,5 vs mobile 8,5** — endurmeta eftir canonical/host-lagfæringar; ef bilið helst er það sér-rannsókn
- [ ] **Íslensk „besta pizzan í Reykjavík"-ritstjórnargrein af topplista-gögnum** — „best pizza in reykjavik" 4 impr · staða 34,8; SERP-ið annars á ensku (Tripadvisor)
- [ ] **ISR/caching í stað `force-dynamic`** — CWV-tilgáta; mæla fyrst
- [ ] **Off-site tilvist** (umfjöllun, matarblogg, samfélög) — AI-módel vitna í það sem er staðfest víðar
- [ ] **Ahrefs-connector** — enn óauthorized í claude.ai stillingum; myndi bæta volume-gögnum við næstu umferð

## Framkvæmdaskrá

_(fyllist út þegar liðir eru kláraðir — hver liður + hvaða GSC-mælikvarði á að hreyfast, sbr. kafla 5 í seo-geo-plan.md)_
