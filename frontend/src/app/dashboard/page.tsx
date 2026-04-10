'use client';

import { useState, useEffect } from 'react';
import DashboardStats from '@/components/DashboardStats';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Filter, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Appointment {
  id: string;
  startTime: string;
  status: string;
  noShowRisk: string;
  client: {
    name: string;
    phone: string;
  };
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const h = new Date().getHours();
  let saudacao = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://127.0.0.1:3001/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Falha ao carregar agendamentos');
        
        const data = await res.json();
        setAppointments(data);
      } catch (err: any) {
        console.error('DEBUG: Conexão recusada na porta 3001. Erro:', err);
        setError(`Erro de Conexão: ${err.message}. Verifique se o backend está rodando na porta 3001.`);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-10 animate-in">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Painel em Tempo Real</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {saudacao}, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Gilmar!</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-tight">
            Você tem <span className="text-white">{appointments.length} agendamentos</span> registrados.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="premium-button flex items-center gap-2 text-sm">
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats Cards - Agora dinâmicos */}
      <DashboardStats />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              Próximos Agendamentos
              <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {appointments.length}
              </span>
            </h2>
          </div>

          <div className="glass-card rounded-[2rem] overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Sincronizando dados...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32 text-rose-400 space-y-2">
                <AlertCircle size={40} />
                <p className="font-bold">Erro ao carregar</p>
                <p className="text-xs text-rose-400/60">{error}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-32 text-center flex flex-col items-center justify-center space-y-4">
                 <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700">
                    <CalendarIcon size={32} />
                 </div>
                 <h3 className="text-white font-bold">Nenhum agendamento encontrado</h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data / Hora</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Risco No-Show</td>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="group hover:bg-white/[0.01] transition-all cursor-pointer">
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                              {apt.client.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium italic">{apt.client.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-slate-300 font-medium">
                            {new Date(apt.startTime).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">
                            {new Date(apt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            apt.noShowRisk === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                            apt.noShowRisk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {apt.noShowRisk || 'LOW'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* AI Side Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white">Gestor de Conexão</h2>
          <div className="glass-card p-8 rounded-[2rem] text-center space-y-6 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
              </div>
              <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">WhatsApp Ativo</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">Sincronizado com Evolution API. IA pronta para responder.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
