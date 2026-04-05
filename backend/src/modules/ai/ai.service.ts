import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AIService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn(
        'OpenAI API Key not present, using heuristic for No-Show prediction',
      );
    }
  }

  async predictNoShowRisk(appointment: unknown): Promise<number> {
    if (!this.openai) {
      return this.heuristicRisk(appointment);
    }

    try {
      // Cast to Record<string, unknown> locally handles dynamic properties safely
      const app = appointment as Record<string, unknown>;
      const client = app.client as Record<string, unknown> | undefined;
      const clientName = (client?.name as string) || 'Unknown';
      const startTime = app.startTime as string;
      const status = app.status as string;

      const prompt = `Analyze the risk of No-Show for the following appointment:
      - Client: ${clientName}
      - Time: ${startTime}
      - History: ${status === 'CONFIRMED' ? 'Good' : 'Medium'}
      - Lead Time: Recently booked
      Return ONLY a number between 0 and 1, where 1 is high risk.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices[0]?.message?.content;
      return content ? parseFloat(content.trim()) : 0.5;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error predicting no-show risk: ${errorMsg}`);
      return 0.5;
    }
  }

  async generateConfirmationMessage(
    type: 'WhatsApp' | 'Email',
    clientName: string,
    appointmentTime: string,
  ): Promise<string> {
    if (!this.openai) {
      return this.getDefaultMessage(type, clientName, appointmentTime);
    }

    try {
      const prompt = `Generate a friendly and professional ${type} message to confirm an appointment for ${clientName} at ${appointmentTime}. 
      Keep it brief and include a call to action to confirm. Use Portuguese (Brazil).`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices[0]?.message?.content;
      return (
        content?.trim() ||
        this.getDefaultMessage(type, clientName, appointmentTime)
      );
    } catch (error) {
      return this.getDefaultMessage(type, clientName, appointmentTime);
    }
  }

  private heuristicRisk(appointment: unknown): number {
    let risk = 0.3;
    const app = appointment as Record<string, unknown>;
    const startTime = app.startTime as string;
    const hour = startTime ? new Date(startTime).getHours() : 12;
    if (hour < 9 || hour > 17) risk += 0.2;
    return Math.min(risk, 1);
  }

  private getDefaultMessage(type: string, name: string, time: string): string {
    return `Olá ${name}, confirmamos seu agendamento para ${time}. Por favor, responda OK para confirmar.`;
  }
}
