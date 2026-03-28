export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { mockRecipes, mockRestaurants } from '@/lib/mockData';
import { Timestamp } from 'firebase/firestore';

const BASE_URL = 'https://pizzadeig.is';

/**
 * Helper to convert Timestamp or string to Date safely for sitemap
 */
function toDate(val: Timestamp | string | Date | null | undefined | { toDate: () => Date }): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val as string);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const locales = ['is', 'en'];

  // Core pages with SEO priority ranking
  const staticRoutes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/uppskriftir', changeFrequency: 'daily' as const, priority: 0.95 },
    { path: '/stadir', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/stilar', changeFrequency: 'monthly' as const, priority: 0.85 },
    { path: '/deigreiknivel', changeFrequency: 'monthly' as const, priority: 0.85 },
    { path: '/topplisti', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/samfelag', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/um-okkur', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/tengilidir', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/skilmalar', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/personuvernd', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/auglysingar', changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            is: `${BASE_URL}/is${route.path}`,
            en: `${BASE_URL}/en${route.path}`,
          },
        },
      });
    }

    // Dynamic Recipe Routes
    for (const recipe of mockRecipes) {
      if (!recipe.slug) continue;
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/uppskriftir/${recipe.slug}`,
        lastModified: toDate(recipe.updated_at),
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
        lastModified: toDate(restaurant.updated_at),
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
