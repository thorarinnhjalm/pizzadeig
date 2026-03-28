'use client';

import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Ad } from '@/types/ad';
import { Database, UploadCloud, Eye, MousePointerClick, Activity, ExternalLink, Pencil, Trash2, X, Check, ImageIcon } from 'lucide-react';

interface AdsSectionProps {
  adsList: Ad[];
  onRefresh: () => void;
  showMessage: (msg: string) => void;
}

export function AdsSection({ adsList, onRefresh, showMessage }: AdsSectionProps) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Create / Edit forms
  const [form, setForm] = useState<Partial<Ad>>({
    client: '', name: '', image_url: '', target_url: 'https://', format: '1018x360', status: 'active'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm({ client: '', name: '', image_url: '', target_url: 'https://', format: '1018x360', status: 'active' });
    setImageFile(null);
  };

  const startEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setForm({ ...ad });
    setImageFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.client || (!imageFile && !form.image_url)) {
        throw new Error('Vantar viðskiptavin og mynd/slóð.');
      }
      
      let finalImageUrl = form.image_url;
      if (imageFile) {
        showMessage('Hleð upp mynd...');
        const storageRef = ref(storage, `ads/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const isNew = editingId === 'new';
      const adId = isNew ? `ad-${Date.now()}` : editingId!;
      
      const payload: Partial<Ad> = {
        client: form.client,
        name: form.name || 'Án nafns',
        format: form.format as '1018x360' | '310x400',
        creatives: { [form.format as string]: finalImageUrl || '' },
        image_url: finalImageUrl,
        target_url: form.target_url,
        status: form.status as 'active' | 'paused' | 'ended',
        placements: form.format === '1018x360' ? ['home_hero'] : ['home_featured', 'recipe_sidebar'],
      };

      if (isNew) {
        payload.id = adId;
        payload.impressions = 0;
        payload.clicks = 0;
        payload.start_date = Timestamp.now();
        payload.end_date = Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000);
        payload.created_at = Timestamp.now();
        await setDoc(doc(db, 'ads', adId), payload);
        showMessage(`Auglýsing hefur verið vistuð! 🎉`);
      } else {
        await updateDoc(doc(db, 'ads', adId), payload);
        showMessage('Auglýsing uppfærð! ✅');
      }

      setEditingId(null);
      onRefresh();
    } catch (err) {
       console.error(err);
       const message = err instanceof Error ? err.message : 'Óþekkt villa';
       showMessage('Villa: ' + message);
    } finally {
       setLoading(false);
    }
  };

  const toggleStatus = async (ad: Ad) => {
    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    await updateDoc(doc(db, 'ads', ad.id), { status: newStatus });
    showMessage(`Auglýsing ${newStatus === 'active' ? 'virkjuð' : 'stöðvuð'}.`);
    onRefresh();
  };

  const handleDelete = async (ad: Ad) => {
    if (!window.confirm(`Eyða auglýsingu frá ${ad.client}?`)) return;
    await deleteDoc(doc(db, 'ads', ad.id));
    showMessage('Auglýsingu eytt. 🗑️');
    onRefresh();
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {editingId ? (
        /* CREATE / EDIT FORM */
        <div className="max-w-2xl bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-muted border-b border-border p-5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {editingId === 'new' ? <><Database className="w-5 h-5 text-primary"/> Búa til auglýsingu</> : <><Pencil className="w-5 h-5 text-primary"/> Breyta: {form.client}</>}
            </h2>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1">Viðskiptavinur</label>
                 <input required placeholder="t.d. Pizzan ehf." value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="w-full border border-border bg-background rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-colors" />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1">Heiti Herferðar</label>
                 <input placeholder="t.d. Vordagar 2026" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-border bg-background rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-colors" />
               </div>
             </div>
             
             <div className="p-4 border border-dashed border-border rounded-xl bg-muted/50">
                <label className="flex text-sm font-semibold mb-2 items-center gap-2"><UploadCloud className="w-5 h-5 text-blue-500"/> Hlaða upp mynd</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-background cursor-pointer file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors" />
                
                <div className="my-3 flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase">
                  <div className="flex-1 h-px bg-border"></div> eða slóð <div className="flex-1 h-px bg-border"></div>
                </div>

                <label className="block text-sm font-semibold mb-1">Beint URL</label>
                <input placeholder="https://..." value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full border border-border bg-background rounded-xl px-4 py-2 text-sm" />
             </div>

             <div>
               <label className="block text-sm font-semibold mb-1">Smellislóð (Target URL)</label>
               <input required placeholder="https://..." value={form.target_url} onChange={e => setForm({...form, target_url: e.target.value})} className="w-full border border-border bg-background rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-colors" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1">Sniðmát</label>
                 <select value={form.format} onChange={e => setForm({...form, format: e.target.value as '1018x360' | '310x400'})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background">
                   <option value="1018x360">Forsíðuborði (1018x360)</option>
                   <option value="310x400">Skjáauglýsing Hlið (310x400)</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1">Staða</label>
                 <select value={form.status} onChange={e => setForm({...form, status: e.target.value as 'active' | 'paused' | 'ended'})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background font-bold text-primary">
                   <option value="active">Virk</option>
                   <option value="paused">Í bið</option>
                 </select>
               </div>
             </div>
             
             <div className="pt-4 border-t border-border flex gap-3">
               <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold cursor-pointer transition-colors w-1/3">Hætta við</button>
               <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold cursor-pointer transition-colors flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                 {loading ? 'Vistar...' : <><Check className="w-5 h-5"/> Vista Auglýsingu</>}
               </button>
             </div>
          </form>
        </div>
      ) : (
        /* LIST VIEW */
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Allar auglýsingar ({adsList.length})
            </h2>
            <button onClick={startCreate} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer">
              + Ný auglýsing
            </button>
          </div>

          {adsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adsList.map(ad => {
                const imps = ad.impressions || 0;
                const clicks = ad.clicks || 0;
                const ctr = imps > 0 ? ((clicks / imps) * 100).toFixed(2) : '0.00';

                return (
                  <div key={ad.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-primary transition-all">
                    {/* Image preview */}
                    <div className="relative bg-muted h-32 flex items-center justify-center overflow-hidden border-b border-border">
                      {ad.image_url ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={ad.image_url} alt={`Auglýsing: ${ad.client}`} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                      ) : (
                         <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                      <span className={`absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded shadow-sm ${ad.status === 'active' ? 'bg-green-600/90' : 'bg-amber-600/90'}`}>
                        {ad.status === 'active' ? 'Virk' : 'Í bið'}
                      </span>
                      {ad.target_url && (
                        <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-1.5 bg-background/90 text-foreground text-[10px] font-bold rounded-lg flex items-center justify-center hover:bg-background transition-colors shadow-sm">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-lg font-display font-bold text-foreground line-clamp-1">{ad.client}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{ad.name || 'Án herferðarheitis'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mt-1">{ad.format}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-5 mt-auto border-t border-border pt-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center text-blue-600 mb-0.5"><Eye className="w-3.5 h-3.5" /></div>
                          <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{imps.toLocaleString('is-IS')}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center text-green-600 mb-0.5"><MousePointerClick className="w-3.5 h-3.5" /></div>
                          <p className="text-sm font-bold text-green-900 dark:text-green-100">{clicks.toLocaleString('is-IS')}</p>
                        </div>
                        <div className="text-center border-l border-border pl-2">
                          <div className="flex items-center justify-center text-purple-600 mb-0.5"><Activity className="w-3.5 h-3.5" /></div>
                          <p className="text-sm font-bold text-purple-900 dark:text-purple-100">{ctr}%</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(ad)} className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-muted text-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-colors shadow-sm cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" /> Breyta
                        </button>
                        <button onClick={() => toggleStatus(ad)} className={`flex justify-center items-center py-2 px-3 text-xs font-bold rounded-xl transition-colors cursor-pointer flex-1 ${ad.status === 'active' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'}`}>
                          {ad.status === 'active' ? '⏸ Gera Hlé' : '▶ Virkja'}
                        </button>
                        <button onClick={() => handleDelete(ad)} className="flex justify-center items-center py-2 px-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm">
              Engar auglýsingar fundust. Búðu til nýja!
            </div>
          )}
        </>
      )}
    </div>
  );
}
