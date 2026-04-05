import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private whatsappService;
    constructor(whatsappService: WhatsappService);
    createInstance(data: {
        instanceName: string;
    }): Promise<unknown>;
    sendMessage(data: {
        to: string;
        text: string;
    }): Promise<unknown>;
}
