'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Data types
import { Recipe } from '@/types/recipe';
import { Ad } from '@/types/ad';
import { Restaurant } from '@/types/restaurant';
import { allRecipes } from '@/lib/recipeData'; // Fallback
import { ShieldAlert, LogOut, X } from 'lucide-react';

// Sections
import { AdminSidebar, AdminSection } from '@/components/admin/AdminSidebar';
import { OverviewSection } from '@/components/admin/OverviewSection';
import { RecipesSection } from '@/components/admin/RecipesSection';
import { RestaurantsSection } from '@/components/admin/RestaurantsSection';
import { AdsSection } from '@/components/admin/AdsSection';
import { UsersSection } from '@/components/admin/UsersSection';
import { SystemSection } from '@/components/admin/SystemSection';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Global State
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [message, setMessage] = useState('');
  
  // Data States
  const [stats, setStats] = useState({ users: 0, recipes: 0, restaurants: 0, menuItems: 0, ads: 0 });
  const [recentUsers, setRecentUsers] = useState<Record<string, unknown>[]>([]);
  const [adsList, setAdsList] = useState<Ad[]>([]);
  const [recipesList, setRecipesList] = useState<Recipe[]>([]);
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Admin validation
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
        const userEmail = currentUser.email?.toLowerCase() || '';
        if (adminEmails.includes(userEmail)) setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    if (!isAdmin) return;
    try {
      const uSnap = await getDocs(query(collection(db, 'users'), orderBy('joined_at', 'desc'), limit(10)));
      const rSnap = await getDocs(collection(db, 'recipes'));
      const stSnap = await getDocs(collection(db, 'restaurants'));
      const mSnap = await getDocs(collection(db, 'menu_items'));
      const aSnap = await getDocs(collection(db, 'ads'));

      // Merge Recipes (Firestore + Fallback)
      const firestoreRecipes = rSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Recipe[];
      const firestoreRecipeIds = new Set(firestoreRecipes.map(r => r.id));
      const hardcodedRecipes = allRecipes
        .filter(r => !firestoreRecipeIds.has(r.id))
        .map(r => ({ ...r, status: 'published', published: true, is_seeded: false })) as unknown as Recipe[];
      const mergedRecipes = [...firestoreRecipes, ...hardcodedRecipes];

      setStats({
        users: uSnap.empty ? 0 : uSnap.size, // Size limitation for users but serves intent
        recipes: mergedRecipes.length,
        restaurants: stSnap.size,
        menuItems: mSnap.size,
        ads: aSnap.size
      });

      setRecentUsers(uSnap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setAdsList(aSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Ad[]);
      setRecipesList(mergedRecipes);
      setRestaurantsList(stSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Restaurant[]);

    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  if (loading && !isAdmin && !user) {
    return (
      <div className="fixed inset-0 bg-(--color-bg-primary) z-50 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-bold">Verið að sannreyna aðgang...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="fixed inset-0 bg-(--color-bg-primary) z-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm w-full border border-(--color-border)">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Aðgangur Læstur</h1>
          <p className="text-sm text-muted-foreground mb-6">Þetta svæði er eingöngu fyrir starfsfólk Pizzadeigs.</p>
          <button onClick={() => router.push('/')} className="w-full bg-(--color-brand) text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-colors">
            Fara á forsíðu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-(--color-bg-primary) z-50 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 flex flex-col relative text-(--color-text-primary)">
        
        {/* Top App Bar */}
        <header className="bg-white border-b border-(--color-border) h-16 flex items-center justify-between px-8 sticky top-0 z-20 shrink-0">
           <div className="flex items-center gap-4 flex-1">
             <h2 className="font-bold text-lg hidden sm:block">Pizzadeig Vefstjórnarkerfi</h2>
           </div>
           
           <div className="flex items-center gap-4">
             {/* User Profile Info */}
             <div className="flex items-center gap-3 border-l border-(--color-border) pl-4">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold leading-tight">{user.displayName || 'Stjórnandi'}</p>
                 <p className="text-[10px] text-muted-foreground">{user.email}</p>
               </div>
               <button onClick={() => auth.signOut()} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer" title="Skrá út">
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
           </div>
        </header>

        {/* Global Toast Message */}
        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-3 rounded-xl shadow-xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-4 fade-in">
            {message}
            <button onClick={() => setMessage('')} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Section Content Rendering */}
        <div className="p-8 max-w-7xl mx-auto w-full pb-24">
          {activeSection === 'overview' && (
            <OverviewSection stats={stats} recentUsers={recentUsers} adsList={adsList} recipesList={recipesList} />
          )}
          
          {activeSection === 'recipes' && (
            <RecipesSection recipesList={recipesList} onRefresh={loadData} showMessage={showMessage} />
          )}

          {activeSection === 'restaurants' && (
            <RestaurantsSection restaurantsList={restaurantsList} onRefresh={loadData} showMessage={showMessage} />
          )}

          {activeSection === 'ads' && (
            <AdsSection adsList={adsList} onRefresh={loadData} showMessage={showMessage} />
          )}

          {activeSection === 'users' && (
            <UsersSection recentUsers={recentUsers} showMessage={showMessage} onRefresh={loadData} />
          )}

          {activeSection === 'settings' && (
            <SystemSection showMessage={showMessage} onRefresh={loadData} user={user} />
          )}

          {activeSection === 'analytics' && (
            <div className="text-center py-20 text-muted-foreground w-full max-w-lg mx-auto bg-white border rounded-3xl mt-10">
              <h2 className="text-xl font-bold mb-2">Google Analytics Gögn</h2>
              <p className="text-sm">Væntanlegt í næstu uppfærslu: Tenging við GA4 API fyrir lifandi línurit á umferð.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
