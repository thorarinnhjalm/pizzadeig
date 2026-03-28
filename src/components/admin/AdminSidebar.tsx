'use client';

import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export type AdminSection = 'overview' | 'recipes' | 'restaurants' | 'users' | 'ads' | 'analytics' | 'settings';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (val: AdminSection) => void;
}

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const links = [
    { id: 'overview', label: 'Stjórnborð', icon: LayoutDashboard },
    { id: 'recipes', label: 'Uppskriftir', icon: UtensilsCrossed },
    { id: 'restaurants', label: 'Staðir', icon: Store },
    { id: 'users', label: 'Notendur', icon: Users },
    { id: 'ads', label: 'Auglýsingar', icon: Megaphone },
    { id: 'analytics', label: 'Tölfræði', icon: BarChart3 },
    { id: 'settings', label: 'Stillingar', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-(--color-border) flex flex-col h-full z-10 shrink-0 shadow-sm relative sticky top-0">
      {/* Brand */}
      <div className="p-6 border-b border-(--color-border) flex items-center gap-3 shrink-0">
        <div className="bg-(--color-brand) text-white p-2 rounded-xl shadow-lg ring-1 ring-black/5">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight leading-none text-(--color-text-primary)">
            Pizzadeig<span className="text-(--color-brand)">.is</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Admin Vefur</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 flex-1 overflow-y-auto space-y-1">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 mt-2">Aðalvalmynd</p>
        
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeSection === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id as AdminSection)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-red-50 text-(--color-brand) border-r-4 border-(--color-brand) shadow-sm' 
                  : 'text-muted-foreground hover:bg-(--color-bg-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
              {link.id === 'ads' && (
                <span className="ml-auto bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-[10px] font-bold">Aktivt</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* CTA Bottom */}
      <div className="p-4 border-t border-(--color-border) bg-(--color-bg-secondary) shrink-0">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl mb-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
          <div className="relative z-10">
            <h4 className="font-bold text-white text-sm mb-1">Ný Uppskrift?</h4>
            <p className="text-stone-400 text-xs mb-3 leading-relaxed">Bættu við nýrri spennandi pizzuuppskrift í gagnagrunninn.</p>
            <button 
              onClick={() => setActiveSection('recipes')} 
              className="w-full flex justify-center items-center gap-2 bg-white text-stone-900 hover:bg-red-50 py-2 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Búa til
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-2 mt-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-(--color-text-primary) hover:underline flex items-center gap-1 transition-colors">
            Fara á forsíðu 
          </Link>
        </div>
      </div>
    </aside>
  );
}
