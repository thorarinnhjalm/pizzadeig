export const KRONAN_SKUS: Record<string, string> = {
  // Mapping from ShoppingItem id to Krónan SKU
  flour: '100262103',       // Caputo hveiti pizzamjöl blátt
  water: '',                // Skip water
  yeast: '100000854',       // Auðhumla pressuger (ferskt ger)
  adY: '100251105',         // Til hamingju þurrger
  idy: '100251105',         // Til hamingju þurrger
  salt: '100244747',        // Gimsøy sjávarsalt gróft
  oil: '100267326',         // Monini ólífuolía extra virgin 500ml
  // Optional toppings for recipes:
  tomatoes: '100241924',    // Mutti san marzano heilir
  mozzarella: '100002122',  // KS fersk mozzarella kúla
  pepperoni: '100000003',   // Stjörnugrís pepperoni álegg
  sveppir: '100270505',     // Flúðasveppir (hvítir) 250g
  laukur: '01600010',       // Rauðlaukur
  paprika: '01600062',      // Paprika rauð
  parmaskinka: '100236305', // Citterio tagliofresco parmaskinka D.O.P
  skinka: '100000858',      // SS skinka vélskorin
  ananas: '100241852',      // Dole ananas bitar í safa
  parmesan: '100222474',    // Ambrosi parmigiano reggiano
  rjomi: '100001202',       // MS rjómi 36%
  ricotta: '100253509',     // Ambrosi ricotta
  oregano: '04207213',      // Pottagaldrar oreganó
};

export function getKronanSku(ingredientId: string): string | null {
  // Some ingredients might be prefixes, but usually exact.
  return KRONAN_SKUS[ingredientId.toLowerCase()] || null;
}

export function matchIngredientToKronan(name: string): string | null {
  const n = name.toLowerCase();
  
  if (n.includes('hveiti') || n.includes('flour') || n.includes('mjöl') || n.includes('caputo')) return KRONAN_SKUS.flour;
  if (n.includes('vatn') || n.includes('water')) return null; // Við kaupum ekki vatn :)
  if (n.includes('ferskt ger') || n.includes('pressuger')) return KRONAN_SKUS.yeast;
  if (n.includes('þurrger') || n.includes('ger') || n.includes('yeast')) return KRONAN_SKUS.idy;
  if (n.includes('salt')) return KRONAN_SKUS.salt;
  if (n.includes('olía') || n.includes('olífuolía') || n.includes('oil')) return KRONAN_SKUS.oil;
  
  // Basar/Sósur
  if (n.includes('tómat') || n.includes('tomato') || n.includes('mutti') || n.includes('marzano')) return KRONAN_SKUS.tomatoes;
  
  // Ostar
  if (n.includes('mozzarella')) return KRONAN_SKUS.mozzarella;
  if (n.includes('parmesan') || n.includes('parmigiano')) return KRONAN_SKUS.parmesan;
  if (n.includes('ricotta')) return KRONAN_SKUS.ricotta;
  if (n.includes('rjómi') || n.includes('cream')) return KRONAN_SKUS.rjomi;
  if (n.includes('ostur') || n.includes('cheese')) return KRONAN_SKUS.mozzarella; // Default ostur
  
  // Álegg
  if (n.includes('pepperoni')) return KRONAN_SKUS.pepperoni;
  if (n.includes('sveppir') || n.includes('mushroom')) return KRONAN_SKUS.sveppir;
  if (n.includes('laukur') || n.includes('onion')) return KRONAN_SKUS.laukur;
  if (n.includes('paprika') || n.includes('bell pepper')) return KRONAN_SKUS.paprika;
  if (n.includes('hráskinka') || n.includes('parmaskinka') || n.includes('prosciutto')) return KRONAN_SKUS.parmaskinka;
  if (n.includes('skinka') || n.includes('ham')) return KRONAN_SKUS.skinka;
  if (n.includes('ananas') || n.includes('pineapple')) return KRONAN_SKUS.ananas;
  if (n.includes('oregano') || n.includes('óreganó')) return KRONAN_SKUS.oregano;
  
  return null;
}
