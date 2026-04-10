'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, Building2, ArrowRight,
  CheckCircle2, Loader2, Eye, EyeOff, Zap
} from 'lucide-react';

const benefits = [
  'IA confirma e reagenda automaticamente',
  'Reduz no-shows em até 70%',
  'Integrado ao seu WhatsApp',
  '10 dias grátis, sem cartão',
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep]        = useState(0); // 0 = form, 1 = success

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', workspaceName: ''
  });

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/auth/register`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar conta.');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setStep(1);
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative bg-gradient-to-br from-[#0a1628] to-[var(--bg-surface)] p-12 overflow-hidden">
        {/* Orbs */}
        <div className="absolute top-[-15%] left-[-15%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10 animate-fade-in">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">AgendaFlow</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Zap size={12} className="fill-current" />
              NOVA ERA DA AUTOMAÇÃO
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] animate-fade-in" style={{ animationDelay: '150ms' }}>
              Sua agenda,<br />
              <span className="gradient-text">no piloto automático.</span>
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] text-base leading-relaxed max-w-xs animate-fade-in" style={{ animationDelay: '200ms' }}>
              Agentes de IA que confirmam, relembram e reagendam seus clientes pelo WhatsApp — sem você precisar fazer nada.
            </p>
          </div>

          <ul className="space-y-3 stagger">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-sm text-[var(--text-secondary)] font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-sm bg-yellow-400/80" />
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
            &ldquo;Reduzi 68% das faltas nos primeiros 30 dias. É incrível como a IA conversa naturalmente com os pacientes.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-black text-white">C</div>
            <div>
              <p className="text-xs font-bold text-white">Dra. Carla Menezes</p>
              <p className="text-[10px] text-[var(--text-muted)]">Clínica OdontoVita</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black text-white">AgendaFlow</span>
        </div>

        <div className="w-full max-w-sm animate-scale-in">

          {step === 1 ? (
            /* ── SUCCESS STATE ── */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white">Conta criada! 🎉</h2>
              <p className="text-[var(--text-secondary)] text-sm">Redirecionando para o dashboard…</p>
              <div className="flex justify-center">
                <Loader2 size={20} className="text-blue-400 animate-spin" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Criar sua conta</h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1.5">Comece seu período de avaliação gratuito.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 font-semibold animate-scale-in text-center">
                    {error}
                  </div>
                )}

                {/* Nome */}
                <div>
                  <label className="label">Nome Completo</label>
                  <div className="input-group">
                    <User size={16} className="input-icon" />
                    <input
                      type="text" required autoFocus
                      value={formData.name}
                      onChange={handleChange('name')}
                      placeholder="Seu nome completo"
                      className="input"
                    />
                  </div>
                </div>

                {/* Workspace */}
                <div>
                  <label className="label">Nome da Clínica / Workspace</label>
                  <div className="input-group">
                    <Building2 size={16} className="input-icon" />
                    <input
                      type="text" required
                      value={formData.workspaceName}
                      onChange={handleChange('workspaceName')}
                      placeholder="Ex: Clínica Saúde+"
                      className="input"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="label">E-mail Profissional</label>
                  <div className="input-group">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={handleChange('email')}
                      placeholder="voce@clinica.com"
                      className="input"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label className="label">Senha</label>
                  <div className="input-group">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showPass ? 'text' : 'password'} required
                      value={formData.password}
                      onChange={handleChange('password')}
                      placeholder="Mínimo 8 caracteres"
                      className="input pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                      onClick={() => setShowPass(v => !v)}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5 rounded-xl text-sm mt-2 group"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Criar Minha Agenda
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[var(--text-muted)] pt-1">
                  Ao se cadastrar, você concorda com nossos termos de uso.
                </p>
              </form>

              <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
                Já tem conta?{' '}
                <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                  Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
