import { Recipe } from '@/types/recipe';
import { Restaurant, MenuItem } from '@/types/restaurant';

// Live host is www (non-www 307-redirects there) — every canonical/hreflang/JSON-LD
// URL must use it, otherwise Google splits signals across both hosts.
export const SITE_URL = 'https://www.pizzadeig.is';

// For <script type="application/ld+json"> via dangerouslySetInnerHTML: escapes `<`
// so user-written Firestore content (recipe titles, steps) can't break out of the
// script tag and inject markup (stored XSS).
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function localeAlternates(locale: string, path: string = '') {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      is: `${SITE_URL}/is${path}`,
      en: `${SITE_URL}/en${path}`,
      'x-default': `${SITE_URL}/is${path}`,
    },
  };
}

export function recipeJsonLd(recipe: Recipe, locale: string) {
  const baseUrl = `${SITE_URL}/${locale}/uppskriftir/${recipe.slug || ''}`;
  const defaultImage = `${SITE_URL}/images/dough-frontpage.jpg`;
  const images = (recipe.image_urls && recipe.image_urls.length > 0) ? recipe.image_urls : [defaultImage];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: locale === 'is' ? recipe.title_is : recipe.title_en,
    description: locale === 'is' ? recipe.description_is : recipe.description_en,
    image: images,
    author: { '@type': 'Person', name: recipe.author_name || 'Pizzadeig.is' },
    prepTime: `PT${recipe.prep_time_min || 0}M`,
    cookTime: `PT${recipe.cook_time_min || 0}M`,
    totalTime: `PT${(recipe.prep_time_min || 0) + (recipe.cook_time_min || 0) + (recipe.rest_time_min || 0)}M`,
    recipeYield: `${recipe.servings || 1}`,
    recipeCategory: recipe.type || 'Pizza',
    recipeCuisine: 'Italian',
    keywords: recipe.tags?.length > 0 ? recipe.tags.join(', ') : 'pizza, uppskrift, deig, pizzadeig',
    ...(recipe.video_url ? { video: recipe.video_url } : {}),
    // Only markup with real data — fabricated ratings/nutrition risk a rich-result penalty
    ...(recipe.rating_avg && recipe.rating_count && recipe.rating_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating_avg,
            ratingCount: recipe.rating_count,
          },
        }
      : {}),
    recipeIngredient: (locale === 'is' ? recipe.ingredients_is : recipe.ingredients_en)?.map(
      i => `${i.amount || ''} ${i.unit || ''} ${i.name || ''}`.trim()
    ) || [],
    recipeInstructions: (locale === 'is' ? recipe.steps_is : recipe.steps_en)?.map((step, i) => ({
      '@type': 'HowToStep',
      name: locale === 'is' ? `Skref ${i + 1}` : `Step ${i + 1}`,
      position: i + 1,
      text: step,
      url: `${baseUrl}#skref-${i + 1}`,
      image: images[0],
    })) || [],
  };
}

export function restaurantJsonLd(restaurant: Restaurant, locale: string, menuItems?: MenuItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    image: restaurant.image_urls,
    '@id': `${SITE_URL}/${locale}/stadir/${restaurant.slug}`,
    url: `${SITE_URL}/${locale}/stadir/${restaurant.slug}`,
    telephone: restaurant.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      postalCode: restaurant.postal_code,
      addressCountry: 'IS'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.location?.latitude,
      longitude: restaurant.location?.longitude
    },
    aggregateRating: restaurant.rating_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating_avg,
      ratingCount: restaurant.rating_count
    } : undefined,
    priceRange: Array(restaurant.price_level).fill('$').join(''),
    hasMenu: menuItems?.length ? {
      '@type': 'Menu',
      hasMenuItem: menuItems.map(item => ({
        '@type': 'MenuItem',
        name: locale === 'is' ? item.name_is : item.name_en,
        description: locale === 'is' ? (item.description_is || '') : (item.description_en || ''),
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'ISK'
        }
      }))
    } : undefined
  };
}
