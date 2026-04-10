'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://127.0.0.1:3001/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Erro ao buscar stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const items = [
    { 
      label: 'Total Agendamentos', 
      value: stats?.total || 0, 
      icon: Users, 
      color: 'blue',
      trend: '+12%',
      isUp: true
    },
    { 
      label: 'Confirmados', 
      value: stats?.confirmed || 0, 
      icon: CheckCircle2, 
      color: 'emerald',
      trend: '+8%',
      isUp: true
    },
    { 
      label: 'No-Shows Evitados', 
      value: stats?.avoided || 0, 
      icon: AlertCircle, 
      color: 'amber',
      trend: stats?.avoided > 0 ? '+24%' : '0%',
      isUp: true
    },
    { 
      label: 'Cancelamentos', 
      value: stats?.cancelled || 0, 
      icon: XCircle, 
      color: 'rose',
      trend: '-3%',
      isUp: false
    },
  ];

  const colorVariants: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card h-40 rounded-[2rem] flex items-center justify-center animate-pulse">
            <Loader2 className="animate-spin text-slate-800" size={24} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, i) => {
        const Icon = stat.icon;
        const colorClass = colorVariants[stat.color] || colorVariants.blue;

        return (
          <div 
            key={stat.label} 
            className="glass-card p-6 rounded-[2rem] relative overflow-hidden group animate-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${colorClass}`}>
                <Icon size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isUp ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'}`}>
                {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{stat.trend}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
            </div>
            
            <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-[60px] rounded-full bg-blue-500 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
