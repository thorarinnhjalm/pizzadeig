import type { MenuItem, Restaurant } from '@/types/restaurant';

/**
 * Pure price statistics for /pizzuverd. Everything is computed from the menu data
 * (`mockMenuItems`, generated from seo/matsedlar) and `mockRestaurants`; nothing here is typed in by hand.
 *
 * Rules:
 * - Only items in the category 'Pizzur' count (Barnapizzur and Eftirréttapizzur are left out).
 * - The price is `price`, the standard/middle size of the menu (`price_large` is never used). Sizes
 *   differ between places; the size label of the item is carried along so it can be shown.
 * - A place counts only if it has at least one priced pizza.
 * - Margherita: name matches /margh?erit|margarit/ (case and diacritics ignored) on a Pizzur item;
 *   a place with several (e.g. "Margherita" and "Margherita Speciale") contributes its cheapest.
 */

export const PIZZA_CATEGORY = 'Pizzur';

// Capital area (höfuðborgarsvæðið), compared after normalising the city name. Every other town is "rest".
export const CAPITAL_AREA_CITIES = ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Garðabær', 'Mosfellsbær', 'Seltjarnarnes'];

const MARGHERITA_RE = /margh?erit|margarit/;

export type PriceRegion = 'capital' | 'rest';

export type StatsRestaurant = Pick<
  Restaurant,
  'id' | 'name' | 'slug' | 'city' | 'menu_source_url' | 'menu_source_label' | 'menu_verified_at' | 'menu_price_basis'
>;

export type StatsMenuItem = Pick<
  MenuItem,
  'id' | 'restaurant_id' | 'name_is' | 'name_en' | 'price' | 'size_small_label' | 'category' | 'sort_order'
>;

/** One pizza picked out of a menu (cheapest, most expensive or the Margherita). */
export interface PizzaPick {
  name_is: string;
  name_en: string;
  price: number;
  sizeLabel?: string;
}

export interface RestaurantPriceRow {
  restaurant: StatsRestaurant;
  region: PriceRegion;
  pizzaCount: number;
  cheapest: PizzaPick;
  priciest: PizzaPick;
  median: number;
  margherita: PizzaPick | null;
}

export interface GroupStats {
  places: number;
  pizzas: number;
  margheritaPlaces: number;
  margheritaMedian: number | null;
  pizzaMedian: number | null;
}

export interface RankedMargherita {
  restaurant: StatsRestaurant;
  pick: PizzaPick;
}

export interface PriceStats {
  /** Latest `menu_verified_at` among the places counted (ISO date). */
  dataDate: string | null;
  /** Places with their menu recorded by Pizzadeig.is (menu_price_basis 'owner_supplied') and the date of each. */
  ownerSupplied: { restaurant: StatsRestaurant; date: string }[];
  /** Places counted, sorted by town then name. */
  rows: RestaurantPriceRow[];
  /** Places with no pizza prices (no menu online), sorted by name. */
  withoutMenu: StatsRestaurant[];
  placesCounted: number;
  pizzasCounted: number;
  pizzaMedian: number | null;
  margheritaPlaces: number;
  margheritaMedian: number | null;
  /** All Margheritas, cheapest first (ties by name). */
  margheritaRanked: RankedMargherita[];
  cheapestMargherita: RankedMargherita | null;
  priciestMargherita: RankedMargherita | null;
  cheapestPizza: RankedMargherita | null;
  priciestPizza: RankedMargherita | null;
  capital: GroupStats;
  rest: GroupStats;
  /** Places whose prices all come from a delivery platform (Wolt). */
  platformPlaces: StatsRestaurant[];
  /** Places whose prices come partly from a delivery platform. */
  mixedPlaces: StatsRestaurant[];
}

/** Lower-case and strip diacritics, so 'Reykjavík' === 'reykjavik' and 'Margaríta' matches 'margarit'. */
export function normalizeText(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/** Median; with an even count the mean of the two middle values, rounded to a whole krona. Null for no values. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function isCapitalArea(city: string): boolean {
  const c = normalizeText(city.trim());
  return CAPITAL_AREA_CITIES.some((x) => normalizeText(x) === c);
}

export function regionOf(city: string): PriceRegion {
  return isCapitalArea(city) ? 'capital' : 'rest';
}

export function isMargherita(item: Pick<MenuItem, 'name_is' | 'name_en' | 'category'>): boolean {
  if (item.category !== PIZZA_CATEGORY) return false;
  return MARGHERITA_RE.test(normalizeText(item.name_is)) || MARGHERITA_RE.test(normalizeText(item.name_en || ''));
}

function pick(item: StatsMenuItem): PizzaPick {
  return {
    name_is: item.name_is,
    name_en: item.name_en || item.name_is,
    price: item.price,
    ...(item.size_small_label ? { sizeLabel: item.size_small_label } : {}),
  };
}

function byPriceThenOrder(a: StatsMenuItem, b: StatsMenuItem): number {
  return a.price - b.price || a.sort_order - b.sort_order || a.name_is.localeCompare(b.name_is, 'is');
}

const compareText = (a: string, b: string) => a.localeCompare(b, 'is');

function groupStats(rows: RestaurantPriceRow[], pricesByRestaurant: Map<string, number[]>): GroupStats {
  const margheritas = rows.flatMap((r) => (r.margherita ? [r.margherita.price] : []));
  const allPrices = rows.flatMap((r) => pricesByRestaurant.get(r.restaurant.id) ?? []);
  return {
    places: rows.length,
    pizzas: allPrices.length,
    margheritaPlaces: margheritas.length,
    margheritaMedian: median(margheritas),
    pizzaMedian: median(allPrices),
  };
}

export function computePriceStats(restaurants: StatsRestaurant[], menuItems: StatsMenuItem[]): PriceStats {
  const pizzasByRestaurant = new Map<string, StatsMenuItem[]>();
  for (const item of menuItems) {
    if (item.category !== PIZZA_CATEGORY || !(item.price > 0)) continue;
    const list = pizzasByRestaurant.get(item.restaurant_id);
    if (list) list.push(item);
    else pizzasByRestaurant.set(item.restaurant_id, [item]);
  }

  const rows: RestaurantPriceRow[] = [];
  const withoutMenu: StatsRestaurant[] = [];
  const pricesByRestaurant = new Map<string, number[]>();

  for (const restaurant of restaurants) {
    const pizzas = pizzasByRestaurant.get(restaurant.id);
    if (!pizzas || pizzas.length === 0) {
      withoutMenu.push(restaurant);
      continue;
    }
    const sorted = [...pizzas].sort(byPriceThenOrder);
    const margheritas = sorted.filter(isMargherita);
    const prices = sorted.map((p) => p.price);
    pricesByRestaurant.set(restaurant.id, prices);
    rows.push({
      restaurant,
      region: regionOf(restaurant.city),
      pizzaCount: sorted.length,
      cheapest: pick(sorted[0]),
      priciest: pick(sorted[sorted.length - 1]),
      median: median(prices) as number,
      margherita: margheritas.length > 0 ? pick(margheritas[0]) : null,
    });
  }

  rows.sort((a, b) => compareText(a.restaurant.city, b.restaurant.city) || compareText(a.restaurant.name, b.restaurant.name));
  withoutMenu.sort((a, b) => compareText(a.name, b.name));

  const dates = rows.flatMap((r) => (r.restaurant.menu_verified_at ? [r.restaurant.menu_verified_at] : []));
  const dataDate = dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : null;

  const margheritaRanked: RankedMargherita[] = rows
    .flatMap((r) => (r.margherita ? [{ restaurant: r.restaurant, pick: r.margherita }] : []))
    .sort((a, b) => a.pick.price - b.pick.price || compareText(a.restaurant.name, b.restaurant.name));

  // Cheapest / most expensive single pizza on any counted menu (rows already hold each place's extremes).
  const extremes = (key: 'cheapest' | 'priciest'): RankedMargherita[] =>
    rows.map((r) => ({ restaurant: r.restaurant, pick: r[key] }));
  const cheapestPizza = [...extremes('cheapest')].sort((a, b) => a.pick.price - b.pick.price || compareText(a.restaurant.name, b.restaurant.name))[0] ?? null;
  const priciestPizza = [...extremes('priciest')].sort((a, b) => b.pick.price - a.pick.price || compareText(a.restaurant.name, b.restaurant.name))[0] ?? null;

  const allPrices = rows.flatMap((r) => pricesByRestaurant.get(r.restaurant.id) ?? []);

  return {
    dataDate,
    ownerSupplied: rows
      .filter((r) => r.restaurant.menu_price_basis === 'owner_supplied' && r.restaurant.menu_verified_at)
      .map((r) => ({ restaurant: r.restaurant, date: r.restaurant.menu_verified_at as string })),
    rows,
    withoutMenu,
    placesCounted: rows.length,
    pizzasCounted: allPrices.length,
    pizzaMedian: median(allPrices),
    margheritaPlaces: margheritaRanked.length,
    margheritaMedian: median(margheritaRanked.map((m) => m.pick.price)),
    margheritaRanked,
    cheapestMargherita: margheritaRanked[0] ?? null,
    priciestMargherita: margheritaRanked.length > 0
      ? [...margheritaRanked].sort((a, b) => b.pick.price - a.pick.price || compareText(a.restaurant.name, b.restaurant.name))[0]
      : null,
    cheapestPizza,
    priciestPizza,
    capital: groupStats(rows.filter((r) => r.region === 'capital'), pricesByRestaurant),
    rest: groupStats(rows.filter((r) => r.region === 'rest'), pricesByRestaurant),
    platformPlaces: rows.filter((r) => r.restaurant.menu_price_basis === 'delivery_platform').map((r) => r.restaurant),
    mixedPlaces: rows.filter((r) => r.restaurant.menu_price_basis === 'mixed').map((r) => r.restaurant),
  };
}
