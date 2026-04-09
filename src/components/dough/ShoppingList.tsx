import { useState } from 'react';
import { ShoppingItem } from '@/lib/doughCalculator';
import { useAuth } from '@/hooks/useAuth';
import { getKronanSku } from '@/lib/kronanMapping';

interface Props {
  list: ShoppingItem[];
  locale: 'is' | 'en';
}

export function ShoppingList({ list, locale }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  const isAdmin = user && adminEmails.includes(user.email?.toLowerCase() || '');

  const sendToKronan = async () => {
    if (!user || (!user.email && !isAdmin)) return;
    setLoading(true);
    try {
      const items = list
        .map(i => ({ sku: getKronanSku(i.id), qty: 1 }))
        .filter(i => i.sku !== null);
        
      if (items.length === 0) {
        alert(locale === 'is' ? 'Engin hráefni fundust í Krónunni' : 'No ingredients found in Kronan');
        return;
      }

      const res = await fetch('/api/kronan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, items })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(locale === 'is' ? 'Hráefnum bætt við á Krónuna innkaupalistann þinn!' : 'Added to Kronan shopping list!');
      } else {
        alert(data.error || 'Villa við að bæta á listann');
      }
    } catch (err) {
      console.error(err);
      alert('Villa / Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="font-display font-bold text-2xl text-foreground mb-4">{locale === 'is' ? 'Innkaupalisti' : 'Shopping List'}</h3>
      <ul className="space-y-3">
        {list.map(item => (
          <li key={item.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-gray-300 bg-secondary flex items-center justify-center shrink-0"></div>
              <span className="font-medium text-foreground">{locale === 'is' ? item.name_is : item.name_en}</span>
            </div>
            <span className="font-chalk text-xl text-muted-foreground">{item.amount}{item.unit}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="btn-secondary text-sm flex-1 py-2 rounded-[10px] hover:bg-ring cursor-pointer" onClick={() => {
           const txt = list.map(i => `[ ] ${i.amount}${i.unit} ${locale === 'is' ? i.name_is : i.name_en}`).join('\n');
           navigator.clipboard.writeText(txt);
           alert(locale === 'is' ? 'Afritað!' : 'Copied!');
        }}>
          {locale === 'is' ? 'Afrita Texta' : 'Copy Text'}
        </button>
        {isAdmin && (
          <button 
            className="bg-yellow-400 text-yellow-900 border border-yellow-500 font-bold text-sm flex-1 py-2 rounded-[10px] hover:bg-yellow-500 cursor-pointer disabled:opacity-50"
            onClick={sendToKronan}
            disabled={loading}
          >
            {loading ? 'Bíðið...' : (locale === 'is' ? 'Setja í Krónu appið' : 'Send to Kronan')}
          </button>
        )}
      </div>
    </div>
  );
}
