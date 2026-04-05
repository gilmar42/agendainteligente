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
var NotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const ai_service_1 = require("../ai/ai.service");
const client_1 = require("@prisma/client");
let NotificationProcessor = NotificationProcessor_1 = class NotificationProcessor extends bullmq_1.WorkerHost {
    prisma;
    whatsappService;
    aiService;
    logger = new common_1.Logger(NotificationProcessor_1.name);
    constructor(prisma, whatsappService, aiService) {
        super();
        this.prisma = prisma;
        this.whatsappService = whatsappService;
        this.aiService = aiService;
    }
    async process(job) {
        const { appointmentId } = job.data;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { client: true },
        });
        if (!appointment || !appointment.client) {
            this.logger.error(`Appointment ${appointmentId} not found or client missing`);
            return;
        }
        if (job.name === 'send-confirmation') {
            const message = await this.aiService.generateConfirmationMessage('WhatsApp', appointment.client.name, appointment.startTime.toISOString());
            await this.whatsappService.sendMessage(appointment.client.phone, message);
            await this.prisma.messageLog.create({
                data: {
                    appointmentId: appointment.id,
                    content: message,
                    type: client_1.MessageType.CONFIRMATION,
                    status: client_1.MessageStatus.SENT,
                },
            });
            this.logger.log(`Confirmation sent for appointment ${appointmentId}`);
        }
    }
};
exports.NotificationProcessor = NotificationProcessor;
exports.NotificationProcessor = NotificationProcessor = NotificationProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)('notifications'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService,
        ai_service_1.AIService])
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map