import { NextRequest, NextResponse } from 'next/server';
import { allRecipes } from '@/lib/recipeData';
import { mockRestaurants } from '@/lib/mockData';

/**
 * Client-side search powered by Firestore-compatible mock data.
 * No Algolia needed — searches recipes and restaurants by title, tags, and description.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const type = searchParams.get('type') || 'recipes';

  if (!q || q.length < 2) {
    return NextResponse.json({ hits: [] });
  }

  if (type === 'restaurants') {
    const hits = mockRestaurants
      .filter((r) => {
        const searchable = [r.name, r.description_is, r.description_en, r.city, ...r.tags]
          .join(' ').toLowerCase();
        return searchable.includes(q);
      })
      .slice(0, 8)
      .map((r) => ({
        objectID: r.id,
        name: r.name,
        slug: r.slug,
        city: r.city,
        image_urls: r.image_urls,
        rating_avg: r.rating_avg,
      }));

    return NextResponse.json({ hits });
  }

  // Default: search recipes
  const hits = allRecipes
    .filter((r) => {
      const searchable = [
        r.title_is, r.title_en,
        r.description_is, r.description_en,
        r.category,
        ...(r.tags || []),
        ...(r.ingredients_is?.map(i => i.name) || []),
      ].join(' ').toLowerCase();
      return searchable.includes(q);
    })
    .slice(0, 8)
    .map((r) => ({
      objectID: r.id,
      title_is: r.title_is,
      title_en: r.title_en,
      slug: r.slug,
      image_urls: r.image_urls,
      category: r.category,
      rating_avg: r.rating_avg,
    }));

  return NextResponse.json({ hits });
}
