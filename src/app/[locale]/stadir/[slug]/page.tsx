import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { restaurantJsonLd } from '@/lib/seo';
import { MapPin, Star, Clock, Globe, Phone, ChefHat, ArrowLeft } from 'lucide-react';
import { RestaurantInteractive } from '@/components/restaurants/RestaurantInteractive';

function getRestaurant(slug: string) {
  return mockRestaurants.find(r => (r.slug || r.id) === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const restaurant = getRestaurant(slug);
  if (!restaurant) return {};
  const isIs = locale === 'is';
  const desc = isIs ? restaurant.description_is : restaurant.description_en;
  return {
    title: `${restaurant.name} — ${isIs ? 'Pizza í' : 'Pizza in'} ${restaurant.city} | Pizzadeig.is`,
    description: desc?.slice(0, 155) || `${restaurant.name} — ${restaurant.city}`,
    openGraph: {
      title: `${restaurant.name} | Pizzadeig.is`,
      description: desc?.slice(0, 155),
      url: `https://www.pizzadeig.is/${locale}/stadir/${slug}`,
      siteName: 'Pizzadeig.is',
      locale: isIs ? 'is_IS' : 'en_US',
      type: 'website',
      images: restaurant.image_urls?.[0] ? [restaurant.image_urls[0]] : [],
    },
  };
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const isIs = locale === 'is';

  const restaurant = getRestaurant(slug);
  if (!restaurant) notFound();

  const priceLabel = '€'.repeat(restaurant.price_level || 2);
  const menuItems = mockMenuItems.filter(m => m.restaurant_id === (restaurant.slug || restaurant.id));
  const jsonLd = restaurantJsonLd(restaurant, locale, menuItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main className="flex-1 w-full bg-(--color-bg-light) min-h-screen">
      {/* Hero image */}
      {restaurant.image_urls?.[0] && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={restaurant.image_urls[0]}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 z-10">
            <Link href="/stadir" className="inline-flex items-center gap-1.5 text-white/80 text-sm font-medium hover:text-white mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {isIs ? 'Til baka' : 'Back to list'}
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg">
              {restaurant.name}
            </h1>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-4xl py-10">
        {/* Quick info bar */}
        <div className="flex flex-wrap gap-4 items-center mb-8 pb-8 border-b border-(--color-border-light)">
          <span className="flex items-center gap-1.5 text-(--color-text-secondary)">
            <MapPin className="w-4 h-4" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="text-(--color-text-secondary)">{priceLabel}</span>
          {(restaurant.rating_google ?? 0) > 0 && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {restaurant.rating_google?.toFixed(1)} Google
            </span>
          )}
          {(restaurant.rating_tripadvisor ?? 0) > 0 && (
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
              {restaurant.rating_tripadvisor?.toFixed(1)} TripAdvisor
            </span>
          )}
          {restaurant.is_verified && (
            <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
              <ChefHat className="w-3.5 h-3.5" />
              {isIs ? 'Staðfest' : 'Verified'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Details */}
          <div>
            {/* Description */}
            <p className="text-(--color-text-secondary) mb-8 leading-relaxed">
              {isIs ? restaurant.description_is : restaurant.description_en}
            </p>

            {/* Features */}
            {restaurant.features && restaurant.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-(--color-text-primary) mb-3">
                  {isIs ? 'Eiginleikar' : 'Features'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map(f => (
                    <span key={f} className="px-3 py-1.5 bg-(--color-bg-secondary) text-(--color-text-secondary) text-sm rounded-full border border-(--color-border-light)">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-(--color-text-primary) mb-3">
                {isIs ? 'Tengiliðir' : 'Contact'}
              </h2>
              <div className="space-y-2 text-sm text-(--color-text-secondary)">
                {restaurant.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${restaurant.phone}`} className="hover:text-(--color-brand) transition-colors">
                      {restaurant.phone}
                    </a>
                  </p>
                )}
                {restaurant.website && (
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="hover:text-(--color-brand) transition-colors">
                      {restaurant.website.replace(/https?:\/\//, '')}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Opening hours */}
          <div>
            {restaurant.opening_hours && (
              <div className="bg-(--color-bg-secondary) rounded-2xl border border-(--color-border) p-6">
                <h2 className="text-lg font-bold text-(--color-text-primary) mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {isIs ? 'Opnunartímar' : 'Opening Hours'}
                </h2>
                <div className="space-y-2.5">
                  {Object.entries(restaurant.opening_hours as Record<string, string>).map(([day, hours]) => {
                    const dayNames: Record<string, string> = isIs
                      ? { mán: 'Mánudagur', þri: 'Þriðjudagur', mið: 'Miðvikudagur', fim: 'Fimmtudagur', fös: 'Föstudagur', lau: 'Laugardagur', sun: 'Sunnudagur' }
                      : { mán: 'Monday', þri: 'Tuesday', mið: 'Wednesday', fim: 'Thursday', fös: 'Friday', lau: 'Saturday', sun: 'Sunday' };
                    return (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium text-(--color-text-primary)">{dayNames[day] || day}</span>
                        <span className="text-(--color-text-secondary)">{hours || (isIs ? 'Lokað' : 'Closed')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu + Reviews (client interactive section) */}
        <RestaurantInteractive
          restaurantId={restaurant.slug || restaurant.id}
          menuItems={menuItems}
          locale={locale as 'is' | 'en'}
        />
      </div>
    </main>
    </>
  );
}

