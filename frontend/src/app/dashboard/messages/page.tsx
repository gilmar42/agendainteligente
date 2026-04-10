import { MessageSquare, Bot, User, CheckCircle2, Calendar, Reply, Search, Filter } from 'lucide-react';

const conversations = [
  { id: '1', client: 'João Silva', lastMessage: 'Confirmado, estarei aí no horário!', time: '10:30', status: 'CONFIRMADO_PELA_IA', agentAction: 'Confirmação Automática' },
  { id: '2', client: 'Maria Oliveira', lastMessage: 'Poderia ser às 16:00?', time: '09:45', status: 'EM_NEGOCIACAO', agentAction: 'Reagendamento Sugerido' },
  { id: '3', client: 'Carlos Costa', lastMessage: 'Não vou conseguir ir hoje.', time: 'Ontem', status: 'CANCELADO_PELA_IA', agentAction: 'Cancelamento Processado' },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Central de Mensagens</h2>
        <p className="text-slate-400">Acompanhe as interações dos seus agentes de IA com os clientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-slate-800 space-y-4">
             <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar conversa..." 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-[10px] uppercase font-bold py-1 px-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">Todas</button>
              <button className="flex-1 text-[10px] uppercase font-bold py-1 px-2 rounded-lg bg-slate-800/50 text-slate-500 border border-transparent hover:text-slate-300">Pendentes</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {conversations.map((conv) => (
              <div key={conv.id} className="p-4 hover:bg-white/[0.03] cursor-pointer transition-colors group relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{conv.client}</span>
                  <span className="text-[10px] text-slate-500">{conv.time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{conv.lastMessage}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                    conv.status === 'CONFIRMADO_PELA_IA' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    conv.status === 'EM_NEGOCIACAO' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {conv.agentAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
          <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">JS</div>
              <div>
                <h4 className="font-bold text-white leading-none">João Silva</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  IA Ativa no Agendamento de Hoje 14:00
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-500 hover:text-white bg-slate-900/50 rounded-lg border border-slate-800 transition-all"><Reply size={16} /></button>
              <button className="p-2 text-slate-500 hover:text-white bg-slate-900/50 rounded-lg border border-slate-800 transition-all"><Filter size={16} /></button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-start items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-blue-400" /></div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl rounded-tl-none">
                <p className="text-sm text-slate-200 leading-relaxed text-left">Olá João! Notamos que seu agendamento para hoje às 14:00 está próximo. Poderia confirmar se conseguirá comparecer?</p>
                <span className="text-[9px] text-slate-500 mt-2 block">Agente No-Show • 10:25</span>
              </div>
            </div>

            <div className="flex justify-end items-start gap-3 ml-auto max-w-[80%]">
              <div className="bg-blue-600/20 border border-blue-500/20 p-4 rounded-2xl rounded-tr-none">
                <p className="text-sm text-slate-200 leading-relaxed text-left">Confirmado, estarei aí no horário!</p>
                <span className="text-[9px] text-blue-400/60 mt-2 block text-right text-right">Lido • 10:30</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">JS</div>
            </div>

            <div className="flex justify-start items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-emerald-400" /></div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl rounded-tl-none ring-1 ring-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                   <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} />
                    Ação Executada: Confirmar Agendamento
                  </div>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed text-left">Ótimo, João! Seu agendamento foi confirmado com sucesso. Estaremos te esperando cuidadosamente no horário combinado!</p>
                <span className="text-[9px] text-emerald-500/60 mt-2 block">Agente de Confirmação • 10:30</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-slate-800/50">
             <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Assumir conversa e responder..." 
                className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-left"
              />
              <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl border border-slate-700 transition-all">
                <Reply size={18} className="transform rotate-180" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 text-center">Intervenção manual desativa temporariamente o agente de IA para esta conversa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
