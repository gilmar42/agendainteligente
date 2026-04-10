import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AIService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AIService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey.trim() !== '') {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI inicializado com sucesso.');
    } else {
      this.logger.warn(
        'OPENAI_API_KEY não configurada. Usando lógica de fallback heurística.',
      );
    }
  }

  // ────────────────────────────────────────────────────────────
  //  AGENTE 2 — Predição de Risco de No-Show
  // ────────────────────────────────────────────────────────────
  async predictNoShowRisk(appointment: unknown): Promise<number> {
    if (!this.openai) return this.heuristicRisk(appointment);

    try {
      const app = appointment as Record<string, unknown>;
      const client = app.client as Record<string, unknown> | undefined;
      const clientName = (client?.name as string) || 'Desconhecido';
      const clientScore = (client?.score as number) ?? 100;
      const startTime = app.startTime as string;
      const status = app.status as string;
      const hour = startTime ? new Date(startTime).getHours() : 12;

      const prompt = `Analise o risco de não-comparecimento (No-Show) para este agendamento:
- Cliente: ${clientName}
- Pontuação de confiabilidade do cliente (0-100): ${clientScore}
- Horário marcado: ${new Date(startTime).toLocaleString('pt-BR')}
- Hora do dia: ${hour}h
- Status atual: ${status}
- Contexto: horários muito cedo (<9h) ou tarde (>17h) e clientes com pontuação baixa têm maior risco.

Retorne APENAS um número decimal entre 0 e 1 (ex: 0.73). Sem texto, sem explicação.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content?.trim();
      const parsed = parseFloat(content ?? '0.5');
      return isNaN(parsed) ? 0.5 : Math.min(Math.max(parsed, 0), 1);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      this.logger.error(`Erro ao predizer risco de no-show: ${msg}`);
      return this.heuristicRisk(appointment);
    }
  }

  // ────────────────────────────────────────────────────────────
  //  AGENTE 1 — Geração de Mensagem de Confirmação
  // ────────────────────────────────────────────────────────────
  async generateConfirmationMessage(
    type: 'WhatsApp' | 'Email',
    clientName: string,
    appointmentTime: string,
    workspaceName?: string,
  ): Promise<string> {
    if (!this.openai)
      return this.getDefaultMessage(type, clientName, appointmentTime, workspaceName);

    try {
      const clinic = workspaceName ? `da ${workspaceName}` : '';
      const prompt = `Gere uma mensagem de ${type} curta, amigável e profissional em Português (Brasil) para confirmar o agendamento de ${clientName} ${clinic} para o horário: ${new Date(appointmentTime).toLocaleString('pt-BR')}.
      
A mensagem deve:
- Ser breve (máx 3 linhas)
- Incluir um pedido de confirmação (ex: responda SIM ou NÃO)
- Ser calorosa e profissional
- NÃO incluir saudações como "Olá" isoladas no início

Retorne APENAS o texto da mensagem, sem aspas, sem formatação extra.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      return content || this.getDefaultMessage(type, clientName, appointmentTime, workspaceName);
    } catch {
      return this.getDefaultMessage(type, clientName, appointmentTime, workspaceName);
    }
  }

  // ────────────────────────────────────────────────────────────
  //  AGENTE 3 — Conversa Inteligente com Memória Multi-Turno
  // ────────────────────────────────────────────────────────────
  async processConversation(
    appointmentId: string,
    userMessage: string,
  ): Promise<string> {
    if (!this.openai) {
      return 'Nosso assistente de IA está temporariamente indisponível. Por favor, entre em contato pelo telefone para confirmar seu agendamento.';
    }

    // Busca o agendamento com contexto salvo
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true, workspace: true },
    });

    if (!appointment) return 'Agendamento não encontrado.';

    // ── Recupera histórico da conversa salvo no banco ──
    let history: ConversationTurn[] = [];
    try {
      if (appointment.aiContext) {
        history = JSON.parse(appointment.aiContext) as ConversationTurn[];
      }
    } catch {
      this.logger.warn(`aiContext inválido para agendamento ${appointmentId}. Resetando.`);
      history = [];
    }

    // Adiciona mensagem atual do usuário ao histórico
    history.push({ role: 'user', content: userMessage });

    // ── Ferramentas disponíveis para o agente ──
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'confirmar_agendamento',
          description: 'Confirma o agendamento atual do paciente/cliente.',
          parameters: { type: 'object', properties: {} },
        },
      },
      {
        type: 'function',
        function: {
          name: 'cancelar_agendamento',
          description: 'Cancela o agendamento atual do paciente/cliente.',
          parameters: { type: 'object', properties: {} },
        },
      },
      {
        type: 'function',
        function: {
          name: 'reagendar_agendamento',
          description: 'Reagenda o agendamento para uma nova data e hora.',
          parameters: {
            type: 'object',
            properties: {
              nova_data: { type: 'string', description: 'Data/hora ISO 8601 do novo horário' },
            },
            required: ['nova_data'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'buscar_horarios_disponiveis',
          description: 'Busca horários livres disponíveis para uma data específica.',
          parameters: {
            type: 'object',
            properties: {
              data: { type: 'string', description: 'Data no formato YYYY-MM-DD' },
            },
            required: ['data'],
          },
        },
      },
    ];

    // ── Monta array de mensagens com histórico completo ──
    const workspaceName = appointment.workspace?.name ?? 'nossa clínica';
    const systemPrompt = `Você é um assistente virtual inteligente e educado de ${workspaceName}.

Dados do agendamento atual:
- Paciente/Cliente: ${appointment.client.name}
- Horário marcado: ${new Date(appointment.startTime).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
- Status: ${this.translateStatus(appointment.status)}

Instruções:
- Responda em Português (Brasil), de forma educada, breve e calorosa
- Se o cliente disser SIM / confirmar / OK → use confirmar_agendamento
- Se o cliente NÃO puder comparecer → pergunte se quer cancelar ou reagendar
- Se quiser reagendar → busque horários disponíveis antes de reagendar
- Após reagendar → confirme o novo horário com o cliente
- Trate o cliente pelo primeiro nome`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools,
        tool_choice: 'auto',
        max_tokens: 300,
        temperature: 0.4,
      });

      const aiMessage = response.choices[0].message;
      let assistantResponse = '';

      // ── Processa chamadas de função ──
      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        for (const toolCall of aiMessage.tool_calls) {
          if (toolCall.type !== 'function') continue;
          const fnName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments) as Record<string, string>;

          if (fnName === 'confirmar_agendamento') {
            await this.prisma.appointment.update({
              where: { id: appointmentId },
              data: { status: AppointmentStatus.CONFIRMED, lastInteraction: new Date() },
            });
            assistantResponse = `Perfeito, ${appointment.client.name.split(' ')[0]}! ✅ Sua consulta está confirmada para ${new Date(appointment.startTime).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}. Te esperamos!`;
          }

          else if (fnName === 'cancelar_agendamento') {
            await this.prisma.appointment.update({
              where: { id: appointmentId },
              data: { status: AppointmentStatus.CANCELLED, lastInteraction: new Date() },
            });
            assistantResponse = `Entendido. Seu agendamento foi cancelado. Fica à vontade para agendar novamente quando quiser. 😊`;
          }

          else if (fnName === 'reagendar_agendamento') {
            const novaData = new Date(args.nova_data);
            await this.prisma.appointment.update({
              where: { id: appointmentId },
              data: {
                startTime: novaData,
                endTime: new Date(novaData.getTime() + 60 * 60 * 1000),
                status: AppointmentStatus.PENDING,
                lastInteraction: new Date(),
              },
            });
            assistantResponse = `Pronto! ✅ Reagendamos sua consulta para ${novaData.toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}. Você receberá uma nova confirmação. Alguma dúvida?`;
          }

          else if (fnName === 'buscar_horarios_disponiveis') {
            const dataStr = args.data;
            const startOfDay = new Date(dataStr);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(dataStr);
            endOfDay.setHours(23, 59, 59, 999);

            const occupied = await this.prisma.appointment.findMany({
              where: {
                workspaceId: appointment.workspaceId,
                startTime: { gte: startOfDay, lte: endOfDay },
                status: { not: AppointmentStatus.CANCELLED },
              },
              select: { startTime: true },
            });

            const busyHours = occupied.map(a => new Date(a.startTime).getHours());
            const allSlots = [8, 9, 10, 11, 14, 15, 16, 17];
            const freeHours = allSlots.filter(h => !busyHours.includes(h));

            if (freeHours.length === 0) {
              assistantResponse = `Infelizmente não temos horários disponíveis para ${new Date(dataStr).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}. Gostaria de tentar outro dia?`;
            } else {
              assistantResponse = `Para ${new Date(dataStr).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}, temos: ${freeHours.map(h => `${h}:00`).join(', ')}. Qual horário prefere?`;
            }
          }
        }
      } else {
        assistantResponse = aiMessage.content ?? 'Como posso te ajudar com seu agendamento?';
      }

      // ── Salva histórico atualizado no banco ──
      history.push({ role: 'assistant', content: assistantResponse });

      // Mantém apenas os últimos 20 turnos para não estourar o campo Text
      const trimmed = history.slice(-20);

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          aiContext: JSON.stringify(trimmed),
          lastInteraction: new Date(),
        },
      });

      return assistantResponse;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      this.logger.error(`Erro no processamento da conversa: ${msg}`);
      return 'Desculpe, tive um problema técnico momentâneo. Poderia repetir sua mensagem?';
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Helpers Privados
  // ────────────────────────────────────────────────────────────
  private heuristicRisk(appointment: unknown): number {
    const app = appointment as Record<string, unknown>;
    const client = app.client as Record<string, unknown> | undefined;
    const clientScore = (client?.score as number) ?? 100;
    const startTime = app.startTime as string;
    const hour = startTime ? new Date(startTime).getHours() : 12;

    let risk = 0.25; // base
    if (hour < 8 || hour > 17) risk += 0.25;
    if (clientScore < 60) risk += 0.3;
    else if (clientScore < 80) risk += 0.15;
    return Math.min(risk, 1);
  }

  private getDefaultMessage(
    type: string,
    name: string,
    time: string,
    workspace?: string,
  ): string {
    const clinic = workspace ? ` da ${workspace}` : '';
    const dt = new Date(time).toLocaleString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    });
    return `Olá ${name}! Lembramos seu agendamento${clinic} para ${dt}. Responda *SIM* para confirmar ou *NÃO* para cancelar/reagendar.`;
  }

  private translateStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Aguardando confirmação', CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado', COMPLETED: 'Concluído', NO_SHOW: 'Não compareceu',
    };
    return map[status] ?? status;
  }
}
