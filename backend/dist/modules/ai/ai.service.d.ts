import { ConfigService } from '@nestjs/config';
export declare class AIService {
    private configService;
    private openai;
    private readonly logger;
    constructor(configService: ConfigService);
    predictNoShowRisk(appointment: unknown): Promise<number>;
    generateConfirmationMessage(type: 'WhatsApp' | 'Email', clientName: string, appointmentTime: string): Promise<string>;
    private heuristicRisk;
    private getDefaultMessage;
}
