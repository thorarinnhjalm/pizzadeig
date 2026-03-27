'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  targetId: string;
  targetType: 'recipe' | 'restaurant' | 'review' | 'user';
  locale: 'is' | 'en';
}

export function ReportButton({ targetId, targetType, locale }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    if (!reason) return;
    try {
      await addDoc(collection(db, 'reports'), {
        target_id: targetId,
        target_type: targetType,
        reporter_uid: user?.uid || 'anonymous',
        reason,
        status: 'pending',
        created_at: serverTimestamp()
      });
      setReported(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch(e) {
      console.error(e);
    }
  };

  if (reported) return <span className="text-xs text-(--color-green) font-bold bg-[#E8F5E9] px-2 py-1 rounded">{locale === 'is' ? 'Tilkynnt ✅' : 'Reported ✅'}</span>;

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="flex items-center text-xs font-bold text-muted-foreground hover:text-(--color-brand) transition-colors py-1 px-2 rounded hover:bg-(--color-bg-tertiary)">
        <Flag className="w-3.5 h-3.5 mr-1.5" />
        {locale === 'is' ? 'Tilkynna' : 'Report'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-(--color-bg-tertiary) p-1.5 rounded-lg border border-(--color-border-light) shadow-sm">
      <select value={reason} onChange={e => setReason(e.target.value)} className="text-xs border border-(--color-border-light) rounded px-2 py-1.5 bg-(--color-bg-secondary) text-(--color-text-dark) focus:outline-none focus:border-(--color-brand)">
        <option value="">{locale === 'is' ? 'Veldu ástæðu' : 'Select reason'}</option>
        <option value="spam">{locale === 'is' ? 'Ruslpóstur' : 'Spam'}</option>
        <option value="inappropriate">{locale === 'is' ? 'Óviðeigandi' : 'Inappropriate'}</option>
        <option value="other">{locale === 'is' ? 'Annað' : 'Other'}</option>
      </select>
      <Button size="sm" onClick={handleReport} disabled={!reason} className="h-7 text-[11px] px-3 bg-(--color-brand) hover:bg-[#b02e0b] shadow-none">Senda</Button>
      <button onClick={() => setIsOpen(false)} className="text-[10px] text-muted-foreground hover:text-red-500 ml-1 font-bold">✕</button>
    </div>
  );
}
