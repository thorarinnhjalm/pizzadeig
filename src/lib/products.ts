export interface Product {
  id: string;
  name_is: string;
  name_en: string;
  description_is: string;
  description_en: string;
  category: 'mjol' | 'tomatar' | 'tol' | 'ofnar' | 'ostur';
  category_is: string;
  category_en: string;
  price_range: string;
  affiliate_url: string;
  image_placeholder: string;
  rating: number;
  badge_is?: string;
  badge_en?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'caputo-00',
    name_is: 'Caputo Pizzeria 00 Mjöl',
    name_en: 'Caputo Pizzeria 00 Flour',
    description_is: 'Besta mjölið fyrir Napólítönskar pizzur. Hátt próteininnihald (12.5%) og fínt mölun gefa fullkomið, teygjanlegt deig.',
    description_en: 'The gold standard for Neapolitan pizza. High protein (12.5%) and fine milling create perfect, stretchy dough.',
    category: 'mjol',
    category_is: 'Mjöl',
    category_en: 'Flour',
    price_range: '1.890 - 2.490 kr',
    affiliate_url: '#',
    image_placeholder: '🌾',
    rating: 5,
    badge_is: 'Mælt með',
    badge_en: 'Recommended',
  },
  {
    id: 'san-marzano',
    name_is: 'San Marzano D.O.P. Tómatar',
    name_en: 'San Marzano D.O.P. Tomatoes',
    description_is: 'Óhristir San Marzano tómatar frá Vesúvíus hlíðunum. Einu sanna tómatarnir fyrir Napólítönska sósu.',
    description_en: 'Unshaken San Marzano tomatoes from the slopes of Vesuvius. The only true tomatoes for Neapolitan sauce.',
    category: 'tomatar',
    category_is: 'Tómatar & Sósur',
    category_en: 'Tomatoes & Sauce',
    price_range: '890 - 1.290 kr',
    affiliate_url: '#',
    image_placeholder: '🍅',
    rating: 5,
    badge_is: 'D.O.P.',
    badge_en: 'D.O.P.',
  },
  {
    id: 'ooni-koda',
    name_is: 'Ooni Koda 16 Pizzuofn',
    name_en: 'Ooni Koda 16 Pizza Oven',
    description_is: 'Gas-knúinn pizzuofn sem nær 500°C á 20 mínútum. Bakar pizzu á 60 sekúndum. Fullkominn fyrir garðinn.',
    description_en: 'Gas-powered pizza oven reaching 500°C in 20 minutes. Bakes a pizza in 60 seconds. Perfect for the garden.',
    category: 'ofnar',
    category_is: 'Ofnar',
    category_en: 'Ovens',
    price_range: '89.900 kr',
    affiliate_url: '#',
    image_placeholder: '🔥',
    rating: 5,
    badge_is: 'Vinsælast',
    badge_en: 'Most Popular',
  },
  {
    id: 'pizza-steel',
    name_is: 'Baking Steel pizzustáll',
    name_en: 'Baking Steel Pizza Steel',
    description_is: 'Stáll sem geymir hita miklu betur en pizzusteinn. Gefur krispara botn og betri bakásetningu í venjulegum ofni.',
    description_en: 'Steel that retains heat far better than pizza stone. Delivers crispier bottom and better oven spring in home ovens.',
    category: 'tol',
    category_is: 'Tól & Búnaður',
    category_en: 'Tools & Equipment',
    price_range: '14.900 kr',
    affiliate_url: '#',
    image_placeholder: '🫓',
    rating: 4,
  },
  {
    id: 'pizza-peel',
    name_is: 'Ólífuviðar pizzuskúffa',
    name_en: 'Olive Wood Pizza Peel',
    description_is: 'Handgerð pizzuskúffa úr ítölskum ólífuviði. Falleg og eðlileg rennifláka sem losar pizzu auðveldlega.',
    description_en: 'Handcrafted pizza peel from Italian olive wood. Beautiful and natural surface that releases pizza easily.',
    category: 'tol',
    category_is: 'Tól & Búnaður',
    category_en: 'Tools & Equipment',
    price_range: '6.990 kr',
    affiliate_url: '#',
    image_placeholder: '🍕',
    rating: 4,
  },
  {
    id: 'fior-di-latte',
    name_is: 'Fior di latte Mozzarella',
    name_en: 'Fior di latte Mozzarella',
    description_is: 'Ferskur ítalskt mozzarella úr kúamjólk. Bræðist jafnt og gefur fullkomna þráðu. Betra en ristin mozzarella.',
    description_en: 'Fresh Italian cow\'s milk mozzarella. Melts evenly and gives perfect pull. Superior to shredded mozzarella.',
    category: 'ostur',
    category_is: 'Ostur',
    category_en: 'Cheese',
    price_range: '990 - 1.490 kr',
    affiliate_url: '#',
    image_placeholder: '🧀',
    rating: 4,
  },
];
