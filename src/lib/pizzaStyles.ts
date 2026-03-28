export interface PizzaStyle {
  id: string;
  name_is: string;
  name_en: string;
  subtitle_is: string;
  subtitle_en: string;
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
}

export const PIZZA_STYLES: PizzaStyle[] = [
  {
    id: 'neapolitan',
    name_is: 'Napólítönsk',
    name_en: 'Neapolitan',
    subtitle_is: 'Klassísk frá Napólí',
    subtitle_en: 'Classic from Naples',
    description_is: 'Upprunalega pizzan. Mjúkt, svampkenndt deig með brenndum blettum (leopard spots). Bökuð í viðarofni við 450°C+ á innan við 90 sekúndum. Einföld en fullkomin: San Marzano tómatar, mozzarella di bufala, ferskt basil, og ólífuolía.',
    description_en: 'The original pizza. Soft, pillowy dough with charred leopard spots. Baked in a wood-fired oven at 450°C+ in under 90 seconds. Simple yet perfect: San Marzano tomatoes, buffalo mozzarella, fresh basil, and olive oil.',
    characteristics_is: ['Mjúkt, svampkennt deig', 'Hár hefunartími (24-72 klst)', 'Cornicione — uppblásinn kantur', 'Mjög fá álegg, hámarksgæði'],
    characteristics_en: ['Soft, pillowy dough', 'Long fermentation (24-72 hrs)', 'Puffy cornicione rim', 'Few toppings, maximum quality'],
    temp: '450°C+',
    bakeTime: '60-90 sek',
    hydration: '58-65%',
    emoji: '🇮🇹',
    gradient: 'from-red-900 to-orange-800',
  },
  {
    id: 'newyork',
    name_is: 'New York',
    name_en: 'New York',
    subtitle_is: 'Stór, breiðfell, og beygjanleg',
    subtitle_en: 'Big, foldable, and iconic',
    description_is: 'Stór, þunn og breiðfell sneið sem hægt er að beygja. Spraugt deig með krökkulegri yfirborðsáferð. Bökuð í gasofni við ~300°C á 12-15 mínútum. Ríkulega þakin osti og rauðri sósu.',
    description_en: 'Large, thin, foldable slices with a signature crunch. Baked in gas deck ovens at ~300°C for 12-15 minutes. Generously topped with grated low-moisture mozzarella and tangy tomato sauce.',
    characteristics_is: ['Stór 18" sneið', 'Beygjanlegt og spraugt', 'Olía/sykur í deigi', 'Gasofn ~300°C'],
    characteristics_en: ['Large 18" slices', 'Foldable and crispy', 'Oil/sugar in dough', 'Gas deck oven ~300°C'],
    temp: '~300°C',
    bakeTime: '12-15 mín',
    hydration: '62-66%',
    emoji: '🗽',
    gradient: 'from-blue-900 to-slate-800',
  },
  {
    id: 'detroit',
    name_is: 'Detroit',
    name_en: 'Detroit',
    subtitle_is: 'Þykk, samlokkennd, og krispy',
    subtitle_en: 'Thick, cheesy, and crispy',
    description_is: 'Bökuð í rétthyrndum stálmóti (blue steel pan) sem gefur henni þá einstöku crispy ostarönd. Osturinn fer alla leið að brúnunum og karamellerast á hliðunum. Sósan fer OFAN Á ostinn í röndum.',
    description_en: 'Baked in rectangular blue steel pans that create the signature crispy cheese crust edge. Cheese goes all the way to the sides and caramelizes. Sauce goes ON TOP of the cheese in racing stripes.',
    characteristics_is: ['Rétthyrnt stálmót', 'Crispy ostarönd', 'Sósa ofan á ost', 'Þykkt, loftkennt deig'],
    characteristics_en: ['Rectangular steel pan', 'Crispy cheese edge', 'Sauce on top of cheese', 'Thick, airy dough'],
    temp: '~250°C',
    bakeTime: '12-15 mín',
    hydration: '70-75%',
    emoji: '🏭',
    gradient: 'from-amber-900 to-yellow-800',
  },
  {
    id: 'roman',
    name_is: 'Rómversk (al taglio)',
    name_en: 'Roman (al taglio)',
    subtitle_is: 'Skorin í sneiðar, seld á þyngd',
    subtitle_en: 'Cut with scissors, sold by weight',
    description_is: 'Pizza al taglio — skorin með skærum og seld á þyngd. Mjög mikil vatnshlutfall (80%+) gefur henni loftkennt, opið deig. Langur hefunartími (48-72 klst) skapar flókna bragðefni. Bökuð í rétthyrndum mótum á ~300°C.',
    description_en: 'Pizza al taglio — cut with scissors and sold by weight. Very high hydration (80%+) creates an airy, open crumb. Long fermentation (48-72 hrs) develops complex flavors. Baked in rectangular pans at ~300°C.',
    characteristics_is: ['Mjög loftkennt deig', '80%+ vatnshlutfall', 'Skorin með skærum', '48-72 klst hefun'],
    characteristics_en: ['Very airy crumb', '80%+ hydration', 'Cut with scissors', '48-72 hr fermentation'],
    temp: '~300°C',
    bakeTime: '8-12 mín',
    hydration: '80%+',
    emoji: '🏛️',
    gradient: 'from-emerald-900 to-teal-800',
  },
];
