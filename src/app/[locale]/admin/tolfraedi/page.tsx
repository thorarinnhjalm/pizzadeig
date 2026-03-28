'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import {
  BarChart3,
  ExternalLink,
  Search,
  Globe,
  Users,
  UtensilsCrossed,
  Store,
  Target,
  MessageSquareText,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SiteStats {
  users: number;
  recipes: number;
  restaurants: number;
  menuItems: number;
  ads: number;
  reviews: number;
}

export default function TolfraediPage() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersSnap, recipesSnap, restaurantsSnap, adsSnap, reviewsSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'))),
          getDocs(query(collection(db, 'recipes'))),
          getDocs(query(collection(db, 'restaurants'))),
          getDocs(query(collection(db, 'ads'))),
          getDocs(query(collection(db, 'reviews'))),
        ]);

        setStats({
          users: usersSnap.size,
          recipes: recipesSnap.size,
          restaurants: restaurantsSnap.size,
          menuItems: 0,
          ads: adsSnap.size,
          reviews: reviewsSnap.size,
        });
      } catch (_err) {
        console.error('Could not fetch stats');
        setStats({ users: 0, recipes: 0, restaurants: 0, menuItems: 0, ads: 0, reviews: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const firestoreMetrics = [
    { label: 'Notendur', value: stats?.users ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Uppskriftir', value: stats?.recipes ?? 0, icon: UtensilsCrossed, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Veitingastaðir', value: stats?.restaurants ?? 0, icon: Store, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Auglýsingar', value: stats?.ads ?? 0, icon: Target, color: 'text-red-600', bg: 'bg-red-500/10' },
    { label: 'Umsagnir', value: stats?.reviews ?? 0, icon: MessageSquareText, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-8 md:p-12 w-full max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Tölfræði
        </h1>
        <p className="text-muted-foreground mt-2">Gögn úr gagnagrunni og ytri tölfræðiþjónustum.</p>
      </div>

      {/* Firestore counts */}
      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Gagnagrunns tölur (Firestore)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {firestoreMetrics.map((m, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary transition-colors group">
              <div className={`p-2.5 rounded-xl ${m.bg} ${m.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-2xl font-display font-extrabold">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GA4 Connection Status */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Ytri þjónustur
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Analytics */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Google Analytics 4</h3>
                  <p className="text-xs text-muted-foreground">Umferðargreining og markmið</p>
                </div>
              </div>
              {gaId ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Tengt
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Vantar
                </span>
              )}
            </div>

            {gaId ? (
              <div className="bg-muted rounded-lg p-3 mb-4">
                <p className="text-xs font-mono text-muted-foreground">
                  Measurement ID: <span className="font-bold text-foreground">{gaId}</span>
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  Settu <code className="bg-amber-100 px-1 rounded font-mono">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> í <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> og Vercel Environment Variables.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Opna GA4 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Search Console */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Google Search Console</h3>
                  <p className="text-xs text-muted-foreground">Leitarniðurstöður og vísitala</p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 mb-4 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Til að tengja:</strong>
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Farðu á <strong>search.google.com/search-console</strong></li>
                <li>Veldu &quot;Domain&quot; eða &quot;URL prefix&quot; og skráðu <code className="bg-background px-1 rounded font-mono">pizzadeig.is</code></li>
                <li>Staðfestu eignarhald með DNS TXT record eða HTML meta tag</li>
                <li>Sendu inn <code className="bg-background px-1 rounded font-mono">sitemap.xml</code></li>
              </ol>
            </div>

            <div className="flex gap-2">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-800 transition-colors"
              >
                Opna Search Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sitemap info */}
      <section className="bg-muted/50 border border-border rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-2">Sitemap og SEO</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Síðan býr sjálfkrafa til <code className="bg-background px-1 rounded font-mono">sitemap.xml</code> með öllum uppskriftum og veitingastöðum úr gagnagrunni.
        </p>
        <div className="flex gap-4">
          <a
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            Skoða sitemap.xml <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            Skoða robots.txt <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
