# Matseðlar og heimildaskrá

Hér eru matseðlar pizzastaða á pizzadeig.is með heimild og dagsetningu fyrir hvern rétt. Hver söfnun á sína möppu: `<dagsetning>/json` (ein staðfest JSON-skrá á stað), `heimildaskra.csv` (opnast í Excel: staður, réttur, verð, heimild, dagsetning) og `thydingar.json` (þýddar lýsingar til yfirlestrar).
Söfnun 22. okt 2026: fyrst eigin vefur, pöntunarsíða eða PDF-matseðill staðarins, síðan pöntunarvettvangar (Wolt) þar sem enginn eigin matseðill fannst. Verð eru nákvæmlega eins og heimildin sýndi þann dag, aldrei áætluð.
Verð af pöntunarvettvangi geta verið hærri en á staðnum og eru merkt í dálknum `verd_grunnur`. Pizza 67, Stykkið og Pizzafjörður eiga engan matseðil á netinu (sjá athugasemd í CSV).
Ný söfnun: settu nýjar JSON-skrár í `seo/matsedlar/<ný dagsetning>/json` og keyrðu
`node scripts/build-menu-data.mjs seo/matsedlar/<ný dagsetning>/json`
(`--dry` sýnir aðeins skýrslu). Skriptan endurskrifar `src/lib/menuData.ts`, `menu_*` reitina í `mockData.ts` og CSV-skrána.
Id sömu pizzu haldast óbreytt (umsagnir hanga á þeim); föll id fara í `retired-ids.json` og eru aldrei endurnotuð. Vanti þýðingu stoppar skriptan: bættu setningunni við í `scripts/menu-translations.mjs`.
Eftir merge þarf að keyra admin seed svo lifandi síðan (Firestore) uppfærist.
