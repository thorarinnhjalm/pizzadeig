'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, Timestamp } from 'firebase/firestore';
import { UsersSection } from '@/components/admin/UsersSection';
import { Loader2, Users } from 'lucide-react';

// Using inline definition to avoid assuming type location
interface UserDoc {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  joined_at?: Timestamp;
  avatar_url?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserDoc));
      setUsers(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage('Villa við að sækja notendur: ' + (err instanceof Error ? err.message : 'Óþekkt villa'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto relative">
      {message && (
        <div className="fixed top-20 right-8 bg-green-50 text-green-700 font-bold px-4 py-2 rounded-xl shadow-lg border border-green-200 z-50 animate-in slide-in-from-top-4">
          {message}
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-(--color-brand)" />
          Notendur
        </h1>
        <p className="text-(--color-text-secondary)">Stýring á aðgangsheimildum og bönn.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-(--color-brand)" />
        </div>
      ) : (
        <UsersSection 
          recentUsers={users} 
          onRefresh={fetchUsers} 
          showMessage={showMessage} 
        />
      )}
    </div>
  );
}
