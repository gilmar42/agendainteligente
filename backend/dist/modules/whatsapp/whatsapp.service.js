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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let WhatsappService = WhatsappService_1 = class WhatsappService {
    configService;
    logger = new common_1.Logger(WhatsappService_1.name);
    apiUrl;
    apiToken;
    constructor(configService) {
        this.configService = configService;
        this.apiUrl = this.configService.get('EVOLUTION_API_URL') || '';
        this.apiToken = this.configService.get('EVOLUTION_API_TOKEN') || '';
    }
    async sendMessage(number, message) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/message/sendText/agenda-flow`, {
                number,
                options: { delay: 1200, presence: 'composing' },
                textMessage: { text: message },
            }, { headers: { apikey: this.apiToken } });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                this.logger.error(`Error sending WhatsApp message: ${error.message}`);
            }
            throw error;
        }
    }
    async createInstance(instanceName) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/instance/create`, { instanceName, token: this.apiToken, qrcode: true }, { headers: { apikey: this.apiToken } });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                this.logger.error(`Error creating instance: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map