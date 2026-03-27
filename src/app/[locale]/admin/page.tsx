'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { mockRestaurants, mockMenuItems, mockAds } from '@/lib/mockData';

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Compare the current user's email against a comma-separated list of admin emails in .env
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
        const userEmail = currentUser.email?.toLowerCase() || '';
        
        if (adminEmails.includes(userEmail)) {
          setIsAdmin(true);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const seedDatabase = async () => {
    setLoading(true);
    setMessage('Byrja að fræfæða gagnagrunninn...');
    try {
      const batch = writeBatch(db);

      // Seed Restaurants
      mockRestaurants.forEach((restaurant) => {
        const ref = doc(db, 'restaurants', restaurant.id);
        // Add a flag to easily identify seeded data
        batch.set(ref, { ...restaurant, is_seeded: true, created_at: new Date() });
      });

      // Seed Menu Items (Pizzas)
      mockMenuItems.forEach((item) => {
        const ref = doc(db, 'menu_items', item.id); // Or generate custom ID
        const restaurant = mockRestaurants.find(r => r.id === item.restaurant_id);
        batch.set(ref, { 
          ...item, 
          restaurant_name: restaurant?.name || '',
          is_seeded: true,
          created_at: new Date()
        });
      });

      // Seed Ads
      mockAds.forEach((ad) => {
        const ref = doc(db, 'ads', ad.id);
        batch.set(ref, { ...ad, is_seeded: true, created_at: new Date() });
      });

      await batch.commit();
      setMessage('Gagnagrunnur var uppfærður með gervigögnum! 🎉');
    } catch (error: any) {
      console.error(error);
      setMessage('Villa við að vista: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSeededData = async () => {
    if (!window.confirm('Ertu viss um að þú viljir eyða öllum gervigögnum úr Firebase?')) return;
    
    setLoading(true);
    setMessage('Eyði gervigögnum...');
    try {
      const collectionsToClear = ['restaurants', 'menu_items', 'ads'];
      
      for (const colName of collectionsToClear) {
        const querySnapshot = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        let count = 0;
        
        querySnapshot.forEach((document) => {
          // Aðeins eyða þeim sem eru merkt "is_seeded"
          if (document.data().is_seeded) {
            batch.delete(document.ref);
            count++;
          }
        });
        
        if (count > 0) {
          await batch.commit();
        }
      }
      
      setMessage('Öllum gervigögnum eytt! 🗑️');
    } catch (error: any) {
      console.error(error);
      setMessage('Villa við að eyða: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-muted-foreground animate-pulse">Eru að sannreyna aðgangsheimildir...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Aðgangur bannaður</h1>
        <p className="text-muted-foreground">Þú verður að skrá þig inn fyrst til að sjá þessa síðu.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Engin heimild</h1>
        <p className="text-muted-foreground">Þetta netfang ({user.email}) hefur ekki stjórnandaréttindi (Admin).</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-(--color-text-primary) mb-8">Admin: Gagnagrunns Stjórnun</h1>
      
      <div className="bg-(--color-bg-secondary) border border-(--color-border) p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">1. Fræfæða (Seed) Firebase</h2>
          <p className="text-muted-foreground mb-4">
            Tekur allar pizzur, staði og auglýsingar úr `mockData.ts` og setur í lifandi Firebase gagnagrunninn.  
            Setur `is_seeded: true` flagg á öll skjöl.
          </p>
          <button 
            onClick={seedDatabase}
            disabled={loading}
            className="px-6 py-2 bg-(--color-brand) text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Keyri...' : 'Sturta gögnum inn í Firebase'}
          </button>
        </div>

        <div className="border-t border-(--color-border) pt-6">
          <h2 className="text-xl font-bold mb-2 text-red-600">2. Hreinsa Gervigögn (Clear)</h2>
          <p className="text-muted-foreground mb-4">
            Finnur öll skjöl í Firestore sem eru með `is_seeded: true` og eyðir þeim endanlega. 
            Þettan snertir EKKI skjöl sem almennir notendur hafa búið til.
          </p>
          <button 
            onClick={clearSeededData}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Eyði...' : 'Eyða öllum gervigögnum'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-background border border-(--color-border) text-(--color-text-primary) rounded-lg font-mono text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
