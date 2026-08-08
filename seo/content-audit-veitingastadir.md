# Efnisúttekt — veitingastaðir á pizzadeig.is
_Gerð: 2026-08-08 · 32 staðir sannreyndir gegn raunheiminum (vefsíður staða, ja.is, 1819.is, Tripadvisor, Wolt, fjölmiðlar) · Production birtir nákvæmlega gögnin í `src/lib/mockData.ts` (staðfest samhljóða)_

> **STAÐA 2026-08-08: LAGFÆRT.** Allar villur sem hér eru skráðar hafa verið leiðréttar
> í `src/lib/mockData.ts`. Staðirnir 4 í BLOCK-listanum voru fjarlægðir (ásamt 17
> matseðilsatriðum þeirra), heimilisföng/símar/vefsíður/opnunartímar leiðréttir skv.
> heimildunum hér að neðan, hnit endursótt með OpenStreetMap Nominatim út frá réttum
> heimilisföngum, og allir tilbúnu Google/TripAdvisor-reitirnir (32 `rating_google`,
> 25 `rating_tripadvisor`, allir `google_place_id` og `tripadvisor_url`) fjarlægðir.
> `is_verified` var sett `false` alls staðar — 11 staðir báru „Vottaður" merki án þess
> að nokkur hefði staðfest þá. Vefurinn birtir nú **28 staði**.
>
> Undantekning sem eftir stendur: **Stykkið Pizzagerð** (Stykkishólmi) birtir enga
> opnunartíma því engin lifandi frumheimild fannst — betra en að birta ágiskun.
> Hringja má í 438 1717 til að fylla í.
>
> **⚠️ Aðgerð sem þarf mannshönd: keyra seed í admin.** Staðasíðurnar lesa úr Firestore,
> ekki úr kóðanum, og Firestore geymir enn gömlu gögnin. Lagfæringarnar birtast því
> ekki fyrr en farið er í `/is/admin` → Kerfisstjórnun → „Sturta Innihaldi Inn".
> Seed-aðgerðin var látin samstilla: hún skrifar réttu gögnin OG eyðir úreltum
> `is_seeded` skjölum (lokuðu stöðunum fjórum). Notendaskráð efni er ósnert.

## Heildarniðurstaða

**Gögnin eru að stórum hluta röng — mynstrið bendir til uppspuna (hallucinated seed data), ekki bara úreldingar.** Heimilisföng eru röng hjá ~22 af 32 stöðum, þar á meðal beinar víxlanir (Eldofninn fékk heimilisfang Reykjavik Pizzeria; Castello og Íslenska Flatbakan fengu götur hvor annars; Glósteinn fékk heimilisfang Pizzunnar á Hringbraut). Aðeins 3 af 10 uppgefnum símanúmerum eru rétt. Opnunartímar eru rangir eða ónákvæmir hjá ~28 af 32. Fjórir staðir eru hættir eða virðast ekki vera til.

**Aðeins 2 staðir af 32 standast öll atriði: Greifinn (Akureyri) og Askur Pizzeria (Egilsstaðir).**

## BLOCK — staðir sem eiga ekki að vera á vefnum (eða þarf að laga strax)

| Staður | Vandinn | Heimild |
|---|---|---|
| **Daddi's Pizza** (RVK) | **Lokaði í apríl 2026** (mbl.is 10.4.2026). Var auk þess á Skipholti, aldrei Hafnarstræti 8. Upprunastaðurinn í Mývatnssveit er enn opinn. | mbl.is, daddispizza.is |
| **Pítsugerðin** (Vestmannaeyjum) | **Hætti í ágúst 2025**, húsnæðið selt (mars 2026). Var á Bárustíg 1, ekki Vestmannabraut 28. | Facebook/foodyas, ja.is 404 |
| **Fernando's** (Keflavík) | **Líklega hættur** (HappyCow „CLOSED", Top-Rated „permanently closed", horfinn af Tripadvisor-listum). Heimilisfangið auk þess rangt (Hafnargata 28, ekki 5). | happycow.net, top-rated.online |
| **Pizza Bræður** (Mosfellsbæ) | **Virðist ekki vera til.** Á Háholti 13 er „Pizzan Háholti" (útibú Pizzan-keðjunnar). Engin ja.is-skráning, engar umsagnir, enginn miðill nefnir staðinn. | wolt.com, restaurantguru |

## RANGT — starfandi staðir með rangar staðreyndir

Rétt gildi skv. heimildum í sviga; öll frávik miðast við það sem vefurinn birtir í dag.

| Staður | Heimilisfang | Sími | Opnunartímar |
|---|---|---|---|
| Flatey Pizza (Grandagarði) | ✓ rétt | ✗ (588 2666, ekki 588 5555) | ✗ (11:30–22 alla daga skv. ja.is) |
| Olifa La Madre | ✗ (**Suðurlandsbraut 12, 108** — ekki Laugavegur 2b) | ✗ (419 1119) | ✗ (breytilegt e. dögum, sjá olifapizzeria.is) — **vefsíðan olifa.is er DAUÐ; rétt lén olifapizzeria.is** |
| Eldofninn | ✗ (**Grímsbær/Efstaland 26, 108** — Bragagata 38a er Reykjavik Pizzeria!) | ✗ (533 1313) | ✗ (mán LOKAÐ; þri–fös 11:30–21; helgar 15–21) |
| Hornið | ✓ | ✓ | ✗ (11–22, eldhús til 21 — ekki 11:30–23) |
| Reykjavik Pizzeria | ✗ (**Bragagata 38A, 101** — ekki Háteigsvegur 9, 105) | ✗ (547 4747) | ✗ (11:30–22) |
| BakaBaka | ✗ (**Bankastræti 2** — ekki Skólavörðustígur 36) | — | ✗ (17:30–22/23, líka um helgar) |
| Kaffi Laugalækur | ✗ (**Laugarnesvegur 74a** — ekki Laugalækur 6) | — | ✗ (10–23 alla daga) |
| Rossopomodoro | ✓ (40a) | — | ~ (11:30 opnun, ekki 11; sun 16:30) |
| Napoli Pizza | ✗ (**Tryggvagata 24** — ekki 14) | — | ✗ (11:30–22) |
| Glósteinn | ✗ (**Nethylur 2, 110** — Hringbraut 119 er Pizzan!) | — | ✗ (kvöldstaður, ~16:30–21) |
| Pizza Popolare | ✗ (**Pósthússtræti 5** — ekki Austurstræti 13) | — | ✓ |
| Pizzasmiðjan (Akureyri) | ✗ (**Hafnarstræti 92** — ekki Kaupvangsstræti 6) | — | ✗ (frá 17 öll kvöld) |
| Íslenska Flatbakan | ✗ (**Bæjarlind 2, 201 Kóp.** — „Dalshraun 1, Kópavogi" er auk þess ómögulegt, Dalshraun er í Hafnarfirði) | — | ~ (helgar frá 12) |
| Castello Pizzeria | ✗ (**Dalshraun 13, 220 Hfj.** — ekki Strandgata 55) | — | ✗ (11–23/23:30) |
| Antons Mamma Mia | ✗ (**Hafnargata 18** — ekki 32) | ✗ (421 2008) | ✗ (17–22) |
| Italiano Pizzeria | ✗ (**Hlíðasmári 15** — ekki Smáratorg) | — | ✗ (11–21) |
| Íshúsið Pizzeria | ✓ | ✗ (478 **1230**, ekki 1220) | ✗ (mán–fös 12–21, helgar 17–21) |
| Pizzafjörður | ✓ | — | ✗ (opið öll kvöld NEMA þri — vefurinn segir fim/fös lokað, nánast öfugt) |
| Pizza Kofinn (Húsavík) | ✗ (**Garðarsbraut 20** — ekki Hafnarstétt 9) | — | ✗ (fös–sun 17–21, LOKAÐ mán–mið; rekstur auk þess í breytingum/til sölu) |
| Stykkið (Stykkishólmi) | ✗ (**Borgarbraut 1** — ekki Aðalgata 3; heitir „Stykkið Pizzagerð") | — | ? óstaðfest |
| Flatey Pizza Selfoss | ✗ (**Brúarstræti 1** — ekki Austurvegur 1) | — | ✓ |
| Kaffi Krús | ✓ | — | ✗ (11–21 virka daga, 12–21 helgar — ekki 08–22) |
| Pizza 67 (Vestm.) | ✗ (**Heiðarvegur 5** — ekki Bárustígur 11) | — | ~ (helgar 12–22) |
| Hamraborg (Ísafirði) | ✓ | — | ✗ (8–23:30 — ekki 11:30–21) |
| Pizzan Hafnarfirði | ✗ (**Fjarðargata 11** — ekki 13-15) | — | ✗ (11–23) |
| Flatey Garðatorg | ✗ (**Garðatorg 6** — ekki 7) | — | ~ (helgar frá 12) |

## VERIFIED — standast öll skoðuð atriði

- **Greifinn**, Glerárgata 20, Akureyri — heimilisfang, sími (460 1600), opnunartímar (11:30–22) allt staðfest á greifinn.is
- **Askur Pizzeria**, Fagradalsbraut 25, Egilsstöðum — allt staðfest á askurpizzeria.is (heimilisfang, 470 6070, 11:30–21)

## UNVERIFIABLE / RISKY

- **Google/TripAdvisor-einkunnir** sem birtast á staðasíðunum koma úr mockData og voru ekki sannreyndar í þessari úttekt — miðað við gæði annarra gagna ætti að fjarlægja þær eða sækja raunverulegar tölur. Að birta uppdiktaðar þriðjaaðilaeinkunnir er verra en engar.
- **Matseðlar og verð** (t.d. 23 réttir hjá Pizzafirði, 19 hjá Aski) voru ekki sannreynd rétt fyrir rétt — of umfangsmikið í þessari umferð. Verðin á Aski/Pizzafirði komu inn í nýlegum PR-um (#1–4) og eru líklega réttari en grunngögnin, en restin er ósannreynd.
- **Verðflokkar** (1–4 dollaramerkin) — huglægt mat, ósannreynt.

## Rót vandans

Production les Firestore með mock-fallback og birtir í dag nákvæmlega mockData-gildin. Mynstrið í villunum (víxluð heimilisföng milli staða, símanúmer sem tilheyra engum, opnunartímar sem líkjast sjablónum) bendir til að grunngögnin hafi verið **búin til af gervigreind án sannreyningar**, ekki safnað úr heimildum. Nýlegu PR-arnir (#1–4) löguðu matseðla hjá 2–3 stöðum en snertu ekki grunnstaðreyndirnar.

## Tillaga að aðgerðaröð

1. **Strax:** taka út/merkja lokaða staðina 4 (BLOCK-listinn) — að vísa fólki á lokaða staði er versta birtingarmyndin.
2. Uppfæra heimilisföng, síma og opnunartíma skv. töflunni (réttu gildin + heimildir eru öll hér).
3. Fjarlægja eða sannreyna Google/TripAdvisor-einkunnirnar.
4. Til framtíðar: „is_verified" reiturinn er til í gagnalíkaninu en hvergi settur — nota hann og birta aðeins sannreynda staði áberandi.
