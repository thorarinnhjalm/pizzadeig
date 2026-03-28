'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Recipe } from '@/types/recipe';
import { RecipesSection } from '@/components/admin/RecipesSection';
import { Loader2, Utensils } from 'lucide-react';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'recipes'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Recipe));
      setRecipes(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage('Villa við að sækja uppskriftir: ' + (err instanceof Error ? err.message : 'Óþekkt villa'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto relative">
      {message && (
        <div className="fixed top-20 right-8 bg-green-50 text-green-700 font-bold px-4 py-2 rounded-xl shadow-lg border border-green-200 z-50 animate-in slide-in-from-top-4">
          {message}
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3 mb-2">
          <Utensils className="w-8 h-8 text-(--color-brand)" />
          Uppskriftir
        </h1>
        <p className="text-(--color-text-secondary)">Umsjón með öllum deigum, sósum og samsetningum notenda.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-(--color-brand)" />
        </div>
      ) : (
        <RecipesSection 
          recipesList={recipes} 
          onRefresh={fetchRecipes} 
          showMessage={showMessage} 
        />
      )}
    </div>
  );
}
