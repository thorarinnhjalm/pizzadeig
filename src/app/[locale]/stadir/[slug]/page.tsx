import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Restaurant, MenuItem } from '@/types/restaurant';
import Image from 'next/image';
import { MapPin, Phone, Globe, Clock, Pizza, BadgeCheck } from 'lucide-react';
import { Map } from '@/components/restaurants/Map';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { ReviewList } from '@/components/community/ReviewList';
import { ReviewForm } from '@/components/community/ReviewForm';
import { MenuItemRating } from '@/components/restaurants/MenuItemRating';

export const dynamic = 'force-dynamic';

async function getRestaurant(slug: string): Promise<Restaurant | null> {
  try {
    const q = query(collection(db, 'restaurants'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Restaurant;
  } catch {
    console.warn('Firebase offline fallback active');
  }
  return mockRestaurants.find(r => r.slug === slug) || null;
}

async function getMenu(restaurantId: string): Promise<MenuItem[]> {
  try {
    const q = query(
      collection(db, 'menu_items'), 
      where('restaurant_id', '==', restaurantId),
      orderBy('sort_order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch {}
  return mockMenuItems.filter(m => m.restaurant_id === restaurantId);
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const isIslandic = locale === 'is';
  
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();
  
  const menuItems = await getMenu(restaurant.id);

  return (
    <main className="flex-1 bg-background">
      {/* Cover Image */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <Image 
          src={restaurant.image_urls?.[0] || 'https://images.unsplash.com/photo-1542834369-f81dc3ed3fd7'} 
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 z-10">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {'$'.repeat(restaurant.price_level || 2)}
                  </span>
                  {restaurant.is_verified && (
                    <span className="flex items-center text-(--color-green) bg-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                      <BadgeCheck className="w-4 h-4 mr-1" /> Vottaður
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md">
                  {restaurant.name}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl drop-shadow-sm font-medium">
                  {isIslandic ? restaurant.description_is : restaurant.description_en}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col gap-3">
                 <div className="flex items-center text-white gap-2">
                   <Pizza className="w-7 h-7 text-primary fill-primary" />
                   <span className="text-3xl font-bold">{restaurant.rating_avg?.toFixed(1) || 'N/A'}</span>
                   <span className="text-xs text-gray-400 ml-1">Pizzadeig.is<br/>{restaurant.rating_count} umsagnir</span>
                 </div>
                 {(restaurant.rating_google || restaurant.rating_tripadvisor) && (
                   <div className="flex gap-4 pt-2 border-t border-white/10">
                     {restaurant.rating_google && (
                       <div className="flex items-center gap-1.5 text-sm">
                         <span className="text-[15px]">📍</span>
                         <span className="font-bold text-white">{restaurant.rating_google.toFixed(1)}</span>
                         <span className="text-[10px] text-gray-400">Google</span>
                       </div>
                     )}
                     {restaurant.rating_tripadvisor && (
                       <div className="flex items-center gap-1.5 text-sm">
                         <span className="text-[15px]">🦉</span>
                         <span className="font-bold text-white">{restaurant.rating_tripadvisor.toFixed(1)}</span>
                         <span className="text-[10px] text-gray-400">TripAdvisor</span>
                       </div>
                     )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
           <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 border-b pb-4">
                 Matseðill
              </h2>
              {menuItems.length > 0 ? (
                <p className="text-sm text-(--color-text-tertiary) italic mb-8 -mt-4">
                  {isIslandic ? '*Birt með fyrirvara um verð' : '*Prices subject to change'}
                </p>
              ) : null}
              {menuItems.length > 0 ? (
                <div className="space-y-6">
                  {menuItems.map(item => (
                    <div key={item.id} className="border-b border-(--color-border-light) pb-6 group">
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {isIslandic ? item.name_is : (item.name_en || item.name_is)}
                           </h3>
                           <p className="text-(--color-text-secondary) mt-2">
                              {isIslandic ? item.description_is : (item.description_en || item.description_is)}
                           </p>
                         </div>
                         <div className="text-xl font-bold text-foreground ml-4 shrink-0 text-right">
                           {item.price_large ? (
                             <div className="flex flex-col items-end gap-0.5">
                               <span className="text-base">
                                 {item.size_small_label || '12"'} {item.price.toLocaleString('is-IS')} kr.
                               </span>
                               <span className="text-base">
                                 {item.size_large_label || '16"'} {item.price_large.toLocaleString('is-IS')} kr.
                               </span>
                             </div>
                           ) : (
                             <>{item.price} kr.</>
                           )}
                         </div>
                       </div>
                       <MenuItemRating item={item} locale={locale as 'is' | 'en'} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-(--color-text-secondary) italic">Enginn matseðill skráður eins og er.</p>
              )}
           </section>
           
           <section>
              <h2 className="text-3xl font-bold text-foreground mb-8 border-b pb-4">
                 Umsagnir
              </h2>
              <ReviewForm targetId={restaurant.id} targetType="restaurant" locale={locale as 'is' | 'en'} />
              <div className="mt-12">
                <ReviewList targetId={restaurant.id} targetType="restaurant" locale={locale as 'is' | 'en'} />
              </div>
           </section>
        </div>
        
        <div className="space-y-8">
           <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
             <h3 className="text-xl font-bold mb-6 text-foreground">Upplýsingar</h3>
             <ul className="space-y-4 text-muted-foreground">
               <li className="flex items-start">
                 <MapPin className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                 <span>{restaurant.address}, {restaurant.postal_code} {restaurant.city}</span>
               </li>
               {restaurant.phone && (
                 <li className="flex items-center">
                   <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                   <span>{restaurant.phone}</span>
                 </li>
               )}
               {restaurant.website && (
                 <li className="flex items-center">
                   <Globe className="w-5 h-5 text-primary mr-3 shrink-0" />
                   <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vefsíða</a>
                 </li>
               )}
               <li className="flex items-start">
                 <Clock className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                 <div>
                    {restaurant.opening_hours && Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between w-48 mb-1">
                        <span className="capitalize text-muted-foreground">{day}:</span>
                        <span className="font-medium">{hours as string}</span>
                      </div>
                    ))}
                 </div>
               </li>
             </ul>
           </div>

           <div className="rounded-2xl overflow-hidden shadow-md h-64 border border-(--color-border)">
             <Map restaurants={[restaurant]} focusedRestaurantId={restaurant.id} />
           </div>
        </div>
      </div>
    </main>
  );
}
