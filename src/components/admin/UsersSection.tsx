'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { Users, Shield, ShieldAlert, Mail } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface UserDoc {
  uid: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  display_name?: string;
  joined_at?: import('firebase/firestore').Timestamp;
}

interface UsersSectionProps {
  recentUsers: UserDoc[];
  showMessage: (msg: string) => void;
  onRefresh: () => void;
}

export function UsersSection({ recentUsers, showMessage, onRefresh }: UsersSectionProps) {
  const [loading, setLoading] = useState(false);

  const toggleAdminRole = async (uid: string, currentRole: string) => {
    if (!window.confirm('Viltu breyta réttindum þessa notanda?')) return;
    setLoading(true);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      showMessage(`Réttindi uppfærð í "${newRole}" fyrir notanda.`);
      onRefresh();
    } catch (err) {
      showMessage('Villa við uppfærslu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Notendur ({recentUsers.length})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Stjórnaðu notendum og aðgangsheimildum.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="px-6 py-4">Notandi</th>
                <th className="px-6 py-4">Netfang</th>
                <th className="px-6 py-4">Hlutverk</th>
                <th className="px-6 py-4">Skráningardagur</th>
                <th className="px-6 py-4 text-right">Aðgerðir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.map(user => (
                <tr key={user.uid} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {user.display_name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground">{user.display_name || 'Ónefndur'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                    {user.joined_at?.toDate ? new Date(user.joined_at.toDate()).toLocaleDateString('is-IS') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleAdminRole(user.uid, user.role || 'user')}
                      disabled={loading}
                      className="px-4 py-2 text-xs font-bold border border-border hover:border-primary hover:text-primary rounded-xl transition-all cursor-pointer shadow-sm bg-background active:scale-95 disabled:opacity-50"
                    >
                      Breyta í {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsers.length === 0 && (
             <div className="p-12 text-center text-muted-foreground text-sm">Engir notendur skráðir.</div>
          )}
        </div>
      </div>
    </div>
  );
}
