'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  workspaceName: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao ler dados da sessão:', e);
      }
    }
  }, []);

  // Retornamos os dados apenas quando o componente estiver montado no navegador
  // Isso evita o erro de "cascading renders" e conflitos de hidratação
  return {
    user,
    mounted,
    userName: user?.name || 'Profissional',
    workspaceName: user?.workspaceName || 'Agenda Flow'
  };
}
