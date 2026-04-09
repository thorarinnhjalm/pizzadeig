'use client';

import { useState, useCallback } from 'react';
import { Recipe } from '@/types/recipe';
import { CircleCheck, Circle, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { matchIngredientToKronan } from '@/lib/kronanMapping';
import { KronanBubble } from './KronanBubble';

interface Props {
  recipe: Recipe;
  locale: 'is' | 'en';
}

export function IngredientList({ recipe, locale }: Props) {
  const ingredients = locale === 'is' ? recipe.ingredients_is : recipe.ingredients_en;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const ogServings = recipe.servings || 4;
  const [currentServings, setCurrentServings] = useState(ogServings);
  
  // Kronan Integration States
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [kronanCosts, setKronanCosts] = useState<Record<string, number>>({});
  
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
       return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace('.0', '');
    }
    return val;
  };

  const handlePriceLoad = useCallback((name: string, price: number) => {
    setKronanCosts(prev => {
      if (prev[name] === price) return prev;
      return { ...prev, [name]: price };
    });
  }, []);

  const totalKronanCost = Object.values(kronanCosts).reduce((sum, val) => sum + val, 0);

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
          const matchSku = matchIngredientToKronan(ing.name);
          return (
              <li 
              key={i} 
              className={`flex flex-col sm:flex-row sm:items-center text-lg border-b border-(--color-border-light) pb-4 last:border-0 hover:bg-(--color-bg-tertiary) transition-all p-3 -mx-3 rounded-xl select-none group ${isChecked ? 'opacity-40 grayscale' : 'text-(--color-text-primary)'}`}
            >
              <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleCheck(i)}>
                <div className="mr-4 flex-shrink-0">
                  {isChecked ? <CircleCheck className="w-6 h-6 text-ring" /> : <Circle className="w-6 h-6 text-gray-300 group-hover:text-(--color-gold-light)" />}
                </div>
                <span className={`font-bold font-chalk text-xl w-24 flex-shrink-0 ${isChecked ? 'text-gray-400 line-through' : 'text-(--color-brand)'}`}>{scaleValue(ing.amount, scaleFactor)} {ing.unit}</span>
                <span className={`font-body leading-relaxed mt-0.5 ${isChecked ? 'text-gray-400 line-through' : 'text-(--color-text-secondary)'}`}>{ing.name}</span>
              </div>
              
              {/* Kronan Bubble Public Integration */}
              <div className="mt-2 sm:mt-0 sm:ml-auto">
                 {matchSku && (
                    <KronanBubble 
                       sku={matchSku} 
                       lang={locale} 
                       onLoadPrice={(price) => handlePriceLoad(ing.name, price)} 
                    />
                 )}
              </div>
            </li>
          );
        })}
      </ul>

      {totalKronanCost > 0 && (
         <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between text-yellow-900 shadow-sm">
            <span className="font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-yellow-600" />
              {locale === 'is' ? 'Áætlað heildarverð í Krónunni:' : 'Estimated Krónan total:'}
            </span>
            <span className="font-chalk text-2xl font-bold bg-yellow-400 text-yellow-950 px-3 py-1 rounded-lg border border-yellow-500 shadow-sm">
              {totalKronanCost.toLocaleString('is-IS')} kr.
            </span>
         </div>
      )}
    </div>
  );
}
