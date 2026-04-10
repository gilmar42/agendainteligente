import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { PrismaService } from '../../prisma/prisma.service';
import { PlanType, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class MercadoPagoService {
  private readonly client: MercadoPagoConfig;
  private readonly logger = new Logger(MercadoPagoService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );
    this.client = new MercadoPagoConfig({
      accessToken: accessToken || 'TEST-TOKEN',
    });
  }

  async createSubscription(
    workspaceId: string,
    planType: PlanType,
  ): Promise<string> {
    const preApproval = new PreApproval(this.client);

    const amount = planType === PlanType.ANNUAL ? 550 : 50;
    const frequency = 1;
    const frequencyType = 'months';

    try {
      const response = await preApproval.create({
        body: {
          back_url: `${this.configService.get<string>('APP_URL')}/dashboard/billing/success`,
          reason: `Agenda Inteligente - Plano ${planType === PlanType.ANNUAL ? 'Anual' : 'Mensal'}`,
          auto_recurring: {
            frequency,
            frequency_type: frequencyType,
            transaction_amount: amount,
            currency_id: 'BRL',
            free_trial: {
              frequency: 10,
              frequency_type: 'days',
            },
          } as any,
          payer_email: 'test_user_123@testuser.com', // Substituir pelo real
          status: 'pending',
        },
      });

      await this.prisma.subscription.upsert({
        where: { workspaceId },
        update: {
          externalId: response.id,
          planType,
          status: SubscriptionStatus.TRIAL,
          trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        create: {
          workspaceId,
          externalId: response.id!,
          planType,
          status: SubscriptionStatus.TRIAL,
          trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
      });

      return response.init_point!;
    } catch (error: any) {
      this.logger.error(
        `Erro ao criar assinatura no Mercado Pago: ${error.message as string}`,
      );
      throw error;
    }
  }

  async handleWebhook(data: any): Promise<void> {
    const { action, data: eventData } = data;

    if (action === 'created' || action === 'updated') {
      const preApproval = new PreApproval(this.client);
      const subscription = await preApproval.get({ id: eventData.id });

      if (subscription.status === 'authorized') {
        await this.prisma.subscription.update({
          where: { externalId: subscription.id },
          data: { status: SubscriptionStatus.ACTIVE },
        });
        this.logger.log(`Assinatura ${subscription.id as string} ativada.`);
      }
    }
  }
}
