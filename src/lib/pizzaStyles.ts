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
  hydration: string;
  emoji: string;
  gradient: string;
  image_url?: string;
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
    origin_is: 'Napólí, Ítalíu',
    origin_en: 'Naples, Italy',
    description_is: 'Upprunalega pizzan frá Napólí. Mjúkt og teygjanlegt deig með uppblásnum, flekkóttum kanti (cornicione) sem bakast í viðarofni við 430–480°C á 60–90 sekúndum. Áleggið er einfalt: San Marzano-tómatar, fior di latte eða mozzarella di bufala, fersk basilíka og ólífuolía.',
    description_en: 'The original pizza from Naples. Soft, stretchy dough with a puffy, leopard-spotted rim (cornicione), baked in a wood-fired oven at 430–480°C for 60–90 seconds. The toppings are simple: San Marzano tomatoes, fior di latte or buffalo mozzarella, fresh basil and olive oil.',
    characteristics_is: ['Mjúkt og teygjanlegt deig', 'Uppblásinn, flekkóttur kantur (cornicione)', 'Löng hefun (8–72 klst)', 'Fá álegg en í hæsta gæðaflokki'],
    characteristics_en: ['Soft, stretchy dough', 'Puffy, leopard-spotted rim (cornicione)', 'Long fermentation (8–72 hrs)', 'Few toppings, top quality'],
    temp: '430-480°C',
    bakeTime: '60-90 sek',
    hydration: '58-65%',
    emoji: '🇮🇹',
    gradient: 'from-red-900 to-orange-800',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200',
    recipe_slug: 'sannkallad-napoli-deig',
  },
  {
    id: 'newyork',
    name_is: 'New York',
    name_en: 'New York',
    subtitle_is: 'Stór, þunn og samanbrjótanleg',
    subtitle_en: 'Big, thin and foldable',
    origin_is: 'New York, Bandaríkjunum',
    origin_en: 'New York, USA',
    description_is: 'Stór og þunn pizza, oft 18 tommur, skorin í breiðar sneiðar sem hægt er að brjóta saman í miðjunni. Botninn er stökkur að neðan en mjúkur að ofan. Bökuð á steini í gasofni við um 300°C í 6–10 mínútur, með rifnum mozzarella og tómatsósu.',
    description_en: 'A large, thin pizza, often 18 inches, cut into wide slices you can fold down the middle. The base is crisp underneath and soft on top. Baked on a stone deck in a gas oven at about 300°C for 6–10 minutes, with grated low-moisture mozzarella and tomato sauce.',
    characteristics_is: ['Stór pizza, oft 18"', 'Sneiðar sem má brjóta saman', 'Olía og smá sykur í deiginu', 'Gasofn með steinbotni, um 300°C'],
    characteristics_en: ['Large pie, often 18"', 'Foldable slices', 'Oil and a little sugar in the dough', 'Gas deck oven, about 300°C'],
    temp: '~300°C',
    bakeTime: '6-10 mín',
    hydration: '60-65%',
    emoji: '🗽',
    gradient: 'from-blue-900 to-slate-800',
    image_url: 'https://images.unsplash.com/photo-1707274244494-adf0852ade21?q=80&w=1200',
    recipe_slug: 'new-york-deig',
  },
  {
    id: 'detroit',
    name_is: 'Detroit',
    name_en: 'Detroit',
    subtitle_is: 'Þykk, ostrík og stökk',
    subtitle_en: 'Thick, cheesy and crispy',
    origin_is: 'Detroit, Bandaríkjunum',
    origin_en: 'Detroit, USA',
    description_is: 'Rétthyrnd pönnupizza, bökuð í stálmótum sem upphaflega voru notuð undir smáhluti í bílaverksmiðjum borgarinnar. Osturinn nær alveg út að brúnum og bráðnar í stökka, karamellaða ostarönd. Tómatsósan er sett ofan á ostinn í röndum.',
    description_en: 'A rectangular pan pizza, baked in steel pans originally used for small parts in the city’s car factories. The cheese runs all the way to the edges and melts into a crispy, caramelised cheese crust. The tomato sauce goes on top of the cheese in stripes.',
    characteristics_is: ['Rétthyrnt stálmót', 'Stökk, karamelluð ostarönd', 'Sósa í röndum ofan á ostinum', 'Þykkt og loftkennt deig'],
    characteristics_en: ['Rectangular steel pan', 'Crispy, caramelised cheese edge', 'Sauce in stripes on top of the cheese', 'Thick, airy dough'],
    temp: '~260°C',
    bakeTime: '12-15 mín',
    hydration: '70-75%',
    emoji: '🏭',
    gradient: 'from-amber-900 to-yellow-800',
    image_url: 'https://images.unsplash.com/photo-1671572579795-385f4b96bcd8?q=80&w=1200',
    recipe_slug: 'detroit-deig',
  },
  {
    id: 'roman',
    name_is: 'Rómversk (al taglio)',
    name_en: 'Roman (al taglio)',
    subtitle_is: 'Skorin með skærum, seld eftir vigt',
    subtitle_en: 'Cut with scissors, sold by weight',
    origin_is: 'Róm, Ítalíu',
    origin_en: 'Rome, Italy',
    description_is: 'Pizza al taglio er bökuð í stórum, rétthyrndum ofnplötum, skorin í bita með skærum og seld eftir vigt. Mjög hátt vatnshlutfall (75–85%) og löng hefun gefa létt og opið deig með stökkum botni. Algengur götubiti í Róm.',
    description_en: 'Pizza al taglio is baked in large rectangular trays, cut into pieces with scissors and sold by weight. Very high hydration (75–85%) and long fermentation give a light, open crumb with a crisp base. A common street food in Rome.',
    characteristics_is: ['Létt og opið deig', '75–85% vatnshlutfall', 'Skorin með skærum, seld eftir vigt', 'Löng hefun (24–72 klst)'],
    characteristics_en: ['Light, open crumb', '75–85% hydration', 'Cut with scissors, sold by weight', 'Long fermentation (24–72 hrs)'],
    temp: '250-280°C',
    bakeTime: '12-18 mín',
    hydration: '75-85%',
    emoji: '🏛️',
    gradient: 'from-emerald-900 to-teal-800',
    image_url: 'https://images.unsplash.com/photo-1646851035330-f35fa5b44beb?q=80&w=1200',
  },
];
