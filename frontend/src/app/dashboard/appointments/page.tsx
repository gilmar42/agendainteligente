'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Search, Plus, Filter, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import { formatStatus, formatRisk } from '@/hooks/useFormat';

interface Appointment {
  id: string;
  client: {
    name: string;
    phone: string;
  };
  startTime: string;
  status: string;
  noShowRisk: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:3001/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Falha ao carregar agendamentos');
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateLabel = () => {
    return new Date().toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 flex items-center gap-3">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Agenda</h2>
          <p className="text-slate-400">Gerencie seus compromissos e acompanhe a IA.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center transition-all shadow-lg shadow-blue-600/20 w-fit">
          <Plus size={20} className="mr-2" />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou telefone..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
          />
        </div>
        <button className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
          <Filter size={18} />
          Filtros Avançados
        </button>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-blue-400" size={20} />
            <h3 className="font-bold text-white text-lg">Próximos Compromissos</h3>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest capitalize">{formatDateLabel()}</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Nenhum agendamento encontrado para hoje.
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center">
                    <Clock size={16} className="text-blue-400 mb-1" />
                    <span className="text-xs font-bold text-white">{formatTime(apt.startTime)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-500" />
                      <p className="font-bold text-white text-lg">{apt.client.name}</p>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{apt.client.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Risco: {formatRisk(apt.noShowRisk)}</p>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          apt.noShowRisk > 0.7 ? 'bg-rose-500' : apt.noShowRisk > 0.3 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${apt.noShowRisk * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                    apt.status === 'CONFIRMED' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span className="text-xs font-bold uppercase tracking-wide">{formatStatus(apt.status)}</span>
                  </div>

                  {apt.noShowRisk > 0.7 && (
                    <div className="group relative">
                      <AlertCircle className="text-rose-500 cursor-help" size={20} />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
                        {apt.noShowRisk > 0.9 ? 'Risco crítico detectado pela IA.' : 'Alto risco detectado.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
