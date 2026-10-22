# Matseðlar og heimildaskrá

Matseðlar pizzastaða á pizzadeig.is með heimild og dagsetningu fyrir hvern rétt. Hver söfnun á sína möppu: `<dagsetning>/json` (ein JSON-skrá á stað), `heimildaskra.csv` (UTF-8 með BOM, aðskilin með `;` svo íslenskt Excel opni hana rétt) og `thydingar.json` (þýddar lýsingar til yfirlestrar).
Söfnun 22. okt 2026: fyrst eigin vefur, pöntunarsíða eða PDF-matseðill staðarins, síðan Wolt þar sem enginn eigin matseðill fannst. Verð eru nákvæmlega eins og heimildin sýndi þann dag, aldrei áætluð; verð af Wolt geta verið hærri en á staðnum (`verd_grunnur`).
Pizza 67 og Stykkið eiga engan matseðil á netinu. Pizzafjörður: matseðill skráður af eiganda 8. júlí 2026 (`owner_supplied`, id fest í JSON), ekki yfirskrifaður með vefgögnum; brauðin pf-b1 til pf-b3 voru viljandi felld niður (aðeins pizzur, eins og á Ask).
Ný söfnun: settu JSON-skrár í `seo/matsedlar/<ný dagsetning>/json` og keyrðu `node scripts/build-menu-data.mjs seo/matsedlar/<ný dagsetning>/json` (`--dry` sýnir aðeins skýrslu; fyrsta keyrsla þarf `--prev <gamlir réttir>`).
Skriptan endurskrifar `src/lib/menuData.ts`, `menu_*` reitina í `mockData.ts` og CSV-skrána, heldur id sömu pizzu (umsagnir hanga á þeim; sjá `ID_OVERRIDES`) og skráir fallin id í `retired-ids.json` (aldrei endurnotuð). Hún stoppar ef þýðingu vantar (`scripts/menu-translations.mjs`) eða id rekast á.
Birting: eftir merge keyrir eigandi „Uppfæra matseðla“ í admin (Kerfi), ekki Seed.
