import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Agendamentos', value: '124', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Confirmados', value: '102', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'No-Shows Evitados', value: '12', icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Cancelados', value: '10', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mês Atual</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
