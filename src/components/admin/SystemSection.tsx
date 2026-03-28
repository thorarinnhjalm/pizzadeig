'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, getDocs, setDoc } from 'firebase/firestore';
import { AlertTriangle, Database, Trash2, Power } from 'lucide-react';
import { allRecipes } from '@/lib/recipeData';
import { mockRestaurants, mockMenuItems, mockAds } from '@/lib/mockData';

interface SystemSectionProps {
  showMessage: (msg: string) => void;
  onRefresh: () => void;
  user: import('firebase/auth').User | null;
}

export function SystemSection({ showMessage, onRefresh, user }: SystemSectionProps) {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    showMessage('Byrja að fræfæða gagnagrunninn...');
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), { role: 'admin' }, { merge: true });
      }

      const batch = writeBatch(db);

      mockRestaurants.forEach((r) => {
        batch.set(doc(db, 'restaurants', r.id), { ...r, is_seeded: true, created_at: new Date() });
      });

      mockMenuItems.forEach((item) => {
        const r = mockRestaurants.find(rest => rest.id === item.restaurant_id);
        batch.set(doc(db, 'menu_items', item.id), { 
          ...item, restaurant_name: r?.name || '', is_seeded: true, created_at: new Date()
        });
      });

      mockAds.forEach((ad) => {
        batch.set(doc(db, 'ads', ad.id), { ...ad, is_seeded: true, impressions: 0, clicks: 0, created_at: new Date() });
      });

      allRecipes.forEach((recipe) => {
        batch.set(doc(db, 'recipes', recipe.id), { ...recipe, is_seeded: true, created_at: new Date(), updated_at: new Date() });
      });

      await batch.commit();
      showMessage('Gagnagrunnur var uppfærður með gervigögnum! 🎉');
      onRefresh();
    } catch (err) {
      showMessage('❌ Gat ekki afkóðað API tákna. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!window.confirm('Ertu viss um að þú viljir eyða öllum gervigögnum úr Firebase? Þetta er ekki afturkræft.')) return;
    setLoading(true);
    showMessage('Eyði gervigögnum...');
    try {
      const collectionsToClear = ['restaurants', 'menu_items', 'ads', 'recipes'];
      for (const colName of collectionsToClear) {
        const querySnapshot = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        let count = 0;
        querySnapshot.forEach((document) => {
          if (document.data().is_seeded) {
            batch.delete(document.ref);
            count++;
          }
        });
        if (count > 0) await batch.commit();
      }
      showMessage('Öllum gervigögnum eytt! 🗑️');
      onRefresh();
    } catch (error) {
      console.error(error);
      showMessage('Villa við að eyða: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary) flex items-center gap-2">
            <Power className="w-6 h-6 text-red-600" />
            Kerfisstjórnun
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Hættulegar aðgerðir og gagnagrunns viðhald aðeins fyrir kerfisstjóra.</p>
        </div>
      </div>

      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-red-900 border-b border-red-200 pb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" /> 
          Gagnagrunns Styttur (Dev Tools)
        </h3>
        
        <div className="space-y-8 pl-2">
          {/* Seed */}
          <div className="flex flex-col md:flex-row gap-6 md:items-start p-4 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="flex-1">
               <h4 className="text-sm font-bold flex items-center gap-2 text-stone-900 mb-1">
                 <Database className="w-4 h-4 text-(--color-brand)" /> Fræfæða (Seed) Firebase
               </h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Tekur pizzur, staði og auglýsingar úr lokal kóða (`mockData` og `recipeData`) og stofnar þau gögn í eldveggnum (`is_seeded: true`). 
                 Gott að nota fyrst til að fylla kerfið.
               </p>
            </div>
            <button 
              onClick={seedData}
              disabled={loading}
              className="md:w-auto w-full px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-sm active:bg-gray-200 flex justify-center items-center h-fit disabled:opacity-50 mt-2 md:mt-0"
            >
              {loading ? 'Sæki/Vistunarferli...' : 'Sturta Innihaldi Inn'}
            </button>
          </div>

          {/* Clear */}
          <div className="flex flex-col md:flex-row gap-6 md:items-start p-4 bg-red-50 rounded-xl shadow-sm border border-red-200/50">
            <div className="flex-1">
               <h4 className="text-sm font-bold flex items-center gap-2 text-red-800 mb-1">
                 <Trash2 className="w-4 h-4" /> Eyða Gervigögnum
               </h4>
               <p className="text-xs text-red-800/80 leading-relaxed font-medium">
                 Þetta finnur öll skjöl í `recipes`, `restaurants`, `ads` sem stjörnu merkt `is_seeded: true` og eyðir þeim. 
                 <strong className="text-red-900"> Aðgerðina er ekki hægt að afturkalla!</strong>
               </p>
            </div>
            <button 
              onClick={clearData}
              disabled={loading}
              className="md:w-auto w-full px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-md active:bg-red-800 flex justify-center items-center h-fit disabled:opacity-50 mt-2 md:mt-0"
            >
              {loading ? 'Eyði gögnum...' : 'Eyða Gervigögnum Núna'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
