'use client';

import { ReactNode, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Link } from '@/i18n/routing';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * Gates the whole /admin area. This is a UI guard, not the security boundary —
 * Firestore rules and the API routes enforce access on the server. Without it the
 * dashboard rendered for anyone, including the user list.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }
    let cancelled = false;
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => { if (!cancelled) setRole((snap.data()?.role as string) ?? null); })
      .catch(() => { if (!cancelled) setRole(null); })
      .finally(() => { if (!cancelled) setRoleLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  // Mirror what Firestore will actually allow: the allowlist alone would render a
  // dashboard whose every query then fails.
  const isAdmin =
    !!user?.email && adminEmails.includes(user.email.toLowerCase()) && role === 'admin';

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center py-24 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold text-(--color-text-primary) mb-2">
          Aðgangur ekki heimill
        </h1>
        <p className="text-(--color-text-secondary) max-w-md mb-6">
          {user
            ? `Notandinn ${user.email} hefur ekki kerfisstjóraréttindi.`
            : 'Þú þarft að vera innskráð(ur) sem kerfisstjóri til að sjá stjórnborðið.'}
          {user && role !== 'admin' && (
            <span className="block mt-2 text-sm text-(--color-text-tertiary)">
              Hlutverk er sett handvirkt á users/{user.uid} í Firebase Console.
            </span>
          )}
        </p>
        <Link
          href={user ? '/' : '/notandi/login'}
          className="px-5 py-2.5 rounded-xl bg-(--color-brand) text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          {user ? 'Fara á forsíðu' : 'Skrá inn'}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
