'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { CircleCheck, Circle, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { matchIngredientToKronan } from '@/lib/kronanMapping';

interface Props {
  recipe: Recipe;
  locale: 'is' | 'en';
}

export function IngredientList({ recipe, locale }: Props) {
  const ingredients = locale === 'is' ? recipe.ingredients_is : recipe.ingredients_en;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const ogServings = recipe.servings || 4;
  const [currentServings, setCurrentServings] = useState(ogServings);
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  const isAdmin = user && adminEmails.includes(user.email?.toLowerCase() || '');

  const scaleFactor = currentServings / ogServings;

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scaleValue = (val: string | number | undefined, factor: number) => {
    if (!val) return '';
    const num = parseFloat(val.toString().replace(',', '.'));
    if (!isNaN(num)) {
       const scaled = num * factor;
       // Round nicely: if basically integer, show integer. Else 1 decimal.
       return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace('.0', '');
    }
    return val;
  };

  const sendToKronan = async () => {
    if (!user || (!user.email && !isAdmin)) return;
    setLoading(true);
    try {
      const items = ingredients
        .map(i => ({ sku: matchIngredientToKronan(i.name), qty: 1 }))
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
        alert(locale === 'is' ? 'Uppskrift bætt á Krónuna innkaupalistann þinn!' : 'Recipe added to Kronan shopping list!');
      } else {
        alert(data.error || 'Villa / Error');
      }
    } catch (err) {
      console.error(err);
      alert('Villa / Error');
    } finally {
      setLoading(false);
    }
  };

  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="bg-(--color-bg-secondary) rounded-2xl shadow-md border border-(--color-border) p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-ring" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-(--color-border-light) pb-6 gap-4">
         <h3 className="text-3xl font-bold font-display text-(--color-text-primary)">
           {locale === 'is' ? 'Hráefni' : 'Ingredients'}
         </h3>
         
         <div className="flex items-center gap-4">
           {isAdmin && (
             <button
               onClick={sendToKronan}
               disabled={loading}
               className="flex items-center gap-2 bg-yellow-400 text-yellow-900 border border-yellow-500 font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors"
               title={locale === 'is' ? 'Senda í Krónu appið' : 'Send to Kronan'}
             >
               <ShoppingCart className="w-4 h-4" />
               <span className="hidden sm:inline text-sm">{loading ? 'Bíðið...' : 'Krónan'}</span>
             </button>
           )}
           <div className="flex items-center gap-3 bg-(--color-bg-tertiary) p-1.5 rounded-lg border border-(--color-border-light)">
             <button onClick={() => setCurrentServings(Math.max(1, currentServings - 1))} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-(--color-brand) text-(--color-text-secondary) transition-colors shadow-sm bg-transparent">
               <Minus className="w-4 h-4" />
             </button>
             <div className="text-sm font-bold w-full text-center min-w-[3rem] px-2 text-(--color-text-primary)">
               {currentServings} {locale === 'is' ? 'skammtar' : 'servings'}
             </div>
             <button onClick={() => setCurrentServings(currentServings + 1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-(--color-brand) text-(--color-text-secondary) transition-colors shadow-sm bg-transparent">
               <Plus className="w-4 h-4" />
             </button>
           </div>
         </div>
      </div>
      
      <ul className="space-y-4">
        {ingredients.map((ing, i) => {
          const isChecked = checkedItems[i];
          return (
              <li 
              key={i} 
              onClick={() => toggleCheck(i)}
              className={`flex items-start text-lg border-b border-(--color-border-light) pb-4 last:border-0 hover:bg-(--color-bg-tertiary) transition-all p-3 -mx-3 rounded-xl cursor-pointer select-none group ${isChecked ? 'opacity-40 grayscale' : 'text-(--color-text-primary)'}`}
            >
              <div className="mt-0.5 mr-4 flex-shrink-0">
                {isChecked ? <CircleCheck className="w-6 h-6 text-ring" /> : <Circle className="w-6 h-6 text-gray-300 group-hover:text-(--color-gold-light)" />}
              </div>
              <span className={`font-bold font-chalk text-xl w-24 flex-shrink-0 ${isChecked ? 'text-gray-400 line-through' : 'text-(--color-brand)'}`}>{scaleValue(ing.amount, scaleFactor)} {ing.unit}</span>
              <span className={`font-body leading-relaxed mt-0.5 ${isChecked ? 'text-gray-400 line-through' : 'text-(--color-text-secondary)'}`}>{ing.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
