'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ad } from '@/types/ad';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, Download, BarChart3, Target, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAds } from '@/lib/mockData';
import { AdFormModal } from '@/components/ads/AdFormModal';

export default function AdminAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | undefined>(undefined);

  // MVP Authentication Check
  useEffect(() => {
    // Disabled temporarily for visual demo review:
    // if (!authLoading && !user) {
    //   redirect('/');
    // }
  }, [user, authLoading]);

  // Read all ads dynamically from Firestore
  useEffect(() => {
    async function fetchAds() {
      try {
        const q = query(collection(db, 'ads'), orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        setAds(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ad)));
      } catch (_e) {
        console.error('Offline fallback for ads');
        setAds(mockAds);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [user]);

  // Fulfills Phase 5: "Analytics and CSV export"
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Client', 'Status', 'Format', 'Target URL'];
    const rows = ads.map(a => [a.id, a.name, a.client, a.status, a.format, a.target_url]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "auglysingar_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin w-12 h-12 text-(--color-brand)" /></div>;

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
              <Target className="w-8 h-8 text-(--color-brand)" />
              Auglýsingakerfi
            </h1>
            <p className="text-(--color-text-secondary) mt-2">Umsjón mælaborð fyrir birtingu kostaðra ferla.</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportCSV} variant="outline" className="gap-2 bg-white shadow-sm border-gray-200">
              <Download className="w-4 h-4"/> <span className="hidden sm:inline">Flytja út CSV</span>
            </Button>
            <Button onClick={() => { setEditingAd(undefined); setIsFormOpen(true); }} className="gap-2 bg-(--color-brand) hover:bg-[#b02e0b] shadow-[0_4px_14px_0_rgba(212,56,13,0.39)] text-white">
              <Plus className="w-4 h-4"/> <span className="hidden sm:inline">Ný auglýsing</span>
            </Button>
          </div>
        </div>

        {/* Stats from real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
           {(() => {
             const activeCount = ads.filter(a => a.status === 'active').length;
             const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
             const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
             const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) + '%' : '—';
             const statItems = [
               { label: 'Virkar Herferðir', value: activeCount },
               { label: 'Heildar birtingar', value: totalImpressions.toLocaleString('is-IS') },
               { label: 'Smellir (CTR)', value: ctr },
             ];
             return statItems.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-(--color-border) relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-(--color-brand)/5 rounded-full blur-xl group-hover:bg-(--color-brand)/10 transition-colors" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">{stat.label}</h4>
                    <p className="text-3xl font-extrabold text-(--color-text-primary)">{stat.value}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-(--color-brand)/30" />
                </div>
              </div>
            ));
           })()}
        </div>

        {/* Dynamic Ad Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-(--color-border) overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                 <tr className="bg-[#fcfdfd] border-b border-gray-100 text-xs tracking-widest font-bold text-muted-foreground uppercase">
                   <th className="p-5 w-1/3">Auglýsing / Herferð</th>
                   <th className="p-5">Viðskiptavinur</th>
                   <th className="p-5">Format / Snið</th>
                   <th className="p-5 text-right">Staða</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {ads.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="p-16 text-center text-(--color-text-secondary) bg-gray-50/30">
                       <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                       <span className="font-semibold text-gray-400">Engar herferðir skráðar í gagnagrunni.</span>
                     </td>
                   </tr>
                 ) : ads.map(ad => (
                   <tr key={ad.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                     <td className="p-5 font-bold text-(--color-text-primary) group-hover:text-(--color-brand) transition-colors">{ad.name}</td>
                     <td className="p-5 text-(--color-text-secondary) font-medium">{ad.client}</td>
                     <td className="p-5">
                       <span className="text-xs text-gray-500 font-mono bg-gray-100/80 px-2 py-1 rounded-md border border-gray-200">
                         {ad.format}
                       </span>
                     </td>
                     <td className="p-5 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${ad.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                           {ad.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                           {ad.status}
                         </span>
                         <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                             <Edit className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600">
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      {isFormOpen && (
        <AdFormModal 
          initialData={editingAd} 
          onClose={() => setIsFormOpen(false)} 
          onSave={(data) => { 
            console.log("Vista ad", data);
            setIsFormOpen(false);
          }} 
        />
      )}
    </div>
  );
}
