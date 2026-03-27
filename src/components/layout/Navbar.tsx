'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingCart, Menu, X, User, Pizza } from 'lucide-react';

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale() as 'is' | 'en';
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isIs = locale === 'is';

  const navLinks = [
    { href: '/uppskriftir', label: isIs ? 'Uppskriftir' : 'Recipes' },
    { href: '/stadir', label: isIs ? 'Staðir' : 'Restaurants' },
    { href: '/samfelag', label: isIs ? 'Samfélag' : 'Community' },
    { href: '/vorur', label: isIs ? 'Búðin' : 'Shop' },
    { href: '/stilar', label: isIs ? 'Stílar' : 'Mastery' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-(--color-bg-primary)/95 backdrop-blur-sm border-b border-(--color-border-light)">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-(--color-brand)/10 p-2 rounded-xl group-hover:bg-(--color-brand)/20 transition-colors">
              <Pizza className="w-6 h-6 text-(--color-brand)" />
            </div>
            <span className="font-display text-2xl font-bold text-(--color-brand)">Pizzadeig.is</span>
          </Link>

          {/* Desktop: Centered nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-(--color-brand)'
                      : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <Link href="/notandi/login" className="p-2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-(--color-text-primary) p-2 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-16 left-0 right-0 bg-background border-b border-(--color-border) shadow-lg">
            <div className="p-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-(--color-brand)/10 text-(--color-brand)'
                        : 'text-(--color-text-primary) hover:bg-(--color-bg-secondary)'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-(--color-border-light) flex gap-3">
              <Link
                href="/notandi/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 bg-(--color-brand) text-white font-semibold rounded-full"
              >
                <User className="w-4 h-4" />
                {t('login')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
