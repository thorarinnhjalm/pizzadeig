'use client';

import { useState, useEffect } from 'react';
import { db, auth, storage } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch, query, limit, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { mockRestaurants, mockMenuItems, mockAds } from '@/lib/mockData';
import { allRecipes } from '@/lib/recipeData';
import { Users, Pizza, Store, Activity, Database, AlertTriangle, UploadCloud, Eye, MousePointerClick, LayoutDashboard, Settings, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Tab stýring
  const [activeTab, setActiveTab] = useState<'yfirlit' | 'uppskriftir' | 'auglysingar' | 'kerfi'>('yfirlit');

  // Gögn
  const [stats, setStats] = useState({ users: 0, recipes: 0, restaurants: 0, menuItems: 0, ads: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<any[]>([]);

  // Form fyrir nýja auglýsingu
  const [adForm, setAdForm] = useState({
    client: '',
    name: '',
    image_url: '',
    target_url: 'https://',
    format: '1018x360',
    status: 'active'
  });
  const [adFile, setAdFile] = useState<File | null>(null);
  const [adLoading, setAdLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  useEffect(() => {
    if (isAdmin) loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const uSnap = await getDocs(query(collection(db, 'users'), orderBy('joined_at', 'desc'), limit(10)));
      const rSnap = await getDocs(collection(db, 'recipes'));
      const stSnap = await getDocs(collection(db, 'restaurants'));
      const mSnap = await getDocs(collection(db, 'menu_items'));
      const aSnap = await getDocs(collection(db, 'ads'));

      // Merge Firestore recipes with hardcoded recipeData
      const firestoreRecipes = rSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const firestoreRecipeIds = new Set(firestoreRecipes.map(r => r.id));
      const hardcodedRecipes = allRecipes
        .filter(r => !firestoreRecipeIds.has(r.id))
        .map(r => ({ ...r, _source: 'hardcoded' as const }));
      const mergedRecipes = [...firestoreRecipes, ...hardcodedRecipes];
      
      setStats({
        users: uSnap.empty ? 0 : uSnap.size,
        recipes: mergedRecipes.length,
        restaurants: stSnap.size,
        menuItems: mSnap.size,
        ads: aSnap.size
      });

      setRecentUsers(uSnap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setAdsList(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setRecipesList(mergedRecipes);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    setMessage('Byrja að fræfæða gagnagrunninn...');
    try {
      const batch = writeBatch(db);

      mockRestaurants.forEach((restaurant) => {
        const refD = doc(db, 'restaurants', restaurant.id);
        batch.set(refD, { ...restaurant, is_seeded: true, created_at: new Date() });
      });

      mockMenuItems.forEach((item) => {
        const refD = doc(db, 'menu_items', item.id);
        const restaurant = mockRestaurants.find(r => r.id === item.restaurant_id);
        batch.set(refD, { 
          ...item, 
          restaurant_name: restaurant?.name || '',
          is_seeded: true,
          created_at: new Date()
        });
      });

      mockAds.forEach((ad) => {
        const refD = doc(db, 'ads', ad.id);
        batch.set(refD, { ...ad, is_seeded: true, impressions: 0, clicks: 0, created_at: new Date() });
      });

      await batch.commit();
      setMessage('Gagnagrunnur var uppfærður með gervigögnum! 🎉');
      loadStats();
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
          if (document.data().is_seeded) {
            batch.delete(document.ref);
            count++;
          }
        });
        if (count > 0) await batch.commit();
      }
      setMessage('Öllum gervigögnum eytt! 🗑️');
      loadStats();
    } catch (error: any) {
      console.error(error);
      setMessage('Villa við að eyða: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdLoading(true);
    setMessage('');
    try {
      if (!adForm.client || (!adFile && !adForm.image_url)) {
        throw new Error('Vantar viðskiptavin, og annaðhvort skrá eða vefslóð á mynd.');
      }
      const newId = `ad-${Date.now()}`;
      let finalImageUrl = adForm.image_url;

      if (adFile) {
        setMessage('Hleð upp mynd í Firebase Storage...');
        const storageRef = ref(storage, `ads/${Date.now()}_${adFile.name}`);
        const snapshot = await uploadBytes(storageRef, adFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = doc(db, 'ads', newId);
      
      await setDoc(docRef, {
        id: newId,
        client: adForm.client,
        name: adForm.name || 'Án nafns',
        format: adForm.format,
        creatives: {
          [adForm.format]: finalImageUrl
        },
        image_url: finalImageUrl,
        target_url: adForm.target_url,
        status: adForm.status,
        placements: adForm.format === '1018x360' ? ['home_hero'] : ['home_featured', 'recipe_sidebar'],
        impressions: 0,
        clicks: 0,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date()
      });
      
      setMessage(`Auglýsing hefur verið vistuð með mynd og er nú virk í kerfinu! 🎉`);
      setAdForm({ client: '', name: '', image_url: '', target_url: 'https://', format: '1018x360', status: 'active' });
      setAdFile(null);
      
      const fileInput = document.getElementById('adFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      loadStats();
    } catch (error: any) {
      console.error(error);
      setMessage('Villa við að búa til auglýsingu: ' + error.message);
    } finally {
      setAdLoading(false);
    }
  };

  if (loading && !isAdmin && !user) {
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-2xl hidden sm:block">
            <LayoutDashboard className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-(--color-text-primary)">Admin Mælaborð</h1>
            <p className="text-muted-foreground">Velkomin/n, {user.email}.</p>
          </div>
        </div>
      </div>
      
      {/* TABS NAVIGATION */}
      <div className="flex gap-2 sm:gap-6 border-b border-(--color-border) mb-8 overflow-x-auto hide-scrollbar pb-1">
        <button 
          onClick={() => setActiveTab('yfirlit')} 
          className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all whitespace-nowrap rounded-t-lg ${activeTab === 'yfirlit' ? 'text-(--color-brand) border-b-2 border-(--color-brand) bg-(--color-brand)/5' : 'text-muted-foreground hover:text-(--color-text-primary) hover:bg-(--color-bg-secondary)'}`}
        >
          <Activity className="w-4 h-4" /> Yfirlit / Tölfræði
        </button>
        <button 
          onClick={() => setActiveTab('auglysingar')} 
          className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all whitespace-nowrap rounded-t-lg ${activeTab === 'auglysingar' ? 'text-(--color-brand) border-b-2 border-(--color-brand) bg-(--color-brand)/5' : 'text-muted-foreground hover:text-(--color-text-primary) hover:bg-(--color-bg-secondary)'}`}
        >
          <Database className="w-4 h-4" /> Auglýsingar
        </button>
        <button 
          onClick={() => setActiveTab('uppskriftir')} 
          className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all whitespace-nowrap rounded-t-lg ${activeTab === 'uppskriftir' ? 'text-(--color-brand) border-b-2 border-(--color-brand) bg-(--color-brand)/5' : 'text-muted-foreground hover:text-(--color-text-primary) hover:bg-(--color-bg-secondary)'}`}
        >
          <BookOpen className="w-4 h-4" /> Uppskriftir
        </button>
        <button 
          onClick={() => setActiveTab('kerfi')} 
          className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all whitespace-nowrap rounded-t-lg ${activeTab === 'kerfi' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50/50'}`}
        >
          <Settings className="w-4 h-4" /> Kerfisstjórnun
        </button>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-white border border-(--color-border) text-sm rounded-xl font-mono shadow-sm flex items-center justify-between">
          <span className="text-(--color-text-primary)">{message}</span>
          <button onClick={() => setMessage('')} className="text-muted-foreground hover:text-(--color-text-primary)">✕</button>
        </div>
      )}

      {/* --- TAB 1: YFIRLIT --- */}
      {activeTab === 'yfirlit' && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Notendur</p>
                <p className="text-2xl font-display font-extrabold">{stats.users}</p>
              </div>
            </div>
            
            <div className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Pizza className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Pizzur</p>
                <p className="text-2xl font-display font-extrabold">{stats.menuItems}</p>
              </div>
            </div>

            <div className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Staðir</p>
                <p className="text-2xl font-display font-extrabold">{stats.restaurants}</p>
              </div>
            </div>
            
            <button onClick={() => setActiveTab('uppskriftir')} className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-(--color-brand) hover:shadow-md transition-all text-left cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Uppskriftir</p>
                <p className="text-2xl font-display font-extrabold">{stats.recipes}</p>
              </div>
            </button>

            <div className="bg-white border border-(--color-border) p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Auglýsingar</p>
                <p className="text-2xl font-display font-extrabold">{stats.ads}</p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-(--color-text-secondary)" /> 
              Nýlegar Skráningar
            </h2>
            <div className="bg-white border border-(--color-border) rounded-2xl overflow-hidden shadow-sm">
              {recentUsers.length > 0 ? (
                <div className="divide-y divide-(--color-border-light)">
                  {recentUsers.map(ru => (
                    <div key={ru.uid} className="p-4 flex items-center gap-3 hover:bg-(--color-bg-secondary) transition-colors">
                      {ru.avatar_url ? (
                        <img src={ru.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-(--color-bg-secondary) flex items-center justify-center border border-(--color-border)">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-(--color-text-primary)">{ru.display_name}</p>
                        <p className="text-xs text-muted-foreground">{ru.email}</p>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {ru.joined_at?.toDate ? new Date(ru.joined_at.toDate()).toLocaleDateString('is-IS') : 'Óþekkt'}
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
        </div>
      )}

      {/* --- TAB: UPPSKRIFTIR --- */}
      {activeTab === 'uppskriftir' && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-(--color-brand)" />
            Allar uppskriftir í kerfinu ({recipesList.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4 -mt-4">
            {recipesList.filter((r: any) => r._source === 'hardcoded').length} úr recipeData (innbyggðar) · {recipesList.filter((r: any) => !r._source).length} í Firestore
          </p>
          
          <div className="bg-white border border-(--color-border) rounded-2xl overflow-hidden shadow-sm">
            {recipesList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-(--color-bg-secondary) border-b border-(--color-border)">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">#</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Titill (IS)</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Höfundur</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Slug</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">Erfiðleiki</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">Skammtar</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">Mynd</th>
                      <th className="px-4 py-3 font-semibold text-(--color-text-secondary)"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--color-border-light)">
                    {recipesList.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-(--color-text-primary) max-w-[250px] truncate">{r.title_is || r.title_en || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.author_name || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.slug || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            r.difficulty === 'audvelt' ? 'bg-green-100 text-green-700' :
                            r.difficulty === 'midlungs' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {r.difficulty === 'audvelt' ? 'Auðvelt' : r.difficulty === 'midlungs' ? 'Miðlungs' : r.difficulty || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{r.servings || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          {r.image_urls?.[0] ? (
                            <img src={r.image_urls[0]} alt="" className="w-10 h-10 rounded-lg object-cover inline-block" />
                          ) : (
                            <span className="text-muted-foreground text-xs">Engin</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {r.slug && (
                            <Link href={`/is/uppskriftir/${r.slug}`} target="_blank" className="text-(--color-brand) hover:underline inline-flex items-center gap-1 text-xs font-semibold">
                              Skoða <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Engar uppskriftir fundust í gagnagrunninum.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: AUGLÝSINGAR --- */}
      {activeTab === 'auglysingar' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-(--color-brand)" /> 
              Yfirlit Auglýsinga
            </h2>
            
            <div className="bg-white border border-(--color-border) rounded-2xl overflow-hidden shadow-sm">
              {adsList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-(--color-bg-secondary) border-b border-(--color-border)">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Auglýsandi</th>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Herferð</th>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">Birtingar</th>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">Smellir</th>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary) text-center">CTR %</th>
                        <th className="px-4 py-3 font-semibold text-(--color-text-secondary)">Staða</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--color-border-light)">
                      {adsList.map(ad => {
                        const imps = ad.impressions || 0;
                        const clicks = ad.clicks || 0;
                        const ctr = imps > 0 ? ((clicks / imps) * 100).toFixed(2) : '0.00';
                        
                        return (
                          <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium">{ad.client}</td>
                            <td className="px-4 py-3 text-muted-foreground">{ad.name}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                                <Eye className="w-3.5 h-3.5" /> {imps.toLocaleString('is-IS')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                                <MousePointerClick className="w-3.5 h-3.5" /> {clicks.toLocaleString('is-IS')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-xs">{ctr}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {ad.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Engar auglýsingar fundust. Búðu til nýja!
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Búa til nýja
            </h2>
            <div className="bg-white border border-(--color-border) p-6 rounded-2xl shadow-sm">
              <form onSubmit={createAd} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Viðskiptavinur</label>
                  <input required placeholder="t.d. Pizzan ehf." value={adForm.client} onChange={e => setAdForm({...adForm, client: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Heiti Herferðar</label>
                  <input placeholder="t.d. Vordagar 2026" value={adForm.name} onChange={e => setAdForm({...adForm, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                
                <div className="pt-2 pb-1">
                  <div className="h-px bg-(--color-border-light) w-full"></div>
                </div>

                <div>
                  <label className="flex text-sm font-semibold mb-1 items-center gap-1">
                    <UploadCloud className="w-4 h-4 text-blue-500"/> Hlaða upp mynd
                  </label>
                  <input 
                    id="adFileInput"
                    type="file" 
                    accept="image/*"
                    onChange={e => setAdFile(e.target.files?.[0] || null)}
                    className="w-full border rounded-lg px-3 py-2 text-xs bg-blue-50/50 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Eða beina smellislóð (URL)</label>
                  <input placeholder="https://unsplash..." value={adForm.image_url} onChange={e => setAdForm({...adForm, image_url: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                
                <div className="pt-2 pb-1">
                  <div className="h-px bg-(--color-border-light) w-full"></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Smellislóð (Target)</label>
                  <input required placeholder="https://..." value={adForm.target_url} onChange={e => setAdForm({...adForm, target_url: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sniðmát</label>
                    <select value={adForm.format} onChange={e => setAdForm({...adForm, format: e.target.value})} className="w-full border rounded-lg px-2 py-2 text-sm bg-white">
                      <option value="1018x360">Forsíðuborði</option>
                      <option value="310x400">Skjáauglýsing Hlið</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Staða</label>
                    <select value={adForm.status} onChange={e => setAdForm({...adForm, status: e.target.value})} className="w-full border rounded-lg px-2 py-2 text-sm bg-white">
                      <option value="active">Virk</option>
                      <option value="paused">Í bið</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={adLoading}
                  className="w-full mt-4 bg-(--color-brand) text-white font-bold py-3 rounded-xl hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                >
                  {adLoading ? 'Vistar / Hleður upp...' : 'Búa til Auglýsingu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: KERFI --- */}
      {activeTab === 'kerfi' && (
        <div className="animate-in fade-in duration-300 max-w-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" /> 
            Gagnagrunns Stjórnun (Dev)
          </h2>
          
          <div className="bg-red-50 border border-red-200 p-8 rounded-2xl space-y-8 shadow-sm">
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Database className="w-5 h-5" /> 1. Fræfæða (Seed) Firebase
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tekur allar pizzur, staði og upphaflegar auglýsingar úr mockData og setur í stöðugan Firebase gagnagrunninn (`is_seeded: true`). Mælt er með þessu í upphafi.
              </p>
              <button 
                onClick={seedDatabase}
                disabled={loading}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
              >
                {loading ? 'Keyri...' : 'Sturta gögnum inn í Firebase'}
              </button>
            </div>

            <div className="border-t border-red-200/50 pt-8">
              <h3 className="text-lg font-bold mb-2 text-red-700">2. Hreinsa Gervigögn (Clear)</h3>
              <p className="text-red-700/70 text-sm mb-4 font-medium">
                Varúð: Þetta mun eyða endanlega öllum skjölum í Firestore sem eru merkt sérstaklega sem gervigögn (`is_seeded: true`). Ekki afturkræft.
              </p>
              <button 
                onClick={clearSeededData}
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Eyði...' : 'Eyða öllum gervigögnum'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
