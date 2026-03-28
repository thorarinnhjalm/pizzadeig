'use client';

import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Recipe, Ingredient } from '@/types/recipe';
import { Plus, Search, Filter, UtensilsCrossed, Pencil, Trash2, Eye, EyeOff, X, Check, UploadCloud, Link as LinkIcon } from 'lucide-react';

interface RecipesSectionProps {
  recipesList: Recipe[];
  onRefresh: () => void;
  showMessage: (msg: string) => void;
}

export function RecipesSection({ recipesList, onRefresh, showMessage }: RecipesSectionProps) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'published' | 'draft'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Recipe>>({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Filter recipes
  const filtered = recipesList.filter(r => {
    const matchesSearch = r.title_is.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesMode = filterMode === 'all' 
      ? true 
      : filterMode === 'published' 
      ? r.published && r.status === 'published'
      : !r.published || r.status === 'draft';
    return matchesSearch && matchesMode;
  });

  const handleEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setForm({ ...recipe });
    setImageFile(null);
  };

  const handleCreateNew = () => {
    setEditingId('new');
    setForm({
      id: `rcp-${Date.now()}`,
      title_is: '',
      title_en: '',
      slug: '',
      description_is: '',
      category: 'pizza',
      type: 'heildar',
      difficulty: 'midlungs',
      servings: 2,
      ingredients_is: [],
      steps_is: [],
      tags: [],
      status: 'draft',
      published: false
    });
    setImageFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.title_is) return;
    setLoading(true);
    try {
      let imageUrls = form.image_urls || [];
      
      // Upload new image if selected
      if (imageFile) {
        showMessage('Hleð upp mynd...');
        const storageRef = ref(storage, `recipes/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls = [downloadUrl, ...imageUrls];
      }

      const recipeData = {
        ...form,
        image_urls: imageUrls,
        updated_at: new Date()
      };
      
      if (editingId === 'new') {
         await setDoc(doc(db, 'recipes', form.id), { ...recipeData, created_at: new Date() });
      } else {
         await updateDoc(doc(db, 'recipes', form.id), recipeData);
      }

      showMessage(`Uppskrift "${form.title_is}" var vistuð! ✅`);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      showMessage('Villa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Viltu örugglega eyða uppskriftinni "${title}"? Þetta er ekki afturkræft.`)) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'recipes', id));
      showMessage('Uppskrift eytt. 🗑️');
      onRefresh();
    } catch (err: any) {
      showMessage('Villa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add ingredient helper
  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients_is: [...(prev.ingredients_is || []), { name: '', amount: '0', unit: 'g' }]
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngs = [...(form.ingredients_is || [])];
    newIngs[index] = { ...newIngs[index], [field]: value };
    setForm({ ...form, ingredients_is: newIngs });
  };

  const removeIngredient = (index: number) => {
    setForm({ ...form, ingredients_is: (form.ingredients_is || []).filter((_, i) => i !== index) });
  };

  // UI rendering
  return (
    <div className="animate-in fade-in duration-300">
      {editingId ? (
        /* EDIT FORM */
        <div className="bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-(--color-border) p-5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-(--color-brand)" />
              {editingId === 'new' ? 'Ný Uppskrift' : `Breyta: ${form.title_is}`}
            </h2>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-8">
            {/* GRUNNUPPLÝSINGAR */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">1. Grunnupplýsingar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Titill (ÍS) <span className="text-red-500">*</span></label>
                  <input required value={form.title_is || ''} onChange={e => setForm({...form, title_is: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Slug (vefslóð) <span className="text-red-500">*</span></label>
                  <input required value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-')})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:bg-white font-mono" placeholder="t.d. margherita-pizza" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Lýsing (ÍS)</label>
                  <textarea rows={3} value={form.description_is || ''} onChange={e => setForm({...form, description_is: e.target.value})} className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:bg-white resize-none" />
                </div>
              </div>
            </section>

            {/* FLOKKUN & TÍMI */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">2. Flokkun & Tími</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Flokkur</label>
                  <select value={form.category || 'pizza'} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white">
                    <option value="pizza">Pizza</option>
                    <option value="dough">Deig</option>
                    <option value="sauce">Sósa</option>
                    <option value="side">Meðlæti</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Erfiðleikastig</label>
                  <select value={form.difficulty || 'medium'} onChange={e => setForm({...form, difficulty: e.target.value as any})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white">
                    <option value="easy">Létt</option>
                    <option value="medium">Miðlungs</option>
                    <option value="hard">Erfitt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Skammtar (manna)</label>
                  <input type="number" min="1" value={form.servings || 1} onChange={e => setForm({...form, servings: parseInt(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Staða</label>
                  <select value={form.status || 'draft'} onChange={e => setForm({...form, status: e.target.value as any, published: e.target.value === 'published'})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white font-bold">
                    <option value="draft">Í bið (Draft)</option>
                    <option value="published">Birt (Published)</option>
                    <option value="archived">Geymsla (Archived)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Undirbúningur (mín)</label>
                  <input type="number" value={form.prep_time_min || 0} onChange={e => setForm({...form, prep_time_min: parseInt(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Eldun (mín)</label>
                  <input type="number" value={form.cook_time_min || 0} onChange={e => setForm({...form, cook_time_min: parseInt(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Hvíldartími (mín)</label>
                  <input type="number" value={form.rest_time_min || 0} onChange={e => setForm({...form, rest_time_min: parseInt(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm bg-white" />
                </div>
              </div>
            </section>

            {/* MYNDIR & MIÐLAR */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">3. Myndir & Miðlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-2xl p-4 bg-gray-50 border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <label className="font-bold text-sm bg-white border px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
                    Sækja mynd úr tölvu
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                  {imageFile && <p className="text-xs text-green-600 mt-2 font-bold">{imageFile.name}</p>}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Eða beina slóð á mynd (URL)</label>
                    <input 
                      value={form.image_urls?.[0] || ''} 
                      onChange={e => setForm({...form, image_urls: [e.target.value]})} 
                      className="w-full border rounded-xl px-4 py-2 text-sm bg-white" placeholder="https://" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Myndband URL (T.d. YouTube/TikTok)</label>
                    <input 
                      value={form.video_url || ''} 
                      onChange={e => setForm({...form, video_url: e.target.value})} 
                      className="w-full border rounded-xl px-4 py-2 text-sm bg-white" placeholder="https://" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* INNIHALD & LEIÐBEININGAR (Einfaldar útgáfur f. texta) */}
            <section className="space-y-4 text-sm">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">4. Innihald & Skref (Íslenska)</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                   <div className="flex justify-between items-center mb-2">
                     <label className="font-semibold">Hráefni (Ingredients)</label>
                     <button type="button" onClick={addIngredient} className="text-xs font-bold text-(--color-brand) hover:underline">+ Bæta við hráefni</button>
                   </div>
                   <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                     {(form.ingredients_is || []).map((ing, i) => (
                       <div key={i} className="flex gap-2 items-center">
                         <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} placeholder="Nafn hráefnis" className="flex-1 border rounded-lg px-2 py-1 text-sm" />
                         <input type="text" value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)} className="w-16 border rounded-lg px-2 py-1 text-sm text-center" />
                         <input value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} placeholder="g" className="w-12 border rounded-lg px-2 py-1 text-sm text-center" />
                         <button type="button" onClick={() => removeIngredient(i)} className="text-muted-foreground hover:text-red-500"><X className="w-4 h-4"/></button>
                       </div>
                     ))}
                     {(!form.ingredients_is || form.ingredients_is.length === 0) && <p className="text-xs text-muted-foreground italic">Engin hráefni skráð.</p>}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block font-semibold mb-2">Skref (Milli lína)</label>
                   <textarea rows={10} value={(form.steps_is || []).join('\n')} onChange={e => setForm({...form, steps_is: e.target.value.split('\n').filter(s => s.trim() !== '')})} className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white resize-y" placeholder="Sláðu inn hvert skref og ýttu á Enter (ný lína)..." />
                 </div>
               </div>
            </section>

            {/* AÐGERÐIR */}
            <div className="pt-6 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">Hætta við</button>
              <button type="submit" disabled={loading} className="px-8 py-3 font-bold text-white bg-(--color-brand) hover:bg-opacity-90 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
                {loading ? 'Vistar...' : <><Check className="w-5 h-5"/> Vista Uppskrift</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
             <div className="flex gap-2 bg-gray-100 p-1 rounded-xl shrink-0 w-full sm:w-auto">
               <button onClick={() => setFilterMode('all')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${filterMode === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Allar ({recipesList.length})</button>
               <button onClick={() => setFilterMode('published')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1 justify-center ${filterMode === 'published' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}><Eye className="w-3.5 h-3.5"/> Birtar</button>
               <button onClick={() => setFilterMode('draft')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1 justify-center ${filterMode === 'draft' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500'}`}><EyeOff className="w-3.5 h-3.5"/> Í bið</button>
             </div>
             
             <div className="flex gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Leita í uppskriftum..." className="w-full pl-9 pr-4 py-2 bg-white border border-(--color-border) rounded-xl text-sm focus:outline-none focus:border-(--color-brand) transition-colors" />
               </div>
               <button onClick={handleCreateNew} className="shrink-0 flex items-center gap-2 bg-background border border-(--color-border) hover:border-(--color-brand) hover:text-(--color-brand) font-bold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer">
                 <Plus className="w-4 h-4" /> Ný Uppskrift
               </button>
             </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(recipe => (
              <div key={recipe.id} className="bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-(--color-brand) transition-all group">
                {/* Image */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  {recipe.image_urls?.[0] ? (
                    <img src={recipe.image_urls[0]} alt={recipe.title_is} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                       <UtensilsCrossed className="w-8 h-8 opacity-50" />
                       <span className="text-sm font-bold ml-1">{recipe.rating_avg?.toFixed(1) || '0.0'}</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                       recipe.status === 'published' ? 'bg-green-500/90 text-white' : 
                       recipe.status === 'draft' ? 'bg-amber-500/90 text-white' : 
                       'bg-gray-500/90 text-white'
                     }`}>
                       {recipe.status === 'published' ? 'Birt' : recipe.status === 'draft' ? 'Í bið' : 'Geymd'}
                     </span>
                     {recipe.is_seeded && (
                       <span className="bg-blue-600/90 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">Seeded</span>
                     )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 flex justify-between items-center">
                    <span>{recipe.category || 'pizza'} • {recipe.difficulty || 'medium'}</span>
                    <span>{recipe.rating_count ? `★ ${recipe.rating_avg}` : ''}</span>
                  </div>
                  <h3 className="font-display font-bold leading-tight text-lg mb-1 text-(--color-text-primary) line-clamp-1">{recipe.title_is}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{recipe.description_is || 'Engin lýsing'}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-(--color-border-light)">
                    <button onClick={() => handleEdit(recipe)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" /> Breyta
                    </button>
                    <a href={`/is/uppskriftir/${recipe.slug}`} target="_blank" className="flex justify-center items-center py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg transition-colors cursor-pointer">
                      <LinkIcon className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(recipe.id, recipe.title_is)} className="flex justify-center items-center py-1.5 px-3 bg-gray-50 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="bg-white border border-(--color-border) rounded-2xl p-12 text-center text-muted-foreground">
               Engar uppskriftir fundust með þessum leitarskilyrðum.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
