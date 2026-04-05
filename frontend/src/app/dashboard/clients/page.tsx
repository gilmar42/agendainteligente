import { Users, Search, Plus, Mail, Phone, Calendar } from 'lucide-react';

const clients = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', lastAppointment: '2026-04-01', score: 85 },
  { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 98888-8888', lastAppointment: '2026-03-28', score: 92 },
  { id: '3', name: 'Carlos Costa', email: 'carlos@email.com', phone: '(11) 97777-7777', lastAppointment: '2026-03-15', score: 45 },
];

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Meus Clientes</h2>
          <p className="text-slate-400">Gerencie sua base de {clients.length} clientes.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-all shadow-lg shadow-blue-600/20">
          <Plus size={18} className="mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, email ou telefone..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
            />
          </div>
          <div className="flex space-x-2">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-all">Exportar CSV</button>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all">Filtros</button>
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="px-6 py-4 font-semibold">Cliente</th>
              <th className="px-6 py-4 font-semibold">Contato</th>
              <th className="px-6 py-4 font-semibold">Última Consulta</th>
              <th className="px-6 py-4 font-semibold">Score Fidelidade</th>
              <th className="px-6 py-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-800/30 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold border border-slate-700">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white transition-colors group-hover:text-blue-400">{client.name}</p>
                      <p className="text-xs text-slate-500">#{client.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-slate-400">
                      <Mail size={12} className="mr-2" /> {client.email}
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Phone size={12} className="mr-2" /> {client.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-300">
                    <Calendar size={14} className="mr-2 text-slate-500" />
                    {client.lastAppointment}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${client.score > 70 ? 'bg-emerald-400' : client.score > 40 ? 'bg-yellow-400' : 'bg-rose-500'}`} 
                      style={{ width: `${client.score}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">{client.score}% de Score</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-all">Ver Perfil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
