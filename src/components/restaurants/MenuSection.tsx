import { MenuItem } from '@/types/restaurant';

export function MenuSection({ items, locale }: { items: MenuItem[], locale: 'is' | 'en' }) {
  if (items.length === 0) return null;

  // Group by category
  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Function to format price
  const formatIsk = (price: number) => {
    return price.toLocaleString('is-IS') + ' kr.';
  };

  return (
    <div className="space-y-16">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-3xl font-extrabold text-[#1D3557] mb-8 border-b-4 border-[#1D3557]/10 pb-3">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start group relative">
                <div className="flex-1 pr-6 z-10 bg-[var(--color-bg-secondary)] shadow-[8px_0_12px_rgba(255,255,255,1)]">
                  <h4 className="font-bold text-[var(--color-text-primary)] text-xl group-hover:text-[var(--color-brand)] transition-colors">
                    {locale === 'is' ? item.name_is : item.name_en}
                  </h4>
                  {(item.description_is || item.description_en) && (
                     <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mt-2 text-justify">
                       {locale === 'is' ? item.description_is : item.description_en}
                     </p>
                  )}
                </div>
                <div className="w-full h-px bg-gray-200 absolute top-3.5 -z-0"></div>
                <div className="font-extrabold text-[var(--color-text-primary)] text-lg bg-[#F8FAFC] px-4 py-1.5 rounded-xl border-2 border-gray-100 shadow-sm whitespace-nowrap z-10 group-hover:bg-[var(--color-brand)] group-hover:text-white group-hover:border-[var(--color-brand)] transition-all">
                  {formatIsk(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
