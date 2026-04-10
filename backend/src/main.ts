import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
