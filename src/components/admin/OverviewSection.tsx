'use client';

import React from 'react';
import {
  Users,
  UtensilsCrossed,
  MessageSquareText,
  TrendingUp,
  Megaphone,
  Bell,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Ad } from '@/types/ad';

interface OverviewSectionProps {
  stats: { users: number; recipes: number; restaurants: number; menuItems: number; ads: number };
  recentUsers: any[];
  adsList: Ad[];
  recipesList: Recipe[];
}

export function OverviewSection({ stats, recentUsers, adsList, recipesList }: OverviewSectionProps) {
  // Demo trends
  const trends = [
    { label: 'Uppskriftir', value: stats.recipes, change: '+12%', isUp: true, icon: UtensilsCrossed, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Notendur', value: stats.users, change: '+24%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Umsagnir', value: 142, change: '-4%', isUp: false, icon: MessageSquareText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Auglýsingatekjur', value: '450.k', change: '+38%', isUp: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const pendingRecipes = recipesList.filter(r => !r.published || r.status === 'draft').slice(0, 4);
  const activeAds = adsList.filter(a => a.status === 'active');

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-(--color-text-primary)">
            Yfirlit & Tölfræði
          </h2>
          <p className="text-muted-foreground">Velkomin aftur, hér er staðan á kerfinu í dag.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-(--color-border) text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-red-50 hover:text-(--color-brand) transition-colors flex items-center gap-2 cursor-pointer">
            Sækja Skýrslu
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trends.map((t, idx) => (
          <div key={idx} className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex flex-col hover:border-(--color-brand) transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${t.bg} ${t.color} group-hover:scale-110 transition-transform`}>
                <t.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${t.isUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                {t.isUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {t.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Heildar {t.label}</p>
              <h3 className="text-3xl font-display font-extrabold">{t.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Recipes */}
          <div className="bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-(--color-border) flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Uppskriftir í bið
              </h3>
              <button className="text-xs font-bold text-(--color-brand) hover:underline cursor-pointer">
                Sjá allar (+{Math.max(0, pendingRecipes.length - 4)})
              </button>
            </div>
            {pendingRecipes.length > 0 ? (
              <div className="divide-y divide-(--color-border-light)">
                {pendingRecipes.map(r => (
                  <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       {r.image_urls?.[0] ? (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                            <img src={r.image_urls[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                       ) : (
                          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                            <UtensilsCrossed className="w-5 h-5" />
                          </div>
                       )}
                       <div>
                         <p className="font-bold text-sm">{r.title_is}</p>
                         <p className="text-xs text-muted-foreground line-clamp-1">{r.description_is}</p>
                         <p className="text-xs text-muted-foreground">Eftir: {r.author_uid || 'Kerfi'}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                        Virkja
                      </button>
                      <button className="px-3 py-1.5 text-xs font-bold bg-white border border-(--color-border) hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        Skoða
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Engar uppskriftir bíða samþykkis.
              </div>
            )}
          </div>

          {/* User Signups */}
          <div className="bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-(--color-border) bg-gray-50/50">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Nýjustu Notendur
              </h3>
            </div>
            {recentUsers.length > 0 ? (
              <div className="divide-y divide-(--color-border-light)">
                 {recentUsers.slice(0, 5).map((u, i) => (
                  <div key={u.uid} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-(--color-bg-secondary) flex items-center justify-center border border-(--color-border)">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{u.displayName || 'Ónefndur'}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider bg-gray-100 px-2 py-1 rounded">
                      {u.joined_at?.toDate ? new Date(u.joined_at.toDate()).toLocaleDateString('is-IS') : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
               <div className="p-8 text-center text-sm text-muted-foreground">Engir notendur fundust...</div>
            )}
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Ad Status Card (Dark) */}
          <div className="bg-stone-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-brand) rounded-full blur-[80px] opacity-30 mt-[-20px] mr-[-20px]"></div>
             <h3 className="font-bold flex items-center gap-2 mb-4 relative z-10">
               <Megaphone className="w-5 h-5 text-red-400" />
               Auglýsingastýring
             </h3>
             <div className="mb-6 relative z-10">
               <div className="text-4xl font-display font-extrabold mb-1">{activeAds.length}</div>
               <div className="text-sm text-stone-400">Virkar herferðir í keyrslu núna</div>
             </div>
             <button className="w-full py-2.5 bg-white text-stone-900 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors cursor-pointer relative z-10">
               Skoða Herferðir
             </button>
          </div>

          {/* System Health */}
          <div className="bg-white border border-(--color-border) rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-(--color-brand)" />
              Kerfisheilsa
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Gagnagrunnur</span>
                  <span className="text-green-600">eðlilegur</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>API Svaranir</span>
                  <span className="text-green-600">tæpar 18ms</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '98%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Geymslurými Images</span>
                  <span className="text-amber-600">76% fullt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '76%' }}></div></div>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white border border-(--color-border) rounded-2xl shadow-sm p-2">
             <div className="p-3 border-b border-(--color-border-light) flex gap-2 items-center">
               <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                 <Bell className="w-4 h-4" /> 
               </div>
               <h3 className="font-bold text-sm">Tilkynningar</h3>
               <span className="ml-auto bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Nýjar</span>
             </div>
             <div className="p-2 space-y-1">
               <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                 <p className="text-xs font-semibold mb-0.5">Umsögn flagguð sem spam</p>
                 <p className="text-[10px] text-muted-foreground">Kerfið flaggaði umsögn um "Flatey".</p>
               </div>
               <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                 <p className="text-xs font-semibold mb-0.5">Nýr veitingastaður skráður</p>
                 <p className="text-[10px] text-muted-foreground">Eigandi var að skrá veitingastaðinn "Blackbox" og biður um... </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
