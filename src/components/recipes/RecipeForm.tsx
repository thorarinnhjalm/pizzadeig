'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function RecipeForm({ locale }: { locale: 'is' | 'en' }) {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simplified form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('deig');
  const [difficulty, setDifficulty] = useState('midlungs');
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('10');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const ingredients = ingredientsText.split('\n').filter(i => i.trim()).map(i => {
        const parts = i.split(' ');
        return {
          amount: parts[0] || '',
          unit: parts[1] || '',
          name: parts.slice(2).join(' ') || i
        };
      });

      const steps = stepsText.split('\n').filter(s => s.trim());

      const recipeData = {
        title_is: locale === 'is' ? title : '',
        title_en: locale === 'en' ? title : '',
        slug,
        description_is: locale === 'is' ? description : '',
        description_en: locale === 'en' ? description : '',
        type,
        category: 'general',
        difficulty,
        prep_time_min: parseInt(prepTime),
        cook_time_min: parseInt(cookTime),
        rest_time_min: 0,
        servings: 4,
        ingredients_is: locale === 'is' ? ingredients : [],
        ingredients_en: locale === 'en' ? ingredients : [],
        steps_is: locale === 'is' ? steps : [],
        steps_en: locale === 'en' ? steps : [],
        image_urls: [],
        author_uid: user.uid,
        author_name: user.displayName || 'Unknown',
        author_avatar: user.photoURL || '',
        likes_count: 0,
        rating_avg: 0,
        rating_count: 0,
        tags: [],
        published: true, 
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(collection(db, 'recipes'), recipeData);
      router.push(`/uppskriftir/${slug}`);
    } catch (error) {
      console.error('Error adding recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16 bg-(--color-bg-secondary) rounded-2xl border border-(--color-border) shadow-sm">
        <AlertCircle className="w-12 h-12 text-(--color-brand) mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-(--color-text-primary) mb-4">Þú þarft að vera innskráð/ur</h2>
        <p className="text-(--color-text-secondary) mb-8 max-w-sm mx-auto">Til þess að deila uppskrift með samfélaginu okkar þarftu að auðkenna þig.</p>
        <Button onClick={loginWithGoogle} className="bg-(--color-brand) hover:bg-[#b02e0b] text-white px-8">
          Innskráning með Google
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-(--color-bg-secondary) p-6 md:p-8 rounded-2xl shadow-sm border border-(--color-border)">
      <div>
        <Label htmlFor="title" className="text-base font-semibold">Titill / Title</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Sannkallað Napólí Deig" className="mt-1.5 focus-visible:ring-(--color-brand)" />
      </div>
      <div>
        <Label htmlFor="description" className="text-base font-semibold">Lýsing / Description</Label>
        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Stutt rökstuðningur um afhverju þetta deig er rosalegt..." className="mt-1.5 focus-visible:ring-(--color-brand)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-semibold">Tegund / Type</Label>
          <Select onValueChange={(val) => val && setType(val)} defaultValue={type}>
            <SelectTrigger className="mt-1.5 focus:ring-(--color-brand)"><SelectValue placeholder="Tegund" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="deig">Deig</SelectItem>
              <SelectItem value="sosa">Sósa</SelectItem>
              <SelectItem value="ostur">Ostur</SelectItem>
              <SelectItem value="alegg">Álegg</SelectItem>
              <SelectItem value="tol">Tól</SelectItem>
              <SelectItem value="heildar">Heildaruppskrift</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-semibold">Erfiðleikastig / Difficulty</Label>
          <Select onValueChange={(val) => val && setDifficulty(val)} defaultValue={difficulty}>
            <SelectTrigger className="mt-1.5 focus:ring-(--color-brand)"><SelectValue placeholder="Erfiðleikastig" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="audvelt">Auðvelt (Easy)</SelectItem>
              <SelectItem value="midlungs">Miðlungs (Medium)</SelectItem>
              <SelectItem value="erfitt">Erfitt (Hard)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="prepTime" className="text-base font-semibold">Undirbúningur (mín) / Prep Time</Label>
          <Input id="prepTime" type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} required className="mt-1.5 focus-visible:ring-(--color-brand)" />
        </div>
        <div>
          <Label htmlFor="cookTime" className="text-base font-semibold">Eldun (mín) / Cook Time</Label>
          <Input id="cookTime" type="number" value={cookTime} onChange={e => setCookTime(e.target.value)} required className="mt-1.5 focus-visible:ring-(--color-brand)" />
        </div>
      </div>
      <div>
        <Label htmlFor="ingredients" className="text-base font-semibold">Hráefni (Ein á línu t.d. &quot;500 g Hveiti&quot;)</Label>
        <Textarea id="ingredients" value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} required rows={5} className="mt-1.5 focus-visible:ring-(--color-brand)" />
      </div>
      <div>
        <Label htmlFor="steps" className="text-base font-semibold">Aðferð (Eitt skref á línu)</Label>
        <Textarea id="steps" value={stepsText} onChange={e => setStepsText(e.target.value)} required rows={5} className="mt-1.5 focus-visible:ring-(--color-brand)" />
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t border-(--color-border) mt-6">
        <Link href="/uppskriftir">
          <Button variant="ghost" type="button">Hætta við</Button>
        </Link>
        <Button type="submit" disabled={loading} className="bg-(--color-brand) hover:bg-[#b02e0b] px-8 text-white">
          {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
          Senda inn uppskrift
        </Button>
      </div>
    </form>
  );
}
