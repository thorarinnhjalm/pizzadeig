'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch, query, limit, orderBy } from 'firebase/firestore';
import { mockRestaurants, mockMenuItems, mockAds } from '@/lib/mockData';
import { Users, Pizza, Store, Activity, Database, AlertTriangle } from 'lucide-react';

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ users: 0, recipes: 0, restaurants: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

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

  // Fetch admin stats if the user is verified as admin
  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      // Very basic top-level counting (not optimized for millions of docs, but fine for now)
      const uSnap = await getDocs(query(collection(db, 'users'), orderBy('joined_at', 'desc'), limit(10)));
      const rSnap = await getDocs(collection(db, 'recipes'));
      const stSnap = await getDocs(collection(db, 'restaurants'));
      
      setStats({
        users: uSnap.empty ? 0 : uSnap.size, // Note: real counting needs getCountFromServer
        recipes: rSnap.size,
        restaurants: stSnap.size
      });

      const recent = uSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setRecentUsers(recent);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-100 p-3 rounded-2xl">
          <Activity className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-(--color-text-primary)">Admin Mælaborð</h1>
          <p className="text-muted-foreground">Velkomin/n, {user.email}. Hér er yfirlit yfir vettvanginn.</p>
        </div>
      </div>
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-(--color-border) p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Nýir Notendur</p>
            <p className="text-3xl font-display font-extrabold">{stats.users}</p>
          </div>
        </div>
        
        <div className="bg-white border border-(--color-border) p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Pizza className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Uppskriftir</p>
            <p className="text-3xl font-display font-extrabold">{stats.recipes}</p>
          </div>
        </div>

        <div className="bg-white border border-(--color-border) p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Veitingastaðir</p>
            <p className="text-3xl font-display font-extrabold">{stats.restaurants}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Users */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-(--color-text-secondary)" /> 
            Nýskráningar
          </h2>
          <div className="bg-white border border-(--color-border) rounded-2xl overflow-hidden shadow-sm">
            {recentUsers.length > 0 ? (
              <div className="divide-y divide-(--color-border-light)">
                {recentUsers.map(ru => (
                  <div key={ru.uid} className="p-4 flex items-center gap-3">
                    {ru.avatar_url ? (
                      <img src={ru.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-(--color-bg-secondary) flex items-center justify-center border border-(--color-border)">
                        <Users className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{ru.display_name}</p>
                      <p className="text-xs text-muted-foreground">{ru.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Engir notendur fundust eða gagnagrunnur tómur.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Danger Zone & Seeder */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> 
            Gagnagrunns Stjórnun (Dev)
          </h2>
          
          <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Database className="w-4 h-4" /> 1. Fræfæða (Seed) Firebase
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tekur allar pizzur, staði og auglýsingar úr mockData og setur í lifandi Firebase gagnagrunninn með `is_seeded: true`.
              </p>
              <button 
                onClick={seedDatabase}
                disabled={loading}
                className="px-5 py-2 text-sm bg-white border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? 'Keyri...' : 'Sturta gögnum (Seed)'}
              </button>
            </div>

            <div className="border-t border-red-200/50 pt-5">
              <h3 className="text-lg font-bold mb-1 text-red-700">2. Hreinsa Gervigögn (Clear)</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Finnur öll skjöl í Firestore sem eru með `is_seeded: true` og eyðir þeim endanlega.
              </p>
              <button 
                onClick={clearSeededData}
                disabled={loading}
                className="px-5 py-2 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Eyði...' : 'Eyða öllum gervigögnum'}
              </button>
            </div>

            {message && (
              <div className="mt-4 p-3 bg-white border border-gray-200 text-sm rounded-lg font-mono">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
