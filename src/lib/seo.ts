import { Recipe } from '@/types/recipe';
import { Restaurant, MenuItem } from '@/types/restaurant';

export function recipeJsonLd(recipe: Recipe, locale: string) {
  const baseUrl = `https://pizzadeig.is/${locale}/uppskriftir/${recipe.slug || ''}`;
  const defaultImage = 'https://pizzadeig.is/OG-BG.jpeg';
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating_avg && recipe.rating_avg > 0 ? recipe.rating_avg : 5,
      ratingCount: recipe.rating_count && recipe.rating_count > 0 ? recipe.rating_count : 1,
    },
    nutrition: {
      '@type': 'NutritionInformation',
      calories: '250 calories', // Fallback value as we do not track nutrition yet
    },
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
