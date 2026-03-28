import { PRODUCTS } from '@/lib/products';
import { ExternalLink } from 'lucide-react';

export default async function VorurPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIs = locale === 'is';

  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  return (
    <main className="flex-1 bg-(--color-bg-primary) min-h-screen">
      {/* Hero with background image */}
      <section className="relative h-[300px] flex items-center justify-center bg-linear-to-b from-stone-600 to-stone-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-3">
            Pizzadeig.is Verslun
          </h1>
          <p className="text-lg text-white/80 italic max-w-xl mx-auto">
            {isIs
              ? 'Allt sem þú þarft til að verða meistari í pizzugerð heima.'
              : 'Everything you need to master the art of Neapolitan pizza at home.'}
          </p>
        </div>
      </section>

      {/* Filter pills */}
      <section className="py-8">
        <div className="flex justify-center gap-3 flex-wrap px-4">
          <span className="px-5 py-2.5 rounded-full text-sm font-semibold bg-(--color-brand) text-white shadow-md cursor-pointer">
            {isIs ? 'Allt' : 'All'}
          </span>
          {categories.map(cat => {
            const catProduct = PRODUCTS.find(p => p.category === cat);
            return (
              <span
                key={cat}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-(--color-bg-secondary) text-(--color-text-secondary) border border-(--color-border) cursor-pointer hover:border-(--color-brand) hover:text-(--color-brand) transition-colors"
              >
                {isIs ? catProduct?.category_is : catProduct?.category_en}
              </span>
            );
          })}
        </div>
      </section>

      {/* Product grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map(product => {
            const name = isIs ? product.name_is : product.name_en;
            const desc = isIs ? product.description_is : product.description_en;
            const badge = isIs ? product.badge_is : product.badge_en;

            return (
              <div
                key={product.id}
                className="bg-(--color-bg-secondary) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow group"
              >
                {/* Product image */}
                <div className="relative h-48 bg-(--color-bg-tertiary) flex items-center justify-center overflow-hidden">
                  {badge && (
                    <span className="absolute top-3 left-3 bg-(--color-brand) text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider z-10">
                      {badge}
                    </span>
                  )}
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {product.image_placeholder}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold text-(--color-text-primary) mb-2">
                    {name}
                  </h3>
                  <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-4 flex-1">
                    {desc}
                  </p>

                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-(--color-text-primary) text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-(--color-brand) transition-colors"
                  >
                    {isIs ? 'Skoða vöru' : 'View Product'} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
