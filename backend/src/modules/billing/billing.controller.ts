import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly mpService: MercadoPagoService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('checkout')
  // async createCheckout(@Req() req: any, @Body('planType') planType: PlanType) {
  //   const workspaceId = req.user.workspaceId;
  //   const checkoutUrl = await this.mpService.createSubscription(
  //     workspaceId,
  //     planType,
  //   );
  //   return { url: checkoutUrl };
  // }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() data: any) {
    await this.mpService.handleWebhook(data);
    return { status: 'received' };
  }
}
