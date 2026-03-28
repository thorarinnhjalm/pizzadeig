'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Restaurant } from '@/types/restaurant';
import { RestaurantsSection } from '@/components/admin/RestaurantsSection';
import { Loader2, Store } from 'lucide-react';

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'restaurants'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
      setRestaurants(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage('Villa við að sækja staði: ' + (err instanceof Error ? err.message : 'Óþekkt villa'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
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
          <Store className="w-8 h-8 text-(--color-brand)" />
          Veitingastaðir
        </h1>
        <p className="text-(--color-text-secondary)">Umsjón með pizzastöðum framan á kortinu.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-(--color-brand)" />
        </div>
      ) : (
        <RestaurantsSection 
          restaurantsList={restaurants} 
          onRefresh={fetchRestaurants} 
          showMessage={showMessage} 
        />
      )}
    </div>
  );
}
