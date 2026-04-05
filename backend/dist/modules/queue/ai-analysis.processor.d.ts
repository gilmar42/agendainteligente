import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
export declare class AIAnalysisProcessor extends WorkerHost {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AIService);
    process(job: Job<any>): Promise<any>;
}
