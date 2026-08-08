'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
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
    if (!user) {
      showMessage('❌ Þú ert ekki innskráð(ur). Skráðu þig inn með Google og reyndu aftur.');
      return;
    }
    setLoading(true);
    showMessage('Byrja að fræfæða gagnagrunninn...');
    try {
      // Firestore rules gate every write on users/{uid}.role == 'admin'. Write it
      // and read it back — without this the batches fail with a bare
      // "Missing or insufficient permissions" that says nothing about the cause.
      try {
        await setDoc(doc(db, 'users', user.uid), { role: 'admin' }, { merge: true });
      } catch (err) {
        showMessage(`❌ Gat ekki skráð admin-réttindi á notandann (${user.email}). ${(err as Error).message}`);
        setLoading(false);
        return;
      }
      const me = await getDoc(doc(db, 'users', user.uid));
      if (me.data()?.role !== 'admin') {
        showMessage(`❌ Notandinn ${user.email} hefur ekki admin-hlutverk í Firestore. Seed stöðvað.`);
        setLoading(false);
        return;
      }

      // Collect every write, then commit in chunks — Firestore caps a
      // single writeBatch at 500 operations.
      const ops: { ref: ReturnType<typeof doc>; data: Record<string, unknown> }[] = [];

      mockRestaurants.forEach((r) => {
        ops.push({ ref: doc(db, 'restaurants', r.id), data: { ...r, is_seeded: true, created_at: new Date() } });
      });

      mockMenuItems.forEach((item) => {
        const r = mockRestaurants.find(rest => rest.id === item.restaurant_id);
        ops.push({ ref: doc(db, 'menu_items', item.id), data: { ...item, restaurant_name: r?.name || '', is_seeded: true, created_at: new Date() } });
      });

      mockAds.forEach((ad) => {
        ops.push({ ref: doc(db, 'ads', ad.id), data: { ...ad, is_seeded: true, impressions: 0, clicks: 0, created_at: new Date() } });
      });

      allRecipes.forEach((recipe) => {
        ops.push({ ref: doc(db, 'recipes', recipe.id), data: { ...recipe, is_seeded: true, created_at: new Date(), updated_at: new Date() } });
      });

      // Reconcile: a doc seeded earlier but since dropped from the local data
      // (e.g. a restaurant that closed) would otherwise linger in Firestore and
      // keep being served. Collect those for deletion.
      const deletions: ReturnType<typeof doc>[] = [];
      const liveIds: Record<string, Set<string>> = {
        restaurants: new Set(mockRestaurants.map(r => r.id)),
        menu_items: new Set(mockMenuItems.map(m => m.id)),
      };
      for (const [colName, ids] of Object.entries(liveIds)) {
        const snapshot = await getDocs(collection(db, colName));
        snapshot.forEach((document) => {
          if (document.data().is_seeded && !ids.has(document.id)) {
            deletions.push(document.ref);
          }
        });
      }

      const CHUNK = 450;
      for (let i = 0; i < ops.length; i += CHUNK) {
        const batch = writeBatch(db);
        ops.slice(i, i + CHUNK).forEach(({ ref, data }) => batch.set(ref, data));
        await batch.commit();
      }
      for (let i = 0; i < deletions.length; i += CHUNK) {
        const batch = writeBatch(db);
        deletions.slice(i, i + CHUNK).forEach((ref) => batch.delete(ref));
        await batch.commit();
      }
      showMessage(
        deletions.length > 0
          ? `Gagnagrunnur uppfærður! ${ops.length} skjöl skrifuð, ${deletions.length} úrelt skjöl fjarlægð. 🎉`
          : 'Gagnagrunnur var uppfærður með gervigögnum! 🎉'
      );
      onRefresh();
    } catch (err) {
      showMessage('❌ Seed mistókst: ' + (err as Error).message);
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

      <div
        className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
          user ? 'border-(--color-border) bg-(--color-bg-secondary) text-(--color-text-primary)' : 'border-red-300 bg-red-50 text-red-900'
        }`}
      >
        {user
          ? `Innskráð(ur) sem ${user.email}`
          : 'Ekki innskráð(ur) — allar aðgerðir hér að neðan munu mistakast. Skráðu þig inn með Google fyrst.'}
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
