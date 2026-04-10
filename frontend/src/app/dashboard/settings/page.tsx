'use client';

import { useState, useEffect } from 'react';
import WhatsAppManager from '@/components/WhatsAppManager';
import { 
  Settings, 
  User, 
  Bell, 
  CreditCard, 
  ShieldCheck,
  Zap,
  Save,
  Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: Zap },
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Configurações</h1>
          <p className="text-slate-400 font-medium tracking-tight">Gerencie sua conta e integrações de IA.</p>
        </div>
        
        {activeTab !== 'whatsapp' && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className="premium-button flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saved ? 'Salvo!' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
               <div className="glass-card p-8 rounded-[2rem] border-blue-500/10">
                 <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Integração WhatsApp Business</h2>
                      <p className="text-slate-400 text-sm mt-1">Conecte sua conta para permitir que a IA envie lembretes e agende consultas.</p>
                    </div>
                 </div>
                 <WhatsAppManager />
               </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="glass-card p-8 rounded-[2rem] space-y-8">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-white/5 flex items-center justify-center text-slate-600 font-black text-2xl">
                    GD
                 </div>
                 <div>
                    <h3 className="text-white font-black text-lg">Gilmar Dutra</h3>
                    <p className="text-slate-500 text-sm italic">gilmar@exemplo.com</p>
                    <button className="text-blue-500 text-xs font-bold uppercase mt-2 hover:underline">Alterar Foto</button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input type="text" defaultValue="Gilmar Dutra" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 transition-all outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telefone Profissional</label>
                    <input type="text" defaultValue="(11) 99999-0000" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 transition-all outline-none" />
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-card p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
               <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Plano Profissional</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-black">ATIVO</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">R$ 149,90 <span className="text-sm text-slate-500">/ mês</span></h2>
                  </div>
                  <ShieldCheck size={48} className="text-blue-500/20" />
               </div>
               <div className="h-px bg-white/5 w-full" />
               <p className="text-slate-400 text-sm">Sua próxima renovação ocorre em <span className="text-white font-bold">15 de Abril de 2026</span>.</p>
               <button className="w-full py-4 border border-slate-800 hover:bg-white/[0.02] rounded-2xl text-slate-300 font-bold transition-all">Ver Faturas</button>
               
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
