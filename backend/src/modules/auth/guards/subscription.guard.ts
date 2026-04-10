import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user: { workspaceId: string };
    }>();
    const user = request.user;

    if (!user || !user.workspaceId) {
      return false;
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { workspaceId: user.workspaceId },
    });

    // Se não houver assinatura, assume que é um novo workspace (Libera teste inicial)
    if (!subscription) {
      return true;
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return true;
    }

    if (subscription.status === SubscriptionStatus.TRIAL) {
      const now = new Date();
      if (subscription.trialEndsAt && subscription.trialEndsAt > now) {
        return true;
      }
    }

    throw new ForbiddenException(
      'Sua assinatura expirou ou o período de teste de 10 dias terminou. Por favor, realize o pagamento no painel de faturamento para continuar.',
    );
  }
}
