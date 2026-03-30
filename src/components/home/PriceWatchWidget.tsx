import { useTranslations } from 'next-intl';
import { mockMenuItems, mockRestaurants } from '@/lib/mockData';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';

function getCheapest(type: 'margherita' | 'pepperoni' | 'parma') {
  const matches = mockMenuItems.filter(i => {
    const name = (i.name_is || '').toLowerCase();
    const nameEn = (i.name_en || '').toLowerCase();
    
    if (type === 'margherita') {
       return name.includes('margherita') || name.includes('margarita');
    }
    if (type === 'pepperoni') {
       return name.includes('pepperoni') || name.includes('diavola') || name.includes('piccante') || nameEn.includes('pepperoni');
    }
    if (type === 'parma') {
       return name.includes('parma') || name.includes('hráskinka') || nameEn.includes('parma');
    }
    return false;
  });

  // Keep only the cheapest representation from each restaurant
  const byRestaurant = new Map<string, typeof mockMenuItems[0]>();
  matches.forEach(m => {
    const existing = byRestaurant.get(m.restaurant_id);
    if (!existing || m.price < existing.price) {
       byRestaurant.set(m.restaurant_id, m);
    }
  });

  return Array.from(byRestaurant.values())
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
}

export function PriceWatchWidget() {
  const categories = [
    {
      id: 'margherita',
      title: 'Margherita',
      emoji: '🧀',
      items: getCheapest('margherita'),
      bg: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
      id: 'pepperoni',
      title: 'Pepperoni',
      emoji: '🔥',
      items: getCheapest('pepperoni'),
      bg: 'bg-gradient-to-br from-red-500 to-rose-700',
    },
    {
      id: 'parma',
      title: 'Parma & Rúkkóla',
      emoji: '🌿',
      items: getCheapest('parma'),
      bg: 'bg-gradient-to-br from-emerald-600 to-green-800',
    }
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-zinc-900/50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-wider font-semibold">
            Verðvaktin 💰
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Hvar er <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">ódýrasta</span> pizzan?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Við fylgjumst með verðlagi á helstu pizzeríum landsins svo þú getir nælt þér í bestu bitana á besta verðinu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white dark:bg-zinc-800/80 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-700/50 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Header with Glass/Gradient effect */}
              <div className={`${cat.bg} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                  <span className="text-6xl">{cat.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1 relative z-10 drop-shadow-sm">{cat.title}</h3>
                <p className="text-white/80 text-sm font-medium relative z-10">Topp 3 ódýrustu kostirnir</p>
              </div>

              {/* Top List */}
              <div className="p-2">
                {cat.items.map((item, index) => {
                  const restaurant = mockRestaurants.find(r => r.id === item.restaurant_id);
                  return (
                    <Link href={`/stadir/${restaurant?.slug || ''}`} key={item.id}>
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded-2xl transition-colors cursor-pointer group/item">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                            index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400' :
                            'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover/item:text-primary transition-colors">
                              {restaurant?.name || 'Óþekktur staður'}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.name_is}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            {item.price.toLocaleString('is-IS')} kr.
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {cat.items.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-sm"> Engin gögn fundust </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
