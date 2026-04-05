"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AIAnalysisProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAnalysisProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let AIAnalysisProcessor = AIAnalysisProcessor_1 = class AIAnalysisProcessor extends bullmq_1.WorkerHost {
    prisma;
    aiService;
    logger = new common_1.Logger(AIAnalysisProcessor_1.name);
    constructor(prisma, aiService) {
        super();
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async process(job) {
        const { appointmentId } = job.data;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { client: true },
        });
        if (!appointment) {
            this.logger.error(`Appointment ${appointmentId} not found`);
            return;
        }
        if (job.name === 'analyze-risk') {
            const riskScore = await this.aiService.predictNoShowRisk(appointment);
            await this.prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    noShowRisk: riskScore,
                },
            });
            this.logger.log(`AI risk analysis completed for appointment ${appointmentId}: ${riskScore}`);
        }
    }
};
exports.AIAnalysisProcessor = AIAnalysisProcessor;
exports.AIAnalysisProcessor = AIAnalysisProcessor = AIAnalysisProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)('ai-analysis'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AIService])
], AIAnalysisProcessor);
//# sourceMappingURL=ai-analysis.processor.js.map