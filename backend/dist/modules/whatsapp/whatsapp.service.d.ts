import { ConfigService } from '@nestjs/config';
export declare class WhatsappService {
    private configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiToken;
    constructor(configService: ConfigService);
    sendMessage(number: string, message: string): Promise<unknown>;
    createInstance(instanceName: string): Promise<unknown>;
}
