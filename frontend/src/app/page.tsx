import Navbar from '@/components/Navbar';
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 animate-fade-in">
            <Zap size={14} className="fill-current" />
            NOVA ERA DA AUTOMAÇÃO DE AGENDAS
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
            Deixe a IA gerenciar sua <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              agenda e reduzir as faltas.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
            Agentes autônomos que confirmam, reagendam e negociam horários diretamente no WhatsApp da sua clínica ou escritório.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95"
            >
              Começar Teste de 10 Dias
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="#pricing"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all"
            >
              Ver Planos
            </Link>
          </div>

          <div className="mt-20 relative px-4 lg:px-0">
            <div className="aspect-[16/9] max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-white/5 shadow-2xl shadow-blue-500/10 p-2 overflow-hidden">
               <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5">
                  <div className="flex flex-col items-center gap-4">
                     <Bot size={64} className="text-blue-500 animate-pulse" />
                     <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Interface do Sistema</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black mb-4">Seus novos funcionários digitais.</h2>
            <p className="text-slate-400">Três agentes especializados trabalhando 24/7 para você.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Agente de Confirmação</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interpreta respostas naturais do WhatsApp e confirma agendamentos automaticamente no sistema.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl group hover:border-blue-500/50 transition-all shadow-xl shadow-blue-500/5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Agente de No-Show</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Identifica riscos de falta e envia lembretes estratégicos para garantir a presença do seu cliente.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl group hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Agente de Reagendamento</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Negocia novos horários baseados na sua disponibilidade se o cliente não puder comparecer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4">Planos Transparentes.</h2>
            <p className="text-slate-400">Escolha o plano ideal para o seu negócio. Teste por 10 dias grátis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="p-10 bg-slate-900 border border-white/5 rounded-[40px] text-left hover:border-white/20 transition-all">
              <p className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-widest">Plano Mensal</p>
              <div className="mb-8">
                <span className="text-5xl font-black">R$ 50</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-emerald-500" /> Agentes de IA Ilimitados</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-emerald-500" /> Integração Evolution API</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-emerald-500" /> Dashboard de Performance</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-emerald-500" /> 10 Dias de Teste Grátis</li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-bold transition-all">
                Iniciar Teste Grátis
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] text-left shadow-2xl shadow-blue-500/20 relative group">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-yellow-400 text-blue-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star size={10} className="fill-current" />
                MAIS POPULAR
              </div>
              <p className="text-sm font-bold text-blue-100 mb-2 uppercase tracking-widest">Plano Anual</p>
              <div className="mb-8">
                <span className="text-5xl font-black">R$ 550</span>
                <span className="text-blue-100">/ano</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm text-blue-50"><ShieldCheck size={18} className="text-white" /> Todos os recursos Mensais</li>
                <li className="flex items-center gap-3 text-sm text-blue-50"><ShieldCheck size={18} className="text-white" /> Economia de 1 mensalidade</li>
                <li className="flex items-center gap-3 text-sm text-blue-50"><ShieldCheck size={18} className="text-white" /> Suporte Prioritário</li>
                <li className="flex items-center gap-3 text-sm text-blue-50"><ShieldCheck size={18} className="text-white" /> 10 Dias de Teste Grátis</li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-white text-blue-600 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">Agenda Flow</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Agenda Flow. Inteligência que transforma sua clínica.</p>
        </div>
      </footer>
    </div>
  );
}
