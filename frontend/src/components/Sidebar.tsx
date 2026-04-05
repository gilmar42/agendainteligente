import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Settings, MessageSquare, CreditCard } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Agenda', href: '/dashboard/appointments' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clients' },
    { icon: MessageSquare, label: 'Mensagens', href: '/dashboard/messages' },
    { icon: CreditCard, label: 'Assinatura', href: '/dashboard/billing' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Agenda Flow
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-800/50 p-3 rounded-xl transition-all"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
