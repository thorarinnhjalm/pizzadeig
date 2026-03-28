'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from '@/i18n/routing';
import { Mail, Lock, AlertCircle } from 'lucide-react';

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle redirect result on mount (for mobile Google sign-in)
  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          display_name: user.displayName || 'Pizzagerðarmaður',
          avatar_url: user.photoURL || null,
        }, { merge: true });

        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
        if (adminEmails.includes(user.email?.toLowerCase() || '')) {
          router.push('/admin');
        } else {
          router.push(`/notandi/${user.uid}`);
        }
      }
    }).catch((err) => {
      console.error('Redirect sign-in error:', err);
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      const user = userCredential.user;
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
      
      if (adminEmails.includes(user.email?.toLowerCase() || '')) {
        router.push('/admin');
      } else {
        router.push(`/notandi/${user.uid}`);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(isLogin 
        ? 'Rangt netfang eða lykilorð.' 
        : 'Gat ekki stofnað aðgang. Lykilorð verður að vera a.m.k. 6 stafir eða netfang þegar á skrá.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      
      if (isMobile()) {
        // Mobile: use redirect (popups are blocked)
        await signInWithRedirect(auth, provider);
        // Page will redirect — result handled in useEffect above
        return;
      }
      
      // Desktop: use popup
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        display_name: user.displayName || 'Pizzagerðarmaður',
        avatar_url: user.photoURL || null,
      }, { merge: true });

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
      
      if (adminEmails.includes(user.email?.toLowerCase() || '')) {
        router.push('/admin');
      } else {
        router.push(`/notandi/${user.uid}`);
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Ekki tókst að skrá inn með Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-(--color-bg-secondary) border border-(--color-border) rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-(--color-text-primary)">
            {isLogin ? 'Skrá inn' : 'Nýskráning'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Velkominn aftur í bökunarsamfélagið!' : 'Stofnaðu aðgang og taktu þátt í umræðunni.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-1.5">Netfang</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-(--color-border) rounded-xl text-(--color-text-primary) placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--color-brand)/50 focus:border-(--color-brand) transition-all"
                placeholder="pizzabakari@dæmi.is"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-1.5">Lykilorð</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-(--color-border) rounded-xl text-(--color-text-primary) placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--color-brand)/50 focus:border-(--color-brand) transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-(--color-brand) hover:bg-(--color-brand-dark) text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-70 flex justify-center"
          >
            {loading ? 'Hleður...' : (isLogin ? 'Skráðu mig inn' : 'Stofna aðgang')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-(--color-border-light)"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-(--color-bg-secondary) text-muted-foreground">Eða</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 transition-all disabled:opacity-70"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLogin ? 'Skrá inn með Google' : 'Nýskráning með Google'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-(--color-border-light) pt-6">
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Ertu ekki með aðgang ennþá?' : 'Ertu þegar með aðgang?'}
          </p>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="mt-2 text-(--color-brand) hover:underline font-medium"
          >
            {isLogin ? 'Nýskrá mig núna' : 'Fara í innskráningu'}
          </button>
        </div>
      </div>
    </div>
  );
}
