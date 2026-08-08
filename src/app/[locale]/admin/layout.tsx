import { ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { LayoutDashboard, Utensils, Store, Users, Target, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import { AdminGate } from '@/components/admin/AdminGate';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { name: 'Yfirlit', href: '/admin', icon: LayoutDashboard },
    { name: 'Uppskriftir', href: '/admin/uppskriftir', icon: Utensils },
    { name: 'Veitingastaðir', href: '/admin/stadir', icon: Store },
    { name: 'Notendur', href: '/admin/notendur', icon: Users },
    { name: 'Auglýsingar', href: '/admin/auglysingar', icon: Target },
    { name: 'Tölfræði', href: '/admin/tolfraedi', icon: BarChart3 },
    { name: 'Kerfi', href: '/admin/kerfi', icon: Settings },
  ];

  return (
    <AdminGate>
    <div className="h-[calc(100vh-64px)] bg-(--color-bg-light) flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-(--color-border) shrink-0 hidden md:flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-(--color-border)">
          <Link href="/" className="flex items-center text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-(--color-brand) transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Vefur
          </Link>
          <h2 className="text-2xl font-black text-(--color-text-primary) tracking-tight">
            Stjórn<span className="text-(--color-brand)">borð</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
             const Icon = item.icon;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 className="flex items-center px-4 py-3 text-(--color-text-secondary) hover:bg-gray-50 hover:text-(--color-brand) rounded-xl transition-all font-semibold group border border-transparent hover:border-gray-100 hover:shadow-sm"
               >
                 <Icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-(--color-brand) transition-colors" />
                 {item.name}
               </Link>
             );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Nav Header */}
        <header className="md:hidden bg-white border-b border-(--color-border) py-3 px-4 flex justify-between items-center z-20 shadow-sm overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold text-(--color-text-primary) border border-gray-100">
                  <Icon className="w-4 h-4 mr-2 text-(--color-brand)" /> {item.name}
                </Link>
              )
            })}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
    </AdminGate>
  );
}
