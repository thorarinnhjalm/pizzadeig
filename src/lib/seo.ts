import { Recipe } from '@/types/recipe';
import { Restaurant, MenuItem } from '@/types/restaurant';

export function recipeJsonLd(recipe: Recipe, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: locale === 'is' ? recipe.title_is : recipe.title_en,
    description: locale === 'is' ? recipe.description_is : recipe.description_en,
    image: recipe.image_urls,
    author: { '@type': 'Person', name: recipe.author_name },
    prepTime: `PT${recipe.prep_time_min}M`,
    cookTime: `PT${recipe.cook_time_min}M`,
    totalTime: `PT${recipe.prep_time_min + recipe.cook_time_min + recipe.rest_time_min}M`,
    recipeYield: `${recipe.servings}`,
    recipeCategory: recipe.type,
    aggregateRating: recipe.rating_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating_avg,
      ratingCount: recipe.rating_count,
    } : undefined,
    recipeIngredient: (locale === 'is' ? recipe.ingredients_is : recipe.ingredients_en)
      .map(i => `${i.amount} ${i.unit} ${i.name}`),
    recipeInstructions: (locale === 'is' ? recipe.steps_is : recipe.steps_en)
      .map((step, i) => ({ '@type': 'HowToStep', position: i + 1, text: step })),
  };
}

export function restaurantJsonLd(restaurant: Restaurant, locale: string, menuItems?: MenuItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    image: restaurant.image_urls,
    '@id': `https://pizzadeig.is/${locale}/stadir/${restaurant.slug}`,
    url: `https://pizzadeig.is/${locale}/stadir/${restaurant.slug}`,
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
