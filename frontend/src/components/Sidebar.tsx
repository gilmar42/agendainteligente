'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Agenda', href: '/dashboard/appointments' },
  { icon: Users, label: 'Clientes', href: '/dashboard/clients' },
  { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/messages' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#020617]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-none tracking-tighter">
              Agenda<span className="text-blue-500">Flow</span>
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-xs uppercase tracking-widest">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
