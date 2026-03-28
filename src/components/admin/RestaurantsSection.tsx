'use client';

import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Restaurant } from '@/types/restaurant';
import { Plus, Search, Pencil, Trash2, X, Check, UploadCloud, Link as LinkIcon, MapPin, Store } from 'lucide-react';

interface RestaurantsSectionProps {
  restaurantsList: Restaurant[];
  onRefresh: () => void;
  showMessage: (msg: string) => void;
}

export function RestaurantsSection({ restaurantsList, onRefresh, showMessage }: RestaurantsSectionProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Restaurant>>({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filtered = restaurantsList.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.city && r.city.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (r: Restaurant) => {
    setEditingId(r.id);
    setForm({ ...r });
    setImageFile(null);
  };

  const handleCreateNew = () => {
    setEditingId('new');
    setForm({
      id: `rest-${Date.now()}`,
      name: '',
      slug: '',
      city: 'Reykjavík',
      address: '',
      postal_code: '101',
      description_is: '',
      rating_google: 0,
      price_level: 2,
      is_verified: false,
      is_seeded: false,
    });
    setImageFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name) return;
    setLoading(true);
    try {
      let imageUrls = form.image_urls || [];
      if (imageFile) {
        showMessage('Hleð upp mynd...');
        const storageRef = ref(storage, `restaurants/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls = [downloadUrl, ...imageUrls];
      }

      const restData = {
        ...form,
        image_urls: imageUrls,
        updated_at: new Date()
      };
      
      if (editingId === 'new') {
         await setDoc(doc(db, 'restaurants', form.id), { ...restData, created_at: new Date() });
      } else {
         await updateDoc(doc(db, 'restaurants', form.id), restData);
      }

      showMessage(`Staður "${form.name}" vistaður! ✅`);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage('Villa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Viltu örugglega eyða veitingastaðnum "${name}"?`)) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'restaurants', id));
      showMessage('Stað eytt. 🗑️');
      onRefresh();
    } catch (err: any) {
      showMessage('Villa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {editingId ? (
        <div className="bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gray-50 border-b border-(--color-border) p-5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-(--color-brand)" />
              {editingId === 'new' ? 'Nýr Staður' : `Breyta: ${form.name}`}
            </h2>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nafn <span className="text-red-500">*</span></label>
                <input required value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Slug (vefslóð) <span className="text-red-500">*</span></label>
                <input required value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-')})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 font-mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Lýsing</label>
                <textarea rows={3} value={form.description_is || ''} onChange={e => setForm({...form, description_is: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Heimilisfang</label>
                <input value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" />
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                   <label className="block text-sm font-semibold mb-1">Póstnúmer</label>
                   <input value={form.postal_code || ''} onChange={e => setForm({...form, postal_code: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" />
                 </div>
                 <div className="flex-2">
                   <label className="block text-sm font-semibold mb-1">Borg/Bær</label>
                   <input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Sími</label>
                <input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Vefsíða</label>
                <input value={form.website || ''} onChange={e => setForm({...form, website: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" placeholder="https://" />
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-semibold mb-1">Mynd (Upload)</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border rounded-xl px-3 py-2 text-xs bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1">Slóð á mynd (URL)</label>
                 <input value={form.image_urls?.[0] || ''} onChange={e => setForm({...form, image_urls: [e.target.value]})} className="w-full border rounded-xl px-4 py-2 text-sm bg-white" />
               </div>
            </div>

            <div className="border-t pt-4 flex gap-6 items-center">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" checked={form.is_verified || false} onChange={e => setForm({...form, is_verified: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-(--color-brand) focus:ring-(--color-brand)" />
                 <span className="text-sm font-bold">Staðfesta eigendur (Verified badge)</span>
               </label>
               <div>
                  <label className="block text-sm font-semibold mb-1">Google Rating</label>
                  <input type="number" step="0.1" value={form.rating_google || 0} onChange={e => setForm({...form, rating_google: parseFloat(e.target.value)})} className="w-24 border rounded-xl px-3 py-1.5 text-sm bg-white" />
               </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">Hætta við</button>
              <button type="submit" disabled={loading} className="px-8 py-3 font-bold text-white bg-(--color-brand) hover:bg-opacity-90 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
                {loading ? 'Vistar...' : <><Check className="w-5 h-5"/> Vista Stað</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
             <div className="relative flex-1 w-full sm:max-w-md">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Leita að stað eða borg..." className="w-full pl-9 pr-4 py-2 bg-white border border-(--color-border) rounded-xl text-sm focus:outline-none focus:border-(--color-brand) transition-colors" />
             </div>
             <button onClick={handleCreateNew} className="shrink-0 flex items-center gap-2 bg-background border border-(--color-border) hover:border-(--color-brand) hover:text-(--color-brand) font-bold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer w-full sm:w-auto justify-center">
               <Plus className="w-4 h-4" /> Nýr Staður
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="bg-white border border-(--color-border) rounded-2xl shadow-sm p-4 flex gap-4 hover:border-(--color-brand) transition-all items-center">
                 {r.image_urls?.[0] ? (
                    <img src={r.image_urls[0]} alt={r.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-(--color-border-light)" />
                 ) : (
                    <div className="w-20 h-20 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                      <Store className="w-8 h-8 opacity-50" />
                    </div>
                 )}
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                     <h3 className="font-display font-bold text-lg text-(--color-text-primary) truncate">{r.name}</h3>
                     {r.is_verified && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                   </div>
                   <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                     <MapPin className="w-3 h-3" /> {r.city || 'Óþekkt'}, {r.postal_code || ''}
                   </p>
                   {r.rating_google && r.rating_google > 0 && (
                     <p className="text-[10px] font-bold tracking-wide flex items-center gap-1 text-amber-600 mb-3">
                       ★ {r.rating_google} á Google
                     </p>
                   )}
                   <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(r)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm">Breyta</button>
                      <button onClick={() => handleDelete(r.id, r.name)} className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
