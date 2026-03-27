export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://pizzadeig.is';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const locales = ['is', 'en'];

  // Core structured root trees
  const staticRoutes = ['', '/uppskriftir', '/stadir', '/um-okkur', '/skilmalar'];

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
  }

  // Dynamic routes temporarily omitted from SSG to prevent Firebase build hangs
  return sitemapEntries;
}
