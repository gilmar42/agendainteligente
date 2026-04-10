'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { 
  MessageSquare, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  QrCode, 
  Smartphone, 
  AlertCircle,
  Clock
} from 'lucide-react';

type ConnectionState = 'open' | 'connecting' | 'disconnected' | 'loading' | 'close' | 'refused';

export default function WhatsAppManager() {
  const [status, setStatus] = useState<ConnectionState>('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPairingForm, setShowPairingForm] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/whatsapp/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      const state = data.state?.toLowerCase() as ConnectionState;
      setStatus(state || 'disconnected');
      
      // Se conectar, limpa os códigos
      if (state === 'open') {
        setQrCode(null);
        setPairingCode(null);
      }
    } catch {
      console.error('Erro ao buscar status do WhatsApp');
      setStatus('disconnected');
    }
  };

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    setPairingCode(null);
    setShowPairingForm(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/whatsapp/qrcode`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.base64) {
        setQrCode(data.base64);
      } else {
        throw new Error('QR Code não disponível no momento. Tente atualizar o status.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Falha ao gerar QR Code.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const generatePairingCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Por favor, informe um número válido com DDD.');
      return;
    }
    setLoading(true);
    setError(null);
    setQrCode(null);
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/whatsapp/qrcode?number=${cleanNumber}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
      } else {
        throw new Error('Não foi possível gerar o código de pareamento.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro de conexão.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Deseja realmente desconectar este aparelho?')) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}/whatsapp/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setQrCode(null);
      setPairingCode(null);
      await fetchStatus();
    } catch {
      setError('Erro ao desconectar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Polling mais rápido durante conexão
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">WhatsApp Business</h3>
            <p className="text-sm text-slate-500">Gestão de mensagens e notificações.</p>
          </div>
        </div>
        <button 
          onClick={fetchStatus}
          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <RefreshCw size={18} className={status === 'loading' ? 'animate-spin text-blue-400' : 'text-slate-400'} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Status Display */}
        <div className={`p-5 border rounded-2xl flex items-center justify-between transition-all ${
          status === 'open' ? 'bg-emerald-500/5 border-emerald-500/20' : 
          status === 'connecting' ? 'bg-blue-500/5 border-blue-500/20' : 
          'bg-slate-950 border-slate-800'
        }`}>
          <div>
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Conexão Atual</span>
            <div className="flex items-center space-x-3">
              {status === 'open' ? (
                <div className="flex items-center text-emerald-400 font-black text-sm uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  Conectado e Ativo
                </div>
              ) : status === 'connecting' ? (
                <div className="flex items-center text-blue-400 font-black text-sm uppercase">
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sincronizando...
                </div>
              ) : (
                <div className="flex items-center text-slate-500 font-black text-sm uppercase">
                  <XCircle size={16} className="mr-2" />
                  Aparelho Desconectado
                </div>
              )}
            </div>
          </div>
          {status === 'open' && (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-xl border border-red-500/20 transition-all flex items-center gap-2"
            >
              <LogOut size={14} />
              SAIR
            </button>
          )}
        </div>

        {/* Action Area */}
        {status !== 'open' && !qrCode && !pairingCode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={generateQRCode}
              disabled={loading}
              className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all group"
            >
              <QrCode size={32} className="mb-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-bold text-white mb-1">Escaneando QR</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">O método tradicional</span>
            </button>

            <button 
              onClick={() => setShowPairingForm(!showPairingForm)}
              className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
            >
              <Smartphone size={32} className="mb-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              <span className="text-sm font-bold text-white mb-1">Código de Texto</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Mais fácil de parear</span>
            </button>
          </div>
        )}

        {/* Pairing Code Form */}
        {showPairingForm && !pairingCode && status !== 'open' && (
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
            <h4 className="text-sm font-bold text-white">Configurar Pareamento por Texto</h4>
            <p className="text-xs text-slate-500">Informe seu número completo com DDD (ex: 11999998888)</p>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Ex: 5511999990000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button 
                onClick={generatePairingCode}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'RECEBER CÓDIGO'}
              </button>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {qrCode && status !== 'open' && (
          <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-3xl animate-in zoom-in duration-300">
            <h3 className="text-slate-900 font-black text-lg">Escanear Conexão</h3>
            <div className="p-2 bg-white border-4 border-slate-100 rounded-2xl shadow-xl">
              <NextImage 
                src={qrCode} 
                alt="WhatsApp QR Code" 
                width={256} 
                height={256} 
                unoptimized 
                className="w-64 h-64"
              />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-slate-800 text-xs font-bold uppercase tracking-tight">Abra o WhatsApp no seu celular</p>
              <p className="text-slate-500 text-[11px]">Vá em Configurações {'>'} Aparelhos Conectados {'>'} Conectar Aparelho</p>
            </div>
            <button 
              onClick={() => setQrCode(null)}
              className="px-6 py-2 border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cancelar e Voltar
            </button>
          </div>
        )}

        {/* Pairing Code Display */}
        {pairingCode && status !== 'open' && (
          <div className="flex flex-col items-center space-y-6 p-8 bg-slate-950 border border-emerald-500/30 rounded-3xl animate-in zoom-in">
            <Smartphone size={48} className="text-emerald-400 mb-2" />
            <h3 className="text-white font-black text-center">Seu Código de Pareamento</h3>
            <div className="flex gap-2">
              {pairingCode.split('').map((char, i) => (
                <div key={i} className="w-10 h-14 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-2xl font-black text-emerald-400 shadow-lg">
                  {char}
                </div>
              ))}
            </div>
            <div className="space-y-3 text-center max-w-[280px]">
              <p className="text-slate-400 text-xs leading-relaxed">
                No WhatsApp, escolha <span className="text-white font-bold">&quot;Conectar com o número de telefone&quot;</span> e digite este código.
              </p>
            </div>
            <button 
              onClick={() => setPairingCode(null)}
              className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              CANCELAR
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 animate-in shake duration-500">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="p-4 bg-slate-800/30 rounded-xl flex items-start gap-3">
          <Clock size={16} className="text-slate-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-500 leading-normal">
            <strong>Dica:</strong> Se o código expirar ou o status travar em &quot;Sincronizando&quot;, tente atualizar a página ou clicar no ícone de sincronizar no topo.
          </p>
        </div>
      </div>
    </div>
  );
}
