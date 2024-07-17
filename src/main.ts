import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Anew instance of nest is being created
  await app.listen(3000);
}
bootstrap();
