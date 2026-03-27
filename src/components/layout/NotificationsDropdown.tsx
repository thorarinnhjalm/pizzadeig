'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { is, enUS } from 'date-fns/locale';

interface Notification {
  id: string;
  type: string;
  title_is: string;
  title_en: string;
  body_is: string;
  body_en: string;
  read: boolean;
  link?: string;
  created_at: any;
}

interface Props {
  locale: 'is' | 'en';
}

export function NotificationsDropdown({ locale }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('user_uid', '==', user.uid),
      orderBy('created_at', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification))
      );
    }, (error) => {
      console.warn('Notifications listener error:', error);
    });

    return () => unsub();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n.id)));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors rounded-full hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
        aria-label={locale === 'is' ? 'Tilkynningar' : 'Notifications'}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-brand)] rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[var(--color-bg-primary)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-primary)] border border-[var(--color-border-light)] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] flex justify-between items-center">
            <h3 className="font-bold font-display text-[var(--color-text-primary)]">{locale === 'is' ? 'Tilkynningar' : 'Notifications'}</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)] cursor-pointer hover:text-[var(--color-brand)] transition-colors"
              >
                {locale === 'is' ? 'Lesa allt' : 'Mark all read'}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-text-tertiary)] text-sm">
                {locale === 'is' ? 'Engar tilkynningar' : 'No notifications'}
              </div>
            ) : (
              notifications.map((notif) => {
                const title = locale === 'is' ? notif.title_is : notif.title_en;
                const body = locale === 'is' ? notif.body_is : notif.body_en;
                const date = notif.created_at?.toDate ? notif.created_at.toDate() : new Date();
                const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: locale === 'is' ? is : enUS });

                return (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.link) window.location.href = notif.link;
                    }}
                    className={`p-4 border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer flex gap-3 transition-colors ${!notif.read ? 'bg-[var(--color-bg-secondary)]' : 'opacity-60'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-[var(--color-brand)]' : 'bg-transparent'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{title}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">{body}</p>
                      <span className="text-[10px] text-[var(--color-text-tertiary)] mt-1 block">{timeAgo}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
