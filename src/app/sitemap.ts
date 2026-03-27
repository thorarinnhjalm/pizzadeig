import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

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

  // Aggregate user-generated dynamic semantic Recipe pages natively into bot crawlers mapping
  try {
    const rQuery = query(collection(db, 'recipes'), where('published', '==', true));
    const rSnap = await getDocs(rQuery);
    for (const doc of rSnap.docs) {
      const data = doc.data();
      const slug = data.slug;
      
      for (const locale of locales) {
         sitemapEntries.push({
           url: `${BASE_URL}/${locale}/uppskriftir/${slug}`,
           lastModified: data.updated_at?.toDate() || new Date(),
           changeFrequency: 'monthly',
           priority: 0.9,
           alternates: {
             languages: {
                is: `${BASE_URL}/is/uppskriftir/${slug}`,
                en: `${BASE_URL}/en/uppskriftir/${slug}`,
             },
           },
         });
      }
    }
  } catch (e) {
    console.error('Sitemap recipe generation indexing error', e);
  }

  // Aggregate commercial Restaurant entities directly into Google Search / LLM maps 
  try {
    const stSnap = await getDocs(collection(db, 'restaurants'));
    for (const doc of stSnap.docs) {
      const slug = doc.data().slug;
      
      for (const locale of locales) {
         sitemapEntries.push({
           url: `${BASE_URL}/${locale}/stadir/${slug}`,
           lastModified: new Date(),
           changeFrequency: 'weekly',
           priority: 0.8,
           alternates: {
             languages: {
                is: `${BASE_URL}/is/stadir/${slug}`,
                en: `${BASE_URL}/en/stadir/${slug}`,
             },
           },
         });
      }
    }
  } catch (e) {
    console.error('Sitemap commercial indexing error', e);
  }

  return sitemapEntries;
}
