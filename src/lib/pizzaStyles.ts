export interface PizzaStyle {
  id: string;
  name_is: string;
  name_en: string;
  subtitle_is: string;
  subtitle_en: string;
  origin_is: string;
  origin_en: string;
  description_is: string;
  description_en: string;
  characteristics_is: string[];
  characteristics_en: string[];
  temp: string;
  bakeTime: string;
  bakeTime_en: string;
  hydration: string;
  emoji: string;
  gradient: string;
  image_url?: string;
  // CSS object-position for the photo crop (default centre)
  image_position?: string;
  image_alt_is?: string;
  image_alt_en?: string;
  // Slug of a recipe in recipeData.ts that makes this style, if there is one
  recipe_slug?: string;
}

export const PIZZA_STYLES: PizzaStyle[] = [
  {
    id: 'neapolitan',
    name_is: 'Napólítönsk',
    name_en: 'Neapolitan',
    subtitle_is: 'Klassísk frá Napólí',
    subtitle_en: 'Classic from Naples',
    origin_is: 'Napólí á Ítalíu',
    origin_en: 'Naples, Italy',
    description_is: 'Klassíska pizzan frá Napólí. Deigið er mjúkt og teygjanlegt með uppblásnum kanti (cornicione) með brenndum blettum, og pizzan bakast í viðarofni við um 430–485°C á 60–90 sekúndum. Áleggið er einfalt: San Marzano-tómatar, fior di latte eða mozzarella di bufala, fersk basilíka og ólífuolía.',
    description_en: 'The classic pizza from Naples. Soft, stretchy dough with a puffy, leopard-spotted rim (cornicione), baked in a wood-fired oven at about 430–485°C for 60–90 seconds. The toppings are simple: San Marzano tomatoes, fior di latte or buffalo mozzarella, fresh basil and olive oil.',
    characteristics_is: ['Mjúkt og teygjanlegt deig', 'Uppblásinn kantur (cornicione) með brenndum blettum', 'Hefun í 12–24 klst samkvæmt reglum AVPN', 'Fá álegg en í hæsta gæðaflokki'],
    characteristics_en: ['Soft, stretchy dough', 'Puffy, leopard-spotted rim (cornicione)', '12–24 hr fermentation under AVPN rules', 'Few toppings, top quality'],
    temp: '430-485°C',
    bakeTime: '60-90 sek',
    bakeTime_en: '60-90 sec',
    hydration: '56-63%',
    emoji: '🇮🇹',
    gradient: 'from-red-900 to-orange-800',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200',
    image_alt_is: 'Napólítönsk pizza með brenndum kanti',
    image_alt_en: 'Neapolitan pizza with a charred rim',
    recipe_slug: 'sannkallad-napoli-deig',
  },
  {
    id: 'newyork',
    name_is: 'New York',
    name_en: 'New York',
    subtitle_is: 'Stór, þunn og samanbrjótanleg',
    subtitle_en: 'Big, thin and foldable',
    origin_is: 'New York í Bandaríkjunum',
    origin_en: 'New York, USA',
    description_is: 'Stór og þunn pizza, oft 18 tommur (um 45 cm), skorin í breiðar sneiðar sem hægt er að brjóta saman í miðjunni. Botninn er stökkur að neðan en mjúkur að ofan. Bökuð á steini í gasofni við um 300°C í 6–10 mínútur, með rifnum, þurrum mozzarella (low-moisture) og tómatsósu.',
    description_en: 'A large, thin pizza, often 18 inches (about 45 cm), cut into wide slices you can fold down the middle. The base is crisp underneath and soft on top. Baked on a stone deck in a gas oven at about 300°C for 6–10 minutes, with grated low-moisture mozzarella and tomato sauce.',
    characteristics_is: ['Stór pizza, oft 18"', 'Sneiðar sem má brjóta saman', 'Olía og smá sykur í deiginu', 'Gasofn með steinbotni, um 300°C'],
    characteristics_en: ['Large pie, often 18"', 'Foldable slices', 'Oil and a little sugar in the dough', 'Gas deck oven, about 300°C'],
    temp: '~300°C',
    bakeTime: '6-10 mín',
    bakeTime_en: '6-10 min',
    hydration: '60-65%',
    emoji: '🗽',
    gradient: 'from-blue-900 to-slate-800',
    image_url: 'https://images.unsplash.com/photo-1707274244494-adf0852ade21?q=80&w=1200',
    image_alt_is: 'Sneið af New York-pizzu',
    image_alt_en: 'A New York pizza slice',
    image_position: '50% 30%',
    recipe_slug: 'new-york-deig',
  },
  {
    id: 'detroit',
    name_is: 'Detroit',
    name_en: 'Detroit',
    subtitle_is: 'Þykk, ostrík og stökk',
    subtitle_en: 'Thick, cheesy and crispy',
    origin_is: 'Detroit í Bandaríkjunum',
    origin_en: 'Detroit, USA',
    description_is: 'Rétthyrnd pönnupizza, bökuð í djúpum stálbökkum sem sagan segir að hafi komið úr bílaiðnaði borgarinnar. Osturinn (hefðbundinn brick-ostur eða mozzarella) nær alveg út að brúnum, bráðnar niður með hliðunum og myndar stökka, karamellaða ostarönd. Tómatsósan er sett ofan á ostinn í röndum.',
    description_en: 'A rectangular pan pizza, baked in deep steel pans that, as the story goes, came from the city’s car industry. The cheese, traditionally Wisconsin brick cheese or mozzarella, runs all the way to the edges, melts down the sides and forms a crispy, caramelised cheese crust. The tomato sauce goes on top of the cheese in stripes.',
    characteristics_is: ['Rétthyrnt stálmót', 'Stökk, karamelluð ostarönd', 'Sósa í röndum ofan á ostinum', 'Þykkt og loftkennt deig'],
    characteristics_en: ['Rectangular steel pan', 'Crispy, caramelised cheese edge', 'Sauce in stripes on top of the cheese', 'Thick, airy dough'],
    temp: '~260°C',
    bakeTime: '12-15 mín',
    bakeTime_en: '12-15 min',
    hydration: '70-75%',
    emoji: '🏭',
    gradient: 'from-amber-900 to-yellow-800',
    image_url: 'https://images.unsplash.com/photo-1671572579795-385f4b96bcd8?q=80&w=1200',
    image_alt_is: 'Detroit-pönnupizza með stökkri ostarönd',
    image_alt_en: 'Detroit pan pizza with a crispy cheese edge',
    recipe_slug: 'detroit-deig',
  },
  {
    id: 'roman',
    name_is: 'Rómversk (al taglio)',
    name_en: 'Roman (al taglio)',
    subtitle_is: 'Skorin með skærum, seld eftir vigt',
    subtitle_en: 'Cut with scissors, sold by weight',
    origin_is: 'Róm á Ítalíu',
    origin_en: 'Rome, Italy',
    description_is: 'Pizza al taglio er bökuð í stórum, rétthyrndum ofnplötum, skorin í bita með skærum og seld eftir vigt. Mjög hátt vatnshlutfall (75–85%) og löng hefun gefa léttan og loftmikinn botn með stórum loftbólum, stökkan að neðan. Algengur götubiti í Róm.',
    description_en: 'Pizza al taglio is baked in large rectangular trays, cut into pieces with scissors and sold by weight. Very high hydration (75–85%) and long fermentation give a light, open crumb with a crisp base. A common street food in Rome.',
    characteristics_is: ['Léttur og loftmikill botn', '75–85% vatnshlutfall', 'Skorin með skærum, seld eftir vigt', 'Löng hefun (24–72 klst)'],
    characteristics_en: ['Light, open crumb', '75–85% hydration', 'Cut with scissors, sold by weight', 'Long fermentation (24–72 hrs)'],
    temp: '250-280°C',
    bakeTime: '12-18 mín',
    bakeTime_en: '12-18 min',
    hydration: '75-85%',
    emoji: '🏛️',
    gradient: 'from-emerald-900 to-teal-800',
    image_url: 'https://images.unsplash.com/photo-1646851035330-f35fa5b44beb?q=80&w=1200',
    image_alt_is: 'Rómversk pizza al taglio á bakka',
    image_alt_en: 'Roman pizza al taglio on a tray',
  },
];
