export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { mockRecipes, mockRestaurants } from '@/lib/mockData';

const BASE_URL = 'https://pizzadeig.is';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const locales = ['is', 'en'];

  // Core structured root trees
  const staticRoutes = [
    '', 
    '/uppskriftir', 
    '/stadir', 
    '/samfelag', 
    '/vorur', 
    '/stilar', 
    '/um-okkur', 
    '/skilmalar',
    '/hvad-a-eg',
    '/deigreiknivel'
  ];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            is: `${BASE_URL}/is${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }

    // Dynamic Recipe Routes
    for (const recipe of mockRecipes) {
      if (!recipe.slug) continue;
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/uppskriftir/${recipe.slug}`,
        lastModified: recipe.updated_at ? new Date(recipe.updated_at as any) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            is: `${BASE_URL}/is/uppskriftir/${recipe.slug}`,
            en: `${BASE_URL}/en/uppskriftir/${recipe.slug}`,
          },
        },
      });
    }

    // Dynamic Restaurant Routes
    for (const restaurant of mockRestaurants) {
      if (!restaurant.slug) continue;
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/stadir/${restaurant.slug}`,
        lastModified: restaurant.updated_at ? new Date(restaurant.updated_at as any) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            is: `${BASE_URL}/is/stadir/${restaurant.slug}`,
            en: `${BASE_URL}/en/stadir/${restaurant.slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
