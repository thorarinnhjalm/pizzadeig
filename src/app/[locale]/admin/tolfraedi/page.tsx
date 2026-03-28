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
  AlertCircle,
  Eye,
  MousePointerClick,
  Timer,
  Zap,
  TrendingUp
} from 'lucide-react';

interface SiteStats {
  users: number;
  recipes: number;
  restaurants: number;
  ads: number;
  reviews: number;
}

interface GA4Data {
  metrics30d: { activeUsers: number; sessions: number; pageViews: number; avgSessionDuration: number; bounceRate: number };
  metrics7d: { activeUsers: number; sessions: number; pageViews: number };
  topPages: { path: string; views: number; users: number }[];
  realtimeUsers: number;
}

interface SCData {
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
  period: { start: string; end: string };
}

export default function TolfraediPage() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [ga4, setGA4] = useState<GA4Data | null>(null);
  const [sc, setSC] = useState<SCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ga4Loading, setGA4Loading] = useState(true);
  const [scLoading, setSCLoading] = useState(true);
  const [ga4Error, setGA4Error] = useState<string | null>(null);
  const [scError, setSCError] = useState<string | null>(null);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Firestore stats
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
          ads: adsSnap.size,
          reviews: reviewsSnap.size,
        });
      } catch (_err) {
        setStats({ users: 0, recipes: 0, restaurants: 0, ads: 0, reviews: 0 });
      } finally {
        setLoading(false);
      }
    }

    // GA4 data
    async function fetchGA4() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error(await res.text());
        setGA4(await res.json());
      } catch (err) {
        setGA4Error(err instanceof Error ? err.message : 'Villa við að sækja GA4 gögn');
      } finally {
        setGA4Loading(false);
      }
    }

    // Search Console data
    async function fetchSC() {
      try {
        const res = await fetch('/api/search-console');
        if (!res.ok) throw new Error(await res.text());
        setSC(await res.json());
      } catch (err) {
        setSCError(err instanceof Error ? err.message : 'Villa við að sækja Search Console gögn');
      } finally {
        setSCLoading(false);
      }
    }

    fetchStats();
    fetchGA4();
    fetchSC();
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
    { label: 'Staðir', value: stats?.restaurants ?? 0, icon: Store, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Auglýsingar', value: stats?.ads ?? 0, icon: Target, color: 'text-red-600', bg: 'bg-red-500/10' },
    { label: 'Umsagnir', value: stats?.reviews ?? 0, icon: MessageSquareText, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ];

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Tölfræði
        </h1>
        <p className="text-muted-foreground mt-2">Rauntímagögn úr gagnagrunni, Google Analytics og Search Console.</p>
      </div>

      {/* Firestore counts */}
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Gagnagrunnur (Firestore)
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

      {/* GA4 Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Google Analytics (30 dagar)
          </h2>
          {gaId && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> {gaId}
            </span>
          )}
        </div>

        {ga4Loading ? (
          <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : ga4Error ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm text-amber-900 mb-1">Ekki tókst að sækja GA4 gögn</p>
                <p className="text-xs text-amber-800 mb-3">Þú þarft að setja upp service account til að birta gögn hér.</p>
                <div className="bg-amber-100 rounded-lg p-3 space-y-1.5 text-xs text-amber-900">
                  <p><strong>1.</strong> Búðu til Service Account á <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></p>
                  <p><strong>2.</strong> Gefðu honum &quot;Viewer&quot; role í GA4 property</p>
                  <p><strong>3.</strong> Búðu til JSON lykil og settu í env:</p>
                  <code className="block bg-amber-50 p-2 rounded font-mono text-[11px] mt-1">
                    GA4_PROPERTY_ID=&quot;123456789&quot;<br/>
                    GOOGLE_SERVICE_ACCOUNT_KEY=&apos;&#123;&quot;type&quot;:&quot;service_account&quot;,...&#125;&apos;
                  </code>
                </div>
              </div>
            </div>
          </div>
        ) : ga4 ? (
          <div className="space-y-6">
            {/* Realtime banner */}
            {ga4.realtimeUsers > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-green-800">
                  {ga4.realtimeUsers} {ga4.realtimeUsers === 1 ? 'notandi' : 'notendur'} á síðunni núna
                </span>
              </div>
            )}

            {/* GA4 metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Notendur', value: ga4.metrics30d.activeUsers.toLocaleString('is-IS'), icon: Users, sub: `${ga4.metrics7d.activeUsers} síðustu 7d` },
                { label: 'Lotur', value: ga4.metrics30d.sessions.toLocaleString('is-IS'), icon: Zap, sub: `${ga4.metrics7d.sessions} síðustu 7d` },
                { label: 'Síðuflettingar', value: ga4.metrics30d.pageViews.toLocaleString('is-IS'), icon: Eye, sub: `${ga4.metrics7d.pageViews} síðustu 7d` },
                { label: 'Meðal lota', value: formatDuration(ga4.metrics30d.avgSessionDuration), icon: Timer },
                { label: 'Bounce', value: `${(ga4.metrics30d.bounceRate * 100).toFixed(1)}%`, icon: TrendingUp },
              ].map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  </div>
                  <p className="text-xl font-display font-extrabold">{m.value}</p>
                  {m.sub && <p className="text-[10px] text-muted-foreground mt-1">{m.sub}</p>}
                </div>
              ))}
            </div>

            {/* Top pages */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  Vinsælustu síður (30 dagar)
                </h3>
              </div>
              <div className="divide-y divide-border/50">
                {ga4.topPages.map((p, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-sm font-mono truncate">{p.path}</span>
                    </div>
                    <div className="flex gap-6 text-xs shrink-0">
                      <span className="font-bold">{p.views.toLocaleString('is-IS')} flettingar</span>
                      <span className="text-muted-foreground">{p.users} notendur</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Search Console Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="w-4 h-4" />
            Google Search Console (28 dagar)
          </h2>
        </div>

        {scLoading ? (
          <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : scError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm text-amber-900 mb-1">Ekki tókst að sækja Search Console gögn</p>
                <p className="text-xs text-amber-800 mb-3">Sama service account þarf &quot;Viewer&quot; aðgang í Search Console.</p>
                <div className="bg-amber-100 rounded-lg p-3 space-y-1.5 text-xs text-amber-900">
                  <p><strong>1.</strong> Farðu í <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline">Search Console</a> → Settings → Users</p>
                  <p><strong>2.</strong> Bættu service account email við sem &quot;Full&quot; user</p>
                  <p><strong>3.</strong> Env breyta (ef annað en default):</p>
                  <code className="block bg-amber-50 p-2 rounded font-mono text-[11px] mt-1">
                    SEARCH_CONSOLE_SITE_URL=&quot;sc-domain:pizzadeig.is&quot;
                  </code>
                </div>
              </div>
            </div>
          </div>
        ) : sc ? (
          <div className="space-y-6">
            {/* SC totals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Smellir', value: sc.totals.clicks.toLocaleString('is-IS'), icon: MousePointerClick, color: 'text-blue-600' },
                { label: 'Birtingar', value: sc.totals.impressions.toLocaleString('is-IS'), icon: Eye, color: 'text-green-600' },
                { label: 'CTR', value: `${(sc.totals.ctr * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-amber-600' },
              ].map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  </div>
                  <p className="text-xl font-display font-extrabold">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Top queries */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-green-500" />
                  Vinsælustu leitarorð
                </h3>
              </div>
              <div className="divide-y divide-border/50">
                {sc.topQueries.map((q, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-sm font-medium">{q.query}</span>
                    </div>
                    <div className="flex gap-4 text-xs shrink-0">
                      <span className="font-bold">{q.clicks} smellir</span>
                      <span className="text-muted-foreground">{q.impressions.toLocaleString('is-IS')} birt.</span>
                      <span className="text-muted-foreground">#{q.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Links & Sitemap info */}
      <section className="bg-muted/50 border border-border rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-3">Tenglar og SEO</h3>
        <div className="flex flex-wrap gap-4">
          <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 rounded-lg">
            <Globe className="w-3.5 h-3.5" /> GA4 Dashboard <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-800 transition-colors bg-green-50 px-3 py-2 rounded-lg">
            <Search className="w-3.5 h-3.5" /> Search Console <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-muted px-3 py-2 rounded-lg">
            sitemap.xml <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/robots.txt" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-muted px-3 py-2 rounded-lg">
            robots.txt <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
