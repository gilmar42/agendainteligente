export const formatStatus = (status: string) => {
  const mapping: Record<string, string> = {
    'PENDING': 'Pendente',
    'CONFIRMED': 'Confirmado',
    'CANCELLED': 'Cancelado',
    'COMPLETED': 'Concluído',
    'NO_SHOW': 'Faltou',
  };
  return mapping[status] || status;
};

export const formatPlan = (plan: string) => {
  const mapping: Record<string, string> = {
    'FREE': 'Gratuito',
    'PRO': 'Profissional',
    'ENTERPRISE': 'Enterprise',
  };
  return mapping[plan] || plan;
};

export const formatRisk = (risk: number) => {
  if (risk > 0.7) return 'Alto';
  if (risk > 0.3) return 'Médio';
  return 'Baixo';
};
