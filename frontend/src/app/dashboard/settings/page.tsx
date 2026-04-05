import { Settings, MessageSquare, BrainCircuit, Globe, Bell, Lock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Configurações</h2>
        <p className="text-slate-400">Gerencie as preferências da sua clínica e integrações.</p>
      </div>

      <div className="grid gap-6">
        {/* WhatsApp Integration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Integração WhatsApp</h3>
              <p className="text-sm text-slate-500">Conecte sua instância da Evolution API.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status da Conexão</label>
              <div className="flex items-center space-x-2 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium">Conectado (Instância: default)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-xl transition-all text-sm">Gerar QR Code</button>
              <button className="border border-slate-800 text-slate-400 hover:text-white py-2 rounded-xl transition-all text-sm">Desconectar</button>
            </div>
          </div>
        </div>

        {/* AI & Automation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-400/10 text-blue-400">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Inteligência Artificial</h3>
              <p className="text-sm text-slate-500">Configurações de predição de No-Show e mensagens automáticas.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <p className="text-sm font-bold text-white">Predição Automática</p>
                <p className="text-xs text-slate-500">Ativar IA para analisar risco de falta em cada agendamento.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl opacity-50">
              <div>
                <p className="text-sm font-bold text-white">Recuperação de No-Show</p>
                <p className="text-xs text-slate-500">Enviar mensagens personalizadas para clientes que faltaram.</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-not-allowed">
                <div className="w-4 h-4 bg-slate-600 rounded-full absolute left-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dados da Clínica</h3>
              <p className="text-sm text-slate-500">Informações gerais e visibilidade.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Nome da Clínica</label>
                <input 
                  type="text" 
                  defaultValue="Minha Clínica Agenda Flow" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Horário de Funcionamento</label>
                <input 
                  type="text" 
                  defaultValue="08:00 - 18:00" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Subdomínio</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    defaultValue="minha-clinica" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-l-xl p-3 text-sm text-white focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <span className="bg-slate-800 px-3 py-3 rounded-r-xl border border-slate-800 border-l-0 text-slate-500 text-xs">.agendaflow.ai</span>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
