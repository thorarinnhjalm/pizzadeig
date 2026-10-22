export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { mockRecipes, mockRestaurants } from '@/lib/mockData';
import { Timestamp } from 'firebase/firestore';

const BASE_URL = 'https://www.pizzadeig.is';

// Keep in sync with `validCategories` in src/app/[locale]/flokkar/[type]/page.tsx
const CATEGORY_TYPES = ['deig', 'sosur', 'ostur'];

/**
 * Helper to convert Timestamp or string to Date safely for sitemap
 */
function toDate(val: Timestamp | string | Date | null | undefined | { toDate: () => Date }): Date | undefined {
  // No known date → omit lastModified rather than claim "modified now" on every crawl
  if (!val) return undefined;
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
    { path: '/pizzuverd', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/deigreiknivel', changeFrequency: 'monthly' as const, priority: 0.85 },
    { path: '/topplisti', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/um-okkur', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/tengilidir', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/personuvernd', changeFrequency: 'yearly' as const, priority: 0.2 },
    { path: '/vorur', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/hvad-a-eg', changeFrequency: 'monthly' as const, priority: 0.5 },
    ...CATEGORY_TYPES.map(type => ({ path: `/flokkar/${type}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
  // /skilmalar is intentionally noindex, so it is not listed here.
  // /auglysingar has Icelandic-only content: only the /is URL is listed, with no en alternate.

  for (const locale of locales) {
    if (locale === 'is') {
      sitemapEntries.push({
        url: `${BASE_URL}/is/auglysingar`,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: { languages: { is: `${BASE_URL}/is/auglysingar` } },
      });
    }

    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        // No lastModified for static routes: we have no real modification date for them.
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
      // Slugs can contain non-ASCII characters (e.g. "ð"), so emit them percent-encoded
      const slug = encodeURIComponent(recipe.slug);
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/uppskriftir/${slug}`,
        lastModified: toDate(recipe.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            is: `${BASE_URL}/is/uppskriftir/${slug}`,
            en: `${BASE_URL}/en/uppskriftir/${slug}`,
          },
        },
      });
    }

    // Dynamic Restaurant Routes
    for (const restaurant of mockRestaurants) {
      if (!restaurant.slug) continue;
      const slug = encodeURIComponent(restaurant.slug);
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/stadir/${slug}`,
        lastModified: toDate(restaurant.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            is: `${BASE_URL}/is/stadir/${slug}`,
            en: `${BASE_URL}/en/stadir/${slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
