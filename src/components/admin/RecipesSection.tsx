'use client';

import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Recipe, Ingredient, Difficulty } from '@/types/recipe';
import { Plus, Search, UtensilsCrossed, Pencil, Trash2, Eye, EyeOff, X, Check, UploadCloud, Link as LinkIcon } from 'lucide-react';

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
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Óþekkt villa';
      showMessage('Villa: ' + message);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Óþekkt villa';
      showMessage('Villa: ' + message);
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

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
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
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-muted border-b border-border p-5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              {editingId === 'new' ? 'Ný Uppskrift' : `Breyta: ${form.title_is}`}
            </h2>
            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-8">
            {/* GRUNNUPPLÝSINGAR */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">1. Grunnupplýsingar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-foreground/70 uppercase tracking-wider">Heiti uppskriftar (Íslenska)</label>
                  <input
                    required
                    value={form.title_is || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, title_is: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-5 py-3 text-foreground focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-foreground/70 uppercase tracking-wider">Title (English)</label>
                  <input
                    required
                    value={form.title_en || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, title_en: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-5 py-3 text-foreground focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Slug (vefslóð) <span className="text-red-500">*</span></label>
                  <input required value={form.slug || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, slug: e.target.value.toLowerCase().replace(/[\s_]+/g, '-')})} className="w-full border border-border rounded-xl px-4 py-2 text-sm bg-background focus:border-primary outline-none font-mono" placeholder="t.d. margherita-pizza" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Lýsing (ÍS)</label>
                  <textarea rows={3} value={form.description_is || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({...form, description_is: e.target.value})} className="w-full border border-border rounded-xl px-4 py-2 text-sm bg-background focus:border-primary outline-none resize-none" />
                </div>
              </div>
            </section>

            {/* FLOKKUN & TÍMI */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">2. Flokkun & Tími</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-foreground/70 uppercase tracking-wider">Erfiðleikastig</label>
                  <select
                    value={form.difficulty || 'midlungs'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                    className="w-full bg-background border border-border rounded-xl px-5 py-3 text-foreground focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="audvelt">Auðvelt</option>
                    <option value="midlungs">Miðlungs</option>
                    <option value="erfitt">Erfitt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Flokkur</label>
                  <select value={form.category || 'pizza'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({...form, category: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background">
                    <option value="pizza">Pizza</option>
                    <option value="dough">Deig</option>
                    <option value="sauce">Sósa</option>
                    <option value="side">Meðlæti</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Skammtar (manna)</label>
                  <input type="number" min="1" value={form.servings || 1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, servings: parseInt(e.target.value)})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Staða</label>
                  <select value={form.status || 'draft'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({...form, status: e.target.value as 'draft' | 'published' | 'archived', published: e.target.value === 'published'})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background font-bold text-primary">
                    <option value="draft">Í bið (Draft)</option>
                    <option value="published">Birt (Published)</option>
                    <option value="archived">Geymsla (Archived)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Undirbúningur (mín)</label>
                  <input type="number" value={form.prep_time_min || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, prep_time_min: parseInt(e.target.value)})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Eldun (mín)</label>
                  <input type="number" value={form.cook_time_min || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, cook_time_min: parseInt(e.target.value)})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Hvíldartími (mín)</label>
                  <input type="number" value={form.rest_time_min || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, rest_time_min: parseInt(e.target.value)})} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
                </div>
              </div>
            </section>

            {/* MYNDIR & MIÐLAR */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">3. Myndir & Miðlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-dashed border-border rounded-2xl p-4 bg-muted/30 text-center flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <label className="font-bold text-sm bg-background border border-border px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-muted transition-colors">
                    Sækja mynd úr tölvu
                    <input type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                  {imageFile && <p className="text-xs text-green-600 mt-2 font-bold">{imageFile.name}</p>}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Eða beina slóð á mynd (URL)</label>
                    <input 
                      value={form.image_urls?.[0] || ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, image_urls: [e.target.value]})} 
                      className="w-full border border-border rounded-xl px-4 py-2 text-sm bg-background focus:border-primary outline-none" placeholder="https://" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Myndband URL (T.d. YouTube/TikTok)</label>
                    <input 
                      value={form.video_url || ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, video_url: e.target.value})} 
                      className="w-full border border-border rounded-xl px-4 py-2 text-sm bg-background focus:border-primary outline-none" placeholder="https://" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* INNIHALD & LEIÐBEININGAR */}
            <section className="space-y-4 text-sm">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">4. Innihald & Skref (Íslenska)</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                   <div className="flex justify-between items-center mb-2">
                     <label className="font-semibold text-foreground">Hráefni (Ingredients)</label>
                     <button type="button" onClick={addIngredient} className="text-xs font-bold text-primary hover:underline cursor-pointer">+ Bæta við hráefni</button>
                   </div>
                   <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                     {(form.ingredients_is || []).map((ing, i) => (
                       <div key={i} className="flex gap-2 items-center">
                         <input value={ing.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateIngredient(i, 'name', e.target.value)} placeholder="Nafn hráefnis" className="flex-1 border border-border bg-background rounded-lg px-2 py-1 text-sm outline-none focus:border-primary transition-colors" />
                         <input type="text" value={ing.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateIngredient(i, 'amount', e.target.value)} className="w-16 border border-border bg-background rounded-lg px-2 py-1 text-sm text-center outline-none focus:border-primary transition-colors" />
                         <input value={ing.unit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateIngredient(i, 'unit', e.target.value)} placeholder="g" className="w-12 border border-border bg-background rounded-lg px-2 py-1 text-sm text-center outline-none focus:border-primary transition-colors" />
                         <button type="button" onClick={() => removeIngredient(i)} className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"><X className="w-4 h-4"/></button>
                       </div>
                     ))}
                     {(!form.ingredients_is || form.ingredients_is.length === 0) && <p className="text-xs text-muted-foreground italic">Engin hráefni skráð.</p>}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block font-semibold mb-2 text-foreground">Skref (Milli lína)</label>
                   <textarea rows={10} value={(form.steps_is || []).join('\n')} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({...form, steps_is: e.target.value.split('\n').filter(s => s.trim() !== '')})} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:border-primary outline-none transition-colors resize-y" placeholder="Sláðu inn hvert skref og ýttu á Enter (ný lína)..." />
                 </div>
               </div>
            </section>

            {/* AÐGERÐIR */}
            <div className="pt-6 border-t border-border flex justify-end gap-3">
              <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors cursor-pointer">Hætta við</button>
              <button type="submit" disabled={loading} className="px-8 py-3 font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
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
             <div className="flex gap-2 bg-muted p-1 rounded-xl shrink-0 w-full sm:w-auto">
               <button onClick={() => setFilterMode('all')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${filterMode === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>Allar ({recipesList.length})</button>
               <button onClick={() => setFilterMode('published')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1 justify-center ${filterMode === 'published' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}><Eye className="w-3.5 h-3.5"/> Birtar</button>
               <button onClick={() => setFilterMode('draft')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-1 justify-center ${filterMode === 'draft' ? 'bg-background shadow-sm text-muted-foreground' : 'text-muted-foreground'}`}><EyeOff className="w-3.5 h-3.5"/> Í bið</button>
             </div>
             
             <div className="flex gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Leita í uppskriftum..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
               </div>
               <button onClick={handleCreateNew} className="shrink-0 flex items-center gap-2 bg-background border border-border hover:border-primary hover:text-primary font-bold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer">
                 <Plus className="w-4 h-4" /> Ný Uppskrift
               </button>
             </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(recipe => (
              <div key={recipe.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-primary transition-all group">
                {/* Image */}
                <div className="relative h-40 bg-muted overflow-hidden">
                  {recipe.image_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={recipe.image_urls[0]} alt={recipe.title_is} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                       <UtensilsCrossed className="w-8 h-8 opacity-30" />
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
                  <h3 className="font-display font-bold leading-tight text-lg mb-1 text-foreground line-clamp-1">{recipe.title_is}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{recipe.description_is || 'Engin lýsing'}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <button onClick={() => handleEdit(recipe)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-lg transition-colors cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" /> Breyta
                    </button>
                    <a href={`/is/uppskriftir/${recipe.slug}`} target="_blank" className="flex justify-center items-center py-1.5 px-3 bg-muted hover:bg-muted/80 text-primary rounded-lg transition-colors cursor-pointer">
                      <LinkIcon className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(recipe.id, recipe.title_is)} className="flex justify-center items-center py-1.5 px-3 bg-muted hover:bg-destructive/10 text-destructive rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
               Engar uppskriftir fundust með þessum leitarskilyrðum.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
