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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const client_1 = require("@prisma/client");
let AppointmentsService = class AppointmentsService {
    prisma;
    notificationQueue;
    aiQueue;
    constructor(prisma, notificationQueue, aiQueue) {
        this.prisma = prisma;
        this.notificationQueue = notificationQueue;
        this.aiQueue = aiQueue;
    }
    async create(workspaceId, data) {
        const { startTime, endTime } = data;
        const conflict = await this.prisma.appointment.findFirst({
            where: {
                workspaceId,
                startTime: { lt: new Date(startTime) },
                endTime: { gt: new Date(endTime) },
                status: { not: client_1.AppointmentStatus.CANCELLED },
            },
        });
        if (conflict)
            throw new common_1.ConflictException('Horário já ocupado');
        const appointment = await this.prisma.appointment.create({
            data: {
                ...data,
                workspaceId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });
        await this.aiQueue.add('analyze-risk', { appointmentId: appointment.id });
        await this.notificationQueue.add('send-confirmation', {
            appointmentId: appointment.id,
        });
        return appointment;
    }
    async findAll(workspaceId) {
        return this.prisma.appointment.findMany({
            where: { workspaceId },
            include: { client: true },
            orderBy: { startTime: 'asc' },
        });
    }
    async findOne(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { client: true },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Agendamento não encontrado');
        return appointment;
    }
    async updateStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('notifications')),
    __param(2, (0, bullmq_1.InjectQueue)('ai-analysis')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map