'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/auth/login`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'E-mail ou senha incorretos.');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-4 glow-blue">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Bem-vindo de volta</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1.5">Entre na sua conta AgendaFlow</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-[var(--radius-2xl)] p-7 shadow-2xl animate-scale-in" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 font-semibold text-center animate-scale-in">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label">E-mail</label>
              </div>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email" required autoFocus
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="voce@clinica.com"
                  className="input"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label">Senha</label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
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
              className="btn btn-primary w-full py-3.5 rounded-xl text-sm group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Acessar Painel
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center">
            <div className="flex-1 border-t border-[var(--border-subtle)]" />
            <span className="px-4 text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-widest">
              ou
            </span>
            <div className="flex-1 border-t border-[var(--border-subtle)]" />
          </div>

          {/* Stats / social proof */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { n: '500+', label: 'Clínicas' },
              { n: '70%',  label: 'Menos faltas' },
              { n: '24/7', label: 'Disponível' },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--bg-elevated)] rounded-xl p-3">
                <p className="text-sm font-black gradient-text-blue">{s.n}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Criar grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
