import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [MercadoPagoService],
  controllers: [BillingController],
  exports: [MercadoPagoService],
})
export class BillingModule {}
