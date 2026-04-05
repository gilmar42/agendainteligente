import DashboardStats from '@/components/DashboardStats';
import { Calendar, Search, Plus, Filter } from 'lucide-react';

const appointments = [
  { id: '1', client: 'João Silva', time: '14:00', date: 'Hoje', status: 'CONFIRMADO', risk: 'Baixo' },
  { id: '2', client: 'Maria Oliveira', time: '15:30', date: 'Hoje', status: 'PENDENTE', risk: 'Médio' },
  { id: '3', client: 'Carlos Costa', time: '17:00', date: 'Amanhã', status: 'AGENDADO', risk: 'Alto' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Bom dia, Admin!</h2>
        <p className="text-slate-400">Você tem {appointments.length} agendamentos para hoje.</p>
      </div>

      <DashboardStats />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Calendar className="mr-2 text-blue-400" size={20} />
          Próximos Agendamentos
        </h3>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
            />
          </div>
          <button className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-all shadow-lg shadow-blue-600/20">
            <Plus size={18} className="mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-900 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex flex-col items-center justify-center border border-slate-700">
                <span className="text-xs font-bold text-blue-400">{apt.time}</span>
              </div>
              <div>
                <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{apt.client}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-slate-500">{apt.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.risk === 'Alto' ? 'bg-rose-500/10 text-rose-500' : 
                    apt.risk === 'Médio' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    Risco: {apt.risk}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                apt.status === 'CONFIRMADO' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {apt.status}
              </span>
              <button className="text-slate-500 hover:text-white transition-all">
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
