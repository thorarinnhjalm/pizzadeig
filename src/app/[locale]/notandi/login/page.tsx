'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Send user to front page upon successful auth
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(isLogin 
        ? 'Rangt netfang eða lykilorð.' 
        : 'Gat ekki stofnað aðgang. Lykilorð verður að vera a.m.k. 6 stafir eða netfang þegar á skrá.');
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
