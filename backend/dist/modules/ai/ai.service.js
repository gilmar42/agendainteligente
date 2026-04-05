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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AIService = AIService_1 = class AIService {
    configService;
    openai = null;
    logger = new common_1.Logger(AIService_1.name);
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
        }
        else {
            this.logger.warn('OpenAI API Key not present, using heuristic for No-Show prediction');
        }
    }
    async predictNoShowRisk(appointment) {
        if (!this.openai) {
            return this.heuristicRisk(appointment);
        }
        try {
            const app = appointment;
            const client = app.client;
            const clientName = client?.name || 'Unknown';
            const startTime = app.startTime;
            const status = app.status;
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
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Error predicting no-show risk: ${errorMsg}`);
            return 0.5;
        }
    }
    async generateConfirmationMessage(type, clientName, appointmentTime) {
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
            return (content?.trim() ||
                this.getDefaultMessage(type, clientName, appointmentTime));
        }
        catch (error) {
            return this.getDefaultMessage(type, clientName, appointmentTime);
        }
    }
    heuristicRisk(appointment) {
        let risk = 0.3;
        const app = appointment;
        const startTime = app.startTime;
        const hour = startTime ? new Date(startTime).getHours() : 12;
        if (hour < 9 || hour > 17)
            risk += 0.2;
        return Math.min(risk, 1);
    }
    getDefaultMessage(type, name, time) {
        return `Olá ${name}, confirmamos seu agendamento para ${time}. Por favor, responda OK para confirmar.`;
    }
};
exports.AIService = AIService;
exports.AIService = AIService = AIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map