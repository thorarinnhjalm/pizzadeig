# Endursöfnun matseðla: verkáætlun

Næsta söfnun er áætluð í janúar 2027 (áminning kemur 12. janúar). Síðasta söfnun var 22. október 2026. Þetta skjal er áætlunin; tæknileg atriði skriptunnar eru í `README.md` í sömu möppu.

## Verkið

```
Markmið: Allir pizzustaðir á pizzadeig.is með nýjan, dagsettan matseðil
  og heimild, svo /pizzuverd og llms.txt sýni nýjar tölur sem mállíkön
  geta vitnað í
Kaupandi: Þórarinn (eigandi vefsins)
Tilbúið þegar: Ný heimildaskrá (staður, réttur, verð, slóð, dagsetning)
  sem eigandinn getur flett í; /is/pizzuverd í preview sýnir nýju
  dagsetninguna og nýju tölurnar; listi yfir staði sem lokuðu, opnuðu
  eða fundust ekki; eigandinn prófar preview og mergear
Fastar tölur: Söfnunin 22. okt 2026 (39 staðir, 685 pizzur í tölunum,
  miðgildi Margheritu 2.890 kr.) til samanburðar
Má ekki snerta: Firestore (enginn Seed, enginn „Uppfæra matseðla“),
  notendagögn, útlit síðna
```

## Röðin

1. **Undirbúningur (eigandinn, 5 mín).**
   - Senda nýjar myndir af matseðlum Pizza 67 og Pizzafjarðar ef hann hefur þær. Þeir matseðlar eru `owner_supplied` og finnast ekki á netinu.
   - Nefna nýja staði sem hafa opnað eða staði sem hafa lokað.
2. **Staðalisti.** Fara yfir alla 39 staðina í `mockRestaurants`. Er staðurinn enn opinn? Hefur slóð matseðilsins breyst? Leita að nýjum pizzustöðum á landinu. Lokaðir staðir fá `"held_back": true` eða eru teknir út eftir ákvörðun eigandans.
3. **Söfnun.**
   - Ein ný mappa: `seo/matsedlar/<dagsetning>/json`, með JSON-skrá fyrir hvern stað.
   - Unnið í hópum, með ódýrara módeli (Sonnet) fyrir söfnunina sjálfa.
   - Sama heimildaröð og síðast: eigin vefur staðarins, pöntunarsíða eða PDF fyrst, Wolt aðeins ef ekkert annað finnst.
4. **Keyrsla.**
   - Keyra `node scripts/build-menu-data.mjs` með nýju möppunni, fyrst með `--dry`.
   - Ef allir staðir eru í nýju möppunni er aðeins hún notuð. Hver staður má bara vera í einni möppu.
   - Staðir sem eru ekki safnaðir aftur halda eldri dagsetningu og detta sjálfkrafa út úr tölunum á /pizzuverd. Þeir birtast þá undir „Eldri matseðlar“.
5. **Uppfæra `public/llms.txt`.** Dagsetningin og fjöldi staða eru skrifuð í höndunum og þarf að breyta þeim.
6. **Rýni.**
   - Sterkasta módelið rýnir óháð.
   - Það ber saman nokkur verð af handahófi við heimildina.
   - Það reiknar tölurnar á /pizzuverd sjálfstætt.
7. **PR.**
   - Ein PR. Lýsing á íslensku með helstu breytingum: hvaða verð hækkuðu eða lækkuðu, nýir staðir og lokaðir staðir.
   - Eigandinn skoðar preview og mergear.
   - Staðfest á pizzadeig.is eftir merge.

## Reglur sem gilda alltaf

- **Verð og réttir:** aldrei búin til eða áætluð. Allt kemur orðrétt úr heimildinni, með slóð og dagsetningu. Það sem finnst ekki er skráð sem „fannst ekki“.
- **Vefir sem loka á vélar:** lokinu er hlýtt. Engin fölsk vafraauðkenni (user agent).
- **Lyklar og forritaskil:** engin falin API og engir lyklar úr kóða síðna.
- **Lestur síðna:** síður eru lesnar í raunverulegum vafra (headless) til að fá orðréttan texta, ekki samantektir.
- **Engin áhrif á raunkerfi:** prófanir snerta aldrei Firestore eða raunnotendur. Ekki má keyra `npm run dev` gegn raunkerfinu.

## Áætlaður tími

- Söfnun og keyrsla: um hálfur til einn dagur af vinnu Claude.
- Eigandinn: 5 mínútur í undirbúning og 10–15 mínútur í að skoða preview.
