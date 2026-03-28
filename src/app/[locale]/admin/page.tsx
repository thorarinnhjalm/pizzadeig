'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { OverviewSection } from '@/components/admin/OverviewSection';
import { Loader2 } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Ad } from '@/types/ad';

interface DashboardData {
  stats: {
    users: number;
    recipes: number;
    restaurants: number;
    menuItems: number;
    ads: number;
  };
  recentUsers: { uid: string; email?: string; displayName?: string; role?: string; avatar_url?: string }[];
  recipesList: Recipe[];
  adsList: Ad[];
}

export default function AdminDashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(10)));
        const recipesSnap = await getDocs(query(collection(db, 'recipes'), limit(10)));
        const restaurantsSnap = await getDocs(collection(db, 'restaurants'));
        const adsSnap = await getDocs(collection(db, 'ads'));

        const recentUsers = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        const recipesList = recipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Recipe));
        const adsList = adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Ad));

        setData({
          stats: {
            users: usersSnap.size, // This is just a sample size due to limit, ideally use count()
            recipes: recipesSnap.size,
            restaurants: restaurantsSnap.size,
            menuItems: 0,
            ads: adsSnap.size,
          },
          recentUsers,
          recipesList,
          adsList,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center py-24 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <OverviewSection 
      stats={data.stats}
      recentUsers={data.recentUsers}
      adsList={data.adsList}
      recipesList={data.recipesList}
    />
  );
}
