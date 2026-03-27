import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Recipe } from '@/types/recipe';
import { UserProfile } from '@/types/user';
import { UserAvatar } from '@/components/community/UserAvatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { is, enUS } from 'date-fns/locale';
import { Users, Pizza, Calendar, ChefHat } from 'lucide-react';
import { FollowButton } from '@/components/community/FollowButton';

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
    }
  } catch (e) { }
  return null;
}

async function getUserRecipes(uid: string): Promise<Recipe[]> {
  try {
    const q = query(collection(db, 'recipes'), where('author_uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
  } catch (e) {
    return [];
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ uid: string, locale: string }> }) {
  const { uid, locale } = await params;
  const user = await getUserProfile(uid);
  const recipes = await getUserRecipes(uid);

  // Determine fallback details if user prof isn't setup
  const authorName = user?.display_name || (recipes.length > 0 ? recipes[0].author_name : 'Unknown User');
  const authorAvatar = user?.avatar_url || (recipes.length > 0 ? recipes[0].author_avatar : undefined);

  if (!user && recipes.length === 0) {
    notFound();
  }

  return (
    <main className="flex-1 w-full bg-[var(--bg-cream)] min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-white to-[var(--bg-cream)] border-b border-[var(--border)] pt-16 pb-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-[var(--pizza-red)]/5"></div>
        <div className="container mx-auto px-4 flex flex-col items-center max-w-3xl text-center relative z-10">
          <UserAvatar url={authorAvatar} name={authorName} className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl mb-6 ring-4 ring-[var(--pizza-red)]/10" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-dark)] mb-3 capitalize drop-shadow-sm">{authorName}</h1>
          
          <p className="text-[var(--text-medium)] mb-8 flex items-center gap-2 justify-center bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-[var(--border)]">
             <Calendar className="w-4 h-4 text-[var(--pizza-gold)]" /> 
             {locale === 'is' ? 'Meðlimur síðan' : 'Joined'} {user?.joined_at ? format(user.joined_at.toDate(), 'MMMM yyyy', { locale: locale === 'is' ? is : enUS }) : 'Nýverið'}
          </p>
          
          <div className="flex gap-4 md:gap-12 mt-4 bg-white border border-[var(--border)] rounded-2xl p-6 md:px-12 justify-center w-full shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[var(--pizza-red)] flex items-center gap-2"><Pizza className="w-7 h-7" /> {user?.recipes_count || recipes.length}</span>
              <span className="text-xs md:text-sm text-[var(--text-medium)] uppercase tracking-widest font-bold mt-1.5">{locale === 'is' ? 'Uppskriftir' : 'Recipes'}</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[var(--pizza-gold)] flex items-center gap-2"><Users className="w-7 h-7" /> {user?.followers_count || 0}</span>
              <span className="text-xs md:text-sm text-[var(--text-medium)] uppercase tracking-widest font-bold mt-1.5">{locale === 'is' ? 'Fylgjendur' : 'Followers'}</span>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
             <FollowButton targetUid={uid} locale={locale as 'is' | 'en'} />
          </div>
        </div>
      </div>

      {/* User Recipes Library */}
      <div className="container mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-10 flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-[var(--pizza-green)]" />
          {locale === 'is' ? `Uppskriftir eftir ${authorName.split(' ')[0]}` : `Recipes by ${authorName.split(' ')[0]}`}
        </h2>
        {recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} locale={locale as 'is' | 'en'} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[var(--border)]">
             <Pizza className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <p className="text-xl text-[var(--text-medium)] font-medium">{locale === 'is' ? 'Engar uppskriftir birtar enn.' : 'No recipes published yet.'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
