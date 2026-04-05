import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AIService } from '../ai/ai.service';
export declare class NotificationProcessor extends WorkerHost {
    private prisma;
    private whatsappService;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, whatsappService: WhatsappService, aiService: AIService);
    process(job: Job<any>): Promise<any>;
}
