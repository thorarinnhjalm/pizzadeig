'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Recipe } from '@/types/recipe';
import { UserProfile } from '@/types/user';
import { UserAvatar } from '@/components/community/UserAvatar';
import { format } from 'date-fns';
import { is, enUS } from 'date-fns/locale';
import { Users, Pizza, Calendar, ChefHat, Loader2 } from 'lucide-react';
import { FollowButton } from '@/components/community/FollowButton';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, BookOpen } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const uid = params.uid as string;
  const locale = useLocale() as 'is' | 'en';
  const isIs = locale === 'is';

  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'cookbook'>('published');
  const [loading, setLoading] = useState(true);
  const [loadingSaves, setLoadingSaves] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', uid));
        const userData = userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } as UserProfile : null;
        setUser(userData);

        // Fetch user recipes
        const q = query(collection(db, 'recipes'), where('author_uid', '==', uid));
        const snapshot = await getDocs(q);
        const recipesData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
        setRecipes(recipesData);

        if (!userData && recipesData.length === 0) {
          setNotFound(true);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        // Still try to show the page even if there's an error
      } finally {
        setLoading(false);
      }
    }
    if (uid) load();
  }, [uid]);

  useEffect(() => {
    async function loadSaves() {
      if (currentUser?.uid !== uid) return;
      setLoadingSaves(true);
      try {
        const savesQ = query(collection(db, 'saves'), where('user_uid', '==', uid), where('target_type', '==', 'recipe'));
        const savesSnap = await getDocs(savesQ);
        const saveIds = savesSnap.docs.map(d => d.data().target_id);
        
        if (saveIds.length > 0) {
          const chunks = [];
          for (let i = 0; i < saveIds.length; i += 10) {
            chunks.push(saveIds.slice(i, i + 10));
          }
          
          const fetchedSavedRecipes = [];
          for (const chunk of chunks) {
            // Using documentId() built-in via firebase
            const rQ = query(collection(db, 'recipes'), where('__name__', 'in', chunk));
            const rSnap = await getDocs(rQ);
            fetchedSavedRecipes.push(...rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          }
          setSavedRecipes(fetchedSavedRecipes as Recipe[]);
        }
      } catch (e) {
        console.error('Error loading cookbook:', e);
      } finally {
        setLoadingSaves(false);
      }
    }
    loadSaves();
  }, [currentUser, uid]);

  // Determine fallback details
  const authorName = user?.display_name || (recipes.length > 0 ? recipes[0].author_name : isIs ? 'Óþekktur notandi' : 'Unknown User');
  const authorAvatar = user?.avatar_url || (recipes.length > 0 ? recipes[0].author_avatar : undefined);

  if (loading) {
    return (
      <main className="flex-1 w-full bg-(--color-bg-light) min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-(--color-brand) mx-auto" />
          <p className="text-muted-foreground animate-pulse">{isIs ? 'Hleð prófíl...' : 'Loading profile...'}</p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="flex-1 w-full bg-(--color-bg-light) min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Pizza className="w-16 h-16 text-gray-200 mx-auto" />
          <h1 className="text-2xl font-bold text-(--color-text-primary)">{isIs ? 'Notandi fannst ekki' : 'User not found'}</h1>
          <p className="text-muted-foreground">{isIs ? 'Þessi notandi er ekki skráður.' : 'This user does not exist.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full bg-(--color-bg-light) min-h-screen">
      {/* Profile Header */}
      <div className="bg-linear-to-b from-white to-(--color-bg-light) border-b border-(--color-border) pt-16 pb-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-(--color-brand)/5"></div>
        <div className="container mx-auto px-4 flex flex-col items-center max-w-3xl text-center relative z-10">
          <UserAvatar url={authorAvatar} name={authorName} className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl mb-6 ring-4 ring-(--color-brand)/10" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text-primary) mb-3 capitalize drop-shadow-sm">{authorName}</h1>
          
          <p className="text-(--color-text-secondary) mb-8 flex items-center gap-2 justify-center bg-(--color-bg-secondary)/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-(--color-border)">
             <Calendar className="w-4 h-4 text-ring" /> 
             {isIs ? 'Meðlimur síðan' : 'Joined'} {user?.joined_at ? format(user.joined_at.toDate(), 'MMMM yyyy', { locale: isIs ? is : enUS }) : isIs ? 'Nýverið' : 'Recently'}
          </p>
          
          <div className="flex gap-4 md:gap-12 mt-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-2xl p-6 md:px-12 justify-center w-full shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-(--color-brand) flex items-center gap-2"><Pizza className="w-7 h-7" /> {user?.recipes_count || recipes.length}</span>
              <span className="text-xs md:text-sm text-(--color-text-secondary) uppercase tracking-widest font-bold mt-1.5">{isIs ? 'Uppskriftir' : 'Recipes'}</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-ring flex items-center gap-2"><Users className="w-7 h-7" /> {user?.followers_count || 0}</span>
              <span className="text-xs md:text-sm text-(--color-text-secondary) uppercase tracking-widest font-bold mt-1.5">{isIs ? 'Fylgjendur' : 'Followers'}</span>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
             <FollowButton targetUid={uid} locale={locale} />
          </div>
        </div>
      </div>

      {/* User Recipes Library */}
      <div className="container mx-auto px-4 pb-24">
        {currentUser?.uid === uid && (
          <div className="flex justify-center gap-4 mb-10 border-b border-(--color-border) pb-1">
            <button 
              onClick={() => setActiveTab('published')}
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors border-b-2 ${activeTab === 'published' ? 'border-(--color-brand) text-(--color-brand)' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <BookOpen className="w-5 h-5" />
              {isIs ? 'Mínar Uppskriftir' : 'My Recipes'}
            </button>
            <button 
              onClick={() => setActiveTab('cookbook')}
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors border-b-2 ${activeTab === 'cookbook' ? 'border-(--color-brand) text-(--color-brand)' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Bookmark className="w-5 h-5" />
              {isIs ? 'Minn Matseðill' : 'My Cookbook'}
            </button>
          </div>
        )}

        {(activeTab === 'published' || currentUser?.uid !== uid) && (
          <>
            <h2 className="text-3xl font-bold text-(--color-text-primary) mb-10 flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-(--color-green)" />
              {isIs ? `Uppskriftir eftir ${authorName.split(' ')[0]}` : `Recipes by ${authorName.split(' ')[0]}`}
            </h2>
            {recipes.length > 0 ? (
              <RecipeGrid recipes={recipes} locale={locale} />
            ) : (
              <div className="text-center py-20 bg-(--color-bg-secondary) rounded-2xl border border-dashed border-(--color-border)">
                 <Pizza className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                 <p className="text-xl text-(--color-text-secondary) font-medium">{isIs ? 'Engar uppskriftir birtar enn.' : 'No recipes published yet.'}</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'cookbook' && currentUser?.uid === uid && (
          <>
            <h2 className="text-3xl font-bold text-(--color-text-primary) mb-10 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-(--color-brand)" />
              {isIs ? 'Mín Uppskriftabók' : 'My Saved Recipes'}
            </h2>
            {loadingSaves ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-(--color-brand) mx-auto" />
              </div>
            ) : savedRecipes.length > 0 ? (
              <RecipeGrid recipes={savedRecipes} locale={locale} />
            ) : (
              <div className="text-center py-20 bg-(--color-bg-secondary) rounded-2xl border border-dashed border-(--color-border)">
                 <Bookmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                 <p className="text-xl text-(--color-text-secondary) font-medium">{isIs ? 'Mín uppskriftabók er tóm.' : 'Your cookbook is empty.'}</p>
                 <p className="text-muted-foreground mt-2">{isIs ? 'Vistaðu uppskriftir til að hafa þær við höndina hér.' : 'Save recipes to easily find them here later.'}</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
