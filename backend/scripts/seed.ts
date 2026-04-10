import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log(
      'Nenhum usuário encontrado. Por favor, crie uma conta no formulário de registro primeiro.',
    );
    return;
  }

  const workspaceId = user.workspaceId;

  // Criar Cliente de Teste
  const client = await prisma.client.upsert({
    where: { phone: '5511999990001' },
    update: {},
    create: {
      name: 'Paciente de Teste',
      phone: '5511999990001',
      email: 'teste@exemplo.com',
      workspaceId,
      score: 85,
    },
  });

  // Criar Agendamento de Teste
  await prisma.appointment.create({
    data: {
      clientId: client.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      workspaceId,
      status: 'CONFIRMED',
      noShowRisk: 0.15,
    },
  });

  console.log('✅ Dados de teste inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
